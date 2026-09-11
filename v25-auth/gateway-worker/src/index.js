import { DurableObject } from 'cloudflare:workers';

const GITHUB_ISSUER = 'https://token.actions.githubusercontent.com';
const GITHUB_DISCOVERY = `${GITHUB_ISSUER}/.well-known/openid-configuration`;
const PURPOSE_ALLOWLIST = new Set(['generate-scene-assets']);
const te = new TextEncoder();

let oidcMetadataCache = null;
let jwksCache = null;
let oidcCacheExpiresAt = 0;

const json = (body, status = 200, headers = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...headers,
    },
  });

const html = (body, status = 200) =>
  new Response(body, {
    status,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      'referrer-policy': 'no-referrer',
      'x-content-type-options': 'nosniff',
      'x-frame-options': 'DENY',
      'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
    },
  });

const b64url = (bytes) => {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

const b64urlJson = (value) => b64url(te.encode(JSON.stringify(value)));

const decodeB64url = (value) => {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((value.length + 3) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
};

const decodeJwtPart = (value) => JSON.parse(new TextDecoder().decode(decodeB64url(value)));

const sha256 = async (value) => b64url(new Uint8Array(await crypto.subtle.digest('SHA-256', te.encode(value))));

const safeEqual = (a, b) => {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

async function getOidcMetadata() {
  if (oidcMetadataCache && jwksCache && Date.now() < oidcCacheExpiresAt) {
    return { metadata: oidcMetadataCache, jwks: jwksCache };
  }

  const metadataResponse = await fetch(GITHUB_DISCOVERY, { headers: { accept: 'application/json' } });
  if (!metadataResponse.ok) throw new Error(`GitHub OIDC discovery failed (${metadataResponse.status})`);
  const metadata = await metadataResponse.json();
  if (metadata.issuer !== GITHUB_ISSUER || !metadata.jwks_uri) throw new Error('Unexpected GitHub OIDC metadata');

  const jwksResponse = await fetch(metadata.jwks_uri, { headers: { accept: 'application/json' } });
  if (!jwksResponse.ok) throw new Error(`GitHub OIDC JWKS failed (${jwksResponse.status})`);
  const jwks = await jwksResponse.json();
  if (!Array.isArray(jwks.keys)) throw new Error('GitHub OIDC JWKS is invalid');

  oidcMetadataCache = metadata;
  jwksCache = jwks;
  oidcCacheExpiresAt = Date.now() + 5 * 60 * 1000;
  return { metadata, jwks };
}

async function verifyGithubOidc(request, env) {
  const auth = request.headers.get('authorization') ?? '';
  if (!auth.startsWith('Bearer ')) throw new HttpError(401, 'missing_github_oidc_token');
  const token = auth.slice(7);
  const parts = token.split('.');
  if (parts.length !== 3) throw new HttpError(401, 'invalid_github_oidc_token');

  const header = decodeJwtPart(parts[0]);
  const payload = decodeJwtPart(parts[1]);
  if (header.alg !== 'RS256' || !header.kid) throw new HttpError(401, 'unsupported_github_oidc_signature');

  const { jwks } = await getOidcMetadata();
  const jwk = jwks.keys.find((key) => key.kid === header.kid && key.kty === 'RSA');
  if (!jwk) throw new HttpError(401, 'github_oidc_signing_key_not_found');

  const key = await crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify'],
  );
  const verified = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    key,
    decodeB64url(parts[2]),
    te.encode(`${parts[0]}.${parts[1]}`),
  );
  if (!verified) throw new HttpError(401, 'github_oidc_signature_invalid');

  const now = Math.floor(Date.now() / 1000);
  const aud = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (payload.iss !== GITHUB_ISSUER) throw new HttpError(401, 'github_oidc_issuer_invalid');
  if (!aud.includes(env.OIDC_AUDIENCE)) throw new HttpError(401, 'github_oidc_audience_invalid');
  if (!payload.exp || payload.exp <= now) throw new HttpError(401, 'github_oidc_expired');
  if (payload.nbf && payload.nbf > now + 30) throw new HttpError(401, 'github_oidc_not_yet_valid');
  if (payload.iat && payload.iat > now + 30) throw new HttpError(401, 'github_oidc_issued_in_future');

  const expected = {
    repository: env.EXPECTED_REPOSITORY,
    repository_id: env.EXPECTED_REPOSITORY_ID,
    actor: env.EXPECTED_ACTOR,
    actor_id: env.EXPECTED_ACTOR_ID,
    ref: env.EXPECTED_REF,
    workflow_ref: env.EXPECTED_WORKFLOW_REF,
  };
  for (const [claim, value] of Object.entries(expected)) {
    if (String(payload[claim] ?? '') !== String(value)) {
      throw new HttpError(403, `github_oidc_claim_mismatch:${claim}`);
    }
  }
  if (payload.event_name !== 'workflow_dispatch') throw new HttpError(403, 'github_oidc_event_not_allowed');
  return payload;
}

function validateContext(body, claims, env) {
  if (!body || typeof body !== 'object') throw new HttpError(400, 'invalid_request_body');
  if (body.auth_version !== 1) throw new HttpError(400, 'unsupported_auth_version');
  if (body.repository !== env.EXPECTED_REPOSITORY) throw new HttpError(403, 'repository_not_allowed');
  if (body.ref !== env.EXPECTED_REF) throw new HttpError(403, 'ref_not_allowed');
  if (body.actor !== env.EXPECTED_ACTOR) throw new HttpError(403, 'actor_not_allowed');
  if (String(body.run_id) !== String(claims.run_id)) throw new HttpError(403, 'run_id_mismatch');
  if (String(body.commit_sha) !== String(claims.workflow_sha)) throw new HttpError(403, 'commit_sha_mismatch');

  const budget = Number(body.max_budget_usd);
  const maxBudget = Number(env.MAX_BUDGET_USD ?? '25');
  if (!Number.isFinite(budget) || budget <= 0 || budget > maxBudget) throw new HttpError(400, 'budget_out_of_range');

  return {
    repository: body.repository,
    repository_id: String(claims.repository_id),
    run_id: String(body.run_id),
    commit_sha: String(body.commit_sha),
    ref: body.ref,
    actor: body.actor,
    actor_id: String(claims.actor_id),
    purpose: body.purpose ?? null,
    max_budget_usd: budget,
  };
}

async function signExecutionToken(env, record, authorizationId) {
  const now = Math.floor(Date.now() / 1000);
  const exp = Math.min(Math.floor(record.expires_at / 1000), now + 300);
  const header = b64urlJson({ alg: 'HS256', typ: 'JWT' });
  const payload = b64urlJson({
    iss: 'doga-kojin-tawaman-auth-gateway',
    aud: 'doga-kojin-tawaman-ai-proxy',
    authorization_id: authorizationId,
    repository: record.repository,
    run_id: record.run_id,
    commit_sha: record.commit_sha,
    ref: record.ref,
    purpose: record.purpose,
    max_budget_usd: record.max_budget_usd,
    iat: now,
    exp,
    jti: crypto.randomUUID(),
  });
  const key = await crypto.subtle.importKey(
    'raw',
    te.encode(env.EXECUTION_TOKEN_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, te.encode(`${header}.${payload}`)));
  return `${header}.${payload}.${b64url(signature)}`;
}

async function parseJson(request) {
  try {
    return await request.json();
  } catch {
    throw new HttpError(400, 'invalid_json');
  }
}

async function stubJson(stub, path, init = {}) {
  const response = await stub.fetch(`https://authorization.internal${path}`, {
    ...init,
    headers: { 'content-type': 'application/json', ...(init.headers ?? {}) },
  });
  const body = await response.json();
  if (!response.ok) throw new HttpError(response.status, body.error ?? 'authorization_state_error');
  return body;
}

class HttpError extends Error {
  constructor(status, code) {
    super(code);
    this.status = status;
    this.code = code;
  }
}

export class AuthorizationState extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.ctx = ctx;
  }

  async fetch(request) {
    const url = new URL(request.url);

    if (request.method === 'POST' && url.pathname === '/init') {
      const existing = await this.ctx.storage.get('record');
      if (existing) return json({ error: 'already_initialized' }, 409);
      const body = await request.json();
      await this.ctx.storage.put('record', body.record);
      await this.ctx.storage.put('attempts', 0);
      return json({ status: 'pending_pin' });
    }

    if (request.method === 'POST' && url.pathname === '/approve') {
      const record = await this.ctx.storage.get('record');
      if (!record) return json({ error: 'authorization_not_found' }, 404);
      if (record.status === 'approved') return json({ status: 'approved', record });
      if (record.status === 'denied') return json({ status: 'denied', record });
      if (Date.now() >= record.expires_at) {
        record.status = 'expired';
        await this.ctx.storage.put('record', record);
        return json({ status: 'expired', record });
      }

      const body = await request.json();
      if (body.pin_valid !== true) {
        const attempts = Number((await this.ctx.storage.get('attempts')) ?? 0) + 1;
        await this.ctx.storage.put('attempts', attempts);
        if (attempts >= 5) {
          record.status = 'denied';
          record.denied_at = Date.now();
          await this.ctx.storage.put('record', record);
          return json({ status: 'denied', record, attempts_remaining: 0 });
        }
        return json({
          status: 'pending_pin',
          record,
          error: 'pin_invalid',
          attempts_remaining: 5 - attempts,
        });
      }

      record.status = 'approved';
      record.approved_at = Date.now();
      await this.ctx.storage.put('record', record);
      return json({ status: 'approved', record });
    }

    if (request.method === 'POST' && url.pathname === '/deny') {
      const record = await this.ctx.storage.get('record');
      if (!record) return json({ error: 'authorization_not_found' }, 404);
      record.status = 'denied';
      record.denied_at = Date.now();
      await this.ctx.storage.put('record', record);
      return json({ status: 'denied' });
    }

    if (request.method === 'GET' && url.pathname === '/status') {
      const record = await this.ctx.storage.get('record');
      if (!record) return json({ error: 'authorization_not_found' }, 404);
      if (record.status === 'pending_pin' && Date.now() >= record.expires_at) {
        record.status = 'expired';
        await this.ctx.storage.put('record', record);
      }
      const attempts = Number((await this.ctx.storage.get('attempts')) ?? 0);
      return json({ status: record.status, record, attempts_remaining: Math.max(0, 5 - attempts) });
    }

    return json({ error: 'not_found' }, 404);
  }
}

