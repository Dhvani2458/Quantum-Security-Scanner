import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Code,
  Globe,
  BookOpen,
  Cpu,
  Terminal,
  Sparkles,
  Info,
  X
} from 'lucide-react';

import RiskCard from './components/RiskCard';
import Dashboard from './components/Dashboard';
import UploadBox from './components/UploadBox';
import WebsiteScanner from './components/WebsiteScanner';
import FindingsTable from './components/FindingsTable';
import RecommendationCard from './components/RecommendationCard';

import {
  scanCodeSnippet,
  scanCodeFile,
  scanWebsiteURL,
  fetchQuantumThreats
} from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('code'); // 'code' | 'website' | 'matrix'
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [threatsData, setThreatsData] = useState(null);
  const [selectedFinding, setSelectedFinding] = useState(null);
  const [apiOnline, setApiOnline] = useState(false);

  useEffect(() => {
    // Initial scan with default code snippet & fetch threats metadata
    handleInitialLoad();
  }, []);

  const handleInitialLoad = async () => {
    setLoading(true);
    try {
      const threats = await fetchQuantumThreats();
      setThreatsData(threats);
      setApiOnline(true);
    } catch (err) {
      console.warn("API Offline, using client mode:", err);
      setApiOnline(false);
    } finally {
      setLoading(false);
    }
  };

  const handleScanCode = async (code, filename) => {
    setLoading(true);
    try {
      const res = await scanCodeSnippet(code, filename);
      setScanResult(res);
    } catch (err) {
      console.error("Scan Code Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleScanFile = async (file) => {
    setLoading(true);
    try {
      const res = await scanCodeFile(file);
      setScanResult(res);
    } catch (err) {
      console.error("Scan File Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleScanWebsite = async (url) => {
    setLoading(true);
    try {
      const res = await scanWebsiteURL(url);
      setScanResult(res);
    } catch (err) {
      console.error("Scan Website Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 20px 60px 20px' }}>

      {/* Top Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--cyan-primary), #0072ff)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px var(--cyan-glow)'
            }}>
              <Cpu size={26} color="#ffffff" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: '800', lineHeight: 1.2 }}>
                Quantum<span className="gradient-text">SecurityScanner</span>
              </h1>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Post-Quantum Cryptography (PQC) Code & Web Security Audit Platform
              </p>
            </div>
          </div>
        </div>

        {/* System Status Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '9999px',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid var(--border-color)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: apiOnline ? 'var(--emerald-safe)' : 'var(--amber-warn)',
              boxShadow: apiOnline ? '0 0 10px var(--emerald-safe)' : '0 0 10px var(--amber-warn)'
            }} />
            Engine: {apiOnline ? 'FastAPI Backend Online' : 'Client Simulation Mode'}
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('code')}
          className={`nav-tab ${activeTab === 'code' ? 'active' : ''}`}
        >
          <Code size={18} /> Source Code Scanner
        </button>

        <button
          onClick={() => setActiveTab('website')}
          className={`nav-tab ${activeTab === 'website' ? 'active' : ''}`}
        >
          <Globe size={18} /> Website & SSL Scanner
        </button>

        <button
          onClick={() => setActiveTab('matrix')}
          className={`nav-tab ${activeTab === 'matrix' ? 'active' : ''}`}
        >
          <BookOpen size={18} /> PQC Threat Matrix & FIPS Standards
        </button>
      </nav>

      {/* Summary Metrics Banner */}
      {activeTab !== 'matrix' && <RiskCard metrics={scanResult?.risk_metrics} />}

      {/* Tab Content */}
      {activeTab === 'code' && (
        <>
          <UploadBox
            onScanCode={handleScanCode}
            onScanFile={handleScanFile}
            loading={loading}
          />
          <Dashboard metrics={scanResult?.risk_metrics} threatsData={threatsData} />
          <FindingsTable
            findings={scanResult?.findings}
            onSelectFinding={(item) => setSelectedFinding(item)}
          />
          <RecommendationCard recommendations={scanResult?.recommendations} />
        </>
      )}

      {activeTab === 'website' && (
        <>
          <WebsiteScanner
            onScanWebsite={handleScanWebsite}
            loading={loading}
            lastResult={scanResult}
          />
          <Dashboard metrics={scanResult?.risk_metrics} threatsData={threatsData} />
          <FindingsTable
            findings={scanResult?.findings}
            onSelectFinding={(item) => setSelectedFinding(item)}
          />
          <RecommendationCard recommendations={scanResult?.recommendations} />
        </>
      )}

      {activeTab === 'matrix' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Page Header */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <BookOpen size={24} color="var(--cyan-primary)" />
              <h2 style={{
                fontSize: '1.4rem',
                color: '#ffffff',
                margin: 0
              }}>
                PQC Threat Matrix & FIPS Standards
              </h2>
            </div>

            <p style={{
              fontSize: '0.9rem',
              color: 'var(--text-muted)',
              margin: 0,
              lineHeight: '1.6'
            }}>
              Understand how quantum algorithms threaten classical cryptography
              and explore standardized Post-Quantum Cryptography (PQC) solutions.
            </p>
          </div>


          {/* Quantum Threat Overview */}
          <div>
            <h3 style={{
              fontSize: '1.05rem',
              color: '#ffffff',
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Cpu size={19} color="var(--magenta-accent)" />
              Quantum Threat Overview
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '24px'
            }}>

              {/* Shor's Algorithm */}
              <div
                className="glass-card"
                style={{
                  padding: '24px',
                  border: '1px solid rgba(255, 0, 127, 0.25)'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <h3 style={{
                    fontSize: '1.15rem',
                    color: 'var(--magenta-accent)',
                    margin: 0
                  }}>
                    Shor's Algorithm
                  </h3>

                  <span className="badge badge-critical">
                    CRITICAL
                  </span>
                </div>

                <p style={{
                  fontSize: '0.88rem',
                  color: 'var(--text-muted)',
                  lineHeight: '1.6',
                  marginBottom: '18px'
                }}>
                  Provides a polynomial-time quantum speedup for integer
                  factorization and discrete logarithms. This threatens
                  widely used public-key cryptographic systems.
                </p>

                <div style={{
                  background: 'rgba(255, 0, 127, 0.07)',
                  border: '1px solid rgba(255, 0, 127, 0.15)',
                  borderRadius: '10px',
                  padding: '14px'
                }}>
                  <strong style={{
                    fontSize: '0.78rem',
                    color: 'var(--red-critical)',
                    textTransform: 'uppercase'
                  }}>
                    Vulnerable Primitives
                  </strong>

                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    marginTop: '10px'
                  }}>
                    <span className="badge badge-critical">RSA</span>
                    <span className="badge badge-critical">ECC</span>
                    <span className="badge badge-critical">DH</span>
                    <span className="badge badge-critical">ECDH</span>
                    <span className="badge badge-critical">DSA</span>
                  </div>
                </div>
              </div>


              {/* Grover's Algorithm */}
              <div
                className="glass-card"
                style={{
                  padding: '24px',
                  border: '1px solid rgba(255, 153, 0, 0.25)'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <h3 style={{
                    fontSize: '1.15rem',
                    color: 'var(--amber-warn)',
                    margin: 0
                  }}>
                    Grover's Algorithm
                  </h3>

                  <span className="badge badge-high">
                    HIGH
                  </span>
                </div>

                <p style={{
                  fontSize: '0.88rem',
                  color: 'var(--text-muted)',
                  lineHeight: '1.6',
                  marginBottom: '18px'
                }}>
                  Provides a quadratic speedup for unstructured search.
                  It reduces the effective security level of symmetric
                  cryptographic keys and hash functions.
                </p>

                <div style={{
                  background: 'rgba(255, 153, 0, 0.07)',
                  border: '1px solid rgba(255, 153, 0, 0.15)',
                  borderRadius: '10px',
                  padding: '14px'
                }}>
                  <strong style={{
                    fontSize: '0.78rem',
                    color: 'var(--amber-warn)',
                    textTransform: 'uppercase'
                  }}>
                    Affected Primitives
                  </strong>

                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    marginTop: '10px'
                  }}>
                    <span className="badge badge-high">AES-128</span>
                    <span className="badge badge-high">AES-256</span>
                    <span className="badge badge-high">SHA-256</span>
                    <span className="badge badge-high">SHA-512</span>
                  </div>
                </div>
              </div>

            </div>
          </div>


          {/* Quantum Threat Matrix */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{
              fontSize: '1.1rem',
              color: '#ffffff',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <ShieldAlert size={20} color="var(--red-critical)" />
              Quantum Threat Matrix
            </h3>

            <div style={{
              overflowX: 'auto'
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.85rem'
              }}>
                <thead>
                  <tr style={{
                    borderBottom: '1px solid var(--border-color)',
                    textAlign: 'left'
                  }}>
                    <th style={{ padding: '12px', color: 'var(--text-muted)' }}>
                      Algorithm
                    </th>
                    <th style={{ padding: '12px', color: 'var(--text-muted)' }}>
                      Quantum Attack
                    </th>
                    <th style={{ padding: '12px', color: 'var(--text-muted)' }}>
                      Impact
                    </th>
                    <th style={{ padding: '12px', color: 'var(--text-muted)' }}>
                      Risk
                    </th>
                    <th style={{ padding: '12px', color: 'var(--text-muted)' }}>
                      PQC Direction
                    </th>
                  </tr>
                </thead>

                <tbody>

                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '13px', color: '#ffffff', fontWeight: '600' }}>
                      RSA-2048 / RSA-4096
                    </td>
                    <td style={{ padding: '13px', color: 'var(--magenta-accent)' }}>
                      Shor
                    </td>
                    <td style={{ padding: '13px', color: 'var(--text-muted)' }}>
                      Public-key security can be broken
                    </td>
                    <td style={{ padding: '13px' }}>
                      <span className="badge badge-critical">Critical</span>
                    </td>
                    <td style={{ padding: '13px', color: 'var(--cyan-primary)' }}>
                      ML-KEM / ML-DSA
                    </td>
                  </tr>

                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '13px', color: '#ffffff', fontWeight: '600' }}>
                      ECC / ECDSA
                    </td>
                    <td style={{ padding: '13px', color: 'var(--magenta-accent)' }}>
                      Shor
                    </td>
                    <td style={{ padding: '13px', color: 'var(--text-muted)' }}>
                      Discrete-log security can be broken
                    </td>
                    <td style={{ padding: '13px' }}>
                      <span className="badge badge-critical">Critical</span>
                    </td>
                    <td style={{ padding: '13px', color: 'var(--cyan-primary)' }}>
                      ML-DSA / SLH-DSA
                    </td>
                  </tr>

                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '13px', color: '#ffffff', fontWeight: '600' }}>
                      DH / ECDH
                    </td>
                    <td style={{ padding: '13px', color: 'var(--magenta-accent)' }}>
                      Shor
                    </td>
                    <td style={{ padding: '13px', color: 'var(--text-muted)' }}>
                      Key exchange becomes vulnerable
                    </td>
                    <td style={{ padding: '13px' }}>
                      <span className="badge badge-critical">Critical</span>
                    </td>
                    <td style={{ padding: '13px', color: 'var(--cyan-primary)' }}>
                      ML-KEM
                    </td>
                  </tr>

                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '13px', color: '#ffffff', fontWeight: '600' }}>
                      AES-128
                    </td>
                    <td style={{ padding: '13px', color: 'var(--amber-warn)' }}>
                      Grover
                    </td>
                    <td style={{ padding: '13px', color: 'var(--text-muted)' }}>
                      Reduced effective security
                    </td>
                    <td style={{ padding: '13px' }}>
                      <span className="badge badge-high">High</span>
                    </td>
                    <td style={{ padding: '13px', color: 'var(--cyan-primary)' }}>
                      Prefer AES-256
                    </td>
                  </tr>

                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '13px', color: '#ffffff', fontWeight: '600' }}>
                      SHA-256
                    </td>
                    <td style={{ padding: '13px', color: 'var(--amber-warn)' }}>
                      Grover
                    </td>
                    <td style={{ padding: '13px', color: 'var(--text-muted)' }}>
                      Reduced pre-image resistance
                    </td>
                    <td style={{ padding: '13px' }}>
                      <span className="badge badge-medium">Medium</span>
                    </td>
                    <td style={{ padding: '13px', color: 'var(--cyan-primary)' }}>
                      Consider SHA-384 / SHA-512
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
          </div>


          {/* NIST PQC Standards */}
          <div>
            <h3 style={{
              fontSize: '1.1rem',
              color: '#ffffff',
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <BookOpen size={20} color="var(--cyan-primary)" />
              NIST Post-Quantum Cryptography Standards
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px'
            }}>

              {/* FIPS 203 */}
              <div className="glass-card" style={{ padding: '22px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <span style={{
                    fontSize: '0.78rem',
                    color: 'var(--cyan-primary)',
                    fontWeight: '700'
                  }}>
                    FIPS 203
                  </span>

                  <span className="badge badge-safe">
                    STANDARD
                  </span>
                </div>

                <h4 style={{
                  fontSize: '1.2rem',
                  color: '#ffffff',
                  margin: '0 0 8px 0'
                }}>
                  ML-KEM
                </h4>

                <p style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  lineHeight: '1.5',
                  margin: 0
                }}>
                  Module-Lattice-Based Key-Encapsulation Mechanism for
                  quantum-resistant key establishment.
                </p>
              </div>


              {/* FIPS 204 */}
              <div className="glass-card" style={{ padding: '22px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <span style={{
                    fontSize: '0.78rem',
                    color: 'var(--cyan-primary)',
                    fontWeight: '700'
                  }}>
                    FIPS 204
                  </span>

                  <span className="badge badge-safe">
                    STANDARD
                  </span>
                </div>

                <h4 style={{
                  fontSize: '1.2rem',
                  color: '#ffffff',
                  margin: '0 0 8px 0'
                }}>
                  ML-DSA
                </h4>

                <p style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  lineHeight: '1.5',
                  margin: 0
                }}>
                  Module-Lattice-Based Digital Signature Algorithm for
                  quantum-resistant digital signatures.
                </p>
              </div>


              {/* FIPS 205 */}
              <div className="glass-card" style={{ padding: '22px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <span style={{
                    fontSize: '0.78rem',
                    color: 'var(--cyan-primary)',
                    fontWeight: '700'
                  }}>
                    FIPS 205
                  </span>

                  <span className="badge badge-safe">
                    STANDARD
                  </span>
                </div>

                <h4 style={{
                  fontSize: '1.2rem',
                  color: '#ffffff',
                  margin: '0 0 8px 0'
                }}>
                  SLH-DSA
                </h4>

                <p style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  lineHeight: '1.5',
                  margin: 0
                }}>
                  Stateless Hash-Based Digital Signature Algorithm
                  providing an alternative quantum-resistant signature scheme.
                </p>
              </div>

            </div>
          </div>


          {/* Migration Summary */}
          <div
            className="glass-card"
            style={{
              padding: '22px',
              border: '1px solid rgba(0, 243, 255, 0.2)'
            }}
          >
            <h3 style={{
              fontSize: '1.05rem',
              color: 'var(--cyan-primary)',
              marginBottom: '10px'
            }}>
              🛡 PQC Migration Direction
            </h3>

            <p style={{
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              lineHeight: '1.6',
              marginBottom: '14px'
            }}>
              Systems using RSA, ECC, Diffie-Hellman, or other quantum-vulnerable
              public-key primitives should be evaluated for migration to
              standardized post-quantum algorithms.
            </p>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <span className="badge badge-critical">RSA → ML-KEM / ML-DSA</span>
              <span className="badge badge-critical">ECC → ML-DSA</span>
              <span className="badge badge-high">DH/ECDH → ML-KEM</span>
              <span className="badge badge-medium">AES-128 → AES-256</span>
            </div>
          </div>

        </div>
      )}


      {/* Finding Detail Modal */}
      {selectedFinding && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-card" style={{ maxWidth: '600px', width: '100%', padding: '28px', border: '1px solid var(--cyan-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span className="badge badge-critical">{selectedFinding.risk_level} Risk</span>
                <h3 style={{ fontSize: '1.3rem', color: '#ffffff', marginTop: '6px' }}>{selectedFinding.algorithm_name}</h3>
              </div>
              <button
                onClick={() => setSelectedFinding(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <div>
                <strong style={{ color: '#ffffff' }}>Location:</strong> {selectedFinding.file} : Line {selectedFinding.line_number}
              </div>
              <div>
                <strong style={{ color: '#ffffff' }}>Quantum Threat:</strong> {selectedFinding.quantum_threat}
              </div>
              <div>
                <strong style={{ color: '#ffffff' }}>Impact Analysis:</strong> {selectedFinding.impact}
              </div>
              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cyan-primary)' }}>
                {selectedFinding.code_snippet}
              </div>
              <div style={{ marginTop: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                <strong style={{ color: 'var(--emerald-safe)' }}>Recommended PQC Replacement:</strong>
                <p style={{ color: '#ffffff', fontWeight: '600', marginTop: '2px' }}>{selectedFinding.pqc_replacement}</p>
              </div>
            </div>

            <div style={{ marginTop: '24px', textAlign: 'right' }}>
              <button
                onClick={() => setSelectedFinding(null)}
                className="btn-primary"
              >
                Close Modal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ marginTop: '60px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-dim)', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
        Quantum Security Scanner &bull; Built for Post-Quantum Cryptography (PQC) Audit & Migration Planning &bull; Compliant with NIST FIPS 203, 204, 205
      </footer>

    </div>
  );
}
