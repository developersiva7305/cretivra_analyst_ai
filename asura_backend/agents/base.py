"""
Asura Base Agent Class
Defines the foundational autonomous agent lifecycle:
Observe -> Orient (Memory/RAG) -> Decide (Reasoning/Planning) -> Act (Tool Call)
"""

from typing import Dict, Any, List, Optional
from abc import ABC, abstractmethod
import time
from pydantic import BaseModel, Field
from asura_backend.tools.registry import tool_registry, ToolExecutionResult
from asura_backend.memory.store import memory_store


class AgentDecision(BaseModel):
    thought: str
    action_type: str  # 'call_tool', 'delegate', 'respond', 'request_hitl'
    tool_name: Optional[str] = None
    tool_params: Dict[str, Any] = Field(default_factory=dict)
    response_text: Optional[str] = None
    confidence: float = 0.95


class BaseSpecializedAgent(ABC):
    def __init__(
        self,
        agent_id: str,
        name: str,
        role_description: str,
        tier: str,
        allowed_tools: List[str],
        temperature: float = 0.2
    ):
        self.agent_id = agent_id
        self.name = name
        self.role_description = role_description
        self.tier = tier
        self.allowed_tools = allowed_tools
        self.temperature = temperature
        self.status = "idle"  # 'idle', 'busy', 'awaiting_approval'
        self.completed_tasks_count = 0

    @abstractmethod
    def build_system_prompt(self) -> str:
        """Constructs specialized instructions and domain context."""
        pass

    @abstractmethod
    def reason(self, task_goal: str, context: Dict[str, Any]) -> AgentDecision:
        """Core reasoning loop generating thought and next action."""
        pass

    def execute_action(self, decision: AgentDecision, trace_id: str) -> Dict[str, Any]:
        """Executes the chosen action, validating against allowed tools."""
        if decision.action_type == "call_tool" and decision.tool_name:
            if decision.tool_name not in self.allowed_tools:
                return {
                    "success": False,
                    "error": f"Agent '{self.name}' is not authorized to invoke tool '{decision.tool_name}'."
                }
            res: ToolExecutionResult = tool_registry.execute_tool(decision.tool_name, decision.tool_params, trace_id)
            return res.model_dump()
        elif decision.action_type == "respond":
            return {"success": True, "response": decision.response_text}
        elif decision.action_type == "request_hitl":
            return {"success": True, "requires_approval": True, "prompt": decision.response_text}
        return {"success": False, "error": "Unknown action type"}

    def to_dict(self) -> Dict[str, Any]:
        return {
            "agent_id": self.agent_id,
            "name": self.name,
            "role_description": self.role_description,
            "tier": self.tier,
            "allowed_tools": self.allowed_tools,
            "temperature": self.temperature,
            "status": self.status,
            "completed_tasks_count": self.completed_tasks_count
        }
