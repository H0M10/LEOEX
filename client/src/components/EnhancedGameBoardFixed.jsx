import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
          {/* Nuevo layout: menú izquierdo, canvas 3D centrado, panel derecho */}
          <div className="d-flex flex-row gap-3" style={{minHeight: '600px'}}>
            {/* Menú izquierdo */}
            <div style={{width: '340px', minWidth: '280px', maxWidth: '400px'}}>
              {/* Satellite Management Panel */}
              {/* ...satellite list and actions... */}
              {/* Tasks Panel */}
              {/* ...tasks panel... */}
              {/* Turn Management */}
              {/* ...turn management... */}
            </div>
            {/* Canvas 3D centrado */}
            <div style={{flex: 1, minWidth: '400px', maxWidth: '700px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div className="card bg-dark text-white mb-3 w-100" style={{minHeight: '420px', maxWidth: '700px', margin: '0 auto'}}>
                <div className="card-header">
                  <h6><i className="fas fa-globe me-2"></i>Mundo 3D - Satélites Orbitando</h6>
                </div>
                <div className="card-body p-0" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px'}}>
                  <div className="canvas-container" style={{ width: '100%', height: '400px', background: '#000', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px #0008' }}>
                    <Canvas camera={{ position: [5, 2, 5], fov: 60 }}>
                      <ambientLight intensity={0.3} />
                      <pointLight position={[10, 10, 10]} intensity={1} />
                      <Earth />
                      {/* Solo dos satélites orbitando para demo */}
                      {(state.satellites || []).slice(0,2).map((sat, i) => (
                        <SatelliteMarker 
                          key={sat?.id || i} 
                          sat={sat} 
                          isSelected={selected === (sat?.id)} 
                          onClick={() => setSelected(selected === (sat?.id) ? null : sat?.id)}
                        />
                      ))}
                      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
                    </Canvas>
                  </div>
                </div>
              </div>
            </div>
            {/* Panel derecho: eventos y log */}
            <div style={{width: '340px', minWidth: '280px', maxWidth: '400px'}}>
              {/* Events and Log Panel */}
              {/* ...events and log panel... */}
            </div>
          </div>
  useEffect(() => {
    if (!gameInitialized) return;

    const generateRealisticTask = () => {
      const taskTypes = [
        {
          category: "COLLISION_AVOIDANCE",
          tasks: [
            { 
              title: "Maniobra CAM Urgente", 
              description: "Objeto de 10cm detectado en trayectoria de colisión. Ventana de maniobra: 45 minutos",
              urgency: "CRITICAL", 
              baseReward: 0,
              penalty: -15000,
              fuelCost: 8,
              deadline: state.turn + 1,
              requiredCapability: "maneuvering",
              clientType: "SAFETY"
            }
          ]
        },
        {
          category: "COMMERCIAL_IMAGING",
          tasks: [
            {
              title: "Contrato Imaging Agrícola",
              description: "Captura de imágenes multiespectrales de 2500 km² en Argentina para análisis de cultivos",
              urgency: "MEDIUM",
              baseReward: 12000,
              penalty: -3000,
              fuelCost: 3,
              deadline: state.turn + 4,
              requiredCapability: "imaging",
              clientType: "COMMERCIAL"
            },
            {
              title: "Monitoreo de Deforestación",
              description: "Imágenes de alta resolución del Amazonas para ONG ambiental. Cobertura: 1800 km²",
              urgency: "HIGH",
              baseReward: 8500,
              penalty: -2000,
              fuelCost: 2,
              deadline: state.turn + 3,
              requiredCapability: "imaging",
              clientType: "NGO"
            }
          ]
        },
        {
          category: "IOT_COMMUNICATIONS",
          tasks: [
            {
              title: "Red IoT Marítima",
              description: "Relay de datos de 340 boyas oceánicas para monitoreo climático en Pacífico Norte",
              urgency: "MEDIUM",
              baseReward: 4200,
              penalty: -800,
              fuelCost: 1,
              deadline: state.turn + 5,
              requiredCapability: "communication",
              clientType: "RESEARCH"
            }
          ]
        },
        {
          category: "MAINTENANCE",
          tasks: [
            {
              title: "Mantenimiento ACS Preventivo",
              description: "Calibración sistema de control de actitud. Detectadas micro-vibraciones anómalas",
              urgency: "HIGH",
              baseReward: 0,
              penalty: -8000,
              fuelCost: 0,
              deadline: state.turn + 3,
              requiredCapability: "maintenance",
              clientType: "INTERNAL"
            }
          ]
        },
        {
          category: "GOVERNMENT_CONTRACT",
          tasks: [
            {
              title: "Contrato Defensa Nacional",
              description: "Monitoreo de fronteras y actividad marítima. Clasificado - Nivel 2",
              urgency: "HIGH",
              baseReward: 25000,
              penalty: -10000,
              fuelCost: 5,
              deadline: state.turn + 6,
              requiredCapability: "imaging",
              clientType: "GOVERNMENT"
            }
          ]
        }
      ];

      const randomCategory = taskTypes[Math.floor(Math.random() * taskTypes.length)];
      const randomTask = randomCategory.tasks[Math.floor(Math.random() * randomCategory.tasks.length)];
      
      return {
        ...randomTask,
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: state.turn,
        category: randomCategory.category
      };
    };

    // Generate tasks based on turn and current load
    const shouldGenerateTask = () => {
      if (activeTasks.length >= 5) return false;
      if (state.turn <= 2) return activeTasks.length < 2; // Start with fewer tasks
      if (state.turn <= 5) return Math.random() < 0.6;
      return Math.random() < 0.8; // Higher frequency later in game
    };

    if (shouldGenerateTask()) {
      setActiveTasks(prev => [...prev, generateRealisticTask()]);
    }
  }, [state.turn, gameInitialized, activeTasks.length]);

  // Enhanced satellite action system with realistic costs and effects
  const performSatelliteAction = async (satelliteId, action, taskId = null) => {
    if (!state || !state.id) {
      pushLog('No game initialized on server. Start a mission first.', 'error');
      return;
    }
    // Send action to server and update state with response
    try {
  const base = import.meta.env.VITE_API_BASE || '';
      const resp = await axios.post(`${base}/api/game/${state.id}/step`, {
        satActions: { [satelliteId]: action },
        taskAssignments: taskId ? { [taskId]: satelliteId } : undefined,
        advance: false
      });
      if (resp.data) {
        setState(resp.data);
      }
    } catch (err) {
      console.error('Action error', err);
      pushLog('Error comunicando acción al servidor', 'error');
    }
  };

  // Sync when a `game` prop was passed in (first load) or when server state updates
  useEffect(() => {
    if (game) {
      setState(game);
      setActiveTasks(game.activeTasks || []);
      setGameInitialized(!!game.id);
    }
  }, [game]);

  // keep local activeTasks synced with authoritative state
  useEffect(() => {
    setActiveTasks(state.activeTasks || []);
    if (state && state.id) setGameInitialized(true);
  }, [state]);

  // Advanced turn management with operational costs and penalties
  const advanceTurn = async () => {
    if (!state || !state.id) {
      pushLog('No game initialized on server. Start a mission first.', 'error');
      return;
    }
    try {
  const base = import.meta.env.VITE_API_BASE || '';
      const resp = await axios.post(`${base}/api/game/${state.id}/step`, { advance: true });
      if (resp.data) setState(resp.data);
    } catch (err) {
      console.error('Advance turn error', err);
      pushLog('Error avanzando turno en servidor', 'error');
    }
  };

  // Generate comprehensive final report
  const generateFinalReport = () => {
    const finalMetrics = performanceMetrics;
    const netProfit = finalMetrics.totalRevenue - finalMetrics.totalCosts;
    const roi = finalMetrics.totalCosts > 0 ? ((netProfit / finalMetrics.totalCosts) * 100) : 0;
    
    pushLog(`📊 === REPORTE FINAL DE OPERACIONES LEO ===`, 'info');
    pushLog(`💰 Ingresos totales: $${finalMetrics.totalRevenue.toLocaleString()}`, 'success');
    pushLog(`💸 Costos totales: $${finalMetrics.totalCosts.toLocaleString()}`, 'info');
    pushLog(`📈 Ganancia neta: $${netProfit.toLocaleString()}`, netProfit > 0 ? 'success' : 'error');
    pushLog(`📊 ROI: ${roi.toFixed(1)}%`, roi > 20 ? 'success' : roi > 0 ? 'info' : 'error');
    pushLog(`✅ Tareas completadas: ${finalMetrics.tasksCompleted}`, 'success');
    pushLog(`🛡️ Record de seguridad: ${finalMetrics.safetyRecord.toFixed(1)}%`, 'success');
    pushLog(`👥 Satisfacción del cliente: ${finalMetrics.clientSatisfaction.toFixed(1)}%`, 'info');
    
    let performance = "EXCELENTE";
    if (roi < 0) performance = "PÉRDIDA";
    else if (roi < 10) performance = "BÁSICO";
    else if (roi < 25) performance = "BUENO";
    else if (roi < 50) performance = "MUY BUENO";
    
    pushLog(`🏆 Calificación final: ${performance}`, performance === "EXCELENTE" ? 'success' : 'info');
  };

  // Task completion with realistic rewards and penalties
  const completeTask = (taskId, satelliteId) => {
    // delegate to server: assign task to satellite and update
    performSatelliteAction(satelliteId, 'IMAGING', taskId);
  };

  return (
    <div className="min-vh-100 demo-root">
      {/* Tutorial Overlay */}
      {showTutorial && (
        <div className="tutorial-overlay">
          <div className="tutorial-content">
            <h4>{tutorialSteps[tutorialStep].title}</h4>
            <p>{tutorialSteps[tutorialStep].desc}</p>
            <p className="text-info"><strong>Acción requerida:</strong> {tutorialSteps[tutorialStep].action}</p>
            <div className="d-flex justify-content-between">
              <button className="btn btn-sm btn-outline-light" onClick={() => { 
                setShowTutorial(false); 
                setTutorialStep(0);
                if (isFirstTimeSetup) {
                  setShowBudgetModal(true);
                }
              }}>Saltar Tutorial</button>
              <button className="tutorial-button" onClick={() => {
                if (tutorialStep < tutorialSteps.length - 1) {
                  setTutorialStep(tutorialStep + 1);
                } else {
                  setShowTutorial(false);
                  setTutorialStep(0);
                  if (isFirstTimeSetup) {
                    setShowBudgetModal(true);
                  }
                }
              }}>Siguiente</button>
            </div>
          </div>
        </div>
      )}

      {/* Budget Selection Modal */}
      {showBudgetModal && (
        <div className="tutorial-overlay" style={{zIndex: 1200}}>
          <div className="tutorial-content" style={{maxWidth: '800px'}}>
            <h4 className="text-primary mb-3">💰 Configuración de Presupuesto Inicial</h4>
            
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="125000"
                    min="50000"
                    max="1000000"
                    step="5000"
                    value={selectedBudget || ''}
                    onChange={(e) => setSelectedBudget(parseInt(e.target.value) || 125000)}
                  />
                  <span className="input-group-text">USD</span>
                </div>
              </div>
              <div className="col-md-6">
                <button 
                  className="btn btn-success btn-lg w-100" 
                  onClick={handleBudgetSelection} 
                  disabled={!selectedBudget || selectedBudget < 50000}
                >
                  <i className="fas fa-rocket me-2"></i>
                  Iniciar Operaciones LEO
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Game Interface */}
      {gameInitialized && (
        <div className="container-fluid p-3">
          <div className="game-header-enhanced mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-3">
                <button className="action-btn-enhanced" onClick={onExit}>
                  <i className="fas fa-arrow-left me-2"></i>Exit
                </button>
                <h4 className="game-title-enhanced">LEO Operations Command Center</h4>
              </div>
              <div className="d-flex align-items-center gap-4">
                <div className="budget-display-enhanced" style={{
                  background: 'linear-gradient(45deg, #0B1426, #1E3A5F)',
                  border: `2px solid ${((state.budget || 0) > 50000 ? '#00FF41' : (state.budget || 0) > 20000 ? '#FF6B35' : '#FF3838')}`,
                  textShadow: '0 0 8px currentColor'
                }}>
                  <i className="fas fa-dollar-sign me-1"></i>
                  ${(state.budget || 0).toLocaleString()}
                </div>
                <div className="text-white">Turno {state.turn}/{state.maxTurns}</div>
                
                {/* Real-time metrics display */}
                <div className="d-flex gap-3 small">
                  <div style={{color: '#00FF41'}}>
                    <i className="fas fa-check-circle me-1"></i>
                    {performanceMetrics.tasksCompleted} tareas
                  </div>
                  <div style={{color: '#18FFFF'}}>
                    <i className="fas fa-chart-line me-1"></i>
                    {((performanceMetrics.totalRevenue - performanceMetrics.totalCosts) / Math.max(1, performanceMetrics.totalCosts) * 100).toFixed(1)}% ROI
                  </div>
                  <div style={{color: performanceMetrics.clientSatisfaction > 80 ? '#00FF41' : performanceMetrics.clientSatisfaction > 60 ? '#FF6B35' : '#FF3838'}}>
                    <i className="fas fa-smile me-1"></i>
                    {performanceMetrics.clientSatisfaction.toFixed(0)}% satisfacción
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              {/* Satellite Management Panel */}
              <div className="satellite-list-enhanced mb-3">
                <div className="card-header">
                  <h6><i className="fas fa-satellite me-2"></i>Control de Satélites ({state.satellites.length})</h6>
                  {selected && <small className="text-success">Seleccionado: {selected}</small>}
                </div>
                <div className="card-body">
                  <div className="sat-list">
                    {(state.satellites || []).map(sat => (
                      <div 
                        key={sat?.id || Math.random()} 
                        className={`satellite-item-enhanced ${selected === sat?.id ? 'selected' : ''}`}
                        onClick={() => setSelected(selected === sat?.id ? null : sat?.id)}
                      >
                        <div>
                          <div className="satellite-name-enhanced" style={{color: '#00E5FF'}}>{sat?.name || 'Satellite'}</div>
                          <div className="satellite-status-enhanced small">
                            <div>Combustible: <span style={{color: (sat?.fuel || 0) > 60 ? '#00FF41' : (sat?.fuel || 0) > 30 ? '#FF6B35' : '#FF3838'}}>{(sat?.fuel || 0).toFixed(0)}%</span></div>
                            <div>Riesgo: <span style={{color: (sat?.collisionRisk || 0) > 0.5 ? '#FF3838' : (sat?.collisionRisk || 0) > 0.3 ? '#FF6B35' : '#00FF41'}}>{((sat?.collisionRisk || 0) * 100).toFixed(1)}%</span></div>
                            <div>Capacidad: <span style={{color: '#18FFFF'}}>{sat?.capability || 'N/A'}</span></div>
                            <div>Eficiencia: <span style={{color: (sat?.efficiency || 0) > 0.8 ? '#00FF41' : '#FF6B35'}}>{((sat?.efficiency || 0) * 100).toFixed(0)}%</span></div>
                          </div>
                        </div>
                        <div className={`sat-status ${sat?.status || 'active'}`} style={{
                          color: (sat?.status || 'active') === 'active' ? '#00FF41' : (sat?.status || 'active') === 'failed' ? '#FF3838' : '#FF6B35',
                          textShadow: '0 0 8px currentColor'
                        }}>
                          {(sat?.status || 'active').toUpperCase()}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {selected && (
                    <div className="mt-3 pt-3 border-top">
                      <h6 className="text-success">Acciones Disponibles</h6>
                      <div className="d-grid gap-2">
                        <button className="action-btn-enhanced" 
                                onClick={() => performSatelliteAction(selected, 'CAM')}
                                style={{background: 'linear-gradient(45deg, #FF3838, #FF6B35)'}}>
                          <i className="fas fa-exclamation-triangle me-2"></i>
                          Maniobra CAM - $2,500 (8% combustible)
                        </button>
      <button className="action-btn-enhanced" 
        onClick={() => performSatelliteAction(selected, 'MAINTENANCE')}
        style={{background: 'linear-gradient(45deg, #3AA0FF, #00D4FF)'}}>
                          <i className="fas fa-wrench me-2"></i>
                          Mantenimiento ACS - $1,200
                        </button>
      <button className="action-btn-enhanced" 
        onClick={() => performSatelliteAction(selected, 'REFUEL')}
        style={{background: 'linear-gradient(45deg, #FFD54F, #FFCA28)'}}>
        <i className="fas fa-gas-pump me-2"></i>
        Repostar - Llevar a 100% combustible
      </button>
      <button className="action-btn-enhanced" 
        onClick={() => performSatelliteAction(selected, 'IMAGING')}
        style={{background: 'linear-gradient(45deg, #00FF41, #39FF14)'}}>
                          <i className="fas fa-camera me-2"></i>
                          Captura Imágenes - $800 (2% combustible)
                        </button>
                        <button className="action-btn-enhanced" 
                                onClick={() => performSatelliteAction(selected, 'COMMUNICATION')}
                                style={{background: 'linear-gradient(45deg, #18FFFF, #00E5FF)'}}>
                          <i className="fas fa-broadcast-tower me-2"></i>
                          Relay Datos - $600 (1% combustible)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tasks Panel */}
              <div className="task-panel-enhanced mb-3">
                <div className="card-header">
                  <h6><i className="fas fa-tasks me-2"></i>Tareas Activas ({activeTasks.length})</h6>
                </div>
                <div className="card-body" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                  {activeTasks.length === 0 ? (
                    <p className="text-muted text-center p-4">No hay tareas activas. Las tareas se generan automáticamente cada turno.</p>
                  ) : (
                    activeTasks.map(task => {
                      const turnsLeft = task.deadline - state.turn;
                      const canComplete = !!selected; // allow client to request assignment; server will validate
                      
                      return (
                        <div key={task.id} className="task-item-enhanced">
                          <div className="d-flex justify-content-between align-items-start">
                            <div style={{flex: 1}}>
                              <div className="task-title-enhanced">
                                <i className={`fas ${task.urgency === 'CRITICAL' ? 'fa-exclamation-triangle' : 'fa-tasks'} me-2`}></i>
                                {task.title}
                              </div>
                              <p className="task-description-enhanced mb-2">{task.description}</p>
                              <div className="d-flex align-items-center gap-2">
                                <span className={`badge ${task.urgency === 'CRITICAL' ? 'bg-danger' : task.urgency === 'HIGH' ? 'bg-warning text-dark' : 'bg-info'}`}>
                                  {task.urgency}
                                </span>
                                <span className="badge bg-secondary">{task.clientType}</span>
                                {task.baseReward > 0 && (
                                  <span className="text-success">${task.baseReward.toLocaleString()}</span>
                                )}
                                {task.penalty && (
                                  <span className="text-danger">{task.penalty.toLocaleString()}</span>
                                )}
                              </div>
                            </div>
                            <div className="text-end">
                              <div className="small mb-2">Vence: Turno {task.deadline}</div>
                              <button 
                                className={`task-action-button ${canComplete ? '' : 'disabled'}`} 
                                disabled={!canComplete}
                                onClick={() => {
                                  if (canComplete) {
                                    completeTask(task.id, selected);
                                  }
                                }}
                              >
                                <i className={`fas ${canComplete ? 'fa-rocket' : 'fa-lock'} me-1`}></i>
                                {canComplete ? 'RESOLVER' : 'BLOQUEADO'}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Log Panel */}
              <div className="card bg-dark text-white mb-3">
                <div className="card-header">
                  <h6><i className="fas fa-list me-2"></i>Registro de Actividades</h6>
                </div>
                <div className="card-body" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {log.map((entry, i) => (
                    <div key={i} className={`log-entry ${entry.type}`} style={{
                      color: entry.type === 'success' ? '#00FF41' : 
                             entry.type === 'error' ? '#FF3838' : 
                             entry.type === 'info' ? '#18FFFF' : '#B0BEC5',
                      textShadow: entry.type !== 'info' ? '0 0 5px currentColor' : 'none',
                      borderLeft: `3px solid ${
                        entry.type === 'success' ? '#00FF41' : 
                        entry.type === 'error' ? '#FF3838' : 
                        entry.type === 'info' ? '#18FFFF' : '#B0BEC5'
                      }`,
                      paddingLeft: '0.5rem',
                      marginBottom: '0.25rem',
                      fontSize: '0.85rem'
                    }}>
                      {entry.message}
                    </div>
                  ))}
                </div>
              </div>

              {/* Turn Management */}
              <div className="card bg-dark text-white">
                <div className="card-header">
                  <h6><i className="fas fa-clock me-2"></i>Gestión de Turnos</h6>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div>Turno actual: {state.turn}/{state.maxTurns}</div>
                      <div className="small text-muted">
                        Costos por turno: ${(state.operationalCosts || 0).toLocaleString()}
                      </div>
                    </div>
                    <button 
                      className="btn btn-primary btn-lg"
                      onClick={() => advanceTurn()}
                      disabled={state.turn >= state.maxTurns}
                    >
                      <i className="fas fa-forward me-2"></i>
                      Finalizar Turno
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Screen */}
      {!gameInitialized && !showTutorial && !showBudgetModal && (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <div className="text-center">
            <h3 className="text-white">LEO Ops Simulator</h3>
            <p className="text-muted">Complete the tutorial and budget setup to begin operations</p>
            <button className="btn btn-primary" onClick={() => setShowTutorial(true)}>
              Start Tutorial
            </button>
          </div>
        </div>
      )}
    </div>
  );
export default EnhancedGameBoard;