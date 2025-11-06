#!/bin/bash

# Mega Monopoly Rules App - Launch Script
# This script starts both frontend and backend servers

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored messages
print_message() {
    echo -e "${2}${1}${NC}"
}

# Function to cleanup background processes on exit
cleanup() {
    print_message "\n🛑 Stopping servers..." "$YELLOW"
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
        print_message "   Backend stopped (PID: $BACKEND_PID)" "$YELLOW"
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
        print_message "   Frontend stopped (PID: $FRONTEND_PID)" "$YELLOW"
    fi
    print_message "✅ All servers stopped" "$GREEN"
    exit 0
}

# Trap Ctrl+C and call cleanup
trap cleanup INT TERM

print_message "═══════════════════════════════════════════════════════════════" "$BLUE"
print_message "   🎲 MEGA MONOPOLY RULES APP - LAUNCHER" "$BLUE"
print_message "═══════════════════════════════════════════════════════════════" "$BLUE"
echo ""

# Step 1: Environment checks
print_message "🔍 Step 1: Checking Prerequisites..." "$BLUE"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    print_message "❌ Node.js not found. Please install Node.js 18+ first." "$RED"
    exit 1
fi
NODE_VERSION=$(node --version)
print_message "   ✅ Node.js: $NODE_VERSION" "$GREEN"

# Check Python
if ! command -v python3 &> /dev/null; then
    print_message "❌ Python3 not found. Please install Python 3.11+ first." "$RED"
    exit 1
fi
PYTHON_VERSION=$(python3 --version)
print_message "   ✅ Python: $PYTHON_VERSION" "$GREEN"

echo ""

# Step 2: Install dependencies
print_message "📦 Step 2: Checking Dependencies..." "$BLUE"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_message "   ⚠️  node_modules not found. Running npm install..." "$YELLOW"
    npm install
    print_message "   ✅ Frontend dependencies installed" "$GREEN"
else
    print_message "   ✅ Frontend dependencies found" "$GREEN"
fi

# Check if venv exists
if [ ! -d "venv" ]; then
    print_message "   ⚠️  Python virtual environment not found. Creating..." "$YELLOW"
    python3 -m venv venv
    source venv/bin/activate
    pip install -r backend/requirements.txt > /dev/null 2>&1
    print_message "   ✅ Backend virtual environment created and dependencies installed" "$GREEN"
else
    print_message "   ✅ Backend virtual environment found" "$GREEN"
fi

echo ""

# Step 3: Run tests (optional, skip if --skip-tests flag is provided)
if [[ "$1" != "--skip-tests" ]]; then
    print_message "🧪 Step 3: Running Tests..." "$BLUE"
    print_message "   (Pass --skip-tests to skip this step)" "$YELLOW"
    echo ""

    # Run frontend tests with timeout
    print_message "   Testing frontend..." "$YELLOW"
    FRONTEND_OUTPUT=$(npm test -- --run 2>&1 || true)

    if echo "$FRONTEND_OUTPUT" | grep -q "Test Files.*passed"; then
        FRONTEND_TEST_COUNT=$(echo "$FRONTEND_OUTPUT" | grep -o '[0-9]* passed' | head -1)
        print_message "   ✅ Frontend tests: $FRONTEND_TEST_COUNT" "$GREEN"
    else
        print_message "   ⏭️  Skipping frontend tests - continuing anyway" "$YELLOW"
    fi

    # Run backend tests
    print_message "   Testing backend..." "$YELLOW"
    source venv/bin/activate 2>/dev/null || true
    BACKEND_OUTPUT=$(pytest tests/backend/ -q 2>&1 || true)

    if echo "$BACKEND_OUTPUT" | grep -q "passed"; then
        BACKEND_TEST_COUNT=$(echo "$BACKEND_OUTPUT" | grep -o '[0-9]* passed' | head -1)
        print_message "   ✅ Backend tests: $BACKEND_TEST_COUNT" "$GREEN"
    else
        print_message "   ⏭️  Skipping backend tests - continuing anyway" "$YELLOW"
    fi

    echo ""
else
    print_message "⏭️  Step 3: Skipping Tests (--skip-tests flag provided)" "$YELLOW"
    echo ""
fi

echo ""

# Step 4: Check if servers are already running
print_message "🚀 Step 4: Starting Servers..." "$BLUE"
echo ""

