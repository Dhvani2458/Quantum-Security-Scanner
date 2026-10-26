"""
Quantum Risk Calculation & Scoring Engine.
Evaluates scan findings, weights algorithm vulnerabilities against Shor's and Grover's threats,
and generates standardized Quantum Risk Scores and PQC Readiness Indices.
"""

from typing import List, Dict, Any

class QuantumRiskEngine:
    def __init__(self):
        self.risk_weights = {
            "CRITICAL": 35,
            "HIGH": 20,
            "MEDIUM": 10,
            "LOW": 3,
            "SAFE": 0
        }

    def evaluate_risk(self, findings: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Calculates Quantum Vulnerability Index, PQC Readiness, and threat breakdowns.
        """
        if not findings:
            return {
                "quantum_risk_score": 0,
                "risk_category": "SAFE",
                "pqc_readiness_score": 100,
                "shor_threat_count": 0,
                "grover_threat_count": 0,
                "vulnerable_primitives_count": 0,
                "safe_primitives_count": 0,
                "critical_count": 0,
                "high_count": 0,
                "medium_count": 0,
                "low_count": 0,
                "risk_label": "Quantum Safe",
                "summary": "No quantum vulnerabilities detected. Architecture adheres to PQC guidelines."
            }

        total_weight = 0
        shor_count = 0
        grover_count = 0
        vulnerable_count = 0
        safe_count = 0
        crit_count = 0
        high_count = 0
        med_count = 0
        low_count = 0

        for f in findings:
            risk = f.get("risk_level", "LOW")
            threat = f.get("quantum_threat", "")
            pqc_status = f.get("pqc_status", "VULNERABLE")

            total_weight += self.risk_weights.get(risk, 5)

            if "Shor" in threat:
                shor_count += 1
            elif "Grover" in threat:
                grover_count += 1

            if risk == "CRITICAL":
                crit_count += 1
            elif risk == "HIGH":
                high_count += 1
            elif risk == "MEDIUM":
                med_count += 1
            elif risk == "LOW":
                low_count += 1

            if pqc_status == "QUANTUM_SAFE" or risk == "SAFE":
                safe_count += 1
            else:
                vulnerable_count += 1

        # Normalize Risk Score to 0 - 100
        raw_score = min(100, total_weight)
        
        # PQC Readiness Score calculation (0 - 100%)
        total_items = len(findings)
        pqc_readiness = int((safe_count / total_items) * 100) if total_items > 0 else 100

        # Categorize overall Risk
        if raw_score >= 75 or crit_count > 0:
            overall_category = "CRITICAL"
            risk_label = "Critical Quantum Vulnerability"
        elif raw_score >= 50 or high_count > 0:
            overall_category = "HIGH"
            risk_label = "High Quantum Vulnerability"
        elif raw_score >= 25 or med_count > 0:
            overall_category = "MEDIUM"
            risk_label = "Moderate Quantum Vulnerability"
        elif raw_score > 0:
            overall_category = "LOW"
            risk_label = "Low Quantum Risk"
        else:
            overall_category = "SAFE"
            risk_label = "Quantum Safe"

        # Generate contextual summary
        summary = self._generate_summary(shor_count, grover_count, crit_count, overall_category)

        return {
            "quantum_risk_score": raw_score,
            "risk_category": overall_category,
            "risk_label": risk_label,
            "pqc_readiness_score": pqc_readiness,
            "shor_threat_count": shor_count,
            "grover_threat_count": grover_count,
            "vulnerable_primitives_count": vulnerable_count,
            "safe_primitives_count": safe_count,
            "critical_count": crit_count,
            "high_count": high_count,
            "medium_count": med_count,
            "low_count": low_count,
            "summary": summary
        }

    def _generate_summary(self, shor_count: int, grover_count: int, crit_count: int, category: str) -> str:
        if category == "CRITICAL":
            return f"Detected {shor_count} asymmetric algorithm(s) completely broken by Shor's algorithm (RSA/ECC) and {grover_count} symmetric primitive(s) affected by Grover's algorithm. Immediate migration to NIST PQC standards (FIPS 203/204) is required."
        elif category == "HIGH":
            return f"Found {shor_count} quantum-vulnerable asymmetric primitive(s) and {grover_count} degraded symmetric key(s). High exposure to Harvest-Now-Decrypt-Later threats."
        elif category == "MEDIUM":
            return "Contains cryptographic primitives with degraded quantum security. Plan migration to 256-bit symmetric keys and PQC signature schemes."
        elif category == "LOW":
            return "Minor cryptographic warnings. Low risk of immediate quantum exploit."
        else:
            return "All inspected cryptographic primitives are Post-Quantum safe or modern 256-bit implementations."
