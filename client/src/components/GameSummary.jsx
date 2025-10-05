import React from 'react';

export default function GameSummary({ state, onDownloadReport }){
  if (state.turn <= state.maxTurns) return null;

  const getPerformanceRating = () => {
    const score = state.score;
    const collisions = state.collisions;
    const budget = state.budget;

    if (score >= 80 && collisions === 0 && budget > 20000) return { rating: 'Excelente', color: 'success', icon: '🏆' };
    if (score >= 60 && collisions <= 1) return { rating: 'Muy Bueno', color: 'primary', icon: '🥇' };
    if (score >= 40 && collisions <= 2) return { rating: 'Aceptable', color: 'warning', icon: '🥈' };
    return { rating: 'Necesita Mejora', color: 'danger', icon: '💪' };
  };

  const performance = getPerformanceRating();

  const getRecommendations = () => {
    const recs = [];
    if (state.collisions > 2) recs.push("Considera programar más EOLs para reducir riesgos de colisión");
    if (state.score < 50) recs.push("Enfócate más en acciones sostenibles para mejorar el Score ESG");
    if (state.budget < 10000) recs.push("Mejora la gestión financiera para mantener reservas de emergencia");
    if (state.totalDeltaV > 100) recs.push("Optimiza las maniobras para reducir consumo de combustible");
    if (recs.length === 0) recs.push("¡Excelente gestión! Mantén estas estrategias en escenarios reales");
    return recs;
  };

  return (
    <div className="card border-success mt-4">
      <div className="card-header bg-success text-white">
        <h4 className="mb-0">{performance.icon} ¡Juego Completado!</h4>
      </div>
      <div className="card-body">
        <div className="row text-center mb-4">
          <div className="col-md-3">
            <div className={`badge bg-${performance.color} fs-4 p-3`}>
              {performance.rating}
            </div>
            <p className="mt-2 mb-0">Calificación</p>
          </div>
          <div className="col-md-3">
            <div className="h3 text-success">${Math.round(state.budget).toLocaleString()}</div>
            <p className="mb-0">Presupuesto Final</p>
          </div>
          <div className="col-md-3">
            <div className="h3 text-info">{Math.round(state.score)}</div>
            <p className="mb-0">Score ESG</p>
          </div>
          <div className="col-md-3">
            <div className="h3 text-danger">{state.collisions}</div>
            <p className="mb-0">Colisiones</p>
          </div>
        </div>

        <h5>📊 Resumen Ejecutivo</h5>
        <div className="row mb-4">
          <div className="col-md-6">
            <h6>Estadísticas Finales</h6>
            <ul className="list-unstyled">
              <li>🔄 Turnos jugados: {state.maxTurns}</li>
              <li>🛰️ Satélites gestionados: {state.satellites?.length || 0}</li>
              <li>🚀 Δv total consumido: {Math.round(state.totalDeltaV)} m/s</li>
              <li>💰 Costo total de operaciones: ${(50000 - state.budget).toLocaleString()}</li>
            </ul>
          </div>
          <div className="col-md-6">
            <h6>Recomendaciones para Escenarios Reales</h6>
            <ul>
              {getRecommendations().map((rec, i) => (
                <li key={i} className="small">{rec}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="alert alert-info">
          <h6>💡 Lecciones Aprendidas</h6>
          <p className="mb-0">
            En la comercialización de LEO, el balance entre costos operativos, sostenibilidad ambiental 
            y gestión de riesgos es crucial. Tus decisiones en este simulador reflejan los desafíos 
            reales que enfrentan operadores satelitales, inmobiliarias y organizaciones ambientales.
          </p>
        </div>

        <div className="text-center">
          <button className="btn btn-primary btn-lg me-3" onClick={onDownloadReport}>
            📄 Descargar Reporte PDF
          </button>
          <button className="btn btn-outline-secondary" onClick={() => window.location.reload()}>
            🔄 Jugar de Nuevo
          </button>
        </div>
      </div>
    </div>
  );
}