
# Use an official Python runtime as a parent image
FROM python:3.12-slim

# Set the working directory in the container
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file into the container
COPY web_app/backend/requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the lm-council library source
COPY lm_council ./lm_council

# Copy the backend application code
COPY web_app ./web_app

# Set PYTHONPATH to include the current directory so modules can be imported
ENV PYTHONPATH=/app

# Expose port 8000
EXPOSE 8000

# Run the application
CMD ["uvicorn", "web_app.backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
