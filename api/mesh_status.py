"""
API endpoint for mesh status and health monitoring.

Provides real-time status information about the mesh structure,
node health, and orchestration state for the visual dashboard.
"""

import json
import os
import sys
from pathlib import Path
from datetime import datetime
from typing import Dict, Any, List, Optional

# Add parent to path for imports
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

try:
    from ops import mesh_build
    from ops import orchestrate
except ImportError:
    mesh_build = None
    orchestrate = None


class MeshStatusAPI:
    """API for querying mesh status and health."""
    
    def __init__(self):
        """Initialize the API."""
        self.root = Path(__file__).resolve().parents[1]
        self.mesh_path = self.root / "ip_mesh" / "ops" / "mesh.json"
        self.report_path = self.root / "ip_mesh" / "ops" / "orchestration_report.json"
    
    def get_mesh_data(self) -> Dict[str, Any]:
        """Get current mesh data with health status."""
        try:
            if not self.mesh_path.exists():
                return {
                    "status": "error",
                    "message": "Mesh file not found",
                    "nodes": {},
                    "edges": []
                }
            
            with open(self.mesh_path, 'r', encoding='utf-8') as f:
                mesh_data = json.load(f)
            
            # Enhance with health information
            for node_id, node_info in mesh_data.get('nodes', {}).items():
                node_info['health'] = self._check_node_health(node_id, node_info)
                node_info['last_updated'] = self._get_node_last_updated(node_id)
            
            return {
                "status": "success",
                "timestamp": datetime.now().isoformat(),
                "nodes": mesh_data.get('nodes', {}),
                "edges": mesh_data.get('edges', []),
                "statistics": self._calculate_statistics(mesh_data)
            }
            
        except Exception as e:
            return {
                "status": "error",
                "message": str(e),
                "nodes": {},
                "edges": []
            }
    
    def _check_node_health(self, node_id: str, node_info: Dict[str, Any]) -> str:
        """Check health status of a node."""
        # Check if required files exist
        node_path = self.root / node_info.get('path', '')
        
        if not node_path.exists():
            return "failed"
        
        # Check recent orchestration results
        if self.report_path.exists():
            try:
                with open(self.report_path, 'r', encoding='utf-8') as f:
                    report = json.load(f)
                
                node_status = report.get('node_status', {}).get(node_id)
                
                if node_status == 'success':
                    return "healthy"
                elif node_status == 'degraded':
                    return "degraded"
                elif node_status == 'failed':
                    return "failed"
                    
            except Exception:
                pass
        
        # Default to healthy if no issues found
        return "healthy"
    
    def _get_node_last_updated(self, node_id: str) -> Optional[str]:
        """Get last update timestamp for a node."""
        if not self.report_path.exists():
            return None
        
        try:
            with open(self.report_path, 'r', encoding='utf-8') as f:
                report = json.load(f)
            
            # Find the most recent execution of this node
            for log_entry in reversed(report.get('execution_log', [])):
                if log_entry.get('node_id') == node_id:
                    return log_entry.get('timestamp')
            
        except Exception:
            pass
        
        return None
    
    def _calculate_statistics(self, mesh_data: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate mesh statistics."""
        nodes = mesh_data.get('nodes', {})
        edges = mesh_data.get('edges', [])
        
        # Count by type
        type_counts = {}
        for node_info in nodes.values():
            node_type = node_info.get('type', 'unknown')
            type_counts[node_type] = type_counts.get(node_type, 0) + 1
        
        # Calculate connectivity
        node_connections = {}
        for edge in edges:
            from_node = edge.get('from')
            if from_node:
                node_connections[from_node] = node_connections.get(from_node, 0) + 1
        
        max_connections = max(node_connections.values()) if node_connections else 0
        avg_connections = sum(node_connections.values()) / len(node_connections) if node_connections else 0
        
        return {
            "total_nodes": len(nodes),
            "total_edges": len(edges),
            "node_types": type_counts,
            "max_connections": max_connections,
            "avg_connections": round(avg_connections, 2)
        }
    
    def get_orchestration_status(self) -> Dict[str, Any]:
        """Get current orchestration status."""
        if not self.report_path.exists():
            return {
                "status": "no_report",
                "message": "No orchestration report available"
            }
        
        try:
            with open(self.report_path, 'r', encoding='utf-8') as f:
                report = json.load(f)
            
            return {
                "status": "success",
                "orchestration": report
            }
            
        except Exception as e:
            return {
                "status": "error",
                "message": str(e)
            }
    
    def get_node_details(self, node_id: str) -> Dict[str, Any]:
        """Get detailed information about a specific node."""
        mesh_data = self.get_mesh_data()
        
        if mesh_data['status'] != 'success':
            return mesh_data
        
        node_info = mesh_data['nodes'].get(node_id)
        
        if not node_info:
            return {
                "status": "error",
                "message": f"Node not found: {node_id}"
            }
        
        # Get dependencies
        dependencies = []
        dependents = []
        
        for edge in mesh_data['edges']:
            if edge['from'] == node_id:
                dependencies.append(edge['to'])
            if edge['to'] == node_id or edge['to'] in node_id:
                dependents.append(edge['from'])
        
        return {
            "status": "success",
            "node_id": node_id,
            "info": node_info,
            "dependencies": dependencies,
            "dependents": dependents
        }
    
    def rebuild_mesh(self) -> Dict[str, Any]:
        """Trigger mesh rebuild."""
        try:
            if mesh_build is None:
                return {
                    "status": "error",
                    "message": "mesh_build module not available"
                }
            
            # Run mesh build
            mesh_build.build_mesh()
            
            return {
                "status": "success",
                "message": "Mesh rebuilt successfully",
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "status": "error",
                "message": str(e)
            }
    
    def get_health_summary(self) -> Dict[str, Any]:
        """Get overall system health summary."""
        mesh_data = self.get_mesh_data()
        
        if mesh_data['status'] != 'success':
            return {
                "status": "error",
                "health_score": 0,
                "message": mesh_data.get('message', 'Unknown error')
            }
        
        # Count health statuses
        health_counts = {
            "healthy": 0,
            "degraded": 0,
            "failed": 0
        }
        
        for node_info in mesh_data['nodes'].values():
            health = node_info.get('health', 'healthy')
            health_counts[health] = health_counts.get(health, 0) + 1
        
        total = sum(health_counts.values())
        health_score = 0
        
        if total > 0:
            health_score = (
                (health_counts['healthy'] * 100 +
                 health_counts['degraded'] * 50 +
                 health_counts['failed'] * 0) / total
            )
        
        return {
            "status": "success",
            "health_score": round(health_score, 1),
            "node_health": health_counts,
            "total_nodes": total,
            "timestamp": datetime.now().isoformat()
        }


def main():
    """Main entry point for testing."""
    api = MeshStatusAPI()
    
    print("Mesh Status API - Test Mode")
    print("=" * 80)
    
    # Test mesh data retrieval
    print("\n1. Getting mesh data...")
    mesh_data = api.get_mesh_data()
    print(f"   Status: {mesh_data['status']}")
    print(f"   Nodes: {len(mesh_data.get('nodes', {}))}")
    print(f"   Edges: {len(mesh_data.get('edges', []))}")
    
    # Test health summary
    print("\n2. Getting health summary...")
    health = api.get_health_summary()
    print(f"   Health Score: {health.get('health_score', 0)}%")
    print(f"   Node Health: {health.get('node_health', {})}")
    
    # Test orchestration status
    print("\n3. Getting orchestration status...")
    orch_status = api.get_orchestration_status()
    print(f"   Status: {orch_status['status']}")
    
    print("\n" + "=" * 80)


if __name__ == "__main__":
    main()
