import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import axios from 'axios';
import '../styles/gameboard.css';

// --- Tiny reusable Satellite object for demo
function SatelliteMarker({ sat, isSelected, onClick }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    // simple orbit animation using id as phase
    const phase = (sat.idx || 0) * 0.6;
    ref.current.position.x = Math.cos(t * 0.5 + phase) * (2.6 + (sat.alt || 0) * 0.002);
    ref.current.position.z = Math.sin(t * 0.5 + phase) * (2.6 + (sat.alt || 0) * 0.002);
    ref.current.position.y = Math.sin(t * 0.25 + phase) * 0.3;
  });

  const color = sat.status === 'failed' ? '#dc3545' : sat.status === 'eol' ? '#ffc107' : '#28a745';

  return (
    <mesh ref={ref} onClick={onClick} scale={isSelected ? 0.15 : 0.08}>
      <boxGeometry args={[0.4, 0.15, 0.4]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
      {isSelected && (
        <Html center>
          <div className="sat-popup bg-dark text-white p-2 rounded">
            <strong>{sat.name}</strong>
            <div className="small text-muted">Risk {(sat.collisionRisk*100).toFixed(1)}%</div>
          </div>
        </Html>
      )}
    </mesh>
  );
}

// Simple Earth
function Earth() {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial color="#2b6fb3" roughness={0.8} />
      </mesh>
      <Stars radius={100} depth={50} count={400} factor={4} />
    </group>
  );
}

// tutorial steps
const tutorialSteps = [
  {
    title: "Bienvenido al Simulador LEO Ops",
    desc: "Este simulador te permite experimentar con operaciones reales de satélites en órbita baja terrestre (LEO). Gestionarás una constelación de satélites, evitarás colisiones y completarás misiones dinámicas basadas en tu presupuesto inicial.",
    action: "Haz clic en 'Siguiente' para continuar"
  },
  {
    title: "Operaciones LEO",
    desc: "Las operaciones LEO incluyen monitoreo continuo de colisiones, mantenimiento de actitud y control (ACS), actualizaciones de software, telemetría y maniobras de desorbitado. Cada acción tiene costos y riesgos asociados.",
    action: "Haz clic en 'Siguiente' para aprender sobre los servicios"
  },
  {
    title: "Servicios LEO",
    desc: "Los servicios son contratos comerciales que mejoran tus capacidades operativas. Incluyen monitoreo de colisiones, sistemas de propulsión avanzados, estaciones terrestres, seguros y contratos de mantenimiento. Estos servicios afectan costos y efectividad.",
    action: "Haz clic en 'Siguiente' para ver las acciones disponibles"
  },
  {
    title: "Acciones de Satélite",
    desc: "Cada satélite tiene acciones específicas: CAM (maniobra de evasión), mantenimiento ACS, actualizaciones de software, monitoreo de telemetría y maniobras de desorbitado. Los servicios adquiridos afectan costos y efectividad.",
    action: "Haz clic en 'Siguiente' para aprender sobre tareas dinámicas"
  },
  {
    title: "Tareas Dinámicas",
    desc: "Las tareas son misiones asignadas automáticamente basadas en tu presupuesto y complejidad operativa. Incluyen gestión de riesgos, expansión de constelación y optimización de eficiencia. Completarlas proporciona recompensas adicionales.",
    action: "Haz clic en 'Siguiente' para ver las métricas de rendimiento"
  },
  {
    title: "Métricas de Rendimiento",
    desc: "Monitorea tu rendimiento con métricas clave: colisiones evitadas, eficiencia de combustible, tiempo de actividad, costo por satélite y reducción de riesgo. Estas métricas demuestran el valor de los servicios LEO comerciales.",
    action: "Haz clic en 'Siguiente' para aprender sobre la gestión de turnos"
  },
  {
    title: "Gestión de Turnos",
    desc: "Cada turno representa un período operativo. Planifica tus acciones, confirma y finaliza el turno. Los servicios adquiridos afectan automáticamente el rendimiento y la generación de nuevas tareas.",
    action: "Haz clic en 'Siguiente' para completar el tutorial"
  },
  {
    title: "¡Configuración Inicial!",
    desc: "Ahora que conoces el simulador, configurarás tu presupuesto inicial. Presupuestos más altos significan más satélites para gestionar, más tareas iniciales y mayor complejidad operativa. ¡Esto afectará directamente tu experiencia!",
    action: "Completa el tutorial para acceder a la selección de presupuesto"
  }
];

