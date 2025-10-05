
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';

// Earth component with rotation
function Earth({ radius = 1 }) {
  const earthRef = useRef();
  
  useFrame((state) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.003; // Earth rotation
    }
  });

  const earthGeometry = useMemo(() => new THREE.SphereGeometry(radius, 64, 64), [radius]);
  
  return (
    <group ref={earthRef}>
      <mesh geometry={earthGeometry}>
        <meshStandardMaterial 
          color="#2E8B57"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      {/* Earth atmosphere */}
      <mesh geometry={earthGeometry} scale={1.03}>
        <meshBasicMaterial 
          color="#87CEEB" 
          transparent 
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

// Game Satellite component that reflects game state
function GameSatellite({ satellite, position, onClick, isActive }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.lookAt(0, 0, 0); // Always face Earth
      // Pulsing animation for active satellites
      if (isActive && state.clock) {
        const scale = 0.12 + Math.sin(state.clock.elapsedTime * 3) * 0.02;
        meshRef.current.scale.setScalar(scale);
      }
    }
  });

  // Color based on satellite health and fuel
  const getColor = () => {
    if (satellite.health <= 0) return '#ff0000'; // Dead - Red
    if (satellite.health < 30) return '#ff4444'; // Critical - Dark Red  
    if (satellite.fuel < 20) return '#ffaa00'; // Low fuel - Orange
    if (satellite.efficiency < 50) return '#ffdd44'; // Low efficiency - Yellow
    return '#00ff88'; // Healthy - Green
  };

  // Size based on satellite status
  const getSize = () => {
    if (satellite.health <= 0) return 0.06;
    if (isActive) return 0.12;
    return hovered ? 0.1 : 0.08;
  };

  return (
    <group 
      position={position} 
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh ref={meshRef} scale={getSize()}>
        <boxGeometry args={[1, 0.3, 2]} />
        <meshBasicMaterial color={getColor()} />
      </mesh>
      
      {/* Solar panels */}
      <mesh scale={[0.15, 0.02, 0.06]} position={[-0.08, 0, 0]}>
        <boxGeometry />
        <meshBasicMaterial color="#1a1a4a" />
      </mesh>
      <mesh scale={[0.15, 0.02, 0.06]} position={[0.08, 0, 0]}>
        <boxGeometry />
        <meshBasicMaterial color="#1a1a4a" />
      </mesh>
      
      {/* Data transmission beam when scanning */}
      {satellite.lastAction && satellite.lastAction.includes('ESCANEO') && (
        <mesh position={[0, -0.5, 0]} scale={[0.02, 0.5, 0.02]}>
          <cylinderGeometry />
          <meshBasicMaterial color="#00ff00" transparent opacity={0.6} />
        </mesh>
      )}
      
      {/* Satellite info on hover */}
      {(hovered || isActive) && (
        <Html>
          <div 
            style={{
              background: 'rgba(0,0,0,0.8)', 
              color: 'white', 
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              transform: 'translate(-50%, -150%)',
              border: '1px solid ' + getColor(),
              minWidth: '150px'
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{satellite.id}</div>
            <div>⛽ Fuel: {satellite.fuel}%</div>
            <div>❤️ Health: {satellite.health}%</div>
            <div>⚙️ Efficiency: {satellite.efficiency}%</div>
            <div>🔬 Data: {satellite.missionData}</div>
            <div style={{ fontSize: '10px', marginTop: '4px', opacity: 0.8 }}>
              {satellite.status}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

// Orbital paths
function OrbitalPath({ radius, color = '#ffffff', opacity = 0.3 }) {
  const points = useMemo(() => {
    const curve = new THREE.EllipseCurve(0, 0, radius, radius);
    const points = curve.getPoints(100);
    return points.map(p => new THREE.Vector3(p.x, 0, p.y));
  }, [radius]);

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attachObject={['attributes', 'position']}
          count={points.length}
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </line>
  );
}

// Data collection visualization
function DataBeams({ satellites, totalData, target }) {
  const beams = useMemo(() => {
    return satellites
      .filter(sat => sat.missionData > 0)
      .map((sat, index) => {
        const intensity = sat.missionData / 20; // Scale beam based on data collected
        return {
          id: sat.id,
          position: [
            Math.cos(index * 0.5) * 1.5,
            Math.sin(index * 0.3) * 0.3,
            Math.sin(index * 0.5) * 1.5
          ],
          intensity
        };
      });
  }, [satellites]);

  return (
    <>
      {beams.map((beam, index) => (
        <group key={beam.id}>
          <mesh position={beam.position}>
            <cylinderGeometry args={[0.01, 0.05, 2, 8]} />
            <meshBasicMaterial 
              color="#00aaff" 
              transparent 
              opacity={beam.intensity * 0.5}
            />
          </mesh>
        </group>
      ))}
    </>
  );
}

// Main 3D Scene
function Scene3D({ gameState, selectedSatellite, onSatelliteSelect, totalData, target, turn, maxTurns }) {
  // Calculate satellite positions based on time and orbital mechanics
  const getSatellitePosition = (satellite, index) => {
    const time = Date.now() * 0.0001 + index * 2;
    const baseRadius = 1.4 + index * 0.1;
    const angle = time * (0.8 + index * 0.1);
    
    return [
      Math.cos(angle) * baseRadius,
      Math.sin(time * 0.3 + index) * 0.3,
      Math.sin(angle) * baseRadius
    ];
  };

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} />
      <pointLight position={[0, 0, 0]} intensity={0.5} color="#ffaa44" />
      
      <Stars radius={300} depth={50} count={2000} factor={4} />
      
      <Earth />
      
      {/* LEO orbital zones */}
      <OrbitalPath radius={1.3} color="#44ff88" opacity={0.2} />
      <OrbitalPath radius={1.5} color="#ffaa44" opacity={0.3} />
      <OrbitalPath radius={1.7} color="#ff4488" opacity={0.2} />
      
      {/* Game satellites with dynamic positions */}
      {gameState.satellites.map((satellite, index) => (
        <GameSatellite
          key={satellite.id}
          satellite={satellite}
          position={getSatellitePosition(satellite, index)}
          onClick={() => onSatelliteSelect(satellite)}
          isActive={selectedSatellite?.id === satellite.id}
        />
      ))}
      
      {/* Data collection beams */}
      <DataBeams satellites={gameState.satellites} totalData={totalData} target={target} />
      
      {/* Progress indicator in 3D space */}
      <Text
        position={[0, 2, 0]}
        fontSize={0.2}
        color="#00aaff"
        anchorX="center"
        anchorY="middle"
      >
        Mission Progress: {Math.round((totalData / target) * 100)}%
      </Text>
      
      <Text
        position={[0, 1.7, 0]}
        fontSize={0.15}
        color="#ffaa44"
        anchorX="center"
        anchorY="middle"
      >
        Turn {turn}/{maxTurns} • Data: {totalData}/{target}
      </Text>
      
      <OrbitControls 
        enableDamping 
        dampingFactor={0.05}
        minDistance={2.5}
        maxDistance={8}
        autoRotate={false}
        autoRotateSpeed={0.5}
      />
    </>
  );
}

export default function MissionGame({ onExit }) {
  // [Previous MissionGame state and logic - copying from original file]
  const [gameState, setGameState] = useState({
    budget: 35000,
    turn: 1,
    score: 0,
    missionProgress: 0,
    emergencyEvents: 0,
    actionsLeft: 2,
    maxActions: 2,
    satellites: [
      { 
        id: 'SAT-Alpha', 
        fuel: 75,
        status: 'Listo', 
        lastAction: 'Esperando órdenes',
        health: 85,
        missionData: 0,
        efficiency: 100
      },
      { 
        id: 'SAT-Beta', 
        fuel: 60,
        status: 'Listo', 
        lastAction: 'Esperando órdenes',
        health: 70,
        missionData: 0,
        efficiency: 85
      }
    ]
  });
  
  const [message, setMessage] = useState('🚨 MISIÓN EXTREMA: Recolectar 120 datos científicos en solo 12 turnos - ALTA DIFICULTAD');
  const [gameStatus, setGameStatus] = useState('playing');
  const [processing, setProcessing] = useState(false);
  const [showHelp, setShowHelp] = useState(true);
  const [selectedSatellite, setSelectedSatellite] = useState(null);
  const [show3D, setShow3D] = useState(true);

  const MISSION_TARGET = 120;
  const MAX_TURNS = 12;
  
  const actionExplanations = {
    SCAN: 'Escanea la superficie terrestre. Genera 8-18 datos (según eficiencia). Consume 15% combustible. RIESGO: 25% de fallo.',
    REFUEL: 'Recarga combustible desde estación espacial. Recupera 25% combustible. Cuesta $12,000. RIESGO: Aumenta en tormentas solares.',
    REPAIR: 'Repara sistemas dañados. Restaura 30% salud. Cuesta $18,000. REQUIERE: Satélite en posición segura.',
    BOOST: 'Impulso orbital peligroso. Multiplica datos x2.5 pero RIESGO 40% de daño grave. Consume 30% combustible.'
  };

  // [Include all the original game logic functions here - performAction, advanceTurn, etc.]
  const performAction = (satId, action) => {
    if (gameStatus !== 'playing') return;
    
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
        
        switch(action) {
          case 'SCAN':
            const fuelCost = 15;
            const scanFailure = Math.random() < 0.25;
            
            if (scanFailure) {
              satellite.fuel = Math.max(0, satellite.fuel - fuelCost);
              satellite.efficiency = Math.max(0, satellite.efficiency - 10);
              satellite.lastAction = '❌ ESCANEO FALLIDO - Sistema sobrecargado';
              satellite.status = 'Error de sistema';
              setMessage(`💥 FALLO CRÍTICO en ${satId}: Escaneo fallido, sistemas dañados`);
            } else {
              if (satellite.fuel >= fuelCost) {
                satellite.fuel -= fuelCost;
                const baseData = Math.floor(Math.random() * 11 + 8);
                const efficiencyMultiplier = satellite.efficiency / 100;
                const boostMultiplier = satellite.boosted || 1;
                const finalData = Math.floor(baseData * efficiencyMultiplier * boostMultiplier);
                
                satellite.missionData += finalData;
                satellite.lastAction = `✅ ESCANEO EXITOSO: +${finalData} datos científicos`;
                satellite.status = 'Recolectando datos';
                satellite.boosted = 1;
                setMessage(`🎯 ${satId} recolectó ${finalData} datos científicos exitosamente`);
              } else {
                setMessage(`❌ Combustible insuficiente en ${satId} para escanear`);
                setProcessing(false);
                return prev;
              }
            }
            break;
            
          case 'REFUEL':
            if (newState.budget >= 12000) {
              newState.budget -= 12000;
              const fuelGain = 25;
              satellite.fuel = Math.min(100, satellite.fuel + fuelGain);
              satellite.lastAction = `⛽ RECARGA: +${fuelGain}% combustible`;
              satellite.status = 'Recargando';
              setMessage(`⛽ ${satId} recargado exitosamente por $12,000`);
            } else {
              setMessage(`💰 Fondos insuficientes para recargar ${satId}`);
              setProcessing(false);
              return prev;
            }
            break;
            
          case 'REPAIR':
            if (newState.budget >= 18000) {
              newState.budget -= 18000;
              const healthGain = 30;
              const efficiencyGain = 25;
              satellite.health = Math.min(100, satellite.health + healthGain);
              satellite.efficiency = Math.min(100, satellite.efficiency + efficiencyGain);
              satellite.lastAction = `🔧 REPARACIÓN: +${healthGain}% salud, +${efficiencyGain}% eficiencia`;
              satellite.status = 'En reparación';
              setMessage(`🔧 ${satId} reparado exitosamente por $18,000`);
            } else {
              setMessage(`💰 Fondos insuficientes para reparar ${satId}`);
              setProcessing(false);
              return prev;
            }
            break;
            
          case 'BOOST':
            const fuelRequired = 30;
            if (satellite.fuel >= fuelRequired) {
              const boostRisk = Math.random() < 0.4;
              satellite.fuel -= fuelRequired;
              
              if (boostRisk) {
                const severeDamage = Math.floor(Math.random() * 40 + 20);
                satellite.health = Math.max(0, satellite.health - severeDamage);
                satellite.efficiency = Math.max(0, satellite.efficiency - 25);
                satellite.lastAction = '💥 IMPULSO CATASTRÓFICO - Daño severo al sistema';
                satellite.status = satellite.health < 30 ? 'Sistema crítico' : 'Dañado';
                newState.emergencyEvents += 1;
                setMessage('🚨 ¡IMPULSO PELIGROSO! Daño severo pero posición alcanzada');
              } else {
                satellite.lastAction = '🚀 Impulso exitoso - Próximo escaneo x2.5';
                satellite.status = 'Posición óptima';
                satellite.boosted = 2.5;
              }
            } else {
              setMessage(`❌ Combustible insuficiente para impulso: ${fuelRequired}% requerido`);
              setProcessing(false);
              return prev;
            }
            break;
        }
        
        newState.satellites[satIndex] = satellite;
        newState.actionsLeft = Math.max(0, newState.actionsLeft - 1);
        return newState;
      });
      
      const actionsRemaining = gameState.actionsLeft - 1;
      setMessage(`✅ ${action} completado en ${satId} - Acciones restantes: ${actionsRemaining}`);
      
      if (actionsRemaining <= 0) {
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
    
    const nextTurnActions = Math.floor(Math.random() * 2) + 1;
    
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        turn: prev.turn + 1,
        actionsLeft: nextTurnActions,
        maxActions: nextTurnActions,
        satellites: prev.satellites.map(sat => {
          const naturalFuelLoss = Math.floor(Math.random() * 10 + 8);
          const microMeteorite = Math.random() < 0.25;
          const systemFailure = Math.random() < 0.12;
          
          let newSat = { ...sat };
          
          newSat.fuel = Math.max(0, newSat.fuel - naturalFuelLoss);
          
          if (microMeteorite) {
            const damage = Math.floor(Math.random() * 15 + 10);
            newSat.health = Math.max(0, newSat.health - damage);
            newSat.lastAction = '💥 Impacto de micrometeorito detectado';
          }
          
          if (systemFailure) {
            const efficiencyLoss = Math.floor(Math.random() * 20 + 10);
            newSat.efficiency = Math.max(0, newSat.efficiency - efficiencyLoss);
            newSat.lastAction = '⚠️ Fallo parcial del sistema';
          }
          
          if (newSat.health <= 0) {
            newSat.status = 'Sistema destruido';
          } else if (newSat.fuel <= 0) {
            newSat.status = 'Sin combustible';
          } else {
            newSat.status = 'Operativo';
          }
          
          return newSat;
        })
      }));
      
      const turnsLeft = MAX_TURNS - gameState.turn;
      setMessage(`🕒 Turno ${gameState.turn + 1}/${MAX_TURNS} - ${nextTurnActions} ${nextTurnActions === 1 ? 'acción' : 'acciones'} disponibles - ${turnsLeft} turnos restantes`);
      setProcessing(false);
    }, 600);
  };

  // Victory/Defeat conditions
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

  const totalData = gameState.satellites.reduce((sum, sat) => sum + sat.missionData, 0);
  const missionProgress = Math.min(100, (totalData / MISSION_TARGET) * 100);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a3e 50%, #2d1b69 100%)',
      fontFamily: 'Arial, sans-serif',
      color: 'white',
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      {/* Header compacto */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '15px 20px',
        background: gameStatus === 'won' ? 'linear-gradient(90deg, #28a745, #20c997)' : 
                   gameStatus === 'lost' ? 'linear-gradient(90deg, #dc3545, #e83e8c)' :
                   'linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)',
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        position: 'relative',
        zIndex: 1000
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '20px' }}>
            {gameStatus === 'won' ? '🏆 MISIÓN COMPLETADA' : 
             gameStatus === 'lost' ? '💥 MISIÓN FALLIDA' : 
             '🎯 MISIÓN LEO CIENTÍFICA'}
          </h1>
          <small style={{ opacity: 0.9, fontSize: '12px' }}>
            {totalData}/{MISSION_TARGET} datos • Turno {gameState.turn}/{MAX_TURNS} • {gameState.actionsLeft}/{gameState.maxActions} acciones
          </small>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button 
            onClick={() => setShow3D(!show3D)}
            style={{
              padding: '6px 12px',
              background: show3D ? 'linear-gradient(45deg, #00ff88, #00cc66)' : 'linear-gradient(45deg, #666, #888)',
              color: 'white',
              border: 'none',
              borderRadius: '15px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '11px'
            }}
          >
            {show3D ? '🌍 3D ON' : '📊 2D'}
          </button>
          
          <button 
            onClick={onExit}
            style={{
              padding: '8px 16px',
              background: 'linear-gradient(45deg, #2196F3, #1976D2)',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '12px'
            }}
          >
            ← Salir
          </button>
        </div>
      </div>

      {/* Layout principal: Panel de control + Vista 3D */}
      <div style={{ 
        display: 'flex', 
        flex: 1, 
        gap: '12px', 
        padding: '10px',
        height: 'calc(100vh - 70px)'
      }}>
        
        {/* Panel de Control del Juego (Izquierda) */}
        <div style={{
          width: show3D ? '42%' : '100%',
          minWidth: '300px',
          maxWidth: show3D ? '420px' : 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          overflowY: 'auto',
          transition: 'width 0.3s ease'
        }}>
          
          {/* Ayuda compacta */}
          {showHelp && (
            <div style={{ 
              padding: '12px',
              background: 'rgba(13, 202, 240, 0.15)',
              border: '2px solid #0dcaf0',
              borderRadius: '8px',
              fontSize: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h5 style={{ margin: 0, color: '#0dcaf0' }}>📖 OBJETIVO</h5>
                  <p style={{ margin: '5px 0', fontSize: '11px' }}>
                    Recolecta {MISSION_TARGET} datos en {MAX_TURNS} turnos. ¡Cada acción puede fallar!
                  </p>
                </div>
                <button onClick={() => setShowHelp(false)} style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  color: '#0dcaf0', 
                  fontSize: '16px',
                  cursor: 'pointer'
                }}>×</button>
              </div>
            </div>
          )}

          {/* Panel de estado mejorado */}
          <div style={{ 
            padding: '15px',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.3)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            minHeight: '60px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <div style={{ 
              fontSize: '14px', 
              fontWeight: 'bold',
              lineHeight: '1.4',
              color: '#ffffff'
            }}>
              📡 {message}
            </div>
            {processing && (
              <div style={{ 
                marginTop: '8px', 
                opacity: 0.8, 
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div className="spinner-border spinner-border-sm" role="status" style={{width: '16px', height: '16px'}}></div>
                Procesando comando...
              </div>
            )}
          </div>

          {/* Progress bar mejorado */}
          <div style={{ 
            padding: '15px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '14px' }}>🎯 Progreso de la Misión</span>
              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{missionProgress.toFixed(1)}%</span>
            </div>
            <div style={{ 
              width: '100%', 
              height: '12px', 
              background: 'rgba(0,0,0,0.3)', 
              borderRadius: '6px',
              overflow: 'hidden',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
            }}>
              <div style={{ 
                width: `${missionProgress}%`, 
                height: '100%', 
                background: missionProgress >= 100 ? 'linear-gradient(90deg, #28a745, #20c997)' : 
                           missionProgress >= 70 ? 'linear-gradient(90deg, #ffc107, #fd7e14)' : 
                           'linear-gradient(90deg, #007bff, #0056b3)',
                transition: 'width 0.5s ease',
                borderRadius: '6px',
                boxShadow: '0 0 10px rgba(255,255,255,0.3)'
              }}></div>
            </div>
          </div>

          {/* Stats en grid mejorado */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '10px'
          }}>
            <div style={{ 
              padding: '12px', 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: '0 4px 15px rgba(102,126,234,0.3)'
            }}>
              <div style={{ fontSize: '11px', opacity: 0.9, marginBottom: '4px' }}>💰 PRESUPUESTO</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>${gameState.budget.toLocaleString()}</div>
            </div>
            
            <div style={{ 
              padding: '12px', 
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: '0 4px 15px rgba(79,172,254,0.3)'
            }}>
              <div style={{ fontSize: '11px', opacity: 0.9, marginBottom: '4px' }}>🔬 DATOS</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{totalData}/{MISSION_TARGET}</div>
            </div>
            
            <div style={{ 
              padding: '12px', 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: '0 4px 15px rgba(240,147,251,0.3)'
            }}>
              <div style={{ fontSize: '11px', opacity: 0.9, marginBottom: '4px' }}>⚡ ACCIONES</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{gameState.actionsLeft}/{gameState.maxActions}</div>
            </div>
            
            <div style={{ 
              padding: '12px', 
              background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
              borderRadius: '8px',
              textAlign: 'center',
              color: '#333',
              boxShadow: '0 4px 15px rgba(168,237,234,0.3)'
            }}>
              <div style={{ fontSize: '11px', opacity: 0.8, marginBottom: '4px' }}>⏰ TURNOS</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{MAX_TURNS - gameState.turn}</div>
            </div>
          </div>

          {/* Satélites con controles mejorados */}
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>🛰️ Control de Satélites</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {gameState.satellites.map((sat) => (
                <div 
                  key={sat.id} 
                  style={{ 
                    padding: '15px',
                    background: sat.health < 30 ? 'linear-gradient(135deg, #c31432, #240b36)' :
                               sat.fuel < 20 ? 'linear-gradient(135deg, #f7971e, #ffd200)' :
                               'linear-gradient(135deg, #56ab2f, #a8e6cf)',
                    borderRadius: '10px',
                    color: sat.health < 30 || sat.fuel < 20 ? 'white' : '#333',
                    border: selectedSatellite?.id === sat.id ? '3px solid #00ff88' : '1px solid rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: selectedSatellite?.id === sat.id ? '0 0 15px rgba(0,255,136,0.5)' : '0 2px 8px rgba(0,0,0,0.2)'
                  }}
                  onClick={() => setSelectedSatellite(selectedSatellite?.id === sat.id ? null : sat)}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '10px'
                  }}>
                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{sat.id}</div>
                    <div style={{ fontSize: '12px', display: 'flex', gap: '8px' }}>
                      <span title="Combustible">⛽{sat.fuel}%</span>
                      <span title="Salud">❤️{sat.health}%</span>
                      <span title="Eficiencia">⚙️{sat.efficiency}%</span>
                      <span title="Datos recolectados">🔬{sat.missionData}</span>
                    </div>
                  </div>
                  
                  <div style={{ fontSize: '12px', marginBottom: '12px', opacity: 0.9, minHeight: '16px' }}>
                    {sat.status} • {sat.lastAction}
                  </div>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '8px'
                  }}>
                    {Object.entries(actionExplanations).map(([action, explanation]) => (
                      <button 
                        key={action}
                        onClick={(e) => {
                          e.stopPropagation();
                          performAction(sat.id, action);
                        }}
                        disabled={processing || gameStatus !== 'playing' || gameState.actionsLeft <= 0}
                        style={{
                          padding: '8px 12px',
                          background: gameState.actionsLeft <= 0 ? 'rgba(100,100,100,0.3)' :
                                     processing ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.95)',
                          color: gameState.actionsLeft <= 0 ? '#666' : '#333',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: processing || gameStatus !== 'playing' || gameState.actionsLeft <= 0 ? 'not-allowed' : 'pointer',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          opacity: processing || gameStatus !== 'playing' || gameState.actionsLeft <= 0 ? 0.5 : 1,
                          transition: 'all 0.2s ease',
                          textAlign: 'center'
                        }}
                        title={explanation}
                        onMouseEnter={(e) => {
                          if (!processing && gameStatus === 'playing' && gameState.actionsLeft > 0) {
                            e.target.style.background = 'rgba(255,255,255,1)';
                            e.target.style.transform = 'translateY(-1px)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!processing && gameStatus === 'playing' && gameState.actionsLeft > 0) {
                            e.target.style.background = 'rgba(255,255,255,0.95)';
                            e.target.style.transform = 'translateY(0)';
                          }
                        }}
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Panel 3D (Derecha) */}
        {show3D && (
          <div style={{
            width: '58%',
            minWidth: '400px',
            background: 'rgba(0,0,0,0.4)',
            borderRadius: '12px',
            border: '2px solid rgba(255,255,255,0.2)',
            overflow: 'hidden',
            position: 'relative',
            boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              position: 'absolute',
              top: '15px',
              left: '15px',
              zIndex: 100,
              background: 'rgba(0,0,0,0.8)',
              padding: '10px 15px',
              borderRadius: '8px',
              fontSize: '13px',
              color: '#ffffff',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              🌍 Vista 3D - Haz clic en los satélites para seleccionarlos
            </div>
            
            <Canvas
              camera={{ position: [3, 2, 3], fov: 60 }}
              style={{ width: '100%', height: '100%', background: '#000011' }}
            >
              <Scene3D 
                gameState={gameState}
                selectedSatellite={selectedSatellite}
                onSatelliteSelect={setSelectedSatellite}
                totalData={totalData}
                target={MISSION_TARGET}
                turn={gameState.turn}
                maxTurns={MAX_TURNS}
              />
            </Canvas>
          </div>
        )}
      </div>

      {/* Victory/Defeat screen */}
      {gameStatus !== 'playing' && (
        <div style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{ 
            padding: '30px',
            background: gameStatus === 'won' ? 
              'linear-gradient(135deg, #28a745, #20c997)' : 
              'linear-gradient(135deg, #dc3545, #c82333)',
            borderRadius: '15px',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            maxWidth: '500px',
            margin: '20px'
          }}>
            <h2 style={{ margin: '0 0 15px 0', fontSize: '28px' }}>
              {gameStatus === 'won' ? '🏆 ¡VICTORIA!' : '💥 DERROTA'}
            </h2>
            <p style={{ fontSize: '16px', margin: '10px 0', opacity: 0.9 }}>
              {gameStatus === 'won' ? 
                `¡Excelente trabajo! Completaste la misión recolectando ${totalData} datos científicos en ${gameState.turn} turnos.` :
                `La misión ha fallado. Solo recolectaste ${totalData}/${MISSION_TARGET} datos científicos en ${gameState.turn} turnos.`
              }
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
              <button 
                onClick={() => window.location.reload()}
                style={{
                  padding: '12px 25px',
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: '2px solid white',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                🔄 Nueva Misión
              </button>
              <button 
                onClick={onExit}
                style={{
                  padding: '12px 25px',
                  background: 'rgba(255,255,255,0.9)',
                  color: '#333',
                  border: 'none',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                ← Mission Control
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}