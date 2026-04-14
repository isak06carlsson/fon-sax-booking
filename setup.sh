#!/bin/bash

# Quick setup script for Fön Sax Booking System

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "==============================================="
echo "Fön Sax Booking System - Setup"
echo "==============================================="
echo ""

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js from https://nodejs.org/${NC}"
    exit 1
fi

echo "Installing frontend dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to install frontend dependencies${NC}"
    exit 1
fi

echo ""
echo "Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to install backend dependencies${NC}"
    exit 1
fi

echo ""
echo "Skipping DB bootstrap in setup script."
echo "Set backend/.env DATABASE_URL first, then run:"
echo "  cd backend && npm run db:init"
cd ..

echo ""
echo "==============================================="
echo -e "${GREEN}Setup completed successfully!${NC}"
echo "==============================================="
echo ""
echo "To start development:"
echo "  Option 1 (recommended): npm run dev:full"
echo "  Option 2 (separate terminals):"
echo "     Terminal 1: npm run dev"
echo "     Terminal 2: npm run dev:backend"
echo ""
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:3001"
echo ""
echo "Admin credentials: set ADMIN_PASSWORD in backend/.env"
echo ""
