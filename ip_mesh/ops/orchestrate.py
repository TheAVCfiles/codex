"""
Fallback-friendly orchestration system with graceful degradation.

This module provides a resilient orchestration layer that ensures processes
remain functional even if intermediate datasets or flows fail. It implements:
- Progressive graceful degradation
- Comprehensive error handling
- Status tracking and reporting
- Fallback strategies for each component
"""

from __future__ import annotations

import json
import os
import subprocess
import sys
import datetime
import traceback
from pathlib import Path
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
from enum import Enum


class NodeStatus(Enum):
    """Status of a node in the orchestration."""
    PENDING = "pending"
    RUNNING = "running"
    SUCCESS = "success"
    FAILED = "failed"
    DEGRADED = "degraded"  # Partial success
    SKIPPED = "skipped"


@dataclass
class ExecutionResult:
    """Result of executing a node."""
    node_id: str
    status: NodeStatus
    exit_code: int
    stdout: str
    stderr: str
    duration_seconds: float
    timestamp: str
    error_message: Optional[str] = None
    fallback_used: bool = False
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization."""
        result = asdict(self)
        result['status'] = self.status.value
        return result


class OrchestrationEngine:
    """
    Orchestration engine with fallback strategies.
    
    Features:
    - Graceful degradation when components fail
    - Dependency resolution with fallbacks
    - Progress tracking and logging
    - Health monitoring
    """
    
    def __init__(self, mesh_path: Optional[Path] = None):
        """Initialize the orchestration engine."""
        self.root = Path(__file__).resolve().parents[1]
        self.mesh_path = mesh_path or self.root / "ops" / "mesh.json"
        self.mesh_data: Dict[str, Any] = {}
        self.execution_log: List[ExecutionResult] = []
        self.node_status: Dict[str, NodeStatus] = {}
        self.allow_degraded = True  # Continue on partial failures
        
    def load_mesh(self) -> bool:
        """Load mesh data with fallback."""
        try:
            if not self.mesh_path.exists():
                self._log("WARNING", f"Mesh file not found: {self.mesh_path}")
                self._log("INFO", "Attempting to build mesh...")
                if not self._build_mesh():
                    self._log("ERROR", "Failed to build mesh, using minimal fallback")
                    self.mesh_data = self._get_minimal_mesh()
                    return False
                    
            with open(self.mesh_path, 'r', encoding='utf-8') as f:
                self.mesh_data = json.load(f)
            
            self._log("SUCCESS", f"Loaded mesh: {len(self.mesh_data.get('nodes', {}))} nodes")
            return True
            
        except Exception as e:
            self._log("ERROR", f"Failed to load mesh: {e}")
            self.mesh_data = self._get_minimal_mesh()
            return False
    
    def _build_mesh(self) -> bool:
        """Attempt to build mesh using mesh_build.py."""
        try:
            mesh_build = self.root / "ops" / "mesh_build.py"
            if not mesh_build.exists():
                return False
                
            result = subprocess.run(
                [sys.executable, str(mesh_build)],
                capture_output=True,
                text=True,
                timeout=30
            )
            
            return result.returncode == 0
            
        except Exception as e:
            self._log("ERROR", f"Mesh build failed: {e}")
            return False
    
    def _get_minimal_mesh(self) -> Dict[str, Any]:
        """Return a minimal fallback mesh structure."""
        return {
            "nodes": {
                "suite:fallback": {
                    "type": "suite",
                    "name": "fallback",
                    "version": "0.0.0",
                    "metadata": {
                        "entrypoints": [{"cli": "echo 'Fallback mode active'"}]
                    }
                }
            },
            "edges": []
        }
    
    def run_orchestration(
        self,
        suite_filter: Optional[str] = None,
        allow_failures: bool = True
    ) -> Dict[str, Any]:
        """
        Run orchestration with graceful degradation.
        
        Args:
            suite_filter: Optional filter to run specific suite
            allow_failures: Continue execution even if steps fail
            
        Returns:
            Orchestration summary with status and results
        """
        start_time = datetime.datetime.now()
        self._log("INFO", "Starting orchestration")
        
        # Load mesh with fallback
        if not self.load_mesh():
            self._log("WARNING", "Running in degraded mode")
        
        # Initialize node statuses
        for node_id in self.mesh_data.get('nodes', {}).keys():
            self.node_status[node_id] = NodeStatus.PENDING
        
        # Execute suites
        suite_results = self._execute_suites(suite_filter, allow_failures)
        
        # Calculate summary
        end_time = datetime.datetime.now()
        duration = (end_time - start_time).total_seconds()
        
        summary = {
            "status": self._calculate_overall_status(),
            "start_time": start_time.isoformat(),
            "end_time": end_time.isoformat(),
            "duration_seconds": duration,
            "total_nodes": len(self.mesh_data.get('nodes', {})),
            "total_edges": len(self.mesh_data.get('edges', [])),
            "executed": len([r for r in self.execution_log if r.status != NodeStatus.SKIPPED]),
            "successful": len([r for r in self.execution_log if r.status == NodeStatus.SUCCESS]),
            "failed": len([r for r in self.execution_log if r.status == NodeStatus.FAILED]),
            "degraded": len([r for r in self.execution_log if r.status == NodeStatus.DEGRADED]),
            "execution_log": [r.to_dict() for r in self.execution_log],
            "node_status": {k: v.value for k, v in self.node_status.items()}
        }
        
        self._log("INFO", f"Orchestration complete: {summary['status']}")
        return summary
    
    def _execute_suites(
        self,
        suite_filter: Optional[str],
        allow_failures: bool
    ) -> List[ExecutionResult]:
        """Execute suites with fallback handling."""
        results = []
        nodes = self.mesh_data.get('nodes', {})
        
        for node_id, node_data in nodes.items():
            # Filter suites if specified
            if suite_filter and suite_filter not in node_id:
                self.node_status[node_id] = NodeStatus.SKIPPED
                continue
            
            # Only execute suite nodes
            if node_data.get('type') != 'suite':
                continue
            
            self._log("INFO", f"Executing suite: {node_id}")
            result = self._execute_node(node_id, node_data)
            results.append(result)
            self.execution_log.append(result)
            
            # Update status
            self.node_status[node_id] = result.status
            
            # Check if we should continue
            if result.status == NodeStatus.FAILED and not allow_failures:
                self._log("ERROR", "Stopping orchestration due to failure")
                break
        
        return results
    
    def _execute_node(self, node_id: str, node_data: Dict[str, Any]) -> ExecutionResult:
        """Execute a single node with fallback strategies."""
        start_time = datetime.datetime.now()
        self.node_status[node_id] = NodeStatus.RUNNING
        
        try:
            entrypoints = node_data.get('metadata', {}).get('entrypoints', [])
            
            if not entrypoints:
                self._log("WARNING", f"No entrypoints for {node_id}")
                return ExecutionResult(
                    node_id=node_id,
                    status=NodeStatus.DEGRADED,
                    exit_code=0,
                    stdout="",
                    stderr="No entrypoints defined",
                    duration_seconds=0,
                    timestamp=datetime.datetime.now().isoformat(),
                    fallback_used=True
                )
            
            # Try each entrypoint with fallback
            for i, entrypoint in enumerate(entrypoints):
                is_last = i == len(entrypoints) - 1
                result = self._execute_entrypoint(node_id, entrypoint, is_last)
                
                if result.status == NodeStatus.SUCCESS:
                    return result
                
                if not is_last:
                    self._log("WARNING", f"Entrypoint {i+1} failed, trying fallback")
            
            # All entrypoints failed
            end_time = datetime.datetime.now()
            duration = (end_time - start_time).total_seconds()
            
            return ExecutionResult(
                node_id=node_id,
                status=NodeStatus.DEGRADED if self.allow_degraded else NodeStatus.FAILED,
                exit_code=1,
                stdout="",
                stderr="All entrypoints failed",
                duration_seconds=duration,
                timestamp=end_time.isoformat(),
                error_message="All entrypoints failed",
                fallback_used=True
            )
            
        except Exception as e:
            end_time = datetime.datetime.now()
            duration = (end_time - start_time).total_seconds()
            error_msg = f"Exception: {str(e)}\n{traceback.format_exc()}"
            
            self._log("ERROR", f"Node execution failed: {node_id} - {e}")
            
            return ExecutionResult(
                node_id=node_id,
                status=NodeStatus.FAILED,
                exit_code=-1,
                stdout="",
                stderr=error_msg,
                duration_seconds=duration,
                timestamp=end_time.isoformat(),
                error_message=str(e)
            )
    
    def _execute_entrypoint(
        self,
        node_id: str,
        entrypoint: Dict[str, Any],
        is_fallback: bool
    ) -> ExecutionResult:
        """Execute a single entrypoint command."""
        start_time = datetime.datetime.now()
        
        try:
            if 'cli' not in entrypoint:
                raise ValueError("Entrypoint missing 'cli' field")
            
            cmd = entrypoint['cli']
            self._log("INFO", f"Running: {cmd}")
            
            # Parse command
            cmd_parts = cmd.split()
            
            # Execute with timeout
            result = subprocess.run(
                cmd_parts,
                capture_output=True,
                text=True,
                timeout=300,  # 5 minute timeout
                cwd=str(self.root)
            )
            
            end_time = datetime.datetime.now()
            duration = (end_time - start_time).total_seconds()
            
            status = NodeStatus.SUCCESS if result.returncode == 0 else NodeStatus.FAILED
            
            if result.returncode == 0:
                self._log("SUCCESS", f"Completed: {node_id}")
            else:
                self._log("ERROR", f"Failed: {node_id} (exit code: {result.returncode})")
            
            return ExecutionResult(
                node_id=node_id,
                status=status,
                exit_code=result.returncode,
                stdout=result.stdout,
                stderr=result.stderr,
                duration_seconds=duration,
                timestamp=end_time.isoformat(),
                fallback_used=is_fallback
            )
            
        except subprocess.TimeoutExpired:
            end_time = datetime.datetime.now()
            duration = (end_time - start_time).total_seconds()
            
            return ExecutionResult(
                node_id=node_id,
                status=NodeStatus.FAILED,
                exit_code=-1,
                stdout="",
                stderr="Command timed out after 5 minutes",
                duration_seconds=duration,
                timestamp=end_time.isoformat(),
                error_message="Timeout",
                fallback_used=is_fallback
            )
            
        except Exception as e:
            end_time = datetime.datetime.now()
            duration = (end_time - start_time).total_seconds()
            
            return ExecutionResult(
                node_id=node_id,
                status=NodeStatus.FAILED,
                exit_code=-1,
                stdout="",
                stderr=str(e),
                duration_seconds=duration,
                timestamp=end_time.isoformat(),
                error_message=str(e),
                fallback_used=is_fallback
            )
    
    def _calculate_overall_status(self) -> str:
        """Calculate overall orchestration status."""
        if not self.execution_log:
            return "no_execution"
        
        statuses = [r.status for r in self.execution_log]
        
        if all(s == NodeStatus.SUCCESS for s in statuses):
            return "success"
        elif all(s in [NodeStatus.FAILED, NodeStatus.SKIPPED] for s in statuses):
            return "failed"
        elif any(s == NodeStatus.FAILED for s in statuses):
            return "partial_failure"
        elif any(s == NodeStatus.DEGRADED for s in statuses):
            return "degraded"
        else:
            return "mixed"
    
    def _log(self, level: str, message: str):
        """Log a message with timestamp."""
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{timestamp}] [{level}] {message}", flush=True)
    
    def save_report(self, summary: Dict[str, Any], output_path: Optional[Path] = None):
        """Save orchestration report to JSON."""
        if output_path is None:
            output_path = self.root / "ops" / "orchestration_report.json"
        
        try:
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(summary, f, indent=2)
            
            self._log("INFO", f"Report saved to: {output_path}")
            
        except Exception as e:
            self._log("ERROR", f"Failed to save report: {e}")


def main():
    """Main entry point for orchestration."""
    import argparse
    
    parser = argparse.ArgumentParser(
        description="Run fallback-friendly orchestration"
    )
    parser.add_argument(
        '--suite',
        help='Filter to specific suite name',
        default=None
    )
    parser.add_argument(
        '--strict',
        action='store_true',
        help='Stop on first failure (default: continue)'
    )
    parser.add_argument(
        '--output',
        help='Output path for report JSON',
        default=None
    )
    
    args = parser.parse_args()
    
    # Create orchestration engine
    engine = OrchestrationEngine()
    engine.allow_degraded = not args.strict
    
    # Run orchestration
    print("=" * 80)
    print("Fallback-Friendly Orchestration System")
    print("=" * 80)
    
    summary = engine.run_orchestration(
        suite_filter=args.suite,
        allow_failures=not args.strict
    )
    
    # Save report
    output_path = Path(args.output) if args.output else None
    engine.save_report(summary, output_path)
    
    # Print summary
    print("\n" + "=" * 80)
    print("ORCHESTRATION SUMMARY")
    print("=" * 80)
    print(f"Status: {summary['status']}")
    print(f"Duration: {summary['duration_seconds']:.2f}s")
    print(f"Total Nodes: {summary['total_nodes']}")
    print(f"Executed: {summary['executed']}")
    print(f"Successful: {summary['successful']}")
    print(f"Failed: {summary['failed']}")
    print(f"Degraded: {summary['degraded']}")
    print("=" * 80)
    
    # Exit with appropriate code
    if summary['status'] in ['success', 'degraded']:
        sys.exit(0)
    else:
        sys.exit(1)


if __name__ == "__main__":
    main()
