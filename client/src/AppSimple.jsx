import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/gameboard.css';

// Simplified components
import ProfessionalHomeSimple from './components/ProfessionalHomeSimple';
import BusinessPlanSimple from './components/BusinessPlanSimple';
import SimpleGame from './components/SimpleGame';

export default function App() {
  const [currentView, setCurrentView] = useState('professional');

  // Navigation
  const goToView = (view) => setCurrentView(view);
  const goHome = () => setCurrentView('professional');

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)',
      position: 'relative',
      overflow: 'auto'
    }}>
      
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-primary">
        <div className="container">
          <span className="navbar-brand">
            <i className="fas fa-satellite me-2"></i>
            LEO Operations Center
          </span>
          
          <div className="navbar-nav ms-auto">
            <button 
              className={`btn ${currentView === 'professional' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
              onClick={() => goToView('professional')}
            >
              <i className="fas fa-home me-1"></i>
              Home
            </button>
            <button 
              className={`btn ${currentView === 'business' ? 'btn-success' : 'btn-outline-success'} me-2`}
              onClick={() => goToView('business')}
            >
              <i className="fas fa-chart-line me-1"></i>
              Business
            </button>
            <button 
              className={`btn ${currentView === 'auto-game' ? 'btn-warning' : 'btn-outline-warning'}`}
              onClick={() => goToView('auto-game')}
            >
              <i className="fas fa-play me-1"></i>
              Auto Game
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main>
        {currentView === 'professional' && <ProfessionalHomeSimple onStart={goHome} />}
        {currentView === 'business' && <BusinessPlanSimple />}
        {currentView === 'auto-game' && <SimpleGame />}
      </main>

      {/* Footer with Quick Actions */}
      <div className="position-fixed bottom-0 end-0 p-3" style={{zIndex: 1040}}>
        <div className="btn-group-vertical">
          <button 
            className="btn btn-sm btn-primary mb-2"
            onClick={() => goToView('professional')}
          >
            <i className="fas fa-home"></i>
          </button>
          <button 
            className="btn btn-sm btn-warning"
            onClick={() => goToView('auto-game')}
          >
            <i className="fas fa-gamepad"></i>
          </button>
        </div>
      </div>

    </div>
  );
}