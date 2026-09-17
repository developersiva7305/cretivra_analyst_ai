"""
Asura Core Agentic Platform Orchestrator
Coordinates task decomposition, workflow DAG planning, agent routing,
tool execution, deterministic guardrails, and Human-in-the-Loop approval queues.
"""

from typing import Dict, Any, List, Optional, Callable
import asyncio
import time
import uuid
from pydantic import BaseModel, Field

from asura_backend.guardrails.engine import guardrails_engine
from asura_backend.memory.store import memory_store
from asura_backend.tools.registry import tool_registry
from asura_backend.agents.registry import agent_fleet
from asura_backend.observability.tracer import observability_tracer


class WorkflowStep(BaseModel):
    id: str
    title: str
    assigned_agent: str
    description: str
    status: str = "PENDING"  # 'PENDING', 'IN_PROGRESS', 'WAITING_APPROVAL', 'COMPLETED', 'FAILED'
    output: Optional[Any] = None
    thought: Optional[str] = None
    tool_calls: List[Dict[str, Any]] = Field(default_factory=list)
    hitl_prompt: Optional[str] = None
    latency_ms: float = 0.0


class WorkflowInstance(BaseModel):
    workflow_id: str
    title: str
    trigger_channel: str = "web_portal"  # 'voice', 'omnichannel', 'webhook', 'push', 'external_feed'
    goal: str
    status: str = "INITIALIZING"  # 'PLANNING', 'RUNNING', 'WAITING_APPROVAL', 'COMPLETED', 'FAILED'
    steps: List[WorkflowStep] = Field(default_factory=list)
    current_step_index: int = 0
    final_output: Optional[str] = None
    created_at: float = Field(default_factory=time.time)
    updated_at: float = Field(default_factory=time.time)


