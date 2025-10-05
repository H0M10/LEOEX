import React from 'react';

export default function Scoreboard({ state }){
  const getScoreColor = (score) => {
    if (score >= 70) return 'success';
    if (score >= 40) return 'warning';
    return 'danger';
  };

  const getBudgetColor = (budget) => {
    if (budget >= 30000) return 'success';
    if (budget >= 15000) return 'warning';
    return 'danger';
  };

  const getScenarioSpecificKPIs = () => {
    if (state.scenario === 'inmobiliaria' && state.aoi) {
      return {
        title: 'Valor de Propiedad',
        value: `$${(state.aoi.propertyValue || 0).toLocaleString()}`,
        subtitle: 'Valor estimado del terreno'
      };
    } else if (state.scenario === 'ong' && state.aoi) {
      return {
        title: 'Créditos de Carbono',
        value: `${(state.aoi.carbonCredits || 0).toLocaleString()}`,
        subtitle: 'Créditos disponibles'
      };
    }
    return null;
  };

  const scenarioKPI = getScenarioSpecificKPIs();

  return (
    <div className="card p-3 mb-3">
      <h5 className="card-title">📊 KPIs del Juego</h5>
      
      <div className="row g-3">
        <div className="col-6">
          <div className="text-center">
            <div className={`badge bg-${getBudgetColor(state.budget)} fs-6 p-2`}>
              💰 ${Math.round(state.budget).toLocaleString()}
            </div>
            <small className="d-block text-muted mt-1">Presupuesto</small>
          </div>
        </div>
        
        <div className="col-6">
          <div className="text-center">
            <div className={`badge bg-${getScoreColor(state.score)} fs-6 p-2`}>
              🌱 {Math.round(state.score)}
            </div>
            <small className="d-block text-muted mt-1">Score ESG</small>
          </div>
        </div>
        
        <div className="col-6">
          <div className="text-center">
            <div className="badge bg-danger fs-6 p-2">
              💥 {state.collisions}
            </div>
            <small className="d-block text-muted mt-1">Colisiones</small>
          </div>
        </div>
        
        <div className="col-6">
          <div className="text-center">
            <div className="badge bg-info fs-6 p-2">
              🚀 {Math.round(state.totalDeltaV)}
            </div>
            <small className="d-block text-muted mt-1">Δv Total (m/s)</small>
          </div>
        </div>

        {scenarioKPI && (
          <div className="col-12 mt-2">
            <div className="text-center border-top pt-2">
              <div className="badge bg-secondary fs-6 p-2">
                🏠 {scenarioKPI.value}
              </div>
              <small className="d-block text-muted mt-1">{scenarioKPI.title}</small>
              <small className="text-muted">{scenarioKPI.subtitle}</small>
            </div>
          </div>
        )}
      </div>

      <hr />
      
      <div className="small text-muted">
        <strong>💡 Consejos:</strong>
        <ul className="mb-0 mt-2">
          <li>Presupuesto: Mantén al menos $15,000 para emergencias</li>
          <li>Score ESG: +10 por EOL, -30 por colisión</li>
          <li>Δv: Menos es mejor (eficiencia energética)</li>
          <li>Colisiones: Evítalas con EOL y Group Maneuvers</li>
          {state.scenario === 'inmobiliaria' && <li>Inmobiliaria: Monitorea para prevenir pérdidas de valor</li>}
          {state.scenario === 'ong' && <li>ONG: El monitoreo protege créditos de carbono</li>}
        </ul>
      </div>
    </div>
  );
}