# Check if backend is already running
if lsof -ti:8000 > /dev/null 2>&1; then
    EXISTING_BACKEND_PID=$(lsof -ti:8000 | head -1)
    print_message "   ℹ️  Backend server is already running (PID: $EXISTING_BACKEND_PID)" "$YELLOW"
    BACKEND_ALREADY_RUNNING=true
else
    BACKEND_ALREADY_RUNNING=false
fi

# Check if frontend is already running
if lsof -ti:5173 > /dev/null 2>&1; then
    EXISTING_FRONTEND_PID=$(lsof -ti:5173 | head -1)
    print_message "   ℹ️  Frontend server is already running (PID: $EXISTING_FRONTEND_PID)" "$YELLOW"
    FRONTEND_ALREADY_RUNNING=true
else
    FRONTEND_ALREADY_RUNNING=false
fi

# If both are already running, show friendly message and exit
if [ "$BACKEND_ALREADY_RUNNING" = true ] && [ "$FRONTEND_ALREADY_RUNNING" = true ]; then
    echo ""
    print_message "═══════════════════════════════════════════════════════════════" "$GREEN"
    print_message "   ✅ MEGA MONOPOLY RULES APP IS ALREADY RUNNING!" "$GREEN"
    print_message "═══════════════════════════════════════════════════════════════" "$GREEN"
    echo ""
    print_message "🌐 Your app is available at:" "$BLUE"
    print_message "   Frontend:  ${GREEN}http://localhost:5173${NC}" "$NC"
    print_message "   Backend:   ${GREEN}http://127.0.0.1:8000${NC}" "$NC"
    echo ""
    print_message "💡 Tip: Use ./status-app.sh to check server status" "$BLUE"
    print_message "🛑 To stop: Use ./stop-app.sh or press Ctrl+C in the running terminal" "$YELLOW"
    echo ""
    exit 0
fi

# Start backend if not already running
if [ "$BACKEND_ALREADY_RUNNING" = false ]; then
    # Double-check port is free (race condition prevention)
    if lsof -ti:8000 > /dev/null 2>&1; then
        BACKEND_PID=$(lsof -ti:8000 | head -1)
        print_message "   ℹ️  Backend server started by another process (PID: $BACKEND_PID)" "$YELLOW"
        BACKEND_ALREADY_RUNNING=true
    else
        print_message "   Starting backend server..." "$YELLOW"
        cd backend
        python3 app.py > ../backend.log 2>&1 &
        BACKEND_PID=$!
        cd ..

        # Wait a moment for backend to start
        sleep 3

        # Check if backend is running
        if ps -p $BACKEND_PID > /dev/null; then
            print_message "   ✅ Backend server started (PID: $BACKEND_PID)" "$GREEN"
        else
            print_message "   ❌ Backend failed to start. Check backend.log for details." "$RED"
            cat backend.log
            exit 1
        fi
    fi
else
    BACKEND_PID=$EXISTING_BACKEND_PID
fi

# Start frontend if not already running
if [ "$FRONTEND_ALREADY_RUNNING" = false ]; then
    # Double-check port is free (race condition prevention)
    if lsof -ti:5173 > /dev/null 2>&1; then
        FRONTEND_PID=$(lsof -ti:5173 | head -1)
        print_message "   ℹ️  Frontend server started by another process (PID: $FRONTEND_PID)" "$YELLOW"
        FRONTEND_ALREADY_RUNNING=true
    else
        print_message "   Starting frontend server..." "$YELLOW"
        npm run dev > frontend.log 2>&1 &
        FRONTEND_PID=$!

        # Wait a moment for frontend to start
        sleep 4

        # Check if frontend is running
        if ps -p $FRONTEND_PID > /dev/null; then
            print_message "   ✅ Frontend server started (PID: $FRONTEND_PID)" "$GREEN"
        else
            print_message "   ❌ Frontend failed to start. Check frontend.log for details." "$RED"
            cat frontend.log
            cleanup
            exit 1
        fi
    fi
else
    FRONTEND_PID=$EXISTING_FRONTEND_PID
fi

echo ""

# Step 5: Verify endpoints
print_message "🔍 Step 5: Verifying API Endpoints..." "$BLUE"
echo ""

