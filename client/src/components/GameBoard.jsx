import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MapView from './MapView';
import TurnPanel from './TurnPanel';
import Scoreboard from './Scoreboard';
import NDVIChart from './NDVIChart';
import EventLog from './EventLog';
import GameSummary from './GameSummary';

export default function GameBoard({ game, onExit }){
  const [state, setState] = useState(game);
  const [lastEvents, setLastEvents] = useState([]);

  useEffect(()=> setState(game), [game]);

  const step = async (actions) => {
  const base = import.meta.env.VITE_API_BASE || 'http://localhost:9000';
  const resp = await axios.post(`${base}/api/game/${state.id}/step`, { actions });
    setState(resp.data);
    // Extraer eventos del último turno
    const newEvents = resp.data.history.filter(h => h.turn === resp.data.turn - 1);
    setLastEvents(newEvents);
  };

  const downloadReport = async () => {
    const base = import.meta.env.VITE_API_BASE || 'http://localhost:9000';
    const url = `${base.replace(/:9000$|:9002$|:4000$/, ':4000')}/api/game/${state.id}/report`;
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.click();
  };

  const getScenarioDescription = () => {
    switch(state.scenario) {
      case 'operator':
        return "Gestiona tu constelación satelital. Cada satélite tiene riesgo de colisión. Usa EOL para retirarlos de forma segura.";
      case 'inmobiliaria':
        return "Monitorea terrenos agrícolas. La deforestación reduce el valor de las propiedades. El monitoreo ayuda a detectar cambios.";
      case 'ong':
        return "Protege bosques amazónicos. Previene la deforestación ilegal usando datos satelitales.";
      default:
        return "";
    }
  };

  return (
    <div className="container-fluid">
      <div className="row mb-3">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>LEO Decisions - {state.scenario === 'operator' ? 'Operador Satelital' : state.scenario === 'inmobiliaria' ? 'Inmobiliaria' : 'ONG Ambiental'}</h2>
              <p className="text-muted">{getScenarioDescription()}</p>
            </div>
            <div>
              <span className="badge bg-primary me-2">Turno {state.turn}/{state.maxTurns}</span>
              <button className="btn btn-outline-danger btn-sm" onClick={onExit}>Salir</button>
            </div>
          </div>
        </div>
      </div>

      {state.turn > state.maxTurns ? (
        <GameSummary state={state} onDownloadReport={downloadReport} />
      ) : (
        <div className="row">
          <div className="col-lg-7">
            <MapView state={state} />
            {state.aoi && <NDVIChart ndviSeries={state.aoi.ndviSeries || []} name={state.aoi.name} currentTurn={state.turn - 1} />}
          </div>
          <div className="col-lg-5">
            <Scoreboard state={state} />
            <EventLog events={state.history} />
            <TurnPanel state={state} onStep={step} />
          </div>
        </div>
      )}
    </div>
  );
}