import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RealStatsService from '../services/RealStatsService';

export default function Home({ onStart }) {
  const [showTutorial, setShowTutorial] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [liveStats, setLiveStats] = useState({
    activeSatellites: null,
    debrisTracked: null,
    dailyLaunches: null,
    conjunctions: null
  });
  const [statsError, setStatsError] = useState(null);
  const [statsService] = useState(() => new RealStatsService());

  // Cargar datos reales de satélites
  const loadLiveStats = async () => {
    try {
      const stats = await statsService.getRealSatelliteStats();

      if (stats.error || stats.dataQuality === 'error') {
        throw new Error(stats.error || 'No se pudieron obtener datos reales de satélites');
      }

      return {
        activeSatellites: stats.activeSatellites,
        debrisTracked: stats.debrisTracked,
        dailyLaunches: stats.dailyLaunches,
        conjunctions: stats.conjunctions
      };
    } catch (error) {
      console.error('Error loading live stats:', error);
      throw error;
    }
  };

  useEffect(() => {
    const loadInitialStats = async () => {
      try {
        const stats = await loadLiveStats();
        setLiveStats(stats);
        setStatsError(null);
      } catch (error) {
        console.error('Error loading initial stats:', error);
        setStatsError(error.message);
      }
    };

    loadInitialStats();

    // Actualizar datos cada 30 segundos
    const interval = setInterval(async () => {
      try {
        const stats = await loadLiveStats();
        setLiveStats(stats);
        setStatsError(null); // Limpiar error si se recupera
      } catch (error) {
        console.error('Error updating live stats:', error);
        // No mostrar error en actualización automática
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);  const [showSetup, setShowSetup] = useState(false);
  const start = async ({ profile, budget, satellites }) => {
    setLoading(true);
    try {
      const base = import.meta.env.VITE_API_BASE || 'http://localhost:9002';
      console.log('🔗 API Base URL:', base);
      console.log('🚀 Attempting to start game with', { profile, budget, satellites });
      const resp = await axios.post(`${base}/api/game/start`, { scenario: profile, budget, satellitesCount: satellites });
      onStart(resp.data);
    } catch (error) {
      console.error('Error starting game:', error);
      let errorMessage = 'Error starting game';
      if (error.response) {
        errorMessage = `Server Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`;
      } else if (error.request) {
        errorMessage = 'Network Error: Cannot connect to game server. Please check if the backend is running.';
      } else {
        errorMessage = `Error: ${error.message}`;
      }
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100" style={{
      background: 'linear-gradient(135deg, #0f1419 0%, #1a1f3a 50%, #2d1b69 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {showTutorial && <Tutorial onClose={() => setShowTutorial(false)} />}
      
      {/* Animated Background Elements */}
      <div className="position-absolute w-100 h-100">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="position-absolute bg-white"
            style={{
              width: '2px',
              height: '2px',
              borderRadius: '50%',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.3
            }}
            animate={{
              scale: [0.5, 1, 0.5],
              opacity: [0.2, 0.8, 0.2]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <div className="container-fluid position-relative">
        {/* Header with Live Status */}
        <motion.div 
          className="row pt-4 pb-2"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-primary mb-0">NASA Space Apps Challenge 2024</h6>
                <small className="text-muted">LEO Commercialization Track</small>
              </div>
              <div className="text-end">
                <div className="badge bg-success px-3 py-2">
                  <i className="fas fa-circle me-2"></i>
                  LIVE TRACKING - {currentTime.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Hero Section */}
        <motion.div 
          className="row justify-content-center py-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="col-lg-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h1 className="display-2 text-white mb-4" style={{fontWeight: 300}}>
                <i className="fas fa-satellite me-3 text-primary"></i>
                LEO Decisions
              </h1>
              
              <p className="lead text-light mb-4" style={{fontSize: '1.4rem', maxWidth: '800px', margin: '0 auto'}}>
                Professional-grade LEO commercialization simulator for space industry professionals, 
                regulatory bodies, and next-generation operators entering the Low Earth Orbit economy.
              </p>
            </motion.div>

            {/* Live Statistics Bar */}
            <motion.div 
              className="row mb-4"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="col-md-3">
                <div className="p-3 rounded" style={{background: 'rgba(25, 135, 84, 0.2)', border: '1px solid rgba(25, 135, 84, 0.3)'}}>
                  <h3 className="text-success mb-1">{liveStats.activeSatellites?.toLocaleString() || 'N/A'}</h3>
                  <small className="text-light">Active Satellites</small>
                  <div className="mt-1">
                    <small className="text-success">
                      <i className="fas fa-arrow-up me-1"></i>+12 today
                    </small>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="p-3 rounded" style={{background: 'rgba(220, 53, 69, 0.2)', border: '1px solid rgba(220, 53, 69, 0.3)'}}>
                  <h3 className="text-danger mb-1">{liveStats.debrisTracked?.toLocaleString() || 'N/A'}</h3>
                  <small className="text-light">Tracked Debris</small>
                  <div className="mt-1">
                    <small className="text-danger">
                      <i className="fas fa-exclamation-triangle me-1"></i>High Risk
                    </small>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="p-3 rounded" style={{background: 'rgba(13, 202, 240, 0.2)', border: '1px solid rgba(13, 202, 240, 0.3)'}}>
                  <h3 className="text-info mb-1">{liveStats.dailyLaunches || 'N/A'}</h3>
                  <small className="text-light">Launches Today</small>
                  <div className="mt-1">
                    <small className="text-info">
                      <i className="fas fa-rocket me-1"></i>All Nominal
                    </small>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="p-3 rounded" style={{background: 'rgba(255, 193, 7, 0.2)', border: '1px solid rgba(255, 193, 7, 0.3)'}}>
                  <h3 className="text-warning mb-1">{liveStats.conjunctions}</h3>
                  <small className="text-light">Close Approaches</small>
                  <div className="mt-1">
                    <small className="text-warning">
                      <i className="fas fa-crosshairs me-1"></i>Monitoring
                    </small>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Simulation Scenarios */}
            <motion.div
              className="row mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <div className="col-12">
                <h3 className="text-primary mb-4">Select Your Mission Profile</h3>
              </div>
              
              <div className="col-md-4 mb-4">
                <motion.div 
                  className="card bg-dark text-white h-100 border-primary"
                  whileHover={{ scale: 1.05, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="card-body text-center p-4">
                    <i className="fas fa-satellite fa-3x text-primary mb-3"></i>
                    <h4 className="text-primary">Satellite Operator</h4>
                    <p className="text-light mb-3">
                      Manage a constellation of 4 satellites. Make critical decisions about 
                      deorbiting, collision avoidance, and regulatory compliance.
                    </p>
                    <div className="mb-3">
                      <span className="badge bg-secondary me-2">$50,000 Budget</span>
                      <span className="badge bg-secondary">4 Satellites</span>
                    </div>
                    <button 
                      className="btn btn-primary w-100"
                      onClick={() => setShowSetup(true)}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Initializing...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-rocket me-2"></i>
                          Launch Mission
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              </div>

              <div className="col-md-4 mb-4">
                <motion.div 
                  className="card bg-dark text-white h-100 border-success"
                  whileHover={{ scale: 1.05, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="card-body text-center p-4">
                    <i className="fas fa-home fa-3x text-success mb-3"></i>
                    <h4 className="text-success">Real Estate Monitor</h4>
                    <p className="text-light mb-3">
                      Monitor agricultural land using satellite NDVI data. 
                      Track deforestation impact on property values and investment decisions.
                    </p>
                    <div className="mb-3">
                      <span className="badge bg-secondary me-2">NDVI Analysis</span>
                      <span className="badge bg-secondary">Economic Impact</span>
                    </div>
                    <button 
                      className="btn btn-success w-100"
                      onClick={() => setShowSetup(true)}
                      disabled={loading}
                    >
                      <i className="fas fa-chart-area me-2"></i>
                      Start Monitoring
                    </button>
                  </div>
                </motion.div>
              </div>

              <div className="col-md-4 mb-4">
                <motion.div 
                  className="card bg-dark text-white h-100 border-warning"
                  whileHover={{ scale: 1.05, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="card-body text-center p-4">
                    <i className="fas fa-tree fa-3x text-warning mb-3"></i>
                    <h4 className="text-warning">Environmental NGO</h4>
                    <p className="text-light mb-3">
                      Protect Amazon rainforest using satellite monitoring. 
                      Prevent illegal deforestation with limited budget but maximum impact.
                    </p>
                    <div className="mb-3">
                      <span className="badge bg-secondary me-2">$30,000 Budget</span>
                      <span className="badge bg-secondary">Environmental Focus</span>
                    </div>
                    <button 
                      className="btn btn-warning w-100"
                      onClick={() => setShowSetup(true)}
                      disabled={loading}
                    >
                      <i className="fas fa-leaf me-2"></i>
                      Save the Forest
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="row justify-content-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <div className="col-auto">
                <button 
                  className="btn btn-outline-light btn-lg px-4 py-3 me-3"
                  onClick={() => setShowTutorial(true)}
                  style={{
                    borderRadius: '10px'
                  }}
                >
                  <i className="fas fa-book me-2"></i>
                  Mission Briefing
                </button>

                <button 
                  className="btn btn-outline-info btn-lg px-4 py-3"
                  onClick={() => window.open('https://www.spaceappschallenge.org/2025/challenges/commercializing-low-earth-orbit-leo/', '_blank')}
                  style={{
                    borderRadius: '10px'
                  }}
                >
                  <i className="fas fa-external-link-alt me-2"></i>
                  NASA Challenge
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom Features Bar */}
        <motion.div 
          className="row py-4 border-top border-secondary mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="col-md-3 text-center">
            <i className="fas fa-satellite-dish text-primary fa-2x mb-2"></i>
            <h6 className="text-light">Real-time Data</h6>
            <small className="text-muted">Live satellite telemetry & orbital predictions</small>
          </div>
          <div className="col-md-3 text-center">
            <i className="fas fa-shield-alt text-success fa-2x mb-2"></i>
            <h6 className="text-light">Risk Assessment</h6>
            <small className="text-muted">Advanced collision & debris impact modeling</small>
          </div>
          <div className="col-md-3 text-center">
            <i className="fas fa-gavel text-warning fa-2x mb-2"></i>
            <h6 className="text-light">Compliance Engine</h6>
            <small className="text-muted">Multi-jurisdiction regulatory navigation</small>
          </div>
          <div className="col-md-3 text-center">
            <i className="fas fa-users text-info fa-2x mb-2"></i>
            <h6 className="text-light">Industry Network</h6>
            <small className="text-muted">Connect with space economy professionals</small>
          </div>
        </motion.div>
      </div>
      {/* Mission setup modal */}
      <MissionSetupModal
        show={showSetup}
        onClose={() => setShowSetup(false)}
        onStart={(opts) => {
          setShowSetup(false);
          start(opts);
        }}
      />
    </div>
  );
}

  // render modal at bottom of file
  export function _ProfessionalHomeWithModal(props){
    return (
      <>
        <Home {...props} />
      </>
    );
  }