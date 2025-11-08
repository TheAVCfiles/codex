# Mesh Ops

This directory contains operational scripts for managing and executing the IP mesh ecosystem.

## Scripts Overview

- **`mesh_build.py`** - Assembles a dependency mesh from every `manifest.json`
- **`autopilot_scheduler.py`** - Orchestrates the canonical backtest-to-embodiment loop
- **`compose_suite.py`** - Suite orchestration tool that reads manifests and executes entrypoints

## compose_suite.py

A suite orchestration tool that reads suite manifests and executes their entrypoints with dependency validation.

### Features

- **Dependency Checking**: Verifies that `mesh_build.py` and other required files exist before execution
- **Mesh Refresh**: Optionally rebuilds the mesh by running `mesh_build.py`
- **Dependency Validation**: Checks that suite dependencies (includes) exist in the mesh
- **Suite Filtering**: Run specific suites by name filter
- **Error Handling**: Provides clear error messages for missing dependencies or failed operations

### Usage

```bash
# Run all suites
python ip_mesh/ops/compose_suite.py

# Run suites matching a name filter
python ip_mesh/ops/compose_suite.py koll_finance

# Refresh the mesh before running suites
python ip_mesh/ops/compose_suite.py --refresh-mesh

# Combine options: refresh mesh and run specific suite
python ip_mesh/ops/compose_suite.py koll_finance --refresh-mesh
```

### Suite Manifest Format

Suite manifests are located at `ip_mesh/suites/*/manifest.json` and follow this structure:

```json
{
  "type": "suite",
  "name": "example_suite",
  "version": "0.1.0",
  "includes": ["dependency_module", "another_module"],
  "entrypoints": [
    {
      "cli": "python path/to/script.py --arg value"
    }
  ],
  "outputs": ["path/to/outputs/*"],
  "licensing": { "tier": "private-edition" }
}
```

**Fields:**
- `type`: Must be "suite"
- `name`: Unique identifier for the suite
- `version`: Semantic version string
- `includes`: Array of dependency module names that must exist in the mesh
- `entrypoints`: Array of CLI commands to execute
- `outputs`: Array of glob patterns for output artifacts
- `licensing`: Licensing information

### Exit Codes

- `0`: All suites executed successfully
- `1`: Dependency check failed or mesh build failed
- `>0`: Maximum exit code from any failed entrypoint

### Error Handling

The script will:
- Print errors to stderr
- Continue executing other suites if one fails (unless mesh build fails)
- Warn about missing dependencies but still attempt to run the suite
- Exit with the highest return code from any failed operation

## mesh_build.py

Scans the IP mesh directory structure for manifest files and builds a dependency graph.

### Features

- Discovers all `manifest.json` files recursively
- Creates a node for each manifest with metadata
- Tracks dependencies via `depends_on` and `includes` fields
- Generates a `mesh.json` file with nodes and edges

### Usage

```bash
python ip_mesh/ops/mesh_build.py
```

### Output

Creates `ip_mesh/ops/mesh.json` with structure:

```json
{
  "nodes": {
    "type:name": {
      "type": "suite",
      "name": "example",
      "version": "0.1.0",
      "path": "suites/example",
      "hash": "abc123...",
      "metadata": {}
    }
  },
  "edges": [
    {"from": "suite:example", "to": "module:dependency"}
  ]
}
```

## Development

### Testing

```bash
# Test compose_suite with dependency checks
python ip_mesh/ops/compose_suite.py --refresh-mesh

# Test specific suite
python ip_mesh/ops/compose_suite.py koll_finance

# Test mesh build independently
python ip_mesh/ops/mesh_build.py
```

### Adding New Suites

1. Create a directory under `ip_mesh/suites/`
2. Add a `manifest.json` with required fields
3. Run `mesh_build.py` to update the mesh
4. Test with `compose_suite.py <suite_name>`

### Troubleshooting

**Error: "Missing required dependencies"**
- Ensure `mesh_build.py` exists in `ip_mesh/ops/`
- Check file permissions

**Error: "mesh build failed"**
- Check that all manifest files are valid JSON
- Ensure required fields (type, name) are present

**Warning: "missing dependencies in mesh"**
- The suite references modules that don't exist in the mesh
- Either add the missing module manifests or remove from `includes`
- Run with `--refresh-mesh` to rebuild the mesh

**Entrypoint fails**
- Check that the CLI command paths are correct
- Ensure Python scripts exist at specified paths
- Verify that any required configuration files are present
