import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { Mic, Scan, History } from 'lucide-react';

import Conversation from './pages/Conversation';
import CameraTranslation from './pages/CameraTranslation';
import DealLog from './pages/DealLog';
import LandingPage from './pages/LandingPage';

// --- Shared Navigation Component ---
export const BottomNav = () => (
  <nav style={{
    height: '75px', background: '#fff', display: 'flex', justifyContent: 'space-around', alignItems: 'center',
    borderTop: '1px solid rgba(0,0,0,0.08)', paddingBottom: 'env(safe-area-inset-bottom)',
    boxShadow: '0 -10px 30px rgba(0,0,0,0.03)', position: 'fixed', bottom: 0, left: 0, right: 0, 
    zIndex: 2000, width: '100%'
  }}>
    <NavLink to="/chat" style={({ isActive }) => ({ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textDecoration: 'none', 
      color: isActive ? '#006C35' : '#aaa', fontSize: '12px', fontWeight: isActive ? '800' : '600', transition: '0.3s'
    })}>
      <Mic size={24} /> <span>Speak</span>
    </NavLink>
    <NavLink to="/camera" style={({ isActive }) => ({ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textDecoration: 'none', 
      color: isActive ? '#006C35' : '#aaa', fontSize: '12px', fontWeight: isActive ? '800' : '600', transition: '0.3s'
    })}>
      <Scan size={24} /> <span>Scan</span>
    </NavLink>
    <NavLink to="/log" style={({ isActive }) => ({ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textDecoration: 'none', 
      color: isActive ? '#006C35' : '#aaa', fontSize: '12px', fontWeight: isActive ? '800' : '600', transition: '0.3s'
    })}>
      <History size={24} /> <span>History</span>
    </NavLink>
  </nav>
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('auth_token') === 'true');

  const handleUnlock = () => {
    localStorage.setItem('auth_token', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div style={{ minHeight: '100vh', background: '#fff' }}>
        <Routes>
          {/* LandingPage OUTSIDE the wrapper for FULL WIDTH */}
          <Route path="/login" element={isAuthenticated ? <Navigate to="/chat" replace /> : <LandingPage onUnlock={handleUnlock} />} />
          
          {/* Other App pages INSIDE the focused wrapper */}
          <Route path="/*" element={
            isAuthenticated ? (
              <div className="app-content-wrapper">
                <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', paddingBottom: '75px', height: '100vh' }}>
                  <Routes>
                    <Route path="/chat" element={<Conversation onLogout={handleLogout} />} />
                    <Route path="/camera" element={<CameraTranslation />} />
                    <Route path="/log" element={<DealLog />} />
                    <Route path="*" element={<Navigate to="/chat" replace />} />
                  </Routes>
                </main>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
