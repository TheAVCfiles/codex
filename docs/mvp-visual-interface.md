# MvP Visual Interface & Orchestration

This directory contains the visual dashboard and orchestration system for the MvP product.

## Components

### 1. Visual Dashboard (`public/mvp-dashboard.html`)

A comprehensive real-time dashboard that provides:

- **Mesh Visualization**: Interactive graph showing all nodes (suites, engines, interfaces, data, narratives) and their dependencies
- **Orchestration Status**: Live progress tracking for running workflows
- **Machine-Agent Interaction Logs**: Real-time log viewer for system events
- **Node Details**: Click on any node to view detailed information
- **Health Monitoring**: Visual health indicators for each component
- **Quick Actions**: One-click execution of suites and mesh operations

#### Usage

1. **Open the dashboard**:
   ```bash
   # Serve the public directory (or open directly in browser)
   python3 -m http.server 8080
   # Then navigate to: http://localhost:8080/mvp-dashboard.html
   ```

2. **Features**:
   - View mesh structure with color-coded node types
   - Click nodes to see detailed information
   - Run orchestration to see live progress
   - Monitor system health in real-time
   - Export mesh data for analysis

### 2. Fallback-Friendly Orchestration (`ip_mesh/ops/orchestrate.py`)

A resilient orchestration engine that implements graceful degradation:

#### Key Features

- **Progressive Graceful Build Logic**: Continues execution even when components fail
- **Fallback Strategies**: Multiple entrypoints with automatic fallback
- **Comprehensive Logging**: Detailed execution logs with timestamps
- **Health Monitoring**: Tracks status of all nodes
- **JSON Reporting**: Generates detailed reports for analysis

#### Usage

```bash
# Run full orchestration
python3 ip_mesh/ops/orchestrate.py

# Run specific suite
python3 ip_mesh/ops/orchestrate.py --suite koll_finance_ritual

# Strict mode (stop on first failure)
python3 ip_mesh/ops/orchestrate.py --strict

# Custom output location
python3 ip_mesh/ops/orchestrate.py --output /path/to/report.json
```

#### Exit Codes

- `0`: Success or degraded (partial success)
- `1`: Failed

### 3. Mesh Status API (`api/mesh_status.py`)

REST API for querying mesh status and health:

#### Features

- Get current mesh data with health information
- Query orchestration status
- Get detailed node information
- Calculate system health score
- Trigger mesh rebuild

#### Usage

```python
from api.mesh_status import MeshStatusAPI

api = MeshStatusAPI()

# Get mesh data
mesh_data = api.get_mesh_data()

# Get health summary
health = api.get_health_summary()
print(f"Health Score: {health['health_score']}%")

# Get orchestration status
status = api.get_orchestration_status()

# Get node details
node_info = api.get_node_details('suite:koll_finance_ritual')
```

## Architecture

### Fallback Strategy

The orchestration system implements multiple levels of fallback:

1. **Component Level**: If a component fails, continue with degraded functionality
2. **Entrypoint Level**: If an entrypoint fails, try alternative entrypoints
3. **Mesh Level**: If mesh can't be loaded, use minimal fallback mesh

### Health Monitoring

Health is determined by:

- File existence checks
- Recent execution results
- Dependency availability
- Path validation

Health states:
- `healthy`: Component fully operational
- `degraded`: Component partially functional
- `failed`: Component unavailable or broken

### Status Tracking

All execution is tracked with:
- Timestamps
- Exit codes
- stdout/stderr capture
- Duration metrics
- Error messages

## Integration

### Dashboard ↔ API

The dashboard can integrate with the API for live data:

```javascript
// Fetch mesh data
const response = await fetch('/api/mesh_status/mesh');
const meshData = await response.json();
```

### Orchestration → Dashboard

The orchestration system generates reports that the dashboard can display:

1. Run orchestration: `python3 ip_mesh/ops/orchestrate.py`
2. Report is saved to: `ip_mesh/ops/orchestration_report.json`
3. Dashboard reads report for status updates

## Example Workflow

1. **Build the mesh**:
   ```bash
   python3 ip_mesh/ops/mesh_build.py
   ```

2. **Run orchestration**:
   ```bash
   python3 ip_mesh/ops/orchestrate.py
   ```

3. **View results in dashboard**:
   - Open `public/mvp-dashboard.html`
   - Click "Refresh Mesh" to load latest data
   - View execution logs and status

4. **Check health**:
   ```bash
   python3 api/mesh_status.py
   ```

## Error Handling

The system is designed to handle errors gracefully:

- **Missing Files**: Falls back to minimal mesh or skips components
- **Command Failures**: Continues with degraded status
- **Timeouts**: Commands timeout after 5 minutes
- **JSON Errors**: Returns error status with message

## Future Enhancements

Planned improvements:

- WebSocket support for real-time updates
- RESTful API endpoints for HTTP access
- Prometheus metrics export
- Alert system for failures
- Automated recovery actions
- Visualization of execution timeline

## Troubleshooting

### Dashboard shows no nodes

1. Check that mesh.json exists: `ls ip_mesh/ops/mesh.json`
2. Rebuild mesh: `python3 ip_mesh/ops/mesh_build.py`
3. Refresh dashboard

### Orchestration fails

1. Check logs in orchestration_report.json
2. Run with verbose output: `python3 ip_mesh/ops/orchestrate.py --strict`
3. Verify dependencies exist

### Health score is low

1. Check which nodes are failed: `python3 api/mesh_status.py`
2. Verify file paths in mesh.json
3. Run orchestration to update status

## License

See main repository LICENSE file.
