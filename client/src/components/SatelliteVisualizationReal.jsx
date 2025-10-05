import React, { useState, useEffect } from 'react';

const SatelliteVisualizationReal = ({ region, sector }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!region) return null;

  const getSectorColor = () => {
    switch(sector) {
      case 'agriculture': return '#10B981';
      case 'environment': return '#059669';
      case 'maritime': return '#0891B2';
      case 'disaster': return '#DC2626';
      case 'urban': return '#7C3AED';
      case 'energy': return '#EA580C';
      default: return '#6B7280';
    }
  };

  const getSectorIcon = () => {
    switch(sector) {
      case 'agriculture': return 'fas fa-seedling';
      case 'environment': return 'fas fa-leaf';
      case 'maritime': return 'fas fa-ship';
      case 'disaster': return 'fas fa-exclamation-triangle';
      case 'urban': return 'fas fa-city';
      case 'energy': return 'fas fa-solar-panel';
      default: return 'fas fa-satellite';
    }
  };

  return (
    <div className="satellite-visualization bg-dark rounded p-3 text-white">
      {/* Header con información de la región */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">
          <i className={`${getSectorIcon()} me-2`} style={{color: getSectorColor()}}></i>
          {region.name}
        </h5>
        <div className="text-end">
          <div className="badge bg-success" style={{fontSize: '10px'}}>
            <i className="fas fa-clock me-1"></i>
            {currentTime.toLocaleTimeString('es-ES')}
          </div>
          <div className="badge bg-primary ms-2" style={{fontSize: '10px'}}>
            Sector: {sector}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="alert alert-warning border-0" style={{background: 'rgba(255, 193, 7, 0.2)'}}>
            <h6 className="text-warning mb-2">
              <i className="fas fa-exclamation-triangle me-2"></i>
              Real-time Satellite Visualization Requires Additional APIs
            </h6>
            <p className="text-light small mb-3">
              To display live satellite positions, orbital tracks, and real-time sensor data, 
              this component requires integration with professional satellite tracking APIs:
            </p>
            <div className="row">
              <div className="col-md-6">
                <ul className="text-light small mb-0">
                  <li><strong>Satellite Position APIs:</strong> N2YO, CelesTrak TLE data</li>
                  <li><strong>Ground Track APIs:</strong> AGI STK, GMAT orbital mechanics</li>
                  <li><strong>Real-time Telemetry:</strong> Mission-specific APIs</li>
                </ul>
              </div>
              <div className="col-md-6">
                <ul className="text-light small mb-0">
                  <li><strong>Sensor Data:</strong> Earth observation APIs</li>
                  <li><strong>Coverage Maps:</strong> Geometric calculations</li>
                  <li><strong>Communication Status:</strong> Ground station APIs</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="card bg-secondary text-white">
            <div className="card-body">
              <h6 className="text-info mb-3">
                <i className="fas fa-satellite-dish me-2"></i>
                Professional Satellite Tracking - API Requirements
              </h6>
              
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="card bg-dark border-primary">
                    <div className="card-body text-center p-3">
                      <i className="fas fa-globe fa-2x text-primary mb-2"></i>
                      <h6 className="text-primary">Orbital Data</h6>
                      <p className="small text-muted mb-2">Real-time satellite positions and trajectories</p>
                      <span className="badge bg-warning">
                        <i className="fas fa-key me-1"></i>API Key Required
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-4">
                  <div className="card bg-dark border-success">
                    <div className="card-body text-center p-3">
                      <i className="fas fa-eye fa-2x text-success mb-2"></i>
                      <h6 className="text-success">Earth Observation</h6>
                      <p className="small text-muted mb-2">Live sensor data and imaging</p>
                      <span className="badge bg-warning">
                        <i className="fas fa-key me-1"></i>API Key Required
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-4">
                  <div className="card bg-dark border-info">
                    <div className="card-body text-center p-3">
                      <i className="fas fa-signal fa-2x text-info mb-2"></i>
                      <h6 className="text-info">Ground Stations</h6>
                      <p className="small text-muted mb-2">Communication and telemetry status</p>
                      <span className="badge bg-warning">
                        <i className="fas fa-key me-1"></i>API Key Required
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-center">
                <div className="text-muted small mb-2">
                  <i className="fas fa-shield-alt me-1"></i>
                  This application maintains professional standards by showing only verified real-time data
                </div>
                <div className="text-info small">
                  <i className="fas fa-info-circle me-1"></i>
                  Contact your system administrator to configure satellite tracking APIs
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SatelliteVisualizationReal;