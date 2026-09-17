"""
Asura Specialized Agent Fleet Registry
Implements the 8 specialized agents from the Asura architecture diagram.
"""

from typing import Dict, Any, List, Optional
from asura_backend.agents.base import BaseSpecializedAgent, AgentDecision
from asura_backend.memory.store import memory_store


# 1. Support Agent
class SupportAgent(BaseSpecializedAgent):
    def __init__(self):
        super().__init__(
            agent_id="agent-support",
            name="Support Agent",
            role_description="Handles customer inquiries, ticket triage, sentiment analysis, and SLA resolution.",
            tier="Customer Operations",
            allowed_tools=["crm_account_lookup", "enterprise_sql_query", "webhook_event_dispatcher"],
            temperature=0.2
        )

    def build_system_prompt(self) -> str:
        return (
            "You are the Asura Support Agent. Prioritize customer satisfaction, verify SLAs against "
            "enterprise contracts, look up customer account details in CRM, and escalate P0 outages to IT SecOps."
        )

    def reason(self, task_goal: str, context: Dict[str, Any]) -> AgentDecision:
        goal_lower = task_goal.lower()
        if "crm" in goal_lower or "account" in goal_lower or "customer" in goal_lower:
            return AgentDecision(
                thought="Looking up customer account and recent ticket history in CRM to assess issue context.",
                action_type="call_tool",
                tool_name="crm_account_lookup",
                tool_params={"account_name": context.get("account_name", "Acme Corp")}
            )
        elif "ticket" in goal_lower or "history" in goal_lower:
            return AgentDecision(
                thought="Querying enterprise database for past customer support interactions.",
                action_type="call_tool",
                tool_name="enterprise_sql_query",
                tool_params={"query": "SELECT * FROM support_tickets WHERE status='OPEN'"}
            )
        return AgentDecision(
            thought="Synthesizing support response following enterprise SLA guidelines.",
            action_type="respond",
            response_text=f"Support triage complete for '{task_goal}'. Case prioritized under Enterprise SLA standards."
        )


# 2. Sales / Account Analyst Agent
class SalesAnalystAgent(BaseSpecializedAgent):
    def __init__(self):
        super().__init__(
            agent_id="agent-sales-analyst",
            name="Sales / Account Analyst Agent",
            role_description="Analyzes pipeline health, deal velocities, account ARR, and churn probabilities.",
            tier="Revenue Intelligence",
            allowed_tools=["enterprise_sql_query", "crm_account_lookup", "sandbox_code_executor", "b2b_lead_enrichment_scanner"],
            temperature=0.1
        )

    def build_system_prompt(self) -> str:
        return "You are the Asura Sales / Account Analyst Agent. Analyze account ARR, usage velocity, ICP fit scoring, and churn metrics."

    def reason(self, task_goal: str, context: Dict[str, Any]) -> AgentDecision:
        goal_lower = task_goal.lower()
        if "lead" in goal_lower or "icp" in goal_lower or "sourcing" in goal_lower or "prospect" in goal_lower:
            return AgentDecision(
                thought="Scanning target B2B market data to identify enterprise accounts matching ICP criteria (high ARR, Kubernetes/AI adoption).",
                action_type="call_tool",
                tool_name="b2b_lead_enrichment_scanner",
                tool_params={"domain": "datasync.io", "target_role": "VP Engineering"}
            )
        elif "arr" in goal_lower or "pipeline" in goal_lower or "churn" in goal_lower:
            return AgentDecision(
                thought="Querying enterprise customer table to evaluate ARR distribution and churn risks.",
                action_type="call_tool",
                tool_name="enterprise_sql_query",
                tool_params={"query": "SELECT customer_id, name, arr, health_score, churn_risk FROM customers"}
            )
        return AgentDecision(
            thought="Computing account health ratios and forecasting retention value.",
            action_type="respond",
            response_text=f"Sales analysis completed for '{task_goal}'. High-value enterprise accounts remain stable; growth tier monitored for renewal risks."
        )


