"""
Asura Architecture Blueprint Schema
Defines all nodes, clusters, layers, and directional links representing
the architecture diagram uploaded by the user.
"""

from typing import Dict, Any, List

BLUEPRINT_SCHEMA: Dict[str, Any] = {
    "title": "Asura Agentic Platform Architecture",
    "clusters": [
        {
            "id": "agent_layer",
            "name": "Specialized Agent Layer",
            "description": "Domain-specialized autonomous agent tiers executing domain logic.",
            "color": "#D97706",
            "nodes": [
                {"id": "ag_supp", "label": "Support Agent", "agent_id": "agent-support", "tier": "Customer Ops"},
                {"id": "ag_sales", "label": "Sales / Account Analyst", "agent_id": "agent-sales-analyst", "tier": "Revenue Intel"},
                {"id": "ag_sales_ops", "label": "Sales Operations Agent", "agent_id": "agent-sales-ops", "tier": "RevOps"},
                {"id": "ag_crm", "label": "Commerce / CRM Agent", "agent_id": "agent-commerce-crm", "tier": "Commerce"},
                {"id": "ag_itops", "label": "IT / Ops / SecOps Agent", "agent_id": "agent-it-secops", "tier": "Infra & Security"},
                {"id": "ag_qa", "label": "Service / Quality Agent", "agent_id": "agent-service-qa", "tier": "QA & SLA"},
                {"id": "ag_growth", "label": "Growth / Revenue Agent", "agent_id": "agent-growth-revenue", "tier": "Expansion"},
                {"id": "ag_enterprise", "label": "Enterprise / Expansion Agent", "agent_id": "agent-enterprise-expansion", "tier": "Governance"}
            ]
        },
        {
            "id": "comm_gateway",
            "name": "Communication Ingestion & Gateway",
            "description": "Multi-channel ingress broker, auth token validation, and dynamic routing.",
            "color": "#F59E0B",
            "nodes": [
                {"id": "gw_trigger", "label": "User Communication Trigger", "type": "Trigger"},
                {"id": "gw_voice", "label": "Voice Call Communications", "type": "Channel"},
                {"id": "gw_omni", "label": "Omnichannel Communications", "type": "Channel"},
                {"id": "gw_webhook", "label": "Communication Webhook Handler", "type": "Channel"},
                {"id": "gw_outbound", "label": "Outbound Communication Service", "type": "Channel"},
                {"id": "gw_checks", "label": "Communication Delivery Checks", "type": "Channel"},
                {"id": "gw_routing", "label": "Validation & Token Verification / Dynamic Routing", "type": "Router"},
                {"id": "gw_store", "label": "Communication Store / Event Queue", "type": "Broker"},
                {"id": "gw_ingress", "label": "Agentic Ingress / Request Dispatch", "type": "Dispatcher"}
            ]
        },
        {
            "id": "core_engine",
            "name": "Core Agentic Platform Orchestration",
            "description": "Task decomposition, autonomous workflow controller, planner, and HITL interceptor.",
            "color": "#EA580C",
            "nodes": [
                {"id": "core_middleware", "label": "Integration Middleware", "type": "Orchestrator"},
                {"id": "core_extract", "label": "Context Extraction", "type": "Orchestrator"},
                {"id": "core_alloc", "label": "Task Allocation & Flow Orchestrator", "type": "Orchestrator"},
                {"id": "core_planner", "label": "Planner / Task Decomposer", "type": "Planner"},
                {"id": "core_guard", "label": "Deterministic Guardrails & Policy", "type": "Safety"},
                {"id": "core_router", "label": "Execution Router", "type": "Router"},
                {"id": "core_exec", "label": "Agent Execution Engine", "type": "Engine"},
                {"id": "core_hitl", "label": "Human-in-the-Loop Interceptor", "type": "HITL"},
                {"id": "core_eval", "label": "Evaluation / Feedback Loop", "type": "Feedback"}
            ]
        },
        {
            "id": "execution_pipeline",
            "name": "Agent Execution Pipeline",
            "description": "Prompt synthesis, tool selection, safety sandbox, and output formatting.",
            "color": "#C2410C",
            "nodes": [
                {"id": "pipe_prompt", "label": "Dynamic Prompt Construction & Re-prompting", "type": "Prompt"},
                {"id": "pipe_tool_sel", "label": "Tool Selection Engine", "type": "Selection"},
                {"id": "pipe_guard", "label": "Guardrails & Policy Verification", "type": "Verification"},
                {"id": "pipe_sandbox", "label": "Safe Execution Sandboxing", "type": "Sandbox"},
                {"id": "pipe_telemetry", "label": "Telemetry / Token Tracing", "type": "Telemetry"},
                {"id": "pipe_synth", "label": "Response Synthesis & Output Filter", "type": "Synthesis"}
            ]
        },
        {
            "id": "memory_system",
            "name": "Agent Memory & Knowledge System",
            "description": "Multi-tier context cache, RAG vector retrieval, and semantic knowledge graph.",
            "color": "#B45309",
            "nodes": [
                {"id": "mem_short", "label": "Short-Term Memory Buffer / Context Cache", "type": "Cache"},
                {"id": "mem_llm", "label": "LLM Reasoning / Inference", "type": "Reasoning"},
                {"id": "mem_rag", "label": "Retrieval-Augmented Generation (RAG)", "type": "RAG"},
                {"id": "mem_graph", "label": "Semantic Memory & Knowledge Graph", "type": "Graph"},
                {"id": "mem_episodic", "label": "Episodic Memory Store", "type": "Episodic"},
                {"id": "mem_reflect", "label": "Reflection Engine & Continuous Learning", "type": "Learning"}
            ]
        },
        {
            "id": "tool_sandbox",
            "name": "Tool / Action Execution Engine",
            "description": "MCP Host client, parameter verification, and isolated execution.",
            "color": "#9A3412",
            "nodes": [
                {"id": "tl_reg", "label": "Tool Registry", "type": "Registry"},
                {"id": "tl_mcp", "label": "MCP Host / Client", "type": "Protocol"},
                {"id": "tl_parse", "label": "Tool Parameter Parser & Sanitizer", "type": "Validation"},
                {"id": "tl_rate", "label": "Rate Limiting & Execution Authorizer", "type": "Security"},
                {"id": "tl_api", "label": "External API / OpenAPI Integration", "type": "Integration"},
                {"id": "tl_exec", "label": "Sandboxed Execution / Code Executor", "type": "Execution"},
                {"id": "tl_cache", "label": "Tool Result Cache & Response Formatter", "type": "Cache"}
            ]
        },
        {
            "id": "data_sources",
            "name": "Enterprise Data Sources & Connectors",
            "description": "Integration layer across enterprise relational, CRM, cloud, and streaming systems.",
            "color": "#78350F",
            "nodes": [
                {"id": "ds_db", "label": "Enterprise PostgreSQL & Data Warehouses", "type": "Database"},
                {"id": "ds_crm", "label": "Salesforce & HubSpot CRM", "type": "CRM"},
                {"id": "ds_ecom", "label": "E-Commerce & Stripe Billing", "type": "Commerce"},
                {"id": "ds_help", "label": "Customer Support & Zendesk Helpdesk", "type": "Support"},
                {"id": "ds_doc", "label": "Document Repositories & Knowledge Base", "type": "Docs"},
                {"id": "ds_git", "label": "GitHub Enterprise & Code Repositories", "type": "VCS"},
                {"id": "ds_erp", "label": "HR & Finance ERPs", "type": "ERP"},
                {"id": "ds_apis", "label": "Custom REST / GraphQL APIs", "type": "APIs"},
                {"id": "ds_cloud", "label": "AWS, GCP & Azure Cloud Services", "type": "Cloud"},
                {"id": "ds_stream", "label": "Kafka & RabbitMQ Event Streams", "type": "Streams"}
            ]
        },
        {
            "id": "storage_layer",
            "name": "Data & Storage Architecture",
            "description": "Hybrid persistent storage: Vector, Relational, Graph, and In-Memory Cache.",
            "color": "#451A03",
            "nodes": [
                {"id": "st_ingest", "label": "Data Ingestion & Preprocessing", "type": "ETL"},
                {"id": "st_embed", "label": "Embeddings Generator & Normalizer", "type": "Embedding"},
                {"id": "st_object", "label": "Object Storage (Blob / S3 / Audio)", "type": "Storage"},
                {"id": "st_vector", "label": "Vector Store (Pinecone / Qdrant / Weaviate)", "type": "Vector"},
                {"id": "st_rel", "label": "Relational DB (PostgreSQL / Supabase)", "type": "Relational"},
                {"id": "st_graph", "label": "Knowledge Graph (Neo4j / NetworkX)", "type": "Graph"},
                {"id": "st_cache", "label": "Redis & In-Memory State Cache", "type": "Cache"}
            ]
        },
        {
            "id": "observability_layer",
            "name": "Audit, Governance & Observability",
            "description": "LangSmith / OpenTelemetry tracing, latency profiling, and compliance auditing.",
            "color": "#7C2D12",
            "nodes": [
                {"id": "obs_audit", "label": "Audit & Governance Engine", "type": "Governance"},
                {"id": "obs_trace", "label": "Execution Tracing (LangSmith / OpenTelemetry)", "type": "Tracing"},
                {"id": "obs_eval", "label": "Hallucination & Bias Detection", "type": "Evaluation"},
                {"id": "obs_cost", "label": "Cost & Token Consumption Analytics", "type": "Cost"},
                {"id": "obs_sla", "label": "Performance Metrics & Latency Profiler", "type": "Telemetry"},
                {"id": "obs_reward", "label": "Feedback & Reward Logging", "type": "Feedback"}
            ]
        },
        {
            "id": "deployment_infra",
            "name": "Infrastructure & Deployment",
            "description": "Kubernetes container orchestration, CI/CD pipelines, and high-availability gateways.",
            "color": "#292524",
            "nodes": [
                {"id": "dep_cloud", "label": "Multi-Cloud Kubernetes (EKS / GKE / AKS)", "type": "Infra"},
                {"id": "dep_cicd", "label": "GitHub Actions CI/CD Pipeline", "type": "Pipeline"},
                {"id": "dep_gw", "label": "TLS Reverse Proxy & API Gateway", "type": "Gateway"},
                {"id": "dep_mon", "label": "Prometheus & Grafana Monitoring", "type": "Monitoring"}
            ]
        }
    ]
}
