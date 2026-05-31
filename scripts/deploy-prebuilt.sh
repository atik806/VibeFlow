#!/usr/bin/env bash
set -euo pipefail

TOKEN="${1:?Usage: deploy-prebuilt.sh <vercel-token>}"
TIMEOUT="${2:-12m}"
LOG=/tmp/vercel-deploy.log

GIT_BACKUP=""
if [ -d .git ]; then
  GIT_BACKUP="$(mktemp -d)"
  mv .git "$GIT_BACKUP/.git"
  trap 'if [ -n "$GIT_BACKUP" ] && [ -d "$GIT_BACKUP/.git" ]; then mv "$GIT_BACKUP/.git" .git; fi' EXIT
fi

if ! npx vercel deploy --prebuilt --prod --yes --no-wait --token="$TOKEN" 2>&1 | tee "$LOG"; then
  echo "::error::vercel deploy command failed"
  exit 1
fi

if grep -q "Your deployment failed" "$LOG"; then
  echo "::error::Vercel rejected the deployment"
  cat "$LOG"
  exit 1
fi

DEPLOY_URL="$(grep -oE 'https://[a-zA-Z0-9._-]+\.vercel\.app' "$LOG" | tail -1)"
if [ -z "$DEPLOY_URL" ]; then
  echo "::error::Could not parse deployment URL"
  cat "$LOG"
  exit 1
fi

echo "Waiting for $DEPLOY_URL to become ready..."
if ! npx vercel inspect "$DEPLOY_URL" --wait --timeout "$TIMEOUT" --token="$TOKEN"; then
  echo "::error::Deployment did not become ready in time"
  exit 1
fi

echo "Deployed to $DEPLOY_URL"
