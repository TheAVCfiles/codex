"""DevOpps adapter for Keystone memory graph integration.

This module defines interfaces only. Domain operators can map opportunities to
entity nodes without coupling DevOpps to a specific Keystone runtime.
"""

from dataclasses import dataclass


@dataclass
class OpportunityNode:
    name: str
    category: str
    deadline: str
    score: float


def to_keystone_payload(node: OpportunityNode) -> dict:
    return {
        "entity_type": "opportunity",
        "name": node.name,
        "category": node.category,
        "deadline": node.deadline,
        "score": node.score,
    }
