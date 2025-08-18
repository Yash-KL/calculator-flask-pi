# Multi-arch ready via buildx
FROM python:3.12-slim

# Create non-root user
RUN useradd -u 10001 -m appuser

WORKDIR /app

# System deps (optional but good for SSL, etc.)
RUN apt-get update -y && apt-get install -y --no-install-recommends \
    ca-certificates && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
USER appuser

EXPOSE 5000
# Use gunicorn in production
CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:app"]
