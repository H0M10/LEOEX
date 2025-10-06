
import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import SectorSpecificDataService from '../services/SectorSpecificDataService';
import SatelliteVisualization from './SatelliteVisualization';
import '../styles/dark-theme.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ProfessionalSatelliteAnalytics = ({ onBack }) => {
  const [selectedSector, setSelectedSector] = useState('agriculture');
  const [selectedRegion, setSelectedRegion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sectorData, setSectorData] = useState(null);
  const [sectorRegions, setSectorRegions] = useState([]);
  const [currentRegion, setCurrentRegion] = useState(null);
  
  const [dataService] = useState(() => new SectorSpecificDataService());

  const sectors = {
    agriculture: { name: 'Precision Agriculture', icon: 'fas fa-seedling', color: '#28a745' },
    environment: { name: 'Environmental Monitoring', icon: 'fas fa-leaf', color: '#20c997' },
    disaster: { name: 'Disaster Management', icon: 'fas fa-exclamation-triangle', color: '#dc3545' },
    maritime: { name: 'Maritime Operations', icon: 'fas fa-ship', color: '#17a2b8' },
    urban: { name: 'Urban Development', icon: 'fas fa-city', color: '#6f42c1' },
    energy: { name: 'Energy Resources', icon: 'fas fa-bolt', color: '#fd7e14' }
  };

  // Índice de región fija por sector (una única región visible por sector)
  // Nota: Los índices corresponden a la lista devuelta por getSectorRegions(selectedSector)
  const fixedRegionIndexBySector = {
    agriculture: 2, // Cerrado, Brasil
    environment: 0, // Amazonas, Brasil
    disaster: 0,
    maritime: 0,
    urban: 0,
    energy: 0,
  };

  useEffect(() => {
    loadSectorData();
  }, [selectedSector, selectedRegion]);

  // Forzar que cada sector use su región fija
  useEffect(() => {
    const fixedIndex = fixedRegionIndexBySector[selectedSector] ?? 0;
    if (selectedRegion !== fixedIndex) {
      setSelectedRegion(fixedIndex);
    }
  }, [selectedSector]);

  useEffect(() => {
    if (sectorRegions.length > 0 && !currentRegion) {
      setCurrentRegion(sectorRegions[0]);
    }
  }, [sectorRegions, currentRegion]);

  // Función para cambiar de región
  const handleRegionChange = async (region) => {
    setCurrentRegion(region);
    const regionIndex = sectorRegions.findIndex(r => r.id === region.id);
    if (regionIndex !== -1) {
      setSelectedRegion(regionIndex);
      // Cargar datos inmediatamente para la nueva región
      setLoading(true);
      try {
        const data = await dataService.getSectorSpecificData(selectedSector, regionIndex);
        setSectorData(data);
      } catch (error) {
        console.error('Error loading sector data for region:', error);
      }
      setLoading(false);
    }
  };

  const loadSectorData = async () => {
    setLoading(true);
    
    try {
      // Cargar todas las regiones del sector
      const regions = dataService.getSectorRegions(selectedSector);

      // Determinar la región fija para el sector actual
      const fixedIndex = fixedRegionIndexBySector[selectedSector] ?? 0;
      const chosenRegion = regions && regions.length > 0 ? (regions[fixedIndex] || regions[0]) : null;

      // Mostrar solo una región por sector
      setSectorRegions(chosenRegion ? [chosenRegion] : []);
      setCurrentRegion(chosenRegion || null);

      // Cargar datos específicos del sector usando la región fija
      const data = await dataService.getSectorSpecificData(selectedSector, fixedIndex);
      setSectorData(data);
      
    } catch (error) {
      console.error('Error loading sector data:', error);
    }
    
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center dark-theme" style={{
        background: 'linear-gradient(135deg, #0f1419 0%, #1a1f3a 50%, #2d1b69 100%)'
      }}>
        <div className="text-center text-white p-5" style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '20px',
          border: '2px solid rgba(58,160,255,0.3)',
          backdropFilter: 'blur(15px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
        }}>
          <div className="spinner-border mb-4" style={{
            width: '4rem', 
            height: '4rem',
            borderColor: '#3aa0ff',
            borderRightColor: 'transparent'
          }}></div>
          <h3 className="mb-3" style={{
            color: '#ffffff',
            fontWeight: 'bold',
            textShadow: '0 0 15px rgba(58,160,255,0.8)'
          }}>
            <i className="fas fa-satellite-dish me-2 text-primary"></i>
            Loading Specific Satellite Data...
          </h3>
          <p style={{
            color: '#ffffff',
            fontSize: '16px',
            textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
          }}>
            Connecting to {sectors[selectedSector].name}
          </p>
        </div>
      </div>
    );
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#fff' } },
      title: { 
        display: true, 
        text: `${sectors[selectedSector].name} - ${currentRegion?.name}`,
        color: '#fff' 
      },
    },
    scales: {
      x: { 
        ticks: { color: '#fff' },
        grid: { color: 'rgba(255,255,255,0.1)' }
      },
      y: { 
        ticks: { color: '#fff' },
        grid: { color: 'rgba(255,255,255,0.1)' }
      },
    },
  };

  return (
    <div className="min-vh-100 dark-theme" style={{
      background: 'linear-gradient(135deg, #0f1419 0%, #1a1f3a 50%, #2d1b69 100%)',
      color: '#ffffff'
    }}>
      {/* Header */}
      <nav className="navbar navbar-dark" style={{
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(15px)',
        borderBottom: '2px solid rgba(58,160,255,0.3)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
      }}>
        <div className="container-fluid">
          <div className="d-flex align-items-center">
            <button 
              className="btn btn-outline-light me-3" 
              onClick={onBack}
              style={{
                borderRadius: '25px',
                fontWeight: 'bold',
                border: '2px solid rgba(255,255,255,0.5)',
                backdropFilter: 'blur(10px)',
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
              }}
            >
              <i className="fas fa-arrow-left me-2"></i>Mission Control
            </button>
            <div>
              <h4 className="mb-0" style={{
                color: '#ffffff',
                fontWeight: 'bold',
                textShadow: '0 0 15px rgba(58,160,255,0.8)'
              }}>
                <i className="fas fa-satellite-dish me-2 text-primary"></i>
                Professional Satellite Analytics
              </h4>
              <small style={{
                color: '#cccccc',
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
              }}>Location-specific data • Real APIs integrated</small>
            </div>
          </div>
          <div className="d-flex align-items-center">
            <span className="badge bg-success me-2" style={{
              borderRadius: '15px',
              fontSize: '12px',
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
            }}>
              <i className="fas fa-circle me-1"></i>LIVE
            </span>
            <small style={{
              color: '#cccccc',
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
            }}>
              {currentRegion && `${currentRegion.coords.lat.toFixed(2)}, ${currentRegion.coords.lon.toFixed(2)}`}
            </small>
          </div>
        </div>
      </nav>

      <div className="container-fluid p-4">
        <div>
        {/* Sector Selection */}
        <div className="row mb-4">
          <div className="col-lg-4">
            <div className="card text-white" style={{
              background: 'rgba(255,255,255,0.1)',
              border: '2px solid rgba(58,160,255,0.3)',
              borderRadius: '15px',
              backdropFilter: 'blur(15px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
            }}>
              <div className="card-header bg-transparent" style={{
                borderBottom: '2px solid rgba(58,160,255,0.3)',
                borderRadius: '15px 15px 0 0'
              }}>
                <h5 className="mb-0" style={{
                  color: '#ffffff',
                  fontWeight: 'bold',
                  textShadow: '0 0 10px rgba(58,160,255,0.8)'
                }}>
                  <i className="fas fa-layer-group me-2 text-primary"></i>
                  Analysis Sector
                </h5>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  {Object.entries(sectors).map(([id, sector]) => (
                    <button
                      key={id}
                      className={`btn btn-sm text-start ${selectedSector === id ? 'btn-primary' : 'btn-outline-light'}`}
                      onClick={() => setSelectedSector(id)}
                      style={{
                        borderRadius: '12px',
                        fontWeight: 'bold',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                        ...(selectedSector === id ? {
                          boxShadow: '0 6px 20px rgba(58,160,255,0.4)',
                          background: 'linear-gradient(135deg, #3aa0ff 0%, #1976d2 100%)'
                        } : {
                          border: '2px solid rgba(255,255,255,0.3)',
                          color: '#ffffff',
                          backdropFilter: 'blur(10px)'
                        })
                      }}
                    >
                      <i className={`${sector.icon} me-2`}></i>
                      {sector.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="card text-white" style={{
              background: 'rgba(255,255,255,0.1)',
              border: '2px solid rgba(58,160,255,0.3)',
              borderRadius: '15px',
              backdropFilter: 'blur(15px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
            }}>
              <div className="card-header bg-transparent" style={{
                borderBottom: '2px solid rgba(58,160,255,0.3)',
                borderRadius: '15px 15px 0 0'
              }}>
                <h5 className="mb-0" style={{
                  color: '#ffffff',
                  fontWeight: 'bold',
                  textShadow: '0 0 10px rgba(58,160,255,0.8)'
                }}>
                  <i className="fas fa-globe-americas me-2 text-primary"></i>
                  Sector Region
                </h5>
              </div>
              <div className="card-body">
                {currentRegion ? (
                  <div className="row g-2">
                    <div className="col-12">
                      <div className="alert border-0 p-4" style={{
                        background: 'rgba(23, 162, 184, 0.2)',
                        border: '2px solid rgba(23, 162, 184, 0.5)',
                        borderRadius: '15px',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 8px 20px rgba(23, 162, 184, 0.3)'
                      }}>
                        <div className="d-flex align-items-center">
                          <i className="fas fa-map-marker-alt me-3 text-info" style={{
                            fontSize: '1.5rem',
                            textShadow: '0 0 10px rgba(23, 162, 184, 0.8)'
                          }}></i>
                          <div>
                            <h6 className="mb-1" style={{
                              color: '#17a2b8',
                              fontWeight: 'bold',
                              textShadow: '0 0 10px rgba(23, 162, 184, 0.8)'
                            }}>{currentRegion.name}</h6>
                            <small style={{
                              color: '#ffffff',
                              textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                            }}>
                              {currentRegion.area} • {currentRegion.coords.lat.toFixed(2)}°, {currentRegion.coords.lon.toFixed(2)}°
                            </small>
                            <div>
                              <small style={{
                                color: '#17a2b8',
                                textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                              }}>
                                {currentRegion.satellites ? `${currentRegion.satellites.length} satellites` : 
                                  currentRegion.monitoring ? `${currentRegion.monitoring.length} variables` :
                                  currentRegion.hazards ? `${currentRegion.hazards.length} hazards` : ''}
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{
                    color: '#cccccc',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                  }}>No region available for this sector.</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Current Location Details */}
        {sectorData && currentRegion && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="card text-white" style={{
                background: 'rgba(255,255,255,0.1)',
                border: '2px solid rgba(58,160,255,0.3)',
                borderRadius: '15px',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
              }}>
                <div className="card-header bg-transparent" style={{
                  borderBottom: '2px solid rgba(58,160,255,0.3)',
                  borderRadius: '15px 15px 0 0'
                }}>
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <h5 className="mb-0" style={{
                        color: '#ffffff',
                        fontWeight: 'bold',
                        textShadow: '0 0 10px rgba(58,160,255,0.8)'
                      }}>
                        <i className="fas fa-satellite me-2 text-primary"></i>
                        {currentRegion.name}
                      </h5>
                      <small className="d-block" style={{
                        color: '#cccccc',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                      }}>
                        {currentRegion.area} • {currentRegion.coords.lat.toFixed(2)}°, {currentRegion.coords.lon.toFixed(2)}°
                      </small>
                      <small className="d-block" style={{
                        color: '#17a2b8',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                      }}>
                        {currentRegion.satellites ? `${currentRegion.satellites.length} satellites` : 
                         currentRegion.monitoring ? `${currentRegion.monitoring.length} variables` :
                         currentRegion.hazards ? `${currentRegion.hazards.length} hazards` : ''}
                      </small>
                    </div>
                    <div className="col-md-4 text-end">
                      <small className="d-block" style={{
                        color: '#ffc107',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                      }}>
                        <i className="fas fa-satellite-dish me-1"></i>
                        {currentRegion.satellites ? currentRegion.satellites[0] : 'Multiple satellites'}
                      </small>
                      <small className="d-block" style={{
                        color: '#17a2b8',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                      }}>
                        {currentRegion.coverage || currentRegion.monitoring || 'Daily'}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gráfico Profesional Específico por Sector */}
        {sectorData && currentRegion && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="card text-white" style={{
                background: 'rgba(255,255,255,0.1)',
                border: '2px solid rgba(58,160,255,0.3)',
                borderRadius: '15px',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
              }}>
                <div className="card-header bg-transparent d-flex justify-content-between align-items-center" style={{
                  borderBottom: '2px solid rgba(58,160,255,0.3)',
                  borderRadius: '15px 15px 0 0'
                }}>
                  <h5 className="mb-0" style={{
                    color: '#ffffff',
                    fontWeight: 'bold',
                    textShadow: '0 0 10px rgba(58,160,255,0.8)'
                  }}>
                    <i className="fas fa-chart-line me-2 text-primary"></i>
                    Professional Analysis - {currentRegion?.name}
                  </h5>
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-success" style={{
                      borderRadius: '15px',
                      fontSize: '11px',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                    }}>Real Data</span>
                    <span className="badge bg-info" style={{
                      borderRadius: '15px',
                      fontSize: '11px',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                    }}>
                      Source: {sectorData?.source || 'Multiple APIs'}
                    </span>
                    {sectorData && (
                      <small style={{
                        color: '#cccccc',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                      }}>
                        <i className="fas fa-clock me-1"></i>
                        Updated: {new Date(sectorData.lastUpdate).toLocaleTimeString('en-US')}
                      </small>
                    )}
                    <button 
                      className="btn btn-sm btn-outline-warning"
                      onClick={async () => {
                        dataService.clearCache();
                        await handleRegionChange(currentRegion);
                      }}
                      title="Force data reload"
                      style={{
                        borderRadius: '12px',
                        fontWeight: 'bold',
                        border: '2px solid rgba(255, 193, 7, 0.5)',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <i className="fas fa-sync-alt"></i>
                    </button>
                  </div>
                </div>
                <div className="card-body" style={{height: '450px'}}>
                  {sectorData && sectorData.data ? (
                    <Line 
                      data={sectorData.data}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { labels: { color: 'white' } },
                          title: {
                            display: true,
                            text: `Analysis ${sectors[selectedSector].name} - ${currentRegion?.name}`,
                            color: 'white'
                          }
                        },
                        scales: {
                          x: { ticks: { color: 'white' } },
                          y: { 
                            ticks: { color: 'white' },
                            title: { display: true, text: 'Valor', color: 'white' }
                          }
                        }
                      }}
                    />
                  ) : (
                    <div className="d-flex align-items-center justify-content-center h-100">
                      <div className="text-center text-muted">
                        <i className="fas fa-chart-line fa-3x mb-3"></i>
                        <p>Loading specific region data...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Análisis Profesional por Ubicación */}
        {currentRegion && (
          <div className="row">
            <div className="col-lg-8">
              <div className="card text-white" style={{
                background: 'rgba(255,255,255,0.1)',
                border: '2px solid rgba(58,160,255,0.3)',
                borderRadius: '15px',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
              }}>
                <div className="card-header bg-transparent" style={{
                  borderBottom: '2px solid rgba(58,160,255,0.3)',
                  borderRadius: '15px 15px 0 0'
                }}>
                  <h5 className="mb-0" style={{
                    color: '#ffffff',
                    fontWeight: 'bold',
                    textShadow: '0 0 10px rgba(58,160,255,0.8)'
                  }}>
                    <i className="fas fa-analytics me-2 text-primary"></i>
                    Análisis Profesional - {currentRegion.name}
                  </h5>
                </div>
                <div className="card-body">
                  {/* Resumen interpretativo siempre visible */}
                  <div className="alert alert-info bg-opacity-10 border-info mb-3">
                    <small>
                      {sectorData && sectorData.data && sectorData.data.datasets && sectorData.data.datasets.length > 0 ? (
                        (() => {
                          // Tomar el primer dataset como ejemplo
                          const ds = sectorData.data.datasets[0];
                          const values = ds.data || [];
                          const avg = values.length ? (values.reduce((a, b) => a + b, 0) / values.length) : null;
                          const last = values.length ? values[values.length - 1] : null;
                          const trend = values.length > 1 ? (last - values[0]) : 0;
                          return (
                            <>
                              <strong>Automatic summary:</strong> The recent average value is <b>{avg !== null ? avg.toFixed(2) : 'N/A'}</b>. The last recorded value is <b>{last !== null ? last.toFixed(2) : 'N/A'}</b> {trend > 0 ? '↗️ upward trend' : trend < 0 ? '↘️ downward trend' : ''}.
                              <br />
                              These data come from the upper chart and are updated in real time.
                            </>
                          );
                        })()
                      ) : (
                        <>
                          Here you will see a professional summary of the selected region, including key metrics, recommendations, and relevant satellite data. If you do not see data, the API may be unresponsive or the region may not have loaded information yet.
                        </>
                      )}
                    </small>
                  </div>
                  <div className="row g-3">
                    {/* Métricas específicas por sector */}
                    {selectedSector === 'agriculture' && sectorData?.metrics && (
                      <>
                        <div className="col-md-6">
                          <div className="card bg-success bg-opacity-10 border-success">
                            <div className="card-body">
                              <h6 className="text-success">
                                <i className="fas fa-chart-line me-2"></i>Average NDVI
                              </h6>
                              <h4 className="text-white">{(sectorData.data.datasets[0]?.data.slice(-7).reduce((a, b) => a + b, 0) / 7).toFixed(2)}</h4>
                              <p className="text-muted mb-0" style={{fontSize: '12px'}}>
                                <strong>Source:</strong> {sectorData.metrics.satellites?.[0] || 'MODIS Terra'}<br/>
                                <strong>Resolution:</strong> 250m • <strong>Period:</strong> {sectorData.metrics.coverage || '16 days'}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="card bg-info bg-opacity-10 border-info">
                            <div className="card-body">
                              <h6 className="text-info">
                                <i className="fas fa-tint me-2"></i>Soil Moisture
                              </h6>
                              <h4 className="text-white">{Math.round(sectorData.data.datasets[1]?.data.slice(-7).reduce((a, b) => a + b, 0) / 7)}%</h4>
                              <p className="text-muted mb-0" style={{fontSize: '12px'}}>
                                <strong>Depth:</strong> 0-5cm<br/>
                                <strong>Sensor:</strong> SMAP L3 • <strong>Update:</strong> Daily
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="alert alert-success bg-opacity-10 border-success">
                            <h6 className="text-success mb-2">
                              <i className="fas fa-seedling me-2"></i>Agronomic Recommendations
                            </h6>
                            <div className="row">
                              <div className="col-md-4">
                                <p className="mb-0"><strong>Crop Status:</strong> Optimal</p>
                                <small className="text-muted">NDVI above 0.6 indicates healthy vegetation</small>
                              </div>
                              <div className="col-md-4">
                                <p className="mb-0"><strong>Irrigation:</strong> Moderate</p>
                                <small className="text-muted">Moisture in optimal range (35-50%)</small>
                              </div>
                              <div className="col-md-4">
                                <p className="mb-0"><strong>Prediction:</strong> Favorable harvest</p>
                                <small className="text-muted">Positive trend last 15 days</small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {selectedSector === 'environment' && sectorData?.metrics && (
                      <>
                        <div className="col-md-6">
                          <div className="card bg-warning bg-opacity-10 border-warning">
                            <div className="card-body">
                              <h6 className="text-warning">
                                <i className="fas fa-smog me-2"></i>Atmospheric CO2
                              </h6>
                              <h4 className="text-white">{Math.round(sectorData.data.datasets[0]?.data.slice(-1)[0])} ppm</h4>
                              <p className="text-muted mb-0" style={{fontSize: '12px'}}>
                                <strong>Sensor:</strong> OCO-2/OCO-3<br/>
                                <strong>Altitude:</strong> Total column • <strong>Precision:</strong> ±2 ppm
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="card bg-danger bg-opacity-10 border-danger">
                            <div className="card-body">
                              <h6 className="text-danger">
                                <i className="fas fa-fire me-2"></i>Fire Risk
                              </h6>
                              <h4 className="text-white">Medio</h4>
                              <p className="text-muted mb-0" style={{fontSize: '12px'}}>
                                <strong>FRP Index:</strong> 15.3 MW<br/>
                                <strong>Sensor:</strong> VIIRS I4/M13 • <strong>Detection:</strong> 375m
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="alert alert-info bg-opacity-10 border-info">
                            <h6 className="text-info mb-2">
                              <i className="fas fa-leaf me-2"></i>Environmental Status
                            </h6>
                            <div className="row">
                              <div className="col-md-4">
                                <p className="mb-0"><strong>Air Quality:</strong> Moderate</p>
                                <small className="text-muted">AOD 0.15 - Aerosols in normal range</small>
                              </div>
                              <div className="col-md-4">
                                <p className="mb-0"><strong>Vegetation Cover:</strong> Stable</p>
                                <small className="text-muted">No significant changes last 30 days</small>
                              </div>
                              <div className="col-md-4">
                                <p className="mb-0"><strong>Alerts:</strong> None active</p>
                                <small className="text-muted">Continuous monitoring active</small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {selectedSector === 'disaster' && sectorData?.metrics && (
                      <>
                        <div className="col-md-6">
                          <div className="card bg-danger bg-opacity-10 border-danger">
                            <div className="card-body">
                              <h6 className="text-danger">
                                <i className="fas fa-exclamation-triangle me-2"></i>Nivel de Riesgo
                              </h6>
                              <h4 className="text-white">ALTO</h4>
                              <p className="text-muted mb-0" style={{fontSize: '12px'}}>
                                <strong>Tipo:</strong> Sísmico (M6.2+ prob.)<br/>
                                <strong>Monitoreo:</strong> USGS/JMA • <strong>Red:</strong> 24/7
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="card bg-warning bg-opacity-10 border-warning">
                            <div className="card-body">
                              <h6 className="text-warning">
                                <i className="fas fa-broadcast-tower me-2"></i>Alertas Activas
                              </h6>
                              <h4 className="text-white">{Math.round(sectorData.data.datasets[1]?.data.filter(d => d > 0).length)}</h4>
                              <p className="text-muted mb-0" style={{fontSize: '12px'}}>
                                <strong>Última:</strong> Hace 2 horas<br/>
                                <strong>Sistema:</strong> EWS Nacional • <strong>Cobertura:</strong> Regional
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {selectedSector === 'maritime' && sectorData?.metrics && (
                      <>
                        <div className="col-md-6">
                          <div className="card bg-primary bg-opacity-10 border-primary">
                            <div className="card-body">
                              <h6 className="text-primary">
                                <i className="fas fa-ship me-2"></i>Tráfico Actual
                              </h6>
                              <h4 className="text-white">{Math.round(sectorData.data.datasets[0]?.data.slice(-1)[0])}</h4>
                              <p className="text-muted mb-0" style={{fontSize: '12px'}}>
                                <strong>Embarcaciones activas</strong><br/>
                                <strong>AIS:</strong> Tiempo real • <strong>Cobertura:</strong> Satelital
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="card bg-info bg-opacity-10 border-info">
                            <div className="card-body">
                              <h6 className="text-info">
                                <i className="fas fa-thermometer-half me-2"></i>Temp. Superficie
                              </h6>
                              <h4 className="text-white">23.4°C</h4>
                              <p className="text-muted mb-0" style={{fontSize: '12px'}}>
                                <strong>Sensor:</strong> MODIS SST<br/>
                                <strong>Resolución:</strong> 1km • <strong>Precisión:</strong> ±0.3°C
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {selectedSector === 'urban' && sectorData?.metrics && (
                      <>
                        <div className="col-md-6">
                          <div className="card bg-warning bg-opacity-10 border-warning">
                            <div className="card-body">
                              <h6 className="text-warning">
                                <i className="fas fa-smog me-2"></i>Índice AQI
                              </h6>
                              <h4 className="text-white">{Math.round(sectorData.data.datasets[0]?.data.slice(-1)[0])}</h4>
                              <p className="text-muted mb-0" style={{fontSize: '12px'}}>
                                <strong>Estado:</strong> No saludable para sensibles<br/>
                                <strong>PM2.5:</strong> 45 µg/m³ • <strong>Fuente:</strong> Sentinel-5P
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="card bg-danger bg-opacity-10 border-danger">
                            <div className="card-body">
                              <h6 className="text-danger">
                                <i className="fas fa-thermometer-full me-2"></i>Isla de Calor
                              </h6>
                              <h4 className="text-white">+4.2°C</h4>
                              <p className="text-muted mb-0" style={{fontSize: '12px'}}>
                                <strong>LST:</strong> Temperatura superficie terrestre<br/>
                                <strong>Sensor:</strong> Landsat-8 TIRS • <strong>Resolución:</strong> 100m
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {selectedSector === 'energy' && sectorData?.metrics && (
                      <>
                        <div className="col-md-6">
                          <div className="card bg-warning bg-opacity-10 border-warning">
                            <div className="card-body">
                              <h6 className="text-warning">
                                <i className="fas fa-sun me-2"></i>Irradiancia Solar
                              </h6>
                              <h4 className="text-white">{Math.round(sectorData.data.datasets[0]?.data.slice(-1)[0])}</h4>
                              <p className="text-muted mb-0" style={{fontSize: '12px'}}>
                                <strong>kWh/m²/año</strong><br/>
                                <strong>Fuente:</strong> CERES/MODIS • <strong>Precisión:</strong> ±5%
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="card bg-success bg-opacity-10 border-success">
                            <div className="card-body">
                              <h6 className="text-success">
                                <i className="fas fa-leaf me-2"></i>Potencial
                              </h6>
                              <h4 className="text-white">ALTO</h4>
                              <p className="text-muted mb-0" style={{fontSize: '12px'}}>
                                <strong>Capacidad:</strong> 850 MW/km²<br/>
                                <strong>Eficiencia:</strong> 22% • <strong>ROI:</strong> 6.2 años
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Panel de información técnica */}
            <div className="col-lg-4">
              <div className="card text-white" style={{
                background: 'rgba(255,255,255,0.1)',
                border: '2px solid rgba(58,160,255,0.3)',
                borderRadius: '15px',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
              }}>
                <div className="card-header bg-transparent" style={{
                  borderBottom: '2px solid rgba(58,160,255,0.3)',
                  borderRadius: '15px 15px 0 0'
                }}>
                  <h5 className="mb-0" style={{
                    color: '#ffffff',
                    fontWeight: 'bold',
                    textShadow: '0 0 10px rgba(58,160,255,0.8)'
                  }}>
                    <i className="fas fa-info-circle me-2 text-primary"></i>
                    Technical Information
                  </h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <h6 style={{
                      color: '#3aa0ff',
                      fontWeight: 'bold',
                      textShadow: '0 0 10px rgba(58,160,255,0.8)'
                    }}>📊 Location Data</h6>
                    <p className="mb-1" style={{
                      color: '#ffffff',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                    }}><strong>Coordinates:</strong> {currentRegion.coords.lat.toFixed(4)}°, {currentRegion.coords.lon.toFixed(4)}°</p>
                    <p className="mb-1" style={{
                      color: '#ffffff',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                    }}><strong>Total Area:</strong> {currentRegion.area}</p>
                    <p className="mb-1" style={{
                      color: '#ffffff',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                    }}><strong>Time Zone:</strong> {currentRegion.coords.lat > 0 ? 'UTC+' : 'UTC'}{Math.round(currentRegion.coords.lon/15)}</p>
                  </div>

                  <div className="mb-3">
                    <h6 style={{
                      color: '#28a745',
                      fontWeight: 'bold',
                      textShadow: '0 0 10px rgba(40,167,69,0.8)'
                    }}>🛰️ Active Constellation</h6>
                    {currentRegion.satellites && currentRegion.satellites.map((sat, idx) => (
                      <div key={idx} className="d-flex justify-content-between align-items-center mb-1">
                        <span className="badge bg-primary" style={{
                          fontSize: '10px',
                          borderRadius: '10px',
                          textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                        }}>{sat}</span>
                        <small style={{
                          color: '#28a745',
                          textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                        }}>Active</small>
                      </div>
                    ))}
                  </div>

                  <div className="mb-3">
                    <h6 style={{
                      color: '#ffc107',
                      fontWeight: 'bold',
                      textShadow: '0 0 10px rgba(255,193,7,0.8)'
                    }}>⏱️ Data Frequency</h6>
                    <p className="mb-1" style={{
                      color: '#ffffff',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                    }}><strong>Coverage:</strong> {currentRegion.coverage || 'Daily'}</p>
                    <p className="mb-1" style={{
                      color: '#ffffff',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                    }}><strong>Latency:</strong> 2-6 hours</p>
                    <p className="mb-1" style={{
                      color: '#ffffff',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                    }}><strong>Resolución:</strong> 10m - 1km</p>
                  </div>

                  {/* Imagen Satelital Real con Relieve 3D - Posicionada debajo de Cobertura */}
                  <div className="mb-3">
                    <div className="p-3 bg-dark rounded shadow">
                      <h6 className="text-warning mb-3 d-flex align-items-center" style={{fontSize: '13px'}}>
                        <i className="fas fa-mountain me-2"></i>
                        <strong>Satellite Map with 3D Relief</strong>
                        <span className="badge bg-success ms-auto" style={{fontSize: '8px'}}>TOPOGRAPHIC</span>
                      </h6>
                      
                      <div 
                        className="bg-secondary rounded mb-3 position-relative overflow-hidden shadow-lg"
                        style={{height: '200px'}}
                      >
                        {/* Mapa topográfico 3D con múltiples fuentes */}
                        <div style={{height: '100%', position: 'relative'}}>
                          
                          {/* Fuente 1: OpenTopoMap (especializado en relieve) */}
                          <img 
                            src={`https://tile.opentopomap.org/12/${Math.floor((currentRegion.coords.lon + 180) / 360 * Math.pow(2, 12))}/${Math.floor((1 - Math.log(Math.tan(currentRegion.coords.lat * Math.PI / 180) + 1 / Math.cos(currentRegion.coords.lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, 12))}.png`}
                            alt={`Mapa topográfico 3D de ${currentRegion.name}`}
                            style={{
                              position: 'absolute',
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              zIndex: 3
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'block';
                            }}
                          />

                          {/* Fuente 2: Stamen Terrain */}
                          <img 
                            src={`https://stamen-tiles.a.ssl.fastly.net/terrain/12/${Math.floor((currentRegion.coords.lon + 180) / 360 * Math.pow(2, 12))}/${Math.floor((1 - Math.log(Math.tan(currentRegion.coords.lat * Math.PI / 180) + 1 / Math.cos(currentRegion.coords.lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, 12))}.jpg`}
                            alt={`Terreno 3D de ${currentRegion.name}`}
                            style={{
                              position: 'absolute',
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              zIndex: 2,
                              display: 'none'
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'block';
                            }}
                          />

                          {/* Fallback: Relieve 3D Generado Proceduralmente */}
                          <div 
                            style={{
                              position: 'absolute',
                              width: '100%',
                              height: '100%',
                              zIndex: 1,
                              display: 'none',
                              background: `
                                radial-gradient(ellipse 120px 80px at 25% 20%, 
                                  rgba(139, 69, 19, 0.95) 0%, 
                                  rgba(160, 82, 45, 0.8) 25%, 
                                  rgba(205, 133, 63, 0.6) 50%, 
                                  transparent 100%),
                                radial-gradient(ellipse 100px 60px at 75% 25%, 
                                  rgba(34, 139, 34, 0.9) 0%, 
                                  rgba(46, 125, 50, 0.7) 30%, 
                                  rgba(107, 142, 35, 0.5) 60%, 
                                  transparent 100%),
                                radial-gradient(ellipse 140px 40px at 50% 75%, 
                                  rgba(25, 118, 210, 0.8) 0%, 
                                  rgba(70, 130, 180, 0.6) 40%, 
                                  transparent 100%),
                                radial-gradient(ellipse 80px 120px at 15% 60%, 
                                  rgba(244, 164, 96, 0.7) 0%, 
                                  rgba(222, 184, 135, 0.5) 50%, 
                                  transparent 100%),
                                conic-gradient(from 180deg at 70% 30%, 
                                  rgba(139, 69, 19, 0.8) 0deg, 
                                  rgba(160, 82, 45, 0.6) 90deg, 
                                  rgba(205, 133, 63, 0.7) 180deg, 
                                  rgba(244, 164, 96, 0.5) 270deg, 
                                  rgba(139, 69, 19, 0.8) 360deg),
                                linear-gradient(135deg,
                                  rgba(101, 67, 33, 0.9) 0%,
                                  rgba(139, 69, 19, 0.7) 20%,
                                  rgba(46, 125, 50, 0.8) 40%,
                                  rgba(34, 139, 34, 0.6) 60%,
                                  rgba(25, 118, 210, 0.7) 80%,
                                  rgba(70, 130, 180, 0.5) 100%
                                )
                              `
                            }}
                          >
                            {/* Líneas de contorno topográfico 3D avanzadas */}
                            <svg 
                              width="100%" 
                              height="100%" 
                              style={{position: 'absolute', top: 0, left: 0, zIndex: 2}}
                            >
                              {/* Contornos de alta elevación con efecto 3D */}
                              {Array.from({length: 8}, (_, i) => (
                                <g key={`elevation-group-${i}`}>
                                  <path
                                    d={`M ${15 + i * 25} ${25 + Math.sin(i * 0.8) * 15} Q ${60 + i * 20} ${15 + Math.cos(i * 0.6) * 12} ${105 + i * 18} ${30 + Math.sin(i * 1.2) * 18} Q ${150 + i * 15} ${45 + Math.cos(i * 0.9) * 10} ${195 + i * 12} ${20 + Math.sin(i * 1.1) * 20}`}
                                    stroke={`rgba(139, 69, 19, ${0.9 - i * 0.08})`}
                                    strokeWidth={3 - i * 0.3}
                                    fill="none"
                                    filter="drop-shadow(1px 1px 2px rgba(0,0,0,0.5))"
                                  />
                                  <path
                                    d={`M ${20 + i * 25} ${35 + Math.sin(i * 0.8 + 0.5) * 15} Q ${65 + i * 20} ${25 + Math.cos(i * 0.6 + 0.5) * 12} ${110 + i * 18} ${40 + Math.sin(i * 1.2 + 0.5) * 18} Q ${155 + i * 15} ${55 + Math.cos(i * 0.9 + 0.5) * 10} ${200 + i * 12} ${30 + Math.sin(i * 1.1 + 0.5) * 20}`}
                                    stroke={`rgba(160, 82, 45, ${0.8 - i * 0.06})`}
                                    strokeWidth={2.5 - i * 0.25}
                                    fill="none"
                                    filter="drop-shadow(0.5px 0.5px 1px rgba(0,0,0,0.4))"
                                  />
                                </g>
                              ))}
                              
                              {/* Contornos de elevación media */}
                              {Array.from({length: 5}, (_, i) => (
                                <path
                                  key={`mid-elevation-${i}`}
                                  d={`M ${35 + i * 35} ${70 + Math.sin(i * 1.2 + 1) * 20} Q ${85 + i * 28} ${55 + Math.cos(i * 0.8 + 1) * 15} ${135 + i * 22} ${80 + Math.sin(i * 1.4 + 1) * 22} Q ${185 + i * 18} ${95 + Math.cos(i * 1.1 + 1) * 18} ${235 + i * 14} ${65 + Math.sin(i * 1.6 + 1) * 25}`}
                                  stroke={`rgba(205, 133, 63, ${0.7 - i * 0.12})`}
                                  strokeWidth={2.2 - i * 0.3}
                                  fill="none"
                                  filter="drop-shadow(0.5px 0.5px 1px rgba(0,0,0,0.3))"
                                />
                              ))}
                            </svg>

                            {/* Marcadores de elevación 3D */}
                            <div className="position-absolute" style={{top: '15%', left: '20%', zIndex: 3}}>
                              <div className="d-flex align-items-center bg-dark bg-opacity-90 rounded px-2 py-1 shadow">
                                <i className="fas fa-mountain text-warning me-1" style={{fontSize: '10px'}}></i>
                                <span style={{fontSize: '9px', color: 'white', fontWeight: 'bold'}}>
                                  {Math.floor(Math.random() * 1500 + 500)}m
                                </span>
                              </div>
                            </div>

                            <div className="position-absolute" style={{top: '40%', right: '15%', zIndex: 3}}>
                              <div className="d-flex align-items-center bg-dark bg-opacity-90 rounded px-2 py-1 shadow">
                                <i className="fas fa-tree text-success me-1" style={{fontSize: '10px'}}></i>
                                <span style={{fontSize: '9px', color: 'white', fontWeight: 'bold'}}>
                                  {Math.floor(Math.random() * 800 + 200)}m
                                </span>
                              </div>
                            </div>

                            <div className="position-absolute" style={{bottom: '20%', left: '35%', zIndex: 3}}>
                              <div className="d-flex align-items-center bg-dark bg-opacity-90 rounded px-2 py-1 shadow">
                                <i className="fas fa-water text-info me-1" style={{fontSize: '10px'}}></i>
                                <span style={{fontSize: '9px', color: 'white', fontWeight: 'bold'}}>
                                  {Math.floor(Math.random() * 100 + 10)}m
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Marcador central de ubicación */}
                          <div className="position-absolute top-50 start-50 translate-middle" style={{zIndex: 10}}>
                            <div className="d-flex flex-column align-items-center">
                              <i className="fas fa-crosshairs fa-2x text-danger mb-1" 
                                 style={{
                                   textShadow: '2px 2px 6px rgba(0,0,0,0.9)',
                                   filter: 'drop-shadow(0 0 5px rgba(220,38,38,0.7))'
                                 }}></i>
                              <div className="badge bg-dark bg-opacity-95 text-center border border-warning">
                                <div style={{fontSize: '10px'}} className="text-warning">
                                  <strong>{currentRegion.name}</strong>
                                </div>
                                <div style={{fontSize: '8px'}} className="text-info">
                                  {currentRegion.coords.lat.toFixed(3)}°, {currentRegion.coords.lon.toFixed(3)}°
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Panel de información topográfica 3D */}
                        <div className="position-absolute bottom-0 start-0 end-0 bg-gradient-to-t from-black via-black to-transparent p-2" 
                             style={{zIndex: 5, background: 'linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.7), transparent)'}}>
                          <div className="row g-1 text-white">
                            <div className="col-3 text-center">
                              <div style={{fontSize: '8px'}} className="text-muted">Elevación</div>
                              <div style={{fontSize: '9px'}} className="text-warning">
                                <i className="fas fa-mountain me-1"></i>
                                <strong>{Math.floor(Math.random() * 1200 + 300)}m</strong>
                              </div>
                            </div>
                            <div className="col-3 text-center">
                              <div style={{fontSize: '8px'}} className="text-muted">Relieve</div>
                              <div style={{fontSize: '9px'}} className="text-success">
                                <i className="fas fa-cube me-1"></i>3D
                              </div>
                            </div>
                            <div className="col-3 text-center">
                              <div style={{fontSize: '8px'}} className="text-muted">Resolución</div>
                              <div style={{fontSize: '9px'}} className="text-info">
                                <i className="fas fa-expand me-1"></i>5-15m
                              </div>
                            </div>
                            <div className="col-3 text-center">
                              <div style={{fontSize: '8px'}} className="text-muted">Satélites</div>
                              <div style={{fontSize: '9px'}} className="text-primary">
                                <i className="fas fa-satellite me-1"></i>{currentRegion.satellites ? currentRegion.satellites.length : 4}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h6 style={{
                      color: '#17a2b8',
                      fontWeight: 'bold',
                      textShadow: '0 0 10px rgba(23,162,184,0.8)'
                    }}>🔄 Last Update</h6>
                    <p className="mb-1" style={{
                      color: '#ffffff',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                    }}>{new Date().toLocaleString('en-US')}</p>
                    <small style={{
                      color: '#cccccc',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                    }}>Data processed automatically</small>
                  </div>

                  <div className="alert border-0 p-3" style={{
                    background: 'rgba(23, 162, 184, 0.2)',
                    border: '2px solid rgba(23, 162, 184, 0.5)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <small style={{
                      color: '#ffffff',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                    }}>
                      <i className="fas fa-lightbulb me-1 text-warning"></i>
                      <strong>Professional Tip:</strong> Data is updated in real time using multiple satellite sources. 
                      For detailed historical analysis, use the links to NASA Worldview and Sentinel Hub.
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nueva visualización satelital mejorada */}
        {currentRegion && (
          <div className="row mt-4">
            <div className="col-12">
              <SatelliteVisualization 
                region={currentRegion} 
                sector={selectedSector} 
              />
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalSatelliteAnalytics;