import React, { useState } from 'react';
import axios from 'axios';

export default function HomeSimple({ onStart }) {
  const [loading, setLoading] = useState(false);

  const startGame = async (scenario) => {
    setLoading(true);
    try {
      const resp = await axios.post('http://localhost:9002/api/game/start', { 
        scenario, 
        budget: 100000, 
        satellitesCount: 4 
      });
      onStart(resp.data);
    } catch (error) {
      console.error('Error starting game:', error);
      alert('Error connecting to server');
    }
    setLoading(false);
  };

  return (
    <div className="container text-center py-5" style={{
      background: 'linear-gradient(135deg, #0f1419 0%, #1a1f3a 50%, #2d1b69 100%)',
      minHeight: '100vh'
    }}>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h1 className="display-4 mb-4 text-white">🚀 LEO Decisions</h1>
          <p className="lead mb-5 text-light">
            Gestiona una constelación de satélites en órbita terrestre baja
          </p>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card bg-dark border-primary h-100">
                <div className="card-body text-center">
                  <i className="fas fa-building fa-3x text-primary mb-3"></i>
                  <h5 className="text-white">Operador</h5>
                  <p className="text-muted">Gestiona operaciones comerciales de satélites</p>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => startGame('operator')}
                    disabled={loading}
                  >
                    {loading ? 'Iniciando...' : 'Comenzar'}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card bg-dark border-success h-100">
                <div className="card-body text-center">
                  <i className="fas fa-leaf fa-3x text-success mb-3"></i>
                  <h5 className="text-white">ONG</h5>
                  <p className="text-muted">Misiones de monitoreo ambiental</p>
                  <button 
                    className="btn btn-success" 
                    onClick={() => startGame('ong')}
                    disabled={loading}
                  >
                    {loading ? 'Iniciando...' : 'Comenzar'}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card bg-dark border-warning h-100">
                <div className="card-body text-center">
                  <i className="fas fa-home fa-3x text-warning mb-3"></i>
                  <h5 className="text-white">Inmobiliaria</h5>
                  <p className="text-muted">Análisis de mercado inmobiliario</p>
                  <button 
                    className="btn btn-warning" 
                    onClick={() => startGame('inmobiliaria')}
                    disabled={loading}
                  >
                    {loading ? 'Iniciando...' : 'Comenzar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}