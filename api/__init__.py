"""FastAPI application for the DTG event logging API.

This module exposes the :data:`app` object so that the server can be started
with ``uvicorn api:app`` as described in the repository documentation.
"""

from .app import app

__all__ = ["app"]

