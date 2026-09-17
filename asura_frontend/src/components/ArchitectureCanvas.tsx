import React, { useState } from 'react';
import {
  BlueprintSchema,
  BlueprintCluster,
  BlueprintNode,
  AgentInfo,
  ToolInfo
} from '../types';
import {
  Layers,
  Cpu,
  Radio,
  Sliders,
  Database,
  ShieldCheck,
  Wrench,
  Server,
  Activity,
  ChevronRight,
  Info,
  PlayCircle,
  ExternalLink
} from 'lucide-react';

interface Props {
  blueprint: BlueprintSchema | null;
  agents: AgentInfo[];
  tools: ToolInfo[];
  onSelectAgent: (agentId: string) => void;
  onLaunchMission: (goal: string) => void;
}

export const ArchitectureCanvas: React.FC<Props> = ({
  blueprint,
  agents,
  tools,
  onSelectAgent,
  onLaunchMission
}) => {
  const [selectedNode, setSelectedNode] = useState<{ node: BlueprintNode; cluster: BlueprintCluster } | null>(null);
  const [filterTier, setFilterTier] = useState<string>('all');
  const [isSimulatingPulse, setIsSimulatingPulse] = useState<boolean>(true);

  if (!blueprint) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading Architecture Blueprint...
      </div>
    );
  }

  const getClusterIcon = (clusterId: string) => {
    switch (clusterId) {
      case 'agent_layer': return <Layers size={18} color="#f59e0b" />;
      case 'comm_gateway': return <Radio size={18} color="#fbbf24" />;
      case 'core_engine': return <Cpu size={18} color="#ea580c" />;
      case 'execution_pipeline': return <Sliders size={18} color="#d97706" />;
      case 'memory_system': return <Database size={18} color="#b45309" />;
      case 'tool_sandbox': return <Wrench size={18} color="#f97316" />;
      case 'data_sources': return <Server size={18} color="#eab308" />;
      case 'storage_layer': return <Database size={18} color="#ca8a04" />;
      case 'observability_layer': return <Activity size={18} color="#ef4444" />;
      case 'deployment_infra': return <ShieldCheck size={18} color="#10b981" />;
      default: return <Info size={18} color="#f59e0b" />;
    }
  };

  const findCluster = (id: string) => blueprint.clusters.find(c => c.id === id);

  const agentCluster = findCluster('agent_layer');
  const commCluster = findCluster('comm_gateway');
  const coreCluster = findCluster('core_engine');
  const pipeCluster = findCluster('execution_pipeline');
  const memCluster = findCluster('memory_system');
  const toolCluster = findCluster('tool_sandbox');
  const dataSourcesCluster = findCluster('data_sources');
  const storageCluster = findCluster('storage_layer');
  const obsCluster = findCluster('observability_layer');
  const deployCluster = findCluster('deployment_infra');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Banner Toolbar */}
      <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.25), rgba(180, 83, 9, 0.25))',
            padding: '0.45rem',
            borderRadius: '8px',
            border: '1px solid rgba(245, 158, 11, 0.4)'
          }}>
            <Cpu size={20} color="#fbbf24" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Asura Architectural Blueprint & Subsystem Explorer
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Faithful interactive system model of the 10 architecture tiers from the uploaded platform blueprint
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            className={`btn-secondary ${isSimulatingPulse ? 'active' : ''}`}
            onClick={() => setIsSimulatingPulse(!isSimulatingPulse)}
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
          >
            <Activity size={15} color={isSimulatingPulse ? '#10b981' : '#94a3b8'} />
            {isSimulatingPulse ? 'Live Bus Flow: Active' : 'Live Bus Flow: Paused'}
          </button>
          <button
            className="btn-primary"
            onClick={() => onLaunchMission('Resolve P0 infrastructure outage on auth service and drain compromised pod')}
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.95rem' }}
          >
            <PlayCircle size={15} />
            Simulate P0 Outage
          </button>
        </div>
      </div>

      {/* Main Architecture Visual Canvas */}
      <div style={{
        background: 'rgba(11, 14, 21, 0.92)',
        borderRadius: '16px',
        border: '1px solid rgba(245, 158, 11, 0.25)',
        padding: '1.75rem',
        position: 'relative',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), inset 0 0 40px rgba(0, 0, 0, 0.6)'
      }}>
        {/* Ambient Grid overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(245, 158, 11, 0.04) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          pointerEvents: 'none',
          borderRadius: '16px'
        }} />

        {/* TOP ROW: Specialized Agent Layer (left) & Communication Ingress (right) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
          {/* 1. Specialized Agent Layer */}
          {agentCluster && (
            <div style={{
              background: 'rgba(20, 26, 38, 0.85)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              borderRadius: '12px',
              padding: '1rem',
              boxShadow: isSimulatingPulse ? '0 0 20px rgba(245, 158, 11, 0.12)' : 'none'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {getClusterIcon(agentCluster.id)}
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fbbf24', letterSpacing: '0.5px' }}>
                    {agentCluster.name.toUpperCase()}
                  </span>
                </div>
                <span className="badge badge-amber">{agentCluster.nodes.length} Specialized Agents</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                {agentCluster.nodes.map(n => (
                  <div
                    key={n.id}
                    onClick={() => setSelectedNode({ node: n, cluster: agentCluster })}
                    style={{
                      background: 'linear-gradient(145deg, #2a1608, #1c0f05)',
                      border: '1px solid #78350f',
                      borderRadius: '8px',
                      padding: '0.65rem 0.5rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.4)'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#fbbf24';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#78350f';
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#fef3c7' }}>{n.label}</div>
                    <div style={{ fontSize: '0.65rem', color: '#d97706', marginTop: '0.2rem', fontFamily: 'var(--font-mono)' }}>
                      {n.tier}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Communication Ingestion & Gateway */}
          {commCluster && (
            <div style={{
              background: 'rgba(20, 26, 38, 0.85)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              borderRadius: '12px',
              padding: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {getClusterIcon(commCluster.id)}
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fbbf24', letterSpacing: '0.5px' }}>
                    {commCluster.name.toUpperCase()}
                  </span>
                </div>
                <span className="badge badge-emerald">Ingress Active</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                {commCluster.nodes.slice(0, 6).map(n => (
                  <div
                    key={n.id}
                    onClick={() => setSelectedNode({ node: n, cluster: commCluster })}
                    style={{
                      background: 'linear-gradient(145deg, #2a1608, #1c0f05)',
                      border: '1px solid #78350f',
                      borderRadius: '8px',
                      padding: '0.55rem',
                      fontSize: '0.74rem',
                      textAlign: 'center',
                      color: '#fef3c7',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#fbbf24'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#78350f'; }}
                  >
                    {n.label}
                  </div>
                ))}
              </div>
              {/* Dynamic Ingress Broker */}
              <div style={{
                marginTop: '0.6rem',
                background: 'rgba(234, 88, 12, 0.15)',
                border: '1px dashed #d97706',
                borderRadius: '8px',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.74rem',
                color: '#fed7aa'
              }}>
                <span>Routing: Token Verify & Ingress Queue</span>
                <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>2.1k req/s</span>
              </div>
            </div>
          )}
        </div>

        {/* MIDDLE SECTION: Tool Sandbox (Left), Execution Pipeline (Center-Left), Core Engine (Center), Memory/Knowledge (Right) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr 1.4fr 1.1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
          {/* 3. Tool Execution Engine (Left Vertical) */}
          {toolCluster && (
            <div style={{
              background: 'rgba(20, 26, 38, 0.85)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              borderRadius: '12px',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                {getClusterIcon(toolCluster.id)}
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fbbf24' }}>TOOL SANDBOX & MCP</span>
              </div>
              {toolCluster.nodes.map(n => (
                <div
                  key={n.id}
                  onClick={() => setSelectedNode({ node: n, cluster: toolCluster })}
                  style={{
                    background: 'linear-gradient(145deg, #2a1608, #1c0f05)',
                    border: '1px solid #78350f',
                    borderRadius: '6px',
                    padding: '0.5rem',
                    fontSize: '0.72rem',
                    color: '#fef3c7',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#fbbf24'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#78350f'; }}
                >
                  {n.label}
                </div>
              ))}
            </div>
          )}

          {/* 4. Execution Pipeline (Middle-Left Vertical) */}
          {pipeCluster && (
            <div style={{
              background: 'rgba(20, 26, 38, 0.85)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              borderRadius: '12px',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                {getClusterIcon(pipeCluster.id)}
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fbbf24' }}>EXECUTION PIPELINE</span>
              </div>
              {pipeCluster.nodes.map(n => (
                <div
                  key={n.id}
                  onClick={() => setSelectedNode({ node: n, cluster: pipeCluster })}
                  style={{
                    background: 'linear-gradient(145deg, #2a1608, #1c0f05)',
                    border: '1px solid #78350f',
                    borderRadius: '6px',
                    padding: '0.5rem',
                    fontSize: '0.72rem',
                    color: '#fef3c7',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#fbbf24'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#78350f'; }}
                >
                  {n.label}
                </div>
              ))}
            </div>
          )}

          {/* 5. Core Orchestration Engine (Center) */}
          {coreCluster && (
            <div style={{
              background: 'rgba(26, 32, 48, 0.95)',
              border: '2px solid #ea580c',
              borderRadius: '14px',
              padding: '1.25rem',
              boxShadow: '0 0 30px rgba(234, 88, 12, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                  <Cpu size={20} color="#ea580c" />
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff', letterSpacing: '0.5px' }}>
                    CORE AGENTIC ORCHESTRATOR
                  </span>
                </div>
                <span className="badge badge-amber" style={{ animation: 'livePulse 2.5s infinite ease-in-out' }}>
                  CENTRAL PLATFORM
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.55rem' }}>
                {coreCluster.nodes.map(n => (
                  <div
                    key={n.id}
                    onClick={() => setSelectedNode({ node: n, cluster: coreCluster })}
                    style={{
                      background: n.id === 'core_hitl' ? 'linear-gradient(145deg, #431407, #270d05)' : 'linear-gradient(145deg, #2e1708, #1d0f05)',
                      border: n.id === 'core_hitl' ? '1px solid #ea580c' : '1px solid #9a3412',
                      borderRadius: '8px',
                      padding: '0.65rem 0.5rem',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      color: n.id === 'core_hitl' ? '#ffedd5' : '#fef3c7',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#fbbf24'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = n.id === 'core_hitl' ? '#ea580c' : '#9a3412'; }}
                  >
                    {n.label}
                    {n.id === 'core_hitl' && (
                      <div style={{ fontSize: '0.62rem', color: '#ea580c', marginTop: '0.15rem' }}>
                        HITL Approval Gate
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Agent Memory & Knowledge System (Right Vertical) */}
          {memCluster && (
            <div style={{
              background: 'rgba(20, 26, 38, 0.85)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              borderRadius: '12px',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                {getClusterIcon(memCluster.id)}
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fbbf24' }}>MEMORY & KNOWLEDGE</span>
              </div>
              {memCluster.nodes.map(n => (
                <div
                  key={n.id}
                  onClick={() => setSelectedNode({ node: n, cluster: memCluster })}
                  style={{
                    background: 'linear-gradient(145deg, #2a1608, #1c0f05)',
                    border: '1px solid #78350f',
                    borderRadius: '6px',
                    padding: '0.5rem',
                    fontSize: '0.72rem',
                    color: '#fef3c7',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#fbbf24'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#78350f'; }}
                >
                  {n.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BOTTOM SECTION: Enterprise Connectors (Horizontal Banner) */}
        {dataSourcesCluster && (
          <div style={{
            background: 'rgba(20, 26, 38, 0.85)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Server size={18} color="#fbbf24" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fbbf24' }}>
                  ENTERPRISE DATA SOURCES & CONNECTORS
                </span>
              </div>
              <span className="badge badge-emerald">10 Enterprise Connectors Live</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
              {dataSourcesCluster.nodes.map(n => (
                <div
                  key={n.id}
                  onClick={() => setSelectedNode({ node: n, cluster: dataSourcesCluster })}
                  style={{
                    background: 'linear-gradient(145deg, #221206, #160c04)',
                    border: '1px solid #78350f',
                    borderRadius: '8px',
                    padding: '0.55rem',
                    fontSize: '0.72rem',
                    textAlign: 'center',
                    color: '#fef3c7',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#fbbf24'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#78350f'; }}
                >
                  {n.label}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FOOTER ROW: Data & Storage (Left), Observability & Governance (Center), Deployment (Right) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.4fr 1fr', gap: '1.25rem' }}>
          {/* Storage Architecture */}
          {storageCluster && (
            <div style={{
              background: 'rgba(20, 26, 38, 0.85)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              borderRadius: '12px',
              padding: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
                <Database size={18} color="#fbbf24" />
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fbbf24' }}>STORAGE ARCHITECTURE</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.45rem' }}>
                {storageCluster.nodes.map(n => (
                  <div
                    key={n.id}
                    onClick={() => setSelectedNode({ node: n, cluster: storageCluster })}
                    style={{
                      background: 'linear-gradient(145deg, #221206, #160c04)',
                      border: '1px solid #78350f',
                      borderRadius: '6px',
                      padding: '0.45rem',
                      fontSize: '0.7rem',
                      color: '#fef3c7',
                      textAlign: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    {n.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Observability, Governance & Audit */}
          {obsCluster && (
            <div style={{
              background: 'rgba(20, 26, 38, 0.85)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              borderRadius: '12px',
              padding: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Activity size={18} color="#ef4444" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fbbf24' }}>
                    AUDIT, GOVERNANCE & OBSERVABILITY
                  </span>
                </div>
                <span className="badge badge-emerald">OpenTelemetry</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.45rem' }}>
                {obsCluster.nodes.map(n => (
                  <div
                    key={n.id}
                    onClick={() => setSelectedNode({ node: n, cluster: obsCluster })}
                    style={{
                      background: 'linear-gradient(145deg, #221206, #160c04)',
                      border: '1px solid #78350f',
                      borderRadius: '6px',
                      padding: '0.45rem',
                      fontSize: '0.7rem',
                      color: '#fef3c7',
                      textAlign: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    {n.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Infrastructure & Deployment */}
          {deployCluster && (
            <div style={{
              background: 'rgba(20, 26, 38, 0.85)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              borderRadius: '12px',
              padding: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
                <ShieldCheck size={18} color="#10b981" />
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fbbf24' }}>DEPLOYMENT & CLOUD</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {deployCluster.nodes.map(n => (
                  <div
                    key={n.id}
                    onClick={() => setSelectedNode({ node: n, cluster: deployCluster })}
                    style={{
                      background: 'linear-gradient(145deg, #221206, #160c04)',
                      border: '1px solid #78350f',
                      borderRadius: '6px',
                      padding: '0.45rem',
                      fontSize: '0.7rem',
                      color: '#fef3c7',
                      cursor: 'pointer'
                    }}
                  >
                    {n.label}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Node Inspector Modal */}
      {selectedNode && (
        <div className="modal-overlay" onClick={() => setSelectedNode(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{
                  background: 'rgba(234, 88, 12, 0.2)',
                  padding: '0.5rem',
                  borderRadius: '10px',
                  border: '1px solid #ea580c'
                }}>
                  <Cpu size={22} color="#ea580c" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
                    {selectedNode.node.label}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#f59e0b', fontFamily: 'var(--font-mono)' }}>
                    Cluster: {selectedNode.cluster.name}
                  </p>
                </div>
              </div>
              <button
                className="btn-secondary"
                onClick={() => setSelectedNode(null)}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
              >
                ✕ Close
              </button>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '10px',
              padding: '1rem',
              marginBottom: '1.25rem',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <h4 style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                Subsystem Role & Description
              </h4>
              <p style={{ fontSize: '0.9rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                {selectedNode.cluster.description} This component operates inside the Asura Agentic Platform architecture,
                maintaining active bidirectional synchronization with the Core Platform Orchestrator and enterprise telemetry.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              {selectedNode.node.agent_id && (
                <button
                  className="btn-primary"
                  onClick={() => {
                    onSelectAgent(selectedNode.node.agent_id!);
                    setSelectedNode(null);
                  }}
                >
                  Inspect Agent Profile
                </button>
              )}
              <button
                className="btn-secondary"
                onClick={() => setSelectedNode(null)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
