#!/bin/bash

# Mega Monopoly Rules App - Status Checker
# Quick script to check if the app is running and show URLs

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   🎲 MEGA MONOPOLY RULES APP - STATUS CHECK${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# Check if frontend is running
if lsof -ti:5173 > /dev/null 2>&1; then
    FRONTEND_PID=$(lsof -ti:5173)
    echo -e "${GREEN}✅ Frontend Server: RUNNING${NC}"
    echo -e "   URL: ${GREEN}http://localhost:5173${NC}"
    echo -e "   PID: $FRONTEND_PID"
else
    echo -e "${RED}❌ Frontend Server: NOT RUNNING${NC}"
    echo -e "   Expected URL: http://localhost:5173"
fi

echo ""

# Check if backend is running
if lsof -ti:8000 > /dev/null 2>&1; then
    BACKEND_PID=$(lsof -ti:8000)
    echo -e "${GREEN}✅ Backend Server: RUNNING${NC}"
    echo -e "   URL: ${GREEN}http://127.0.0.1:8000${NC}"
    echo -e "   PID: $BACKEND_PID"

    # Test health endpoint
    if curl -s http://127.0.0.1:8000/health 2>&1 | grep -q "healthy"; then
        echo -e "   Health: ${GREEN}✅ Healthy${NC}"
    else
        echo -e "   Health: ${YELLOW}⚠️  Not responding${NC}"
    fi
else
    echo -e "${RED}❌ Backend Server: NOT RUNNING${NC}"
    echo -e "   Expected URL: http://127.0.0.1:8000"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"

# Show launch script processes if any
LAUNCH_PIDS=$(ps aux | grep -E "(launch-app|run_app)" | grep -v grep | awk '{print $2}' | tr '\n' ' ')
if [ ! -z "$LAUNCH_PIDS" ]; then
    echo -e "${YELLOW}📋 Launch script processes: $LAUNCH_PIDS${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
fi

echo ""

# Show quick actions
if lsof -ti:5173 > /dev/null 2>&1 || lsof -ti:8000 > /dev/null 2>&1; then
    echo -e "${YELLOW}🛑 To stop the app:${NC}"
    echo -e "   ./stop-app.sh"
    echo ""
    echo -e "${BLUE}📝 To view logs:${NC}"
    echo -e "   tail -f backend.log frontend.log"
else
    echo -e "${GREEN}🚀 To start the app:${NC}"
    echo -e "   ./launch-app.sh"
fi

echo ""
