#!/bin/bash
# Workspace Verification Script
# Usage: ./verify-workspace.sh <expected-path>

EXPECTED_WORKSPACE="$1"
CURRENT_DIR=$(pwd)

if [ -z "$EXPECTED_WORKSPACE" ]; then
  echo "❌ ERROR: No expected workspace provided"
  echo "Usage: $0 <expected-path>"
  exit 1
fi

if [ "$CURRENT_DIR" != "$EXPECTED_WORKSPACE" ]; then
  echo "❌ ERROR: Wrong directory"
  echo "   Current:  $CURRENT_DIR"
  echo "   Expected: $EXPECTED_WORKSPACE"
  echo ""
  echo "   Action: cd \"$EXPECTED_WORKSPACE\""
  exit 1
fi

echo "✅ Workspace verified: $CURRENT_DIR"
exit 0
