import React from 'react';

export default function SatelliteTracker3DSimple({ onBack }) {
  return (
    <div className="min-vh-100" style={{
      background: 'linear-gradient(135deg, #0f1419 0%, #1a1f3a 50%, #2d1b69 100%)'
    }}>
      {/* Header */}
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="text-white">
            <i className="fas fa-globe me-2 text-primary"></i>
            3D Satellite Tracker
          </h1>
          {onBack && (
            <button className="btn btn-outline-light" onClick={onBack}>
              <i className="fas fa-arrow-left me-2"></i>
              Back
            </button>
          )}
        </div>

        {/* 3D Visualization Area */}
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card bg-dark border-primary">
              <div className="card-header bg-primary">
                <h5 className="mb-0">
                  <i className="fas fa-globe me-2"></i>
                  Real-Time Earth View
                </h5>
              </div>
              <div className="card-body text-center" style={{ minHeight: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="text-center">
                  <div className="mb-4">
                    <i className="fas fa-globe fa-5x text-primary mb-3 rotating"></i>
                  </div>
                  <h4 className="text-white mb-3">3D Earth Visualization</h4>
                  <p className="text-muted mb-4">
                    Real-time satellite tracking with orbital trajectories
                  </p>
                  <div className="row text-center">
                    <div className="col-4">
                      <h5 className="text-success">24</h5>
                      <small className="text-muted">Tracked Satellites</small>
                    </div>
                    <div className="col-4">
                      <h5 className="text-warning">156°</h5>
                      <small className="text-muted">Current Rotation</small>
                    </div>
                    <div className="col-4">
                      <h5 className="text-info">98%</h5>
                      <small className="text-muted">Coverage</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-4">
            <div className="card bg-dark border-success mb-4">
              <div className="card-header bg-success">
                <h5 className="mb-0">
                  <i className="fas fa-satellite me-2"></i>
                  Active Satellites
                </h5>
              </div>
              <div className="card-body">
                <div className="list-group list-group-flush">
                  <div className="list-group-item bg-transparent border-secondary text-light">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>SAT-001</strong>
                        <br/>
                        <small className="text-muted">Alt: 408 km</small>
                      </div>
                      <span className="badge bg-success">Active</span>
                    </div>
                  </div>
                  <div className="list-group-item bg-transparent border-secondary text-light">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>SAT-024</strong>
                        <br/>
                        <small className="text-muted">Alt: 592 km</small>
                      </div>
                      <span className="badge bg-warning">Maintenance</span>
                    </div>
                  </div>
                  <div className="list-group-item bg-transparent border-secondary text-light">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>SAT-087</strong>
                        <br/>
                        <small className="text-muted">Alt: 450 km</small>
                      </div>
                      <span className="badge bg-success">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card bg-dark border-info">
              <div className="card-header bg-info">
                <h5 className="mb-0">
                  <i className="fas fa-cogs me-2"></i>
                  Control Panel
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-2">
                  <div className="col-6">
                    <button className="btn btn-outline-primary w-100 btn-sm">
                      <i className="fas fa-play me-1"></i>
                      Auto Rotate
                    </button>
                  </div>
                  <div className="col-6">
                    <button className="btn btn-outline-success w-100 btn-sm">
                      <i className="fas fa-satellite me-1"></i>
                      Track All
                    </button>
                  </div>
                  <div className="col-6">
                    <button className="btn btn-outline-warning w-100 btn-sm">
                      <i className="fas fa-route me-1"></i>
                      Show Orbits
                    </button>
                  </div>
                  <div className="col-6">
                    <button className="btn btn-outline-info w-100 btn-sm">
                      <i className="fas fa-crosshairs me-1"></i>
                      Focus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .rotating {
          animation: rotate 10s linear infinite;
        }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}