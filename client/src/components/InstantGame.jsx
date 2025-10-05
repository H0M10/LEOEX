import React, { useState, useEffect } from 'react';

export default function InstantGame({ onExit }) {
  // Estado del juego completamente local para carga instantánea
  const [gameState, setGameState] = useState({
    budget: 100000,
    turn: 1,
    score: 0,
    satellites: [
      { id: 'SAT-01', fuel: 85, status: 'Activo', lastAction: 'Patrullando' },
      { id: 'SAT-02', fuel: 72, status: 'Activo', lastAction: 'Fotografiando' },
      { id: 'SAT-03', fuel: 91, status: 'Activo', lastAction: 'Recargado' },
      { id: 'SAT-04', fuel: 43, status: 'Bajo combustible', lastAction: 'Alerta' }
    ]
  });
  
  const [message, setMessage] = useState('¡Juego listo! Todos los sistemas operativos.');
  const [processing, setProcessing] = useState(false);

  // Acciones de satélites - completamente local, sin servidor
  const performAction = (satId, action) => {
    setProcessing(true);
    setMessage(`Ejecutando ${action} en ${satId}...`);
    
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        budget: prev.budget - getActionCost(action),
        satellites: prev.satellites.map(sat => 
          sat.id === satId ? updateSatellite(sat, action) : sat
        ),
        score: prev.score + getActionPoints(action)
      }));
      setMessage(`✅ ${action} completado en ${satId}`);
      setProcessing(false);
    }, 300); // Muy rápido, solo 300ms para simular procesamiento
  };

  const getActionCost = (action) => {
    const costs = { REFUEL: 5000, CAM: 2000, IMAGING: 3000, MAINTENANCE: 4000 };
    return costs[action] || 0;
  };

  const getActionPoints = (action) => {
    const points = { REFUEL: 5, CAM: 10, IMAGING: 15, MAINTENANCE: 8 };
    return points[action] || 0;
  };

  const updateSatellite = (sat, action) => {
    const actions = {
      REFUEL: { fuel: Math.min(100, sat.fuel + 25), status: 'Recargado', lastAction: 'Recarga completa' },
      CAM: { ...sat, status: 'Fotografiando', lastAction: 'Captura activa' },
      IMAGING: { fuel: sat.fuel - 5, status: 'Análisis', lastAction: 'Procesando imágenes' },
      MAINTENANCE: { fuel: sat.fuel + 10, status: 'Mantenimiento', lastAction: 'Sistema optimizado' }
    };
    return { ...sat, ...actions[action] };
  };

  const advanceTurn = () => {
    setProcessing(true);
    setMessage('Avanzando al siguiente turno...');
    
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        turn: prev.turn + 1,
        satellites: prev.satellites.map(sat => ({
          ...sat,
          fuel: Math.max(0, sat.fuel - Math.floor(Math.random() * 8 + 2)),
          status: sat.fuel > 20 ? 'Activo' : 'Bajo combustible'
        }))
      }));
      setMessage(`🔄 Turno ${gameState.turn + 1} iniciado`);
      setProcessing(false);
    }, 200);
  };

  // Auto-eventos para hacer el juego más dinámico
  useEffect(() => {
    const interval = setInterval(() => {
      if (!processing) {
        const events = [
          '📡 Señal recibida de la estación',
          '🌍 Pasando sobre zona objetivo',
          '⚠️ Detección de basura espacial',
          '📷 Oportunidad de fotografía disponible',
          '🛰️ Sistemas funcionando normalmente'
        ];
        setMessage(events[Math.floor(Math.random() * events.length)]);
      }
    }, 4000);
    
    return () => clearInterval(interval);
  }, [processing]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(45deg, #000428 0%, #004e92 100%)',
      padding: '15px',
      fontFamily: 'Arial, sans-serif',
      color: 'white'
    }}>
      
      {/* Header ultra rápido */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '15px',
        padding: '12px 20px',
        background: 'linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px' }}>🚀 LEO Control Instantáneo</h1>
          <small style={{ opacity: 0.8 }}>Listo para operar - Sin esperas</small>
        </div>
        <button 
          onClick={onExit}
          style={{
            padding: '10px 20px',
            background: 'linear-gradient(45deg, #ff416c, #ff4b2b)',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(255,65,108,0.4)'
          }}
        >
          ← Salir
        </button>
      </div>

      {/* Status instantáneo */}
      <div style={{ 
        padding: '12px 20px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '8px',
        marginBottom: '15px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>📡 {message}</div>
        {processing && <div style={{ marginTop: '5px', opacity: 0.7 }}>⏳ Procesando...</div>}
      </div>

      {/* Stats grid - carga instantánea */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div style={{ 
          padding: '15px', 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '10px',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.25)'
        }}>
          <div style={{ fontSize: '14px', opacity: 0.8 }}>💰 PRESUPUESTO</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', margin: '5px 0' }}>
            ${gameState.budget.toLocaleString()}
          </div>
        </div>
        
        <div style={{ 
          padding: '15px', 
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          borderRadius: '10px',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(240, 147, 251, 0.25)'
        }}>
          <div style={{ fontSize: '14px', opacity: 0.8 }}>🔄 TURNO</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', margin: '5px 0' }}>
            {gameState.turn}
          </div>
        </div>
        
        <div style={{ 
          padding: '15px', 
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          borderRadius: '10px',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(79, 172, 254, 0.25)'
        }}>
          <div style={{ fontSize: '14px', opacity: 0.8 }}>🎯 PUNTOS</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', margin: '5px 0' }}>
            {gameState.score}
          </div>
        </div>
        
        <div style={{ 
          padding: '15px', 
          background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
          borderRadius: '10px',
          textAlign: 'center',
          color: '#333',
          boxShadow: '0 8px 32px rgba(168, 237, 234, 0.25)'
        }}>
          <div style={{ fontSize: '14px', opacity: 0.8 }}>🛰️ SATÉLITES</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', margin: '5px 0' }}>
            {gameState.satellites.length}
          </div>
        </div>
      </div>

      {/* Satélites - interfaz súper práctica */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '15px' }}>🛰️ Flota Operativa</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '12px'
        }}>
          {gameState.satellites.map((sat) => (
            <div key={sat.id} style={{ 
              padding: '15px',
              background: `linear-gradient(135deg, ${sat.fuel > 50 ? '#56ab2f, #a8e6cf' : sat.fuel > 20 ? '#f7971e, #ffd200' : '#c31432, #240b36'})`,
              borderRadius: '10px',
              color: sat.fuel > 20 ? '#333' : 'white',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '10px'
              }}>
                <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{sat.id}</div>
                <div style={{ 
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  background: 'rgba(255,255,255,0.2)',
                  fontWeight: 'bold'
                }}>
                  ⛽ {sat.fuel}%
                </div>
              </div>
              
              <div style={{ fontSize: '13px', marginBottom: '12px', opacity: 0.8 }}>
                📡 {sat.status} • {sat.lastAction}
              </div>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '6px'
              }}>
                {['REFUEL', 'CAM', 'IMAGING', 'MAINTENANCE'].map((action) => (
                  <button 
                    key={action}
                    onClick={() => performAction(sat.id, action)}
                    disabled={processing}
                    style={{
                      padding: '8px',
                      background: processing ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.9)',
                      color: '#333',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: processing ? 'not-allowed' : 'pointer',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      opacity: processing ? 0.6 : 1,
                      transition: 'all 0.2s'
                    }}
                  >
                    {action === 'REFUEL' && '⛽ Recargar'}
                    {action === 'CAM' && '📷 Cámara'}
                    {action === 'IMAGING' && '🖼️ Imagen'}
                    {action === 'MAINTENANCE' && '🔧 Mantener'}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Control central */}
      <div style={{ 
        padding: '20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '15px',
        textAlign: 'center',
        boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
      }}>
        <button 
          onClick={advanceTurn}
          disabled={processing}
          style={{
            padding: '15px 30px',
            background: processing ? 'rgba(0,0,0,0.3)' : 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: processing ? 'not-allowed' : 'pointer',
            opacity: processing ? 0.6 : 1,
            boxShadow: processing ? 'none' : '0 4px 15px rgba(255, 107, 107, 0.4)',
            transition: 'all 0.3s'
          }}
        >
          {processing ? '⏳ Procesando...' : '▶️ Avanzar Turno'}
        </button>
        <div style={{ marginTop: '10px', fontSize: '14px', opacity: 0.8 }}>
          Cada turno consume combustible automáticamente
        </div>
      </div>
    </div>
  );
}