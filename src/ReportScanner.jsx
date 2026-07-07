import React, { useState, useRef } from 'react';

export default function ReportScanner() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const fileInputRef = useRef(null);

  // Handle Drag Events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (selectedFile) => {
    if (!selectedFile) return;

    // Check file types (PDF, JPEG, PNG)
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(selectedFile.type)) {
      alert('Unsupported file format. Please upload a PDF, JPEG, or PNG.');
      return;
    }

    setFile(selectedFile);

    // Create thumbnail preview if it's an image
    if (selectedFile.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setPreviewUrl(null); // PDF placeholder icon used instead
    }
    setExtractedData(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const selectedFile = e.dataTransfer.files[0];
    processFile(selectedFile);
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    processFile(selectedFile);
  };

  // Simulate Agentic OCR & Medical Parser Pipeline
const handleAnalyzeReport = async () => {
  if (!file) return;
  setParsing(true);
  setExtractedData(null);

  // Initialize browser standard FormData multipart transport wrapper
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch('http://localhost:5400/api/scan', {
      method: 'POST',
      body: formData // Content-Type header left blank purposefully so browser auto-injects boundary parameters
    });

    if (!response.ok) throw new Error('Fault response from backend file scanner hub');

    const data = await response.json();
    setExtractedData(data); // Populates your data table instantly with structured markers
  } catch (err) {
    alert(`File parsing exception: ${err.message}`);
  } finally {
    setParsing(false);
  }
};

  // Styles
  const zoneStyle = {
    border: isDragging ? '2px dashed #0056b3' : '2px dashed #cbd5e1',
    backgroundColor: isDragging ? '#eff6ff' : '#ffffff',
    borderRadius: '8px',
    padding: '40px 20px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2>Health Report & Lab Scan OCR Analyzer</h2>
      <p style={{ color: '#666' }}>Upload patient scans (PDF, JPEG, PNG) to extract structured clinical data via AI.</p>

      {/* DRAG AND DROP ZONE */}
      <div 
        style={zoneStyle}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          accept=".pdf, .jpg, .jpeg, .png" 
          style={{ display: 'none' }} 
        />
        
        <div style={{ fontSize: '40px', marginBottom: '10px' }}>📄</div>
        <p style={{ fontWeight: '500', margin: '0 0 5px 0' }}>
          Drag & Drop your document here, or <span style={{ color: '#0056b3' }}>browse</span>
        </p>
        <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Supports PDF, JPEG, and PNG formats up to 25MB</p>
      </div>

      {/* SELECTED FILE DISPLAY */}
      {file && (
        <div style={{ marginTop: '20px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {previewUrl ? (
              <img src={previewUrl} alt="Thumbnail" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
            ) : (
              <div style={{ width: '50px', height: '50px', backgroundColor: '#e2e8f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '11px', color: '#475569' }}>PDF</div>
            )}
            <div>
              <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', fontSize: '14px', color: '#1e293b' }}>{file.name}</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          </div>
          <button 
            onClick={handleAnalyzeReport} 
            disabled={parsing} 
            style={{ padding: '10px 20px', backgroundColor: '#0f766e', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {parsing ? 'Parsing Document pixels...' : 'Extract Data'}
          </button>
        </div>
      )}

      {/* EXTRACTED METADATA & RESULTS */}
      {extractedData && (
        <div style={{ marginTop: '30px', animation: 'fadeIn 0.3s ease' }}>
          <div style={{ backgroundColor: '#1e293b', color: '#fff', padding: '15px', borderRadius: '6px 6px 0 0', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
            <span><strong>Patient:</strong> {extractedData.patientName}</span>
            <span><strong>Lab Source:</strong> {extractedData.laboratory}</span>
            <span><strong>Date Extracted:</strong> {extractedData.reportDate}</span>
          </div>
          
          {/* Data Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', border: '1px solid #e2e8f0' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                <th style={tableHeaderStyle}>Biomarker Test Name</th>
                <th style={tableHeaderStyle}>Extracted Value</th>
                <th style={tableHeaderStyle}>Standard Reference Range</th>
                <th style={tableHeaderStyle}>Triage Flag</th>
              </tr>
            </thead>
            <tbody>
              {extractedData.findings.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={tableCellStyle}><strong>{row.test}</strong></td>
                  <td style={tableCellStyle}>{row.value}</td>
                  <td style={tableCellStyle} style={{ color: '#64748b', padding: '12px 15px' }}>{row.range}</td>
                  <td style={tableCellStyle}>
                    <span style={{ backgroundColor: row.severity, color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                      {row.flag}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* AI Clinical Insight Breakdown */}
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '15px', borderRadius: '0 0 6px 6px', marginTop: '-1px' }}>
            <h4 style={{ margin: '0 0 5px 0', color: '#166534' }}>💡 Structured AI Insights</h4>
            <p style={{ margin: 0, fontSize: '14px', color: '#1f2937', lineHeight: '1.5' }}>{extractedData.aiSummary}</p>
          </div>
        </div>
      )}
    </div>
  );
}

const tableHeaderStyle = {
  padding: '12px 15px',
  fontSize: '13px',
  color: '#475569',
  fontWeight: '600'
};

const tableCellStyle = {
  padding: '12px 15px',
  fontSize: '14px',
  color: '#334155'
};