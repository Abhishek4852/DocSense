#!/bin/bash
set -ex

echo "Starting deployment script..."

# Check python version and installed packages just to be sure
python --version
pip list | grep -E "django|dotenv"

# Run migrations with unbuffered output
echo "Running migrations..."
python -u manage.py migrate --noinput || echo "Migrations failed! Continuing anyway..."

echo "Starting gunicorn..."
exec gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers 1 --timeout 120