# 3. Sales Operations Agent
class SalesOpsAgent(BaseSpecializedAgent):
    def __init__(self):
        super().__init__(
            agent_id="agent-sales-ops",
            name="Sales Operations Agent",
            role_description="Executes quota tracking, contract review, discount threshold enforcement, and CRM sync.",
            tier="Revenue Operations",
            allowed_tools=["crm_account_lookup", "enterprise_sql_query", "webhook_event_dispatcher"],
            temperature=0.1
        )

    def build_system_prompt(self) -> str:
        return "You are the Asura Sales Ops Agent. Enforce discounting rules, sync deals, and process enterprise quotes."

    def reason(self, task_goal: str, context: Dict[str, Any]) -> AgentDecision:
        goal_lower = task_goal.lower()
        if "discount" in goal_lower and ("20%" in goal_lower or "30%" in goal_lower or "> 15%" in goal_lower):
            return AgentDecision(
                thought="High discount exceeds standard 15% threshold. Requesting Human-in-the-Loop authorization.",
                action_type="request_hitl",
                response_text="Approval required: Requested discount of >15% on enterprise contract requires VP Sales signoff."
            )
        return AgentDecision(
            thought="Syncing contract state with CRM and notifying deal desk.",
            action_type="call_tool",
            tool_name="webhook_event_dispatcher",
            tool_params={"url": "https://crm.corp.internal/v1/deals/sync", "payload": {"status": "QUOTED", "goal": task_goal}}
        )


# 4. Commerce / CRM Agent
class CommerceCRMAgent(BaseSpecializedAgent):
    def __init__(self):
        super().__init__(
            agent_id="agent-commerce-crm",
            name="Commerce / CRM Agent",
            role_description="Manages order fulfillment, catalog lookups, billing lifecycle, and customer profiles.",
            tier="Transactional & Commerce",
            allowed_tools=["enterprise_sql_query", "crm_account_lookup"],
            temperature=0.1
        )

    def build_system_prompt(self) -> str:
        return "You are the Asura Commerce / CRM Agent. Inspect order fulfillment, inventory states, and customer billing."

    def reason(self, task_goal: str, context: Dict[str, Any]) -> AgentDecision:
        return AgentDecision(
            thought="Querying enterprise order database to inspect fulfillment status.",
            action_type="call_tool",
            tool_name="enterprise_sql_query",
            tool_params={"query": "SELECT * FROM orders WHERE status='PENDING_PROVISIONING'"}
        )


# 5. IT / Ops / SecOps Agent
class ITSecOpsAgent(BaseSpecializedAgent):
    def __init__(self):
        super().__init__(
            agent_id="agent-it-secops",
            name="IT / Ops / SecOps Agent",
            role_description="Executes automated incident response, pod quarantine, network policy enforcement, and log triage.",
            tier="Infrastructure & Security",
            allowed_tools=["cloud_secops_isolator", "enterprise_sql_query", "webhook_event_dispatcher"],
            temperature=0.1
        )

    def build_system_prompt(self) -> str:
        return "You are the Asura IT / SecOps Agent. Mitigate P0 outages, isolate compromised containers, and enforce cloud security."

    def reason(self, task_goal: str, context: Dict[str, Any]) -> AgentDecision:
        goal_lower = task_goal.lower()
        if "isolate" in goal_lower or "quarantine" in goal_lower or "breach" in goal_lower or "outage" in goal_lower:
            return AgentDecision(
                thought="Active infrastructure incident detected. Isolating pod network traffic to contain blast radius.",
                action_type="call_tool",
                tool_name="cloud_secops_isolator",
                tool_params={"pod_id": "auth-gateway-pod-7f99b", "action": "isolate"}
            )
        return AgentDecision(
            thought="Querying live service incident logs.",
            action_type="call_tool",
            tool_name="enterprise_sql_query",
            tool_params={"query": "SELECT * FROM incidents WHERE severity='P0'"}
        )


# 6. Service / Quality Agent
class ServiceQAAgent(BaseSpecializedAgent):
    def __init__(self):
        super().__init__(
            agent_id="agent-service-qa",
            name="Service / Quality Agent",
            role_description="Enforces SLA metrics, runs automated regression verification, and validates compliance audits.",
            tier="Quality Assurance & SLA",
            allowed_tools=["sandbox_code_executor", "enterprise_sql_query"],
            temperature=0.1
        )

    def build_system_prompt(self) -> str:
        return "You are the Asura Service / Quality Agent. Verify platform uptime, response latency, and QA regression standards."

    def reason(self, task_goal: str, context: Dict[str, Any]) -> AgentDecision:
        return AgentDecision(
            thought="Running Python script in sandbox to verify statistical latency distribution across API endpoints.",
            action_type="call_tool",
            tool_name="sandbox_code_executor",
            tool_params={"code": "latencies = [42, 55, 61, 48, 82, 39, 45]\nresult = {'p95': 82, 'avg': round(sum(latencies)/len(latencies), 1), 'status': 'PASSED'}"}
        )


