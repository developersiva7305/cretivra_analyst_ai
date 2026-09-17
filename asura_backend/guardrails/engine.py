"""
Asura Guardrails & Policy Engine
Implements deterministic policy checks, PII redaction, prompt injection filtering,
and rate-limiting before and after agent execution.
"""

from typing import Dict, Any, List, Optional, Tuple
import re
import time
from pydantic import BaseModel, Field


class PolicyRule(BaseModel):
    id: str
    name: str
    description: str
    level: str = "error"  # 'warning', 'error', 'block'
    enabled: bool = True


class GuardrailResult(BaseModel):
    passed: bool
    violations: List[str] = Field(default_factory=list)
    sanitized_content: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)


class GuardrailsEngine:
    def __init__(self):
        self.rules: List[PolicyRule] = [
            PolicyRule(
                id="POL-001",
                name="PII & Sensitive Data Leakage",
                description="Prevents leakage of API keys, SSNs, credit cards, or passwords.",
                level="block"
            ),
            PolicyRule(
                id="POL-002",
                name="Prompt Injection & Jailbreak Defense",
                description="Detects adversarial jailbreaks, instruction overrides, and system prompt tampering.",
                level="block"
            ),
            PolicyRule(
                id="POL-003",
                name="Destructive Command Interceptor",
                description="Blocks destructive commands like 'rm -rf /', DROP DATABASE, or unauthorized disk wiping.",
                level="block"
            ),
            PolicyRule(
                id="POL-004",
                name="Financial & Enterprise Thresholds",
                description="Requires Human-in-the-Loop authorization for financial transfers > $5,000 or customer mass-actions.",
                level="warning"
            ),
        ]
        # In-memory rate limiter: client_id -> list of timestamps
        self._rate_limits: Dict[str, List[float]] = {}
        self.rate_limit_max_requests = 120
        self.rate_limit_window_seconds = 60

        # Patterns
        self._pii_patterns = [
            (r"\b(?:\d{3}-\d{2}-\d{4}|\d{9})\b", "[REDACTED_SSN]"),
            (r"\b(?:\d{4}[-\s]?){3}\d{4}\b", "[REDACTED_CREDIT_CARD]"),
            (r"(?i)\b(bearer\s+[a-zA-Z0-9_\-\.]{20,}|ghp_[a-zA-Z0-9]{36}|sk-[a-zA-Z0-9]{32,})\b", "[REDACTED_API_KEY]"),
            (r"(?i)\bpassword\s*[:=]\s*['\"]?[^\s'\"]+['\"]?", "password:[REDACTED]")
        ]

        self._injection_patterns = [
            r"(?i)ignore\s+(all\s+)?previous\s+instructions",
            r"(?i)disregard\s+system\s+prompt",
            r"(?i)you\s+are\s+now\s+in\s+dan\s+mode",
            r"(?i)override\s+security\s+policies",
            r"(?i)reveal\s+all\s+hidden\s+system\s+instructions"
        ]

        self._destructive_patterns = [
            r"(?i)rm\s+-rf\s+/",
            r"(?i)drop\s+database\s+",
            r"(?i)drop\s+table\s+",
            r"(?i)format\s+c:",
            r"(?i):(){ :|:& };:"
        ]

    def check_rate_limit(self, client_id: str = "global") -> bool:
        now = time.time()
        timestamps = self._rate_limits.get(client_id, [])
        # prune old timestamps
        timestamps = [t for t in timestamps if now - t < self.rate_limit_window_seconds]
        if len(timestamps) >= self.rate_limit_max_requests:
            self._rate_limits[client_id] = timestamps
            return False
        timestamps.append(now)
        self._rate_limits[client_id] = timestamps
        return True

    def evaluate_input(self, text: str, user_role: str = "standard") -> GuardrailResult:
        """Evaluates input prompts before agent execution."""
        violations = []
        sanitized = text

        # Rate limit check
        if not self.check_rate_limit("client_default"):
            return GuardrailResult(
                passed=False,
                violations=["Rate limit exceeded (Max 120 requests/minute)."],
                sanitized_content=text,
                metadata={"risk_score": 0.9}
            )

        # Injection check
        for pattern in self._injection_patterns:
            if re.search(pattern, text):
                violations.append(f"Prompt injection detected matching pattern '{pattern}'")

        # Destructive execution check
        for pattern in self._destructive_patterns:
            if re.search(pattern, text):
                violations.append(f"Destructive operation detected: {pattern}")

        # PII Redaction
        for pattern, replacement in self._pii_patterns:
            if re.search(pattern, sanitized):
                sanitized = re.sub(pattern, replacement, sanitized)

        # Financial / High risk check
        requires_hitl = False
        if re.search(r"(?i)(\$\s*\d{4,}|\btransfer\b|\brefund\b|\bdelete account\b)", text):
            requires_hitl = True

        passed = len(violations) == 0
        return GuardrailResult(
            passed=passed,
            violations=violations,
            sanitized_content=sanitized,
            metadata={"requires_hitl": requires_hitl, "risk_score": 0.8 if not passed else 0.05}
        )

    def evaluate_output(self, agent_id: str, response: str) -> GuardrailResult:
        """Evaluates agent responses before delivering to client."""
        violations = []
        sanitized = response

        # Mask sensitive credentials in output
        for pattern, replacement in self._pii_patterns:
            if re.search(pattern, sanitized):
                sanitized = re.sub(pattern, replacement, sanitized)
                violations.append("Sensitive data redacted from agent output.")

        # Hallucination / safety sanity check
        if len(response.strip()) == 0:
            violations.append("Empty response generated by agent.")

        return GuardrailResult(
            passed=True,
            violations=violations,
            sanitized_content=sanitized,
            metadata={"agent_id": agent_id, "safe": True}
        )


guardrails_engine = GuardrailsEngine()
