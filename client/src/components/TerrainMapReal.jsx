import React from 'react';

const TerrainMapReal = ({ region, sector }) => {
  if (!region) return null;

  return (
    <div className="terrain-map bg-secondary rounded p-3">
      <div className="text-center">
        <div className="alert alert-info border-0 mb-3" style={{background: 'rgba(13, 202, 240, 0.2)'}}>
          <h6 className="text-info mb-2">
            <i className="fas fa-map-marked-alt me-2"></i>
            Real Terrain Data Integration Required
          </h6>
          <p className="text-light small mb-0">
            Live terrain mapping requires integration with professional elevation and geographic APIs:
          </p>
        </div>

        <div className="row g-2">
          <div className="col-6">
            <div className="card bg-dark text-white p-2">
              <i className="fas fa-mountain text-primary mb-1"></i>
              <div style={{fontSize: '10px'}}>SRTM Elevation</div>
              <small className="text-muted">NASA/USGS</small>
            </div>
          </div>
          <div className="col-6">
            <div className="card bg-dark text-white p-2">
              <i className="fas fa-globe text-success mb-1"></i>
              <div style={{fontSize: '10px'}}>OpenStreetMap</div>
              <small className="text-muted">Geographic Data</small>
            </div>
          </div>
          <div className="col-6">
            <div className="card bg-dark text-white p-2">
              <i className="fas fa-satellite text-warning mb-1"></i>
              <div style={{fontSize: '10px'}}>Landsat Imagery</div>
              <small className="text-muted">USGS/NASA</small>
            </div>
          </div>
          <div className="col-6">
            <div className="card bg-dark text-white p-2">
              <i className="fas fa-cloud text-info mb-1"></i>
              <div style={{fontSize: '10px'}}>Weather APIs</div>
              <small className="text-muted">NOAA/ECMWF</small>
            </div>
          </div>
        </div>

        <div className="mt-3 p-2 bg-dark rounded">
          <div className="text-warning small mb-1">
            <i className="fas fa-exclamation-triangle me-1"></i>
            Professional Geographic Data Sources Required
          </div>
          <div className="text-muted" style={{fontSize: '10px'}}>
            {region.name} - Coordinates: {region.coords?.lat?.toFixed(4)}, {region.coords?.lon?.toFixed(4)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerrainMapReal;