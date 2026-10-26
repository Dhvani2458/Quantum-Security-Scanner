"""
Quantum Security & Post-Quantum Cryptography Knowledge Base.
Provides standardized metadata on Shor's Algorithm, Grover's Algorithm,
NIST FIPS PQC standards, and Y2Q timeline parameters.
"""

QUANTUM_THREAT_MATRIX = {
    "shors_algorithm": {
        "name": "Shor's Algorithm",
        "discovered_by": "Peter Shor (1994)",
        "quantum_speedup": "Exponential (Polynomial time: O((log N)^3))",
        "affected_primitives": ["RSA", "ECC", "ECDSA", "ECDH", "DSA", "Diffie-Hellman", "Ed25519"],
        "threat_description": "Solves integer factorization and discrete logarithms in polynomial time. Renders all traditional asymmetric cryptography insecure.",
        "pqc_countermeasure": "Lattice-based cryptography (Module-LWE), Code-based cryptography, or Hash-based signatures."
    },
    "grovers_algorithm": {
        "name": "Grover's Algorithm",
        "discovered_by": "Lov Grover (1996)",
        "quantum_speedup": "Quadratic (Speedup from O(N) to O(sqrt(N)))",
        "affected_primitives": ["AES-128", "AES-192", "SHA-256", "SHA-1", "MD5", "3DES"],
        "threat_description": "Halves the effective security key length of symmetric ciphers and hash functions. AES-128 drops to ~64-bit effective security.",
        "pqc_countermeasure": "Double key lengths (e.g. migrate AES-128 -> AES-256 and SHA-256 -> SHA-384/512)."
    }
}

NIST_PQC_STANDARDS = {
    "FIPS_203": {
        "standard": "FIPS 203",
        "name": "ML-KEM (Module-Lattice-Based Key-Encapsulation Mechanism)",
        "original_name": "CRYSTALS-Kyber",
        "purpose": "General Encryption & Public Key Encapsulation (Replaces RSA & ECDH)",
        "security_levels": {
            "ML-KEM-512": "AES-128 Equivalent (NIST Level 1)",
            "ML-KEM-768": "AES-192 Equivalent (NIST Level 3 - Recommended Default)",
            "ML-KEM-1024": "AES-256 Equivalent (NIST Level 5)"
        }
    },
    "FIPS_204": {
        "standard": "FIPS 204",
        "name": "ML-DSA (Module-Lattice-Based Digital Signature Algorithm)",
        "original_name": "CRYSTALS-Dilithium",
        "purpose": "Digital Signatures & Authentication (Replaces RSA Signatures & ECDSA)",
        "security_levels": {
            "ML-DSA-44": "NIST Level 2",
            "ML-DSA-65": "NIST Level 3 (Recommended Default)",
            "ML-DSA-87": "NIST Level 5"
        }
    },
    "FIPS_205": {
        "standard": "FIPS 205",
        "name": "SLH-DSA (Stateless Hash-Based Digital Signature Algorithm)",
        "original_name": "SPHINCS+",
        "purpose": "Stateless Hash-Based Digital Signatures (Alternative fallback signature scheme)",
        "security_levels": {
            "SLH-DSA-SHA2-128f": "NIST Level 1",
            "SLH-DSA-SHAKE-256f": "NIST Level 5"
        }
    }
}

Y2Q_TIMELINE = {
    "harvest_now_decrypt_later": "CRITICAL RISK TODAY: Adversaries are currently intercepting and storing encrypted traffic to decrypt once CRQC (Cryptographically Relevant Quantum Computer) is operational.",
    "estimated_crqc_window": "2030 - 2035",
    "migration_urgency": "Immediate. Typical enterprise cryptography migration takes 5-10 years."
}
