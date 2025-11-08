# Code Choreography System

## Overview

The Code Choreography System treats software development automation as a performance art, where code sequences are "dancers" performing in coordinated stages. This metaphor makes complex CI/CD pipelines more intuitive and visually engaging.

## Philosophy

> "Code is not just logic - it's choreography. Each function, each workflow, each process is a dancer moving through stages, interacting with others, creating a performance that delivers value."

### Core Concepts

1. **Dancers** - Individual code sequences, scripts, or processes
2. **Stages** - Phases of the development pipeline (validation, testing, deployment)
3. **Roles** - Specific responsibilities assigned to dancers (validator, tester, deployer)
4. **Performance** - The complete execution of the pipeline from start to finish
5. **Choreography** - The orchestrated coordination of all dancers through all stages

## System Components

### 1. Pipeline Orchestrator Workflow

**File:** `.github/workflows/pipeline-orchestrator.yml`

The main conductor of the choreography. It coordinates three primary acts:

#### Act I - Validation Dance

- **Role:** Code Validator
- **Tasks:**
  - CSV header validation
  - JSON schema validation
  - Code style verification
- **Priority:** Critical
- **Duration:** ~30-60 seconds

#### Act II - Testing Dance

- **Role:** Test Executor
- **Tasks:**
  - Unit test execution
  - Integration test runs
  - End-to-end verification
- **Priority:** High
- **Duration:** ~1-3 minutes

#### Act III - Deployment Dance

- **Role:** Deployment Coordinator
- **Tasks:**
  - Pre-deployment checks
  - Build verification
  - Health status validation
- **Priority:** Normal
- **Duration:** ~30-60 seconds

### 2. Choreography Dashboard

**File:** `public/choreography-dashboard.html`

A visual interface for monitoring the performance in real-time.

#### Features:

- **Real-time Stage Visualization** - See which stage is active
- **Dancer Progress Tracking** - Monitor individual sequence progress
- **Performance Timeline** - View the flow of execution
- **Interactive Controls** - Start, pause, reset performances
- **Auto Mode** - Automated stage progression
- **Live Metrics** - Track success rates and timing
- **Event Log** - Detailed execution history

#### Usage:

```bash
# Open in browser
open public/choreography-dashboard.html

# Or serve via local server
python3 -m http.server 8000
# Then visit: http://localhost:8000/public/choreography-dashboard.html
```

### 3. Health Check & Rollback Workflow

**File:** `.github/workflows/health-check-rollback.yml`

Maintains the stability of the hosted MVP by continuously monitoring health.

#### Health Checks:

- **Critical Files** - Ensures all essential files are present
- **Workflow Validity** - Verifies GitHub Actions configurations
- **Data Integrity** - Validates CSV and JSON data files
- **Public Assets** - Checks HTML and static assets
- **Dependencies** - Verifies package configurations

#### Health Score Calculation:

```
Overall Score = (Files × 30% + Workflows × 25% + Data × 20% + Assets × 15% + Deps × 10%)
```

#### Status Levels:

- **Healthy** (≥80%): ✅ All systems operational
- **Warning** (60-79%): ⚠️ Attention needed
- **Critical** (<60%): 🚨 Immediate action required

#### Auto-Rollback:

When enabled and health drops below 60%, the system:

1. Identifies the last healthy commit
2. Creates a rollback plan
3. Generates detailed recovery instructions
4. Optionally triggers automated rollback

### 4. Stage Monitor Script

**File:** `scripts/stage-monitor.mjs`

A Node.js script for programmatic choreography management.

#### Available Roles:

| Role               | Emoji | Priority | Tasks                                                |
| ------------------ | ----- | -------- | ---------------------------------------------------- |
| Code Validator     | 🔍    | 1        | validate-csv, validate-json, validate-style          |
| Test Executor      | 🧪    | 2        | run-unit-tests, run-integration-tests, run-e2e-tests |
| Build Master       | 🏗️    | 3        | compile-code, bundle-assets, optimize                |
| Deploy Coordinator | 🚀    | 4        | pre-deploy-check, deploy, post-deploy-verify         |
| Health Monitor     | ❤️    | 5        | health-check, metrics-collection, alert-check        |

#### Usage:

```bash
# Run complete choreography
node scripts/stage-monitor.mjs run

# List available roles
node scripts/stage-monitor.mjs list-roles

# Show help
node scripts/stage-monitor.mjs help
```

#### Programmatic API:

```javascript
import { StageMonitor, ROLES } from "./scripts/stage-monitor.mjs";

const monitor = new StageMonitor();

// Create a stage
monitor.createStage("validation", "Validate all code");

// Assign a role
monitor.assignRole("dancer-01", "VALIDATOR", "HIGH");

// Start stage
await monitor.startStage("validation");

// Add dancer to stage
monitor.addDancerToStage("validation", "dancer-01");

// Perform sequence
await monitor.performSequence("dancer-01");

// Complete stage
monitor.completeStage("validation");

// Generate report
const report = monitor.generateReport();
```

## Integration with Existing Workflows

The choreography system enhances existing automation:

### Data Ingestion Pipeline

**Workflow:** `.github/workflows/ingest.yml`

Dancers:

