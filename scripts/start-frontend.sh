#!/bin/bash

# Frontend Development Setup Script
# This script helps set up and run the frontend for development

set -e

FRONTEND_DIR="frontend"
BOLD='\033[1m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BOLD}=== Task Manager Frontend Setup ===${NC}\n"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    echo "Please install Node.js 18 or higher from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✓ Node.js version: $(node --version)${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ npm version: $(npm --version)${NC}\n"

# Navigate to frontend directory
if [ ! -d "$FRONTEND_DIR" ]; then
    echo -e "${RED}Error: Frontend directory not found${NC}"
    exit 1
fi

cd "$FRONTEND_DIR"

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install

echo -e "\n${GREEN}✓ Dependencies installed successfully${NC}\n"

# Ask user what to do
echo -e "${BOLD}What would you like to do?${NC}"
echo "1) Start development server"
echo "2) Build for production"
echo "3) Preview production build"
echo "4) Run linter"
echo "5) Exit"

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo -e "\n${YELLOW}Starting development server...${NC}"
        echo -e "${GREEN}Frontend will be available at http://localhost:5173${NC}\n"
        npm run dev
        ;;
    2)
        echo -e "\n${YELLOW}Building for production...${NC}"
        npm run build
        echo -e "\n${GREEN}✓ Production build created in dist/${NC}"
        ;;
    3)
        echo -e "\n${YELLOW}Starting preview server...${NC}"
        npm run preview
        ;;
    4)
        echo -e "\n${YELLOW}Running linter...${NC}"
        npm run lint
        ;;
    5)
        echo -e "\n${GREEN}Goodbye!${NC}"
        exit 0
        ;;
    *)
        echo -e "\n${RED}Invalid choice${NC}"
        exit 1
        ;;
esac
