#!/usr/bin/env bash
set -euo pipefail

# === config ===
SERVER_USER="root"
SERVER_HOST="80.78.242.62"
PROJECT_DIR="/root/yaga"
SERVICE_NAME="backend_yoga"

BRANCH="" # Оставь пустым, чтобы не трогать ветку.

SSH_TARGET="${SERVER_USER}@${SERVER_HOST}"

echo "Deploying ${SERVICE_NAME} to ${SSH_TARGET}:${PROJECT_DIR}"

ssh -t "${SSH_TARGET}" bash -lc "'
  set -euo pipefail
  cd \"${PROJECT_DIR}\"

  echo \"== git status ==\"
  git status --porcelain || true

  echo \"== git pull ==\"
  if [ -n \"${BRANCH}\" ]; then
    git fetch --all
    git checkout \"${BRANCH}\"
    git pull --ff-only
  else
    git pull --ff-only
  fi

  echo \"== build ${SERVICE_NAME} ==\"
  docker compose build --no-cache ${SERVICE_NAME}

  echo \"== up ${SERVICE_NAME} ==\"
  docker compose up -d --no-deps --force-recreate ${SERVICE_NAME}

  echo \"== ps ==\"
  docker compose ps ${SERVICE_NAME}

  echo \"== last logs ==\"
  docker compose logs --tail=50 ${SERVICE_NAME} || true
'"

echo "Done."