"""
FastAPI Server Entry Point for Quantum Security Scanner.
Exposes REST endpoints for scanning code snippets, uploading source files,
evaluating live website HTTPS/SSL security, and retrieving PQC threat intelligence.
"""

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from typing import Optional, List, Dict, Any

from scanner.crypto_detector import CryptoDetector
from scanner.web_scanner import WebScanner
from quantum.risk_engine import QuantumRiskEngine
from quantum.quantum_knowledge import QUANTUM_THREAT_MATRIX, NIST_PQC_STANDARDS, Y2Q_TIMELINE
from migration.advisor import MigrationAdvisor

app = FastAPI(
    title="Quantum Security Scanner API",
    description="Post-Quantum Cryptography (PQC) Code & Web Audit Engine",
    version="1.0.0"
)

# Enable CORS for Frontend React integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Core Services
detector = CryptoDetector()
web_scanner = WebScanner()
risk_engine = QuantumRiskEngine()
advisor = MigrationAdvisor()

class CodeScanRequest(BaseModel):
    code: str
    filename: Optional[str] = "snippet.py"

class WebsiteScanRequest(BaseModel):
    url: str

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Quantum Security Scanner API",
        "version": "1.0.0",
        "docs_url": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "quantum-security-scanner"}

@app.post("/api/scan/code")
def scan_code(payload: CodeScanRequest):
    """
    Scans a raw code snippet for classical vs quantum-safe crypto primitives.
    """
    if not payload.code or not payload.code.strip():
        raise HTTPException(status_code=400, detail="Code payload cannot be empty.")

    scan_res = detector.scan_code(payload.code, payload.filename)
    findings = scan_res["findings"]

    risk_metrics = risk_engine.evaluate_risk(findings)
    recommendations = advisor.generate_recommendations(findings)

    return {
        "target": payload.filename,
        "type": "code",
        "total_lines": scan_res["total_lines"],
        "findings_count": scan_res["findings_count"],
        "risk_metrics": risk_metrics,
        "findings": findings,
        "recommendations": recommendations
    }

@app.post("/api/scan/file")
async def scan_file(file: UploadFile = File(...)):
    """
    Scans an uploaded source code file (.py, .js, .java, .c, .go, etc.).
    """
    contents = await file.read()
    try:
        code_text = contents.decode("utf-8")
    except UnicodeDecodeError:
        code_text = contents.decode("latin-1", errors="ignore")

    scan_res = detector.scan_code(code_text, file.filename)
    findings = scan_res["findings"]

    risk_metrics = risk_engine.evaluate_risk(findings)
    recommendations = advisor.generate_recommendations(findings)

    return {
        "target": file.filename,
        "type": "file",
        "total_lines": scan_res["total_lines"],
        "findings_count": scan_res["findings_count"],
        "risk_metrics": risk_metrics,
        "findings": findings,
        "recommendations": recommendations
    }

@app.post("/api/scan/website")
def scan_website(payload: WebsiteScanRequest):
    """
    Scans a live HTTPS domain or URL for SSL/TLS certificate quantum vulnerabilities.
    """
    if not payload.url or not payload.url.strip():
        raise HTTPException(status_code=400, detail="URL cannot be empty.")

    web_res = web_scanner.scan_website(payload.url)
    findings = web_res["findings"]

    risk_metrics = risk_engine.evaluate_risk(findings)
    recommendations = advisor.generate_recommendations(findings)

    return {
        "target": web_res["hostname"],
        "target_url": web_res["target_url"],
        "type": "website",
        "ssl_info": web_res.get("ssl_info", {}),
        "headers_info": web_res.get("headers_info", {}),
        "findings_count": web_res["findings_count"],
        "risk_metrics": risk_metrics,
        "findings": findings,
        "recommendations": recommendations
    }

@app.get("/api/quantum-threats")
def get_quantum_threats():
    """
    Returns threat matrix, NIST FIPS PQC standards, and Y2Q timeline info.
    """
    return {
        "threat_matrix": QUANTUM_THREAT_MATRIX,
        "nist_pqc_standards": NIST_PQC_STANDARDS,
        "y2q_timeline": Y2Q_TIMELINE
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
