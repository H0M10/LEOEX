const { v4: uuidv4 } = require('uuid');

// --- Simple, minimal game engine for LEO game ---
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

const CONFIG = {
  REFUEL_COST: 3500,        // Aumentado: repostar es caro
  CAM_COST: 4200,           // Aumentado: maniobras costosas
  IMAGING_COST: 1500,       // Costo de operaciones de imagen
  IMAGING_REWARD: 2200,     // NUEVO: recompensa base por scan exitoso
  MAINT_COST: 2800,         // Aumentado: mantenimiento costoso
  OP_COST: 3500,            // Reducido: costo operacional más justo
  COLLISION_COST: 35000,    // Aumentado: colisiones muy costosas
  EMERGENCY_COST: 6000,     // Reducido: emergencias más justas
  EFFICIENCY_BONUS: 1.2,    // Nuevo: bonus por eficiencia
  DISCOVERY_BONUS: 3500     // NUEVO: bonus por descubrimientos
};

const TASKS = [
  { title: 'Evitar Colisión Crítica', reward: 3500, penalty: 25000, fuel: 8, turns: 1, type: 'CAM', priority: 'CRITICAL' },
  { title: 'Contrato Comercial Premium', reward: 22000, penalty: 5000, fuel: 4, turns: 3, type: 'IMAGING', priority: 'HIGH' },
  { title: 'Imágenes Comerciales', reward: 15000, penalty: 3000, fuel: 3, turns: 4, type: 'IMAGING', priority: 'MEDIUM' },
  { title: 'Monitoreo Ambiental ONG', reward: 12000, penalty: 2500, fuel: 2, turns: 3, type: 'IMAGING', priority: 'MEDIUM' },
  { title: 'Red IoT Urbana', reward: 8500, penalty: 1200, fuel: 1, turns: 5, type: 'COMM', priority: 'LOW' },
  { title: 'Comunicaciones de Emergencia', reward: 11000, penalty: 4000, fuel: 2, turns: 2, type: 'COMM', priority: 'HIGH' },
  { title: 'Mantenimiento Preventivo', reward: 3500, penalty: 12000, fuel: 1, turns: 2, type: 'MAINTENANCE', priority: 'MEDIUM' },
  { title: 'Inspección Regulatoria', reward: 2500, penalty: 15000, fuel: 0, turns: 1, type: 'MAINTENANCE', priority: 'CRITICAL' },
  { title: 'Contrato Gubernamental', reward: 28000, penalty: 8000, fuel: 5, turns: 4, type: 'IMAGING', priority: 'HIGH' },
  { title: 'Monitoreo Científico', reward: 18000, penalty: 3500, fuel: 3, turns: 3, type: 'IMAGING', priority: 'MEDIUM' },
  { title: 'Exploración de Asteroides', reward: 25000, penalty: 2000, fuel: 6, turns: 5, type: 'IMAGING', priority: 'HIGH' },
  { title: 'Comunicaciones Comerciales', reward: 7500, penalty: 1500, fuel: 1, turns: 4, type: 'COMM', priority: 'LOW' },
  { title: 'Mantenimiento de Rutina', reward: 2800, penalty: 8000, fuel: 1, turns: 3, type: 'MAINTENANCE', priority: 'LOW' }
];

function createSat(id) {
  return {
    id,
    name: id,
    status: 'active',
    fuel: 100,
    collisionRisk: 0.1 + Math.random() * 0.2,
    efficiency: 0.8 + Math.random() * 0.2
  };
}

function createTask(template, turn) {
  return {
    id: uuidv4(),
    title: template.title,
    reward: template.reward,
    penalty: template.penalty,
    fuel: template.fuel,
    deadline: turn + template.turns,
    type: template.type
  };
}

function createInitialState(budget = 65000, satellitesCount = 4) {
  const satellites = [];
  for (let i = 0; i < satellitesCount; i++) satellites.push(createSat(`SAT-${i+1}`));
  
  // Crear tareas iniciales más balanceadas y favorables
  const initialTasks = [
    createTask(TASKS[2], 1), // Imágenes Comerciales (reward: 15000)
    createTask(TASKS[4], 1), // Red IoT (reward: 8500)
    createTask(TASKS[11], 1), // Comunicaciones Comerciales (reward: 7500)
    createTask(TASKS[12], 1)  // Mantenimiento de Rutina (reward: 2800)
  ];
  
  const state = {
    id: uuidv4(),
    turn: 1,
    maxTurns: 15, // Más turnos para más estrategia
    budget,
    satellites,
    tasks: initialTasks,
    history: [],
    collisions: 0,
    totalEarned: 0,
    totalSpent: 0,
    tasksCompleted: 0,
    emergencies: 0
  };
  return state;
}

