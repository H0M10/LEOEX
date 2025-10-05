import React, { useState, useEffect } from 'react';

const APIConfiguration = ({ onSave, onClose, currentKeys }) => {
  const [apiKeys, setApiKeys] = useState({
    nasa: currentKeys?.nasa || '',
    n2yo: currentKeys?.n2yo || '',
    openWeather: currentKeys?.openWeather || ''
  });
  const [testing, setTesting] = useState({});
  const [testResults, setTestResults] = useState({});

  const apiInfo = {
    nasa: {
      name: 'NASA API',
      url: 'https://api.nasa.gov/',
      description: 'Imágenes satelitales Landsat, datos MODIS, eventos naturales',
      limits: 'Gratuito: 1,000 requests/hora',
      example: 'Elimina el error 429 que viste antes'
    },
    n2yo: {
      name: 'N2YO Satellite Tracking',
      url: 'https://www.n2yo.com/api/',
      description: 'Tracking en tiempo real de satélites LEO',
      limits: 'Gratuito: 1,000 requests/día',
      example: 'Posiciones exactas de satélites sobre cualquier ubicación'
    },
    openWeather: {
      name: 'OpenWeatherMap',
      url: 'https://openweathermap.org/api',
      description: 'Datos meteorológicos desde satélites',
      limits: 'Gratuito: 1,000 calls/día',
      example: 'Temperatura, humedad, cobertura de nubes en tiempo real'
    }
  };

  const handleInputChange = (api, value) => {
    setApiKeys(prev => ({
      ...prev,
      [api]: value
    }));
  };

  const testAPI = async (api) => {
    setTesting(prev => ({ ...prev, [api]: true }));
    setTestResults(prev => ({ ...prev, [api]: null }));

    try {
      let testUrl = '';
      const key = apiKeys[api];

      switch (api) {
        case 'nasa':
          testUrl = `https://api.nasa.gov/planetary/apod?api_key=${key}`;
          break;
        case 'n2yo':
          testUrl = `https://api.n2yo.com/rest/v1/satellite/above/41.702/-76.014/0/70/18/?apiKey=${key}`;
          break;
        case 'openWeather':
          testUrl = `https://api.openweathermap.org/data/2.5/weather?lat=40.7128&lon=-74.0060&appid=${key}`;
          break;
        default:
          throw new Error('API no reconocida');
      }

      const response = await fetch(testUrl);
      
      if (response.ok) {
        setTestResults(prev => ({ 
          ...prev, 
          [api]: { success: true, message: '✅ API key válida y funcionando' }
        }));
      } else {
        setTestResults(prev => ({ 
          ...prev, 
          [api]: { success: false, message: `❌ Error ${response.status}: API key inválida` }
        }));
      }
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        [api]: { success: false, message: `❌ Error de conexión: ${error.message}` }
      }));
    }

    setTesting(prev => ({ ...prev, [api]: false }));
  };

  const handleSave = () => {
    // Guardar en localStorage
    localStorage.setItem('satelliteAPIKeys', JSON.stringify(apiKeys));
    onSave(apiKeys);
  };

  useEffect(() => {
    // Cargar keys existentes del localStorage
    const savedKeys = localStorage.getItem('satelliteAPIKeys');
    if (savedKeys) {
      const parsed = JSON.parse(savedKeys);
      setApiKeys(parsed);
    }
  }, []);

  return (
    <div className="modal show d-block" style={{background: 'rgba(0,0,0,0.8)'}}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content bg-dark text-white">
          <div className="modal-header border-bottom border-secondary">
            <h5 className="modal-title">
              <i className="fas fa-satellite-dish me-2 text-primary"></i>
              Configurar APIs Satelitales Reales
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          
          <div className="modal-body">
            <div className="alert alert-info">
              <h6><i className="fas fa-info-circle me-2"></i>¿Por qué configurar APIs?</h6>
              <ul className="mb-0">
                <li><strong>Eliminar error 429:</strong> Sin límites de DEMO_KEY</li>
                <li><strong>Datos 100% reales:</strong> Imágenes, tracking, meteorología</li>
                <li><strong>Completamente gratuito:</strong> Todas las APIs tienen planes gratuitos</li>
                <li><strong>5 minutos de setup:</strong> Registro rápido y fácil</li>
              </ul>
            </div>

            {Object.entries(apiInfo).map(([api, info]) => (
              <div key={api} className="card bg-secondary mb-4">
                <div className="card-header">
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <h6 className="mb-0">
                        <i className="fas fa-key me-2 text-warning"></i>
                        {info.name}
                      </h6>
                    </div>
                    <div className="col-md-4 text-end">
                      <a 
                        href={info.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-sm"
                      >
                        <i className="fas fa-external-link-alt me-1"></i>
                        Obtener API Key
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="card-body">
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <p className="mb-1"><strong>Funcionalidad:</strong></p>
                      <small className="text-muted">{info.description}</small>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-1"><strong>Límites:</strong></p>
                      <small className="text-success">{info.limits}</small>
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-12">
                      <p className="mb-1"><strong>Ejemplo:</strong></p>
                      <small className="text-info">{info.example}</small>
                    </div>
                  </div>
                  
                  <div className="row align-items-end">
                    <div className="col-md-8">
                      <label className="form-label small">API Key:</label>
                      <input
                        type="password"
                        className="form-control form-control-sm"
                        placeholder={`Pegar tu ${info.name} API key aquí...`}
                        value={apiKeys[api]}
                        onChange={(e) => handleInputChange(api, e.target.value)}
                      />
                    </div>
                    <div className="col-md-4">
                      <button
                        className="btn btn-outline-success btn-sm w-100"
                        onClick={() => testAPI(api)}
                        disabled={!apiKeys[api] || testing[api]}
                      >
                        {testing[api] ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-1"></span>
                            Probando...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-vial me-1"></i>
                            Probar API
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {testResults[api] && (
                    <div className={`alert ${testResults[api].success ? 'alert-success' : 'alert-danger'} mt-2 py-2`}>
                      <small>{testResults[api].message}</small>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className="alert alert-warning">
              <h6><i className="fas fa-clock me-2"></i>Alternativa: Usar sin API keys</h6>
              <p className="mb-0">
                Puedes seguir usando la plataforma con datos mixtos (reales + simulados) sin configurar APIs. 
                Las estadísticas principales ya son 100% reales.
              </p>
            </div>
          </div>
          
          <div className="modal-footer border-top border-secondary">
            <div className="row w-100">
              <div className="col-md-6">
                <button 
                  type="button" 
                  className="btn btn-secondary w-100" 
                  onClick={onClose}
                >
                  <i className="fas fa-times me-1"></i>
                  Usar Sin APIs (Datos Mixtos)
                </button>
              </div>
              <div className="col-md-6">
                <button 
                  type="button" 
                  className="btn btn-success w-100" 
                  onClick={handleSave}
                  disabled={!apiKeys.nasa && !apiKeys.n2yo && !apiKeys.openWeather}
                >
                  <i className="fas fa-save me-1"></i>
                  Guardar y Activar APIs Reales
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIConfiguration;