import React from 'react';
import { ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck, Code } from 'lucide-react';

export default function RecommendationCard({ recommendations }) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div style={{ marginTop: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <ShieldCheck size={24} color="var(--emerald-safe)" />
        <h3 style={{ fontSize: '1.3rem', color: '#ffffff' }}>NIST Post-Quantum Migration Strategy</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {recommendations.map((rec, index) => (
          <div key={rec.id || index} className="glass-card" style={{ padding: '24px', borderLeft: '4px solid var(--cyan-primary)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--cyan-primary)', letterSpacing: '0.05em' }}>
                  {rec.category} Migration
                </span>
                <h4 style={{ fontSize: '1.15rem', color: '#ffffff', marginTop: '2px' }}>{rec.title}</h4>
              </div>
              <span className="badge badge-critical" style={{ fontSize: '0.75rem' }}>
                Urgency: {rec.urgency}
              </span>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                <AlertTriangle size={16} color="var(--amber-warn)" />
                <strong style={{ fontSize: '0.85rem', color: 'var(--amber-warn)' }}>NIST Standard: {rec.pqc_standard}</strong>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{rec.impact_summary}</p>
            </div>

            {/* Action Roadmap */}
            <div style={{ marginBottom: '16px' }}>
              <h5 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Migration Action Steps
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {rec.action_steps && rec.action_steps.map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: 'var(--text-main)' }}>
                    <CheckCircle2 size={16} color="var(--emerald-safe)" style={{ flexShrink: 0 }} />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Before vs After Code Diff */}
            {(rec.code_example_before || rec.code_example_after) && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginTop: '16px' }}>
                {/* Legacy / Before */}
                <div style={{ background: 'rgba(255, 51, 102, 0.05)', border: '1px solid rgba(255, 51, 102, 0.2)', borderRadius: '10px', padding: '14px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--red-critical)', fontWeight: '700', textTransform: 'uppercase' }}>
                    Vulnerable Implementation (Before)
                  </span>
                  <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#ff8099', marginTop: '8px', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
                    {rec.code_example_before}
                  </pre>
                </div>

                {/* PQC / After */}
                <div style={{ background: 'rgba(0, 255, 157, 0.05)', border: '1px solid rgba(0, 255, 157, 0.2)', borderRadius: '10px', padding: '14px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--emerald-safe)', fontWeight: '700', textTransform: 'uppercase' }}>
                    PQC Compliant (After - NIST FIPS)
                  </span>
                  <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#80ffcc', marginTop: '8px', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
                    {rec.code_example_after}
                  </pre>
                </div>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}
