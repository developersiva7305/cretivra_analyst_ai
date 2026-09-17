export interface AgentInfo {
  agent_id: string;
  name: string;
  role_description: string;
  tier: string;
  allowed_tools: string[];
  temperature: number;
  status: string;
  completed_tasks_count: number;
}

export interface ToolParam {
  name: string;
  type: string;
  description: string;
  required: boolean;
  default?: any;
}

export interface ToolInfo {
  name: string;
  description: string;
  category: string;
  parameters: ToolParam[];
  risk_level: string;
  is_mcp_standard: boolean;
  rate_limit_per_min: number;
}

export interface ToolExecutionResult {
  tool_name: string;
  success: boolean;
  output: any;
  latency_ms: number;
  cached?: boolean;
  error?: string;
  audit_trace_id?: string;
}

export interface WorkflowStep {
  id: string;
  title: string;
  assigned_agent: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'WAITING_APPROVAL' | 'COMPLETED' | 'FAILED';
  output?: any;
  thought?: string;
  tool_calls: Array<{
    tool: string;
    params: Record<string, any>;
    result: any;
  }>;
  hitl_prompt?: string;
  latency_ms: number;
}

export interface WorkflowInstance {
  workflow_id: string;
  title: string;
  trigger_channel: string;
  goal: string;
  status: 'INITIALIZING' | 'READY' | 'RUNNING' | 'WAITING_APPROVAL' | 'COMPLETED' | 'FAILED';
  steps: WorkflowStep[];
  current_step_index: number;
  final_output?: string;
  created_at: number;
  updated_at: number;
}

export interface BlueprintNode {
  id: string;
  label: string;
  type?: string;
  agent_id?: string;
  tier?: string;
}

export interface BlueprintCluster {
  id: string;
  name: string;
  description: string;
  color: string;
  nodes: BlueprintNode[];
}

export interface BlueprintSchema {
  title: string;
  clusters: BlueprintCluster[];
}

export interface KnowledgeNode {
  id: string;
  label: string;
  type: string;
  properties?: Record<string, any>;
}

export interface KnowledgeEdge {
  source: string;
  target: string;
  relation: string;
  weight?: number;
}

export interface KnowledgeGraphData {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
}

export interface RagResultItem {
  document: {
    id: string;
    title: string;
    content: string;
    metadata: Record<string, any>;
  };
  score: number;
}

export interface EpisodicRecord {
  id: string;
  task_id: string;
  agent_id: string;
  goal: string;
  summary: string;
  reflection: string;
  success: boolean;
  timestamp: number;
}

export interface AuditEvent {
  id: string;
  event_type: string;
  severity: 'INFO' | 'WARN' | 'CRITICAL';
  actor: string;
  action: string;
  target: string;
  metadata: Record<string, any>;
  timestamp: number;
}

export interface TelemetrySummary {
  total_workflows: number;
  total_tokens_consumed: number;
  total_cost_accrued_usd: number;
  active_workflows: number;
  audit_events_count: number;
  recent_audit_events: AuditEvent[];
}

export interface ConnectorInfo {
  id: string;
  name: string;
  category: string;
  status: string;
  endpoint: string;
  sync_frequency: string;
  records_synced: number;
  last_synced: number;
}