function approvalPage(record, authorizationId, options = {}) {
  const status = options.status ?? record.status;
  const message = options.message ?? '';
  const attemptsRemaining = options.attemptsRemaining;
  const expiresAt = new Date(record.expires_at).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
  const disabled = status !== 'pending_pin';

  let stateMessage = message;
  if (!stateMessage && status === 'approved') stateMessage = 'この実行は承認済みです。';
  if (!stateMessage && status === 'denied') stateMessage = 'この実行は拒否されました。';
  if (!stateMessage && status === 'expired') stateMessage = 'この承認リクエストは期限切れです。';

  return html(`<!doctype html>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>V25 AI実行承認</title>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f6f7f9;color:#171717;margin:0;padding:24px">
  <main style="max-width:620px;margin:40px auto;background:white;border:1px solid #e5e7eb;border-radius:16px;padding:28px;box-shadow:0 12px 35px rgba(0,0,0,.06)">
    <h1 style="font-size:24px;margin:0 0 8px">V25 AI実行承認</h1>
    <p style="color:#666;margin:0 0 24px">このGitHub Actions実行だけを許可します。PINはGitHub側には送信されません。</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:24px">
      <tr><td style="padding:7px 0;color:#777;width:120px">Run ID</td><td>${escapeHtml(record.run_id)}</td></tr>
      <tr><td style="padding:7px 0;color:#777">Purpose</td><td>${escapeHtml(record.purpose)}</td></tr>
      <tr><td style="padding:7px 0;color:#777">Budget上限</td><td>$${escapeHtml(record.max_budget_usd.toFixed(2))}</td></tr>
      <tr><td style="padding:7px 0;color:#777">期限</td><td>${escapeHtml(expiresAt)}</td></tr>
    </table>
    ${stateMessage ? `<p style="padding:12px 14px;border-radius:10px;background:#f3f4f6">${escapeHtml(stateMessage)}</p>` : ''}
    ${disabled ? '' : `
      <form method="post" action="/approve/${escapeHtml(authorizationId)}" style="margin-top:20px">
        <label for="pin" style="display:block;font-weight:600;margin-bottom:8px">承認PIN / パスコード</label>
        <input id="pin" name="pin" type="password" autocomplete="current-password" required autofocus style="box-sizing:border-box;width:100%;font-size:20px;padding:13px 14px;border:1px solid #c9ced6;border-radius:10px">
        ${Number.isFinite(attemptsRemaining) ? `<p style="font-size:13px;color:#777">残り試行回数: ${escapeHtml(attemptsRemaining)}</p>` : ''}
        <button type="submit" style="margin-top:10px;width:100%;border:0;border-radius:10px;padding:13px 16px;background:#111;color:white;font-size:16px;font-weight:700;cursor:pointer">このRunを承認</button>
      </form>
    `}
  </main>
</body>`);
}

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);

      if (request.method === 'GET' && url.pathname === '/health') {
        return json({ status: 'ok', human_auth: 'owner_pin', provider_proxy: 'disabled' });
      }

      const approvalMatch = url.pathname.match(/^\/approve\/([0-9a-f-]{36})$/i);
      if (approvalMatch) {
        const authorizationId = approvalMatch[1];
        const stub = env.AUTHORIZATIONS.get(env.AUTHORIZATIONS.idFromName(authorizationId));

        if (request.method === 'GET') {
          const result = await stubJson(stub, '/status');
          return approvalPage(result.record, authorizationId, {
            status: result.status,
            attemptsRemaining: result.attempts_remaining,
          });
        }

        if (request.method === 'POST') {
          const origin = request.headers.get('origin');
          if (origin && origin !== url.origin) return html('<h2>無効な送信元です。</h2>', 403);
          if (!env.OWNER_APPROVAL_SECRET) return html('<h2>承認PINが未設定です。</h2>', 503);

          const form = await request.formData();
          const submittedPin = String(form.get('pin') ?? '');
          const [submittedHash, expectedHash] = await Promise.all([
            sha256(submittedPin),
            sha256(env.OWNER_APPROVAL_SECRET),
          ]);
          const result = await stubJson(stub, '/approve', {
            method: 'POST',
            body: JSON.stringify({ pin_valid: safeEqual(submittedHash, expectedHash) }),
          });

          if (result.status === 'approved') {
            return approvalPage(result.record, authorizationId, {
              status: 'approved',
              message: `Run ${result.record.run_id} を承認しました。このタブは閉じて大丈夫です。`,
            });
          }
          if (result.status === 'denied') {
            return approvalPage(result.record, authorizationId, {
              status: 'denied',
              message: 'PIN試行回数の上限に達したため、このRunは拒否されました。',
              attemptsRemaining: 0,
            });
          }
          if (result.status === 'expired') {
            return approvalPage(result.record, authorizationId, { status: 'expired' });
          }
          return approvalPage(result.record, authorizationId, {
            status: 'pending_pin',
            message: 'PINが違います。',
            attemptsRemaining: result.attempts_remaining,
          });
        }
      }

      const claims = await verifyGithubOidc(request, env);

      if (request.method === 'POST' && url.pathname === '/v1/preflight') {
        const body = await parseJson(request);
        validateContext(body, claims, env);
        for (const name of ['OWNER_APPROVAL_SECRET', 'EXECUTION_TOKEN_SECRET']) {
          if (!env[name]) throw new HttpError(503, `gateway_secret_missing:${name}`);
        }
        if (String(env.OWNER_APPROVAL_SECRET).length < 8) {
          throw new HttpError(503, 'gateway_secret_too_short:OWNER_APPROVAL_SECRET');
        }
        return json({
          status: 'ready',
          human_auth: 'owner_pin',
          ttl_seconds: Number(env.AUTH_TTL_SECONDS ?? '300'),
        });
      }

      if (request.method === 'POST' && url.pathname === '/v1/authorizations') {
        const body = await parseJson(request);
        const context = validateContext(body, claims, env);
        if (!PURPOSE_ALLOWLIST.has(context.purpose)) throw new HttpError(400, 'purpose_not_allowed');
        if (!env.OWNER_APPROVAL_SECRET || !env.EXECUTION_TOKEN_SECRET) {
          throw new HttpError(503, 'gateway_secrets_missing');
        }

        const ttlSeconds = Math.min(Number(env.AUTH_TTL_SECONDS ?? '300'), 300);
        const authorizationId = crypto.randomUUID();
        const record = {
          ...context,
          status: 'pending_pin',
          requested_at: Date.now(),
          expires_at: Date.now() + ttlSeconds * 1000,
        };

        const stub = env.AUTHORIZATIONS.get(env.AUTHORIZATIONS.idFromName(authorizationId));
        await stubJson(stub, '/init', {
          method: 'POST',
          body: JSON.stringify({ record }),
        });

        const approvalUrl = `${url.origin}/approve/${authorizationId}`;
        return json({
          authorization_id: authorizationId,
          status: 'pending_pin',
          approval_url: approvalUrl,
          expires_at: new Date(record.expires_at).toISOString(),
        }, 202);
      }

      const statusMatch = url.pathname.match(/^\/v1\/authorizations\/([0-9a-f-]{36})$/i);
      if (request.method === 'GET' && statusMatch) {
        const authorizationId = statusMatch[1];
        const stub = env.AUTHORIZATIONS.get(env.AUTHORIZATIONS.idFromName(authorizationId));
        const result = await stubJson(stub, '/status');
        const record = result.record;

        if (
          record.repository !== env.EXPECTED_REPOSITORY ||
          record.run_id !== String(claims.run_id) ||
          record.commit_sha !== String(claims.workflow_sha) ||
          record.ref !== env.EXPECTED_REF ||
          record.actor !== env.EXPECTED_ACTOR
        ) {
          throw new HttpError(403, 'authorization_context_mismatch');
        }

        if (result.status !== 'approved') {
          return json({ status: result.status, expires_at: new Date(record.expires_at).toISOString() });
        }

        const executionToken = await signExecutionToken(env, record, authorizationId);
        return json({
          status: 'approved',
          execution_token: executionToken,
          expires_at: new Date(record.expires_at).toISOString(),
        });
      }

      if (request.method === 'POST' && url.pathname === '/v1/execute') {
        return json({ error: 'provider_proxy_not_enabled_yet' }, 503);
      }

      return json({ error: 'not_found' }, 404);
    } catch (error) {
      if (error instanceof HttpError) return json({ error: error.code }, error.status);
      console.error('gateway_unhandled_error', error instanceof Error ? error.stack : String(error));
      return json({ error: 'internal_error' }, 500);
    }
  },
};