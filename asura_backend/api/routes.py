"""
Asura REST API & WebSocket Streaming Routes
Exposes platform endpoints for agents, tools, workflows, telemetry,
knowledge memory, and real-time mission execution.
"""

from typing import Dict, Any, List, Optional
import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException
from pydantic import BaseModel

from asura_backend.agents.registry import agent_fleet
from asura_backend.tools.registry import tool_registry
from asura_backend.memory.store import memory_store
from asura_backend.observability.tracer import observability_tracer
from asura_backend.connectors.manager import connector_manager
from asura_backend.core.orchestrator import orchestrator
from asura_backend.core.blueprint import BLUEPRINT_SCHEMA

api_router = APIRouter()


class WorkflowRequest(BaseModel):
    goal: str
    trigger_channel: str = "web_portal"
    context: Optional[Dict[str, Any]] = None


class HitlDecisionRequest(BaseModel):
    decision: str  # 'APPROVED', 'REJECTED'
    notes: Optional[str] = ""


class ToolRunRequest(BaseModel):
    tool_name: str
    params: Dict[str, Any]


class RagSearchRequest(BaseModel):
    query: str
    top_k: int = 3


# --- Blueprint & Architecture Explorer ---
@api_router.get("/blueprint")
def get_blueprint():
    return BLUEPRINT_SCHEMA


# --- Agents ---
@api_router.get("/agents")
def list_agents():
    return agent_fleet.list_agents()


@api_router.get("/agents/{agent_id}")
def get_agent(agent_id: str):
    agent = agent_fleet.get_agent(agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent.to_dict()


# --- Tools & MCP Hub ---
@api_router.get("/tools")
def list_tools():
    return [t.model_dump() for t in tool_registry.list_tools()]


@api_router.post("/tools/execute")
def execute_tool(req: ToolRunRequest):
    res = tool_registry.execute_tool(req.tool_name, req.params)
    return res.model_dump()


# --- Workflows & Mission Control ---
@api_router.get("/workflows")
def list_workflows():
    return [wf.model_dump() for wf in orchestrator.active_workflows.values()]


@api_router.get("/workflows/{workflow_id}")
def get_workflow(workflow_id: str):
    wf = orchestrator.active_workflows.get(workflow_id)
    if not wf:
        raise HTTPException(status_code=404, detail="Workflow not found")
    return wf.model_dump()


@api_router.post("/workflows")
async def create_and_run_workflow(req: WorkflowRequest):
    wf = orchestrator.create_workflow(req.goal, req.trigger_channel, req.context)
    if wf.status != "FAILED":
        # Launch execution asynchronously
        asyncio.create_task(orchestrator.execute_workflow(wf.workflow_id))
    return wf.model_dump()


@api_router.post("/workflows/{workflow_id}/approve")
async def approve_workflow_hitl(workflow_id: str, req: HitlDecisionRequest):
    success = await orchestrator.approve_hitl(workflow_id, req.decision, req.notes or "")
    if not success:
        raise HTTPException(status_code=400, detail="Unable to approve: workflow not in WAITING_APPROVAL state.")
    return {"success": True, "workflow_id": workflow_id, "decision": req.decision}


# --- Memory & Knowledge System ---
@api_router.get("/memory/graph")
def get_knowledge_graph():
    return memory_store.get_graph()


@api_router.post("/memory/rag")
def search_rag(req: RagSearchRequest):
    results = memory_store.search_rag(req.query, req.top_k)
    return [
        {"document": doc.model_dump(), "score": score}
        for doc, score in results
    ]


@api_router.get("/memory/episodes")
def list_episodes(query: Optional[str] = None):
    if query:
        return [e.model_dump() for e in memory_store.search_episodes(query)]
    return [e.model_dump() for e in memory_store.episodic_memory[-20:]]


# --- Telemetry & Observability ---
@api_router.get("/telemetry")
def get_telemetry():
    return observability_tracer.get_summary_metrics()


@api_router.get("/telemetry/traces")
def get_traces():
    return [t.model_dump() for t in observability_tracer.traces.values()]


# --- Connectors ---
@api_router.get("/connectors")
def list_connectors():
    return connector_manager.list_connectors()


# --- WebSocket Live Streaming Hub ---
active_ws_connections: List[WebSocket] = []


async def _ws_event_forwarder(event: Dict[str, Any]):
    disconnected = []
    for ws in active_ws_connections:
        try:
            await ws.send_json(event)
        except Exception:
            disconnected.append(ws)
    for ws in disconnected:
        if ws in active_ws_connections:
            active_ws_connections.remove(ws)


orchestrator.register_listener(_ws_event_forwarder)


@api_router.websocket("/ws/live")
async def websocket_live_stream(websocket: WebSocket):
    await websocket.accept()
    active_ws_connections.append(websocket)
    try:
        # Send initial snapshot
        await websocket.send_json({
            "type": "INITIAL_SNAPSHOT",
            "active_workflows": [wf.model_dump() for wf in orchestrator.active_workflows.values()],
            "telemetry": observability_tracer.get_summary_metrics()
        })
        while True:
            data = await websocket.receive_text()
            # Echo or process client heartbeats
    except WebSocketDisconnect:
        if websocket in active_ws_connections:
            active_ws_connections.remove(websocket)
    except Exception:
        if websocket in active_ws_connections:
            active_ws_connections.remove(websocket)
