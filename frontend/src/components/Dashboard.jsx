import React from 'react';
import { ShieldAlert, Zap, Cpu, Clock, BookOpen, ExternalLink, CheckCircle } from 'lucide-react';

export default function Dashboard({ metrics, threatsData }) {
  const score = metrics?.quantum_risk_score ?? 0;
  const category = metrics?.risk_category ?? 'SAFE';
  const label = metrics?.risk_label ?? 'Quantum Safe';

  // Calculate SVG Gauge Angle (0 to 180 degrees)
  const angle = (score / 100) * 180;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '24px' }}>

      {/* Visual Quantum Risk Gauge */}
      <div className="glass-card" style={{ padding: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Quantum Vulnerability Score
        </h3>

        {/* SVG Semi-Circle Gauge */}
        <div style={{ position: 'relative', width: '220px', height: '120px' }}>
          <svg width="220" height="120" viewBox="0 0 220 120">
            {/* Background Arc */}
            <path
              d="M 20 110 A 90 90 0 0 1 200 110"
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="18"
              strokeLinecap="round"
            />
            {/* Value Arc */}
            <path
              d="M 20 110 A 90 90 0 0 1 200 110"
              fill="none"
              stroke={score > 60 ? 'url(#redGradient)' : score > 30 ? 'url(#amberGradient)' : 'url(#emeraldGradient)'}
              strokeWidth="18"
              strokeLinecap="round"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * score) / 100}
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
            <defs>
              <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff9900" />
                <stop offset="100%" stopColor="#ff3366" />
              </linearGradient>
              <linearGradient id="amberGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00f3ff" />
                <stop offset="100%" stopColor="#ff9900" />
              </linearGradient>
              <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00f3ff" />
                <stop offset="100%" stopColor="#00ff9d" />
              </linearGradient>
            </defs>
          </svg>

          {/* Needle / Score Text */}
          <div style={{ position: 'absolute', bottom: '10px', left: '0', right: '0', textAlign: 'center' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#ffffff' }}>
              {score}
            </span>
            <span style={{ fontSize: '1rem', color: 'var(--text-dim)' }}> / 100</span>
          </div>
        </div>

        <div style={{ marginTop: '12px' }}>
          <span className={`badge ${category === 'CRITICAL' ? 'badge-critical' : category === 'HIGH' ? 'badge-high' : category === 'MEDIUM' ? 'badge-medium' : 'badge-safe'}`}>
            {label}
          </span>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '12px', maxWidth: '280px' }}>
          {metrics?.summary || "Evaluates cryptographic primitives against Shor's and Grover's algorithms."}
        </p>
      </div>

      {/* Quantum Threat Matrix Breakdown (Shor's vs Grover's) */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={20} color="var(--magenta-accent)" /> Quantum Attack Vectors
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Shor's Algorithm */}
          <div style={{ background: 'rgba(255, 0, 127, 0.08)', border: '1px solid rgba(255, 0, 127, 0.2)', borderRadius: '10px', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <strong style={{ fontSize: '0.95rem', color: 'var(--magenta-accent)' }}>Shor's Algorithm Threat</strong>
              <span className="badge badge-critical">Polynomial Speedup</span>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Breaks RSA and Elliptic Curve cryptography (ECDSA/ECDH). Solves integer factorization and discrete logarithms with polynomial-time quantum algorithms.
            </p>
          </div>

          {/* Grover's Algorithm */}
          <div style={{ background: 'rgba(255, 153, 0, 0.08)', border: '1px solid rgba(255, 153, 0, 0.2)', borderRadius: '10px', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <strong style={{ fontSize: '0.95rem', color: 'var(--amber-warn)' }}>Grover's Algorithm Threat</strong>
              <span className="badge badge-high">Quadratic Speedup</span>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Provides a quadratic search speedup. This effectively halves the security of symmetric keys, so AES-128 provides approximately 64-bit security against a sufficiently capable quantum computer.
            </p>
          </div>
        </div>
      </div>

      {/* Y2Q & NIST FIPS PQC Reference Card */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={20} color="var(--cyan-primary)" /> Y2Q Timeline & NIST Standards
        </h3>

        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <ShieldAlert size={16} color="var(--red-critical)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: '#ffffff' }}>Harvest-Now-Decrypt-Later (HNDL):</strong> Adversaries capture encrypted web traffic today to decrypt once quantum computers mature.
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
            <strong style={{ color: 'var(--cyan-primary)' }}>NIST FIPS PQC Standards:</strong>
            <ul style={{ paddingLeft: '18px', marginTop: '6px', lineHeight: '1.5' }}>
              <li><strong>FIPS 203:</strong> ML-KEM-768 (Kyber) - Encryption / Key Encapsulation</li>
              <li><strong>FIPS 204:</strong> ML-DSA-65 (Dilithium) - Digital Signatures</li>
              <li><strong>FIPS 205:</strong> SLH-DSA (SPHINCS+) - Hash-Based Signatures</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}
