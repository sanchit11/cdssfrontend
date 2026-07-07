import React, { useState, useRef } from 'react';

export default function BloodReportAnalyzer() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

const handleAnalyze = async () => {
  // 1. Guard clause: Ensure a file actually exists before sending the network request
  if (!file) {
    alert("Please upload or drop a valid lab report file first.");
    return;
  }

  // 2. Adjust UI States: Set analyzing to true to activate button spinners, and clear old data
  setAnalyzing(true);
  setAnalysisResult(null);

  // 3. Assemble Multipart Payload wrapper
  const formData = new FormData();
  formData.append("file", file); // Key must exactly match your FastAPI parameter 'file: UploadFile = File(...)'

  try {
    // 4. Dispatch asynchronous HTTP POST request to the custom blood analysis route
    const response = await fetch('http://localhost:5400/api/analyze-blood-report', {
      method: 'POST',
      body: formData
      // CRITICAL NOTE: Do NOT add a 'Content-Type': 'application/json' header here. 
      // Leaving the header blank allows the browser to automatically compute 
      // and inject the correct 'multipart/form-data' boundary strings.
    });

    // 5. Verify HTTP Status Codes (e.g., handles 400, 500, 502 errors gracefully)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: "Unknown server error" }));
      throw new Error(errorData.detail || `Server returned bad status: ${response.status}`);
    }

    // 6. Decode the backend's verified Pydantic response JSON string mapping
    const data = await response.json();

    // 7. Update the local view hook state to auto-render your biomarker data grid and executive summary
    setAnalysisResult(data);

  } catch (err) {
    // 8. Capture runtime network issues, parsing faults, or server downtime events safely
    console.error("Lab Report Analysis failure:", err);
    alert(`Analysis Failed: ${err.message}`);
  } finally {
    // 9. Always restore analyzing flag to false, allowing subsequent file uploads if needed
    setAnalyzing(false);
  }
};

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      
      {/* HEADER SECTION */}
      <div style={{ marginBottom: '30px', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px' }}>
        <h2 style={{ color: '#0f172a', margin: '0 0 5px 0', fontSize: '26px', fontWeight: '700' }}>
          🩸 Blood Report Lab Analyzer
        </h2>
        <p style={{ color: '#64748b', margin: 0, fontSize: '15px' }}>
          Upload patient hematology or metabolic panel documents (PDF/JPG) to map biomarker deviations via Ollama.
        </p>
      </div>

      {/* FILE UPLOAD DRAG ZONE */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
        style={{
          border: isDragging ? '2px dashed #0ea5e9' : '2px dashed #cbd5e1',
          backgroundColor: isDragging ? '#f0f9ff' : '#ffffff',
          borderRadius: '12px',
          padding: '40px 20px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          accept=".pdf, .jpg, .jpeg, .png" 
          style={{ display: 'none' }} 
        />
        <div style={{ fontSize: '44px', marginBottom: '12px' }}>📊</div>
        <p style={{ fontWeight: '600', color: '#334155', margin: '0 0 4px 0' }}>
          {file ? `Selected: ${file.name}` : 'Drop the blood report file here or click to browse'}
        </p>
        <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Accepts lab network outputs, image exports, or PDF summaries</p>
      </div>

      {/* ACTION BUTTON */}
      {file && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <button 
            onClick={handleAnalyze}
            disabled={analyzing}
            style={{
              padding: '12px 30px',
              backgroundColor: '#0ea5e9',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '15px',
              cursor: analyzing ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 6px -1px rgba(14, 165, 233, 0.2)',
              transition: 'background-color 0.2s'
            }}
          >
            {analyzing ? 'Extracting & Parsing Biomarkers...' : 'Commence AI Lab Analysis'}
          </button>
        </div>
      )}

      {/* ANALYSIS RESULTS CARD */}
      {analysisResult && (
        <div style={{ marginTop: '35px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          
          {/* Metadata Bar */}
          <div style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '500' }}>
            <span>👤 Patient: <strong style={{ color: '#38bdf8' }}>{analysisResult.patientName}</strong></span>
            <span>🏢 Lab: {analysisResult.laboratory}</span>
            <span>📅 Date: {analysisResult.reportDate}</span>
          </div>

          {/* Table Content */}
          <div style={{ padding: '20px' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#334155', fontWeight: '600' }}>Extracted Panels & Target Biomarkers</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9', textAlign: 'left' }}>
                  <th style={{ padding: '10px', color: '#64748b', fontSize: '13px' }}>Biomarker Test</th>
                  <th style={{ padding: '10px', color: '#64748b', fontSize: '13px' }}>Extracted Level</th>
                  <th style={{ padding: '10px', color: '#64748b', fontSize: '13px' }}>Reference Range</th>
                  <th style={{ padding: '10px', color: '#64748b', fontSize: '13px', textAlign: 'center' }}>Status Flag</th>
                </tr>
              </thead>
              <tbody>
                {analysisResult.findings.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 10px', fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>{row.test}</td>
                    <td style={{ padding: '12px 10px', fontSize: '14px', color: '#0f172a' }}>{row.value}</td>
                    <td style={{ padding: '12px 10px', fontSize: '14px', color: '#64748b' }}>{row.range}</td>
                    <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                      <span style={{ 
                        backgroundColor: row.severity || '#28a745', 
                        color: '#ffffff', 
                        padding: '3px 8px', 
                        borderRadius: '4px', 
                        fontSize: '11px', 
                        fontWeight: '700' 
                      }}>
                        {row.flag}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CLINICAL SUMMARY PANEL */}
          <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderTop: '1px solid #e2e8f0' }}>
            <h4 style={{ margin: '0 0 6px 0', color: '#0f172a', fontSize: '15px', fontWeight: '700' }}>
              🧠 Clinical Diagnostic Conclusion
            </h4>
            <p style={{ margin: 0, fontSize: '14px', color: '#334155', lineHeight: '1.6' }}>
              {analysisResult.aiSummary}
            </p>
          </div>

        </div>
      )}

    </div>
  );
}