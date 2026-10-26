import React, { useState } from 'react';
import { Globe, Search, ShieldAlert, Lock, CheckCircle2, Server, Key } from 'lucide-react';

export default function WebsiteScanner({ onScanWebsite, loading, lastResult }) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url || !url.trim()) return;
    onScanWebsite(url);
  };

  const handleQuickClick = (domain) => {
    setUrl(`https://${domain}`);
    onScanWebsite(`https://${domain}`);
  };

  const sslInfo = lastResult?.ssl_info;
  const headersInfo = lastResult?.headers_info;

  return (
    <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <Globe size={22} color="var(--cyan-primary)" />
        <div>
          <h3 style={{ fontSize: '1.15rem', color: '#ffffff' }}>HTTPS Website & SSL/TLS Scanner</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Inspect live domain SSL certificates, key exchange primitives, and PQC readiness.
          </p>
        </div>
      </div>

      {/* URL Input Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter website domain or HTTPS URL (e.g. https://example.com)"
          style={{
            flex: 1,
            minWidth: '280px',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            padding: '12px 16px',
            color: '#ffffff',
            fontSize: '0.95rem',
            outline: 'none'
          }}
        />
        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Scanning SSL/TLS...' : (
            <>
              <Search size={18} /> Scan Domain
            </>
          )}
        </button>
      </form>

      {/* Preset Domains Quick-Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Try Quick Scan:</span>
        {['github.com', 'google.com', 'nist.gov', 'cloudflare.com'].map(d => (
          <button
            key={d}
            type="button"
            onClick={() => handleQuickClick(d)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            {d}
          </button>
        ))}
      </div>

      {/* SSL Inspection Results Card */}
      {sslInfo && (
        <div style={{ background: 'rgba(0, 0, 0, 0.25)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '20px', marginTop: '16px' }}>
          <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Key size={18} color="var(--cyan-primary)" /> SSL Certificate & Protocol Inspection
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', fontSize: '0.875rem' }}>
            <div>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Public Key Algorithm</span>
              <div style={{ fontWeight: '600', color: sslInfo.public_key_type === 'RSA' ? 'var(--amber-warn)' : 'var(--emerald-safe)' }}>
                {sslInfo.public_key_type || 'RSA'} ({sslInfo.public_key_bits || 2048} bits)
              </div>
            </div>

            <div>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Signature Algorithm</span>
              <div style={{ fontWeight: '600', color: '#ffffff' }}>
                {sslInfo.signature_algorithm || 'sha256WithRSAEncryption'}
              </div>
            </div>

            <div>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase' }}>TLS Protocol Version</span>
              <div style={{ fontWeight: '600', color: 'var(--cyan-primary)' }}>
                {sslInfo.tls_version || 'TLSv1.3'}
              </div>
            </div>

            <div>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Security Headers</span>
              <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
                <span className={`badge ${headersInfo?.hsts ? 'badge-safe' : 'badge-low'}`}>
                  HSTS: {headersInfo?.hsts ? 'Enabled' : 'Missing'}
                </span>
                <span className={`badge ${headersInfo?.csp ? 'badge-safe' : 'badge-low'}`}>
                  CSP: {headersInfo?.csp ? 'Enabled' : 'Missing'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
