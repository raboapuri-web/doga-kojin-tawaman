#!/usr/bin/env node

import {appendFileSync} from 'node:fs';

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
if (context.actor !== 'github-actions[bot]') {
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
const purpose = parsed.get('purpose') ?? 'ai-generation';
const OIDC_AUDIENCE = 'doga-kojin-tawaman-v25-pin-approval';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function setOutput(name, value, {mask = false} = {}) {
  if (mask) console.log(`::add-mask::${value}`);
  const outputFile = process.env.GITHUB_OUTPUT;
  if (outputFile) {
    appendFileSync(outputFile, `${name}=${value}\n`, 'utf8');
  } else if (!mask) {
    console.log(`${name}=${value}`);
  }
}

function addSummary(markdown) {
  const summaryFile = process.env.GITHUB_STEP_SUMMARY;
  if (summaryFile) appendFileSync(summaryFile, `${markdown}\n`, 'utf8');
}

let cachedOidcToken = null;
async function getGithubOidcToken() {
  if (cachedOidcToken) return cachedOidcToken;

  const requestUrl = process.env.ACTIONS_ID_TOKEN_REQUEST_URL;
  const requestToken = process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN;
  if (!requestUrl || !requestToken) {
    throw new Error('GitHub OIDC environment is unavailable. Workflow requires id-token: write.');
  }

  const url = new URL(requestUrl);
  url.searchParams.set('audience', OIDC_AUDIENCE);

  const response = await fetch(url, {
    headers: {authorization: `Bearer ${requestToken}`},
  });
  if (!response.ok) {
    throw new Error(`Unable to obtain GitHub OIDC token (${response.status})`);
  }

  const body = await response.json();
  if (!body?.value) throw new Error('GitHub OIDC response did not include a token');

  cachedOidcToken = body.value;
  return cachedOidcToken;
}

async function requestJson(path, init = {}) {
  const oidcToken = await getGithubOidcToken();
  const response = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      'content-type': 'application/json',
      'user-agent': 'doga-kojin-tawaman-v25',
      authorization: `Bearer ${oidcToken}`,
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

async function preflight() {
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

  console.log('Gateway preflight accepted with GitHub OIDC.');
}

async function requestAuthorization() {
  const result = await requestJson('/v1/authorizations', {
    method: 'POST',
    body: JSON.stringify({
      ...context,
      purpose,
      requested_at: new Date().toISOString(),
      auth_version: 1,
    }),
  });

  if (!result?.authorization_id || result?.status !== 'pending_pin' || !result?.approval_url) {
    throw new Error('Gateway did not create a pending PIN authorization');
  }

  setOutput('authorization_id', result.authorization_id);
  setOutput('approval_url', result.approval_url);
  console.log('');
  console.log('OWNER PIN APPROVAL REQUIRED');
  console.log(result.approval_url);
  console.log('Open the URL above and enter the Cloudflare-only approval PIN/passcode.');
  console.log('');
  addSummary(`## V25 AI approval required\n\n[Open owner PIN approval page](${result.approval_url})\n\nThe approval PIN/passcode exists only in Cloudflare and must never be stored in GitHub.`);
  return result.authorization_id;
}

async function waitForApproval(authorizationId) {
  const timeoutSeconds = Number(parsed.get('timeout-seconds') ?? '300');
  const pollSeconds = Number(parsed.get('poll-seconds') ?? '5');

  if (!Number.isFinite(timeoutSeconds) || timeoutSeconds < 30 || timeoutSeconds > 600) {
    throw new Error('timeout-seconds must be between 30 and 600');
  }
  if (!Number.isFinite(pollSeconds) || pollSeconds < 2 || pollSeconds > 30) {
    throw new Error('poll-seconds must be between 2 and 30');
  }

  const deadline = Date.now() + timeoutSeconds * 1000;

  while (Date.now() < deadline) {
    const result = await requestJson(`/v1/authorizations/${encodeURIComponent(authorizationId)}`);

    if (result?.status === 'approved') {
      if (!result.execution_token) {
        throw new Error('Approved authorization did not include an execution token');
      }
      setOutput('execution_token', result.execution_token, {mask: true});
      if (result.expires_at) setOutput('execution_token_expires_at', result.expires_at);
      console.log('Owner PIN approval accepted. Scoped execution token issued and masked.');
      return;
    }

    if (result?.status === 'denied' || result?.status === 'expired') {
      throw new Error(`Authorization ${result.status}`);
    }

    if (result?.status !== 'pending_pin') {
      throw new Error(`Unexpected authorization status: ${result?.status ?? '<missing>'}`);
    }

    await sleep(pollSeconds * 1000);
  }

  throw new Error('Owner PIN approval timed out');
}

if (command === 'preflight') {
  await preflight();
  process.exit(0);
}

if (command === 'request-authorization') {
  await requestAuthorization();
  process.exit(0);
}

if (command === 'request-and-wait') {
  await preflight();
  const authorizationId = await requestAuthorization();
  await waitForApproval(authorizationId);
  process.exit(0);
}

throw new Error(`Unsupported command: ${command ?? '<none>'}`);