function stepTurn(state, { actions = {}, assignments = {}, advance = false } = {}) {
  const s = JSON.parse(JSON.stringify(state));
  // Satellite actions (REFUEL, CAM, IMAGING, MAINTENANCE)
  for (const [satId, action] of Object.entries(actions)) {
    const sat = s.satellites.find(x => x.id === satId);
    if (!sat || sat.status !== 'active') continue;
    if (action === 'REFUEL') {
      if (s.budget >= CONFIG.REFUEL_COST) {
        s.budget -= CONFIG.REFUEL_COST;
        s.totalSpent += CONFIG.REFUEL_COST;
        sat.fuel = 100;
        s.history.push({ turn: s.turn, event: `REFUEL ${sat.id} (-$${CONFIG.REFUEL_COST.toLocaleString()})`, cost: CONFIG.REFUEL_COST });
      } else {
        s.history.push({ turn: s.turn, event: `REFUEL FAILED - Insuficientes fondos (${sat.id})`, type: 'error' });
      }
    } else if (action === 'CAM') {
      if (sat.fuel >= 8 && s.budget >= CONFIG.CAM_COST) {
        s.budget -= CONFIG.CAM_COST;
        s.totalSpent += CONFIG.CAM_COST;
        sat.fuel -= 8;
        sat.collisionRisk = clamp(sat.collisionRisk - 0.2, 0, 1);
        s.history.push({ turn: s.turn, event: `Maniobra Anti-Colisión ${sat.id} (-$${CONFIG.CAM_COST.toLocaleString()})`, cost: CONFIG.CAM_COST });
      } else if (sat.fuel < 8) {
        s.history.push({ turn: s.turn, event: `CAM FAILED - Combustible insuficiente (${sat.id})`, type: 'error' });
      } else {
        s.history.push({ turn: s.turn, event: `CAM FAILED - Fondos insuficientes (${sat.id})`, type: 'error' });
      }
    } else if (action === 'IMAGING') {
      if (sat.fuel >= 2 && s.budget >= CONFIG.IMAGING_COST) {
        s.budget -= CONFIG.IMAGING_COST;
        s.totalSpent += CONFIG.IMAGING_COST;
        sat.fuel -= 2;
        sat.efficiency = clamp(sat.efficiency + 0.05, 0, 1); // Mejora eficiencia con práctica
        
        // NUEVO: Recompensas por operaciones de imagen
        const baseReward = CONFIG.IMAGING_REWARD;
        const efficiencyBonus = sat.efficiency > 0.85 ? 1.3 : sat.efficiency > 0.7 ? 1.15 : 1.0;
        const discoveryChance = Math.random();
        
        let finalReward = Math.floor(baseReward * efficiencyBonus);
        let eventText = `📡 Scan completado por ${sat.id}: -$${CONFIG.IMAGING_COST.toLocaleString()} +$${finalReward.toLocaleString()}`;
        
        // Probabilidad de descubrimientos valiosos
        if (discoveryChance < 0.15) { // 15% de probabilidad
          finalReward += CONFIG.DISCOVERY_BONUS;
          eventText += ` 🔍 ¡DESCUBRIMIENTO VALIOSO! (+$${CONFIG.DISCOVERY_BONUS.toLocaleString()})`;
        } else if (discoveryChance < 0.35) { // 20% más de probabilidad de bonus menor
          const smallBonus = Math.floor(CONFIG.DISCOVERY_BONUS * 0.3);
          finalReward += smallBonus;
          eventText += ` 📊 Datos premium (+$${smallBonus.toLocaleString()})`;
        }
        
        s.budget += finalReward;
        s.totalEarned += finalReward;
        s.history.push({ turn: s.turn, event: eventText, type: 'imaging', reward: finalReward, cost: CONFIG.IMAGING_COST });
      } else if (sat.fuel < 2) {
        s.history.push({ turn: s.turn, event: `IMAGING FAILED - Combustible insuficiente (${sat.id})`, type: 'error' });
      } else {
        s.history.push({ turn: s.turn, event: `IMAGING FAILED - Fondos insuficientes (${sat.id})`, type: 'error' });
      }
    } else if (action === 'MAINTENANCE') {
      if (s.budget >= CONFIG.MAINT_COST) {
        s.budget -= CONFIG.MAINT_COST;
        s.totalSpent += CONFIG.MAINT_COST;
        sat.collisionRisk = clamp(sat.collisionRisk - 0.08, 0, 1);
        sat.efficiency = clamp(sat.efficiency + 0.03, 0, 1); // Mantenimiento mejora eficiencia
        s.history.push({ turn: s.turn, event: `Mantenimiento ${sat.id} (-$${CONFIG.MAINT_COST.toLocaleString()})`, cost: CONFIG.MAINT_COST });
      } else {
        s.history.push({ turn: s.turn, event: `MAINTENANCE FAILED - Fondos insuficientes (${sat.id})`, type: 'error' });
      }
    }
  }
  // Task assignments
  for (const [taskId, satId] of Object.entries(assignments)) {
    const taskIdx = s.tasks.findIndex(t => t.id === taskId);
    const sat = s.satellites.find(x => x.id === satId);
    if (taskIdx === -1 || !sat || sat.status !== 'active') continue;
    const task = s.tasks[taskIdx];
    if (sat.fuel < task.fuel) {
      s.budget -= Math.abs(task.penalty);
      s.history.push({ turn: s.turn, event: `TASK_FAIL_NOFUEL ${task.title}` });
      s.tasks.splice(taskIdx, 1);
      continue;
    }
    if (task.reward > 0) {
      const baseReward = task.reward;
      const efficiencyBonus = sat.efficiency > 0.9 ? CONFIG.EFFICIENCY_BONUS : 1.0;
      const priorityBonus = task.priority === 'CRITICAL' ? 1.3 : task.priority === 'HIGH' ? 1.15 : 1.0;
      const finalReward = Math.floor(baseReward * sat.efficiency * efficiencyBonus * priorityBonus);
      
      s.budget += finalReward;
      s.totalEarned += finalReward;
      s.tasksCompleted += 1;
      sat.fuel -= task.fuel;
      
      const bonusText = efficiencyBonus > 1 ? ' (BONUS EFICIENCIA!)' : '';
      const priorityText = priorityBonus > 1 ? ` (${task.priority})` : '';
      s.history.push({ 
        turn: s.turn, 
        event: `✅ ${task.title} completada por ${sat.id} (+$${finalReward.toLocaleString()})${bonusText}${priorityText}`, 
        type: 'success',
        reward: finalReward 
      });
    } else {
      // Maintenance/safety tasks - también pueden dar pequeñas recompensas
      sat.collisionRisk = clamp(sat.collisionRisk - 0.12, 0, 1);
      sat.fuel -= task.fuel;
      s.tasksCompleted += 1;
      
      if (task.reward > 0) {
        s.budget += task.reward;
        s.totalEarned += task.reward;
        s.history.push({ 
          turn: s.turn, 
          event: `🔧 ${task.title} completada por ${sat.id} (+$${task.reward.toLocaleString()})`, 
          type: 'maintenance',
          reward: task.reward 
        });
      } else {
        s.history.push({ 
          turn: s.turn, 
          event: `🔧 ${task.title} completada por ${sat.id} (Mantenimiento crítico)`, 
          type: 'maintenance'
        });
      }
    }
    s.tasks.splice(taskIdx, 1);
  }
  // End of turn
  if (advance) {
    // Penalties for expired tasks
    const expired = s.tasks.filter(t => t.deadline <= s.turn);
    for (const t of expired) {
      const penalty = Math.abs(t.penalty);
      s.budget -= penalty;
      s.totalSpent += penalty;
      s.history.push({ 
        turn: s.turn, 
        event: `❌ Tarea expirada: ${t.title} (MULTA: -$${penalty.toLocaleString()})`, 
        type: 'penalty',
        cost: penalty 
      });
    }
    s.tasks = s.tasks.filter(t => t.deadline > s.turn);
    
    // Operational cost (más justo - escalado por satélites activos)
    const activeSatsCount = s.satellites.filter(sat => sat.status === 'active').length;
    const totalSatsCount = s.satellites.length;
    const adjustedOpCost = Math.floor(CONFIG.OP_COST * (activeSatsCount / totalSatsCount) * 0.8); // Reducido 20%
    
    // Descuento por eficiencia operacional
    const avgEfficiency = activeSatsCount > 0 ? 
      s.satellites.filter(sat => sat.status === 'active').reduce((a, s) => a + s.efficiency, 0) / activeSatsCount : 0;
    const efficiencyDiscount = avgEfficiency > 0.8 ? 0.85 : avgEfficiency > 0.6 ? 0.93 : 1.0;
    
    const finalOpCost = Math.floor(adjustedOpCost * efficiencyDiscount);
    s.budget -= finalOpCost;
    s.totalSpent += finalOpCost;
    
    let costMessage = `💼 Costos operacionales (-$${finalOpCost.toLocaleString()})`;
    if (efficiencyDiscount < 1.0) {
      const saved = adjustedOpCost - finalOpCost;
      costMessage += ` [Descuento eficiencia: -$${saved.toLocaleString()}]`;
    }
    
    s.history.push({ 
      turn: s.turn, 
      event: costMessage, 
      type: 'operational',
      cost: finalOpCost 
    });
    
    // Fuel regeneration and risk management
    for (const sat of s.satellites) {
      if (sat.status === 'active') {
        // Regeneración de combustible más realista
        const regenAmount = 8 + Math.random() * 7; // 8-15 puntos
        sat.fuel = clamp(sat.fuel + regenAmount, 0, 100);
        
        // Incremento de riesgo más gradual
        const riskIncrease = 0.008 + Math.random() * 0.012; // 0.8%-2% por turno
        sat.collisionRisk = clamp(sat.collisionRisk + riskIncrease, 0, 1);
        
        // Degradación leve de eficiencia sin mantenimiento
        if (Math.random() < 0.3) {
          sat.efficiency = clamp(sat.efficiency - 0.01, 0.5, 1);
        }
      }
    }
    
    // Nuevas tareas (1-2 por turno dependiendo de la situación)
    const taskCount = s.turn > 8 ? 2 : 1; // Más tareas en turnos avanzados
    for (let i = 0; i < taskCount; i++) {
      s.tasks.push(createTask(TASKS[Math.floor(Math.random() * TASKS.length)], s.turn));
    }
    
    // Eventos de emergencia ocasionales (reducida probabilidad)
    if (Math.random() < 0.08) { // 8% de probabilidad (reducido de 15%)
      s.budget -= CONFIG.EMERGENCY_COST;
      s.totalSpent += CONFIG.EMERGENCY_COST;
      s.emergencies += 1;
      s.history.push({ 
        turn: s.turn, 
        event: `🚨 Emergencia orbital: gastos inesperados (-$${CONFIG.EMERGENCY_COST.toLocaleString()})`, 
        type: 'emergency',
        cost: CONFIG.EMERGENCY_COST 
      });
    }
    
    // Collision events (probabilidad reducida con mejor gestión de riesgo)
    const activeSatellites = s.satellites.filter(x => x.status === 'active');
    if (activeSatellites.length > 0) {
      const meanRisk = activeSatellites.reduce((a, b) => a + b.collisionRisk, 0) / activeSatellites.length;
      const collisionProb = meanRisk * 0.35; // Reducido de 0.5 a 0.35
      
      if (Math.random() < collisionProb) {
        const victim = activeSatellites[Math.floor(Math.random() * activeSatellites.length)];
        victim.status = 'failed';
        s.budget -= CONFIG.COLLISION_COST;
        s.totalSpent += CONFIG.COLLISION_COST;
        s.collisions += 1;
        s.history.push({ 
          turn: s.turn, 
          event: `💥 COLISIÓN ORBITAL: ${victim.id} destruido (-$${CONFIG.COLLISION_COST.toLocaleString()})`, 
          type: 'collision',
          cost: CONFIG.COLLISION_COST 
        });
      }
    }
    s.turn += 1;
  }
  return s;
}

