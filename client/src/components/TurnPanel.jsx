import React, { useState } from 'react';

export default function TurnPanel({ state, onStep }){
  const [actions, setActions] = useState({});
  const [monitoring, setMonitoring] = useState(false);
  const setAct = (satId, act) => setActions(a => ({...a, [satId]: act}));

  if (!state) return null;

  const getActionDescription = (action) => {
    switch(action) {
      case 'EOL': return 'Retiro planificado: Reduce riesgo drásticamente (+10 ESG)';
      case 'GROUP': return 'Maniobra grupal: Reduce riesgo compartiendo costos';
      default: return 'Sin acción: Riesgo aumenta gradualmente';
    }
  };

  const getSatStatus = (sat) => {
    let status = `Riesgo: ${(sat.risk * 100).toFixed(0)}%`;
    if (sat.eolPlanned) status += ' (EOL programado)';
    return status;
  };

  return (
    <div className="card mt-3 p-3">
      <h5>🎮 Panel de Decisiones - Turno {state.turn}/{state.maxTurns}</h5>
      
      {state.satellites && state.satellites.length > 0 ? (
        <div className="mb-3">
          <h6>🛰️ Satélites a Gestionar</h6>
          {state.satellites.map(s => (
            <div key={s.id} className="border rounded p-2 mb-2">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong>{s.id}</strong>
                <small className={`badge ${s.risk > 0.3 ? 'bg-danger' : s.risk > 0.1 ? 'bg-warning' : 'bg-success'}`}>
                  {getSatStatus(s)}
                </small>
              </div>
              <select 
                className="form-select form-select-sm" 
                onChange={(e)=>setAct(s.id, e.target.value)}
                defaultValue="NONE"
              >
                <option value="NONE">No action - Riesgo +2-5%</option>
                <option value="EOL">Schedule EOL - Costo: $1,050 + combustible</option>
                <option value="GROUP">Group Maneuver - Costo compartido</option>
              </select>
              <small className="text-muted d-block mt-1">
                {getActionDescription(actions[s.id] || 'NONE')}
              </small>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info">
          <h6>📡 Escenario de Monitoreo</h6>
          <p>En este escenario, tu principal decisión es si comprar monitoreo adicional para detectar deforestación temprana.</p>
        </div>
      )}

      <div className="mb-3">
        <div className="form-check">
          <input 
            id="monitor" 
            type="checkbox" 
            className="form-check-input" 
            checked={monitoring} 
            onChange={(e)=>setMonitoring(e.target.checked)} 
          />
          <label htmlFor="monitor" className="form-check-label">
            🛰️ Comprar Monitoreo ($2,000)
          </label>
        </div>
        <small className="text-muted">
          Datos satelitales adicionales para detectar deforestación o anomalías (+5 ESG si previene problemas)
        </small>
      </div>

      <div className="d-grid">
        <button 
          className="btn btn-primary btn-lg" 
          onClick={()=>onStep({ satActions: actions, global: { monitoring } })}
          disabled={state.turn > state.maxTurns}
        >
          🚀 Avanzar Turno
        </button>
      </div>

      <div className="mt-3 p-2 bg-light rounded">
        <h6>💡 Estrategia Recomendada</h6>
        <ul className="small mb-0">
          <li><strong>Alta Prioridad:</strong> Satélites con riesgo &gt;30%</li>
          <li><strong>Ahorro:</strong> Agrupa maniobras cuando tengas 2+ satélites</li>
          <li><strong>Monitoreo:</strong> Útil en escenarios ambientales</li>
          <li><strong>Balance:</strong> EOL temprano vs costos operativos</li>
        </ul>
      </div>
    </div>
  );
}