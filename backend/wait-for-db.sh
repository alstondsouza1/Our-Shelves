#!/bin/sh
set -e

host="$DB_HOST"
port="${DB_PORT:-3306}"

echo "⏳ Waiting for MySQL at $host:$port..."

while ! nc -z "$host" "$port"; do
  echo "MySQL not ready yet..."
  sleep 2
done

echo "✅ Database is ready! Starting server..."
exec "$@"