// Función para evaluar el estado del juego
function evaluateGameStatus(state) {
  const activeSats = state.satellites.filter(s => s.status === 'active').length;
  const isGameOver = state.turn > state.maxTurns || state.budget <= 0 || activeSats === 0;
  
  if (!isGameOver) {
    return { status: 'ongoing', message: 'Misión en progreso...' };
  }
  
  // Criterios de victoria más generosos pero justos
  const profitMargin = state.totalEarned - state.totalSpent;
  const survivalRate = activeSats / state.satellites.length;
  const completionRate = state.tasksCompleted / Math.max(1, state.turn - 1);
  
  // Victoria más alcanzable - si cumples al menos 2 de estos 4 criterios:
  const criteria = [
    state.budget > 15000,           // Mantener presupuesto básico (reducido de 20000)
    survivalRate >= 0.5,           // Mantener al menos 50% de satélites
    completionRate >= 0.35,        // Completar al menos 35% de tareas (reducido de 40%)
    profitMargin > 0               // NUEVO: tener ganancia neta positiva
  ];
  
  const metCriteria = criteria.filter(c => c).length;
  
  if (metCriteria >= 2 && state.budget > 0) {
    let rank = 'Básico';
    if (metCriteria >= 3 && state.budget > 35000 && survivalRate > 0.75 && profitMargin > 20000) {
      rank = 'Excelente';
    } else if (metCriteria >= 3 && (state.budget > 25000 || profitMargin > 10000)) {
      rank = 'Bueno';
    }
    
    return {
      status: 'victory',
      rank,
      message: `🎉 ¡MISIÓN EXITOSA! (Rango: ${rank})`,
      stats: {
        finalBudget: state.budget,
        profit: profitMargin,
        survivalRate: Math.round(survivalRate * 100),
        completionRate: Math.round(completionRate * 100),
        collisions: state.collisions,
        tasksCompleted: state.tasksCompleted
      }
    };
  } else {
    let reason = 'Gestión ineficiente';
    if (state.budget <= 0) reason = 'Bancarrota';
    if (activeSats === 0) reason = 'Pérdida total de satélites';
    
    return {
      status: 'defeat',
      message: `❌ MISIÓN FALLIDA: ${reason}`,
      stats: {
        finalBudget: state.budget,
        profit: profitMargin,
        survivalRate: Math.round(survivalRate * 100),
        completionRate: Math.round(completionRate * 100),
        collisions: state.collisions,
        tasksCompleted: state.tasksCompleted
      }
    };
  }
}

