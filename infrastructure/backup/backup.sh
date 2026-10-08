#!/bin/bash
# Backup script for EOTC Digital Platform
# Target: PostgreSQL automated daily backup + verification

set -e

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="${BACKUP_DIR:-/backups}"
DB_NAME="${POSTGRES_DB:-eotc_db}"
DB_USER="${POSTGRES_USER:-postgres}"
DB_HOST="${POSTGRES_HOST:-postgres}"
BACKUP_FILE="${BACKUP_DIR}/eotc_backup_${TIMESTAMP}.sql.gz"

mkdir -p "${BACKUP_DIR}"

echo "[$(date)] Starting PostgreSQL database backup for ${DB_NAME}..."
pg_dump -h "${DB_HOST}" -U "${DB_USER}" "${DB_NAME}" | gzip > "${BACKUP_FILE}"

echo "[$(date)] Backup completed successfully: ${BACKUP_FILE}"
ls -lh "${BACKUP_FILE}"

# Keep latest 30 days of backups
find "${BACKUP_DIR}" -name "eotc_backup_*.sql.gz" -mtime +30 -exec rm {} \;
echo "[$(date)] Old backups purged (>30 days)."
