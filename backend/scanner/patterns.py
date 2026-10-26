"""
Cryptographic Pattern Definitions & Quantum Threat Metadata.
Categorizes classical algorithms (vulnerable to Shor/Grover) vs PQC safe algorithms.
"""

# Classical and Quantum-Vulnerable Cryptographic Patterns
CRYPTO_PATTERNS = [
    # --- Asymmetric Encryption & Key Exchange (Broken by Shor's Algorithm) ---
    {
        "id": "rsa_gen",
        "name": "RSA Key Generation / Usage",
        "category": "Asymmetric",
        "patterns": [
            r"RSA\.generate",
            r"generate_private_key\s*\([^)]*RSA",
            r"rsakey",
            r"RSA\.importKey",
            r"PKCS1_v1_5",
            r"PKCS1_OAEP",
            r"from\s+Crypto\.PublicKey\s+import\s+RSA",
            r"cryptography\.hazmat\.primitives\.asymmetric\.rsa",
            r"BEGIN\s+(RSA\s+)?PRIVATE\s+KEY"
        ],
        "default_key_size": 2048,
        "quantum_threat": "Shor's Algorithm",
        "impact": "Completely broken (polynomial time integer factorization). All encrypted data can be retroactively decrypted.",
        "risk_level": "CRITICAL",
        "time_to_vulnerability": "Immediate action required (Harvest-Now-Decrypt-Later risk)",
        "pqc_replacement": "ML-KEM-768 (Kyber-768) [NIST FIPS 203]",
        "pqc_status": "VULNERABLE"
    },
    {
        "id": "ecdsa_ecc",
        "name": "Elliptic Curve Cryptography (ECDSA / ECDH / Ed25519)",
        "category": "Asymmetric",
        "patterns": [
            r"ECDSA",
            r"elliptic_curve",
            r"secp256k1",
            r"SECP256R1",
            r"P-256",
            r"P-384",
            r"P-521",
            r"Curve25519",
            r"Ed25519",
            r"ECDH",
            r"ec\.generate_private_key",
            r"from\s+Crypto\.PublicKey\s+import\s+ECC",
            r"cryptography\.hazmat\.primitives\.asymmetric\.ec"
        ],
        "default_key_size": 256,
        "quantum_threat": "Shor's Algorithm",
        "impact": "Completely broken (polynomial time discrete logarithm solving). Signatures forgeable & key exchanges compromised.",
        "risk_level": "CRITICAL",
        "time_to_vulnerability": "Immediate action required (Y2Q threat for TLS & code signing)",
        "pqc_replacement": "ML-DSA-65 (Dilithium3) [NIST FIPS 204] or SLH-DSA [NIST FIPS 205]",
        "pqc_status": "VULNERABLE"
    },
    {
        "id": "dh_dsa",
        "name": "Diffie-Hellman / DSA",
        "category": "Asymmetric",
        "patterns": [
            r"DiffieHellman",
            r"\bDH\b",
            r"\bDSA\b",
            r"dh\.generate_parameters",
            r"dsa\.generate_private_key",
            r"cryptography\.hazmat\.primitives\.asymmetric\.dh"
        ],
        "default_key_size": 2048,
        "quantum_threat": "Shor's Algorithm",
        "impact": "Completely broken (discrete logarithm problem solved efficiently by quantum computing).",
        "risk_level": "CRITICAL",
        "time_to_vulnerability": "High risk",
        "pqc_replacement": "ML-KEM-768 / Hybrid PQC KEM",
        "pqc_status": "VULNERABLE"
    },

    # --- Symmetric Encryption (Weakened by Grover's Algorithm) ---
    {
        "id": "aes_128",
        "name": "AES-128 / Weak Symmetric Key",
        "category": "Symmetric",
        "patterns": [
            r"AES\.new\([^)]*16\)",  # 16 bytes = 128 bits
            r"AES-128",
            r"algorithms\.AES\([^)]*key.*length\s*=\s*128\)",
            r"AES_128_CBC",
            r"AES_128_GCM"
        ],
        "default_key_size": 128,
        "quantum_threat": "Grover's Algorithm",
        "impact": "Effective security reduced to ~64 bits due to quadratic speedup in brute-force search. Vulnerable to quantum attack.",
        "risk_level": "HIGH",
        "time_to_vulnerability": "Medium-Term (Upgrade recommended)",
        "pqc_replacement": "AES-256-GCM / ChaCha20-Poly1305 (256-bit)",
        "pqc_status": "WEAKENED"
    },
    {
        "id": "des_3des_rc4",
        "name": "Legacy Ciphers (DES / 3DES / RC4 / Blowfish)",
        "category": "Symmetric",
        "patterns": [
            r"\bDES\b",
            r"3DES",
            r"TripleDES",
            r"\bRC4\b",
            r"ARC4",
            r"Blowfish"
        ],
        "default_key_size": 64,
        "quantum_threat": "Grover's + Classical Attacks",
        "impact": "Severely vulnerable classically and trivialized under quantum search.",
        "risk_level": "CRITICAL",
        "time_to_vulnerability": "Immediate Deprecation",
        "pqc_replacement": "AES-256-GCM",
        "pqc_status": "VULNERABLE"
    },

    # --- Hashing Algorithms ---
    {
        "id": "md5_sha1",
        "name": "Legacy Hash Functions (MD5 / SHA-1)",
        "category": "Hash",
        "patterns": [
            r"hashlib\.md5",
            r"hashlib\.sha1",
            r"\bMD5\b",
            r"\bSHA1\b",
            r"algorithms\.SHA1",
            r"algorithms\.MD5"
        ],
        "default_key_size": 160,
        "quantum_threat": "Grover's + BHT Quantum Collision",
        "impact": "Pre-image and collision resistance severely diminished. Classically broken, quantumly unsafe.",
        "risk_level": "HIGH",
        "time_to_vulnerability": "Immediate Deprecation",
        "pqc_replacement": "SHA-384 / SHA-512 / SHA3-384",
        "pqc_status": "VULNERABLE"
    },
    {
        "id": "sha256",
        "name": "SHA-256 Hash Function",
        "category": "Hash",
        "patterns": [
            r"hashlib\.sha256",
            r"\bSHA256\b",
            r"SHA-256",
            r"algorithms\.SHA256"
        ],
        "default_key_size": 256,
        "quantum_threat": "Grover's Algorithm (Pre-image)",
        "impact": "Effective pre-image resistance reduced to 128 bits. Still usable, but 384+ bits recommended for long-term PQC security.",
        "risk_level": "LOW",
        "time_to_vulnerability": "Long-Term Safe (Consider SHA-384 for high-security applications)",
        "pqc_replacement": "SHA-384 / SHA-512 / SHA3-512",
        "pqc_status": "ACCEPTABLE"
    },

    # --- Quantum-Safe / Post-Quantum Cryptography Primitives ---
    {
        "id": "pqc_kyber",
        "name": "ML-KEM / CRYSTALS-Kyber (Quantum-Safe KEM)",
        "category": "Post-Quantum",
        "patterns": [
            r"Kyber",
            r"ML-KEM",
            r"ML_KEM_768",
            r"ML_KEM_1024",
            r"kyber768",
            r"pqc_kem",
            r"pqclean.*kyber"
        ],
        "default_key_size": 768,
        "quantum_threat": "None (Lattice-Based Hardness / Module-LWE)",
        "impact": "Quantum-Resistant. Standardized by NIST FIPS 203.",
        "risk_level": "SAFE",
        "time_to_vulnerability": "Quantum Safe",
        "pqc_replacement": "Already PQC Compliant",
        "pqc_status": "QUANTUM_SAFE"
    },
    {
        "id": "pqc_dilithium",
        "name": "ML-DSA / CRYSTALS-Dilithium (Quantum-Safe Signature)",
        "category": "Post-Quantum",
        "patterns": [
            r"Dilithium",
            r"ML-DSA",
            r"ML_DSA_65",
            r"dilithium3",
            r"pqc_sig",
            r"pqclean.*dilithium"
        ],
        "default_key_size": 65,
        "quantum_threat": "None (Lattice-Based Hardness / Module-LWE)",
        "impact": "Quantum-Resistant. Standardized by NIST FIPS 204.",
        "risk_level": "SAFE",
        "time_to_vulnerability": "Quantum Safe",
        "pqc_replacement": "Already PQC Compliant",
        "pqc_status": "QUANTUM_SAFE"
    },
    {
        "id": "pqc_sphincs",
        "name": "SLH-DSA / SPHINCS+ (Stateless Hash-Based Signature)",
        "category": "Post-Quantum",
        "patterns": [
            r"SPHINCS",
            r"SLH-DSA",
            r"sphincsplus"
        ],
        "default_key_size": 128,
        "quantum_threat": "None (Hash-Based Hardness)",
        "impact": "Quantum-Resistant. Standardized by NIST FIPS 205.",
        "risk_level": "SAFE",
        "time_to_vulnerability": "Quantum Safe",
        "pqc_replacement": "Already PQC Compliant",
        "pqc_status": "QUANTUM_SAFE"
    },
    {
        "id": "aes_256",
        "name": "AES-256 (Quantum-Resistant Symmetric)",
        "category": "Symmetric",
        "patterns": [
            r"AES-256",
            r"AES_256_GCM",
            r"AES\.new\([^)]*32\)",  # 32 bytes = 256 bits
            r"algorithms\.AES\([^)]*key.*length\s*=\s*256\)"
        ],
        "default_key_size": 256,
        "quantum_threat": "Grover's Algorithm (Negligible)",
        "impact": "Grover reduces security from 256 bits to 128 bits, which remains computationally infeasible for quantum computers.",
        "risk_level": "SAFE",
        "time_to_vulnerability": "Quantum Safe",
        "pqc_replacement": "Already PQC Compliant",
        "pqc_status": "QUANTUM_SAFE"
    }
]
