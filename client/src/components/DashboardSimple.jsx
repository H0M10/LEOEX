import React from 'react';

export default function Dashboard({ onBack }) {
  return (
    <div className="min-vh-100" style={{
      background: 'linear-gradient(135deg, #0f1419 0%, #1a1f3a 50%, #2d1b69 100%)'
    }}>
      {/* Header */}
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="text-white">
            <i className="fas fa-chart-line me-2 text-primary"></i>
            Live Analytics Dashboard
          </h1>
          {onBack && (
            <button className="btn btn-outline-light" onClick={onBack}>
              <i className="fas fa-arrow-left me-2"></i>
              Back
            </button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="row g-4 mb-5">
          <div className="col-md-3">
            <div className="card bg-dark border-success">
              <div className="card-body text-center">
                <i className="fas fa-satellite fa-3x text-success mb-3"></i>
                <h3 className="text-white">8,439</h3>
                <p className="text-muted">Active Satellites</p>
                <small className="badge bg-success">+2.5% today</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-dark border-warning">
              <div className="card-body text-center">
                <i className="fas fa-rocket fa-3x text-warning mb-3"></i>
                <h3 className="text-white">156</h3>
                <p className="text-muted">Active Missions</p>
                <small className="badge bg-warning">+12 new</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-dark border-info">
              <div className="card-body text-center">
                <i className="fas fa-globe fa-3x text-info mb-3"></i>
                <h3 className="text-white">34</h3>
                <p className="text-muted">Countries Served</p>
                <small className="badge bg-info">Global reach</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-dark border-danger">
              <div className="card-body text-center">
                <i className="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                <h3 className="text-white">3</h3>
                <p className="text-muted">Critical Alerts</p>
                <small className="badge bg-danger">Requires attention</small>
              </div>
            </div>
          </div>
        </div>

        {/* Live Data Tables */}
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card bg-dark border-primary">
              <div className="card-header bg-primary">
                <h5 className="mb-0">
                  <i className="fas fa-satellite me-2"></i>
                  Recent Satellite Activities
                </h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-dark table-striped">
                    <thead>
                      <tr>
                        <th>Satellite ID</th>
                        <th>Mission</th>
                        <th>Status</th>
                        <th>Last Update</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>SAT-001</td>
                        <td>Earth Observation</td>
                        <td><span className="badge bg-success">Active</span></td>
                        <td>2 min ago</td>
                      </tr>
                      <tr>
                        <td>SAT-024</td>
                        <td>Communication</td>
                        <td><span className="badge bg-warning">Maintenance</span></td>
                        <td>15 min ago</td>
                      </tr>
                      <tr>
                        <td>SAT-087</td>
                        <td>Weather Monitoring</td>
                        <td><span className="badge bg-success">Active</span></td>
                        <td>1 min ago</td>
                      </tr>
                      <tr>
                        <td>SAT-156</td>
                        <td>GPS Navigation</td>
                        <td><span className="badge bg-danger">Critical</span></td>
                        <td>32 min ago</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-4">
            <div className="card bg-dark border-info">
              <div className="card-header bg-info">
                <h5 className="mb-0">
                  <i className="fas fa-bell me-2"></i>
                  System Alerts
                </h5>
              </div>
              <div className="card-body">
                <div className="alert alert-warning">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  <strong>Orbit Adjustment Required</strong><br/>
                  SAT-156 requires orbital correction within 4 hours.
                </div>
                <div className="alert alert-info">
                  <i className="fas fa-info-circle me-2"></i>
                  <strong>Maintenance Scheduled</strong><br/>
                  SAT-024 maintenance window: 02:00-04:00 UTC.
                </div>
                <div className="alert alert-success">
                  <i className="fas fa-check-circle me-2"></i>
                  <strong>Mission Complete</strong><br/>
                  SAT-099 successfully completed imaging task.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}