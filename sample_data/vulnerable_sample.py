"""
Vulnerable Sample Code - Quantum Security Scanner Test
Contains classical cryptographic primitives vulnerable to Shor's and Grover's quantum algorithms.
"""

import hashlib
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import ec, dh
from Crypto.PublicKey import RSA  # type: ignore
from Crypto.Cipher import AES  # type: ignore

def generate_legacy_rsa_key():
    # VULNERABLE: RSA 2048-bit key generation (Broken by Shor's algorithm)
    print("Generating classical RSA key...")
    key = RSA.generate(2048)
    private_key = key.export_key()
    public_key = key.publickey().export_key()
    return private_key, public_key

def sign_data_ecdsa(data: bytes):
    # VULNERABLE: Elliptic Curve SECP256R1 signature (Broken by Shor's algorithm)
    private_key = ec.generate_private_key(ec.SECP256R1())
    signature = private_key.sign(
        data,
        ec.ECDSA(hashes.SHA256())
    )
    return signature

def encrypt_user_payload(secret_data: bytes, key_bytes: bytes):
    # VULNERABLE: AES-128 bit key (Grover's algorithm reduces effective security to 64 bits)
    if len(key_bytes) != 16:
        raise ValueError("Key length must be 16 bytes for AES-128")
    cipher = AES.new(key_bytes, AES.MODE_CBC)
    return cipher.encrypt(secret_data)

def compute_legacy_hash(text: str):
    # VULNERABLE: MD5 and SHA-1 hashing (Classically broken & quantum vulnerable)
    md5_digest = hashlib.md5(text.encode()).hexdigest()
    sha1_digest = hashlib.sha1(text.encode()).hexdigest()
    return md5_digest, sha1_digest

if __name__ == "__main__":
    print("Executing legacy cryptographic routines...")
    priv, pub = generate_legacy_rsa_key()
    md5_res, sha1_res = compute_legacy_hash("quantum-threat-demo")
    print(f"MD5 Digest: {md5_res}")
    print(f"SHA1 Digest: {sha1_res}")
