import React from 'react';

const TerrainMap = ({ region, sector }) => {
  if (!region) return null;

  // Generar datos de elevación basados en coordenadas reales
  const generateElevationData = () => {
    const lat = region.coords.lat;
    const lon = region.coords.lon;
    
    // Simulación básica de elevación basada en ubicación
    let baseElevation = 100;
    let terrainType = 'llanura';
    
    // Regiones montañosas conocidas
    if ((lat > 40 && lat < 50 && lon > -110 && lon < -100) || // Rockies
        (lat > 35 && lat < 45 && lon > -125 && lon < -115) || // Sierra Nevada
        (lat > -35 && lat < -20 && lon > -75 && lon < -65)) { // Andes
      baseElevation = Math.random() * 2000 + 1000;
      terrainType = 'montañoso';
    } else if (lat < -50 || lat > 60) { // Regiones árticas/antárticas
      baseElevation = Math.random() * 500 + 200;
      terrainType = 'tundra';
    } else if (Math.abs(lat) < 23.5) { // Trópicos
      baseElevation = Math.random() * 300 + 50;
      terrainType = 'tropical';
    }
    
    return { baseElevation: Math.floor(baseElevation), terrainType };
  };

  const elevation = generateElevationData();

  return (
    <div className="terrain-map-container position-relative w-100 h-100">
      {/* Mapa de relieve con múltiples fuentes */}
      <div className="position-relative w-100 h-100 overflow-hidden rounded">
        
        {/* Intento 1: OpenTopoMap (especializado en relieve) */}
        <img 
          src={`https://tile.opentopomap.org/10/${Math.floor((region.coords.lon + 180) / 360 * Math.pow(2, 10))}/${Math.floor((1 - Math.log(Math.tan(region.coords.lat * Math.PI / 180) + 1 / Math.cos(region.coords.lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, 10))}.png`}
          alt={`Mapa topográfico de ${region.name}`}
          className="position-absolute w-100 h-100"
          style={{
            objectFit: 'cover',
            zIndex: 3
          }}
          onError={(e) => {
            e.target.style.display = 'none';
            // Activar siguiente fallback
            e.target.nextSibling.style.display = 'block';
          }}
        />

        {/* Intento 2: Stamen Terrain */}
        <img 
          src={`https://stamen-tiles.a.ssl.fastly.net/terrain/10/${Math.floor((region.coords.lon + 180) / 360 * Math.pow(2, 10))}/${Math.floor((1 - Math.log(Math.tan(region.coords.lat * Math.PI / 180) + 1 / Math.cos(region.coords.lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, 10))}.jpg`}
          alt={`Terreno de ${region.name}`}
          className="position-absolute w-100 h-100"
          style={{
            objectFit: 'cover',
            zIndex: 2,
            display: 'none'
          }}
          onError={(e) => {
            e.target.style.display = 'none';
            // Activar fallback final
            e.target.nextSibling.style.display = 'block';
          }}
        />

        {/* Fallback Final: Relieve generado proceduralmente */}
        <div 
          className="position-absolute w-100 h-100"
          style={{
            display: 'none',
            zIndex: 1,
            background: `
              radial-gradient(ellipse 200px 100px at 30% 20%, 
                rgba(139, 69, 19, 0.9) 0%, 
                rgba(160, 82, 45, 0.7) 30%, 
                rgba(205, 133, 63, 0.5) 60%, 
                transparent 100%),
              radial-gradient(ellipse 150px 80px at 70% 30%, 
                rgba(34, 139, 34, 0.8) 0%, 
                rgba(46, 125, 50, 0.6) 40%, 
                rgba(107, 142, 35, 0.4) 70%, 
                transparent 100%),
              radial-gradient(ellipse 180px 60px at 50% 70%, 
                rgba(25, 118, 210, 0.7) 0%, 
                rgba(70, 130, 180, 0.5) 50%, 
                transparent 100%),
              radial-gradient(ellipse 120px 200px at 20% 60%, 
                rgba(244, 164, 96, 0.6) 0%, 
                rgba(222, 184, 135, 0.4) 60%, 
                transparent 100%),
              linear-gradient(135deg,
                rgba(101, 67, 33, 0.8) 0%,
                rgba(139, 69, 19, 0.6) 25%,
                rgba(46, 125, 50, 0.7) 50%,
                rgba(25, 118, 210, 0.5) 75%,
                rgba(70, 130, 180, 0.6) 100%
              )
            `
          }}
        >
          {/* Líneas de contorno topográfico detalladas */}
          <svg 
            width="100%" 
            height="100%" 
            className="position-absolute top-0 start-0"
            style={{zIndex: 2}}
          >
            {/* Contornos de alta elevación */}
            {Array.from({length: 8}, (_, i) => (
              <path
                key={`high-${i}`}
                d={`M ${20 + i * 40} ${30 + Math.sin(i) * 20} Q ${80 + i * 30} ${20 + Math.cos(i) * 15} ${140 + i * 25} ${35 + Math.sin(i * 2) * 18} Q ${200 + i * 20} ${50 + Math.cos(i * 1.5) * 12} ${260 + i * 15} ${30 + Math.sin(i * 0.8) * 25} Q ${320 + i * 10} ${45 + Math.cos(i * 2.2) * 15} ${380 + i * 5} ${25 + Math.sin(i * 1.3) * 20}`}
                stroke={`rgba(139, 69, 19, ${0.8 - i * 0.1})`}
                strokeWidth={3 - i * 0.3}
                fill="none"
              />
            ))}
            
            {/* Contornos de elevación media */}
            {Array.from({length: 6}, (_, i) => (
              <path
                key={`mid-${i}`}
                d={`M ${40 + i * 35} ${80 + Math.sin(i + 1) * 25} Q ${100 + i * 28} ${60 + Math.cos(i + 1) * 18} ${160 + i * 22} ${75 + Math.sin(i * 1.8 + 1) * 22} Q ${220 + i * 18} ${90 + Math.cos(i * 1.3 + 1) * 16} ${280 + i * 12} ${70 + Math.sin(i * 2.1 + 1) * 28} Q ${340 + i * 8} ${85 + Math.cos(i * 1.7 + 1) * 18} ${400 + i * 4} ${65 + Math.sin(i * 1.1 + 1) * 24}`}
                stroke={`rgba(160, 82, 45, ${0.7 - i * 0.1})`}
                strokeWidth={2.5 - i * 0.3}
                fill="none"
              />
            ))}
            
            {/* Contornos de baja elevación */}
            {Array.from({length: 4}, (_, i) => (
              <path
                key={`low-${i}`}
                d={`M ${60 + i * 45} ${120 + Math.sin(i + 2) * 30} Q ${120 + i * 35} ${100 + Math.cos(i + 2) * 22} ${180 + i * 28} ${115 + Math.sin(i * 1.5 + 2) * 26} Q ${240 + i * 22} ${130 + Math.cos(i * 1.8 + 2) * 20} ${300 + i * 16} ${110 + Math.sin(i * 2.3 + 2) * 32} Q ${360 + i * 10} ${125 + Math.cos(i * 1.4 + 2) * 22} ${420 + i * 6} ${105 + Math.sin(i * 1.9 + 2) * 28}`}
                stroke={`rgba(205, 133, 63, ${0.6 - i * 0.1})`}
                strokeWidth={2 - i * 0.4}
                fill="none"
              />
            ))}
          </svg>

          {/* Indicadores de elevación */}
          <div className="position-absolute" style={{top: '15%', left: '25%', zIndex: 3}}>
            <div className="d-flex align-items-center bg-dark bg-opacity-75 rounded px-2 py-1">
              <i className="fas fa-mountain text-warning me-1" style={{fontSize: '10px'}}></i>
              <span style={{fontSize: '9px', color: 'white', fontWeight: 'bold'}}>
                {elevation.baseElevation}m
              </span>
            </div>
          </div>

          <div className="position-absolute" style={{top: '45%', right: '20%', zIndex: 3}}>
            <div className="d-flex align-items-center bg-dark bg-opacity-75 rounded px-2 py-1">
              <i className="fas fa-tree text-success me-1" style={{fontSize: '10px'}}></i>
              <span style={{fontSize: '9px', color: 'white', fontWeight: 'bold'}}>
                {Math.floor(elevation.baseElevation * 0.6)}m
              </span>
            </div>
          </div>

          <div className="position-absolute" style={{bottom: '20%', left: '40%', zIndex: 3}}>
            <div className="d-flex align-items-center bg-dark bg-opacity-75 rounded px-2 py-1">
              <i className="fas fa-water text-info me-1" style={{fontSize: '10px'}}></i>
              <span style={{fontSize: '9px', color: 'white', fontWeight: 'bold'}}>
                {Math.floor(elevation.baseElevation * 0.1)}m
              </span>
            </div>
          </div>
        </div>

        {/* Marcador central de ubicación */}
        <div className="position-absolute top-50 start-50 translate-middle" style={{zIndex: 10}}>
          <div className="d-flex flex-column align-items-center">
            <i className="fas fa-crosshairs fa-3x text-danger mb-1" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}></i>
            <div className="badge bg-dark bg-opacity-90 text-center">
              <div style={{fontSize: '10px'}} className="text-warning">
                <strong>{region.name}</strong>
              </div>
              <div style={{fontSize: '8px'}} className="text-info">
                {elevation.terrainType}
              </div>
            </div>
          </div>
        </div>

        {/* Overlay de información topográfica */}
        <div className="position-absolute bottom-0 start-0 end-0 bg-gradient-to-t from-black to-transparent p-2" style={{zIndex: 5}}>
          <div className="row g-1 text-white">
            <div className="col-4 text-center">
              <div style={{fontSize: '8px'}} className="text-muted">Elevación</div>
              <div style={{fontSize: '10px'}} className="text-warning">
                <strong>{elevation.baseElevation}m</strong>
              </div>
            </div>
            <div className="col-4 text-center">
              <div style={{fontSize: '8px'}} className="text-muted">Terreno</div>
              <div style={{fontSize: '10px'}} className="text-success">
                {elevation.terrainType}
              </div>
            </div>
            <div className="col-4 text-center">
              <div style={{fontSize: '8px'}} className="text-muted">Relieve</div>
              <div style={{fontSize: '10px'}} className="text-info">
                <i className="fas fa-check-circle me-1"></i>3D
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerrainMap;