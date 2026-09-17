"""
Asura Observability, Governance & Audit Tracer
Tracks agent execution steps, tokens, model costs, latency breakdowns,
safety compliance audits, and telemetry metrics.
"""

from typing import Dict, Any, List, Optional
import time
import uuid
from pydantic import BaseModel, Field


class StepTrace(BaseModel):
    step_id: str = Field(default_factory=lambda: str(uuid.uuid4())[:8])
    step_type: str  # 'planning', 'guardrail_check', 'agent_thought', 'tool_call', 'hitl_approval', 'response_synthesis'
    agent_id: Optional[str] = None
    name: str
    status: str = "completed"  # 'pending', 'running', 'completed', 'failed', 'blocked'
    input_data: Any = None
    output_data: Any = None
    latency_ms: float = 0.0
    prompt_tokens: int = 0
    completion_tokens: int = 0
    total_tokens: int = 0
    cost_usd: float = 0.0
    timestamp: float = Field(default_factory=time.time)


class WorkflowTrace(BaseModel):
    workflow_id: str
    session_id: str
    goal: str
    status: str = "running"  # 'running', 'paused_hitl', 'completed', 'failed'
    start_time: float = Field(default_factory=time.time)
    end_time: Optional[float] = None
    total_latency_ms: float = 0.0
    total_tokens: int = 0
    total_cost_usd: float = 0.0
    steps: List[StepTrace] = Field(default_factory=list)
    guardrail_violations: List[str] = Field(default_factory=list)
    hitl_reason: Optional[str] = None


class AuditEvent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4())[:8])
    event_type: str  # 'AUTH_CHECK', 'TOOL_INVOCATION', 'GUARDRAIL_INTERCEPT', 'HITL_ACTION', 'DATA_ACCESS'
    severity: str = "INFO"  # 'INFO', 'WARN', 'CRITICAL'
    actor: str
    action: str
    target: str
    metadata: Dict[str, Any] = Field(default_factory=dict)
    timestamp: float = Field(default_factory=time.time)


class ObservabilityTracer:
    def __init__(self):
        self.traces: Dict[str, WorkflowTrace] = {}
        self.audit_log: List[AuditEvent] = []
        self.total_tokens_consumed = 0
        self.total_cost_accrued = 0.0
        # Model cost constants (approx $0.00015 / 1k tokens)
        self._cost_per_token = 0.00000015

    def start_workflow(self, workflow_id: str, session_id: str, goal: str) -> WorkflowTrace:
        trace = WorkflowTrace(workflow_id=workflow_id, session_id=session_id, goal=goal)
        self.traces[workflow_id] = trace
        self.log_audit(
            event_type="WORKFLOW_STARTED",
            severity="INFO",
            actor=session_id,
            action="INITIALIZE_MISSION",
            target=workflow_id,
            metadata={"goal": goal}
        )
        return trace

    def add_step(
        self,
        workflow_id: str,
        step_type: str,
        name: str,
        agent_id: Optional[str] = None,
        input_data: Any = None,
        output_data: Any = None,
        latency_ms: float = 0.0,
        prompt_tokens: int = 0,
        completion_tokens: int = 0,
        status: str = "completed"
    ) -> StepTrace:
        trace = self.traces.get(workflow_id)
        tokens = prompt_tokens + completion_tokens
        cost = round(tokens * self._cost_per_token, 6)

        step = StepTrace(
            step_type=step_type,
            agent_id=agent_id,
            name=name,
            status=status,
            input_data=input_data,
            output_data=output_data,
            latency_ms=latency_ms,
            prompt_tokens=prompt_tokens,
            completion_tokens=completion_tokens,
            total_tokens=tokens,
            cost_usd=cost
        )

        if trace:
            trace.steps.append(step)
            trace.total_tokens += tokens
            trace.total_cost_usd = round(trace.total_cost_usd + cost, 6)
            trace.total_latency_ms += latency_ms

        self.total_tokens_consumed += tokens
        self.total_cost_accrued = round(self.total_cost_accrued + cost, 6)

        # Audit critical actions
        if step_type == "tool_call":
            self.log_audit(
                event_type="TOOL_INVOCATION",
                severity="INFO",
                actor=agent_id or "CoreEngine",
                action="INVOKE_TOOL",
                target=name,
                metadata={"latency_ms": latency_ms, "tokens": tokens}
            )

        return step

    def complete_workflow(self, workflow_id: str, status: str = "completed"):
        trace = self.traces.get(workflow_id)
        if trace:
            trace.status = status
            trace.end_time = time.time()
            self.log_audit(
                event_type="WORKFLOW_COMPLETED",
                severity="INFO" if status == "completed" else "WARN",
                actor="CoreEngine",
                action="FINALIZE_WORKFLOW",
                target=workflow_id,
                metadata={"final_status": status, "total_tokens": trace.total_tokens}
            )

    def log_audit(self, event_type: str, severity: str, actor: str, action: str, target: str, metadata: Optional[Dict[str, Any]] = None):
        event = AuditEvent(
            event_type=event_type,
            severity=severity,
            actor=actor,
            action=action,
            target=target,
            metadata=metadata or {}
        )
        self.audit_log.append(event)

    def get_summary_metrics(self) -> Dict[str, Any]:
        return {
            "total_workflows": len(self.traces),
            "total_tokens_consumed": self.total_tokens_consumed,
            "total_cost_accrued_usd": round(self.total_cost_accrued, 4),
            "active_workflows": len([t for t in self.traces.values() if t.status in ["running", "paused_hitl"]]),
            "audit_events_count": len(self.audit_log),
            "recent_audit_events": [a.model_dump() for a in self.audit_log[-15:]]
        }


observability_tracer = ObservabilityTracer()
