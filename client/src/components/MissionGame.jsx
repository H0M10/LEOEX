
import React, { useState, useEffect } from 'react';
import SatelliteTracker3D from './SatelliteTracker3D';

export default function MissionGame({ onExit }) {
  const [gameState, setGameState] = useState({
    budget: 35000, // Menos dinero
    turn: 1,
    score: 0,
    missionProgress: 0, // 0-100%
    emergencyEvents: 0, // Contador de emergencias
    actionsLeft: 2, // NUEVO: Acciones restantes este turno
    maxActions: 2, // NUEVO: Máximo de acciones por turno
    satellites: [
      { 
        id: 'SAT-Alpha', 
        fuel: 75, // Empiezan con menos combustible
        status: 'Listo', 
        lastAction: 'Esperando órdenes',
        health: 85, // Empiezan con algo de desgaste
        missionData: 0, // Datos recolectados
        efficiency: 100 // Nueva métrica de eficiencia
      },
      { 
        id: 'SAT-Beta', 
        fuel: 60, // Más bajo aún
        status: 'Listo', 
        lastAction: 'Esperando órdenes',
        health: 70, // Más dañado
        missionData: 0,
        efficiency: 85 // Menos eficiente
      }
    ]
  });
  
  const [message, setMessage] = useState('🚨 MISIÓN EXTREMA: Recolectar 120 datos científicos en solo 12 turnos - ALTA DIFICULTAD');
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'
  const [processing, setProcessing] = useState(false);
  const [showHelp, setShowHelp] = useState(true);

  // Objetivo del juego más difícil
  const MISSION_TARGET = 120; // Más datos requeridos
  const MAX_TURNS = 12; // Menos turnos disponibles
  
  // Explicaciones de acciones más costosas
  const actionExplanations = {
    SCAN: 'Escanea la superficie terrestre. Genera 8-18 datos (según eficiencia). Consume 15% combustible. RIESGO: 25% de fallo.',
    REFUEL: 'Recarga combustible desde estación espacial. Recupera 25% combustible. Cuesta $12,000. RIESGO: Aumenta en tormentas solares.',
    REPAIR: 'Repara sistemas dañados. Restaura 30% salud. Cuesta $18,000. REQUIERE: Satélite en posición segura.',
    BOOST: 'Impulso orbital peligroso. Multiplica datos x2.5 pero RIESGO 40% de daño grave. Consume 30% combustible.'
  };

  // Verificar condiciones de victoria/derrota más estrictas
  useEffect(() => {
    const totalData = gameState.satellites.reduce((sum, sat) => sum + sat.missionData, 0);
    const activeSatellites = gameState.satellites.filter(sat => sat.health > 0 && sat.fuel > 5);
    
    if (totalData >= MISSION_TARGET) {
      setGameStatus('won');
      setMessage(`🏆 ¡MISIÓN COMPLETADA! Recolectaste ${totalData} datos científicos contra todo pronóstico`);
    } else if (gameState.turn >= MAX_TURNS) {
      setGameStatus('lost');
      setMessage(`💥 TIEMPO AGOTADO: Solo ${totalData}/${MISSION_TARGET} datos en ${MAX_TURNS} turnos. Misión crítica fallida.`);
    } else if (activeSatellites.length === 0) {
      setGameStatus('lost');
      setMessage('💥 CATÁSTROFE ESPACIAL: Todos los satélites destruidos o sin combustible');
    } else if (gameState.budget <= 0 && gameState.satellites.every(sat => sat.fuel < 15)) {
      setGameStatus('lost');
      setMessage('💥 BANCARROTA OPERACIONAL: Sin recursos para continuar la misión');
    } else if (gameState.emergencyEvents >= 3) {
      setGameStatus('lost');
      setMessage('💥 EMERGENCIAS CRÍTICAS: Demasiados fallos del sistema. Misión abortada.');
    }
  }, [gameState]);

  const performAction = (satId, action) => {
    if (gameStatus !== 'playing') return;
    
    // Verificar si quedan acciones
    if (gameState.actionsLeft <= 0) {
      setMessage('❌ NO QUEDAN ACCIONES - Debes avanzar turno');
      return;
    }
    
    setProcessing(true);
    setMessage(`🔄 ${satId} ejecutando ${action}... (Acción ${gameState.maxActions - gameState.actionsLeft + 1}/${gameState.maxActions})`);
    
    setTimeout(() => {
      setGameState(prev => {
        const newState = { ...prev };
        const satIndex = newState.satellites.findIndex(s => s.id === satId);
        const satellite = { ...newState.satellites[satIndex] };
        
        // Ejecutar acción con más riesgo
        switch(action) {
          case 'SCAN':
            const fuelCost = 15; // Más costoso
            const scanFailure = Math.random() < 0.25; // 25% de fallo
            
            if (scanFailure) {
              satellite.fuel = Math.max(0, satellite.fuel - fuelCost);
              satellite.efficiency = Math.max(0, satellite.efficiency - 10);
              satellite.lastAction = '❌ ESCANEO FALLIDO - Sistema sobrecargado';
              satellite.status = 'Error crítico';
              newState.emergencyEvents += 1;
              setMessage('🚨 ¡FALLO DE ESCANEO! Sistemas dañados');
            } else {
              // Datos basados en eficiencia y salud
              const baseData = Math.floor((satellite.efficiency / 100) * (satellite.health / 100) * 18);
              const dataGenerated = Math.max(4, baseData + Math.floor(Math.random() * 6)); // 4-18 datos
              satellite.fuel = Math.max(0, satellite.fuel - fuelCost);
              satellite.missionData += dataGenerated;
              satellite.efficiency = Math.max(20, satellite.efficiency - 2); // Desgaste gradual
              satellite.lastAction = `✅ Escaneó: ${dataGenerated} datos científicos`;
              satellite.status = satellite.fuel < 20 ? 'Combustible crítico' : 'Operativo';
              newState.score += dataGenerated;
            }
            break;
            
          case 'REFUEL':
            const solarStorm = Math.random() < 0.15; // 15% tormenta solar
            const baseCost = solarStorm ? 18000 : 12000; // Más caro, especialmente en tormentas
            
            if (newState.budget >= baseCost) {
              newState.budget -= baseCost;
              const refuelAmount = solarStorm ? 15 : 25; // Menos eficiente en tormentas
              satellite.fuel = Math.min(100, satellite.fuel + refuelAmount);
              satellite.lastAction = solarStorm ? 
                '⚡ Recarga durante tormenta solar - Eficiencia reducida' : 
                '⛽ Recarga completada en estación';
              satellite.status = 'Recargado';
              
              if (solarStorm) {
                setMessage('⚡ TORMENTA SOLAR detectada - Recarga más costosa y lenta');
                newState.emergencyEvents += 0.5;
              }
            } else {
              setMessage(`❌ Presupuesto insuficiente: $${baseCost.toLocaleString()} requeridos`);
              setProcessing(false);
              return prev;
            }
            break;
            
          case 'REPAIR':
            const repairCost = 18000; // Mucho más caro
            const inSafeZone = Math.random() < 0.7; // 70% en zona segura
            
            if (!inSafeZone) {
              setMessage('⚠️ REPARACIÓN IMPOSIBLE: Satélite en zona de alto riesgo. Espera mejor momento.');
              setProcessing(false);
              return prev;
            }
            
            if (newState.budget >= repairCost) {
              newState.budget -= repairCost;
              const repairSuccess = Math.random() < 0.85; // 15% de fallo en reparación
              
              if (repairSuccess) {
                satellite.health = Math.min(100, satellite.health + 30);
                satellite.efficiency = Math.min(100, satellite.efficiency + 15);
                satellite.lastAction = '🔧 Reparación exitosa - Sistemas optimizados';
                satellite.status = 'Totalmente operativo';
              } else {
                satellite.health = Math.max(0, satellite.health - 10); // Daño adicional
                satellite.lastAction = '💥 REPARACIÓN FALLIDA - Daño adicional';
                satellite.status = 'Sistemas críticos';
                newState.emergencyEvents += 1;
                setMessage('🚨 ¡FALLO EN REPARACIÓN! Daño adicional al satélite');
              }
            } else {
              setMessage(`❌ Presupuesto insuficiente para reparación: $${repairCost.toLocaleString()}`);
              setProcessing(false);
              return prev;
            }
            break;
            
          case 'BOOST':
            const fuelRequired = 30; // Más combustible requerido
            
            if (satellite.fuel >= fuelRequired) {
              const boostRisk = Math.random() < 0.4; // 40% de riesgo de daño grave
              satellite.fuel -= fuelRequired;
              
              if (boostRisk) {
                const severeDamage = Math.floor(Math.random() * 40 + 20); // 20-60 de daño
                satellite.health = Math.max(0, satellite.health - severeDamage);
                satellite.efficiency = Math.max(0, satellite.efficiency - 25);
                satellite.lastAction = '💥 IMPULSO CATASTRÓFICO - Daño severo al sistema';
                satellite.status = satellite.health < 30 ? 'Sistema crítico' : 'Dañado';
                newState.emergencyEvents += 1;
                setMessage('🚨 ¡IMPULSO PELIGROSO! Daño severo pero posición alcanzada');
              } else {
                satellite.lastAction = '🚀 Impulso exitoso - Próximo escaneo x2.5';
                satellite.status = 'Posición óptima';
                satellite.boosted = 2.5; // Multiplicador mayor pero más riesgoso
              }
            } else {
              setMessage(`❌ Combustible insuficiente para impulso: ${fuelRequired}% requerido`);
              setProcessing(false);
              return prev;
            }
            break;
        }
        
        newState.satellites[satIndex] = satellite;
        // Consumir una acción
        newState.actionsLeft = Math.max(0, newState.actionsLeft - 1);
        return newState;
      });
      
      const actionsRemaining = gameState.actionsLeft - 1;
      setMessage(`✅ ${action} completado en ${satId} - Acciones restantes: ${actionsRemaining}`);
      
      if (actionsRemaining <= 0) {
        // Auto-avanzar turno cuando se agoten las acciones
        setTimeout(() => {
          setMessage('⏰ Acciones completadas - Iniciando siguiente turno...');
          setTimeout(() => {
            advanceTurn();
          }, 600);
        }, 800);
      }
      
      setProcessing(false);
    }, 400);
  };

  const advanceTurn = () => {
    if (gameStatus !== 'playing') return;
    
    setProcessing(true);
    setMessage('⏰ Avanzando turno - Eventos aleatorios en progreso...');
    
    // Determinar acciones para el próximo turno (aleatorio entre 1-2)
    const nextTurnActions = Math.floor(Math.random() * 2) + 1; // 1 o 2 acciones
    
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        turn: prev.turn + 1,
        actionsLeft: nextTurnActions, // Restaurar acciones (aleatorio)
        maxActions: nextTurnActions, // Actualizar máximo para este turno
        satellites: prev.satellites.map(sat => {
          // Desgaste natural más agresivo
          const naturalFuelLoss = Math.floor(Math.random() * 10 + 8); // 8-17%
          const microMeteorite = Math.random() < 0.25; // 25% chance de micrometeoritos
          const systemFailure = Math.random() < 0.12; // 12% chance de fallo del sistema
          
          let newSat = { ...sat };
          
          // Desgaste base
          newSat.fuel = Math.max(0, newSat.fuel - naturalFuelLoss);
          newSat.efficiency = Math.max(10, newSat.efficiency - Math.floor(Math.random() * 4 + 1)); // 1-4%
          
          // Eventos críticos
          if (microMeteorite) {
            const meteoriteDamage = Math.floor(Math.random() * 25 + 10); // 10-35 daño
            newSat.health = Math.max(0, newSat.health - meteoriteDamage);
            newSat.lastAction = `☄️ IMPACTO DE MICROMETEORITOS - Daño: ${meteoriteDamage}`;
          }
          
          if (systemFailure && newSat.health > 0) {
            newSat.efficiency = Math.max(5, newSat.efficiency - 20);
            newSat.lastAction = '⚠️ FALLO CRÍTICO DEL SISTEMA - Eficiencia comprometida';
            prev.emergencyEvents = (prev.emergencyEvents || 0) + 1;
          }
          
          // Actualizar status
          if (newSat.health <= 0) {
            newSat.status = '💀 DESTRUIDO';
          } else if (newSat.fuel <= 5) {
            newSat.status = '🆘 SIN COMBUSTIBLE';
          } else if (newSat.health < 25) {
            newSat.status = '💥 CRÍTICO';
          } else if (newSat.fuel < 15) {
            newSat.status = '⚠️ EMERGENCIA';
          } else if (newSat.efficiency < 30) {
            newSat.status = '🔧 DEGRADADO';
          } else {
            newSat.status = 'Operativo';
          }
          
          newSat.boosted = false; // Reset boost
          return newSat;
        })
      }));
      
      const turnsLeft = MAX_TURNS - gameState.turn;
      setMessage(`🕒 Turno ${gameState.turn + 1}/${MAX_TURNS} - ${nextTurnActions} ${nextTurnActions === 1 ? 'acción' : 'acciones'} disponibles - ${turnsLeft} turnos restantes`);
      setProcessing(false);
    }, 600);
  };

  // Calcular progreso de misión
  const totalData = gameState.satellites.reduce((sum, sat) => sum + sat.missionData, 0);
  const missionProgress = Math.min(100, (totalData / MISSION_TARGET) * 100);

  return (
    <div className="missiongame-3d-layout d-flex vh-100" style={{background: '#0c0c0c', color: 'white', fontFamily: 'Arial, sans-serif'}}>
      {/* Panel Izquierdo: Menú, misión, satélites, acciones */}
      <div className="bg-dark p-4 overflow-auto" style={{width: 420, minWidth: 320, maxWidth: 500, boxShadow: '2px 0 8px #0008', zIndex: 2}}>
        {/* Header con misión */}
        <div style={{marginBottom: '15px'}}>
          <h1 style={{fontSize: '24px'}}>{gameStatus === 'won' ? '🏆 MISIÓN COMPLETADA' : gameStatus === 'lost' ? '💥 MISIÓN FALLIDA' : '🎯 MISIÓN LEO CIENTÍFICA'}</h1>
          <small style={{opacity: 0.9, fontSize: '13px', display: 'block', lineHeight: '1.4'}}>
            Objetivo: {totalData}/{MISSION_TARGET} datos • Turno: {gameState.turn}/{MAX_TURNS} • Acciones: {gameState.actionsLeft || 2}/{gameState.maxActions || 2}
          </small>
          <button className="btn btn-outline-danger btn-sm float-end" onClick={onExit}>Salir</button>
        </div>
        {/* Ayuda inicial */}
        {showHelp && (
          <div className="mb-3 p-3 border border-info rounded" style={{background: 'rgba(13,202,240,0.15)'}}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="mb-1 text-info">📖 GUÍA DE MISIÓN</h4>
                <p style={{fontSize: '14px'}}>
                  <strong>OBJETIVO:</strong> Recolecta {MISSION_TARGET} datos científicos en solo {MAX_TURNS} turnos - MODO EXTREMO<br/>
                  <strong>PELIGROS:</strong> Fallos de escaneo (25%), tormentas solares, micrometeoritos, reparaciones arriesgadas<br/>
                  <strong>ESTRATEGIA:</strong> Administra riesgos, toma decisiones difíciles, cada acción puede fallar
                </p>
              </div>
              <button className="btn btn-sm btn-outline-info" onClick={() => setShowHelp(false)}>×</button>
            </div>
          </div>
        )}
        {/* Progreso de misión */}
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="fw-bold">🎯 Progreso de Misión</span>
            <span>{missionProgress.toFixed(1)}%</span>
          </div>
          <div className="progress" style={{height: '10px'}}>
            <div className={`progress-bar ${missionProgress >= 100 ? 'bg-success' : missionProgress >= 70 ? 'bg-warning' : 'bg-primary'}`} role="progressbar" style={{width: `${missionProgress}%`}}></div>
          </div>
        </div>
        {/* Status */}
        <div className="mb-3 p-2 border rounded" style={{background: 'rgba(255,255,255,0.1)'}}>
          <div className="fw-bold">📡 {message}</div>
          {processing && <div className="mt-1" style={{opacity: 0.7}}>⏳ Procesando...</div>}
        </div>
        {/* Stats compactas */}
        <div className="row mb-3">
          <div className="col-6 mb-2">
            <div className="p-2 rounded text-center" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
              <div style={{fontSize: '12px', opacity: 0.8}}>💰 PRESUPUESTO</div>
              <div style={{fontSize: '18px', fontWeight: 'bold'}}>${gameState.budget.toLocaleString()}</div>
            </div>
          </div>
          <div className="col-6 mb-2">
            <div className="p-2 rounded text-center" style={{background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'}}>
              <div style={{fontSize: '12px', opacity: 0.8}}>🔬 DATOS TOTALES</div>
              <div style={{fontSize: '18px', fontWeight: 'bold'}}>{totalData}</div>
            </div>
          </div>
          <div className="col-6 mb-2">
            <div className="p-2 rounded text-center" style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}>
              <div style={{fontSize: '12px', opacity: 0.8}}>⚡ ACCIONES RESTANTES</div>
              <div style={{fontSize: '18px', fontWeight: 'bold'}}>{gameState.actionsLeft}/{gameState.maxActions}</div>
            </div>
          </div>
          <div className="col-6 mb-2">
            <div className="p-2 rounded text-center" style={{background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', color: '#333'}}>
              <div style={{fontSize: '12px', opacity: 0.8}}>⏰ TURNOS RESTANTES</div>
              <div style={{fontSize: '18px', fontWeight: 'bold'}}>{MAX_TURNS - gameState.turn}</div>
            </div>
          </div>
        </div>
        {/* Satélites y acciones */}
        <div className="mb-3">
          <h3 className="mb-2">🛰️ Flota Científica (2 Satélites)</h3>
          {gameState.satellites.map((sat) => (
            <div key={sat.id} className="mb-3 p-3 rounded" style={{background: sat.health < 30 ? 'linear-gradient(135deg, #c31432, #240b36)' : sat.fuel < 20 ? 'linear-gradient(135deg, #f7971e, #ffd200)' : 'linear-gradient(135deg, #56ab2f, #a8e6cf)', color: sat.health < 30 || sat.fuel < 20 ? 'white' : '#333'}}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="fw-bold" style={{fontSize: '18px'}}>{sat.id}</div>
                <div style={{fontSize: '12px'}}>
                  <span className="me-2">⛽ {sat.fuel}%</span>
                  <span className="me-2">❤️ {sat.health}%</span>
                  <span className="me-2">⚙️ {sat.efficiency}%</span>
                  <span>🔬 {sat.missionData}</span>
                </div>
              </div>
              <div style={{fontSize: '13px', marginBottom: '10px', opacity: 0.9}}>
                📡 {sat.status} • {sat.lastAction}
              </div>
              <div className="row">
                {Object.entries(actionExplanations).map(([action, explanation]) => (
                  <div key={action} className="col-6 mb-2">
                    <button className="btn btn-sm w-100"
                      onClick={() => performAction(sat.id, action)}
                      disabled={processing || gameStatus !== 'playing' || gameState.actionsLeft <= 0}
                      title={gameState.actionsLeft <= 0 ? 'Sin acciones restantes - Avanza turno' : explanation}
                      style={{fontWeight: 'bold', opacity: processing || gameStatus !== 'playing' || gameState.actionsLeft <= 0 ? 0.5 : 1}}
                    >
                      {action === 'SCAN' && '🔬 ESCANEAR'}
                      {action === 'REFUEL' && '⛽ RECARGAR'}
                      {action === 'REPAIR' && '🔧 REPARAR'}
                      {action === 'BOOST' && '🚀 IMPULSO'}
                    </button>
                    <div style={{fontSize: '10px', marginTop: '2px', opacity: 0.8, textAlign: 'center'}}>{explanation.split('.')[0]}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* Pantalla de victoria/derrota */}
        {gameStatus !== 'playing' && (
          <div className="p-4 rounded text-center" style={{background: gameStatus === 'won' ? 'linear-gradient(135deg, #28a745, #20c997)' : 'linear-gradient(135deg, #dc3545, #c82333)', color: 'white'}}>
            <h2 className="mb-3" style={{fontSize: '28px'}}>{gameStatus === 'won' ? '🏆 ¡VICTORIA!' : '💥 DERROTA'}</h2>
            <p style={{fontSize: '16px', margin: '10px 0', opacity: 0.9}}>{gameStatus === 'won' ? `¡Excelente trabajo! Completaste la misión recolectando ${totalData} datos científicos.` : 'La misión ha fallado. Los datos científicos no fueron suficientes para completar la investigación.'}</p>
            <button className="btn btn-light btn-lg mt-3" onClick={() => window.location.reload()}>🔄 Nueva Misión</button>
          </div>
        )}
      </div>
      {/* Panel Derecho: Mundo 3D interactivo */}
      <div className="flex-grow-1 position-relative" style={{minWidth: 0, background: '#000'}}>
        <SatelliteTracker3D />
      </div>
    </div>
  );
}