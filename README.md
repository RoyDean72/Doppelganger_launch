 .NET Self-Learning Architect project.

---

File: `README.md`

```markdown
# .NET Self-Learning Architect

[![Build Status](https://github.com/yourorg/dotnet-self-learning-architect/workflows/CI/badge.svg)](https://github.com/yourorg/dotnet-self-learning-architect/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![.NET 8.0](https://img.shields.io/badge/.NET-8.0-512bd4)](https://dotnet.microsoft.com/download/dotnet/8.0)
[![Agent Version](https://img.shields.io/badge/Agent-v1.0.0-blue)](.github/agents/dotnet-architect/agent.json)

> A principal-level AI agent for enterprise .NET system design, implementation, and continuous learning.

## Overview

The .NET Self-Learning Architect orchestrates complex software delivery through intelligent execution planning, self-documenting architecture decisions, and persistent learning across projects.

### Key Capabilities

| Capability | Description |
|------------|-------------|
| **Architecture Design** | Design .NET 8+ systems with trade-off analysis and ADRs |
| **Execution Orchestration** | Choose parallel vs. coordinated team modes based on task dependencies |
| **Self-Learning** | Automatically document mistakes (Lessons) and durable context (Memories) |
| **Quality Validation** | Incremental checks with gates before broader validation |
| **Subagent Management** | Delegate to specialized roles with enforced learning contracts |

## Quick Start

### Prerequisites

- [.NET 8.0+ SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [VS Code](https://code.visualstudio.com/) (recommended)
- [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli) (for cloud deployments)
- [Docker](https://docs.docker.com/get-docker/) (optional, for containerized execution)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourorg/dotnet-self-learning-architect.git
cd dotnet-self-learning-architect

# Initialize environment
source scripts/set-env.sh development

# Validate configuration
./scripts/validate-env.sh

# Build the solution
dotnet build

# Run tests
dotnet test
```

First Run

```bash
# Start the CLI
dotnet run --project src/Agent.CLI

# Or use the shorthand
./agent.sh

# Check status
agent status

# Analyze a requirement
agent analyze "Build a microservice for user authentication with OAuth2"
```

Architecture

```
.github/
├── agents/dotnet-architect/          # Agent definition
│   ├── agent.json                    # Agent manifest
│   ├── functions.json                # Function schemas
│   ├── instructions.md               # System prompt
│   └── subagent-contracts/           # Role-specific contracts
│       ├── developer.json
│       ├── senior-developer.json
│       ├── test-engineer.json
│       └── devops-engineer.json
│
├── Lessons/                          # Mistake documentation (auto-generated)
│   └── L-ARC-0001.md
│
├── Memories/                         # Durable context (auto-generated)
│   └── M-DB-0003.md
│
└── workflows/                        # CI/CD automation
    └── validate-environment.yml

src/
├── Agent.Runtime/                    # Core execution engine
├── Agent.CLI/                        # Command-line interface
├── Agent.WebAPI/                     # HTTP API host
├── Agent.Learning/                   # Self-learning engine
└── Agent.Orchestration/              # Subagent coordination

tests/
├── Agent.Tests/                      # Unit & integration tests
└── FunctionValidation.Tests/         # JSON schema validation

infra/
└── terraform/                        # Azure infrastructure

docker/
├── Dockerfile
├── docker-compose.yml
└── .env.docker-compose

docs/
├── ENVIRONMENT.md                    # Configuration guide
├── SECRETS.md                        # Secrets management
└── ARCHITECTURE.md                   # System design docs
```

Core Functions

Function	Purpose	Typical Use	
`analyze_requirements`	Parse functional/non-functional requirements, constraints	Project kickoff	
`propose_architecture`	Design systems with trade-off analysis	Technical design	
`select_execution_mode`	Choose parallel vs. orchestrated execution	Task planning	
`spawn_subagent`	Delegate to specialized roles	Work distribution	
`run_orchestrated_team`	Coordinate multi-phase development	Complex delivery	
`record_lesson`	Document mistakes for prevention	Post-incident	
`capture_memory`	Store durable architecture decisions	Knowledge retention	
`dedupe_pattern`	Prevent duplicate learning artifacts	Pattern management	
`resolve_conflicts`	Handle contradictory guidance	Knowledge maintenance	
`run_incremental_check`	Validate small increments	Quality gates	
`summarize_progress`	Report outcomes and next actions	Status updates	

Execution Modes

