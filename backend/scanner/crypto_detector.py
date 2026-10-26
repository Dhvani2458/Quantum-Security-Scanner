"""
Cryptographic Detector Engine.
Parses source code line-by-line and via AST to locate cryptographic algorithm usages,
determine quantum threat vectors, and classify risk levels.
"""

import re
import ast
from typing import List, Dict, Any
from scanner.patterns import CRYPTO_PATTERNS

class CryptoDetector:
    def __init__(self):
        self.patterns = CRYPTO_PATTERNS

    def scan_code(self, code_text: str, filename: str = "snippet.py") -> Dict[str, Any]:
        """
        Scans a code string for cryptographic primitives and classifies them.
        """
        lines = code_text.splitlines()
        findings = []

        # Track matching lines to avoid duplicate spam on same line for same pattern
        seen_matches = set()

        for line_num, line in enumerate(lines, 1):
            stripped = line.strip()
            # Ignore plain comments if they are not cryptographic declarations
            if stripped.startswith("#") and not any(k in stripped.lower() for k in ["rsa", "ecc", "aes", "sha", "kyber", "dilithium"]):
                continue

            for p_def in self.patterns:
                for pattern in p_def["patterns"]:
                    match = re.search(pattern, line, re.IGNORECASE)
                    if match:
                        match_key = (line_num, p_def["id"])
                        if match_key in seen_matches:
                            continue
                        seen_matches.add(match_key)

                        # Extract surrounding snippet context
                        snippet = stripped[:120]

                        # Attempt key size extraction from snippet (e.g. 2048, 1024, 4096, 128, 256)
                        detected_key_size = self._extract_key_size(snippet, p_def["default_key_size"])

                        findings.append({
                            "id": f"{p_def['id']}_{line_num}",
                            "file": filename,
                            "line_number": line_num,
                            "code_snippet": snippet,
                            "algorithm_name": p_def["name"],
                            "category": p_def["category"],
                            "detected_key_size": detected_key_size,
                            "quantum_threat": p_def["quantum_threat"],
                            "risk_level": p_def["risk_level"],
                            "impact": p_def["impact"],
                            "time_to_vulnerability": p_def["time_to_vulnerability"],
                            "pqc_replacement": p_def["pqc_replacement"],
                            "pqc_status": p_def["pqc_status"],
                            "matched_pattern": pattern
                        })

        # Extra Python AST Analysis if applicable
        ast_findings = self._scan_python_ast(code_text, filename)
        for af in ast_findings:
            if not any(f["line_number"] == af["line_number"] and f["algorithm_name"] == af["algorithm_name"] for f in findings):
                findings.append(af)

        return {
            "filename": filename,
            "total_lines": len(lines),
            "findings_count": len(findings),
            "findings": findings
        }

    def _extract_key_size(self, line: str, default_size: int) -> int:
        """Helper to find explicit bit size mentions like 2048, 4096, 1024, 128, 256 in code."""
        sizes = [4096, 3072, 2048, 1024, 512, 256, 192, 128, 64]
        for s in sizes:
            if str(s) in line:
                return s
        return default_size

    def _scan_python_ast(self, code_text: str, filename: str) -> List[Dict[str, Any]]:
        """Parses Python AST to extract explicit import dependencies."""
        ast_findings = []
        try:
            tree = ast.parse(code_text)
            for node in ast.walk(tree):
                if isinstance(node, ast.Import):
                    for alias in node.names:
                        af = self._check_import_name(alias.name, node.lineno, filename)
                        if af:
                            ast_findings.append(af)
                elif isinstance(node, ast.ImportFrom):
                    module = node.module or ""
                    af = self._check_import_name(module, node.lineno, filename)
                    if af:
                        ast_findings.append(af)
        except Exception:
            # If not valid python or syntax error, regex scanner handles it
            pass
        return ast_findings

    def _check_import_name(self, import_name: str, line_num: int, filename: str) -> Dict[str, Any]:
        lowered = import_name.lower()
        if "rsa" in lowered:
            return {
                "id": f"ast_rsa_{line_num}",
                "file": filename,
                "line_number": line_num,
                "code_snippet": f"import {import_name}",
                "algorithm_name": "RSA Cryptography Module",
                "category": "Asymmetric",
                "detected_key_size": 2048,
                "quantum_threat": "Shor's Algorithm",
                "risk_level": "CRITICAL",
                "impact": "Importing RSA library vulnerable to Shor's integer factorization.",
                "time_to_vulnerability": "Immediate action required",
                "pqc_replacement": "ML-KEM-768 (Kyber)",
                "pqc_status": "VULNERABLE",
                "matched_pattern": import_name
            }
        return None
