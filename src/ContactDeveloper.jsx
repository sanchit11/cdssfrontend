import React, { useState } from 'react';

export default function ContactDeveloper() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: 'Project Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Simulate API integration pipeline
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormState({ name: '', email: '', subject: 'Project Inquiry', message: '' });
      alert('Message mock-transmitted successfully to the developer console!');
    }, 2000);
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    marginTop: '6px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#fff',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.2s'
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '30px' }}>
      
      {/* DEVELOPER PROFILE CARD */}
      <div style={{ 
        backgroundColor: '#ffffff', 
        borderRadius: '12px', 
        padding: '30px 20px', 
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
        textAlign: 'center',
        border: '1px solid #e2e8f0',
        height: 'fit-content'
      }}>
        <div style={{ 
          width: '90px', 
          height: '90px', 
          backgroundColor: '#38bdf8', 
          color: '#ffffff', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justify: 'center', 
          fontSize: '32px', 
          fontWeight: 'bold',
          margin: '0 auto 20px auto',
          boxShadow: '0 4px 10px rgba(56, 189, 248, 0.3)'
        }}>
          SKA
        </div>
        
        <h2 style={{ margin: '0 0 6px 0', fontSize: '20px', color: '#0f172a', fontWeight: '700' }}>
          Sanchit Krishna Astekar
        </h2>
        <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#0ea5e9', fontWeight: '600', letterSpacing: '0.3px' }}>
          Senior Software Engineer
        </p>
        
        <hr style={{ border: 0, borderTop: '1px solid #f1f5f9', margin: '20px 0' }} />
        
        <div style={{ textAlign: 'left', fontSize: '13px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>🏢 <strong>Department:</strong> Core AI & Medical Engineering Systems</div>
          <div>📍 <strong>Location:</strong> Remote Deployment Hub</div>
          <div>💻 <strong>Stack:</strong> React.js, Node.js, Python Frameworks, LLM Agents</div>
        </div>
      </div>

      {/* CONTACT FORM */}
      <div style={{ 
        backgroundColor: '#ffffff', 
        borderRadius: '12px', 
        padding: '30px', 
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '22px', color: '#0f172a' }}>Submit System Feedback</h3>
        <p style={{ margin: '0 0 25px 0', fontSize: '14px', color: '#64748b' }}>
          Have suggestions regarding the patient triage thresholds or the report parsing OCR accuracy? Drop a message below.
        </p>

        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', gap: '15px' }}>
            <label style={{ flex: 1, fontSize: '13px', fontWeight: '600', color: '#334155' }}>
              Your Name
              <input type="text" name="name" required value={formState.name} onChange={handleInputChange} style={inputStyle} placeholder="John Doe" />
            </label>
            <label style={{ flex: 1, fontSize: '13px', fontWeight: '600', color: '#334155' }}>
              Email Address
              <input type="email" name="email" required value={formState.email} onChange={handleInputChange} style={inputStyle} placeholder="john@example.com" />
            </label>
          </div>

          <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>
            Subject
            <select name="subject" value={formState.subject} onChange={handleInputChange} style={inputStyle}>
              <option value="Project Inquiry">Project Inquiry / Collaboration</option>
              <option value="Bug Report">AI Diagnostic Bug Report</option>
              <option value="Feature Request">Feature Request / Enhancements</option>
            </select>
          </label>

          <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>
            Message Content
            <textarea name="message" rows="5" required value={formState.message} onChange={handleInputChange} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Type your observations or feature critiques here..."></textarea>
          </label>

          <button type="submit" disabled={submitted} style={{
            padding: '12px',
            backgroundColor: submitted ? '#64748b' : '#0f172a',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '15px',
            cursor: submitted ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s',
            boxShadow: '0 2px 4px rgba(15, 23, 42, 0.1)'
          }}>
            {submitted ? 'Transmitting Message...' : 'Send Message'}
          </button>
        </form>
      </div>

    </div>
  );
}