// Main playable demo
export default function EnhancedGameBoard({ game, onExit }) {
  // Basic state
  const [state, setState] = useState(() => ({
    id: game?.id || 'local-demo',
    turn: game?.turn || 1,
    maxTurns: game?.maxTurns || 12,
    budget: game?.budget || 100000,
    spent: game?.spent ?? 0,
    esgScore: game?.esgScore ?? 72,
    satellites: (game?.satellites || []).map((s, idx) => ({ ...s, idx })) || Array.from({ length: 8 }).map((_, i) => ({ id: `SAT-${i+1}`, name: `SAT-${i+1}`, idx: i, collisionRisk: Math.random()*0.6, status: 'active', alt: 500 + i*20 }))
  }));

  // Tutorial and game start states
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [gameInitialized, setGameInitialized] = useState(false);

  // Game mechanics states
  const [selected, setSelected] = useState(null);
  const [log, setLog] = useState([]);
  const [fuel, setFuel] = useState(100);
  const [health, setHealth] = useState(100);
  
  // Advanced game mechanics
  const [activeTasks, setActiveTasks] = useState([]);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    collisionsAvoided: 0,
    fuelEfficiency: 100,
    uptimePercentage: 98.5,
    costPerSatellite: 0,
    riskReduction: 0,
    missionSuccess: 0
  });
  
  // Services and upgrades
  const [purchasedServices, setPurchasedServices] = useState({
    collisionMonitoring: false,
    propulsionSystem: false,
    groundStation: false,
    insurance: false,
    maintenanceContract: false
  });
  
  // Operational states
  const [threatLevel, setThreatLevel] = useState('LOW');
  const [missionPhase, setMissionPhase] = useState('PLANNING');
  const [emergencyMode, setEmergencyMode] = useState(false);

  // Helper functions
  const pushLog = (msg, type = 'info') => {
    setLog(l => [{ turn: state.turn, message: msg, type, ts: Date.now() }, ...l].slice(0, 50));
  };

  // Dynamic task generation system
  const generateRandomTask = () => {
    const taskTypes = [
      {
        id: 'collision-avoidance',
        title: 'Maniobra de Evasión Crítica',
        description: 'Satélite en riesgo de colisión con debris espacial',
        urgency: 'HIGH',
        reward: 5000,
        penalty: 15000,
        duration: 2,
        requirements: { fuel: 15, budget: 3000 }
      },
      {
        id: 'system-maintenance',
        title: 'Mantenimiento Preventivo',
        description: 'Actualizar software y calibrar sensores',
        urgency: 'MEDIUM',
        reward: 2000,
        penalty: 8000,
        duration: 1,
        requirements: { budget: 1500 }
      },
      {
        id: 'data-collection',
        title: 'Misión de Recolección de Datos',
        description: 'Capturar imágenes de alta resolución de región específica',
        urgency: 'LOW',
        reward: 8000,
        penalty: 3000,
        duration: 3,
        requirements: { fuel: 5, satellites: 1 }
      },
      {
        id: 'emergency-response',
        title: 'Respuesta de Emergencia',
        description: 'Proporcionar comunicaciones de emergencia en desastre natural',
        urgency: 'CRITICAL',
        reward: 12000,
        penalty: 20000,
        duration: 1,
        requirements: { fuel: 25, budget: 5000 }
      },
      {
        id: 'constellation-optimization',
        title: 'Optimización de Constelación',
        description: 'Reposicionar satélites para mejorar cobertura global',
        urgency: 'MEDIUM',
        reward: 6000,
        penalty: 4000,
        duration: 4,
        requirements: { fuel: 20, satellites: 3 }
      }
    ];
    
    const selectedTask = taskTypes[Math.floor(Math.random() * taskTypes.length)];
    return {
      ...selectedTask,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      assignedTurn: state.turn,
      deadline: state.turn + selectedTask.duration,
      progress: 0,
      status: 'PENDING'
    };
  };

  // Random event system
  const triggerRandomEvent = () => {
    const events = [
      {
        type: 'SOLAR_FLARE',
        title: 'Tormenta Solar Detectada',
        description: 'Actividad solar intensa afecta comunicaciones satelitales',
        effect: 'Reduce eficiencia de comunicaciones en 30% por 2 turnos',
        duration: 2,
        impact: { communicationEfficiency: -30 }
      },
      {
        type: 'DEBRIS_FIELD',
        title: 'Campo de Debris Espacial',
        description: 'Fragmentación de satélite genera campo de debris en órbita LEO',
        effect: 'Aumenta riesgo de colisión en 50% para todos los satélites',
        duration: 3,
        impact: { collisionRisk: 50 }
      },
      {
        type: 'MARKET_BOOST',
        title: 'Demanda de Servicios Aumenta',
        description: 'Aumento en demanda de servicios satelitales',
        effect: 'Bonificación de 25% en recompensas de misiones',
        duration: 2,
        impact: { missionRewardMultiplier: 1.25 }
      },
      {
        type: 'TECH_BREAKTHROUGH',
        title: 'Avance Tecnológico',
        description: 'Nueva tecnología de propulsión disponible',
        effect: 'Reduce consumo de combustible en 20%',
        duration: 4,
        impact: { fuelEfficiency: 20 }
      }
    ];
    
    const event = events[Math.floor(Math.random() * events.length)];
    return {
      ...event,
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      startTurn: state.turn,
      endTurn: state.turn + event.duration,
      active: true
    };
  };



  // Game mechanics effects
  useEffect(() => {
    if (gameInitialized && state.turn > 1) {
      // Generate new tasks periodically
      if (Math.random() < 0.4) { // 40% chance per turn
        const newTask = generateRandomTask();
        setActiveTasks(tasks => [...tasks, newTask]);
        pushLog(`Nueva tarea asignada: ${newTask.title}`, 'info');
      }
      
      // Trigger random events
      if (Math.random() < 0.15) { // 15% chance per turn
        const newEvent = triggerRandomEvent();
        setCurrentEvents(events => [...events, newEvent]);
        pushLog(`Evento: ${newEvent.title}`, 'warning');
      }
      
      // Update threat level based on satellite risks
      const avgRisk = state.satellites.reduce((acc, sat) => acc + (sat.collisionRisk || 0), 0) / state.satellites.length;
      if (avgRisk > 0.4) setThreatLevel('HIGH');
      else if (avgRisk > 0.2) setThreatLevel('MEDIUM');
      else setThreatLevel('LOW');
    }
  }, [state.turn, gameInitialized]);

  // Clean up expired events and tasks
  useEffect(() => {
    setCurrentEvents(events => events.filter(event => event.endTurn >= state.turn));
    setActiveTasks(tasks => tasks.filter(task => task.deadline >= state.turn || task.status === 'COMPLETED'));
  }, [state.turn]);

  // Auto-generate initial tasks when game starts
  useEffect(() => {
    if (gameInitialized && activeTasks.length === 0) {
      const initialTasks = [];
      const numTasks = 3; // Always 3 initial tasks for simplicity
      for (let i = 0; i < numTasks; i++) {
        initialTasks.push(generateRandomTask());
      }
      setActiveTasks(initialTasks);
      pushLog(`${numTasks} tareas iniciales generadas`, 'info');
    }
  }, [gameInitialized]);

  // Start game automatically after tutorial
  const startGame = () => {
    setState(s => ({ ...s, budget: 100000 })); // Default budget
    setGameInitialized(true);
    pushLog('Juego iniciado automáticamente con presupuesto por defecto.');
  };

  // Perform satellite action to complete tasks and affect game state
  const performSatelliteAction = useCallback((satelliteId, action) => {
    const actionCosts = {
      'CAM': 1500,
      'MAINTENANCE': 1000,
      'DATA_COLLECTION': 800,
      'SOFTWARE_UPDATE': 1200
    };

    const cost = actionCosts[action] || 1000;
    
    // Check if player has enough budget
    if (state.budget < cost) {
      pushLog(`❌ Presupuesto insuficiente para ${action}. Necesita $${cost.toLocaleString()}`, 'warning');
      return;
    }

    // Deduct cost and update state
    setState(s => ({ 
      ...s, 
      budget: s.budget - cost,
      spent: s.spent + cost,
      satellites: s.satellites.map(sat => {
        if (sat.id === satelliteId) {
          let updatedSat = { ...sat };
          
          // Apply action-specific effects
          switch (action) {
            case 'CAM':
              updatedSat.collisionRisk = Math.max(0, sat.collisionRisk - 0.3);
              break;
            case 'MAINTENANCE':
              updatedSat.collisionRisk = Math.max(0, sat.collisionRisk - 0.1);
              break;
            case 'DATA_COLLECTION':
              // Data collection might increase satellite efficiency
              break;
            case 'SOFTWARE_UPDATE':
              updatedSat.collisionRisk = Math.max(0, sat.collisionRisk - 0.05);
              break;
          }
          
          return updatedSat;
        }
        return sat;
      })
    }));

    // Enhanced task completion system with bonuses and detailed feedback
    const completableTasks = activeTasks.filter(task => 
      !task.completed && 
      (task.action === action || task.action === 'ANY') &&
      (!task.satelliteId || task.satelliteId === satelliteId)
    );

    if (completableTasks.length > 0) {
      const task = completableTasks[0];
      
      // Calculate completion bonus based on efficiency and services
      let baseReward = task.reward;
      let efficiencyBonus = 0;
      let serviceBonus = 0;
      
      // Time efficiency bonus (completing before deadline)
      const timeRemaining = task.deadline - state.turn;
      if (timeRemaining > 2) {
        efficiencyBonus = Math.floor(baseReward * 0.15 * (timeRemaining - 1));
      }
      
      // Service enhancement bonuses
      if (purchasedServices.dataAnalytics && (action === 'DATA_COLLECTION' || task.action === 'DATA_COLLECTION')) {
        serviceBonus += Math.floor(baseReward * 0.20);
      }
      if (purchasedServices.aiAssistance) {
        serviceBonus += Math.floor(baseReward * 0.10);
      }
      if (purchasedServices.qualityAssurance) {
        serviceBonus += Math.floor(baseReward * 0.08);
      }
      
      const totalReward = baseReward + efficiencyBonus + serviceBonus;
      
      // Update state and metrics with detailed tracking
      setActiveTasks(tasks => tasks.filter(t => t.id !== task.id));
      setState(s => ({ 
        ...s, 
        budget: s.budget + totalReward,
        completedTasks: [...(s.completedTasks || []), {
          ...task,
          completedAt: state.turn,
          actualReward: totalReward,
          efficiencyBonus: efficiencyBonus,
          serviceBonus: serviceBonus
        }]
      }));
      
      setPerformanceMetrics(m => ({ 
        ...m, 
        missionSuccess: m.missionSuccess + 1,
        totalRevenue: (m.totalRevenue || 0) + totalReward,
        efficiencyBonusEarned: (m.efficiencyBonusEarned || 0) + efficiencyBonus + serviceBonus
      }));
      
      // Enhanced logging with bonus breakdown
      pushLog(`✅ TAREA COMPLETADA: ${task.title}`, 'success');
      pushLog(`💰 Recompensa base: $${baseReward.toLocaleString()}`, 'info');
      
      if (efficiencyBonus > 0) {
        pushLog(`⚡ Bonus de eficiencia: +$${efficiencyBonus.toLocaleString()}`, 'success');
      }
      if (serviceBonus > 0) {
        pushLog(`🔧 Bonus de servicios: +$${serviceBonus.toLocaleString()}`, 'success');
      }
      
      pushLog(`💵 Total recibido: $${totalReward.toLocaleString()}`, 'success');
    }

    // Log the action
    const actionNames = {
      'CAM': 'Maniobra de Evasión',
      'MAINTENANCE': 'Mantenimiento ACS', 
      'DATA_COLLECTION': 'Recolección de Datos',
      'SOFTWARE_UPDATE': 'Actualización de Software'
    };

    pushLog(`🛰️ ${actionNames[action]} ejecutada en ${satelliteId} (-$${cost.toLocaleString()})`, 'info');
    
    // Update performance metrics
    setPerformanceMetrics(m => ({
      ...m,
      costPerSatellite: (m.costPerSatellite * state.satellites.length + cost) / state.satellites.length,
      fuelEfficiency: action === 'CAM' ? Math.max(50, m.fuelEfficiency - 5) : m.fuelEfficiency
    }));
    
  }, [state.budget, state.satellites, activeTasks, pushLog]);

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
                startGame();
              }}>Saltar Tutorial</button>
              <button className="tutorial-button" onClick={() => {
                if (tutorialStep < tutorialSteps.length - 1) {
                  setTutorialStep(tutorialStep + 1);
                } else {
                  setShowTutorial(false);
                  setTutorialStep(0);
                  startGame();
                }
              }}>Siguiente</button>
            </div>
          </div>
        </div>
      )}



      {/* Main Game Interface - Only show when game is initialized */}
      {gameInitialized && (
        <div className="container-fluid p-3">
          {/* Enhanced Game Header */}
          <div className="game-header-enhanced">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-3">
                <button className="action-btn-enhanced" onClick={onExit}>
                  <i className="fas fa-arrow-left me-2"></i>Exit
                </button>
                <h4 className="game-title-enhanced">LEO Operations Command Center</h4>
                <span className="text-muted">Turn {state.turn}/{state.maxTurns}</span>
              </div>
              
              <div className="d-flex align-items-center gap-3">
                <div className="budget-display-enhanced">
                  <i className="fas fa-dollar-sign me-2"></i>
                  <span>${state.budget.toLocaleString()}</span>
                </div>
                <div className={`status-indicator ${threatLevel.toLowerCase()}`}>
                  <i className="fas fa-exclamation-triangle"></i>
                  <span>Threat: {threatLevel}</span>
                </div>
                <div className="status-indicator">
                  <i className="fas fa-gas-pump"></i>
                  <span>Fuel: {fuel}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics Dashboard */}
          <div className="metrics-grid">
            <div className="metric-card card-animate">
              <div className="metric-value">{performanceMetrics.collisionsAvoided}</div>
              <div className="metric-label">Colisiones Evitadas</div>
            </div>
            <div className="metric-card card-animate">
              <div className="metric-value">{performanceMetrics.fuelEfficiency.toFixed(1)}%</div>
              <div className="metric-label">Eficiencia de Combustible</div>
            </div>
            <div className="metric-card card-animate">
              <div className="metric-value">{performanceMetrics.uptimePercentage.toFixed(1)}%</div>
              <div className="metric-label">Tiempo de Actividad</div>
            </div>
            <div className="metric-card card-animate">
              <div className="metric-value">${performanceMetrics.costPerSatellite.toFixed(0)}</div>
              <div className="metric-label">Costo por Satélite</div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              {/* 3D Satellite Visualization */}
              <div className="card bg-dark text-white mb-3">
                <div className="card-header">
                  <h6><i className="fas fa-globe me-2"></i>Visualización Orbital LEO</h6>
                </div>
                <div className="card-body p-0">
                  <div className="canvas-container" style={{ height: '400px', background: '#000' }}>
                    <Canvas camera={{ position: [5, 2, 5], fov: 60 }}>
                      <ambientLight intensity={0.3} />
                      <pointLight position={[10, 10, 10]} intensity={1} />
                      <Earth />
                      {state.satellites.map((sat, i) => (
                        <SatelliteMarker 
                          key={sat.id || i} 
                          sat={sat} 
                          isSelected={selected === sat.id} 
                          onClick={() => setSelected(selected === sat.id ? null : sat.id)}
                        />
                      ))}
                      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
                    </Canvas>
                  </div>
                </div>
              </div>

              {/* Active Tasks Panel */}
              <div className="task-panel-enhanced mb-3">
                <div className="card-header d-flex justify-content-between align-items-center" style={{background: 'linear-gradient(135deg, #2d1b69 0%, #1e3c72 100%)', border: '2px solid #00ff88', borderRadius: '12px 12px 0 0', padding: '1rem'}}>
                  <h6 style={{color: '#00ff88', fontWeight: 'bold', textShadow: '0 0 8px rgba(0,255,136,0.6)'}}><i className="fas fa-tasks me-2"></i>Tareas Activas ({activeTasks.length})</h6>
                  <button className="action-btn-enhanced btn-sm" onClick={() => {
                    const newTask = generateRandomTask();
                    setActiveTasks(tasks => [...tasks, newTask]);
                    pushLog(`Nueva tarea generada: ${newTask.title}`, 'info');
                  }}>
                    <i className="fas fa-plus me-1"></i>Nueva Tarea
                  </button>
                </div>
                <div className="card-body" style={{ maxHeight: '350px', overflowY: 'auto', padding: '1rem', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
                  {activeTasks.length === 0 ? (
                    <p className="text-muted" style={{textAlign: 'center', padding: '2rem'}}>No hay tareas activas. Las tareas se generan automáticamente cada turno.</p>
                  ) : (
                    activeTasks.map(task => {
                      const turnsLeft = task.deadline - state.turn;
                      const isUrgent = turnsLeft <= 2;
                      const canComplete = selected && (task.action === 'ANY' || !task.action);
                      const requiresSpecificAction = task.action && task.action !== 'ANY';
                      
                      return (
                        <div key={task.id} className="task-item-enhanced">
                          <div className="d-flex justify-content-between align-items-start">
                            <div style={{flex: 1}}>
                              <div className="task-title-enhanced">
                                <i className={`fas ${task.urgency === 'CRITICAL' ? 'fa-exclamation-triangle' : task.urgency === 'HIGH' ? 'fa-clock' : 'fa-tasks'} me-2`}></i>
                                {task.title}
                              </div>
                              <p className="task-description-enhanced mb-2">{task.description}</p>
                              
                              {/* Enhanced task details */}
                              <div className="d-flex align-items-center gap-2 mb-2">
                                <span className={`badge ${task.urgency === 'CRITICAL' ? 'bg-danger' : task.urgency === 'HIGH' ? 'bg-warning text-dark' : task.urgency === 'MEDIUM' ? 'bg-info' : 'bg-secondary'} me-2`} 
                                      style={{fontSize: '0.75rem', padding: '0.4rem 0.8rem'}}>
                                  {task.urgency}
                                </span>
                                <span className="task-reward-enhanced">+${task.reward.toLocaleString()}</span>
                                <span className={`task-deadline-enhanced ${isUrgent ? 'task-deadline-urgent' : ''}`}>
                                  <i className="fas fa-hourglass-half me-1"></i>
                                  {turnsLeft} turnos
                                </span>
                              </div>

                              {/* Task progress indicator */}
                              {requiresSpecificAction && (
                                <div className="mb-2">
                                  <small className="text-info" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>
                                    <i className="fas fa-cog me-1"></i>
                                    Requiere acción: {task.action === 'CAM' ? 'Maniobra de Evasión' : 
                                                     task.action === 'MAINTENANCE' ? 'Mantenimiento' :
                                                     task.action === 'DATA_COLLECTION' ? 'Recolección de Datos' :
                                                     task.action === 'SOFTWARE_UPDATE' ? 'Actualización de Software' : task.action}
                                  </small>
                                </div>
                              )}

                              {/* Selection status and instructions */}
                              {canComplete ? (
                                <div className="mt-2 p-2 bg-success bg-opacity-25 rounded">
                                  <small style={{color: '#4caf50', fontWeight: 'bold', textShadow: '0 0 5px rgba(76,175,80,0.6)'}}>
                                    <i className="fas fa-satellite me-1"></i>
                                    {selected} preparado - ¡Haz clic para resolver la tarea!
                                  </small>
                                </div>
                              ) : requiresSpecificAction ? (
                                <div className="mt-2 p-2 bg-info bg-opacity-25 rounded">
                                  <small style={{color: '#29b6f6', textShadow: '0 0 5px rgba(41,182,246,0.6)'}}>
                                    <i className="fas fa-info-circle me-1"></i>
                                    Selecciona un satélite y ejecuta la acción requerida
                                  </small>
                                </div>
                              ) : !selected ? (
                                <div className="mt-2 p-2 bg-warning bg-opacity-25 rounded">
                                  <small style={{color: '#ffa726', textShadow: '0 0 5px rgba(255,167,38,0.6)'}}>
                                    <i className="fas fa-hand-pointer me-1"></i>
                                    Selecciona un satélite primero
                                  </small>
                                </div>
                              ) : null}
                            </div>
                            
                            <div className="text-end ms-3">
                              <div className="small mb-2" style={{color: '#ffaa00', textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>
                                Vence: Turno {task.deadline}
                              </div>
                              
                              {/* Enhanced action button */}
                              <button 
                                className={`task-action-button ${canComplete ? '' : 'disabled'}`} 
                                disabled={!canComplete}
                                onClick={() => {
                                  if (!canComplete) return;
                                  
                                  // Add completion animation
                                  const taskElement = document.querySelector(`[data-task-id="${task.id}"]`);
                                  if (taskElement) {
                                    taskElement.classList.add('task-item-completing');
                                  }
                                  
                                  // Calculate enhanced reward
                                  let baseReward = task.reward;
                                  let efficiencyBonus = turnsLeft > 2 ? Math.floor(baseReward * 0.15 * turnsLeft) : 0;
                                  let serviceBonus = 0;
                                  
                                  if (purchasedServices.dataAnalytics) serviceBonus += Math.floor(baseReward * 0.20);
                                  if (purchasedServices.aiAssistance) serviceBonus += Math.floor(baseReward * 0.10);
                                  if (purchasedServices.qualityAssurance) serviceBonus += Math.floor(baseReward * 0.08);
                                  
                                  const totalReward = baseReward + efficiencyBonus + serviceBonus;
                                  
                                  // Update state with delay for animation
                                  setTimeout(() => {
                                    setActiveTasks(tasks => tasks.filter(t => t.id !== task.id));
                                    setState(s => ({ 
                                      ...s, 
                                      budget: s.budget + totalReward,
                                      completedTasks: [...(s.completedTasks || []), {
                                        ...task,
                                        completedAt: state.turn,
                                        actualReward: totalReward,
                                        efficiencyBonus: efficiencyBonus,
                                        serviceBonus: serviceBonus
                                      }]
                                    }));
                                    
                                    setPerformanceMetrics(m => ({ 
                                      ...m, 
                                      missionSuccess: m.missionSuccess + 1,
                                      totalRevenue: (m.totalRevenue || 0) + totalReward,
                                      efficiencyBonusEarned: (m.efficiencyBonusEarned || 0) + efficiencyBonus + serviceBonus
                                    }));
                                    
                                    // Enhanced logging
                                    pushLog(`✅ TAREA COMPLETADA: ${task.title}`, 'success');
                                    pushLog(`💰 Recompensa: $${baseReward.toLocaleString()}`, 'info');
                                    if (efficiencyBonus > 0) pushLog(`⚡ Bonus eficiencia: +$${efficiencyBonus.toLocaleString()}`, 'success');
                                    if (serviceBonus > 0) pushLog(`🔧 Bonus servicios: +$${serviceBonus.toLocaleString()}`, 'success');
                                    pushLog(`💵 Total: $${totalReward.toLocaleString()}`, 'success');
                                  }, 600);
                                }}
                                data-task-id={task.id}
                              >
                                <i className={`fas ${canComplete ? 'fa-rocket' : 'fa-lock'} me-1`}></i>
                                {canComplete ? 'RESOLVER' : 'BLOQUEADO'}
                              </button>
                            </div>
                          </div>
                        );
                      }))
                  )}
                </div>
              </div>
            </div>
            
            <div className="col-md-6">
              {/* Satellite Management Panel */}
              <div className="satellite-list-enhanced mb-3">
                <div className="card-header d-flex justify-content-between align-items-center" style={{background: 'linear-gradient(135deg, #2d1b69 0%, #1e3c72 100%)', border: '2px solid #ff6b35', borderRadius: '12px 12px 0 0', padding: '1rem'}}>
                  <h6 style={{color: '#ff6b35', fontWeight: 'bold', textShadow: '0 0 8px rgba(255,107,53,0.6)', margin: 0}}><i className="fas fa-satellite me-2"></i>Control de Satélites ({state.satellites.length})</h6>
                  {selected && (
                    <small style={{color: '#00ff88', textShadow: '0 0 5px rgba(0,255,136,0.6)'}}>
                      Seleccionado: {selected}
                    </small>
                  )}
                </div>
                <div className="card-body" style={{ padding: '1rem', background: 'linear-gradient(135deg, #0f1419 0%, #1a1f3a 100%)' }}>
                  <div className="sat-list">
                    {state.satellites.map(sat => (
                      <div 
                        key={sat.id} 
                        className={`satellite-item-enhanced ${selected === sat.id ? 'selected' : ''}`}
                        onClick={() => setSelected(selected === sat.id ? null : sat.id)}
                      >
                        <div>
                          <div className="satellite-name-enhanced">{sat.name}</div>
                          <div className="satellite-status-enhanced">
                            Riesgo: <span style={{color: sat.collisionRisk > 0.5 ? '#ff4444' : sat.collisionRisk > 0.3 ? '#ffaa00' : '#00ff88', fontWeight: 'bold'}}>{(sat.collisionRisk * 100).toFixed(1)}%</span> | Alt: {sat.alt}km
                          </div>
                        </div>
                        <div className={`sat-status ${sat.status}`} style={{color: sat.status === 'active' ? '#00ff88' : sat.status === 'failed' ? '#ff4444' : '#ffaa00', fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>
                          {sat.status}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {selected && (
                    <div className="mt-3 pt-3" style={{borderTop: '2px solid #00ff88'}}>
                      <h6 style={{color: '#00ff88', fontWeight: 'bold', textShadow: '0 0 8px rgba(0,255,136,0.6)', marginBottom: '1rem'}}>Acciones Disponibles</h6>
                      <div className="d-grid gap-2">
                        <button className="action-btn-enhanced" onClick={() => performSatelliteAction(selected, 'CAM')} style={{background: 'linear-gradient(45deg, #ff4444, #ff6b35)'}}>
                          <i className="fas fa-exclamation-triangle me-2"></i>
                          Maniobra de Evasión (CAM) - $1,500
                        </button>
                        <button className="action-btn-enhanced" onClick={() => performSatelliteAction(selected, 'MAINTENANCE')} style={{background: 'linear-gradient(45deg, #3aa0ff, #00d4ff)'}}>
                          <i className="fas fa-wrench me-2"></i>
                          Mantenimiento ACS - $1,000
                        </button>
                        <button className="action-btn-enhanced" onClick={() => performSatelliteAction(selected, 'DATA_COLLECTION')} style={{background: 'linear-gradient(45deg, #00ff88, #00d4aa)'}}>
                          <i className="fas fa-camera me-2"></i>
                          Recolección de Datos - $800
                        </button>
                        <button className="action-btn-enhanced" onClick={() => performSatelliteAction(selected, 'SOFTWARE_UPDATE')} style={{background: 'linear-gradient(45deg, #ff6b35, #f7931e)'}}>
                          <i className="fas fa-download me-2"></i>
                          Actualización de Software - $1,200
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Events and Log Panel */}
              <div className="card bg-dark text-white mb-3">
                <div className="card-header">
                  <h6><i className="fas fa-bolt me-2"></i>Eventos y Registro</h6>
                </div>
                <div className="card-body" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {/* Current Events */}
                  {currentEvents.length > 0 && (
                    <div className="mb-3">
                      <h6 className="text-warning">Eventos Activos:</h6>
                      {currentEvents.map(event => (
                        <div key={event.id} className="alert alert-warning py-2 mb-2">
                          <strong>{event.title}</strong>
                          <div className="small">{event.effect}</div>
                          <div className="small text-muted">Termina: Turno {event.endTurn}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Game Log */}
                  <h6>Registro de Operaciones:</h6>
                  {log.length === 0 ? (
                    <p className="text-muted">Juego iniciado. Selecciona satélites y realiza acciones.</p>
                  ) : (
                    log.map((entry, i) => (
                      <div key={i} className={`mb-2 p-2 rounded ${entry.type === 'success' ? 'bg-success bg-opacity-10' : entry.type === 'warning' ? 'bg-warning bg-opacity-10' : 'bg-info bg-opacity-10'}`}>
                        <small className="text-info">Turno {entry.turn}</small>
                        <div className="small">{entry.message}</div>
                      </div>
                    ))
                  )}
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
                      <div className="small text-muted">Combustible disponible: {fuel}%</div>
                    </div>
                    <button 
                      className="btn btn-primary btn-lg"
                      onClick={() => {
                        setState(s => ({ ...s, turn: s.turn + 1 }));
                        setFuel(f => Math.min(100, f + 10)); // Regenerar combustible
                        pushLog(`Turno ${state.turn + 1} iniciado`, 'info');
                      }}
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

      {/* Show loading/welcome message when game is not initialized */}
      {!gameInitialized && !showTutorial && (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <div className="text-center">
            <h3 className="text-white">LEO Ops Simulator</h3>
            <p className="text-muted">Completa el tutorial para comenzar las operaciones</p>
            <button className="btn btn-primary" onClick={() => setShowTutorial(true)}>
              Iniciar Tutorial
            </button>
          </div>
        </div>
      )}
    </div>
  );
}