import React from 'react';
import { MapContainer, TileLayer, Marker, Polygon, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import satIconUrl from '../assets/sat-icon.svg';

const satIcon = new L.Icon({
  iconUrl: satIconUrl,
  iconSize: [32,32]
});

export default function MapView({ state }){
  const center = [0,0];
  const sats = state.satellites || [];
  const aoi = state.aoi;

  const getRiskColor = (risk) => {
    if (risk > 0.3) return 'red';
    if (risk > 0.1) return 'orange';
    return 'green';
  };

  return (
    <div className="card p-2 mb-3">
      <h5 className="card-title">🗺️ Vista Orbital</h5>
      <MapContainer center={center} zoom={2} style={{height:'400px'}}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {sats.map(s => (
          <React.Fragment key={s.id}>
            <Marker position={[ (Math.random()-0.5)*140, (Math.random()-0.5)*360 ]} icon={satIcon}>
              <Popup>
                <div>
                  <strong>{s.id}</strong><br/>
                  Altitud: {s.altKm} km<br/>
                  Edad: {s.ageYears} años<br/>
                  Riesgo: {(s.risk * 100).toFixed(1)}%<br/>
                  Estado: {s.eolPlanned ? 'EOL Programado' : 'Activo'}
                </div>
              </Popup>
            </Marker>
            {/* Círculo de riesgo */}
            <Circle 
              center={[ (Math.random()-0.5)*140, (Math.random()-0.5)*360 ]}
              radius={s.risk * 500000}
              color={getRiskColor(s.risk)}
              fillColor={getRiskColor(s.risk)}
              fillOpacity={0.2}
            />
          </React.Fragment>
        ))}
        
        {aoi && aoi.coords && (
          <Polygon positions={aoi.coords} color="green" fillColor="green" fillOpacity={0.3}>
            <Popup>
              <div>
                <strong>Área de Interés</strong><br/>
                {aoi.name}<br/>
                Monitoreo activo: {state.monitoringActive ? 'Sí' : 'No'}
              </div>
            </Popup>
          </Polygon>
        )}
      </MapContainer>
      
      <div className="mt-2 small text-muted">
        <strong>Leyenda:</strong> 
        🛰️ Satélites | 🔴 Alto riesgo | 🟠 Riesgo medio | 🟢 Bajo riesgo | 
        🟩 Área de interés (escenarios ambientales)
      </div>
    </div>
  );
}