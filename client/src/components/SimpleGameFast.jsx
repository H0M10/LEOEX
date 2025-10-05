import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function SimpleGameFast({ onExit }) {
  const [gameState, setGameState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('Iniciando juego...');

  // Iniciar juego automáticamente
  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = async () => {
    setLoading(true);
    setMessage('Conectando al servidor...');
    try {
      const response = await axios.post('http://localhost:9002/api/game/start', {
        scenario: 'operator',
        budget: 100000,
        satellitesCount: 4
      });
      setGameState(response.data);
      setMessage('¡Juego iniciado correctamente!');
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error al conectar: ' + error.message);
    }
    setLoading(false);
  };

  const performAction = async (satId, action) => {
    if (!gameState) return;
    
    setLoading(true);
    setMessage(`Ejecutando ${action}...`);
    try {
      const response = await axios.post(`http://localhost:9002/api/game/${gameState.id}/step`, {
        actions: { actions: { [satId]: action } }
      });
      setGameState(response.data);
      setMessage(`${action} ejecutado en ${satId}`);
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error: ' + error.message);
    }
    setLoading(false);
  };

  const advanceTurn = async () => {
    if (!gameState) return;
    
    setLoading(true);
    setMessage('Avanzando turno...');
    try {
      const response = await axios.post(`http://localhost:9002/api/game/${gameState.id}/step`, {
        actions: { actions: {} }
      });
      setGameState(response.data);
      setMessage('Turno avanzado');
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)',
      padding: '20px',
      color: 'white'
    }}>
      
      {/* Header Simple */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        padding: '10px',
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '8px'
      }}>
        <h2>🚀 Juego Automático</h2>
        <button 
          onClick={onExit}
          style={{
            padding: '8px 16px',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ← Salir
        </button>
      </div>

      {/* Status */}
      <div style={{ 
        padding: '15px',
        background: 'rgba(0,0,0,0.2)',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h4>{message}</h4>
        {loading && <div>⏳ Cargando...</div>}
      </div>

      {/* Game Info */}
      {gameState && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            marginBottom: '20px'
          }}>
            <div style={{ 
              padding: '15px', 
              background: 'rgba(40, 167, 69, 0.2)', 
              borderRadius: '8px',
              border: '1px solid #28a745'
            }}>
              <h5>💰 Presupuesto</h5>
              <h3>${gameState.budget?.toLocaleString()}</h3>
            </div>
            <div style={{ 
              padding: '15px', 
              background: 'rgba(0, 123, 255, 0.2)', 
              borderRadius: '8px',
              border: '1px solid #007bff'
            }}>
              <h5>🛰️ Satélites</h5>
              <h3>{gameState.satellites?.length || 0}</h3>
            </div>
            <div style={{ 
              padding: '15px', 
              background: 'rgba(255, 193, 7, 0.2)', 
              borderRadius: '8px',
              border: '1px solid #ffc107'
            }}>
              <h5>🔄 Turno</h5>
              <h3>{gameState.turn || 1}</h3>
            </div>
            <div style={{ 
              padding: '15px', 
              background: 'rgba(108, 117, 125, 0.2)', 
              borderRadius: '8px',
              border: '1px solid #6c757d'
            }}>
              <h5>🎯 Puntos</h5>
              <h3>{gameState.score || 0}</h3>
            </div>
          </div>

          {/* Satellites */}
          <div style={{ marginBottom: '20px' }}>
            <h4>🛰️ Flota de Satélites</h4>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '15px'
            }}>
              {gameState.satellites?.map((sat, index) => (
                <div key={sat.id} style={{ 
                  padding: '15px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <div style={{ marginBottom: '10px' }}>
                    <strong>{sat.id}</strong>
                    <span style={{ 
                      marginLeft: '10px',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      background: sat.fuel > 50 ? '#28a745' : sat.fuel > 20 ? '#ffc107' : '#dc3545'
                    }}>
                      Combustible: {sat.fuel}%
                    </span>
                  </div>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '8px' 
                  }}>
                    <button 
                      onClick={() => performAction(sat.id, 'REFUEL')}
                      disabled={loading}
                      style={{
                        padding: '8px',
                        background: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.6 : 1
                      }}
                    >
                      ⛽ Recargar
                    </button>
                    <button 
                      onClick={() => performAction(sat.id, 'CAM')}
                      disabled={loading}
                      style={{
                        padding: '8px',
                        background: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.6 : 1
                      }}
                    >
                      📷 Cámara
                    </button>
                    <button 
                      onClick={() => performAction(sat.id, 'IMAGING')}
                      disabled={loading}
                      style={{
                        padding: '8px',
                        background: '#ffc107',
                        color: 'black',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.6 : 1
                      }}
                    >
                      🖼️ Imagen
                    </button>
                    <button 
                      onClick={() => performAction(sat.id, 'MAINTENANCE')}
                      disabled={loading}
                      style={{
                        padding: '8px',
                        background: '#6f42c1',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.6 : 1
                      }}
                    >
                      🔧 Mantener
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Control Panel */}
          <div style={{ 
            padding: '20px',
            background: 'rgba(40, 167, 69, 0.2)',
            borderRadius: '8px',
            border: '1px solid #28a745',
            textAlign: 'center'
          }}>
            <button 
              onClick={advanceTurn}
              disabled={loading}
              style={{
                padding: '12px 24px',
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? '⏳ Procesando...' : '▶️ Avanzar Turno'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}