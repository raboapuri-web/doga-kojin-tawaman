# V25 Owner PIN Authorization Contract

This repository intentionally does not store the human approval secret.
The gateway owns `OWNER_APPROVAL_SECRET`; GitHub Actions cannot read, choose or override it.

## Security goals

1. A shared GitHub account is not treated as human identity.
2. Pull requests, forks, comments, scheduled jobs and arbitrary branches cannot enter the AI path.
3. Every billable AI run requires a fresh browser approval using the Cloudflare-only owner PIN/passcode.
4. Approval is bound to one repository, one workflow run, one commit SHA, one branch ref and one budget ceiling.
5. Approval expires after five minutes.
6. Each authorization allows at most five incorrect PIN attempts.
7. The provider credential stays only in the gateway. GitHub Actions receives only a short-lived scoped execution token.
8. The gateway rejects attempts to change the approved repository, SHA, ref, run ID, purpose or budget after approval.

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
  "status": "pending_pin",
  "approval_url": "https://worker.example/approve/opaque-id",
  "expires_at": "ISO-8601 timestamp"
}
```

The approval URL is not itself a credential. The owner PIN/passcode is still required.

## Human approval

GET `/approve/{authorization_id}` displays the run details and PIN form.

POST `/approve/{authorization_id}` accepts the owner PIN/passcode over HTTPS. The PIN/passcode is compared only inside the Cloudflare Worker and is never forwarded to GitHub.

## Approval status

GET `/v1/authorizations/{authorization_id}`

Pending:

```json
{
  "status": "pending_pin"
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

- Owner approval secret stored only as a Cloudflare encrypted secret.
- Minimum approval-secret length check.
- Five-minute authorization TTL.
- Maximum five failed PIN attempts per authorization.
- Approval bound to repository + run ID + SHA + ref + purpose + budget.
- Short-lived execution token.
- No secret values in logs.
- No endpoint that reveals the configured owner PIN/passcode to GitHub Actions.
- Provider API key must not be moved to Cloudflare until the approval path has been tested successfully.