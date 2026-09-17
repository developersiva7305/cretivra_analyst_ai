import React, { useState } from 'react';
import { AgentInfo, ToolInfo } from '../types';
import {
  Users,
  ShieldCheck,
  Zap,
  Terminal,
  Play,
  CheckCircle2,
  Lock,
  Cpu,
  Sliders
} from 'lucide-react';

interface Props {
  agents: AgentInfo[];
  tools: ToolInfo[];
  selectedAgentId: string | null;
  onSelectAgent: (agentId: string) => void;
  onLaunchTask: (goal: string) => void;
}

export const AgentFleetView: React.FC<Props> = ({
  agents,
  tools,
  selectedAgentId,
  onSelectAgent,
  onLaunchTask
}) => {
  const activeAgent = agents.find(a => a.agent_id === (selectedAgentId || agents[0]?.agent_id)) || agents[0];
  const [customQuery, setCustomQuery] = useState('');

  const getTierBadge = (tier: string) => {
    return <span className="badge badge-amber">{tier}</span>;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.35rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #d97706, #92400e)',
            padding: '0.5rem',
            borderRadius: '10px',
            boxShadow: '0 0 15px rgba(217, 119, 6, 0.35)'
          }}>
            <Users size={22} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>
              Specialized Agent Fleet Commander
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              8 Domain-Tuned Autonomous Agents Orchestrated by the Asura Core Engine
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="badge badge-emerald">Fleet Online (8/8)</span>
        </div>
      </div>

      {/* Grid Layout: Agents Cards (Left 65%) + Selected Agent Detail Inspector (Right 35%) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: '1.25rem' }}>
        {/* Agent Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.85rem' }}>
          {agents.map(agent => {
            const isSelected = activeAgent?.agent_id === agent.agent_id;
            return (
              <div
                key={agent.agent_id}
                onClick={() => onSelectAgent(agent.agent_id)}
                style={{
                  background: isSelected ? 'rgba(234, 88, 12, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                  border: isSelected ? '1.5px solid #ea580c' : '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '1.1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 0 25px rgba(234, 88, 12, 0.25)' : 'none'
                }}
                onMouseEnter={e => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.5)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.transform = 'none';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #78350f, #451a03)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid #d97706'
                    }}>
                      <Cpu size={16} color="#fbbf24" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc' }}>
                        {agent.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#d97706', fontFamily: 'var(--font-mono)' }}>
                        {agent.tier}
                      </div>
                    </div>
                  </div>
                  <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>
                    {agent.status}
                  </span>
                </div>

                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '0.85rem' }}>
                  {agent.role_description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.65rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                    Tools: {agent.allowed_tools.length} | Tasks: {agent.completed_tasks_count}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 600 }}>
                    Select →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Agent Inspector Panel */}
        {activeAgent && (
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
                  {activeAgent.name}
                </h3>
                <span className="badge badge-amber" style={{ marginTop: '0.3rem' }}>
                  Tier: {activeAgent.tier}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>AGENT ID</div>
                <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#fbbf24' }}>
                  {activeAgent.agent_id}
                </div>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Operational Scope
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                {activeAgent.role_description}
              </p>
            </div>

            {/* Allowed Tools */}
            <div>
              <h4 style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.45rem' }}>
                Authorized MCP Tools ({activeAgent.allowed_tools.length})
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {activeAgent.allowed_tools.map(tool => (
                  <span key={tool} className="badge badge-cyan" style={{ fontSize: '0.72rem' }}>
                    <Zap size={10} /> {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Model Hyperparameters */}
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.35rem' }}>
                <span style={{ color: '#94a3b8' }}>Model Temperature</span>
                <span style={{ color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>{activeAgent.temperature}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                <span style={{ color: '#94a3b8' }}>Completed Executions</span>
                <span style={{ color: '#34d399', fontFamily: 'var(--font-mono)' }}>{activeAgent.completed_tasks_count}</span>
              </div>
            </div>

            {/* Direct Task Dispatch */}
            <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.45rem' }}>
                Dispatch Direct Agent Mission
              </h4>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder={`Task for ${activeAgent.name}...`}
                  value={customQuery}
                  onChange={e => setCustomQuery(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && customQuery.trim()) {
                      onLaunchTask(`[${activeAgent.name}] ${customQuery}`);
                      setCustomQuery('');
                    }
                  }}
                  style={{
                    flex: 1,
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '0.55rem 0.8rem',
                    color: '#fff',
                    fontSize: '0.82rem',
                    outline: 'none'
                  }}
                />
                <button
                  className="btn-primary"
                  style={{ padding: '0.5rem 0.85rem' }}
                  onClick={() => {
                    if (customQuery.trim()) {
                      onLaunchTask(`[${activeAgent.name}] ${customQuery}`);
                      setCustomQuery('');
                    }
                  }}
                >
                  <Play size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
