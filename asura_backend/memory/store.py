"""
Asura Memory & Knowledge System
Implements Short-Term Working Memory, Episodic Experience Storage,
Vector-based RAG Retrieval, and Semantic Knowledge Graph.
"""

from typing import Dict, Any, List, Optional, Tuple
import math
import time
import uuid
from pydantic import BaseModel, Field


class MemoryItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4())[:8])
    session_id: str
    role: str  # 'user', 'agent', 'system', 'tool'
    content: str
    timestamp: float = Field(default_factory=time.time)
    metadata: Dict[str, Any] = Field(default_factory=dict)


class EpisodicRecord(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4())[:8])
    task_id: str
    agent_id: str
    goal: str
    summary: str
    reflection: str
    success: bool
    timestamp: float = Field(default_factory=time.time)


class KnowledgeNode(BaseModel):
    id: str
    label: str
    type: str  # 'Entity', 'Agent', 'Tool', 'Policy', 'Database'
    properties: Dict[str, Any] = Field(default_factory=dict)


class KnowledgeEdge(BaseModel):
    source: str
    target: str
    relation: str
    weight: float = 1.0


class VectorDocument(BaseModel):
    id: str
    title: str
    content: str
    embedding: List[float]
    metadata: Dict[str, Any] = Field(default_factory=dict)


def _simple_text_embedding(text: str, dim: int = 32) -> List[float]:
    """
    Deterministic normalized character/n-gram hashing embedding
    to provide zero-dependency fast semantic vector simulation.
    """
    vec = [0.0] * dim
    words = text.lower().replace(".", "").replace(",", "").split()
    for w in words:
        for idx, char in enumerate(w):
            pos = (ord(char) * 31 + idx * 7) % dim
            vec[pos] += 1.0
    # Normalize vector
    norm = math.sqrt(sum(x * x for x in vec)) or 1.0
    return [round(x / norm, 4) for x in vec]


def _cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    dot = sum(a * b for a, b in zip(vec1, vec2))
    return max(0.0, min(1.0, dot))


