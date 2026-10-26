import React, { useState } from 'react';
import { UploadCloud, FileCode, Play, RotateCcw, Check, Sparkles } from 'lucide-react';

const VULNERABLE_CODE_SAMPLE = ``;

const SECURE_PQC_CODE_SAMPLE = ``;

export default function UploadBox({ onScanCode, onScanFile, loading }) {
  const [code, setCode] = useState(VULNERABLE_CODE_SAMPLE);
  const [filename, setFilename] = useState("vulnerable_sample.py");
  const [dragActive, setDragActive] = useState(false);

  const handleScanSubmit = (e) => {
    e.preventDefault();
    if (!code.strip && !code.trim()) return;
    onScanCode(code, filename);
  };

  const handleFileUpload = (file) => {
    if (!file) return;
    setFilename(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      setCode(text);
      onScanFile(file);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>

      {/* Preset Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileCode size={20} color="var(--cyan-primary)" />
          <h3 style={{ fontSize: '1.15rem', color: '#ffffff' }}>Source Code Scanner</h3>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={() => { setCode(VULNERABLE_CODE_SAMPLE); setFilename("vulnerable_sample.py"); }}
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
          >
            Load Vulnerable Sample
          </button>

          <button
            type="button"
            onClick={() => { setCode(SECURE_PQC_CODE_SAMPLE); setFilename("secure_sample.py"); }}
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '6px 12px', borderColor: 'var(--emerald-safe)', color: 'var(--emerald-safe)' }}
          >
            <Sparkles size={14} /> Load PQC Safe Sample
          </button>
        </div>
      </div>

      {/* Drag & Drop File Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        style={{
          border: '2px dashed',
          borderColor: dragActive ? 'var(--cyan-primary)' : 'var(--border-color)',
          borderRadius: '12px',
          padding: '16px',
          textAlign: 'center',
          background: dragActive ? 'rgba(0, 243, 255, 0.05)' : 'rgba(0, 0, 0, 0.2)',
          marginBottom: '16px',
          transition: 'all 0.2s ease'
        }}
      >
        <UploadCloud size={28} color="var(--cyan-primary)" style={{ marginBottom: '6px' }} />
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Drag and drop your source code file here (`.py`, `.js`, `.java`, `.c`, `.go`), or{' '}
          <label style={{ color: 'var(--cyan-primary)', cursor: 'pointer', fontWeight: '600', textDecoration: 'underline' }}>
            browse file
            <input
              type="file"
              style={{ display: 'none' }}
              onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
            />
          </label>
        </p>
      </div>

      {/* Code Text Area Form */}
      <form onSubmit={handleScanSubmit}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Target Filename: {filename}
          </span>
          <button
            type="button"
            onClick={() => setCode('')}
            style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: '0.8rem', cursor: 'pointer' }}
          >
            Clear Code
          </button>
        </div>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste source code snippet here..."
          className="code-input"
          rows={10}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Scanning Crypto Primitives...' : (
              <>
                <Play size={18} /> Analyze Quantum Risk
              </>
            )}
          </button>
        </div>
      </form>

    </div>
  );
}
