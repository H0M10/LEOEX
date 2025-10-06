import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Componente de juego simple y automático
export default function SimpleGame({ onExit }) {
  const [gameState, setGameState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedSat, setSelectedSat] = useState(null);
  const [log, setLog] = useState([]);

  const base = import.meta.env.VITE_API_BASE || '${base}';

  // Iniciar juego automáticamente
  useEffect(() => {
    console.log('SimpleGame: Iniciando juego automáticamente...');
    // Agregar un pequeño delay para evitar problemas de carga
    const timer = setTimeout(() => {
      startNewGame();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const startNewGame = async () => {
    console.log('SimpleGame: Intentando iniciar juego...');
    setLoading(true);
    try {
      console.log('SimpleGame: Haciendo petición al backend...');
      const response = await axios.post(`${base}/api/game/start`, {
        scenario: 'operator',
        budget: 100000,
        satellitesCount: 4
      });
      console.log('SimpleGame: Respuesta del backend:', response.data);
      setGameState(response.data);
      addLog('¡Juego iniciado! Presupuesto: $100,000');
    } catch (error) {
      console.error('SimpleGame Error:', error.message);
      console.error('SimpleGame Error completo:', error);
      addLog('Error al iniciar el juego: ' + error.message);
    }
    setLoading(false);
  };

  const addLog = (message) => {
    setLog(prev => [`Turno ${gameState?.turn || 1}: ${message}`, ...prev].slice(0, 10));
  };

  const performAction = async (satId, action) => {
    if (!gameState) return;
    
    setLoading(true);
    try {
      const actions = { [satId]: action };
      const response = await axios.post(`${base}/api/game/${gameState.id}/step`, {
        actions: { actions }
      });
      
      setGameState(response.data);
      addLog(`${action} ejecutado en ${satId}`);
    } catch (error) {
      console.error('Error performing action:', error);
      addLog('Error al ejecutar acción');
    }
    setLoading(false);
  };

  const assignTask = async (taskId, satId) => {
    if (!gameState) return;
    
    setLoading(true);
    try {
      const assignments = { [taskId]: satId };
      const response = await axios.post(`${base}/api/game/${gameState.id}/step`, {
        actions: { assignments }
      });
      
      setGameState(response.data);
      addLog(`Tarea asignada a ${satId}`);
    } catch (error) {
      console.error('Error assigning task:', error);
      addLog('Error al asignar tarea');
    }
    setLoading(false);
  };

  const advanceTurn = async () => {
    if (!gameState) return;
    
    setLoading(true);
    try {
      const response = await axios.post(`${base}/api/game/${gameState.id}/step`, {
        actions: { advance: true }
      });
      
      setGameState(response.data);
      addLog(`Turno ${response.data.turn} iniciado`);
    } catch (error) {
      console.error('Error advancing turn:', error);
      addLog('Error al avanzar turno');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark text-white">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <h4>Cargando juego...</h4>
        </div>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark text-white">
        <div className="text-center">
          <h3>Error al cargar el juego</h3>
          <button className="btn btn-primary" onClick={startNewGame}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-dark text-white p-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>LEO Operations - Juego Automático</h2>
          <p className="text-muted">Turno {gameState.turn}/{gameState.maxTurns}</p>
        </div>
        <div className="d-flex align-items-center gap-3">
          <div className="badge bg-success fs-6">
            Presupuesto: ${gameState.budget?.toLocaleString() || 0}
          </div>
          <button className="btn btn-outline-light" onClick={onExit}>
            <i className="fas fa-arrow-left me-2"></i>Salir
          </button>
        </div>
      </div>

      <div className="row">
        {/* Satélites */}
        <div className="col-md-6">
          <div className="card bg-secondary text-white mb-4">
            <div className="card-header">
              <h5><i className="fas fa-satellite me-2"></i>Satélites ({gameState.satellites?.length || 0})</h5>
            </div>
            <div className="card-body">
              {gameState.satellites?.map(sat => (
                <div 
                  key={sat.id} 
                  className={`p-3 mb-2 rounded border ${selectedSat === sat.id ? 'border-primary bg-primary bg-opacity-25' : 'border-secondary'}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedSat(selectedSat === sat.id ? null : sat.id)}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6>{sat.name}</h6>
                      <small>Estado: {sat.status} | Combustible: {Math.round(sat.fuel || 0)}%</small>
                      <br />
                      <small>Riesgo: {Math.round((sat.collisionRisk || 0) * 100)}%</small>
                    </div>
                    <div className={`badge ${sat.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                      {sat.status}
                    </div>
                  </div>
                  
                  {selectedSat === sat.id && sat.status === 'active' && (
                    <div className="mt-3 pt-3 border-top">
                      <h6>Acciones:</h6>
                      <div className="btn-group w-100 mb-2">
                        <button 
                          className="btn btn-warning btn-sm"
                          onClick={(e) => { e.stopPropagation(); performAction(sat.id, 'REFUEL'); }}
                        >
                          Recargar
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={(e) => { e.stopPropagation(); performAction(sat.id, 'CAM'); }}
                        >
                          Evasión
                        </button>
                      </div>
                      <div className="btn-group w-100">
                        <button 
                          className="btn btn-info btn-sm"
                          onClick={(e) => { e.stopPropagation(); performAction(sat.id, 'IMAGING'); }}
                        >
                          Imágenes
                        </button>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={(e) => { e.stopPropagation(); performAction(sat.id, 'MAINTENANCE'); }}
                        >
                          Mantener
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )) || <p>No hay satélites disponibles</p>}
            </div>
          </div>
        </div>

        {/* Tareas y Control */}
        <div className="col-md-6">
          {/* Tareas */}
          <div className="card bg-secondary text-white mb-4">
            <div className="card-header">
              <h5><i className="fas fa-tasks me-2"></i>Tareas Activas ({gameState.tasks?.length || 0})</h5>
            </div>
            <div className="card-body" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {gameState.tasks?.map(task => (
                <div key={task.id} className="p-3 mb-2 rounded border border-secondary">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <h6>{task.title}</h6>
                      <small>Recompensa: ${task.reward?.toLocaleString() || 0}</small>
                      <br />
                      <small>Vence: Turno {task.deadline}</small>
                    </div>
                    {selectedSat && (
                      <button 
                        className="btn btn-success btn-sm"
                        onClick={() => assignTask(task.id, selectedSat)}
                      >
                        Asignar a {selectedSat}
                      </button>
                    )}
                  </div>
                </div>
              )) || <p>No hay tareas pendientes</p>}
            </div>
          </div>

          {/* Log de Actividad */}
          <div className="card bg-secondary text-white mb-4">
            <div className="card-header">
              <h5><i className="fas fa-list me-2"></i>Registro de Actividad</h5>
            </div>
            <div className="card-body" style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {log.length > 0 ? (
                log.map((entry, i) => (
                  <div key={i} className="small mb-1 p-1">
                    {entry}
                  </div>
                ))
              ) : (
                <p className="small text-muted">No hay actividad registrada</p>
              )}
            </div>
          </div>

          {/* Control de Turnos */}
          <div className="card bg-secondary text-white">
            <div className="card-header">
              <h5><i className="fas fa-clock me-2"></i>Control de Turnos</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p>Turno Actual: {gameState.turn}/{gameState.maxTurns}</p>
                  <p className="small text-muted">
                    {selectedSat ? `Satélite seleccionado: ${selectedSat}` : 'Selecciona un satélite'}
                  </p>
                </div>
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={advanceTurn}
                  disabled={gameState.turn >= gameState.maxTurns}
                >
                  <i className="fas fa-forward me-2"></i>
                  Siguiente Turno
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Over */}
      {gameState.turn >= gameState.maxTurns && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-75" style={{ zIndex: 1050 }}>
          <div className="card bg-secondary text-white text-center">
            <div className="card-body">
              <h2>¡Juego Terminado!</h2>
              <p>Presupuesto final: ${gameState.budget?.toLocaleString() || 0}</p>
              <p>Colisiones: {gameState.collisions || 0}</p>
              <div className="d-flex gap-3 justify-content-center">
                <button className="btn btn-primary" onClick={startNewGame}>
                  Jugar Otra Vez
                </button>
                <button className="btn btn-secondary" onClick={onExit}>
                  Salir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}