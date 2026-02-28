#!/bin/bash

# Task Manager Setup Script
echo "🚀 Setting up Task Management System..."

# Check if Docker Compose is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check for docker compose (v2) or docker-compose (v1)
if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
elif command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
else
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update the .env file with your configuration before proceeding."
    echo "   Especially update JWT_SECRET and JWT_REFRESH_SECRET for production!"
    read -p "Press enter to continue after updating .env..."
fi

# Stop any running containers
echo "🛑 Stopping any running containers..."
$COMPOSE_CMD down

# Remove old volumes (optional - uncomment if you want a fresh start)
# echo "🗑️  Removing old volumes..."
# $COMPOSE_CMD down -v

# Build and start services
echo "🏗️  Building Docker images..."
$COMPOSE_CMD build --no-cache

echo "🚀 Starting services..."
$COMPOSE_CMD up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check service health
echo "🏥 Checking service health..."
$COMPOSE_CMD ps

# Display logs
echo ""
echo "📋 Recent logs:"
$COMPOSE_CMD logs --tail=50

echo ""
echo "✅ Setup complete!"
echo ""
echo "📡 Services are running at:"
echo "   - API Gateway: http://localhost:3000"
echo "   - Nginx Proxy: http://localhost"
echo "   - Auth Service: http://localhost:3001"
echo "   - User Service: http://localhost:3002"
echo "   - Task Service: http://localhost:3003"
echo ""
echo "📚 To view logs: $COMPOSE_CMD logs -f"
echo "🛑 To stop: $COMPOSE_CMD down"
echo "🔄 To restart: $COMPOSE_CMD restart"
echo ""
