import React, { useState, useEffect } from 'react';

const SatelliteVisualization = ({ region, sector }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!region) return null;

  const getSectorColor = () => {
    switch(sector) {
      case 'agriculture': return '#10B981';
      case 'environment': return '#059669';
      case 'maritime': return '#0891B2';
      case 'disaster': return '#DC2626';
      case 'urban': return '#7C3AED';
      case 'energy': return '#EA580C';
      default: return '#6B7280';
    }
  };

  const getSectorIcon = () => {
    switch(sector) {
      case 'agriculture': return 'fas fa-seedling';
      case 'environment': return 'fas fa-leaf';
      case 'maritime': return 'fas fa-ship';
      case 'disaster': return 'fas fa-exclamation-triangle';
      case 'urban': return 'fas fa-city';
      case 'energy': return 'fas fa-solar-panel';
      default: return 'fas fa-satellite';
    }
  };

  return (
    <div className="satellite-visualization bg-dark rounded p-3 text-white">
      {/* Header con información de la región */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">
          <i className={`${getSectorIcon()} me-2`} style={{color: getSectorColor()}}></i>
          {region.name}
        </h5>
        <div className="text-end">
          <div className="badge bg-success" style={{fontSize: '10px'}}>
            <i className="fas fa-clock me-1"></i>
            {currentTime.toLocaleTimeString('es-ES')}
          </div>
          <div className="text-muted" style={{fontSize: '9px'}}>
            {region.coords.lat.toFixed(4)}°, {region.coords.lon.toFixed(4)}°
          </div>
        </div>
      </div>

      {/* Mapa satelital principal */}
      <div className="row">
        <div className="col-md-8">
          <div 
            className="satellite-map position-relative rounded overflow-hidden"
            style={{height: '300px'}}
          >
            {/* Mapa de relieve topográfico mejorado */}
            <TerrainMap region={region} sector={sector} />
          </div>

          {/* Información de cobertura */}
          <div className="mt-2 p-2 bg-secondary rounded">
            <div className="row g-2 text-center">
              <div className="col-3">
                <div style={{fontSize: '10px'}} className="text-muted">Cobertura</div>
                <div style={{fontSize: '12px'}} className="text-success">
                  <i className="fas fa-check-circle me-1"></i>
                  {region.coverage || 'Diaria'}
                </div>
              </div>
              <div className="col-3">
                <div style={{fontSize: '10px'}} className="text-muted">Resolución</div>
                <div style={{fontSize: '12px'}} className="text-warning">10-30m</div>
              </div>
              <div className="col-3">
                <div style={{fontSize: '10px'}} className="text-muted">Satélites</div>
                <div style={{fontSize: '12px'}} className="text-info">
                  {region.satellites ? region.satellites.length : 4}
                </div>
              </div>
              <div className="col-3">
                <div style={{fontSize: '10px'}} className="text-muted">Estado</div>
                <div style={{fontSize: '12px'}} className="text-success">
                  <i className="fas fa-circle me-1"></i>Activo
                </div>
              </div>
            </div>

            {/* Panel de análisis detallado - SIEMPRE VISIBLE */}
            <div className="mt-3 p-3 bg-dark rounded border border-warning" style={{minHeight: '200px'}}>
              <h6 className="text-warning mb-3 d-flex align-items-center" style={{fontSize: '12px'}}>
                <i className="fas fa-chart-area me-2"></i>
                <strong>Análisis Geográfico Detallado</strong>
                <span className="badge bg-success ms-auto" style={{fontSize: '8px'}}>ACTIVO</span>
              </h6>
              <div className="row g-2">
                <div className="col-md-6">
                  <div className="bg-secondary rounded p-2">
                    <h6 style={{fontSize: '10px'}} className="text-info mb-1">Topografía</h6>
                    <div className="row g-1">
                      <div className="col-6">
                        <div style={{fontSize: '9px'}} className="text-muted">Elevación Máx.</div>
                        <div style={{fontSize: '10px'}} className="text-success">
                          {Math.floor(Math.random() * 2000 + 100)}m
                        </div>
                      </div>
                      <div className="col-6">
                        <div style={{fontSize: '9px'}} className="text-muted">Pendiente</div>
                        <div style={{fontSize: '10px'}} className="text-warning">
                          {Math.floor(Math.random() * 30 + 5)}°
                        </div>
                      </div>
                    </div>
                    <div className="mt-1">
                      <div style={{fontSize: '9px'}} className="text-muted">Tipo de Terreno</div>
                      <div style={{fontSize: '10px'}} className="text-white">
                        {sector === 'agriculture' ? 'Tierras Cultivables' : 
                         sector === 'maritime' ? 'Zona Costera' :
                         sector === 'urban' ? 'Área Metropolitana' :
                         sector === 'environment' ? 'Reserva Natural' :
                         sector === 'energy' ? 'Zona Desértica' : 'Montañoso'}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="bg-secondary rounded p-2">
                    <h6 style={{fontSize: '10px'}} className="text-primary mb-1">Condiciones Ambientales</h6>
                    <div className="row g-1">
                      <div className="col-6">
                        <div style={{fontSize: '9px'}} className="text-muted">Temp. Promedio</div>
                        <div style={{fontSize: '10px'}} className="text-warning">
                          {Math.floor(Math.random() * 25 + 10)}°C
                        </div>
                      </div>
                      <div className="col-6">
                        <div style={{fontSize: '9px'}} className="text-muted">Humedad</div>
                        <div style={{fontSize: '10px'}} className="text-info">
                          {Math.floor(Math.random() * 40 + 30)}%
                        </div>
                      </div>
                    </div>
                    <div className="mt-1">
                      <div style={{fontSize: '9px'}} className="text-muted">Condición Actual</div>
                      <div style={{fontSize: '10px'}} className="text-success">
                        <i className="fas fa-sun me-1"></i>Despejado
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Métricas específicas por sector */}
              <div className="mt-2 p-2 bg-success bg-opacity-10 rounded border border-success">
                <h6 style={{fontSize: '10px'}} className="text-success mb-1">
                  <i className={getSectorIcon()} me-1></i>
                  Métricas Específicas del Sector
                </h6>
                <div className="row g-1">
                  {sector === 'agriculture' && (
                    <>
                      <div className="col-4">
                        <div style={{fontSize: '8px'}} className="text-muted">NDVI Actual</div>
                        <div style={{fontSize: '9px'}} className="text-success">0.72</div>
                      </div>
                      <div className="col-4">
                        <div style={{fontSize: '8px'}} className="text-muted">Área Cultivada</div>
                        <div style={{fontSize: '9px'}} className="text-success">84%</div>
                      </div>
                      <div className="col-4">
                        <div style={{fontSize: '8px'}} className="text-muted">Rendimiento</div>
                        <div style={{fontSize: '9px'}} className="text-warning">Alto</div>
                      </div>
                    </>
                  )}
                  {sector === 'maritime' && (
                    <>
                      <div className="col-4">
                        <div style={{fontSize: '8px'}} className="text-muted">Embarcaciones</div>
                        <div style={{fontSize: '9px'}} className="text-info">{Math.floor(Math.random() * 50 + 20)}</div>
                      </div>
                      <div className="col-4">
                        <div style={{fontSize: '8px'}} className="text-muted">Temp. Agua</div>
                        <div style={{fontSize: '9px'}} className="text-info">{Math.floor(Math.random() * 8 + 18)}°C</div>
                      </div>
                      <div className="col-4">
                        <div style={{fontSize: '8px'}} className="text-muted">Oleaje</div>
                        <div style={{fontSize: '9px'}} className="text-success">Moderado</div>
                      </div>
                    </>
                  )}
                  {sector === 'urban' && (
                    <>
                      <div className="col-4">
                        <div style={{fontSize: '8px'}} className="text-muted">Densidad Pobl.</div>
                        <div style={{fontSize: '9px'}} className="text-warning">{Math.floor(Math.random() * 5000 + 1000)}/km²</div>
                      </div>
                      <div className="col-4">
                        <div style={{fontSize: '8px'}} className="text-muted">AQI</div>
                        <div style={{fontSize: '9px'}} className="text-warning">{Math.floor(Math.random() * 50 + 80)}</div>
                      </div>
                      <div className="col-4">
                        <div style={{fontSize: '8px'}} className="text-muted">Tráfico</div>
                        <div style={{fontSize: '9px'}} className="text-danger">Alto</div>
                      </div>
                    </>
                  )}
                  {sector === 'environment' && (
                    <>
                      <div className="col-4">
                        <div style={{fontSize: '8px'}} className="text-muted">Cobertura Bosque</div>
                        <div style={{fontSize: '9px'}} className="text-success">{Math.floor(Math.random() * 30 + 60)}%</div>
                      </div>
                      <div className="col-4">
                        <div style={{fontSize: '8px'}} className="text-muted">Biodiversidad</div>
                        <div style={{fontSize: '9px'}} className="text-success">Alta</div>
                      </div>
                      <div className="col-4">
                        <div style={{fontSize: '8px'}} className="text-muted">CO2</div>
                        <div style={{fontSize: '9px'}} className="text-info">{Math.floor(Math.random() * 20 + 400)} ppm</div>
                      </div>
                    </>
                  )}
                  {sector === 'energy' && (
                    <>
                      <div className="col-4">
                        <div style={{fontSize: '8px'}} className="text-muted">Irradiancia</div>
                        <div style={{fontSize: '9px'}} className="text-warning">{Math.floor(Math.random() * 200 + 800)} W/m²</div>
                      </div>
                      <div className="col-4">
                        <div style={{fontSize: '8px'}} className="text-muted">Potencial</div>
                        <div style={{fontSize: '9px'}} className="text-success">Excelente</div>
                      </div>
                      <div className="col-4">
                        <div style={{fontSize: '8px'}} className="text-muted">Viento</div>
                        <div style={{fontSize: '9px'}} className="text-info">{Math.floor(Math.random() * 15 + 5)} km/h</div>
                      </div>
                    </>
                  )}
                  {sector === 'disaster' && (
                    <>
                      <div className="col-4">
                        <div style={{fontSize: '8px'}} className="text-muted">Riesgo Actual</div>
                        <div style={{fontSize: '9px'}} className="text-warning">Moderado</div>
                      </div>
                      <div className="col-4">
                        <div style={{fontSize: '8px'}} className="text-muted">Alertas</div>
                        <div style={{fontSize: '9px'}} className="text-info">{Math.floor(Math.random() * 5)}</div>
                      </div>
                      <div className="col-4">
                        <div style={{fontSize: '8px'}} className="text-muted">Preparación</div>
                        <div style={{fontSize: '9px'}} className="text-success">Óptima</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel de control lateral */}
        <div className="col-md-4">
          <div className="bg-secondary rounded p-2 h-100">
            <h6 className="text-warning mb-2">
              <i className="fas fa-satellite-dish me-1"></i>
              Control de Misión
            </h6>
            
            {/* Lista de satélites activos */}
            <div className="mb-3">
              <small className="text-muted">Satélites Activos:</small>
              {region.satellites && region.satellites.map((sat, idx) => (
                <div key={idx} className="d-flex justify-content-between align-items-center mt-1 p-1 bg-dark rounded">
                  <span style={{fontSize: '9px'}} className="text-white">{sat}</span>
                  <span className="badge bg-success" style={{fontSize: '7px'}}>
                    <i className="fas fa-circle me-1"></i>OK
                  </span>
                </div>
              ))}
            </div>

            {/* Métricas en tiempo real */}
            <div className="mb-3">
              <small className="text-muted">Métricas:</small>
              <div className="row g-1 mt-1">
                <div className="col-6">
                  <div className="bg-dark rounded p-1 text-center">
                    <div style={{fontSize: '8px'}} className="text-muted">Latencia</div>
                    <div style={{fontSize: '10px'}} className="text-success">2.3s</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="bg-dark rounded p-1 text-center">
                    <div style={{fontSize: '8px'}} className="text-muted">Señal</div>
                    <div style={{fontSize: '10px'}} className="text-warning">98%</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="bg-dark rounded p-1 text-center">
                    <div style={{fontSize: '8px'}} className="text-muted">Datos/h</div>
                    <div style={{fontSize: '10px'}} className="text-info">2.4GB</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="bg-dark rounded p-1 text-center">
                    <div style={{fontSize: '8px'}} className="text-muted">Próximo</div>
                    <div style={{fontSize: '10px'}} className="text-primary">12min</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Acciones rápidas */}
            <div className="d-grid gap-1">
              <button className="btn btn-outline-success btn-sm" style={{fontSize: '10px'}}>
                <i className="fas fa-play me-1"></i>Iniciar Análisis
              </button>
              <button className="btn btn-outline-warning btn-sm" style={{fontSize: '10px'}}>
                <i className="fas fa-download me-1"></i>Descargar Datos
              </button>
              <button className="btn btn-outline-info btn-sm" style={{fontSize: '10px'}}>
                <i className="fas fa-share me-1"></i>Exportar Reporte
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes orbit0 {
          0% { transform: rotate(0deg) translateX(20px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(20px) rotate(-360deg); }
        }
        @keyframes orbit1 {
          0% { transform: rotate(120deg) translateX(25px) rotate(-120deg); }
          100% { transform: rotate(480deg) translateX(25px) rotate(-480deg); }
        }
        @keyframes orbit2 {
          0% { transform: rotate(240deg) translateX(30px) rotate(-240deg); }
          100% { transform: rotate(600deg) translateX(30px) rotate(-600deg); }
        }
      `}</style>
    </div>
  );
};

export default SatelliteVisualization;