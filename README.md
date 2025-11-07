# Mega Monopoly Rules App

Display rules and moves for the Mega Monopoly board game based on dice rolls.

**🌐 Live Demo**: https://datagodzilla.github.io/Monopoly-Rules/

**Stack**: React + Flask
**Theme**: Playful, Minimalist, Colorful
**Accessibility**: WCAG AA compliant

Created: 2025-11-05

---

## Features

- Input dice values (2 regular dice + 1 Monopoly special dice)
- Display game rules and suggested moves
- Mobile-responsive web interface
- Accessible design (keyboard navigation, screen reader support)

---

## Agent-AI Enabled

This project includes **agent-ai** capabilities for AI-assisted development using the **app-builder** profile.

### 🤖 Available Commands

- `/app-setup` - Setup app environment
- `/app-code` - Generate app code (TDD)
- `/app-test` - Run tests (unit/integration/e2e)
- `/app-validate` - Validate app

### 🎯 Available Agents

- `@app-frontend-developer` - Frontend development
- `@app-backend-developer` - Backend development
- `@app-full-stack` - Full-stack features
- `@app-tester` - TDD workflows
- `@app-spec-writer` - Specifications

---

## Getting Started

### 1. Open in VSCode/Claude Code

```bash
# Clone the repository
git clone https://github.com/datagodzilla/Monopoly-Rules.git
cd Monopoly-Rules
code .
```

### 2. Start Using

- Type \`/\` in Claude Code chat to see all available commands
- Type \`@\` to see all available agents
- Agents and commands are profile-specific

---

## Setup

### Prerequisites

- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)

### Quick Start (Recommended)

```bash
# Launch both frontend and backend with one command
./launch-app.sh

# Launch without running tests (faster startup)
./launch-app.sh --skip-tests

# Check if app is running and view URLs
./status-app.sh

# Stop all servers
./stop-app.sh
```

The launch script will:
- ✅ Install dependencies if needed
- ✅ Run all tests (frontend + backend) - optional, use `--skip-tests` to skip
- ✅ Start backend at http://127.0.0.1:8000
- ✅ Start frontend at http://localhost:5173
- ✅ Verify all endpoints are working
- ✅ Show app URLs and status
- ✅ Optionally show live logs
- ✅ Stop both servers with Ctrl+C

### Manual Setup

#### Frontend

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Opens at http://localhost:5173
```

#### Backend

```bash
# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r backend/requirements.txt

# Start Flask server
python backend/app.py
# Runs at http://localhost:8000
```

---

## Testing (TDD-Ready)

### Frontend Tests

```bash
# Run once
npm test

# Watch mode (TDD)
npm run test:watch

# Coverage report
npm run test:coverage
```

### Backend Tests

```bash
# Activate virtual environment first
source venv/bin/activate

# Run tests
pytest tests/backend/

# With coverage
pytest --cov=backend tests/backend/
```

### E2E Tests

```bash
npm run test:e2e
```

---

## TDD Workflow

**Red-Green-Refactor**:

1. **Write failing test** (RED):
   ```bash
   npm run test:watch  # Keep running
   # Edit tests/components/MyComponent.test.jsx
   # See test FAIL ❌
   ```

2. **Implement code** (GREEN):
   ```bash
   # Edit src/components/MyComponent.jsx
   # See test PASS ✅
   ```

3. **Refactor** (REFACTOR):
   ```bash
   # Improve code quality
   # Tests still PASS ✅
   ```

---

## Project Structure

```
MONOPOLY_GAME_APP/
├── .claude/              # Claude Code configuration
│   ├── agents/           # Agent definitions
│   ├── commands/         # Slash commands
│   ├── templates/        # Project templates
│   └── config.yml        # Profile configuration
├── src/                  # Frontend source
│   ├── components/       # React components
│   ├── utils/            # Frontend utilities
│   └── assets/           # Images, styles
├── tests/                # Frontend tests
│   ├── components/       # Component tests
│   ├── integration/      # Integration tests
│   └── e2e/              # End-to-end tests
├── backend/              # Backend source
│   ├── api/
│   │   └── routes/       # API routes
│   ├── models/           # Data models
│   └── utils/            # Backend utilities
├── tests/backend/        # Backend tests
│   ├── unit/             # Unit tests
│   └── integration/      # Integration tests
└── .agent-tokens/        # Agent orchestration
    ├── verify-workspace.sh   # Workspace verification
    └── AGENT_WORKFLOW.md     # Agent workflow guide
```

---

## Agent Workflow

For multi-agent development, see [.agent-tokens/AGENT_WORKFLOW.md](.agent-tokens/AGENT_WORKFLOW.md)

**Recommended order**:
1. Backend Development (`@app-backend-developer`)
2. Frontend Development (`@app-frontend-developer`)
3. Full-Stack Integration (`@app-full-stack`)
4. Documentation (`@app-spec-writer`)

---

## Development Commands

| Task | Command |
|------|---------|
| **Quick launch** | `./launch-app.sh` |
| **Check status** | `./status-app.sh` |
| **Stop all servers** | `./stop-app.sh` |
| **Frontend dev** | `npm run dev` |
| **Backend dev** | `python backend/app.py` |
| **Frontend tests** | `npm test` |
| **Backend tests** | `pytest tests/backend/` |
| **E2E tests** | `npm run test:e2e` |
| **Build** | `npm run build` |
| **Lint** | `npm run lint` |

---

## Accessibility Features

- Semantic HTML (`<nav>`, `<main>`, `<button>`, `<article>`)
- ARIA attributes for dynamic content
- Full keyboard navigation support
- Sufficient color contrast (WCAG AA)
- Alt text for all images
- Screen reader compatible

---

## Next Steps

1. **Start the app**:
   ```bash
   # Quick start (recommended)
   ./launch-app.sh

   # Check if it's running
   ./status-app.sh

   # Or manually in separate terminals:
   # Terminal 1: Frontend
   npm run dev

   # Terminal 2: Backend
   python backend/app.py
   ```

2. **Start TDD workflow**:
   ```bash
   # Terminal 3: Frontend tests (watch mode)
   npm run test:watch
   ```

3. **Build features**:
   - ✅ Dice input component (2 regular + 1 special)
   - ✅ Dice animation component
   - ✅ Rules display component
   - ✅ Game logic with 7 Mega Monopoly rule categories
   - ✅ Detailed Speed Die rules (Bus, Mr. Monopoly, Question Mark)
   - ✅ Integration between frontend and backend

4. **Stop the app**:
   ```bash
   # Quick stop
   ./stop-app.sh

   # Or press Ctrl+C in terminal running ./launch-app.sh
   ```

---

**Built with TDD - Test First, Ship with Confidence!** 🚀

**Status**: Environment ready for development ✅
