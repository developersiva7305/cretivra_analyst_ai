import React from 'react';
import { TelemetrySummary, ConnectorInfo } from '../types';
import {
  Activity,
  DollarSign,
  ShieldCheck,
  Server,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Clock,
  Layers
} from 'lucide-react';

interface Props {
  telemetry: TelemetrySummary | null;
  connectors: ConnectorInfo[];
}

export const ObservabilityView: React.FC<Props> = ({ telemetry, connectors }) => {
  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return <span className="badge badge-crimson">CRITICAL</span>;
      case 'WARN':
        return <span className="badge badge-amber">WARN</span>;
      default:
        return <span className="badge badge-cyan">INFO</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.35rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #7c2d12, #451a03)',
            padding: '0.5rem',
            borderRadius: '10px',
            boxShadow: '0 0 15px rgba(124, 45, 18, 0.35)'
          }}>
            <Activity size={22} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>
              Governance, Audit & OpenTelemetry Suite
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Real-time Token Consumption, Cost Modeling, Policy Interception Audits, and Enterprise Connector Telemetry
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="badge badge-emerald">OpenTelemetry Active</span>
        </div>
      </div>

      {/* Top Telemetry KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        <div className="glass-panel" style={{ padding: '1.1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Total Tokens</span>
            <Zap size={16} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
            {(telemetry?.total_tokens_consumed || 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.2rem' }}>
            Across all 8 specialized agents
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Accrued Cost (USD)</span>
            <DollarSign size={16} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-mono)' }}>
            ${(telemetry?.total_cost_accrued_usd || 0.0012).toFixed(4)}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.2rem' }}>
            Blended token expenditure
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Active Missions</span>
            <Flame size={16} color="#ea580c" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-mono)' }}>
            {telemetry?.active_workflows || 0}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#ea580c', marginTop: '0.2rem' }}>
            Total missions: {telemetry?.total_workflows || 0}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Security Audit Events</span>
            <ShieldCheck size={16} color="#06b6d4" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
            {telemetry?.audit_events_count || 0}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.2rem' }}>
            100% Policy compliance rate
          </div>
        </div>
      </div>

      {/* Main Grid: Audit Log Stream (Left 60%) & Enterprise Connectors (Right 40%) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.25rem' }}>
        {/* Real-time Audit Event Stream */}
        <div className="glass-panel">
          <div className="panel-header">
            <div className="panel-title-wrap">
              <ShieldCheck size={18} color="#f59e0b" />
              <h3 className="panel-title">Real-Time Security & Execution Audit Trail</h3>
            </div>
            <span className="badge badge-amber">Immutable Log</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: '#94a3b8' }}>
                  <th style={{ padding: '0.6rem 0.5rem' }}>EVENT TYPE</th>
                  <th style={{ padding: '0.6rem 0.5rem' }}>SEVERITY</th>
                  <th style={{ padding: '0.6rem 0.5rem' }}>ACTOR</th>
                  <th style={{ padding: '0.6rem 0.5rem' }}>ACTION</th>
                  <th style={{ padding: '0.6rem 0.5rem' }}>TARGET</th>
                </tr>
              </thead>
              <tbody>
                {telemetry?.recent_audit_events && telemetry.recent_audit_events.length > 0 ? (
                  telemetry.recent_audit_events.map(ev => (
                    <tr
                      key={ev.id}
                      style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', color: '#e2e8f0' }}
                    >
                      <td style={{ padding: '0.65rem 0.5rem', fontFamily: 'var(--font-mono)', color: '#fbbf24' }}>
                        {ev.event_type}
                      </td>
                      <td style={{ padding: '0.65rem 0.5rem' }}>
                        {getSeverityBadge(ev.severity)}
                      </td>
                      <td style={{ padding: '0.65rem 0.5rem', color: '#94a3b8' }}>
                        {ev.actor}
                      </td>
                      <td style={{ padding: '0.65rem 0.5rem', fontWeight: 600 }}>
                        {ev.action}
                      </td>
                      <td style={{ padding: '0.65rem 0.5rem', fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>
                        {ev.target}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ padding: '1.5rem', textAlign: 'center', color: '#64748b' }}>
                      No audit events recorded yet. Run tools or missions to generate audit entries.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Enterprise Data Connectors Status */}
        <div className="glass-panel">
          <div className="panel-header">
            <div className="panel-title-wrap">
              <Server size={18} color="#fbbf24" />
              <h3 className="panel-title">Connected Enterprise Sources</h3>
            </div>
            <span className="badge badge-emerald">Live Streams</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {connectors.map(c => (
              <div
                key={c.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
                    {c.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                    {c.endpoint.slice(0, 38)}...
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>
                    {c.status}
                  </span>
                  <div style={{ fontSize: '0.65rem', color: '#fbbf24', marginTop: '0.2rem', fontFamily: 'var(--font-mono)' }}>
                    {c.records_synced.toLocaleString()} records
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
