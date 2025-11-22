# Repository Structure

This document provides a comprehensive overview of the TheAVCfiles/codex repository organization, branch structure, and project components.

## Overview

This repository is a fork/extension of OpenAI's Codex CLI that includes additional infrastructure for the **DecryptTheGirl (DTG) Project** and related initiatives. The repository maintains both the original Codex CLI functionality and new project-specific components.

## Main Branch

The `main` branch serves as the stable, production-ready baseline containing:

### Core Codex CLI Components

- **codex-rs/**: Rust implementation of Codex CLI
  - Native executable for zero-dependency installation
  - Model Context Protocol (MCP) support
  - Sandbox security features (Seatbelt on macOS, Landlock on Linux)
  - TUI and headless execution modes

- **codex-cli/**: TypeScript/Node.js implementation
  - Legacy implementation being phased out
  - Still maintained for compatibility

### DTG Project Infrastructure

- **api/**: FastAPI event logging server
  - Event capture and processing
  - Cloudflare Worker integration
  - Database connectivity

- **data/**: Project data files
  - CSV ledgers and analytics
  - Event schemas
  - Proof of work records

- **docs/**: Documentation
  - `codex-de-ballet/`: Ballet folio system documentation and deliverables
  - `connectors-and-mcp-servers.md`: MCP integration guide
  - `emergency_gemini_sprint.md`: Emergency content generation playbook
  - Product concept documents

- **public/**: Web demos
  - Interactive HTML demonstrations
  - Zero Loss Zero Surprise interfaces

- **schema/**: JSON schemas
  - DTG event schemas
  - Data validation specs

- **scripts/**: Automation scripts
  - Curriculum generators
  - Data processing utilities
  - Postman collection generation

- **workflows/**: GitHub Actions CI/CD
  - Automated data pipeline
  - Balance calculations
  - SmallWallets toolbox integration

## Project Components

### 1. Codex CLI (Primary)

The core AI coding agent from OpenAI that runs locally.

**Key Features:**
- Terminal-based coding assistance
- File operations with sandbox security
- Multi-platform support (macOS, Linux, Windows)
- Shell command execution with approval workflows
- Model Context Protocol integration

**Location:** Root directory, `codex-rs/`, `codex-cli/`

### 2. DTG (DecryptTheGirl) Project

Innovative data logging and value-sharing platform.

**Key Features:**
- Real-time event capture
- Sentient Cents minting system
- Privacy-first design
- Automated analytics pipeline
- Proof ledger integrity

**Location:** `api/`, `data/`, `public/`, `schema/`, `.github/workflows/`

### 3. Codex de Ballet

Creative submission and folio system for ballet-inspired coding artifacts.

**Key Features:**
- Folio submission system
- Licensing framework (CODEX_LICENSE_V1)
- Authorship receipts
- Metadata tracking

**Location:** `docs/codex-de-ballet/`

### 4. SmallWallets Integration

API tooling and CI for SmallWallets financial services.

**Key Features:**
- OpenAPI specification
- Postman collection generation
- Automated validation workflows

**Location:** `smallwallets-openapi.json`, `postman.collection.json`, `scripts/generate_postman_collection.py`

## Branch Strategy

### Active Branches

All feature branches have been merged into `main` as of this organization effort. The repository maintains:

- **main**: Stable, production-ready code
- **Feature branches**: Preserved for historical reference

### Merged Feature Branches

The following branches have been successfully integrated into main:

1. **codex/finalize-and-deliver-codex-folio-#001**: Ballet folio deliverables
2. **codex/execute-emergency-content-generation-sprint**: Gemini credit sprint playbook
3. **codex/set-up-environment-for-api**: FastAPI event logging server

### Historical Branches (Preserved)

These branches are preserved for reference but their content has been superseded:

- `codex/add-connectors-and-remote-mcp-server-support`: MCP documentation (now in main)
- `codex/add-curriculum-generation-for-momentum`: Curriculum service (integrated in PR #9)
- `codex/add-endpoint-to-generate-curriculum`: API endpoints (superseded)
- `codex/add-github-actions-ci-and-postman-collection`: CI/CD (in main)
- `codex/create-codex-de-ballet-digital-product`: Ballet concept (in main)
- `codex/edit-documentation-for-grammar-and-clarity`: Documentation improvements (reviewed)
- `codex/implement-curriculum-generation-endpoint`: Curriculum API (superseded)
- `codex/refactor-curriculum-generator-error-handling`: Error handling (superseded)
- `copilot/fix-0a43936a-8dae-4c86-a28d-c60a10c0caab`: DTG scaffolding (merged in PR #4)

## Development Workflow

### Prerequisites

**For Codex CLI (Rust):**
```bash
# Install Rust toolchain
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Build Codex CLI
cd codex-rs
cargo build --release
```

**For DTG Project (Python/FastAPI):**
```bash
# Install dependencies
cd api
pip install -r requirements.txt

# Run API server
uvicorn app:app --reload
```

**For TypeScript CLI:**
```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Lint and format
pnpm lint
pnpm format:fix
```

### Testing

```bash
# Rust tests
cd codex-rs
cargo test

# TypeScript tests
pnpm test

# API tests (when implemented)
cd api
pytest
```

### Linting & Formatting

```bash
# Rust
cargo clippy
cargo fmt

# TypeScript
pnpm lint
pnpm format:fix

# Python
black api/
ruff check api/
```

## Configuration

### Codex CLI Configuration

- **Location:** `~/.codex/config.json` or `~/.codex/config.yaml`
- **Project docs:** `AGENTS.md` (root, global, or local)
- **Environment:** `.env` files supported

### DTG Configuration

- **Cloudflare Worker:** Deploy `api/worker.js`
- **GitHub Actions:** Workflows in `.github/workflows/`
- **Secrets:** Configure in GitHub repository settings

## Documentation

- **README.md**: Main project documentation
- **AGENTS.md**: Custom agent instructions
- **CHANGELOG.md**: Version history
- **docs/**: Detailed guides and specifications
- **LICENSE**: Apache-2.0 license
- **NOTICE**: Attribution notices

## Contributing

1. Fork the repository
2. Create a feature branch from `main`
3. Make focused, well-tested changes
4. Ensure all tests pass and code is linted
5. Submit a pull request with clear description
6. Sign the CLA when prompted

## Support & Resources

- **Issues:** GitHub Issues for bugs and features
- **Discussions:** GitHub Discussions for questions
- **Security:** Report vulnerabilities via security policy
- **License:** Apache-2.0 (see LICENSE file)

## Maintenance

This repository is actively maintained. The `main` branch is kept stable and deployable at all times. Feature development happens in branches and is merged via pull requests after review and testing.

### Current Status

✅ **Repository Organized**: All feature branches merged, structure documented  
✅ **Main Branch Stable**: Tests passing, builds successful  
✅ **Documentation Complete**: README, guides, and this structure document  
✅ **Historical Branches Preserved**: All branches maintained for reference  

---

*Last Updated: October 2025*  
*Maintainers: TheAVCfiles organization*