- Event Fetcher (pulls data from Cloudflare Worker)
- Batch Normalizer (processes and categorizes events)
- Data Validator (ensures integrity)

### Balance Calculation

**Workflow:** `.github/workflows/balances.yml`

Dancers:

- Analytics Processor (calculates earnings)
- Balance Computer (materializes balances)
- Payout Checker (identifies eligible users)

### Continuous Integration

**Workflow:** `.github/workflows/ci.yml`

Dancers:

- Format Checker (validates style)
- Linter (enforces code quality)
- Test Runner (executes test suite)
- Build Verifier (ensures compilation)

## Running the System

### Manual Trigger

Trigger any stage manually via GitHub Actions:

```bash
# Via GitHub UI
1. Go to Actions tab
2. Select "Pipeline Orchestrator - Code Choreography"
3. Click "Run workflow"
4. Choose stage and priority

# Via GitHub CLI
gh workflow run pipeline-orchestrator.yml \
  -f stage=all \
  -f role_priority=high
```

### Automated Execution

The system runs automatically on:

- Push to `main` branch
- Pull requests to `main`
- Scheduled health checks (hourly)

### Local Development

Run the stage monitor locally:

```bash
# Install dependencies
npm install

# Run choreography
node scripts/stage-monitor.mjs run

# View dashboard
open public/choreography-dashboard.html
```

## Monitoring and Observability

### Performance Metrics

The system tracks:

- **Dancer Count** - Number of active sequences
- **Stage Completion** - Progress through pipeline
- **Elapsed Time** - Total performance duration
- **Success Rate** - Percentage of successful sequences

### Artifacts

Each performance generates artifacts:

- `choreography-validation` - Validation stage results
- `choreography-testing` - Testing stage results
- `choreography-deployment` - Deployment stage results
- `health-report-{run_number}` - Health check details

### Logs

All performances create detailed logs:

- Timestamp for each action
- Status updates for each dancer
- Error messages and warnings
- Performance summaries

## Customization

### Adding New Roles

Edit `scripts/stage-monitor.mjs`:

```javascript
const ROLES = {
  // ... existing roles ...
  MY_ROLE: {
    name: "My Custom Role",
    emoji: "🎨",
    priority: 6,
    color: "#ff6b6b",
    tasks: ["task-1", "task-2", "task-3"],
  },
};
```

### Adding New Stages

Edit `.github/workflows/pipeline-orchestrator.yml`:

```yaml
my-custom-stage:
  name: "🎭 My Custom Stage"
  runs-on: ubuntu-latest
  needs: [previous-stage]
  steps:
    - name: "💃 Perform Custom Dance"
      run: |
        echo "Custom stage logic here"
```

### Customizing Dashboard

Edit `public/choreography-dashboard.html`:

```javascript
// Add new stage
const state = {
  stages: ["validation", "testing", "deployment", "my-stage"],
  dancers: {
    "my-stage": [
      {
        name: "My Dancer",
        emoji: "🎨",
        progress: 0,
        color: "#ff6b6b",
        status: "idle",
      },
    ],
  },
};
```

## Best Practices

### 1. Role Assignment

- Use **CRITICAL** priority for blocking operations
- Use **HIGH** priority for important but non-blocking tasks
- Use **NORMAL** priority for standard operations
- Use **LOW** priority for optional enhancements

### 2. Stage Design

- Keep stages focused on single responsibilities
- Ensure stages can be run independently
- Include proper error handling
- Generate meaningful artifacts

### 3. Performance Optimization

- Run independent dancers in parallel
- Cache dependencies between runs
- Set appropriate timeouts
- Monitor resource usage

### 4. Error Handling

- Include retry logic for transient failures
- Generate detailed error reports
- Maintain rollback capabilities
- Alert on critical failures

## Troubleshooting

### Common Issues

#### Workflow Not Triggering

```bash
# Check workflow syntax
gh workflow view pipeline-orchestrator.yml

# Check trigger conditions
cat .github/workflows/pipeline-orchestrator.yml | grep -A 10 "on:"
```

#### Dancer Failing

```bash
# View dancer logs
gh run view --log

# Check specific job
gh run view <run-id> --job <job-id>
```

#### Dashboard Not Loading

```bash
# Verify file exists
ls -la public/choreography-dashboard.html

# Check for JavaScript errors in browser console
# Open DevTools -> Console tab
```

### Getting Help

1. Check workflow logs in GitHub Actions
2. Review artifacts from failed runs
3. Consult health check reports
4. Check the main README.md for project details

## Future Enhancements

Planned improvements:

- [ ] Real-time WebSocket updates to dashboard
- [ ] GitHub API integration for live workflow status
- [ ] Machine learning for performance optimization
- [ ] Advanced role dependencies and choreography patterns
- [ ] Integration with external monitoring tools
- [ ] Performance replay and debugging tools

## Contributing

To contribute to the choreography system:

1. Follow the existing metaphor and naming conventions
2. Add tests for new roles and stages
3. Update documentation
4. Include visual updates in the dashboard
5. Maintain backward compatibility

## License

This choreography system is part of the Codex project and follows the same license terms. See the main LICENSE file for details.

---

**Remember:** Every commit is a dance move. Make it count. Make it beautiful. 🎭✨
