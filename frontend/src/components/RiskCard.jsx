import React from 'react';
import { ShieldAlert, ShieldCheck, Zap, Lock, AlertTriangle } from 'lucide-react';

export default function RiskCard({ metrics }) {

  const {
    quantum_risk_score = 0,
    risk_category = 'SAFE',
    risk_label = 'No Scan Yet',
    pqc_readiness_score = 0,
    shor_threat_count = 0,
    grover_threat_count = 0,
    vulnerable_primitives_count = 0,
    safe_primitives_count = 0
  } = metrics || {};

  const getCategoryBadgeClass = (cat) => {
    switch (cat) {
      case 'CRITICAL': return 'badge-critical';
      case 'HIGH': return 'badge-high';
      case 'MEDIUM': return 'badge-medium';
      case 'LOW': return 'badge-low';
      default: return 'badge-safe';
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px' }}>

      {/* Risk Score Card */}
      <div className="glasscard glass-card-interactive" style={{ padding: '20px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>Quantum Risk Index</span>
          <ShieldAlert size={22} color={quantum_risk_score > 60 ? 'var(--red-critical)' : 'var(--cyan-primary)'} />
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{ fontSize: '2.4rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: quantum_risk_score > 60 ? 'var(--red-critical)' : quantum_risk_score > 30 ? 'var(--amber-warn)' : 'var(--emerald-safe)' }}>
            {quantum_risk_score}
          </span>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>/ 100</span>
        </div>
        <div style={{ marginTop: '10px' }}>
          <span className={`badge ${getCategoryBadgeClass(risk_category)}`}>
            {risk_label}
          </span>
        </div>
      </div>

      {/* PQC Readiness Score */}
      <div className="glasscard glass-card-interactive" style={{ padding: '20px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>PQC Readiness</span>
          <ShieldCheck size={22} color="var(--emerald-safe)" />
        </div>
        <div style={{ fontSize: '2.4rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--emerald-safe)' }}>
          {pqc_readiness_score}%
        </div>
        <div style={{ marginTop: '10px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {safe_primitives_count} Quantum Safe | {vulnerable_primitives_count} Vulnerable
        </div>
      </div>

      {/* Shor's Threats */}
      <div className="glasscard glass-card-interactive" style={{ padding: '20px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>Shor's Algorithm Risks</span>
          <Zap size={22} color="var(--magenta-accent)" />
        </div>
        <div style={{ fontSize: '2.4rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--magenta-accent)' }}>
          {shor_threat_count}
        </div>
        <div style={{ marginTop: '10px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Asymmetric RSA / ECC Broken
        </div>
      </div>

      {/* Grover's Threats */}
      <div className="glasscard glass-card-interactive" style={{ padding: '20px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>Grover's Algorithm Risks</span>
          <Lock size={22} color="var(--amber-warn)" />
        </div>
        <div style={{ fontSize: '2.4rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--amber-warn)' }}>
          {grover_threat_count}
        </div>
        <div style={{ marginTop: '10px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Symmetric & Hash Degraded Keys
        </div>
      </div>

    </div>
  );
}