# 7. Growth / Revenue Agent
class GrowthRevenueAgent(BaseSpecializedAgent):
    def __init__(self):
        super().__init__(
            agent_id="agent-growth-revenue",
            name="Growth / Revenue Agent",
            role_description="Detects churn signals, coordinates retention campaigns, and triggers product-led growth upsells.",
            tier="Growth & Expansion",
            allowed_tools=["enterprise_sql_query", "crm_account_lookup", "webhook_event_dispatcher", "b2b_lead_enrichment_scanner"],
            temperature=0.2
        )

    def build_system_prompt(self) -> str:
        return "You are the Asura Growth / Revenue Agent. Identify upsell opportunities, generate personalized cold outreach, and execute retention workflows."

    def reason(self, task_goal: str, context: Dict[str, Any]) -> AgentDecision:
        goal_lower = task_goal.lower()
        if "contact" in goal_lower or "enrich" in goal_lower or "verification" in goal_lower:
            return AgentDecision(
                thought="Verifying decision-maker contact intelligence and historical CRM touchpoints for target account.",
                action_type="call_tool",
                tool_name="crm_account_lookup",
                tool_params={"account_name": "Datasync Labs"}
            )
        elif "outreach" in goal_lower or "sequence" in goal_lower or "email" in goal_lower:
            return AgentDecision(
                thought="Synthesizing personalized multi-channel outreach draft targeting VP Engineering with tailored ROI proof points.",
                action_type="respond",
                response_text="Generated personalized sequence: 'Subject: Scaling Agentic Orchestration at Datasync - Hi Elena, noticed Datasync is expanding its AI infrastructure. The Asura platform provides deterministic guardrails and sub-50ms tool execution for multi-agent workloads...'"
            )
        return AgentDecision(
            thought="Looking up high-risk accounts to schedule automated executive outreach.",
            action_type="call_tool",
            tool_name="crm_account_lookup",
            tool_params={"account_name": "HyperScale Labs"}
        )


# 8. Enterprise / Expansion Agent
class EnterpriseExpansionAgent(BaseSpecializedAgent):
    def __init__(self):
        super().__init__(
            agent_id="agent-enterprise-expansion",
            name="Enterprise / Expansion Agent",
            role_description="Governs multi-tenant enterprise agreements, custom security reviews, and global account expansion.",
            tier="Enterprise Governance",
            allowed_tools=["crm_account_lookup", "enterprise_sql_query", "webhook_event_dispatcher"],
            temperature=0.1
        )

    def build_system_prompt(self) -> str:
        return "You are the Asura Enterprise / Expansion Agent. Coordinate multi-region compliance, SOC2 audits, and expansion."

    def reason(self, task_goal: str, context: Dict[str, Any]) -> AgentDecision:
        return AgentDecision(
            thought="Synthesizing enterprise compliance package and contract expansion terms.",
            action_type="respond",
            response_text=f"Enterprise expansion review completed for '{task_goal}'. Multi-region tenancy and SOC2 Type II compliance validated."
        )


class AgentFleetManager:
    def __init__(self):
        self.fleet: Dict[str, BaseSpecializedAgent] = {
            "agent-support": SupportAgent(),
            "agent-sales-analyst": SalesAnalystAgent(),
            "agent-sales-ops": SalesOpsAgent(),
            "agent-commerce-crm": CommerceCRMAgent(),
            "agent-it-secops": ITSecOpsAgent(),
            "agent-service-qa": ServiceQAAgent(),
            "agent-growth-revenue": GrowthRevenueAgent(),
            "agent-enterprise-expansion": EnterpriseExpansionAgent(),
        }

    def list_agents(self) -> List[Dict[str, Any]]:
        return [agent.to_dict() for agent in self.fleet.values()]

    def get_agent(self, agent_id: str) -> Optional[BaseSpecializedAgent]:
        return self.fleet.get(agent_id)


agent_fleet = AgentFleetManager()
