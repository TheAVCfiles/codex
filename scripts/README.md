# Scripts Directory

This directory contains automation scripts for the Codex project.

## Code Choreography Scripts

### stage-monitor.mjs

A Node.js script for managing code choreography and pipeline automation.

**Purpose:** Treats code sequences as "dancers" performing through stages, making CI/CD pipelines more intuitive and visually engaging.

**Usage:**

```bash
# Run complete choreography
node scripts/stage-monitor.mjs run

# List available roles
node scripts/stage-monitor.mjs list-roles

# Show help
node scripts/stage-monitor.mjs help
```

**Features:**

- Role assignment system (Validator, Tester, Builder, Deployer, Monitor)
- Stage management and coordination
- Performance tracking and reporting
- Priority-based execution
- Detailed logging

**See also:** [Code Choreography Documentation](../docs/code-choreography.md)

## Data Processing Scripts

### csv_headers.mjs

Validates and fixes CSV file headers for data integrity.

**Usage:**

```bash
# Validate CSV headers
node scripts/csv_headers.mjs validate

# Fix CSV headers
node scripts/csv_headers.mjs fix
```

### normalize_batch.mjs

Normalizes and processes event batches for the DTG system.

**Usage:**

```bash
# Process events
node scripts/normalize_batch.mjs process events.json analytics
```

## Utility Scripts

### asciicheck.py

Ensures markdown files contain only ASCII and certain allowed Unicode code points.

### readme_toc.py

Validates and updates table of contents in README files.

### generate_postman_collection.py

Generates Postman collection from OpenAPI spec.

## Contributing

When adding new scripts:

1. Follow existing naming conventions
2. Include clear usage documentation
3. Add error handling
4. Update this README
5. Add tests if applicable
