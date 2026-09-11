#!/usr/bin/env node

const args = process.argv.slice(2);
const command = args.shift();

const parsed = new Map();
for (let i = 0; i < args.length; i += 2) {
  const key = args[i];
  const value = args[i + 1];
  if (!key?.startsWith('--') || value === undefined) {
    throw new Error(`Invalid argument pair near: ${key ?? '<end>'}`);
  }
  parsed.set(key.slice(2), value);
}

const required = (name) => {
  const value = parsed.get(name);
  if (!value) throw new Error(`Missing --${name}`);
  return value;
};

const context = {
  repository: required('repository'),
  run_id: required('run-id'),
  commit_sha: required('sha'),
  ref: required('ref'),
  actor: required('actor'),
  max_budget_usd: Number(required('max-budget-usd')),
};

if (!Number.isFinite(context.max_budget_usd) || context.max_budget_usd <= 0 || context.max_budget_usd > 25) {
  throw new Error('max-budget-usd must be greater than 0 and no more than 25.00');
}

if (context.repository !== 'raboapuri-web/doga-kojin-tawaman') {
  throw new Error('Unexpected repository');
}
if (context.actor !== 'raboapuri-web') {
  throw new Error('Unexpected GitHub actor');
}
if (context.ref !== 'refs/heads/v25-ai') {
  throw new Error('Unexpected branch ref');
}

const gatewayUrl = new URL(required('url'));
if (gatewayUrl.protocol !== 'https:') {
  throw new Error('AUTH_GATEWAY_URL must use HTTPS');
}

const base = gatewayUrl.toString().replace(/\/$/, '');

async function requestJson(path, init = {}) {
  const response = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      'content-type': 'application/json',
      'user-agent': 'doga-kojin-tawaman-v25',
      ...(init.headers ?? {}),
    },
  });

  const text = await response.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(`Gateway returned non-JSON response (${response.status})`);
  }

  if (!response.ok) {
    throw new Error(`Gateway request failed (${response.status}): ${body?.error ?? 'unknown error'}`);
  }

  return body;
}

if (command === 'preflight') {
  const result = await requestJson('/v1/preflight', {
    method: 'POST',
    body: JSON.stringify({
      ...context,
      requested_at: new Date().toISOString(),
      auth_version: 1,
    }),
  });

  if (result?.status !== 'ready') {
    throw new Error('Gateway preflight did not return status=ready');
  }

  console.log('Gateway preflight accepted.');
  process.exit(0);
}

if (command === 'request-authorization') {
  const result = await requestJson('/v1/authorizations', {
    method: 'POST',
    body: JSON.stringify({
      ...context,
      purpose: parsed.get('purpose') ?? 'ai-generation',
      requested_at: new Date().toISOString(),
      auth_version: 1,
    }),
  });

  if (!result?.authorization_id || result?.status !== 'pending_email_otp') {
    throw new Error('Gateway did not create a pending email OTP authorization');
  }

  console.log(`authorization_id=${result.authorization_id}`);
  console.log('Email OTP approval requested.');
  process.exit(0);
}

throw new Error(`Unsupported command: ${command ?? '<none>'}`);