// Función helper para dar consejos estratégicos
function getStrategicTips(state) {
  const tips = [];
  const activeSats = state.satellites.filter(s => s.status === 'active');
  const avgRisk = activeSats.reduce((a, s) => a + s.collisionRisk, 0) / activeSats.length;
  const avgEfficiency = activeSats.reduce((a, s) => a + s.efficiency, 0) / activeSats.length;
  
  if (state.budget < 15000) {
    tips.push('💰 CRÍTICO: Presupuesto bajo. Prioriza tareas con alta recompensa.');
  }
  
  if (avgRisk > 0.6) {
    tips.push('⚠️ RIESGO ALTO: Ejecuta maniobras anti-colisión urgentemente.');
  }
  
  if (avgEfficiency < 0.7) {
    tips.push('🔧 Realiza mantenimiento para mejorar la eficiencia de tus satélites.');
  }
  
  if (state.tasks.filter(t => t.priority === 'CRITICAL').length > 0) {
    tips.push('🚨 Atiende las tareas CRÍTICAS primero para evitar multas grandes.');
  }
  
  if (state.tasksCompleted / Math.max(1, state.turn - 1) < 0.3) {
    tips.push('📈 Mejora tu tasa de completación de tareas para aumentar ingresos.');
  }
  
  // Consejos sobre operaciones de imagen/scan
  const lowFuelSats = activeSats.filter(s => s.fuel < 20).length;
  if (lowFuelSats > 0) {
    tips.push('⛽ Algunos satélites tienen poco combustible. Considera repostar antes de operaciones costosas.');
  }
  
  if (state.budget > 50000) {
    tips.push('💡 Con buen presupuesto, puedes hacer operaciones de scan (IMAGING) para generar ingresos adicionales.');
  }
  
  if (avgEfficiency > 0.85) {
    tips.push('🌟 Alta eficiencia detectada. Tus operaciones de scan tienen mayor probabilidad de bonificaciones.');
  }
  
  return tips;
}

module.exports = { createInitialState, stepTurn, evaluateGameStatus, getStrategicTips };
