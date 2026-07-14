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

# Copy the start script
COPY start.sh /app/
RUN chmod +x /app/start.sh

# Run the start script
CMD ["/app/start.sh"]
