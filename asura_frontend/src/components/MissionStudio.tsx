import React, { useState } from 'react';
import {
  WorkflowInstance,
  WorkflowStep,
  AgentInfo
} from '../types';
import { api } from '../api';
import {
  Play,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Terminal,
  Cpu,
  ShieldAlert,
  Send,
  Radio,
  FileCheck,
  Zap
} from 'lucide-react';

interface Props {
  activeWorkflow: WorkflowInstance | null;
  agents: AgentInfo[];
  onWorkflowCreated: (wf: WorkflowInstance) => void;
  onWorkflowUpdated: (wf: WorkflowInstance) => void;
}

export const MissionStudio: React.FC<Props> = ({
  activeWorkflow,
  agents,
  onWorkflowCreated,
  onWorkflowUpdated
}) => {
  const [prompt, setPrompt] = useState<string>('');
  const [channel, setChannel] = useState<string>('web_portal');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hitlNotes, setHitlNotes] = useState<string>('');
  const [hitlModalOpen, setHitlModalOpen] = useState<boolean>(false);

  const presetMissions = [
    {
      title: '🎯 Autonomous B2B Lead Generation & ICP Triage',
      prompt: 'Identify high-intent enterprise accounts matching ICP, enrich decision-maker contacts, score lead conversion probability, and sync qualified leads into CRM',
      channel: 'web_portal',
      color: '#10b981'
    },
    {
      title: 'P0 Cloud Outage & Pod Containment',
      prompt: 'Mitigate active P0 infrastructure outage on auth-gateway service, isolate compromised pod, and verify SLA failover',
      channel: 'webhook',
      color: '#ef4444'
    },
    {
      title: 'Account Churn Risk & ARR Protection',
      prompt: 'Detect high churn risk enterprise accounts, inspect Salesforce CRM history, and dispatch targeted retention workflow',
      channel: 'external_feed',
      color: '#f59e0b'
    },
    {
      title: 'High-Value Contract & Discount Review',
      prompt: 'Review enterprise contract requesting 25% discount threshold and route for Human-in-the-Loop executive authorization',
      channel: 'omnichannel',
      color: '#a855f7'
    },
    {
      title: 'Omnichannel Customer Support Escalation',
      prompt: 'Triage customer support ticket for Acme Corp, look up CRM SLA tier, and verify regression standards',
      channel: 'voice',
      color: '#06b6d4'
    }
  ];

  const handleLaunch = async (missionGoal: string, triggerChan: string = channel) => {
    if (!missionGoal.trim()) return;
    setIsSubmitting(true);
    try {
      const wf = await api.createWorkflow(missionGoal, triggerChan);
      onWorkflowCreated(wf);
      setPrompt('');
    } catch (e: any) {
      alert(`Error launching mission: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHitlDecision = async (decision: 'APPROVED' | 'REJECTED') => {
    if (!activeWorkflow) return;
    try {
      await api.approveHitl(activeWorkflow.workflow_id, decision, hitlNotes);
      setHitlModalOpen(false);
      setHitlNotes('');
      // Refresh workflow state
      const updated = await api.getWorkflows();
      const current = updated.find(w => w.workflow_id === activeWorkflow.workflow_id);
      if (current) onWorkflowUpdated(current);
    } catch (e: any) {
      alert(`Failed to submit decision: ${e.message}`);
    }
  };

  const getAgentObj = (agentId: string) => agents.find(a => a.agent_id === agentId);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="badge badge-emerald"><CheckCircle2 size={12} /> Completed</span>;
      case 'RUNNING':
      case 'IN_PROGRESS':
        return <span className="badge badge-amber"><Clock size={12} /> In Progress</span>;
      case 'WAITING_APPROVAL':
        return <span className="badge badge-crimson" style={{ animation: 'livePulse 1.5s infinite' }}><ShieldAlert size={12} /> HITL Approval</span>;
      case 'FAILED':
        return <span className="badge badge-crimson"><XCircle size={12} /> Intercepted</span>;
      default:
        return <span className="badge badge-cyan"><Clock size={12} /> Pending</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Preset Mission Launcher */}
      <div className="glass-panel">
        <div className="panel-header">
          <div className="panel-title-wrap">
            <Zap size={20} color="#f59e0b" />
            <h2 className="panel-title">Mission Control & Autonomous Workflow Studio</h2>
          </div>
          <span className="badge badge-amber">Multi-Agent DAG</span>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Trigger multi-tier enterprise autonomous missions across specialized agent fleets, real-time tool sandboxes, and policy gates:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.85rem', marginBottom: '1.25rem' }}>
          {presetMissions.map((pm, idx) => (
            <div
              key={idx}
              onClick={() => handleLaunch(pm.prompt, pm.channel)}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = pm.color;
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 6px 20px ${pm.color}25`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.35rem' }}>
                  {pm.title}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {pm.prompt.slice(0, 75)}...
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem' }}>
                <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>{pm.channel}</span>
                <span style={{ fontSize: '0.75rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  Run <Play size={10} fill="#fbbf24" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Goal Input Bar */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(0,0,0,0.3)', padding: '0.3rem 0.6rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <Radio size={14} color="#f59e0b" />
            <select
              value={channel}
              onChange={e => setChannel(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#f8fafc',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-mono)',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="web_portal" style={{ background: '#0e121a' }}>Web Portal</option>
              <option value="voice" style={{ background: '#0e121a' }}>Voice Stream</option>
              <option value="omnichannel" style={{ background: '#0e121a' }}>Omnichannel Chat</option>
              <option value="webhook" style={{ background: '#0e121a' }}>Webhook Ingress</option>
              <option value="external_feed" style={{ background: '#0e121a' }}>Kafka / Event Bus</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Type custom autonomous mission goal or enterprise instruction..."
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLaunch(prompt)}
            style={{
              flex: 1,
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '0.65rem 1rem',
              color: '#fff',
              fontSize: '0.9rem',
              outline: 'none',
              fontFamily: 'var(--font-sans)'
            }}
          />

          <button
            className="btn-primary"
            onClick={() => handleLaunch(prompt)}
            disabled={isSubmitting || !prompt.trim()}
          >
            <Send size={15} />
            Dispatch Mission
          </button>
        </div>
      </div>

      {/* Active Workflow DAG & Execution Stream */}
      {activeWorkflow ? (
        <div className="glass-panel" style={{ border: activeWorkflow.status === 'WAITING_APPROVAL' ? '1px solid #ef4444' : '1px solid var(--border-subtle)' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                  {activeWorkflow.title}
                </h3>
                {getStatusBadge(activeWorkflow.status)}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', fontFamily: 'var(--font-mono)' }}>
                Workflow ID: {activeWorkflow.workflow_id} | Ingress: {activeWorkflow.trigger_channel} | Steps: {activeWorkflow.steps.length}
              </p>
            </div>

            {activeWorkflow.status === 'WAITING_APPROVAL' && (
              <button
                className="btn-primary"
                onClick={() => setHitlModalOpen(true)}
                style={{
                  background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
                  borderColor: '#fca5a5',
                  animation: 'pulseGlow 2s infinite'
                }}
              >
                <ShieldAlert size={16} />
                Review & Authorize Action
              </button>
            )}
          </div>

          {/* Step Timeline DAG */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
            {activeWorkflow.steps.map((step, idx) => {
              const agentObj = getAgentObj(step.assigned_agent);
              const isCurrent = activeWorkflow.current_step_index === idx;

              return (
                <div
                  key={step.id}
                  style={{
                    background: isCurrent ? 'rgba(234, 88, 12, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                    border: isCurrent ? '1px solid #ea580c' : '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '12px',
                    padding: '1.1rem',
                    transition: 'all 0.2s ease',
                    boxShadow: isCurrent ? '0 0 20px rgba(234, 88, 12, 0.2)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        background: step.status === 'COMPLETED' ? '#10b981' : isCurrent ? '#ea580c' : '#334155',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#fff'
                      }}>
                        {idx + 1}
                      </span>
                      <div>
                        <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc' }}>
                          {step.title}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
                          Assigned: {agentObj?.name || step.assigned_agent} ({agentObj?.tier || 'Fleet Tier'})
                        </div>
                      </div>
                    </div>
                    <div>
                      {getStatusBadge(step.status)}
                    </div>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                    {step.description}
                  </p>

                  {/* Thought Stream */}
                  {step.thought && (
                    <div style={{
                      background: 'rgba(245, 158, 11, 0.08)',
                      borderLeft: '3px solid #f59e0b',
                      borderRadius: '4px',
                      padding: '0.6rem 0.85rem',
                      marginBottom: '0.6rem',
                      fontSize: '0.82rem',
                      color: '#fef3c7',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      <span style={{ color: '#f59e0b', fontWeight: 600 }}>🧠 Agent Thought: </span>
                      {step.thought}
                    </div>
                  )}

                  {/* Tool Executions */}
                  {step.tool_calls && step.tool_calls.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.5rem' }}>
                      {step.tool_calls.map((tc, tIdx) => (
                        <div
                          key={tIdx}
                          style={{
                            background: '#090d14',
                            border: '1px solid #1e293b',
                            borderRadius: '8px',
                            padding: '0.6rem 0.8rem',
                            fontSize: '0.78rem'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                            <span style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                              ⚡ Tool: {tc.tool}
                            </span>
                            <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>
                              Latency: {tc.result?.latency_ms || 12}ms
                            </span>
                          </div>
                          <pre style={{
                            margin: 0,
                            padding: '0.4rem',
                            background: 'rgba(0,0,0,0.5)',
                            borderRadius: '4px',
                            color: '#e2e8f0',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.72rem',
                            overflowX: 'auto'
                          }}>
                            {JSON.stringify(tc.result?.output || tc.result, null, 2)}
                          </pre>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Waiting approval prompt */}
                  {step.status === 'WAITING_APPROVAL' && (
                    <div style={{
                      background: 'rgba(239, 68, 68, 0.12)',
                      border: '1px dashed #ef4444',
                      borderRadius: '8px',
                      padding: '0.85rem',
                      marginTop: '0.65rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f87171', fontWeight: 700, fontSize: '0.85rem' }}>
                        <AlertTriangle size={16} />
                        Human-in-the-Loop Gate Triggered
                      </div>
                      <p style={{ fontSize: '0.82rem', color: '#fecaca', marginTop: '0.3rem' }}>
                        {step.hitl_prompt || 'Policy check requires human review before continuing execution.'}
                      </p>
                      <button
                        className="btn-primary"
                        onClick={() => setHitlModalOpen(true)}
                        style={{ marginTop: '0.6rem', fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
                      >
                        Open Approval Panel
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Final Outcome Banner */}
          {activeWorkflow.final_output && (
            <div style={{
              marginTop: '1.25rem',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.1))',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '12px',
              padding: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', fontWeight: 700, marginBottom: '0.35rem' }}>
                <CheckCircle2 size={18} />
                Autonomous Mission Synthesis & Resolution
              </div>
              <p style={{ fontSize: '0.9rem', color: '#f0fdf4', lineHeight: 1.5 }}>
                {activeWorkflow.final_output}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto'
          }}>
            <Cpu size={26} color="#f59e0b" />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>
            No Active Mission Running
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 1.5rem auto' }}>
            Select one of the pre-configured enterprise mission presets above or type a custom prompt to launch autonomous execution across the Asura multi-agent platform.
          </p>
          <button
            className="btn-primary"
            onClick={() => handleLaunch(presetMissions[0].prompt, presetMissions[0].channel)}
          >
            <Play size={16} />
            Launch P0 Outage Simulation
          </button>
        </div>
      )}

      {/* Human in the Loop Modal */}
      {hitlModalOpen && activeWorkflow && (
        <div className="modal-overlay" onClick={() => setHitlModalOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ border: '1px solid #ef4444' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.2)', padding: '0.5rem', borderRadius: '10px', border: '1px solid #ef4444' }}>
                <ShieldAlert size={24} color="#ef4444" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                  Supervisor Authorization Required
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#f87171' }}>
                  Autonomous Workflow Controller · Human-in-the-Loop Interceptor
                </p>
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '10px',
              padding: '1rem',
              marginBottom: '1rem',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                Reason for Pause:
              </div>
              <div style={{ fontSize: '0.92rem', color: '#fef2f2', fontWeight: 600 }}>
                {activeWorkflow.steps[activeWorkflow.current_step_index]?.hitl_prompt || 'High-impact policy action requires human signoff.'}
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem' }}>
                Supervisor Review Notes (Optional):
              </label>
              <textarea
                rows={3}
                placeholder="Add audit justification, conditions, or approval notes..."
                value={hitlNotes}
                onChange={e => setHitlNotes(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none',
                  fontFamily: 'var(--font-sans)',
                  resize: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                className="btn-danger"
                onClick={() => handleHitlDecision('REJECTED')}
              >
                <XCircle size={16} />
                Reject & Abort
              </button>
              <button
                className="btn-primary"
                onClick={() => handleHitlDecision('APPROVED')}
                style={{ background: 'linear-gradient(135deg, #10b981, #047857)', borderColor: '#34d399' }}
              >
                <CheckCircle2 size={16} />
                Authorize & Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
