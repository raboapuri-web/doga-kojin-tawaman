# V25 Email OTP Authorization Contract

This repository intentionally does not store the authorized email address.
The gateway owns the allowlist and always sends approval to the single configured owner email.
GitHub Actions cannot choose or override the recipient.

## Security goals

1. A shared GitHub account is not treated as human identity.
2. Pull requests, forks, comments, scheduled jobs and arbitrary branches cannot enter the AI path.
3. Every billable AI run requires a fresh email OTP or magic-link approval.
4. Approval is bound to one repository, one workflow run, one commit SHA, one branch ref and one budget ceiling.
5. Approval expires after five minutes and is single-use.
6. The provider credential stays only in the gateway. GitHub Actions receives only a short-lived scoped execution token.
7. The gateway rejects attempts to change the approved repository, SHA, ref, run ID, purpose or budget after approval.

## GitHub -> gateway authorization request

POST `/v1/authorizations`

```json
{
  "auth_version": 1,
  "repository": "raboapuri-web/doga-kojin-tawaman",
  "run_id": "123456789",
  "commit_sha": "40-char git SHA",
  "ref": "refs/heads/v25-ai",
  "actor": "raboapuri-web",
  "purpose": "generate-scene-assets",
  "max_budget_usd": 3.0,
  "requested_at": "ISO-8601 timestamp"
}
```

Expected response:

```json
{
  "authorization_id": "opaque-id",
  "status": "pending_email_otp",
  "expires_at": "ISO-8601 timestamp"
}
```

The recipient email is intentionally absent from the request.

## Approval status

GET `/v1/authorizations/{authorization_id}`

Pending:

```json
{
  "status": "pending_email_otp"
}
```

Approved:

```json
{
  "status": "approved",
  "execution_token": "short-lived-scoped-token",
  "expires_at": "ISO-8601 timestamp"
}
```

Denied or expired:

```json
{
  "status": "denied"
}
```

or

```json
{
  "status": "expired"
}
```

## AI proxy calls

The approved execution token is sent to the gateway, not directly to the AI provider.
The gateway validates the token scope and remaining budget before proxying any request.

Recommended endpoint families:

- `POST /v1/ai/images`
- `POST /v1/ai/speech`
- `POST /v1/ai/text`

The gateway must enforce the approved purpose and maximum spend server-side.

## Required gateway-side controls

- Single fixed owner email stored server-side.
- Six-digit OTP or signed magic link.
- Five-minute authorization TTL.
- One-time authorization consumption.
- Per-IP and per-run rate limiting.
- Maximum failed OTP attempts.
- Replay protection using authorization ID + nonce.
- Audit log containing run ID, SHA, purpose, approved budget, actual spend and timestamp.
- No secret values in logs.
- No endpoint that reveals the configured owner email to GitHub Actions.
