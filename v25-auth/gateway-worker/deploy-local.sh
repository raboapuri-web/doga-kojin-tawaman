#!/usr/bin/env bash
set -euo pipefail

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required. Install Node.js 20+ first."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required."
  exit 1
fi

if [[ -z "${CLOUDFLARE_API_TOKEN:-}" ]]; then
  printf "Cloudflare API token: "
  stty -echo
  IFS= read -r CLOUDFLARE_API_TOKEN
  stty echo
  printf "\n"
  export CLOUDFLARE_API_TOKEN
fi

if [[ -z "${CLOUDFLARE_API_TOKEN}" ]]; then
  echo "Cloudflare API token is empty."
  exit 1
fi

cleanup() {
  unset CLOUDFLARE_API_TOKEN || true
}
trap cleanup EXIT

npm install
npx wrangler whoami
npx wrangler deploy

echo
printf "Deployment finished. Revoke the temporary Cloudflare API token after verification.\n"
