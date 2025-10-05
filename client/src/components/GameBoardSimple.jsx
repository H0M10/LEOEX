
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function GameBoardSimple({ gameData, onReturnToHome }) {
  const [gameState, setGameState] = useState(gameData);
  const [loading, setLoading] = useState(false);
  const [selectedSat, setSelectedSat] = useState(null);

  const performAction = async (satId, action) => {
    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:9002/api/game/${gameState.id}/step`, {
        actions: { actions: { [satId]: action } }
      });
      setGameState(response.data);
    } catch (error) {
      console.error('Error performing action:', error);
      alert('Error performing action');
    }
    setLoading(false);
  };

  const advanceTurn = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:9002/api/game/${gameState.id}/step`, {
        actions: { actions: {} }
      });
      setGameState(response.data);
    } catch (error) {
      console.error('Error advancing turn:', error);
      alert('Error advancing turn');
    }
    setLoading(false);
  };

  return (
    <div className="container-fluid py-4" style={{
      background: 'linear-gradient(135deg, #0f1419 0%, #1a1f3a 50%, #2d1b69 100%)',
      minHeight: '100vh'
    }}>
      
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-white">
          <i className="fas fa-gamepad me-2"></i>
          Mission Control - Turn {gameState?.turn || 1}
        </h2>
        <button className="btn btn-outline-light" onClick={onReturnToHome}>
          <i className="fas fa-home me-2"></i>
          Return to Home
        </button>
      </div>

      {/* Game Stats */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card bg-dark border-success">
            <div className="card-body text-center">
              <h5 className="text-success">Budget</h5>
              <h3 className="text-white">${gameState?.budget?.toLocaleString() || 0}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-dark border-primary">
            <div className="card-body text-center">
              <h5 className="text-primary">Satellites</h5>
              <h3 className="text-white">{gameState?.satellites?.length || 0}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-dark border-warning">
            <div className="card-body text-center">
              <h5 className="text-warning">Turn</h5>
              <h3 className="text-white">{gameState?.turn || 1}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-dark border-info">
            <div className="card-body text-center">
              <h5 className="text-info">Score</h5>
              <h3 className="text-white">{gameState?.score || 0}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Satellites */}
      <div className="row">
        <div className="col-lg-8">
          <div className="card bg-dark border-primary">
            <div className="card-header bg-primary">
              <h5 className="mb-0">
                <i className="fas fa-satellite me-2"></i>
                Satellite Fleet
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {gameState?.satellites?.map((sat, index) => (
                  <div key={sat.id} className="col-md-6">
                    <div className={`card ${selectedSat === sat.id ? 'border-warning' : 'border-secondary'} h-100`} 
                         style={{background: 'rgba(255,255,255,0.1)'}}>
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="text-white">{sat.id}</h6>
                          <span className={`badge ${sat.fuel > 50 ? 'bg-success' : sat.fuel > 20 ? 'bg-warning' : 'bg-danger'}`}>
                            Fuel: {sat.fuel}%
                          </span>
                        </div>
                        
                        <div className="mb-3">
                          <small className="text-muted">Status: </small>
                          <span className="text-light">{sat.status || 'Active'}</span>
                        </div>

                        <div className="btn-group w-100" role="group">
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => performAction(sat.id, 'REFUEL')}
                            disabled={loading}
                          >
                            <i className="fas fa-gas-pump me-1"></i>
                            Refuel
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-success"
                            onClick={() => performAction(sat.id, 'CAM')}
                            disabled={loading}
                          >
                            <i className="fas fa-camera me-1"></i>
                            Cam
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => performAction(sat.id, 'IMAGING')}
                            disabled={loading}
                          >
                            <i className="fas fa-image me-1"></i>
                            Image
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card bg-dark border-success">
            <div className="card-header bg-success">
              <h5 className="mb-0">
                <i className="fas fa-cogs me-2"></i>
                Control Panel
              </h5>
            </div>
            <div className="card-body">
              <button 
                className="btn btn-success w-100 mb-3"
                onClick={advanceTurn}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner-border spinner-border-sm me-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-forward me-2"></i>
                    Advance Turn
                  </>
                )}
              </button>
              
              <div className="alert alert-info">
                <i className="fas fa-info-circle me-2"></i>
                <strong>Instructions:</strong><br/>
                Select satellites and assign actions. Click "Advance Turn" to proceed to the next turn.
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}