Parallel Mode
For independent tasks with no shared write conflicts:

```bash
agent execute --mode=parallel --tasks="explore-api,explore-db,explore-auth"
```

Use cases:
- Independent codebase exploration
- Separate test impact analysis
- Documentation drafting

Orchestration Mode
For interdependent work requiring staged handoffs:

```bash
agent execute --mode=orchestrated --blueprint=auth-service-refactor
```

Phases:
1. Architecture → Design & ADR
2. Implementation → Code changes
3. Review → Senior developer gate
4. Test → Validation & coverage
5. Deploy → DevOps release

Self-Learning System

Lessons (`.github/Lessons/`)

Created when mistakes occur. Pattern ID format: `L-{CATEGORY}-{SEQUENCE}`

Example: `L-SEC-0042.md`

```markdown
# Lesson: Client Secret in Configuration

## Metadata
- PatternId: L-SEC-0042
- PatternVersion: 1
- Status: active
- CreatedAt: 2026-04-10

## Mistake
Stored Azure AD client secret in appsettings.json and committed to repository.

## Resolution
Moved to Azure Key Vault with Managed Identity access.

## Preventive Actions
- Added secret scanning to pre-commit hooks
- Required Key Vault reference in all templates
```

Memories (`.github/Memories/`)

Created for durable context. Pattern ID format: `M-{CATEGORY}-{SEQUENCE}`

Example: `M-ARC-0007.md`

```markdown
# Memory: Event Sourcing for Audit Trails

## Metadata
- PatternId: M-ARC-0007
- PatternVersion: 2
- Status: active
- Supersedes: M-ARC-0003

## Key Fact
Event Sourcing provides complete audit history but adds 40% storage overhead.

## Applicability
Use when: Regulatory compliance requires full history
Don't use when: Simple CRUD with soft-delete suffices
```

Pattern Governance

Rule	Enforcement	
Versioned	`PatternVersion` incremented on updates	
Deduplicated	Similar patterns merged, not duplicated	
Conflict Resolution	Old patterns marked `deprecated` or `blocked`	
Safety Gate	`blocked` patterns never applied	

Usage Examples

Analyze Requirements

```json
{
  "function": "analyze_requirements",
  "arguments": {
    "requirements": {
      "functional": [
        "OAuth2 authentication with Azure AD",
        "Real-time notifications via SignalR",
        "File upload to Azure Blob Storage"
      ],
      "nonFunctional": [
        "99.9% uptime SLA",
        "<50ms p95 API latency",
        "GDPR compliance"
      ],
      "constraints": [
        "Azure-only deployment",
        "ISO 27001 certification",
        "Existing SQL Server database"
      ]
    },
    "successCriteria": [
      "Load test passes at 5k RPS",
      "Security audit approved",
      "Deployment time <10 minutes"
    ],
    "confidenceThreshold": 0.85
  }
}
```

Spawn Subagent

```json
{
  "function": "spawn_subagent",
  "arguments": {
    "subagentRole": "developer",
    "taskBrief": {
      "objective": "Implement JWT authentication middleware",
      "acceptanceCriteria": [
        "Token validation works for valid JWTs",
        "Refresh token flow implemented",
        "401 returned for expired/invalid tokens"
      ],
      "filesToModify": [
        "src/Auth/JwtMiddleware.cs",
        "src/Auth/TokenService.cs"
      ],
      "filesToRead": [
        "src/Auth/AuthenticationExtensions.cs"
      ],
      "constraints": [
        "Use Microsoft.IdentityModel.Tokens",
        "No external JWT libraries"
      ]
    },
    "selfLearningContract": {
      "recordLessons": true,
      "captureMemories": true,
      "returnReasoning": true
    },
    "mode": "parallel"
  }
}
```

Record Lesson

