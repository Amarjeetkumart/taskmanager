    # Docker Compose Version Guide

## Why "docker-compose: command not found"?

Docker has two versions of Compose:

### Docker Compose V1 (Old)
- **Command**: `docker-compose` (with hyphen)
- **Installation**: Separate binary
- **Status**: Deprecated (end of support)

### Docker Compose V2 (New)
- **Command**: `docker compose` (with space)
- **Installation**: Built into Docker CLI as a plugin
- **Status**: Current standard

## Quick Fix

**If you see "command not found"**, use the space syntax:

```bash
# ❌ Old syntax (V1)
docker-compose up -d

# ✅ New syntax (V2) - USE THIS
docker compose up -d
```

## Check Your Version

```bash
# Check if you have V2
docker compose version

# Check if you have V1
docker-compose version
```

## Common Commands Conversion

| Docker Compose V1 | Docker Compose V2 |
|-------------------|-------------------|
| `docker-compose up` | `docker compose up` |
| `docker-compose down` | `docker compose down` |
| `docker-compose build` | `docker compose build` |
| `docker-compose logs` | `docker compose logs` |
| `docker-compose ps` | `docker compose ps` |
| `docker-compose restart` | `docker compose restart` |
| `docker-compose exec` | `docker compose exec` |

## For This Project

All commands in the documentation work with **both** versions. Just replace:
- `docker-compose` → `docker compose`

### Examples for This Project

```bash
# Start all services
docker compose up -d --build

# View logs
docker compose logs -f

# Check status
docker compose ps

# Stop everything
docker compose down

# Remove all data
docker compose down -v
```

## If You Need V1 (Legacy)

If you specifically need the old `docker-compose` command:

### Ubuntu/Debian
```bash
sudo apt-get update
sudo apt-get install docker-compose-plugin
```

### macOS (Homebrew)
```bash
brew install docker-compose
```

### Manual Installation
```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

## Recommendation

**Use Docker Compose V2** (`docker compose` with space):
- ✅ Actively maintained
- ✅ Better performance
- ✅ Integrated with Docker
- ✅ New features
- ✅ Better error messages

## Quick Reference for This Project

```bash
# Setup and start everything
docker compose up --build -d

# Check if everything is running
docker compose ps

# View all logs
docker compose logs -f

# View specific service logs
docker compose logs -f frontend
docker compose logs -f task-service

# Restart a service
docker compose restart frontend

# Stop everything
docker compose down

# Stop and remove all data (⚠️ WARNING)
docker compose down -v

# Rebuild specific service
docker compose up -d --build frontend
```

## Troubleshooting

### "docker compose: command not found"

Your Docker installation is outdated. Update Docker:

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# macOS
# Update Docker Desktop from https://www.docker.com/products/docker-desktop

# Check installation
docker compose version
```

### Both commands fail

Docker might not be running or installed:

```bash
# Check if Docker is running
docker info

# If not, start Docker
sudo systemctl start docker

# If not installed, install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

## Summary

**Throughout this project's documentation:**
- When you see `docker-compose`, use `docker compose` (space)
- Both syntaxes do the same thing
- The space version is modern and recommended
