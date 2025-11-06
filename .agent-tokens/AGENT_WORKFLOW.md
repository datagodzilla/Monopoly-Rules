# Agent Workflow Guide

**Project**: MONOPOLY_GAME_APP
**Workspace**: /Users/Wolverine/00_PROJECTS/MONOPOLY_GAME_APP
**Created**: 2025-11-05T00:00:00Z

---

## Recommended Agent Workflow

### Phase 1: Backend Development

**Agent**: `@app-backend-developer`

**Command**:
```
@app-backend-developer

WORKSPACE: /Users/Wolverine/00_PROJECTS/MONOPOLY_GAME_APP

VERIFICATION REQUIRED:
1. Run: pwd
2. Verify output EXACTLY matches: /Users/Wolverine/00_PROJECTS/MONOPOLY_GAME_APP
3. If mismatch: EXIT immediately with error

PREREQUISITES: None (first agent)

TASK: [Your backend task here - models, API routes, utilities]

OUTPUT: Create .agent-tokens/backend-complete.token when done
```

**Deliverables**:
- Backend data layer (models, schemas)
- API routes and endpoints
- Utility functions
- Token: `backend-complete.token`

---

### Phase 2: Frontend Development

**Agent**: `@app-frontend-developer`

**Command**:
```
@app-frontend-developer

WORKSPACE: /Users/Wolverine/00_PROJECTS/MONOPOLY_GAME_APP

VERIFICATION REQUIRED:
1. Run: pwd
2. Verify output EXACTLY matches: /Users/Wolverine/00_PROJECTS/MONOPOLY_GAME_APP
3. If mismatch: EXIT immediately with error

PREREQUISITES:
- backend-complete.token MUST exist

TASK: [Your frontend task here - components, forms, pages]

OUTPUT: Create .agent-tokens/frontend-complete.token when done
```

**Deliverables**:
- UI components
- Forms and interactions
- Client-side utilities
- Token: `frontend-complete.token`

---

### Phase 3: Full-Stack Integration

**Agent**: `@app-full-stack`

**Command**:
```
@app-full-stack

WORKSPACE: /Users/Wolverine/00_PROJECTS/MONOPOLY_GAME_APP

VERIFICATION REQUIRED:
1. Run: pwd
2. Verify output EXACTLY matches: /Users/Wolverine/00_PROJECTS/MONOPOLY_GAME_APP
3. If mismatch: EXIT immediately with error

PREREQUISITES:
- backend-complete.token MUST exist
- frontend-complete.token MUST exist

TASK: [Your integration task here - connect frontend to backend, wire up features]

OUTPUT: Create .agent-tokens/integration-complete.token when done
```

**Deliverables**:
- Frontend ↔ Backend integration
- API calls wired up
- Full features working end-to-end
- Build verification (npm run build succeeds)
- Token: `integration-complete.token`

---

### Phase 4: Documentation

**Agent**: `@app-spec-writer`

**Command**:
```
@app-spec-writer

WORKSPACE: /Users/Wolverine/00_PROJECTS/MONOPOLY_GAME_APP

VERIFICATION REQUIRED:
1. Run: pwd
2. Verify output EXACTLY matches: /Users/Wolverine/00_PROJECTS/MONOPOLY_GAME_APP
3. If mismatch: EXIT immediately with error

PREREQUISITES:
- integration-complete.token MUST exist

TASK: Document the complete application - features, API, setup, usage

OUTPUT: Create .agent-tokens/docs-complete.token when done
```

**Deliverables**:
- README.md (updated with features)
- API documentation
- User guide
- Development guide
- Token: `docs-complete.token`

---

## Best Practices

### ✅ DO

1. **Always verify workspace first** - Run pwd and compare
2. **Check prerequisites** - Verify required tokens exist
3. **Use absolute paths** - Never use relative paths in prompts
4. **Create tokens after completion** - Mark work as done
5. **Exit immediately on errors** - Don't try to recover

### ❌ DON'T

1. **Don't search for directories** - Use exact workspace path
2. **Don't skip verification** - Always check pwd
3. **Don't proceed without prerequisites** - Wait for tokens
4. **Don't create tokens on failure** - Only create on success
5. **Don't modify other agents' work** - Stay in your lane

---

## Monitoring Progress

**Check which agents have completed**:
```bash
ls -la .agent-tokens/*.token
```

**Verify token contents**:
```bash
cat .agent-tokens/backend-complete.token
```

**Check what's next**:
```bash
# If you have backend token but not frontend, run frontend agent next
# If you have both backend and frontend, run full-stack integration next
# If you have integration token, run spec-writer next
```

---

**Workflow Status**: Ready for agent execution
