# Use official Python 3.12 slim image
FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory
WORKDIR /app

# Install system dependencies (required for FAISS and compiling some Python packages)
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file and install dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the Django project
COPY . /app/

# Expose a default port (Render will override this via $PORT)
EXPOSE 8000

# Run gunicorn (Production server) with 1 worker. Use shell form CMD to allow environment variable evaluation for PORT.
CMD python manage.py migrate && gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers 1 --timeout 120
