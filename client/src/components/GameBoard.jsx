import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TurnPanel from './TurnPanel';
import Scoreboard from './Scoreboard';
import EventLog from './EventLog';
import GameSummary from './GameSummary';
import SatelliteTracker3D from './SatelliteTracker3D';

export default function GameBoard({ game, onExit }){
  const [state, setState] = useState(game);
  const [lastEvents, setLastEvents] = useState([]);

  useEffect(()=> setState(game), [game]);

  const step = async (actions) => {
  const base = import.meta.env.VITE_API_BASE || 'https://leoex-production.up.railway.app';
  const resp = await axios.post(`${base}/api/game/${state.id}/step`, { actions });
    setState(resp.data);
    // Extraer eventos del último turno
    const newEvents = resp.data.history.filter(h => h.turn === resp.data.turn - 1);
    setLastEvents(newEvents);
  };

  const downloadReport = async () => {
    const base = import.meta.env.VITE_API_BASE || 'https://leoex-production.up.railway.app';
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
    <div className="gameboard-3d-layout d-flex vh-100" style={{background: '#0f1419'}}>
      {/* Sidebar Izquierda: Menú y Acciones */}
      <div className="bg-dark text-white p-4" style={{width: 370, minWidth: 320, maxWidth: 400, boxShadow: '2px 0 8px #0008', zIndex: 2}}>
        <div className="mb-4">
          <h2 className="mb-1">LEO Decisions</h2>
          <span className="badge bg-primary me-2">Turno {state.turn}/{state.maxTurns}</span>
          <button className="btn btn-outline-danger btn-sm float-end" onClick={onExit}>Salir</button>
          <p className="text-muted mt-2" style={{fontSize: '13px'}}>{getScenarioDescription()}</p>
        </div>
        {state.turn > state.maxTurns ? (
          <GameSummary state={state} onDownloadReport={downloadReport} />
        ) : (
          <>
            <Scoreboard state={state} />
            <EventLog events={state.history} />
            <TurnPanel state={state} onStep={step} />
          </>
        )}
      </div>

      {/* Panel Derecho: Mundo 3D interactivo */}
      <div className="flex-grow-1 position-relative" style={{minWidth: 0, background: '#000'}}>
        <SatelliteTracker3D />
      </div>
    </div>
  );
}