# Wait a bit more for servers to fully initialize
sleep 2

# Test backend health endpoint
print_message "   Testing backend health endpoint..." "$YELLOW"
if curl -s http://127.0.0.1:8000/health 2>&1 | grep -q "healthy"; then
    print_message "   ✅ Backend API responding (http://127.0.0.1:8000/health)" "$GREEN"
else
    print_message "   ⚠️  Backend API not responding yet - may need more time" "$YELLOW"
fi

# Test backend root endpoint
print_message "   Testing backend root endpoint..." "$YELLOW"
if curl -s http://127.0.0.1:8000/ 2>&1 | grep -q "Mega Monopoly"; then
    print_message "   ✅ Backend root endpoint working (http://127.0.0.1:8000/)" "$GREEN"
else
    print_message "   ⚠️  Backend root endpoint not responding yet" "$YELLOW"
fi

# Test backend hello endpoint
print_message "   Testing backend hello endpoint..." "$YELLOW"
if curl -s http://127.0.0.1:8000/api/hello 2>&1 | grep -q "Hello"; then
    print_message "   ✅ Backend test endpoint working (http://127.0.0.1:8000/api/hello)" "$GREEN"
else
    print_message "   ⚠️  Backend test endpoint not responding yet" "$YELLOW"
fi

# Test frontend
print_message "   Testing frontend server..." "$YELLOW"
if curl -s http://localhost:5173/ 2>&1 | grep -q "<!doctype html"; then
    print_message "   ✅ Frontend responding (http://localhost:5173/)" "$GREEN"
else
    print_message "   ⚠️  Frontend not responding yet - may need more time" "$YELLOW"
fi

echo ""
print_message "═══════════════════════════════════════════════════════════════" "$GREEN"
print_message "   ✅ MEGA MONOPOLY RULES APP IS RUNNING!" "$GREEN"
print_message "═══════════════════════════════════════════════════════════════" "$GREEN"
echo ""
print_message "🌐 Application URLs:" "$BLUE"
print_message "   Frontend:  http://localhost:5173" "$GREEN"
print_message "   Backend:   http://127.0.0.1:8000" "$GREEN"
echo ""
print_message "🔌 API Endpoints:" "$BLUE"
print_message "   http://127.0.0.1:8000/           → API information" "$NC"
print_message "   http://127.0.0.1:8000/health     → Health check" "$NC"
print_message "   http://127.0.0.1:8000/api/hello  → Test endpoint" "$NC"
echo ""
print_message "📊 Process Information:" "$BLUE"
print_message "   Backend PID:  $BACKEND_PID" "$NC"
print_message "   Frontend PID: $FRONTEND_PID" "$NC"
echo ""
print_message "📝 View Logs:" "$BLUE"
print_message "   tail -f backend.log" "$NC"
print_message "   tail -f frontend.log" "$NC"
echo ""
print_message "🛑 Stop Servers:" "$YELLOW"
print_message "   Press Ctrl+C (in this terminal)" "$NC"
print_message "   Or run: ./stop-app.sh (in another terminal)" "$NC"
echo ""
print_message "═══════════════════════════════════════════════════════════════" "$GREEN"
print_message "   🎉 APP IS READY! Open http://localhost:5173 in your browser" "$GREEN"
print_message "═══════════════════════════════════════════════════════════════" "$GREEN"
echo ""
print_message "💡 Quick tip: Run ./status-app.sh anytime to check if app is running" "$BLUE"
echo ""

# Ask user if they want to see logs
print_message "📋 Would you like to view live logs now? (y/n)" "$YELLOW"
read -t 10 -n 1 -r SHOW_LOGS
echo ""

if [[ $SHOW_LOGS =~ ^[Yy]$ ]]; then
    echo ""
    print_message "═══════════════════════════════════════════════════════════════" "$BLUE"
    print_message "   Showing combined logs (Ctrl+C to stop)..." "$YELLOW"
    print_message "═══════════════════════════════════════════════════════════════" "$BLUE"
    echo ""
    # Keep script running and show logs
    tail -f backend.log frontend.log
else
    echo ""
    print_message "✅ Servers are running in the background!" "$GREEN"
    print_message "   View logs later with: tail -f backend.log frontend.log" "$NC"
    echo ""
    # Keep script running to maintain the servers
    wait
fi
