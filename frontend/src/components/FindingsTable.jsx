import React, { useState } from 'react';
import { ShieldAlert, Terminal, ArrowRight, Code, Info } from 'lucide-react';

export default function FindingsTable({ findings, onSelectFinding }) {
  const [filterCategory, setFilterCategory] = useState('ALL');

  if (!findings || findings.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <ShieldAlert size={36} color="var(--emerald-safe)" style={{ marginBottom: '12px' }} />
        <h3 style={{ color: '#ffffff', marginBottom: '6px' }}>No Cryptographic Findings</h3>
        <p style={{ fontSize: '0.9rem' }}>Scan code or a website to inspect cryptographic algorithm usages.</p>
      </div>
    );
  }

  const filtered = filterCategory === 'ALL' 
    ? findings 
    : findings.filter(f => f.category?.toUpperCase() === filterCategory.toUpperCase());

  const getBadgeClass = (risk) => {
    switch (risk) {
      case 'CRITICAL': return 'badge-critical';
      case 'HIGH': return 'badge-high';
      case 'MEDIUM': return 'badge-medium';
      case 'LOW': return 'badge-low';
      case 'SAFE': return 'badge-safe';
      default: return 'badge-low';
    }
  };

  return (
    <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
      
      {/* Table Header & Category Filter Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', color: '#ffffff' }}>Cryptographic Audit Findings</h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Showing {filtered.length} of {findings.length} detected primitive(s)
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {['ALL', 'Asymmetric', 'Symmetric', 'Hash', 'Post-Quantum'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: filterCategory === cat ? 'var(--cyan-primary)' : 'var(--border-color)',
                background: filterCategory === cat ? 'rgba(0, 243, 255, 0.15)' : 'transparent',
                color: filterCategory === cat ? 'var(--cyan-primary)' : 'var(--text-muted)',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '12px 16px' }}>Algorithm / Primitive</th>
              <th style={{ padding: '12px 16px' }}>Category</th>
              <th style={{ padding: '12px 16px' }}>Location</th>
              <th style={{ padding: '12px 16px' }}>Quantum Threat Vector</th>
              <th style={{ padding: '12px 16px' }}>Risk Level</th>
              <th style={{ padding: '12px 16px' }}>PQC Replacement</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, index) => (
              <tr 
                key={item.id || index}
                style={{ 
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                {/* Algorithm Name */}
                <td style={{ padding: '14px 16px', fontWeight: '600', color: '#ffffff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Code size={16} color="var(--cyan-primary)" />
                    {item.algorithm_name}
                  </div>
                </td>

                {/* Category */}
                <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                  {item.category}
                </td>

                {/* Location */}
                <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {item.file} {item.line_number > 0 ? `:L${item.line_number}` : ''}
                </td>

                {/* Threat */}
                <td style={{ padding: '14px 16px', color: item.quantum_threat?.includes("Shor") ? 'var(--magenta-accent)' : 'var(--amber-warn)' }}>
                  {item.quantum_threat}
                </td>

                {/* Risk Level */}
                <td style={{ padding: '14px 16px' }}>
                  <span className={`badge ${getBadgeClass(item.risk_level)}`}>
                    {item.risk_level}
                  </span>
                </td>

                {/* PQC Replacement */}
                <td style={{ padding: '14px 16px', color: 'var(--emerald-safe)', fontWeight: '500' }}>
                  {item.pqc_replacement}
                </td>

                {/* Action Button */}
                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                  <button
                    onClick={() => onSelectFinding && onSelectFinding(item)}
                    className="btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                  >
                    Details <Info size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
