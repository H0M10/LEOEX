import React, { useState } from 'react';
import axios from 'axios';
import Tutorial from './Tutorial';

export default function Home({ onStart }){
  const [showTutorial, setShowTutorial] = useState(false);

  const start = async (scenario) => {
    const base = import.meta.env.VITE_API_BASE || '${base}';
    const resp = await axios.post(`${base}/api/game/start`, { 
      scenario, 
      budget: 100000, 
      satellitesCount: 4 
    });
    onStart(resp.data);
  };

  return (
    <div className="container text-center py-5">
      {showTutorial && <Tutorial onClose={() => setShowTutorial(false)} />}
      
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h1 className="display-4 mb-4">🚀 LEO Decisions</h1>
          <p className="lead mb-4">
            Simulador de decisiones en órbita terrestre baja. Gestiona satélites, 
            protege el medio ambiente y toma decisiones que impactan el futuro del espacio.
          </p>

          <div className="alert alert-info mb-4">
            <h5>🎯 Objetivo del Juego</h5>
            <p>En 6 turnos, maximiza tu Score ESG mientras mantienes el presupuesto. 
            Cada decisión tiene consecuencias: ¿retiras satélites viejos para reducir riesgos, 
            o ahorras dinero pero arriesgas colisiones?</p>
          </div>

          <h3 className="mb-4">Selecciona tu Escenario</h3>
          
          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">🛰️ Operador Satelital</h5>
                  <p className="card-text">
                    Gestiona una constelación de 4 satélites. Decide cuándo retirarlos 
                    o agruparlos para maniobras eficientes. Riesgo de colisiones alto.
                  </p>
                  <p className="text-muted small">Presupuesto: $50,000 | 4 satélites</p>
                  <button className="btn btn-primary w-100" onClick={()=>start('operator')}>
                    Jugar como Operador
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">🏠 Inmobiliaria</h5>
                  <p className="card-text">
                    Monitorea terrenos agrícolas. La deforestación reduce el valor 
                    de las propiedades. Usa datos satelitales para detectar cambios.
                  </p>
                  <p className="text-muted small">Enfoque: Monitoreo NDVI | Impacto económico</p>
                  <button className="btn btn-secondary w-100" onClick={()=>start('inmobiliaria')}>
                    Jugar como Inmobiliaria
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">🌳 ONG Ambiental</h5>
                  <p className="card-text">
                    Protege bosques amazónicos. Previene la deforestación ilegal 
                    usando monitoreo satelital. Presupuesto limitado, impacto alto.
                  </p>
                  <p className="text-muted small">Presupuesto: $30,000 | Enfoque ambiental</p>
                  <button className="btn btn-success w-100" onClick={()=>start('ong')}>
                    Jugar como ONG
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-center gap-3">
            <button className="btn btn-outline-info" onClick={() => setShowTutorial(true)}>
              📖 Ver Tutorial
            </button>
            <button className="btn btn-outline-secondary" onClick={() => window.open('https://www.spaceappschallenge.org/2025/challenges/commercializing-low-earth-orbit-leo/', '_blank')}>
              🌐 Ver Desafío NASA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}