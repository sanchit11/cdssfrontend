import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PatientDiagnosis from './PatientDiagnosis';
import ReportScanner from './ReportScanner';
import ContactDeveloper from './ContactDeveloper'; // Integrated actual profile page
import BloodReportAnalyzer from './BloodReportAnalyzer'; // Integrated actual profile page

export default function App() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const menuItems = [
    { path: "/", label: "Patient Diagnosis (Clinician Tool)" },
    { path: "/scan", label: "Patient Scan Upload" },
    { path: "/blood-report", label: "Blood Report Analyzer" },
    { path: "/contact", label: "Contact Developer" }
  ];

  const getLinkStyle = (index) => ({
    color: hoveredIndex === index ? '#ffffff' : '#cbd5e1',
    backgroundColor: hoveredIndex === index ? '#334155' : 'transparent',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '14px',
    padding: '8px 16px',
    borderRadius: '6px',
    transition: 'all 0.2s ease-in-out',
    display: 'inline-block'
  });

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        
        <header style={{ 
          backgroundColor: '#0f172a', 
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          color: '#fff', 
          padding: '12px 40px', 
          display: 'flex', 
          justify: 'space-between', 
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 1000
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>🩺</span>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#f8fafc' }}>
              MedAI <span style={{ color: '#38bdf8', fontWeight: '400' }}>Study Hub</span>
            </h1>
          </div>
          
          <nav>
            <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0, gap: '8px' }}>
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.path} 
                    style={getLinkStyle(index)}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <main style={{ flex: 1, padding: '40px 20px', backgroundColor: '#f8fafc' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <Routes>
              <Route path="/" element={<PatientDiagnosis />} />
              <Route path="/blood-report" element={<BloodReportAnalyzer />} />
              <Route path="/scan" element={<ReportScanner />} />
              <Route path="/contact" element={<ContactDeveloper />} />
            </Routes>
          </div>
        </main>

        <footer style={{ backgroundColor: '#0f172a', color: '#64748b', textAlign: 'center', padding: '20px', fontSize: '13px', borderTop: '1px solid #1e293b' }}>
          <p style={{ margin: 0 }}>© 2026 Medical-AI Prototype. Designed for Clinical Decision Support Training.</p>
        </footer>

      </div>
    </Router>
  );
}