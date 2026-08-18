FROM python:3.10-slim

ENV PYTHONUNBUFFERED=1 \
    PORT=7860

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt-get/lists/*

# Copy requirements and install
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . /app/

# Collect static files
RUN python manage.py collectstatic --no-input

# Expose Hugging Face default port 7860
EXPOSE 7860

# Start Gunicorn server bound to 0.0.0.0:7860
CMD ["gunicorn", "ecommerce_store.wsgi:application", "--bind", "0.0.0.0:7860"]
