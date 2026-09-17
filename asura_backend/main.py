"""
Asura Agentic Platform - Main Application Entrypoint
Initializes FastAPI, CORS middleware, API routers, and lifecycle handlers.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from asura_backend.api.routes import api_router

app = FastAPI(
    title="Asura Agentic Platform Engine",
    description="Enterprise-grade Multi-Agent Autonomous Platform orchestrating 8 specialized agent tiers, sandboxed MCP tools, and deterministic guardrails.",
    version="1.0.0"
)

# Enable CORS for frontend clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(api_router, prefix="/api")

# Also mount websocket directly if needed
app.include_router(api_router)


@app.get("/")
def read_root():
    return {
        "platform": "Asura Agentic Platform",
        "status": "OPERATIONAL",
        "docs_url": "/docs",
        "version": "1.0.0"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("asura_backend.main:app", host="127.0.0.1", port=8000, reload=True)
