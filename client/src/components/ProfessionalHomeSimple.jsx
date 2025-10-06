

import React, { useState, useEffect } from 'react';
import axios from 'axios';


export default function ProfessionalHome({ onStart, onNavigate }) {
  const [loading, setLoading] = useState(false);
  // API base URL
  const base = import.meta.env.VITE_API_BASE || '';

  const startGame = async (profile = 'operator') => {
    setLoading(true);
    try {
      const resp = await axios.post(`${base}/api/game/start`, { 
        scenario: profile, 
        budget: 100000, 
        satellitesCount: 4 
      });
      onStart(resp.data);
    } catch (error) {
      console.error('Error starting game:', error);
      alert('Error connecting to server. Make sure the backend is running.');
    }
    setLoading(false);
  };

  return (
    <div className="container-fluid py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center text-white">
            {/* Main Header */}


            {/* Mission Profiles */}
            <div className="row justify-content-center mb-5">
              <div className="col-md-5 col-lg-4">
                <div className="card bg-dark border-primary h-100" style={{background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)'}}>
                  <div className="card-body text-center">
                    <i className="fas fa-rocket fa-3x text-primary mb-4"></i>
                    <h4 className="text-white mb-3">Operator Mission</h4>
                    <p className="text-muted mb-4">Interactive satellite control simulation</p>
                    <div className="mb-4">
                      <div className="badge bg-success fs-6 me-2 mb-2">Budget: $35,000</div>
                      <div className="badge bg-info fs-6 mb-2">2 Satellites</div>
                      <div className="badge bg-warning fs-6 ms-2 mb-2">12 Turns</div>
                    </div>
                    <button 
                      className="btn btn-primary btn-lg w-100" 
                      onClick={() => startGame('operator')}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                          Starting Mission...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-rocket me-2"></i>
                          Start LEO Mission
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-5 col-lg-4">
                <div className="d-flex flex-column gap-3 h-100">
                  <div className="card bg-dark border-success" style={{background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)'}}>
                    <div className="card-body text-center">
                      <i className="fas fa-chart-line fa-3x text-success mb-4"></i>
                      <h4 className="text-white mb-3">Data Analytics</h4>
                      <p className="text-muted mb-4">Real-time satellite data analysis platform</p>
                      <div className="mb-4">
                        <div className="badge bg-info fs-6 me-2 mb-2">Live Data</div>
                        <div className="badge bg-warning fs-6 mb-2">Multi-Sector</div>
                        <div className="badge bg-success fs-6 ms-2 mb-2">AI Filtering</div>
                      </div>
                      <button 
                        className="btn btn-success btn-lg w-100" 
                        onClick={() => onNavigate && onNavigate('analytics')}
                        disabled={loading}
                      >
                        <i className="fas fa-satellite-dish me-2"></i>
                        LEO Data Analytics
                      </button>
                    </div>
                  </div>
                  <button
                    className="btn btn-warning btn-lg w-100 mt-2"
                    onClick={() => onNavigate && onNavigate('spaceTourism')}
                  >
                    <i className="fas fa-rocket me-2"></i>
                    Space Tourism
                  </button>
                </div>
              </div>
            </div>

            {/* Region Selection - One unique region per sector */}
            <div className="text-start mb-4">
              <h5 className="text-info mb-2">
                <i className="fas fa-globe me-2"></i>
                Region Selection
              </h5>
              <p className="text-muted mb-3">Each sector works with a single specialized region. Example label: <strong>Professional Analysis - Atacama Desert</strong>.</p>

              {(() => {
                // Simple mapping of sectors with their unique region (consistent with Analytics)
                const sectorRegions = [
                  { key: 'agriculture', name: 'Agriculture', icon: 'fas fa-seedling', color: '#28a745', regionName: 'Brazil' },
                  { key: 'environment', name: 'Environment', icon: 'fas fa-leaf', color: '#20c997', regionName: 'Germany' },
                  { key: 'disaster', name: 'Disaster Management', icon: 'fas fa-exclamation-triangle', color: '#dc3545', regionName: 'Japan' },
                  { key: 'urban', name: 'Urban Development', icon: 'fas fa-city', color: '#007bff', regionName: 'United States' },
                  { key: 'maritime', name: 'Maritime', icon: 'fas fa-ship', color: '#17a2b8', regionName: 'Australia' },
                  { key: 'energy', name: 'Energy', icon: 'fas fa-bolt', color: '#ffc107', regionName: 'France' },
                ];

                return (
                  <div className="row g-3">
                    {sectorRegions.map((s) => (
                      <div key={s.key} className="col-md-6 col-lg-4">
                        <div className="card bg-dark border-0 h-100" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}>
                          <div className="card-body text-start">
                            <div className="d-flex align-items-center mb-2">
                              <i className={`${s.icon} me-2`} style={{ color: s.color, fontSize: '1.4rem' }}></i>
                              <h6 className="text-white mb-0">{s.name}</h6>
                            </div>
                            <div className="alert alert-info py-2 mb-1" style={{ background: 'rgba(23,162,184,0.15)', border: '1px solid rgba(23,162,184,0.4)' }}>
                              <small className="text-info fw-bold">Professional Analysis - {s.regionName}</small>
                            </div>
                            <div className="mb-3 ms-1">
                              <small className="text-white">
                                {/* Sector description summary */}
                                {(() => {
                                  switch (s.key) {
                                    case 'agriculture':
                                      return 'Monitoring of crops, soil moisture, and agricultural productivity using satellite imagery.';
                                    case 'environment':
                                      return 'Tracking of ecosystems, deforestation, and environmental quality in the selected region.';
                                    case 'disaster':
                                      return 'Analysis of risk zones and disaster response using satellite data.';
                                    case 'urban':
                                      return 'Assessment of urban growth, infrastructure, and city planning.';
                                    case 'maritime':
                                      return 'Monitoring of maritime routes, fishing, and oceanic conditions.';
                                    case 'energy':
                                      return 'Supervision of energy resources, networks, and renewable energy potential.';
                                    default:
                                      return 'Professional analysis of the selected region.';
                                  }
                                })()}
                              </small>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                              <small className="text-muted">Unique region per sector</small>
                              <button
                                className="btn btn-sm btn-outline-info"
                                onClick={() => {
                                  // Persist selected sector and navigate to Analytics
                                  try {
                                    localStorage.setItem('selectedSector', s.key);
                                  } catch {}
                                  onNavigate && onNavigate('analytics');
                                }}
                              >
                                <i className="fas fa-chart-line me-1"></i>
                                Open Analytics
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>



          </div>
        </div>
      </div>
  );
}