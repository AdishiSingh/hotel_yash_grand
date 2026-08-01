#!/bin/bash

# =========================================================
# HOTEL YASH GRAND — PostgreSQL Disaster Recovery Restore
# =========================================================

if [ -z "$1" ]; then
  echo "Usage: ./scripts/restore-db.sh <path_to_backup_file.sql.gz>"
  exit 1
fi

BACKUP_FILE=$1

if [ ! -f "$BACKUP_FILE" ]; then
  echo "❌ Backup file not found: ${BACKUP_FILE}"
  exit 1
fi

echo "⚠️ Restoring PostgreSQL database from ${BACKUP_FILE}..."

gunzip -c ${BACKUP_FILE} | psql -U ${POSTGRES_USER:-postgres} -h ${POSTGRES_HOST:-localhost} -d ${POSTGRES_DB:-yashgrand}

if [ $? -eq 0 ]; then
  echo "🎉 PostgreSQL database successfully restored from backup!"
else
  echo "❌ Database restore failed!"
  exit 1
fi
