# PostgreSQL Backup & Disaster Recovery Runbook
> **EOTC Digital Platform Operational Runbook (Section 28)**

## Overview
This directory contains automated backup and disaster recovery scripts for the Ethiopian Orthodox Tewahedo Digital Platform.

## 1. Automated Backups (`backup.sh`)
- **Schedule**: Executes daily at 02:00 AM UTC via cron or container orchestrator.
- **Storage Target**: `/backups` directory (mapped to persistent block volume or external S3 cold storage).
- **Format**: Compressed SQL stream (`gzip`) timestamped `eotc_backup_YYYYMMDD_HHMMSS.sql.gz`.
- **Retention**: Retains the last 30 daily backups; older snapshots are purged automatically.

### Running a Manual Backup
```bash
docker compose exec postgres /bin/bash /app/infrastructure/backup/backup.sh
```

## 2. Disaster Recovery & Restoration (`restore.sh`)
- **Restoration Procedure**:
  1. Stop incoming API traffic via Nginx maintenance mode or stop `eotc_api` container.
  2. Execute `restore.sh` with the target compressed snapshot.
  3. The script verifies schema integrity and runs row-count health audits on `users`, `churches`, `books`, `mezmurs`, and `audit_events`.
  4. Restart `eotc_api` and verify `/api/v1/health`.

### Restoring from Backup
```bash
./restore.sh /backups/eotc_backup_20261008_120000.sql.gz
```