class MemoryStore:
    def __init__(self):
        # 1. Short-term working memory: session_id -> list of MemoryItem
        self.working_memory: Dict[str, List[MemoryItem]] = {}

        # 2. Episodic memory
        self.episodic_memory: List[EpisodicRecord] = []

        # 3. Vector RAG store
        self.vector_store: List[VectorDocument] = []

        # 4. Knowledge Graph
        self.nodes: Dict[str, KnowledgeNode] = {}
        self.edges: List[KnowledgeEdge] = []

        self._seed_knowledge_base()

    def _seed_knowledge_base(self):
        """Seed pre-configured enterprise RAG docs and Knowledge Graph."""
        sample_docs = [
            (
                "doc-sla-01",
                "Enterprise SLA & Escalation Protocols",
                "Tier-1 P0 outages require executive notification within 15 minutes. Support agents must route database deadlock issues directly to IT SecOps. Maximum resolution SLA is 2 hours.",
                {"category": "policy", "tier": "enterprise"}
            ),
            (
                "doc-sales-02",
                "Account Churn Risk Signals",
                "Customers with < 4 active API calls per week and contract renewal within 60 days are flagged as high churn risk. Growth & Sales Analyst agents trigger retention workflows.",
                {"category": "sales", "tier": "growth"}
            ),
            (
                "doc-sec-03",
                "Infrastructure Security & Incident Response",
                "Kubernetes pods showing anomalous egress traffic > 500MB/s should be quarantined. Automated token revocation is permitted for suspicious IAM role changes.",
                {"category": "security", "tier": "it_ops"}
            ),
            (
                "doc-crm-04",
                "Customer Lifetime Value (LTV) Optimization",
                "Commerce agents are authorized to offer up to 15% discount for accounts with LTV exceeding $50k. Greater discounts require Human-in-the-Loop intervention.",
                {"category": "commerce", "tier": "finance"}
            ),
        ]

        for doc_id, title, content, meta in sample_docs:
            emb = _simple_text_embedding(f"{title} {content}")
            self.vector_store.append(
                VectorDocument(id=doc_id, title=title, content=content, embedding=emb, metadata=meta)
            )

        # Seed Knowledge Graph
        nodes = [
            KnowledgeNode(id="asura-core", label="Asura Core Engine", type="Platform"),
            KnowledgeNode(id="agent-support", label="Support Agent", type="Agent"),
            KnowledgeNode(id="agent-sales", label="Sales Analyst Agent", type="Agent"),
            KnowledgeNode(id="agent-itops", label="IT / SecOps Agent", type="Agent"),
            KnowledgeNode(id="agent-commerce", label="Commerce / CRM Agent", type="Agent"),
            KnowledgeNode(id="tool-sandbox", label="Tool Sandbox", type="Tool"),
            KnowledgeNode(id="db-postgres", label="Enterprise PostgreSQL", type="Database"),
            KnowledgeNode(id="db-vector", label="Vector Knowledge Store", type="Database"),
            KnowledgeNode(id="pol-sla", label="Enterprise SLA Policy", type="Policy"),
        ]
        for n in nodes:
            self.nodes[n.id] = n

        edges = [
            KnowledgeEdge(source="asura-core", target="agent-support", relation="ORCHESTRATES"),
            KnowledgeEdge(source="asura-core", target="agent-sales", relation="ORCHESTRATES"),
            KnowledgeEdge(source="asura-core", target="agent-itops", relation="ORCHESTRATES"),
            KnowledgeEdge(source="asura-core", target="agent-commerce", relation="ORCHESTRATES"),
            KnowledgeEdge(source="agent-support", target="pol-sla", relation="ENFORCES"),
            KnowledgeEdge(source="agent-itops", target="tool-sandbox", relation="INVOKES"),
            KnowledgeEdge(source="agent-commerce", target="db-postgres", relation="QUERIES"),
            KnowledgeEdge(source="asura-core", target="db-vector", relation="RETRIEVES_FROM"),
        ]
        self.edges.extend(edges)

    # --- Short-term Working Memory ---
    def add_message(self, session_id: str, role: str, content: str, metadata: Optional[Dict[str, Any]] = None) -> MemoryItem:
        if session_id not in self.working_memory:
            self.working_memory[session_id] = []
        item = MemoryItem(session_id=session_id, role=role, content=content, metadata=metadata or {})
        self.working_memory[session_id].append(item)
        return item

    def get_session_history(self, session_id: str, limit: int = 50) -> List[MemoryItem]:
        items = self.working_memory.get(session_id, [])
        return items[-limit:]

    def clear_session(self, session_id: str):
        if session_id in self.working_memory:
            del self.working_memory[session_id]

    # --- Episodic Memory & Reflection ---
    def record_episode(self, task_id: str, agent_id: str, goal: str, summary: str, reflection: str, success: bool = True) -> EpisodicRecord:
        record = EpisodicRecord(
            task_id=task_id,
            agent_id=agent_id,
            goal=goal,
            summary=summary,
            reflection=reflection,
            success=success
        )
        self.episodic_memory.append(record)
        return record

    def search_episodes(self, query: str, limit: int = 5) -> List[EpisodicRecord]:
        q = query.lower()
        matches = [e for e in self.episodic_memory if q in e.goal.lower() or q in e.summary.lower() or q in e.reflection.lower()]
        return matches[:limit]

    # --- RAG Vector Search ---
    def search_rag(self, query: str, top_k: int = 3) -> List[Tuple[VectorDocument, float]]:
        q_emb = _simple_text_embedding(query)
        scored = []
        for doc in self.vector_store:
            sim = _cosine_similarity(q_emb, doc.embedding)
            scored.append((doc, round(sim, 3)))
        scored.sort(key=lambda x: x[1], reverse=True)
        return scored[:top_k]

    def add_rag_document(self, title: str, content: str, metadata: Optional[Dict[str, Any]] = None) -> VectorDocument:
        doc_id = f"doc-{uuid.uuid4().hex[:6]}"
        emb = _simple_text_embedding(f"{title} {content}")
        doc = VectorDocument(id=doc_id, title=title, content=content, embedding=emb, metadata=metadata or {})
        self.vector_store.append(doc)
        return doc

    # --- Knowledge Graph ---
    def get_graph(self) -> Dict[str, Any]:
        return {
            "nodes": [n.model_dump() for n in self.nodes.values()],
            "edges": [e.model_dump() for e in self.edges]
        }


memory_store = MemoryStore()
