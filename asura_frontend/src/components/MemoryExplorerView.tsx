import React, { useState, useEffect } from 'react';
import { KnowledgeGraphData, RagResultItem, EpisodicRecord } from '../types';
import { api } from '../api';
import {
  Database,
  Search,
  Share2,
  BookOpen,
  Sparkles,
  History,
  CheckCircle2,
  Layers,
  ArrowRight
} from 'lucide-react';

interface Props {
  graphData: KnowledgeGraphData | null;
  episodes: EpisodicRecord[];
}

export const MemoryExplorerView: React.FC<Props> = ({ graphData, episodes }) => {
  const [activeTab, setActiveTab] = useState<'graph' | 'rag' | 'episodes'>('graph');
  const [ragQuery, setRagQuery] = useState<string>('SLA P0 incident resolution time');
  const [ragResults, setRagResults] = useState<RagResultItem[]>([]);
  const [isSearchingRag, setIsSearchingRag] = useState<boolean>(false);

  useEffect(() => {
    handleSearchRag('SLA P0 incident resolution time');
  }, []);

  const handleSearchRag = async (q: string) => {
    if (!q.trim()) return;
    setIsSearchingRag(true);
    try {
      const results = await api.searchRag(q, 3);
      setRagResults(results);
    } catch (e: any) {
      console.error('RAG search error', e);
    } finally {
      setIsSearchingRag(false);
    }
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'Platform': return '#ea580c';
      case 'Agent': return '#f59e0b';
      case 'Tool': return '#38bdf8';
      case 'Database': return '#34d399';
      case 'Policy': return '#a855f7';
      default: return '#fbbf24';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.35rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #b45309, #78350f)',
            padding: '0.5rem',
            borderRadius: '10px',
            boxShadow: '0 0 15px rgba(180, 83, 9, 0.35)'
          }}>
            <Database size={22} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>
              Agent Memory & Knowledge System
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Hierarchical Knowledge Architecture: Short-Term Buffers, Vector RAG Embeddings, Semantic Knowledge Graph, and Episodic Reflections
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="nav-tabs">
          <button
            className={`nav-tab-btn ${activeTab === 'graph' ? 'active' : ''}`}
            onClick={() => setActiveTab('graph')}
          >
            <Share2 size={15} /> Knowledge Graph
          </button>
          <button
            className={`nav-tab-btn ${activeTab === 'rag' ? 'active' : ''}`}
            onClick={() => setActiveTab('rag')}
          >
            <Search size={15} /> Vector RAG
          </button>
          <button
            className={`nav-tab-btn ${activeTab === 'episodes' ? 'active' : ''}`}
            onClick={() => setActiveTab('episodes')}
          >
            <History size={15} /> Episodic Store ({episodes.length})
          </button>
        </div>
      </div>

      {/* 1. Knowledge Graph Tab */}
      {activeTab === 'graph' && (
        <div className="glass-panel">
          <div className="panel-header">
            <div className="panel-title-wrap">
              <Share2 size={18} color="#f59e0b" />
              <h3 className="panel-title">Semantic Knowledge Graph & Relation Map</h3>
            </div>
            <span className="badge badge-amber">{graphData?.nodes.length || 9} Entities · {graphData?.edges.length || 8} Relations</span>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Structural topology mapping relationships between the Asura Core platform, specialized agent fleets, database connectors, and enterprise SLA policies.
          </p>

          {/* SVG Visual Graph Representation */}
          <div style={{
            background: '#090d14',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '1.5rem',
            minHeight: '380px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative'
          }}>
            {/* Visual Node Cluster */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
              {/* Top Node: Core Platform */}
              <div style={{
                background: 'linear-gradient(135deg, #ea580c, #b45309)',
                border: '2px solid #fbbf24',
                borderRadius: '12px',
                padding: '0.75rem 1.5rem',
                color: '#fff',
                fontWeight: 800,
                fontSize: '0.95rem',
                boxShadow: '0 0 25px rgba(234, 88, 12, 0.4)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.7rem', color: '#fed7aa', textTransform: 'uppercase' }}>Central Platform</div>
                Asura Core Engine
              </div>

              {/* Edge connector label */}
              <div style={{ fontSize: '0.72rem', color: '#d97706', fontFamily: 'var(--font-mono)' }}>
                ↓ ORCHESTRATES & ROUTES
              </div>

              {/* Middle Layer: Specialized Agents */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
                {['Support Agent', 'Sales Analyst', 'IT / SecOps Agent', 'Commerce / CRM'].map((agent, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'rgba(245, 158, 11, 0.12)',
                      border: '1px solid #f59e0b',
                      borderRadius: '8px',
                      padding: '0.6rem 1rem',
                      color: '#fef3c7',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontSize: '0.65rem', color: '#fbbf24', textTransform: 'uppercase' }}>Domain Agent</div>
                    {agent}
                  </div>
                ))}
              </div>

              {/* Edge connector label */}
              <div style={{ fontSize: '0.72rem', color: '#06b6d4', fontFamily: 'var(--font-mono)' }}>
                ↓ ENFORCES POLICIES · QUERIES DATA · INVOKES TOOLS
              </div>

              {/* Bottom Layer: Tools, DBs, Policies */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid #10b981', borderRadius: '8px', padding: '0.6rem 1rem', color: '#a7f3d0', fontSize: '0.8rem' }}>
                  <div style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>Database</div>
                  Enterprise PostgreSQL
                </div>
                <div style={{ background: 'rgba(6, 182, 212, 0.12)', border: '1px solid #06b6d4', borderRadius: '8px', padding: '0.6rem 1rem', color: '#bae6fd', fontSize: '0.8rem' }}>
                  <div style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>Runtime</div>
                  Sandboxed Code Executor
                </div>
                <div style={{ background: 'rgba(168, 85, 247, 0.12)', border: '1px solid #a855f7', borderRadius: '8px', padding: '0.6rem 1rem', color: '#e9d5ff', fontSize: '0.8rem' }}>
                  <div style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>Policy</div>
                  Enterprise SLA Contract
                </div>
                <div style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid #f59e0b', borderRadius: '8px', padding: '0.6rem 1rem', color: '#fef3c7', fontSize: '0.8rem' }}>
                  <div style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>Vector Store</div>
                  Semantic Embeddings RAG
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Vector RAG Tab */}
      {activeTab === 'rag' && (
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem' }}>
              Retrieval-Augmented Generation (RAG) Vector Search
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Test vector semantic queries against enterprise policy manuals, incident runbooks, and SLA benchmarks:
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <input
              type="text"
              placeholder="Search enterprise knowledge base using vector similarity..."
              value={ragQuery}
              onChange={e => setRagQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearchRag(ragQuery)}
              style={{
                flex: 1,
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '0.65rem 1rem',
                color: '#fff',
                fontSize: '0.88rem',
                outline: 'none'
              }}
            />
            <button
              className="btn-primary"
              onClick={() => handleSearchRag(ragQuery)}
              disabled={isSearchingRag}
            >
              <Search size={15} /> Search Embeddings
            </button>
          </div>

          {/* Results List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {ragResults.map(item => (
              <div
                key={item.document.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '1.1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fbbf24' }}>
                    {item.document.title}
                  </div>
                  <span className="badge badge-cyan">
                    Cosine Match: {(item.score * 100).toFixed(1)}%
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#e2e8f0', lineHeight: 1.5, marginBottom: '0.65rem' }}>
                  {item.document.content}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                  <span>ID: {item.document.id}</span>
                  <span>•</span>
                  <span>Category: {item.document.metadata?.category}</span>
                  <span>•</span>
                  <span>Tier: {item.document.metadata?.tier}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Episodic Memory Store Tab */}
      {activeTab === 'episodes' && (
        <div className="glass-panel">
          <div className="panel-header">
            <div className="panel-title-wrap">
              <History size={18} color="#f59e0b" />
              <h3 className="panel-title">Episodic Memory & Autonomous Reflections</h3>
            </div>
            <span className="badge badge-emerald">Continuous Learning</span>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.15rem' }}>
            Historical mission outcomes recorded into episodic storage for reflection, few-shot prompt adaptation, and cross-mission learning.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {episodes.length > 0 ? (
              episodes.map(ep => (
                <div
                  key={ep.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '10px',
                    padding: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>
                      Mission: {ep.goal}
                    </span>
                    <span className="badge badge-emerald">
                      <CheckCircle2 size={12} /> Success
                    </span>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '0.5rem' }}>
                    {ep.summary}
                  </div>

                  <div style={{
                    background: 'rgba(245, 158, 11, 0.08)',
                    borderLeft: '3px solid #f59e0b',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '4px',
                    fontSize: '0.78rem',
                    color: '#fef3c7',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    <span style={{ color: '#fbbf24', fontWeight: 600 }}>💡 Agent Reflection: </span>
                    {ep.reflection}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                No completed missions recorded in episodic memory yet. Launch a mission in the Mission Control tab to generate episodic experiences.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
