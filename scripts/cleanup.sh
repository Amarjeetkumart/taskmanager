#!/bin/bash

# Task Manager Cleanup Script
echo "🧹 Cleaning up Task Management System..."

# Detect docker compose command
if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
elif command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
else
    echo "❌ Docker Compose not found"
    exit 1
fi

# Stop all containers
echo "🛑 Stopping all containers..."
$COMPOSE_CMD down

# Option to remove volumes
read -p "Do you want to remove all data volumes? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️  Removing volumes..."
    $COMPOSE_CMD down -v
fi

# Option to remove images
read -p "Do you want to remove Docker images? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️  Removing images..."
    $COMPOSE_CMD down --rmi all
fi

# Clean up dangling images
echo "🧹 Cleaning up dangling images..."
docker image prune -f

# Clean up dangling volumes
echo "🧹 Cleaning up dangling volumes..."
docker volume prune -f

echo ""
echo "✅ Cleanup complete!"
echo ""
