import React, { useState } from 'react';
import { ToolInfo, ToolExecutionResult } from '../types';
import { api } from '../api';
import {
  Wrench,
  Play,
  CheckCircle2,
  AlertCircle,
  Clock,
  Terminal,
  ShieldCheck,
  Zap,
  RotateCw
} from 'lucide-react';

interface Props {
  tools: ToolInfo[];
}

export const ToolSandboxView: React.FC<Props> = ({ tools }) => {
  const [selectedTool, setSelectedTool] = useState<ToolInfo | null>(tools[0] || null);
  const [paramValues, setParamValues] = useState<Record<string, any>>({
    code: 'values = [14, 28, 42, 56]\nresult = {"sum": sum(values), "avg": sum(values)/len(values)}',
    query: 'SELECT customer_id, name, arr, churn_risk FROM customers LIMIT 5',
    account_name: 'Acme Corp',
    pod_id: 'auth-gateway-pod-7f99b',
    action: 'isolate',
    url: 'https://api.internal.corp/events',
    payload: { event: 'TRIGGER_AUDIT', priority: 'HIGH' }
  });
  const [executing, setExecuting] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<ToolExecutionResult | null>(null);

  const activeTool = selectedTool || tools[0];

  const handleExecute = async () => {
    if (!activeTool) return;
    setExecuting(true);
    setLastResult(null);
    try {
      // Build parameters matching schema
      const payload: Record<string, any> = {};
      for (const p of activeTool.parameters) {
        if (paramValues[p.name] !== undefined) {
          payload[p.name] = paramValues[p.name];
        } else if (p.default !== undefined) {
          payload[p.name] = p.default;
        }
      }
      const res = await api.executeTool(activeTool.name, payload);
      setLastResult(res);
    } catch (e: any) {
      setLastResult({
        tool_name: activeTool.name,
        success: false,
        output: null,
        latency_ms: 0,
        error: e.message
      });
    } finally {
      setExecuting(false);
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'high':
        return <span className="badge badge-crimson">High Risk</span>;
      case 'medium':
        return <span className="badge badge-amber">Medium Risk</span>;
      default:
        return <span className="badge badge-emerald">Safe / Low Risk</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.35rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #ea580c, #b45309)',
            padding: '0.5rem',
            borderRadius: '10px',
            boxShadow: '0 0 15px rgba(234, 88, 12, 0.35)'
          }}>
            <Wrench size={22} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>
              Tool Execution Sandbox & Model Context Protocol (MCP) Hub
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Sandboxed Execution, Dynamic Parameter Validation, Rate Limiting, and Idempotency Caching
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="badge badge-cyan">MCP Spec V1.0 Compliant</span>
        </div>
      </div>

      {/* Main Grid: Tool List (Left 35%) & Interactive Execution Workbench (Right 65%) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: '1.25rem' }}>
        {/* Tool Selector List */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            Registered Capabilities ({tools.length})
          </div>

          {tools.map(tool => {
            const isSelected = activeTool?.name === tool.name;
            return (
              <div
                key={tool.name}
                onClick={() => setSelectedTool(tool)}
                style={{
                  background: isSelected ? 'rgba(234, 88, 12, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                  border: isSelected ? '1.5px solid #ea580c' : '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: isSelected ? '#fbbf24' : '#f8fafc' }}>
                    {tool.name}
                  </span>
                  {getRiskBadge(tool.risk_level)}
                </div>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                  {tool.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.45rem', fontSize: '0.7rem', color: '#94a3b8' }}>
                  <span>Category: {tool.category}</span>
                  <span>•</span>
                  <span>Limit: {tool.rate_limit_per_min}/min</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Testing Workbench */}
        {activeTool && (
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
                  {activeTool.name}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  {activeTool.description}
                </p>
              </div>
              <button
                className="btn-primary"
                onClick={handleExecute}
                disabled={executing}
              >
                {executing ? <RotateCw size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Play size={15} />}
                Run in Sandbox
              </button>
            </div>

            {/* Parameter Inputs */}
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', marginBottom: '0.55rem' }}>
                Tool Parameters & Payload
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {activeTool.parameters.map(param => (
                  <div key={param.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.78rem' }}>
                      <span style={{ color: '#e2e8f0', fontFamily: 'var(--font-mono)' }}>
                        {param.name} {param.required && <span style={{ color: '#ef4444' }}>*</span>}
                      </span>
                      <span style={{ color: '#94a3b8' }}>Type: {param.type}</span>
                    </div>

                    {param.name === 'code' ? (
                      <textarea
                        rows={4}
                        value={paramValues[param.name] || ''}
                        onChange={e => setParamValues({ ...paramValues, [param.name]: e.target.value })}
                        style={{
                          width: '100%',
                          background: '#090d14',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '8px',
                          padding: '0.75rem',
                          color: '#38bdf8',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.82rem',
                          outline: 'none',
                          resize: 'vertical'
                        }}
                      />
                    ) : param.name === 'query' ? (
                      <textarea
                        rows={2}
                        value={paramValues[param.name] || ''}
                        onChange={e => setParamValues({ ...paramValues, [param.name]: e.target.value })}
                        style={{
                          width: '100%',
                          background: '#090d14',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '8px',
                          padding: '0.65rem',
                          color: '#fbbf24',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.82rem',
                          outline: 'none'
                        }}
                      />
                    ) : (
                      <input
                        type="text"
                        value={paramValues[param.name] || ''}
                        onChange={e => setParamValues({ ...paramValues, [param.name]: e.target.value })}
                        style={{
                          width: '100%',
                          background: '#090d14',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '8px',
                          padding: '0.6rem 0.85rem',
                          color: '#fff',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.82rem',
                          outline: 'none'
                        }}
                      />
                    )}
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.2rem' }}>
                      {param.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Execution Result Terminal */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase' }}>
                  Execution Response & Telemetry
                </div>
                {lastResult && (
                  <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
                    <span style={{ color: lastResult.success ? '#34d399' : '#f87171' }}>
                      Status: {lastResult.success ? '200 OK' : 'FAILED'}
                    </span>
                    <span style={{ color: '#fbbf24' }}>
                      Latency: {lastResult.latency_ms}ms
                    </span>
                    {lastResult.cached && (
                      <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>Cached (TTL 120s)</span>
                    )}
                  </div>
                )}
              </div>

              <div style={{
                background: '#05070a',
                border: '1px solid #1e293b',
                borderRadius: '8px',
                padding: '1rem',
                minHeight: '160px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                overflowX: 'auto'
              }}>
                {executing ? (
                  <div style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={16} color="#f59e0b" style={{ animation: 'livePulse 1s infinite' }} />
                    Executing in sandboxed runtime...
                  </div>
                ) : lastResult ? (
                  lastResult.success ? (
                    <pre style={{ margin: 0, color: '#4ade80' }}>
                      {JSON.stringify(lastResult.output, null, 2)}
                    </pre>
                  ) : (
                    <div style={{ color: '#f87171' }}>
                      <AlertCircle size={16} /> Error: {lastResult.error}
                    </div>
                  )
                ) : (
                  <div style={{ color: '#475569' }}>
                    Click "Run in Sandbox" to trigger isolated tool execution and inspect formatted outputs.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
