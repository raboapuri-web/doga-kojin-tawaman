# V25 Owner PIN Authorization Gateway

Cloudflare Worker for human approval before any billable AI request.

## Current state

- GitHub Actions authenticates to this gateway with GitHub OIDC.
- The gateway validates repository, repository ID, actor, actor ID, branch, workflow ref, run ID and workflow SHA.
- A successful request creates a five-minute authorization record in a SQLite-backed Durable Object.
- The gateway returns a browser approval URL to the GitHub Actions run.
- The human approver opens that URL and enters a Cloudflare-only PIN/passcode.
- The PIN/passcode is never stored in GitHub and is never returned to GitHub Actions.
- Each authorization allows at most five incorrect PIN attempts and expires after five minutes.
- After approval, GitHub receives a short-lived scoped execution token, never the provider credential.
- `/v1/execute` intentionally returns `503` until the provider credential is moved out of GitHub and the proxy is explicitly enabled.

## Required Worker secrets

Do not put these values in this public repository or in GitHub Secrets.

- `OWNER_APPROVAL_SECRET` — owner-only approval PIN/passcode. Use at least 8 characters; a longer passphrase is better.
- `EXECUTION_TOKEN_SECRET` — random high-entropy secret used to sign short-lived execution tokens.

The provider API credential is intentionally **not** part of this Worker yet.

## Non-secret policy values

`wrangler.jsonc` pins the expected GitHub repository, immutable repository ID, actor, actor ID, branch and workflow reference. Changing those values requires a code change.

## Browser approval flow

1. Run `V25 Owner PIN Gateway Guard` with `request-pin-approval`.
2. GitHub OIDC authenticates the workflow to the gateway.
3. The Action log and Step Summary show an approval URL.
4. Open the URL and enter the Cloudflare-only owner PIN/passcode.
5. The gateway marks that single run approved and the Action receives a short-lived execution token.
6. The approval expires after five minutes and is bound to repository + run ID + SHA + ref + purpose + budget.

## Deployment sequence

1. Deploy this Worker from the `v25-ai` branch.
2. In Cloudflare Worker Settings -> Variables and Secrets, create `OWNER_APPROVAL_SECRET` and `EXECUTION_TOKEN_SECRET` as encrypted secrets.
3. Set the Worker HTTPS URL in GitHub as `AUTH_GATEWAY_URL`.
4. Test one `request-pin-approval` run and approve it from the browser page.
5. Only after that test succeeds, move `OPENAI_API_KEY` from GitHub to Cloudflare and enable the provider proxy.
6. Delete the old `OPENAI_API_KEY` GitHub repository secret and close any legacy direct-API workflow paths.

## Security note

A shared GitHub login is not treated as human identity. GitHub OIDC proves which workflow/run is calling; possession of the owner-only Cloudflare PIN/passcode proves the human approver. Because the approval URL may be visible in public Actions logs, the URL alone never authorizes a run.