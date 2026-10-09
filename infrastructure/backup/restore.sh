#!/bin/bash
# Disaster Recovery & Restoration script for EOTC Digital Platform
# Target: PostgreSQL database restore and verification

set -e

BACKUP_FILE="$1"
DB_NAME="${POSTGRES_DB:-eotc_db}"
DB_USER="${POSTGRES_USER:-postgres}"
DB_HOST="${POSTGRES_HOST:-postgres}"

if [ -z "${BACKUP_FILE}" ]; then
  echo "Usage: ./restore.sh <path_to_backup.sql.gz>"
  echo "Example: ./restore.sh /backups/eotc_backup_20261008_120000.sql.gz"
  exit 1
fi

if [ ! -f "${BACKUP_FILE}" ]; then
  echo "Error: Backup file not found: ${BACKUP_FILE}"
  exit 1
fi

echo "[$(date)] Starting database restoration for ${DB_NAME} from ${BACKUP_FILE}..."

# Decompress and stream to psql
gunzip -c "${BACKUP_FILE}" | psql -h "${DB_HOST}" -U "${DB_USER}" -d "${DB_NAME}"

echo "[$(date)] Restoration completed successfully!"
echo "[$(date)] Running post-restore integrity check on core tables..."

psql -h "${DB_HOST}" -U "${DB_USER}" -d "${DB_NAME}" -c "
  SELECT 
    (SELECT COUNT(*) FROM users) as users_count,
    (SELECT COUNT(*) FROM churches) as churches_count,
    (SELECT COUNT(*) FROM books) as books_count,
    (SELECT COUNT(*) FROM mezmurs) as mezmurs_count,
    (SELECT COUNT(*) FROM audit_events) as audit_count;
"

echo "[$(date)] Integrity check verified."
