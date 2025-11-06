#!/bin/bash

# Mega Monopoly Rules App - Stop Script
# Stops all running frontend and backend servers

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🛑 Stopping Mega Monopoly Rules App...${NC}"
echo ""

# Stop backend (Flask on port 8000)
BACKEND_PIDS=$(lsof -ti:8000)
if [ ! -z "$BACKEND_PIDS" ]; then
    echo -e "${YELLOW}Stopping backend server (port 8000)...${NC}"
    kill $BACKEND_PIDS 2>/dev/null || true
    sleep 1
    echo -e "${GREEN}✅ Backend stopped${NC}"
else
    echo -e "${YELLOW}ℹ️  Backend not running${NC}"
fi

# Stop frontend (Vite on port 5173)
FRONTEND_PIDS=$(lsof -ti:5173)
if [ ! -z "$FRONTEND_PIDS" ]; then
    echo -e "${YELLOW}Stopping frontend server (port 5173)...${NC}"
    kill $FRONTEND_PIDS 2>/dev/null || true
    sleep 1
    echo -e "${GREEN}✅ Frontend stopped${NC}"
else
    echo -e "${YELLOW}ℹ️  Frontend not running${NC}"
fi

echo ""
echo -e "${GREEN}✅ All servers stopped${NC}"
