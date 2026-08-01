#!/bin/bash

# =========================================================
# HOTEL YASH GRAND — Automated PostgreSQL Backup Script
# =========================================================

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="./backups"
BACKUP_FILE="${BACKUP_DIR}/yashgrand_backup_${TIMESTAMP}.sql.gz"

# Create backup directory if not exists
mkdir -p ${BACKUP_DIR}

echo "📦 Starting PostgreSQL database backup for Hotel Yash Grand..."

# Execute pg_dump and compress
pg_dump -U ${POSTGRES_USER:-postgres} -h ${POSTGRES_HOST:-localhost} ${POSTGRES_DB:-yashgrand} | gzip > ${BACKUP_FILE}

if [ $? -eq 0 ]; then
  echo "✓ PostgreSQL backup created successfully: ${BACKUP_FILE}"
  
  # Retention policy: Remove backups older than 30 days
  find ${BACKUP_DIR} -name "yashgrand_backup_*.sql.gz" -mtime +30 -delete
  echo "✓ Applied 30-day backup retention cleanup."
else
  echo "❌ PostgreSQL database backup failed!"
  exit 1
fi
