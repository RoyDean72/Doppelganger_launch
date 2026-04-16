#!/bin/bash
# Validate environment configuration
# Usage: ./scripts/validate-env.sh

ERRORS=0
WARNINGS=0

echo "Validating environment configuration..."

# Check .env exists
if [ ! -f .env ]; then
  echo "ERROR: .env file not found. Copy from .env.template"
  ((ERRORS++))
else
  echo "✓ .env file exists"
fi

# Validate required variables
required_vars=(
  "AGENT_RUNTIME_VERSION"
  "AGENT_ENVIRONMENT"
  "PRIMARY_MODEL_API_KEY"
  "STATE_STORAGE_TYPE"
)

for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "ERROR: Required variable $var is not set"
    ((ERRORS++))
  else
    echo "✓ $var is set"
  fi
done

# Validate file paths
paths=(
  "FUNCTIONS_SCHEMA_PATH"
  "PATTERN_STORAGE_PATH"
)

for path_var in "${paths[@]}"; do
  path=${!path_var}
  if [ -n "$path" ] && [ ! -f "$path" ] && [ ! -d "$path" ]; then
    echo "WARNING: Path $path_var ($path) does not exist"
    ((WARNINGS++))
  else
    echo "✓ $path_var path exists"
  fi
done

# Validate numeric ranges
if [ -n "$AGENT_WORKER_THREADS" ]; then
  if [ "$AGENT_WORKER_THREADS" -lt 1 ] || [ "$AGENT_WORKER_THREADS" -gt 32 ]; then
    echo "ERROR: AGENT_WORKER_THREADS must be between 1 and 32"
    ((ERRORS++))
  else
    echo "✓ AGENT_WORKER_THREADS in valid range"
  fi
fi

# Summary
echo ""
echo "Validation complete: $ERRORS errors, $WARNINGS warnings"

if [ $ERRORS -gt 0 ]; then
  exit 1
else
  echo "Environment is valid"
  exit 0
fi