```json
{
  "function": "record_lesson",
  "arguments": {
    "metadata": {
      "patternId": "L-SEC-0042",
      "patternVersion": 1,
      "status": "active"
    },
    "taskContext": {
      "triggeringTask": "Implement OAuth2 flow",
      "impactedArea": "Authentication",
      "severity": "high"
    },
    "mistake": {
      "whatWentWrong": "Client secret stored in appsettings.json and committed",
      "expectedBehavior": "Secret referenced from Azure Key Vault",
      "actualBehavior": "Secret visible in repository history"
    },
    "rootCause": {
      "primaryCause": "Developer unaware of Key Vault pattern",
      "contributingFactors": [
        "Template had placeholder secret",
        "No pre-commit secret scanning"
      ],
      "detectionGap": "Code review missed hardcoded value"
    },
    "resolution": {
      "fixImplemented": "Rotated secret, moved to Key Vault, added scanning",
      "whyFixWorks": "Eliminates secret from code, automated detection",
      "verificationPerformed": [
        "Secret no longer in repository",
        "Pre-commit hook blocks new secrets",
        "Key Vault access verified"
      ]
    },
    "preventiveActions": {
      "guardrails": [
        "Pre-commit secret scanning (truffleHog)",
        "Required Key Vault reference in templates"
      ],
      "testsAdded": [
        "Integration test for Key Vault resolution"
      ],
      "processUpdates": [
        "Security checklist for auth changes"
      ]
    }
  }
}
```

Configuration

Environment Files

File	Purpose	Environment	
`.env.template`	Master template with all variables	Reference	
`src/.env.template`	Runtime engine configuration	Development	
`src/Agent.Runtime/.env.runtime`	Core execution overrides	Runtime	
`src/Agent.CLI/.env.cli`	CLI tool settings	CLI	
`src/Agent.WebAPI/.env.web`	Web API host	Staging/Prod	
`tests/.env.test`	Test isolation	Testing	
`docker/.env.docker`	Container runtime	Docker	
`infra/terraform/.env.terraform`	Infrastructure as Code	Terraform	

Quick Configuration

```bash
# Development
source scripts/set-env.sh development

# Testing
source scripts/set-env.sh testing

# Staging
source scripts/set-env.sh staging

# Production
source scripts/set-env.sh production
```

See [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md) for complete configuration guide.

Secrets Management

All secrets stored in Azure Key Vault or GitHub Secrets. Never commit credentials.

```bash
# Store in Key Vault
az keyvault secret set \
  --vault-name agent-dev-kv \
  --name OpenAIApiKey \
  --value "sk-..."

# Reference in .env
OPENAI_API_KEY=@https://agent-dev-kv.vault.azure.net/secrets/OpenAIApiKey
```

See [docs/SECRETS.md](docs/SECRETS.md) for rotation procedures and incident response.

Docker Deployment

```bash
cd docker

# Start with observability stack
docker-compose --env-file .env.docker-compose up -d

# Services:
# - Agent Runtime: http://localhost:8080
# - Redis: localhost:6379
# - Jaeger: http://localhost:16686
# - Prometheus: http://localhost:9090
# - Grafana: http://localhost:3000
```

Azure Deployment

```bash
cd infra/terraform

# Initialize
terraform init

# Select workspace
terraform workspace select staging

# Plan
terraform plan -var-file=environments/staging.tfvars

# Apply
terraform apply -var-file=environments/staging.tfvars
```

Resources created:
- Azure App Service (agent API)
- Azure Functions (background tasks)
- Azure Service Bus (messaging)
- Azure Key Vault (secrets)
- Azure Monitor (telemetry)

Development

Build

```bash
dotnet build
```

Test

```bash
# Unit tests
dotnet test tests/Agent.Tests

# Integration tests
dotnet test tests/Agent.Tests --filter Category=Integration

# With coverage
dotnet test --collect:"XPlat Code Coverage"
```

Validate

```bash
# Environment
./scripts/validate-env.sh

# Function schemas
dotnet run --project src/Agent.CLI -- validate-schema

# Secret scan
trufflehog filesystem ./
```

Contributing

1. Propose changes via `propose_architecture` function
2. All subagents must return:
   - `LessonsSuggested`
   - `MemoriesSuggested`
   - `ReasoningSummary`
3. Deduplicate patterns before creating new ones
4. Validate with `run_incremental_check` before PR
5. Document in appropriate `.md` file

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

License

[MIT](LICENSE) © 2026 Willowdean72

References

- [.NET Architecture Guides](https://dotnet.microsoft.com/learn/dotnet/architecture-guides)
- [Azure Well-Architected Framework](https://learn.microsoft.com/azure/well-architected/)
- [GitHub Agents Beta](https://github.com/features/agents)
- [OpenAI Function Calling](https://platform.openai.com/docs/guides/function-calling)
- [Anthropic Tool Use](https://docs.anthropic.com/claude/docs/tool-use)

---

Status: Active Development | Version: 1.0.0 | Last Updated: 2026-04-16

```

---

Your README is ready! It covers everything from quick start to deep technical details, with clear navigation to your environment and secrets documentation. 🚀

