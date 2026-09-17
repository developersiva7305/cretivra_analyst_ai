import {
  AgentInfo,
  ToolInfo,
  WorkflowInstance,
  BlueprintSchema,
  KnowledgeGraphData,
  RagResultItem,
  EpisodicRecord,
  TelemetrySummary,
  ConnectorInfo,
  ToolExecutionResult
} from './types';

const API_BASE = 'http://127.0.0.1:8000/api';

export const api = {
  async getBlueprint(): Promise<BlueprintSchema> {
    const res = await fetch(`${API_BASE}/blueprint`);
    if (!res.ok) throw new Error('Failed to load blueprint');
    return res.json();
  },

  async getAgents(): Promise<AgentInfo[]> {
    const res = await fetch(`${API_BASE}/agents`);
    if (!res.ok) throw new Error('Failed to load agents');
    return res.json();
  },

  async getTools(): Promise<ToolInfo[]> {
    const res = await fetch(`${API_BASE}/tools`);
    if (!res.ok) throw new Error('Failed to load tools');
    return res.json();
  },

  async executeTool(tool_name: string, params: Record<string, any>): Promise<ToolExecutionResult> {
    const res = await fetch(`${API_BASE}/tools/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool_name, params })
    });
    if (!res.ok) throw new Error('Tool execution failed');
    return res.json();
  },

  async getWorkflows(): Promise<WorkflowInstance[]> {
    const res = await fetch(`${API_BASE}/workflows`);
    if (!res.ok) throw new Error('Failed to load workflows');
    return res.json();
  },

  async createWorkflow(goal: string, trigger_channel: string = 'web_portal'): Promise<WorkflowInstance> {
    const res = await fetch(`${API_BASE}/workflows`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal, trigger_channel })
    });
    if (!res.ok) throw new Error('Failed to create workflow');
    return res.json();
  },

  async approveHitl(workflow_id: string, decision: 'APPROVED' | 'REJECTED', notes: string = ''): Promise<any> {
    const res = await fetch(`${API_BASE}/workflows/${workflow_id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision, notes })
    });
    if (!res.ok) throw new Error('Failed to submit HITL decision');
    return res.json();
  },

  async getKnowledgeGraph(): Promise<KnowledgeGraphData> {
    const res = await fetch(`${API_BASE}/memory/graph`);
    if (!res.ok) throw new Error('Failed to load knowledge graph');
    return res.json();
  },

  async searchRag(query: string, top_k: number = 3): Promise<RagResultItem[]> {
    const res = await fetch(`${API_BASE}/memory/rag`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, top_k })
    });
    if (!res.ok) throw new Error('Failed to search RAG');
    return res.json();
  },

  async getEpisodes(query?: string): Promise<EpisodicRecord[]> {
    const url = query ? `${API_BASE}/memory/episodes?query=${encodeURIComponent(query)}` : `${API_BASE}/memory/episodes`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to load episodes');
    return res.json();
  },

  async getTelemetry(): Promise<TelemetrySummary> {
    const res = await fetch(`${API_BASE}/telemetry`);
    if (!res.ok) throw new Error('Failed to load telemetry');
    return res.json();
  },

  async getConnectors(): Promise<ConnectorInfo[]> {
    const res = await fetch(`${API_BASE}/connectors`);
    if (!res.ok) throw new Error('Failed to load connectors');
    return res.json();
  }
};
