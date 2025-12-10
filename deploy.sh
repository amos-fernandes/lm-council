
#!/bin/bash

# Stop on error
set -e

echo "🚀 Deploying AI Council..."

# 1. Pull latest changes (assuming running from git repo)
echo "📥 Pulling latest code..."
git pull origin main

# 2. Check for .env
if [ ! -f .env ]; then
    echo "⚠️ .env file not found! Please create it with OPENROUTER_API_KEY."
    exit 1
fi

# 3. Create sessions.json if not exists (for volume mapping)
if [ ! -f sessions.json ]; then
    echo "[]" > sessions.json
fi

# 4. Build and Run via Docker Compose
echo "🐳 Building and starting containers..."
docker compose down
docker compose up -d --build

echo "✅ Deployment complete!"
echo "Backend: http://<your-vps-ip>:8000"
echo "Frontend: http://<your-vps-ip>"
