# Secrets Management Guide

Secure handling of credentials and sensitive configuration for the .NET Self-Learning Architect.

## Table of Contents

- [Overview](#overview)
- [Secret Categories](#secret-categories)
- [Local Development](#local-development)
- [CI/CD Pipeline](#cicd-pipeline)
- [Production Deployment](#production-deployment)
- [Rotation Procedures](#rotation-procedures)
- [Incident Response](#incident-response)
- [Audit & Compliance](#audit--compliance)

---

## Overview

This agent requires access to:
- Cloud infrastructure (Azure)
- Source control (GitHub)
- AI model providers (OpenAI, Anthropic)

**Principle**: Secrets never committed to version control. Ever.

---

## Secret Categories

### Tier 1: Critical (Immediate Rotation on Exposure)

| Secret | Impact | Storage |
|--------|--------|---------|
| `AZURE_CLIENT_SECRET` | Full cloud control | Key Vault / Managed Identity |
| `GITHUB_TOKEN` (repo scope) | Source code access | GitHub Secrets |
| `OPENAI_API_KEY` | Billing & model access | Key Vault |
| `ANTHROPIC_API_KEY` | Billing & model access | Key Vault |

### Tier 2: Sensitive (Rotate Quarterly)

| Secret | Impact | Storage |
|--------|--------|---------|
| `AZURE_STORAGE_KEY` | Data access | Key Vault |
| `DATABASE_CONNECTION_STRING` | Database access | Key Vault |
| `REDIS_PASSWORD` | Cache access | Key Vault / Config (if isolated) |

### Tier 3: Internal (Rotate Annually)

| Secret | Impact | Storage |
|--------|--------|---------|
| `TELEMETRY_API_KEY` | Metrics ingestion | Environment variable |
| `LOG_ANALYTICS_KEY` | Log shipping | Managed Identity |

---

## Local Development

### Option 1: Azure Key Vault (Recommended)

```bash
# Login
az login

# Set up Key Vault for dev
az keyvault create --name agent-dev-kv --resource-group agent-dev-rg

# Store secrets
az keyvault secret set --vault-name agent-dev-kv \
  --name AzureClientSecret \
  --value "your-secret-here"

# Reference in .env (special syntax)
AZURE_CLIENT_SECRET=@https://agent-dev-kv.vault.azure.net/secrets/AzureClientSecret
