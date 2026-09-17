# Cretivra Analyst AI 2


                          ┌───────────────────────┐
                         │    CEO / MANAGEMENT   │
                         └───────────┬───────────┘
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │    CEO AI ASSISTANT   │
                         └───────────┬───────────┘
                                     │
                                     ▼
                     ┌──────────────────────────────┐
                     │       AI ORCHESTRATOR        │
                     │                              │
                     │ Understand                   │
                     │ Plan                         │
                     │ Delegate                     │
                     │ Coordinate                   │
                     │ Verify                       │
                     └───────────────┬──────────────┘
                                     │
             ┌───────────────────────┼───────────────────────┐
             │                       │                       │
             ▼                       ▼                       ▼
     ┌──────────────┐       ┌────────────────┐      ┌───────────────┐
     │ BUSINESS     │       │ DEPARTMENT     │      │ PREDICTION    │
     │ ANALYST      │       │ AGENTS         │      │ ENGINE        │
     └──────┬───────┘       └───────┬────────┘      └───────┬───────┘
            │                       │                       │
            │              ┌────────┼────────┐              │
            │              │        │        │              │
            │              ▼        ▼        ▼              │
            │            Sales    Finance  Operations        │
            │            Agent     Agent     Agent            │
            │              │        │        │              │
            └──────────────┼────────┼────────┼───────────────┘
                           │        │        │
                           ▼        ▼        ▼
                 ┌─────────────────────────────────┐
                 │             MCP LAYER            │
                 │                                  │
                 │ Company Data MCP                 │
                 │ CRM MCP                         │
                 │ Analytics MCP                   │
                 │ Prediction MCP                  │
                 │ Communication MCP               │
                 │ Action MCP                      │
                 └───────────────┬─────────────────┘
                                 │
                                 ▼
                 ┌─────────────────────────────────┐
                 │       COMPANY KNOWLEDGE          │
                 │                                  │
                 │ RAG • Documents • Policies       │
                 │ SOPs • Product Knowledge         │
                 └───────────────┬─────────────────┘
                                 │
                                 ▼
                 ┌─────────────────────────────────┐
                 │          DATA LAYER              │
                 │                                  │
                 │ PostgreSQL • Redis • Vector DB   │
                 └───────────────┬─────────────────┘
                                 │
                                 ▼
                 ┌─────────────────────────────────┐
                 │       EXTERNAL SYSTEMS           │
                 │                                  │
                 │ CRM • ERP • Email • HRMS         │
                 │ Calendar • Accounting • APIs     │
                 └─────────────────────────────────┘

                
                 
                 👨‍💻 SIVA  — AI / AGENT ENGINEER
Owns: Brain of the system
person-1/
├── agents/
│   ├── orchestrator/
│   ├── business-analyst/
│   ├── sales/
│   └── prediction/
│
├── agent-runtime/
└── prompts/
Responsibilities
- AI Orchestrator
- Agent architecture
- Business Analyst Agent
- Sales Agent
- Prediction Agent
- Agent memory
- Planning & reasoning
- Agent-to-agent communication
- Tool selection
- Human approval logic
- Agent testing
Main flow
User
 ↓
Orchestrator
 ↓
Select Agent
 ↓
Plan
 ↓
Call MCP
 ↓
Analyze
 ↓
Action
 ↓
Verify


👨‍💻 SUHASH — MCP / DATA / PREDICTION ENGINEER
Owns: Data and connection layer
person-2/
├── mcp/
│   ├── company-data/
│   ├── analytics/
│   └── actions/
│
├── database/
├── rag/
└── prediction/
Responsibilities
- MCP servers
- PostgreSQL
- Company data
- RAG / knowledge base
- Analytics calculations
- Forecasting
- Anomaly detection
- CRM integration
- Email/Calendar integration
- MCP tool definitions
MCP tools
Company Data MCP
├── get_sales()
├── get_revenue()
├── get_customers()
├── get_leads()
└── get_expenses()

Analytics MCP
├── calculate_growth()
├── calculate_churn()
├── calculate_conversion()
└── detect_anomaly()

Action MCP
├── send_email()
├── update_crm()
├── create_task()
└── schedule_meeting()

👨‍💻 LOGESH — FRONTEND / BACKEND / PLATFORM ENGINEER
Owns: Product users interact with
person-3/
├── apps/
│   └── web/
│
├── services/
│   └── api/
│
└── packages/
    ├── ui/
    ├── auth/
    └── types/
Responsibilities
- Next.js frontend
- Dashboard
- CEO AI chat
- Business analytics UI
- Prediction UI
- Agent UI
- Workflow UI
- Approval UI
- Activity logs
- Authentication
- User management
- Company management
- API endpoints
Main screens
Login
 ↓
Company Dashboard
 ↓
CEO AI Assistant
 ↓
Analytics
 ↓
Predictions
 ↓
Agents
 ↓
Workflows
 ↓
Approvals
 ↓
Activity
 ↓
Integrations
🔗 How the 3 people connect
                PERSON 3
          Frontend + Backend
                  │
                  │ API
                  ▼
                PERSON 1
        Orchestrator + Agents
                  │
                  │ MCP
                  ▼
                PERSON 2
           MCP + Data + ML
                  │
                  ▼
       PostgreSQL / CRM / APIs


Planning chat link: https://chatgpt.com/share/6aa927cc-ed00-83ee-a56a-63d2c63038e8

---

## ⚡ Asura Platform Implementation (Full-Stack Monorepo)

This repository includes the complete implementation of the multi-agent autonomous system:

```
cretivra_analyst_ai/
├── asura_backend/             # Python FastAPI Multi-Agent Engine
│   ├── agents/                # 8 Domain-Tuned Specialized Agents
│   ├── core/                  # Platform Orchestrator, Planner DAG, Guardrails
│   ├── tools/                 # MCP Tool Registry, Sandboxed Code Executor, Lead Scanner
│   ├── memory/                # RAG Vector Store, Knowledge Graph, Episodic Memory
│   ├── observability/         # OpenTelemetry Tracing, Token/Cost Counters, Audit Logs
│   ├── connectors/            # Enterprise DB, CRM, K8s, S3, Kafka Connectors
│   ├── api/                   # REST API & Real-time WebSockets
│   └── tests/                 # Unit & Integration Test Suite
│
├── asura_frontend/            # React 19 + TypeScript Cyber-Tactical Dashboard
│   ├── src/components/
│   │   ├── ArchitectureCanvas # Interactive 10-Subsystem Blueprint Explorer
│   │   ├── MissionStudio      # Live Multi-Agent Mission Control & HITL Approval
│   │   ├── AgentFleetView     # Specialized Agent Fleet Commander
│   │   ├── ToolSandboxView    # MCP Hub & Tool Sandbox
│   │   ├── MemoryExplorerView # Knowledge Graph & Vector RAG Explorer
│   │   └── ObservabilityView  # Real-Time Telemetry & Audit Stream
│   └── src/index.css          # Custom Obsidian & Bronze/Amber Design System
```

### Quickstart

#### 1. Start Backend API & Engine
```bash
pip install -r asura_backend/requirements.txt websockets
python -m uvicorn asura_backend.main:app --host 127.0.0.1 --port 8000 --reload
```
* API Docs: http://127.0.0.1:8000/docs
* Live WebSockets: ws://127.0.0.1:8000/api/ws/live

#### 2. Start Frontend Dashboard
```bash
cd asura_frontend
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```
* Dashboard UI: http://127.0.0.1:5173/
