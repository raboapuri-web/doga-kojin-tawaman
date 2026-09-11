# V25 Email Authorization Gateway

Cloudflare Worker scaffold for human approval before any billable AI request.

## Current state

- GitHub Actions authenticates to this gateway with GitHub OIDC.
- The gateway validates repository, repository ID, actor, actor ID, branch, workflow ref, run ID and workflow SHA.
- A successful request creates a five-minute authorization record in a SQLite-backed Durable Object.
- Approval is sent only to the gateway-owned `OWNER_EMAIL`; GitHub cannot select or override the recipient.
- The email contains a single-use random Magic Link.
- After approval, GitHub receives a short-lived scoped execution token, never the provider credential.
- `/v1/execute` intentionally returns `503` until the provider credential is moved out of GitHub and the proxy is explicitly enabled.

## Required Worker secrets

Do not put these values in this public repository.

- `RESEND_API_KEY` — Resend key restricted to sending email where possible.
- `OWNER_EMAIL` — the one human email allowed to approve runs.
- `EMAIL_FROM` — verified sender address used by Resend.
- `EXECUTION_TOKEN_SECRET` — random high-entropy secret used to sign short-lived execution tokens.

The provider API credential is intentionally **not** part of this Worker yet.

## Non-secret policy values

`wrangler.jsonc` pins the expected GitHub repository, immutable repository ID, actor, actor ID, branch and workflow reference. Changing those values requires a code review/commit.

## Later deployment sequence

1. Create a Cloudflare Workers account/project.
2. Configure the four Worker secrets above using the Cloudflare dashboard or `wrangler secret put`.
3. Deploy this Worker.
4. Set the resulting HTTPS URL in GitHub as `AUTH_GATEWAY_URL`.
5. Test `workflow_dispatch -> request-email-otp` and approve one Magic Link.
6. Only after that test succeeds, move the provider API credential from GitHub to the gateway and enable `/v1/execute`.
7. Remove the old provider credential from GitHub repository secrets.

## Security properties

A shared GitHub login is not considered human identity. GitHub OIDC proves which workflow/run is calling; possession of the owner mailbox proves the human approver. Authorization is bound to one `repository + run_id + commit SHA + ref + purpose + budget` tuple and expires after five minutes.