class AsuraOrchestrator:
    def __init__(self):
        self.active_workflows: Dict[str, WorkflowInstance] = {}
        self._listeners: List[Callable[[Dict[str, Any]], Any]] = []

    def register_listener(self, listener: Callable[[Dict[str, Any]], Any]):
        self._listeners.append(listener)

    def unregister_listener(self, listener: Callable[[Dict[str, Any]], Any]):
        if listener in self._listeners:
            self._listeners.remove(listener)

    async def broadcast_event(self, event: Dict[str, Any]):
        for listener in self._listeners:
            try:
                if asyncio.iscoroutinefunction(listener):
                    await listener(event)
                else:
                    listener(event)
            except Exception:
                pass

    def create_workflow(self, goal: str, trigger_channel: str = "web_portal", context: Optional[Dict[str, Any]] = None) -> WorkflowInstance:
        workflow_id = f"wf-{uuid.uuid4().hex[:8]}"
        trace = observability_tracer.start_workflow(workflow_id, "session-live", goal)

        # 1. Ingress Guardrail Check
        guard_res = guardrails_engine.evaluate_input(goal)
        if not guard_res.passed:
            observability_tracer.add_step(
                workflow_id=workflow_id,
                step_type="guardrail_check",
                name="Security & Policy Intercept",
                output_data={"violations": guard_res.violations},
                status="blocked"
            )
            wf = WorkflowInstance(
                workflow_id=workflow_id,
                title="Policy Violation Intercepted",
                trigger_channel=trigger_channel,
                goal=goal,
                status="FAILED",
                final_output=f"Operation Blocked by Asura Guardrails: {', '.join(guard_res.violations)}"
            )
            self.active_workflows[workflow_id] = wf
            return wf

        # 2. Decompose Goal into Workflow Plan
        steps = self._decompose_task(goal, guard_res.sanitized_content or goal)

        wf = WorkflowInstance(
            workflow_id=workflow_id,
            title=self._generate_workflow_title(goal),
            trigger_channel=trigger_channel,
            goal=guard_res.sanitized_content or goal,
            status="READY",
            steps=steps
        )
        self.active_workflows[workflow_id] = wf
        return wf

    def _generate_workflow_title(self, goal: str) -> str:
        g = goal.lower()
        if "outage" in g or "incident" in g or "pod" in g:
            return "Mission: P0 Security & Infrastructure Outage Mitigation"
        elif "churn" in g or "retention" in g:
            return "Mission: Account Churn Prevention & ARR Protection"
        elif "lead" in g or "prospect" in g or "enrich" in g:
            return "Mission: Autonomous B2B Lead Generation & Account Intelligence"
        elif "discount" in g or "contract" in g or "quote" in g:
            return "Mission: Enterprise Contract & Discount Threshold Review"
        elif "support" in g or "ticket" in g:
            return "Mission: Omnichannel Customer Escalation Triage"
        return f"Mission: {goal[:45]}..."

    def _decompose_task(self, raw_goal: str, sanitized_goal: str) -> List[WorkflowStep]:
        """
        Planner & Task Decomposer:
        Dynamically breaks down high-level intent into multi-agent DAG subtasks.
        """
        g = sanitized_goal.lower()

        if "outage" in g or "incident" in g or "down" in g or "pod" in g:
            return [
                WorkflowStep(
                    id="step-1",
                    title="Incident Log Triage & Root-Cause Extraction",
                    assigned_agent="agent-it-secops",
                    description="Query database logs to isolate affected microservices and measure error rate."
                ),
                WorkflowStep(
                    id="step-2",
                    title="Containment: Pod Isolation & Traffic Drain",
                    assigned_agent="agent-it-secops",
                    description="Quarantine compromised/failing containers using sandboxed cloud isolator."
                ),
                WorkflowStep(
                    id="step-3",
                    title="Service SLA & Regression Validation",
                    assigned_agent="agent-service-qa",
                    description="Run automated latency benchmarks to confirm failover stabilization."
                ),
                WorkflowStep(
                    id="step-4",
                    title="Stakeholder Incident Postmortem Broadcast",
                    assigned_agent="agent-support",
                    description="Publish resolution report and notify account owners."
                )
            ]

        elif "churn" in g or "retention" in g:
            return [
                WorkflowStep(
                    id="step-1",
                    title="Portfolio ARR & Churn Risk Segmentation",
                    assigned_agent="agent-sales-analyst",
                    description="Extract customer health scores and identify at-risk renewal contracts."
                ),
                WorkflowStep(
                    id="step-2",
                    title="Deep CRM Account & Usage Diagnostic",
                    assigned_agent="agent-growth-revenue",
                    description="Inspect contract dates, NPS history, and key stakeholders in Salesforce CRM."
                ),
                WorkflowStep(
                    id="step-3",
                    title="Retention Strategy & Custom Quote Packaging",
                    assigned_agent="agent-sales-ops",
                    description="Formulate renewal incentives and verify discounting boundaries."
                ),
                WorkflowStep(
                    id="step-4",
                    title="Executive Engagement & Outreach Dispatch",
                    assigned_agent="agent-growth-revenue",
                    description="Dispatch targeted retention playbook via secure webhook API."
                )
            ]

        elif "lead" in g or "prospect" in g or "enrich" in g:
            return [
                WorkflowStep(
                    id="step-1",
                    title="Target Account Sourcing & ICP Fit Scoring",
                    assigned_agent="agent-sales-analyst",
                    description="Scan market intelligence, evaluate company revenue/headcount signals, and compute weighted ICP fit score."
                ),
                WorkflowStep(
                    id="step-2",
                    title="Decision-Maker Contact Enrichment & Verification",
                    assigned_agent="agent-growth-revenue",
                    description="Look up verified executive contacts (CTO, VP Engineering, CRO) and check CRM for past engagement history."
                ),
                WorkflowStep(
                    id="step-3",
                    title="Personalized Multi-Channel Outreach Generation",
                    assigned_agent="agent-growth-revenue",
                    description="Draft highly tailored value proposition referencing company pain points, tech stack, and mutual connections."
                ),
                WorkflowStep(
                    id="step-4",
                    title="CRM Sync & Sales Lead Routing",
                    assigned_agent="agent-sales-ops",
                    description="Provision qualified lead in Salesforce CRM, assign to territory account executive, and trigger email cadence."
                )
            ]

        elif "discount" in g or "contract" in g:
            return [
                WorkflowStep(
                    id="step-1",
                    title="Contract Review & Margin Verification",
                    assigned_agent="agent-sales-ops",
                    description="Evaluate proposed discount rates against revenue guardrails."
                ),
                WorkflowStep(
                    id="step-2",
                    title="Human-in-the-Loop Executive Signoff",
                    assigned_agent="agent-enterprise-expansion",
                    description="Submit high-tier contractual exception for executive human approval."
                ),
                WorkflowStep(
                    id="step-3",
                    title="CRM Contract Sync & Fulfillment",
                    assigned_agent="agent-commerce-crm",
                    description="Update deal stage in Salesforce and trigger billing provisioning."
                )
            ]

        # Generic 3-step enterprise flow
        return [
            WorkflowStep(
                id="step-1",
                title="Context Ingestion & Account Identification",
                assigned_agent="agent-support",
                description="Retrieve customer background, past episodes, and relevant RAG policies."
            ),
            WorkflowStep(
                id="step-2",
                title="Cross-Tier Analysis & Tool Execution",
                assigned_agent="agent-sales-analyst",
                description="Query enterprise systems and run sandboxed evaluations."
            ),
            WorkflowStep(
                id="step-3",
                title="Outcome Synthesis & Policy Validation",
                assigned_agent="agent-service-qa",
                description="Verify quality guardrails and finalize customer-facing recommendations."
            )
        ]

    async def execute_workflow(self, workflow_id: str):
        """Asynchronously executes the workflow steps sequentially."""
        wf = self.active_workflows.get(workflow_id)
        if not wf:
            return

        wf.status = "RUNNING"
        await self.broadcast_event({"type": "WORKFLOW_UPDATED", "workflow": wf.model_dump()})

        while wf.current_step_index < len(wf.steps):
            step = wf.steps[wf.current_step_index]
            step.status = "IN_PROGRESS"
            await self.broadcast_event({"type": "STEP_STARTED", "workflow_id": workflow_id, "step": step.model_dump()})

            start_t = time.time()
            agent = agent_fleet.get_agent(step.assigned_agent)
            if not agent:
                step.status = "FAILED"
                step.output = f"Agent {step.assigned_agent} not found."
                wf.status = "FAILED"
                break

            # Let the agent reason
            await asyncio.sleep(0.6)  # Simulated real-time reasoning delay
            decision = agent.reason(step.description, {"workflow_id": workflow_id, "step_id": step.id})
            step.thought = decision.thought

            observability_tracer.add_step(
                workflow_id=workflow_id,
                step_type="agent_thought",
                name=f"{agent.name} Reasoning",
                agent_id=agent.agent_id,
                output_data={"thought": decision.thought},
                latency_ms=round((time.time() - start_t) * 1000, 2),
                prompt_tokens=320,
                completion_tokens=65
            )

            # Check if HITL is requested
            if decision.action_type == "request_hitl" or "human" in step.title.lower():
                step.status = "WAITING_APPROVAL"
                step.hitl_prompt = decision.response_text or "Human approval required to authorize execution."
                wf.status = "WAITING_APPROVAL"
                await self.broadcast_event({"type": "HITL_REQUESTED", "workflow_id": workflow_id, "step": step.model_dump()})
                return  # Execution pauses until approved via resume_workflow

            # Execute tool action or respond
            if decision.action_type == "call_tool":
                await asyncio.sleep(0.5)
                tool_res = agent.execute_action(decision, trace_id=workflow_id)
                step.tool_calls.append({
                    "tool": decision.tool_name,
                    "params": decision.tool_params,
                    "result": tool_res
                })
                step.output = tool_res
            else:
                step.output = decision.response_text

            step.latency_ms = round((time.time() - start_t) * 1000, 2)
            step.status = "COMPLETED"
            agent.completed_tasks_count += 1

            await self.broadcast_event({"type": "STEP_COMPLETED", "workflow_id": workflow_id, "step": step.model_dump()})
            wf.current_step_index += 1
            wf.updated_at = time.time()

        # All steps completed
        wf.status = "COMPLETED"
        wf.final_output = f"Workflow '{wf.title}' successfully completed all {len(wf.steps)} steps across specialized agent tiers."
        observability_tracer.complete_workflow(workflow_id, "completed")

        # Save episodic memory
        memory_store.record_episode(
            task_id=workflow_id,
            agent_id=wf.steps[-1].assigned_agent if wf.steps else "asura-core",
            goal=wf.goal,
            summary=wf.final_output,
            reflection="Execution conformed to SLA and enterprise policy guidelines.",
            success=True
        )

        await self.broadcast_event({"type": "WORKFLOW_COMPLETED", "workflow": wf.model_dump()})

    async def approve_hitl(self, workflow_id: str, decision: str = "APPROVED", notes: str = ""):
        """Resumes a paused workflow after human review."""
        wf = self.active_workflows.get(workflow_id)
        if not wf or wf.status != "WAITING_APPROVAL":
            return False

        current_step = wf.steps[wf.current_step_index]
        observability_tracer.log_audit(
            event_type="HITL_ACTION",
            severity="INFO" if decision == "APPROVED" else "WARN",
            actor="HumanSupervisor",
            action=f"HITL_{decision}",
            target=workflow_id,
            metadata={"step_id": current_step.id, "notes": notes}
        )

        if decision == "APPROVED":
            current_step.status = "COMPLETED"
            current_step.output = f"Human supervisor approved: {notes or 'Authorized to proceed.'}"
            wf.current_step_index += 1
            # Resume rest of workflow asynchronously
            asyncio.create_task(self.execute_workflow(workflow_id))
            return True
        else:
            current_step.status = "FAILED"
            current_step.output = f"Rejected by supervisor: {notes or 'Operation denied.'}"
            wf.status = "FAILED"
            wf.final_output = f"Workflow rejected by human supervisor: {notes}"
            observability_tracer.complete_workflow(workflow_id, "failed")
            await self.broadcast_event({"type": "WORKFLOW_REJECTED", "workflow": wf.model_dump()})
            return True


orchestrator = AsuraOrchestrator()
