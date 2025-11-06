# Agent Token System

**Purpose**: Coordinate agents to prevent cascade failures

**Created by**: `/app-setup` command

---

## How It Works

Agents create completion tokens after successfully finishing their work:

```
.agent-tokens/
├── backend-complete.token      # Created by @app-backend-developer
├── frontend-complete.token     # Created by @app-frontend-developer
├── integration-complete.token  # Created by @app-full-stack
└── docs-complete.token         # Created by @app-spec-writer
```

**Dependency Chain**:
1. backend → 2. frontend → 3. integration → 4. docs

---

## Token Format

```json
{
  "agent": "backend-developer",
  "workspace": "/absolute/path/to/project",
  "status": "complete",
  "timestamp": "2025-10-28T14:22:00Z",
  "files_created": [
    "backend/api/routes/users.py",
    "backend/models/user.py"
  ],
  "next_agent": "frontend-developer"
}
```

---

## For Agents

**Before starting work**:
```bash
# Verify workspace
./verify-workspace.sh /expected/path

# Check prerequisites
if [ ! -f ".agent-tokens/backend-complete.token" ]; then
  echo "ERROR: Prerequisite not met"
  exit 1
fi
```

**After completing work**:
```bash
# Create completion token
cat > .agent-tokens/frontend-complete.token << 'TOKEN'
{
  "agent": "frontend-developer",
  "workspace": "$(pwd)",
  "status": "complete",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "files_created": ["src/components/UserList.jsx"],
  "next_agent": "full-stack-integration"
}
TOKEN
```

---

**Status**: Ready for agent coordination
