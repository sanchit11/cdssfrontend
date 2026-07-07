import React, { useState } from 'react';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5400";

export default function PatientDiagnosis() {
  const [formData, setFormData] = useState({
    age: '',
    sex: 'Male',
    history: '',
    symptoms: '',
    hr: '',
    bpSystolic: '',
    bpDiastolic: '',
    rr: '',
    temp: '',
    spo2: ''
  });

  const [aiResponse, setAiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal control state

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAiResponse(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/diagnose`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: parseInt(formData.age),
          sex: formData.sex,
          history: formData.history,
          symptoms: formData.symptoms,
          hr: parseFloat(formData.hr),
          bpSystolic: parseFloat(formData.bpSystolic),
          bpDiastolic: parseFloat(formData.bpDiastolic),
          rr: parseFloat(formData.rr),
          temp: parseFloat(formData.temp),
          spo2: parseFloat(formData.spo2),
        })
      });

      if (!response.ok) throw new Error('Network fault response from backend service hub');
      
      const data = await response.json();
      setAiResponse(data); 
      setIsModalOpen(true); // Open modal automatically upon successful data extraction
    } catch (err) {
      alert(`Error tracing diagnostics: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    marginTop: '5px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box'
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      
      {/* CRITICAL MEDICAL DISCLAIMER */}
      <div style={{
        backgroundColor: '#fff3cd',
        color: '#856404',
        border: '1px solid #ffeeba',
        padding: '15px',
        borderRadius: '5px',
        marginBottom: '20px',
        fontWeight: 'bold'
      }}>
        ⚠️ MEDICAL DISCLAIMER: This AI system is a decision-support tool meant exclusively to assist healthcare professionals. Do NOT accept AI generated responses as a 100% accurate or final medical diagnosis. The final diagnostic decision must always be made by a qualified human physician.
      </div>

      <h2>Clinical Diagnosis Support Agent</h2>
      <p style={{ color: '#666' }}>Input demographics, symptoms, and baseline vitals to run agent analysis.</p>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px', gridTemplateColumns: '1fr 1fr' }}>
        
        {/* Demographics */}
        <div style={{ gridColumn: 'span 2', background: '#f8f9fa', padding: '15px', borderRadius: '5px' }}>
          <h3>1. Patient Demographics & Context</h3>
          <div style={{ display: 'flex', gap: '15px', marginBottom: '10px' }}>
            <label style={{ flex: 1 }}>Age: 
              <input type="number" name="age" required value={formData.age} onChange={handleInputChange} style={inputStyle} />
            </label>
            <label style={{ flex: 1 }}>Biological Sex: 
              <select name="sex" value={formData.sex} onChange={handleInputChange} style={inputStyle}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </label>
          </div>
          <label style={{ display: 'block' }}>Chronic Conditions / History: 
            <input type="text" name="history" placeholder="e.g. Hypertension, Diabetes, COPD" value={formData.history} onChange={handleInputChange} style={inputStyle} />
          </label>
        </div>

        {/* Symptoms Text */}
        <div style={{ gridColumn: 'span 2', background: '#f8f9fa', padding: '15px', borderRadius: '5px' }}>
          <h3>2. Symptom Presentation</h3>
          <textarea name="symptoms" rows="3" placeholder="Type patient symptoms here..." required value={formData.symptoms} onChange={handleInputChange} style={{ ...inputStyle, resize: 'vertical' }}></textarea>
        </div>

        {/* Core Vitals */}
        <div style={{ gridColumn: 'span 2', background: '#f8f9fa', padding: '15px', borderRadius: '5px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          <h3 style={{ gridColumn: 'span 3', margin: '0 0 10px 0' }}>3. Core Vital Signs</h3>
          
          <label>Heart Rate (BPM): 
            <input type="number" name="hr" required value={formData.hr} onChange={handleInputChange} style={inputStyle} />
          </label>
          <label>BP Systolic (mmHg): 
            <input type="number" name="bpSystolic" required value={formData.bpSystolic} onChange={handleInputChange} style={inputStyle} />
          </label>
          <label>BP Diastolic (mmHg): 
            <input type="number" name="bpDiastolic" required value={formData.bpDiastolic} onChange={handleInputChange} style={inputStyle} />
          </label>
          <label>Resp Rate (breaths/m): 
            <input type="number" name="rr" required value={formData.rr} onChange={handleInputChange} style={inputStyle} />
          </label>
          <label>Temp (°C): 
            <input type="number" step="0.1" name="temp" required value={formData.temp} onChange={handleInputChange} style={inputStyle} />
          </label>
          <label>Oxygen SpO₂ (%): 
            <input type="number" name="spo2" required value={formData.spo2} onChange={handleInputChange} style={inputStyle} />
          </label>
        </div>

        <button type="submit" disabled={loading} style={{
          gridColumn: 'span 2',
          padding: '12px',
          backgroundColor: '#0056b3',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '16px'
        }}>
          {loading ? 'AI Agents Analyzing Data...' : 'Run Diagnostics Analysis'}
        </button>
      </form>

      {/* MODAL WINDOW SYSTEM */}
      {isModalOpen && aiResponse && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(15, 23, 42, 0.6)', // Dimmed viewport overlay backdrop
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            maxWidth: '650px',
            width: '90%',
            borderRadius: '12px',
            padding: '25px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: `2px solid ${aiResponse.color}`,
            position: 'relative',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            
            {/* Close Cross Button */}
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '20px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#64748b'
              }}
            >
              &times;
            </button>

            <h3 style={{ color: aiResponse.color, margin: '0 0 15px 0', fontSize: '20px' }}>
              AI Agent Diagnostic Summary
            </h3>
            
            <div style={{ display: 'inline-block', backgroundColor: aiResponse.color, color: '#fff', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', marginBottom: '15px' }}>
              STATUS: {aiResponse.status}
            </div>

            <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#1e293b', marginBottom: '20px' }}>
              <strong>Primary Assessment:</strong> {aiResponse.analysis}
            </p>

            <h4 style={{ margin: '0 0 10px 0', color: '#334155' }}>Suggested Next Steps for Clinician:</h4>
            <ul style={{ margin: 0, paddingLeft: '2px', color: '#475569', lineHeight: '1.5' }}>
              {aiResponse.suggestions.map((item, index) => (
                <li key={index} style={{ marginBottom: '6px' }}>{item}</li>
              ))}
            </ul>

            <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{
                  padding: '8px 20px',
                  backgroundColor: '#0f172a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}