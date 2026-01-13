#!/usr/bin/env bash
set -euo pipefail

# === config ===
SERVER_USER="root"
SERVER_HOST="80.78.242.62"
SERVER_DIR="/root/tmp"
PROJECT_DIR="/root/yaga"         # директория с docker-compose.yaml на сервере
SERVICE_NAME="frontend_yoga"     # имя сервиса в docker compose
IMAGE_TAG="yaga-frontend:amd64"
FRONTEND_DIR="../forntend"

ARCHIVE_NAME="yaga-frontend-amd64.tar.gz"

# === build amd64 image ===
echo "Building image for linux/amd64..."
docker build --platform linux/amd64 -t "${IMAGE_TAG}" "${FRONTEND_DIR}"

# === save to tar.gz ===
echo "Saving image to ${ARCHIVE_NAME}..."
docker save "${IMAGE_TAG}" | gzip > "${ARCHIVE_NAME}"

# === upload ===
echo "Uploading to ${SERVER_USER}@${SERVER_HOST}:${SERVER_DIR}/${ARCHIVE_NAME}..."
scp "${ARCHIVE_NAME}" "${SERVER_USER}@${SERVER_HOST}:${SERVER_DIR}/${ARCHIVE_NAME}"

# === load & restart on server ===
echo "Loading image and restarting compose service on server..."
ssh "${SERVER_USER}@${SERVER_HOST}" bash -lc "'
  set -e
  cd ${SERVER_DIR}
  gunzip -c ${ARCHIVE_NAME} | docker load
  cd ${PROJECT_DIR}
  docker compose up -d --no-deps --force-recreate ${SERVICE_NAME}
  docker image ls | head -n 20
'"

echo "Done."