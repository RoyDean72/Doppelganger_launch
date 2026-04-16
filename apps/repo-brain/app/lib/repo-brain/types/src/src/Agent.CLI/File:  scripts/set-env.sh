#!/bin/bash
# Environment setup script for .NET Self-Learning Architect
# Usage: source scripts/set-env.sh [environment]

ENVIRONMENT=${1:-development}

echo "Setting up environment: $ENVIRONMENT"

case $ENVIRONMENT in
  development|dev)
    export DOTNET_ENVIRONMENT=Development
    export AGENT_ENVIRONMENT=Development
    cp src/.env.template .env
    cp src/Agent.Runtime/.env.runtime src/Agent.Runtime/.env
    echo "Development environment configured"
    ;;
    
  testing|test)
    export DOTNET_ENVIRONMENT=Testing
    export AGENT_ENVIRONMENT=Testing
    cp tests/.env.test .env
    echo "Test environment configured"
    ;;
    
  staging|stage)
    export DOTNET_ENVIRONMENT=Staging
    export AGENT_ENVIRONMENT=Staging
    cp src/Agent.WebAPI/.env.web .env
    echo "Staging environment configured"
    ;;
    
  production|prod)
    export DOTNET_ENVIRONMENT=Production
    export AGENT_ENVIRONMENT=Production
    echo "WARNING: Production environment - ensure .env is properly configured"
    ;;
    
  *)
    echo "Unknown environment: $ENVIRONMENT"
    echo "Usage: source scripts/set-env.sh [development|testing|staging|production]"
    return 1
    ;;
esac

# Validate required variables
if [ -f .env ]; then
  set -a
  source .env
  set +a
  
  # Check critical variables
  if [ -z "$AGENT_RUNTIME_VERSION" ]; then
    echo "ERROR: AGENT_RUNTIME_VERSION not set"
    return 1
  fi
  
  echo "Environment variables loaded from .env"
fi

echo "Agent instance: $AGENT_INSTANCE_ID"
echo "Log level: $LOG_LEVEL"
