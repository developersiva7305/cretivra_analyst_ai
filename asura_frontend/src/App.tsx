import React, { useState, useEffect, useRef } from 'react';
import {
  BlueprintSchema,
  AgentInfo,
  ToolInfo,
  WorkflowInstance,
  KnowledgeGraphData,
  EpisodicRecord,
  TelemetrySummary,
  ConnectorInfo
} from './types';
import { api } from './api';

import { ArchitectureCanvas } from './components/ArchitectureCanvas';
import { MissionStudio } from './components/MissionStudio';
import { AgentFleetView } from './components/AgentFleetView';
import { ToolSandboxView } from './components/ToolSandboxView';
import { MemoryExplorerView } from './components/MemoryExplorerView';
import { ObservabilityView } from './components/ObservabilityView';

import {
  Layers,
  Zap,
  Users,
  Wrench,
  Database,
  Activity,
  Cpu,
  RefreshCw
} from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'blueprint' | 'studio' | 'fleet' | 'sandbox' | 'memory' | 'observability'>('blueprint');

  // Platform State
  const [blueprint, setBlueprint] = useState<BlueprintSchema | null>(null);
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [tools, setTools] = useState<ToolInfo[]>([]);
  const [workflows, setWorkflows] = useState<WorkflowInstance[]>([]);
  const [activeWorkflow, setActiveWorkflow] = useState<WorkflowInstance | null>(null);
  const [graphData, setGraphData] = useState<KnowledgeGraphData | null>(null);
  const [episodes, setEpisodes] = useState<EpisodicRecord[]>([]);
  const [telemetry, setTelemetry] = useState<TelemetrySummary | null>(null);
  const [connectors, setConnectors] = useState<ConnectorInfo[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [wsConnected, setWsConnected] = useState<boolean>(false);

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    loadPlatformData();
    setupWebSocket();

    const interval = setInterval(() => {
      refreshLightweightTelemetry();
    }, 4000);

    return () => {
      clearInterval(interval);
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  const loadPlatformData = async () => {
    try {
      const [bp, ag, tl, wf, gr, ep, te, co] = await Promise.all([
        api.getBlueprint(),
        api.getAgents(),
        api.getTools(),
        api.getWorkflows(),
        api.getKnowledgeGraph(),
        api.getEpisodes(),
        api.getTelemetry(),
        api.getConnectors()
      ]);
      setBlueprint(bp);
      setAgents(ag);
      setTools(tl);
      setWorkflows(wf);
      if (wf.length > 0) {
        setActiveWorkflow(wf[wf.length - 1]);
      }
      setGraphData(gr);
      setEpisodes(ep);
      setTelemetry(te);
      setConnectors(co);
    } catch (err) {
      console.warn('Initial load error, falling back or waiting for server:', err);
    }
  };

  const refreshLightweightTelemetry = async () => {
    try {
      const [te, wf, ep] = await Promise.all([
        api.getTelemetry(),
        api.getWorkflows(),
        api.getEpisodes()
      ]);
      setTelemetry(te);
      setWorkflows(wf);
      setEpisodes(ep);
      if (wf.length > 0) {
        setActiveWorkflow(prev => {
          if (!prev) return wf[wf.length - 1];
          const updated = wf.find(w => w.workflow_id === prev.workflow_id);
          return updated || prev;
        });
      }
    } catch (e) {
      // Backend maybe polling
    }
  };

  const setupWebSocket = () => {
    try {
      const wsUrl = 'ws://127.0.0.1:8000/api/ws/live';
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setWsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'INITIAL_SNAPSHOT') {
            if (data.active_workflows && data.active_workflows.length > 0) {
              setWorkflows(data.active_workflows);
              setActiveWorkflow(data.active_workflows[data.active_workflows.length - 1]);
            }
            if (data.telemetry) setTelemetry(data.telemetry);
          } else if (data.type === 'WORKFLOW_UPDATED' || data.type === 'STEP_STARTED' || data.type === 'STEP_COMPLETED' || data.type === 'HITL_REQUESTED' || data.type === 'WORKFLOW_COMPLETED') {
            refreshLightweightTelemetry();
          }
        } catch (e) {
          console.error('Error handling WS event', e);
        }
      };

      ws.onerror = () => {
        setWsConnected(false);
      };

      ws.onclose = () => {
        setWsConnected(false);
        // Retry connection after 5s
        setTimeout(setupWebSocket, 5000);
      };
    } catch (e) {
      setWsConnected(false);
    }
  };

  const handleLaunchMissionFromBlueprint = async (goal: string) => {
    setActiveTab('studio');
    try {
      const wf = await api.createWorkflow(goal, 'web_portal');
      setWorkflows(prev => [...prev, wf]);
      setActiveWorkflow(wf);
    } catch (e: any) {
      alert(`Error launching mission: ${e.message}`);
    }
  };

  return (
    <div className="app-container">
      {/* Top Cyber-Tactical Navbar */}
      <header className="top-navbar">
        <div className="brand-section">
          <div className="brand-icon-box">
            <Cpu size={22} color="#fef08a" />
          </div>
          <div>
            <h1 className="brand-title">ASURA</h1>
            <div className="brand-subtitle">AGENTIC MULTI-TIER PLATFORM</div>
          </div>
        </div>

        {/* Primary Tab Navigation */}
        <nav className="nav-tabs">
          <button
            className={`nav-tab-btn ${activeTab === 'blueprint' ? 'active' : ''}`}
            onClick={() => setActiveTab('blueprint')}
          >
            <Layers size={16} /> Architecture Blueprint
          </button>
          <button
            className={`nav-tab-btn ${activeTab === 'studio' ? 'active' : ''}`}
            onClick={() => setActiveTab('studio')}
          >
            <Zap size={16} /> Mission Studio
          </button>
          <button
            className={`nav-tab-btn ${activeTab === 'fleet' ? 'active' : ''}`}
            onClick={() => setActiveTab('fleet')}
          >
            <Users size={16} /> Agent Fleet (8)
          </button>
          <button
            className={`nav-tab-btn ${activeTab === 'sandbox' ? 'active' : ''}`}
            onClick={() => setActiveTab('sandbox')}
          >
            <Wrench size={16} /> Tool MCP Hub
          </button>
          <button
            className={`nav-tab-btn ${activeTab === 'memory' ? 'active' : ''}`}
            onClick={() => setActiveTab('memory')}
          >
            <Database size={16} /> Memory & Knowledge
          </button>
          <button
            className={`nav-tab-btn ${activeTab === 'observability' ? 'active' : ''}`}
            onClick={() => setActiveTab('observability')}
          >
            <Activity size={16} /> Governance & Audit
          </button>
        </nav>

        {/* Live Status Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div className="nav-status-badge">
            <span className="status-dot" style={{ background: wsConnected ? '#10b981' : '#f59e0b' }} />
            {wsConnected ? 'CORE ENGINE: LIVE (WS)' : 'CORE ENGINE: POLLING'}
          </div>
          <button
            className="btn-secondary"
            onClick={loadPlatformData}
            title="Refresh state"
            style={{ padding: '0.45rem 0.65rem' }}
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'blueprint' && (
          <ArchitectureCanvas
            blueprint={blueprint}
            agents={agents}
            tools={tools}
            onSelectAgent={(id) => {
              setSelectedAgentId(id);
              setActiveTab('fleet');
            }}
            onLaunchMission={handleLaunchMissionFromBlueprint}
          />
        )}

        {activeTab === 'studio' && (
          <MissionStudio
            activeWorkflow={activeWorkflow}
            agents={agents}
            onWorkflowCreated={(wf) => {
              setWorkflows(prev => [...prev, wf]);
              setActiveWorkflow(wf);
            }}
            onWorkflowUpdated={(wf) => {
              setActiveWorkflow(wf);
            }}
          />
        )}

        {activeTab === 'fleet' && (
          <AgentFleetView
            agents={agents}
            tools={tools}
            selectedAgentId={selectedAgentId}
            onSelectAgent={setSelectedAgentId}
            onLaunchTask={handleLaunchMissionFromBlueprint}
          />
        )}

        {activeTab === 'sandbox' && (
          <ToolSandboxView tools={tools} />
        )}

        {activeTab === 'memory' && (
          <MemoryExplorerView
            graphData={graphData}
            episodes={episodes}
          />
        )}

        {activeTab === 'observability' && (
          <ObservabilityView
            telemetry={telemetry}
            connectors={connectors}
          />
        )}
      </main>
    </div>
  );
};

export default App;
