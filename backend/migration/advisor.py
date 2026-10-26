"""
PQC Migration Advisor Engine.
Maps quantum-vulnerable cryptographic algorithms to NIST Post-Quantum Cryptography standards
and generates actionable remediation code snippets and strategy roadmaps.
"""

from typing import List, Dict, Any
from quantum.quantum_knowledge import NIST_PQC_STANDARDS

class MigrationAdvisor:
    def __init__(self):
        self.standards = NIST_PQC_STANDARDS

    def generate_recommendations(self, findings: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Generates tailored PQC migration strategies for detected vulnerabilities.
        """
        recommendations = []
        seen_algo = set()

        for f in findings:
            algo = f.get("algorithm_name", "")
            cat = f.get("category", "")
            risk = f.get("risk_level", "LOW")

            if risk in ["SAFE"] or algo in seen_algo:
                continue
            seen_algo.add(algo)

            rec = self._build_recommendation(algo, cat, f)
            if rec:
                recommendations.append(rec)

        if not recommendations:
            recommendations.append({
                "title": "Quantum Resistance Maintenance",
                "category": "General",
                "target_algorithm": "N/A",
                "pqc_standard": "FIPS 203 / FIPS 204 / FIPS 205 Compliant",
                "urgency": "Low",
                "action_steps": [
                    "Maintain 256-bit key length for all symmetric ciphers (AES-256-GCM).",
                    "Ensure SHA-384 or SHA-512 is used for all digital signature digest routines.",
                    "Audit external APIs and third-party dependencies annually for PQC compliance."
                ],
                "code_example_before": "# Code is already Quantum Safe",
                "code_example_after": "# Continuing maintenance of NIST PQC standards"
            })

        return recommendations

    def _build_recommendation(self, algo_name: str, category: str, finding: Dict[str, Any]) -> Dict[str, Any]:
        if category == "Asymmetric" and any(k in algo_name.lower() for k in ["rsa", "key generation", "importkey"]):
            return {
                "id": "rec_rsa_kem",
                "title": "Migrate RSA Encryption / KEM to ML-KEM-768 (CRYSTALS-Kyber)",
                "category": "Asymmetric KEM / Encryption",
                "target_algorithm": algo_name,
                "pqc_standard": "NIST FIPS 203 (ML-KEM-768 / Kyber)",
                "urgency": "Immediate (Harvest-Now-Decrypt-Later Threat)",
                "impact_summary": "RSA 2048/4096 is vulnerable to Shor's algorithm. Cryptographic key exchanges can be broken in polynomial time.",
                "action_steps": [
                    "Phase 1: Implement Hybrid KEM (combine X25519 with ML-KEM-768) for TLS and secret distribution.",
                    "Phase 2: Deprecate standalone RSA key pairs in database encryption and session tokens.",
                    "Phase 3: Upgrade to pure ML-KEM-768 once client support is verified."
                ],
                "code_example_before": """# Legacy Cryptography (Vulnerable RSA)
from Crypto.PublicKey import RSA
key = RSA.generate(2048)
private_key = key.export_key()""",
                "code_example_after": """# Post-Quantum Cryptography (NIST FIPS 203 - ML-KEM-768 / Kyber)
# Using oqs (Open Quantum Safe) or pqcrypto library
from pqcrypto.kem import kyber768

public_key, secret_key = kyber768.generate_keypair()
ciphertext, shared_secret = kyber768.encrypt(public_key)"""
            }

        elif category == "Asymmetric" and any(k in algo_name.lower() for k in ["ecdsa", "ecc", "secp256k1", "curve25519"]):
            return {
                "id": "rec_ecdsa_sig",
                "title": "Migrate ECDSA / ECC Signatures to ML-DSA-65 (CRYSTALS-Dilithium)",
                "category": "Digital Signatures",
                "target_algorithm": algo_name,
                "pqc_standard": "NIST FIPS 204 (ML-DSA-65 / Dilithium3) or FIPS 205 (SLH-DSA)",
                "urgency": "High",
                "impact_summary": "Elliptic Curve signatures can be forged by a Cryptographically Relevant Quantum Computer (CRQC).",
                "action_steps": [
                    "Replace ECDSA/Ed25519 signing routines with ML-DSA-65 (FIPS 204).",
                    "For firmware or long-term offline signatures, consider hash-based SLH-DSA (FIPS 205).",
                    "Update JWT / OAuth token verification services to accept dual signatures."
                ],
                "code_example_before": """# Legacy Cryptography (Vulnerable ECDSA)
from cryptography.hazmat.primitives.asymmetric import ec
private_key = ec.generate_private_key(ec.SECP256R1())""",
                "code_example_after": """# Post-Quantum Cryptography (NIST FIPS 204 - ML-DSA-65 / Dilithium3)
from pqcrypto.sign import dilithium3

public_key, secret_key = dilithium3.generate_keypair()
signature = dilithium3.sign(secret_key, message)"""
            }

        elif category == "Symmetric" and any(k in algo_name.lower() for k in ["128", "des", "rc4", "3des"]):
            return {
                "id": "rec_aes_256",
                "title": "Upgrade Symmetric Encryption to AES-256-GCM",
                "category": "Symmetric Cipher",
                "target_algorithm": algo_name,
                "pqc_standard": "AES-256-GCM / ChaCha20-Poly1305 (256-bit)",
                "urgency": "High",
                "impact_summary": "Grover's algorithm halves effective key length. AES-128 security degrades to ~64 bits (computationally feasible to brute-force).",
                "action_steps": [
                    "Upgrade all secret keys and cipher settings from 128-bit to 256-bit.",
                    "Use authenticated encryption mode AES-GCM or ChaCha20-Poly1305.",
                    "Enforce secure random IV generation (96 bits) per encryption operation."
                ],
                "code_example_before": """# Weak Symmetric Cipher (AES-128)
from Crypto.Cipher import AES
cipher = AES.new(key_16bytes, AES.MODE_CBC, iv)""",
                "code_example_after": """# Quantum-Resistant Symmetric Cipher (AES-256-GCM)
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
key = AESGCM.generate_key(bit_length=256)  # 32 bytes
aesgcm = AESGCM(key)
ciphertext = aesgcm.encrypt(nonce, data, associated_data=None)"""
            }

        elif category == "Hash" and any(k in algo_name.lower() for k in ["md5", "sha1"]):
            return {
                "id": "rec_hash_upgrade",
                "title": "Replace Legacy Hashes (MD5/SHA-1) with SHA-384 / SHA-512 / SHA3",
                "category": "Hash Function",
                "target_algorithm": algo_name,
                "pqc_standard": "NIST FIPS 180-4 (SHA-384/512) & FIPS 202 (SHA3-384)",
                "urgency": "High",
                "impact_summary": "MD5 and SHA-1 are classically broken and quantumly insecure against collision and pre-image attacks.",
                "action_steps": [
                    "Replace all instances of hashlib.md5 and hashlib.sha1 with hashlib.sha384 or hashlib.sha3_384.",
                    "Re-hash existing legacy stored passwords/tokens with Argon2id + SHA-384."
                ],
                "code_example_before": """# Legacy Hash (Insecure)
import hashlib
digest = hashlib.sha1(data).hexdigest()""",
                "code_example_after": """# Quantum-Resistant Hash (SHA-384 / SHA3-384)
import hashlib
digest = hashlib.sha384(data).hexdigest()"""
            }

        return {
            "id": f"rec_generic_{algo_name.replace(' ', '_')}",
            "title": f"Review & Remediate {algo_name}",
            "category": category,
            "target_algorithm": algo_name,
            "pqc_standard": "NIST Post-Quantum Cryptography Recommendation",
            "urgency": "Medium",
            "impact_summary": f"Algorithm {algo_name} poses quantum risk or security degradation under quantum analysis.",
            "action_steps": [
                f"Inspect code usages of {algo_name}.",
                "Consult NIST PQC migration guidelines for modern replacements."
            ],
            "code_example_before": f"# Vulnerable usage of {algo_name}",
            "code_example_after": "# Migrate to NIST FIPS 203/204/205 standard implementation"
        }
