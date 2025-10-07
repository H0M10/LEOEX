import LEOExchangeDashboard from './components/LEOExchangeDashboard';
import React, { useState } from 'react';
import './styles/dark-theme.css';
import ProfessionalHomeSimple from './components/ProfessionalHomeSimple';
import Home from './components/Home';
import SimpleGame from './components/SimpleGame';
import InstantGame from './components/InstantGame';
import MissionGame from './components/MissionGame';
import SectorGuide from './components/SectorGuide';
import Marketplace from './components/Marketplace';
import SatelliteTracker3D from './components/SatelliteTracker3D';
import Dashboard from './components/Dashboard';
import SatelliteAnalytics from './components/SatelliteAnalytics';

import ProfessionalSatelliteAnalytics from './components/ProfessionalSatelliteAnalytics';
import SpaceTourism from './components/SpaceTourism';
import GeminiChatbot from './components/GeminiChatbot';

export default function App(){
  const [game, setGame] = useState(null);
  const [currentView, setCurrentView] = useState('professional-home');
  const [showSimpleGame, setShowSimpleGame] = useState(false);

  // Parse view from hash or query
  const parseViewFromLocation = () => {
    try {
      // Prefer hash-based routes (e.g. #/game)
      const hash = window.location.hash || '';
      if (hash.startsWith('#/')) {
        const route = hash.slice(2); // remove '#/'
        if (route === 'game' || route === 'mission-game') {
          setShowSimpleGame(true);
          return 'mission-game';
        }
        // known views pass-through
        return route || 'professional-home';
      }
      // Fallback to query param
      const params = new URLSearchParams(window.location.search);
      const view = params.get('view') || 'professional-home';
      return view;
    } catch {
      return 'professional-home';
    }
  };

  // Initialize from URL param if present and handle browser navigation
  React.useEffect(() => {
    const view = parseViewFromLocation();
    if (view !== currentView) {
      setCurrentView(view);
    }
  }, []);

  // Handle browser back/forward buttons
  React.useEffect(() => {
    const handlePopState = () => {
      const view = parseViewFromLocation();
      if (view === 'mission-game') {
        setShowSimpleGame(true);
      } else {
        setShowSimpleGame(false);
      }
      setCurrentView(view);
    };

    const handleHashChange = () => {
      handlePopState();
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Navigation handler - manages internal navigation 
  const handleNavigation = (view, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Update hash for easier deep-linking on GitHub Pages
    window.location.hash = `/${view}`;
    setCurrentView(view);
    // Update URL and add to browser history for proper back navigation
    window.history.pushState({view}, '', window.location.pathname + `?view=${view}`);
    if (view === 'mission-game' || view === 'game') {
      setShowSimpleGame(true);
    } else {
      setShowSimpleGame(false);
    }
  };

  // Back to home handler
  const handleBack = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentView('professional-home');
    setShowSimpleGame(false);
    window.location.hash = `/professional-home`;
    // Update URL and add to browser history
    window.history.pushState({view: 'professional-home'}, '', window.location.pathname + '?view=professional-home');
  };

  // Mostrar MissionGame si el hash es #/game o #/mission-game
  if (window.location.hash === '#/game' || window.location.hash === '#/mission-game' || showSimpleGame) {
    return <MissionGame onExit={() => {
      setShowSimpleGame(false);
      setCurrentView('professional-home');
      window.location.hash = '/professional-home';
    }} />;
  }

  // View rendering logic
  if (currentView === 'classic-home') {
    return (
      <div>
        <div className="position-fixed top-0 end-0 p-3" style={{zIndex: 1050}}>
          <button 
            className="btn btn-outline-light"
            onClick={(e) => handleNavigation('professional-home', e)}
          >
            <i className="fas fa-arrow-left me-2"></i>
            Professional View
          </button>
        </div>
        <Home onStart={(g)=>setGame(g)} />
      </div>
    );
  }

  if (currentView === 'sectors') {
    return <SectorGuide onBack={handleBack} />;
  }

  if (currentView === 'marketplace') {
    return <Marketplace onBack={handleBack} />;
  }

  if (currentView === '3d-tracker') {
    return <SatelliteTracker3D onBack={handleBack} />;
  }

  if (currentView === 'dashboard') {
    return <Dashboard onBack={handleBack} />;
  }


  if (currentView === 'analytics') {
    return <ProfessionalSatelliteAnalytics onBack={handleBack} />;
  }

  if (currentView === 'spaceTourism') {
    return <SpaceTourism />;
  }

  if (currentView === 'spaceTourismGallery') {
    return <SpaceTourism />;
  }
  if (currentView === 'leo-exchange') {
    return <LEOExchangeDashboard onBack={handleBack} />;
  }

  if (game) {
    return (
      <MissionGame onExit={() => {
        setGame(null);
        setCurrentView('professional-home');
      }} />
    );
  }

  // Professional home view with navigation
  return (
    <div className="min-vh-100 dark-theme" style={{
      background: 'linear-gradient(135deg, #0f1419 0%, #1a1f3a 50%, #2d1b69 100%)'
    }}>
      {/* Professional Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark" style={{background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)'}}>
        <div className="container-fluid">
          <a className="navbar-brand d-flex align-items-center" href="#" onClick={(e) => {
            e.preventDefault();
            handleNavigation('professional-home', e);
          }}>
            <i className="fas fa-satellite me-2"></i>
            <span>LEO Decisions</span>
            <span className="badge bg-primary ms-2">Professional</span>
          </a>
          
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">

              <li className="nav-item">
                <button 
                  className={`nav-link btn btn-link ${currentView === '3d-tracker' ? 'text-primary fw-bold' : 'text-light'}`}
                  onClick={(e) => handleNavigation('3d-tracker', e)}
                >
                  <i className="fas fa-globe me-1"></i>3D Tracker
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link btn btn-link ${currentView === 'dashboard' ? 'text-primary fw-bold' : 'text-light'}`}
                  onClick={(e) => handleNavigation('dashboard', e)}
                >
                  <i className="fas fa-chart-line me-1"></i>Dashboard
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link btn btn-link ${currentView === 'analytics' ? 'text-primary fw-bold' : 'text-light'}`}
                  onClick={(e) => handleNavigation('analytics', e)}
                >
                  <i className="fas fa-satellite-dish me-1"></i>LEO Analytics
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link btn btn-link ${currentView === 'sectors' ? 'text-primary fw-bold' : 'text-light'}`}
                  onClick={(e) => handleNavigation('sectors', e)}
                >
                  <i className="fas fa-industry me-1"></i>Industry Guide
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link btn btn-link ${currentView === 'leo-exchange' ? 'text-primary fw-bold' : 'text-light'}`}
                  onClick={(e) => handleNavigation('leo-exchange', e)}
                >
                  <i className="fas fa-exchange-alt me-1"></i>LEO Exchange
                </button>
              </li>
            </ul>
            
            <div className="d-flex align-items-center">

              <button 
                className="btn btn-outline-light btn-sm me-3"
                onClick={(e) => handleNavigation('classic-home', e)}
              >
                <i className="fas fa-gamepad me-1"></i>
                Classic View
              </button>
              <span className="navbar-text">
                <i className="fas fa-trophy me-1 text-warning"></i>
                NASA Space Apps 2024
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Professional Home Content */}
      <ProfessionalHomeSimple onStart={(g)=>setGame(g)} onNavigate={handleNavigation} />
      
      {/* Professional Quick Access Panel */}
      <div className="container-fluid position-fixed bottom-0 start-0 end-0 p-3" style={{background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 1040}}>
        <div className="row">
          <div className="col-md-2">
            <button
              className={`btn w-100 btn-sm ${currentView === '3d-tracker' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={(e) => handleNavigation('3d-tracker', e)}
            >
              <i className="fas fa-globe me-1"></i>
              3D Tracker
            </button>
          </div>
          <div className="col-md-2">
            <button
              className={`btn w-100 btn-sm ${currentView === 'dashboard' ? 'btn-success' : 'btn-outline-success'}`}
              onClick={(e) => handleNavigation('dashboard', e)}
            >
              <i className="fas fa-chart-line me-1"></i>
              Live Dashboard
            </button>
          </div>
          <div className="col-md-2">
            <button
              className={`btn w-100 btn-sm ${currentView === 'analytics' ? 'btn-info' : 'btn-outline-info'}`}
              onClick={(e) => handleNavigation('analytics', e)}
            >
              <i className="fas fa-satellite-dish me-1"></i>
              LEO Analytics
            </button>
          </div>
          <div className="col-md-2">
            <button
              className={`btn w-100 btn-sm ${currentView === 'sectors' ? 'btn-warning' : 'btn-outline-warning'}`}
              onClick={(e) => handleNavigation('sectors', e)}
            >
              <i className="fas fa-industry me-1"></i>
              Industry Guide
            </button>
          </div>
          <div className="col-md-2">
            <button
              className={`btn w-100 btn-sm ${currentView === 'leo-exchange' ? 'btn-light text-dark' : 'btn-outline-light'}`}
              onClick={(e) => handleNavigation('leo-exchange', e)}
            >
              <i className="fas fa-exchange-alt me-1"></i>
              LEO Exchange
            </button>
          </div>

        </div>
      </div>
      
      {/* Chatbot disponible en todas las vistas */}
      <GeminiChatbot />
    </div>
  );
}