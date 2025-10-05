import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/dark-theme.css';

// Simulated key stats (not displayed)
const stats = [
  { label: 'Active LEO Satellites', value: 6543, icon: 'fas fa-satellite', color: 'success' },
  { label: 'Tracked Debris', value: 34700, icon: 'fas fa-meteor', color: 'danger' },
  { label: 'Launches Today', value: 3, icon: 'fas fa-rocket', color: 'primary' },
  { label: 'Conjunctions', value: 12, icon: 'fas fa-exclamation-triangle', color: 'warning' }
];


export default function LEOExchangeDashboard() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [compareMode, setCompareMode] = useState(false);
  const [serviceFilter, setServiceFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [minRep, setMinRep] = useState(0);
  const [minSus, setMinSus] = useState(0);
  const [certifiedOnly, setCertifiedOnly] = useState(false);
  const [hoveredProvider, setHoveredProvider] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  // Usar variable base configurable por entorno
  const base = import.meta.env.VITE_API_BASE || 'http://localhost:9002';

  useEffect(() => {
    setLoading(true);
    axios.get(`${base}/api/providers/reales`, { timeout: 7000 })
      .then(res => setProviders(res.data))
      .catch(() => setProviders([]))
      .finally(() => setLoading(false));
  }, [base]);

  const filteredProviders = providers.filter(p =>
    (p.name?.toLowerCase().includes(filter.toLowerCase()) ||
      (p.services || []).some(s => s.toLowerCase().includes(filter.toLowerCase()))) &&
    (serviceFilter ? (p.services || []).includes(serviceFilter) : true) &&
    (countryFilter ? p.country === countryFilter : true) &&
    (p.reputation >= minRep) &&
    (p.sustainability >= minSus) &&
    (certifiedOnly ? p.leoCertified === true : true)
  );
  const selectedProviders = providers.filter(p => selectedIds.includes(p.id));

  // Tooltip helper
  const tooltip = (text) => <span className="ms-1" data-bs-toggle="tooltip" title={text} style={{cursor:'help', color:'#888'}}> <i className="fas fa-info-circle"></i></span>;

  // Badge helper
  const badge = (type) => {
    if (type === 'top') return <span className="badge bg-warning text-dark ms-2 animate__animated animate__bounceIn">Top</span>;
    if (type === 'eco') return <span className="badge bg-success ms-2 animate__animated animate__pulse">Eco</span>;
  if (type === 'new') return <span className="badge bg-primary ms-2 animate__animated animate__fadeIn">New</span>;
    return null;
  };

  // Trend icon
  const trendIcon = (trend) => {
    if (trend === 'up') return <i className="fas fa-arrow-up text-success ms-1 animate__animated animate__fadeIn"></i>;
    if (trend === 'down') return <i className="fas fa-arrow-down text-danger ms-1 animate__animated animate__fadeIn"></i>;
    return <i className="fas fa-minus text-secondary ms-1 animate__animated animate__fadeIn"></i>;
  };

  // Toggle selection
  const toggleSelect = (id) => {
    setSelectedIds(ids => ids.includes(id) ? ids.filter(x=>x!==id) : [...ids, id]);
  };

  // Servicios y países únicos para filtros
  const allServices = Array.from(new Set(providers.flatMap(p => p.services || [])));
  const allCountries = Array.from(new Set(providers.map(p => p.country)));

  // Ranking top 3
  const topProviders = [...providers].sort((a,b)=>(b.reputation||0)-(a.reputation||0)).slice(0,3);

  // Gráfica simple de servicios (barras)
  const serviceCounts = allServices.map(s => ({
    name: s,
    count: providers.filter(p => (p.services||[]).includes(s)).length
  }));

  if (loading) return (
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
          <i className="fas fa-exchange-alt me-2 text-primary"></i>
          Loading LEO Data Exchange...
        </h3>
        <p style={{
          color: '#ffffff',
          fontSize: '16px',
          textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
        }}>
          Connecting to real satellite providers
        </p>
      </div>
    </div>
  );

  return (
    <>
      <div className="min-vh-100 animate__animated animate__fadeIn dark-theme" style={{
        background: 'linear-gradient(135deg, #0f1419 0%, #1a1f3a 50%, #2d1b69 100%)',
        color: '#ffffff'
      }}>
      <div className="container-fluid py-4">
        <h1 className="mb-4 animate__animated animate__fadeInDown" style={{
          color: '#ffffff',
          fontWeight: 'bold',
          fontSize: '2.5rem',
          textShadow: '0 0 20px rgba(58,160,255,0.8)'
        }}>
          <i className="fas fa-exchange-alt me-3 text-primary"></i>LEO Data Exchange
        </h1>
        <div className="alert alert-info mb-4 animate__animated animate__fadeInUp" style={{
          background: 'rgba(58,160,255,0.1)',
          border: '1px solid rgba(58,160,255,0.3)',
          color: '#ffffff'
        }}>
          <i className="fas fa-info-circle me-2 text-primary"></i>
          <strong>Explore the exchange of data and services in LEO.</strong> Search providers, compare reputation and sustainability, and request custom quotes. Contribute to a more efficient and responsible space ecosystem!
        </div>

        {/* Ranking top 3 */}
        <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-center gap-4">
            {topProviders.map((p, i) => (
              <div key={p.id} className={`card border-${i===0?'warning':i===1?'secondary':'primary'} shadow-sm animate__animated animate__zoomIn`} style={{
                width:180,
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                color: '#ffffff'
              }}>
                <div className="card-body text-center">
                  <div style={{fontSize:32}}>
                    {i===0 && <i className="fas fa-medal text-warning"></i>}
                    {i===1 && <i className="fas fa-medal text-secondary"></i>}
                    {i===2 && <i className="fas fa-medal text-primary"></i>}
                  </div>
                  <strong style={{color: '#ffffff'}}>{p.name}</strong>
                  <div className="text-light small">{p.country}</div>
                  <div className="mt-2"><span className="badge bg-info"><i className="fas fa-star me-1"></i>{p.reputation}</span> {trendIcon(p.trend)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filtros avanzados */}
      <div className="card mb-4 p-3 animate__animated animate__fadeInUp" style={{
        background: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.2)',
        backdropFilter: 'blur(10px)',
        color: '#ffffff'
      }}>
        <div className="row g-2 align-items-end">
          <div className="col-md-3">
            <label className="form-label text-light">Service</label>
            <select className="form-select" value={serviceFilter} onChange={e=>setServiceFilter(e.target.value)} style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#ffffff'
            }}>
              <option value="" style={{background: '#1a1f3a', color: '#ffffff'}}>All</option>
              {allServices.map(s=>(<option key={s} style={{background: '#1a1f3a', color: '#ffffff'}}>{s}</option>))}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label text-light">Country</label>
            <select className="form-select" value={countryFilter} onChange={e=>setCountryFilter(e.target.value)} style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#ffffff'
            }}>
              <option value="" style={{background: '#1a1f3a', color: '#ffffff'}}>All</option>
              {allCountries.map(c=>(<option key={c} style={{background: '#1a1f3a', color: '#ffffff'}}>{c}</option>))}
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label text-light">Minimum Reputation</label>
            <select className="form-select" value={minRep} onChange={e=>setMinRep(Number(e.target.value))} style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#ffffff'
            }}>
              <option value={0} style={{background: '#1a1f3a', color: '#ffffff'}}>All ⭐</option>
              <option value={1} style={{background: '#1a1f3a', color: '#ffffff'}}>⭐ (1+)</option>
              <option value={2} style={{background: '#1a1f3a', color: '#ffffff'}}>⭐⭐ (2+)</option>
              <option value={3} style={{background: '#1a1f3a', color: '#ffffff'}}>⭐⭐⭐ (3+)</option>
              <option value={4} style={{background: '#1a1f3a', color: '#ffffff'}}>⭐⭐⭐⭐ (4+)</option>
              <option value={5} style={{background: '#1a1f3a', color: '#ffffff'}}>⭐⭐⭐⭐⭐ (5)</option>
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label text-light">Minimum Sustainability</label>
            <select className="form-select" value={Math.floor(minSus/20)} onChange={e=>setMinSus(Number(e.target.value)*20)} style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#ffffff'
            }}>
              <option value={0} style={{background: '#1a1f3a', color: '#ffffff'}}>All 🌱</option>
              <option value={1} style={{background: '#1a1f3a', color: '#ffffff'}}>🌱 Basic (20%+)</option>
              <option value={2} style={{background: '#1a1f3a', color: '#ffffff'}}>🌱🌱 Good (40%+)</option>
              <option value={3} style={{background: '#1a1f3a', color: '#ffffff'}}>🌱🌱🌱 Very Good (60%+)</option>
              <option value={4} style={{background: '#1a1f3a', color: '#ffffff'}}>🌱🌱🌱🌱 Excellent (80%+)</option>
              <option value={5} style={{background: '#1a1f3a', color: '#ffffff'}}>🌱🌱🌱🌱🌱 Perfect (100%)</option>
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label text-light">LEO Certification</label>
            <div className="form-check mt-2">
              <input 
                className="form-check-input" 
                type="checkbox" 
                id="certifiedFilter"
                checked={certifiedOnly} 
                onChange={e=>setCertifiedOnly(e.target.checked)} 
              />
              <label className="form-check-label text-light" htmlFor="certifiedFilter">
                🏆 Certified only
              </label>
            </div>
          </div>
          <div className="col-md-2 text-end">
            <button className="btn btn-outline-primary" onClick={()=>setShowAdd(true)}><i className="fas fa-plus me-1"></i>Add provider</button>
          </div>
        </div>
      </div>

      {/* Filtro y tabla de proveedores */}
      <div className="card mb-4 shadow-sm animate__animated animate__fadeIn" style={{
        background: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.2)',
        backdropFilter: 'blur(10px)',
        color: '#ffffff'
      }}>
        <div className="card-header d-flex align-items-center" style={{
          background: 'rgba(58,160,255,0.2)',
          border: '1px solid rgba(58,160,255,0.3)',
          color: '#ffffff'
        }}>
          <i className="fas fa-search me-2"></i>
          Search provider or service
          <input
            className="form-control ms-3 w-50"
            type="text"
            placeholder="Name, service..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#ffffff'
            }}
          />
          <button className="btn btn-outline-light btn-sm ms-3" onClick={()=>setCompareMode(!compareMode)}>
            <i className="fas fa-balance-scale me-1"></i> {compareMode ? 'Exit Compare' : 'Compare'}
          </button>
        </div>
        <div className="table-responsive">
          <table className="table align-middle mb-0" style={{
            '--bs-table-bg': 'transparent',
            '--bs-table-striped-bg': 'rgba(255,255,255,0.05)',
            '--bs-table-hover-bg': 'rgba(58,160,255,0.1)',
            color: '#ffffff'
          }}>
            <thead>
              <tr style={{backgroundColor: 'rgba(58,160,255,0.2)', color: '#ffffff'}}>
                {compareMode && <th style={{color: '#ffffff'}}></th>}
                <th style={{color: '#ffffff'}}>Provider</th>
                <th style={{color: '#ffffff'}}>Country</th>
                <th style={{color: '#ffffff'}}>Services</th>
                <th style={{color: '#ffffff'}}>Reputation {tooltip('User rating')}</th>
                <th style={{color: '#ffffff'}}>Sustainability {tooltip('Environmental impact and best practices')}</th>
                <th style={{color: '#ffffff'}}>LEO Certified {tooltip('LEO quality and sustainability certification')}</th>
                <th style={{color: '#ffffff'}}>Shared {tooltip('Shares data with others?')}</th>
                <th style={{color: '#ffffff'}}>Price (USD)</th>
                <th style={{color: '#ffffff'}}></th>
              </tr>
            </thead>
            <tbody>
                {filteredProviders.length === 0 && (
                  <tr><td colSpan={compareMode ? 10 : 9} className="text-center" style={{color: '#ffffff'}}>No results</td></tr>
                )}
                {filteredProviders.map(p => (
                  <tr key={p.id} 
                    className={p.shared ? '' : ''}
                    onMouseEnter={()=>setHoveredProvider(p)}
                    onMouseLeave={()=>setHoveredProvider(null)}
                    style={{
                      position:'relative', 
                      color: '#ffffff',
                      backgroundColor: p.shared ? 'rgba(40,167,69,0.2)' : 'transparent'
                    }}>
                    {compareMode && (
                      <td style={{color: '#ffffff'}}>
                        <input type="checkbox" checked={selectedIds.includes(p.id)} onChange={()=>toggleSelect(p.id)} />
                      </td>
                    )}
                    <td style={{color: '#ffffff'}}><strong>{p.name}</strong> {p.reputation > 4.8 ? badge('top') : null}{p.sustainability > 95 ? badge('eco') : null}{p.id === 4 ? badge('new') : null} {trendIcon(p.trend)}</td>
                    <td style={{color: '#ffffff'}}>{p.country}</td>
                    <td style={{color: '#ffffff'}}>{p.services.join(', ')}</td>
                    <td style={{color: '#ffffff'}}><span className="badge bg-info"><i className="fas fa-star me-1"></i>{p.reputation}</span></td>
                    <td style={{color: '#ffffff'}}>
                      <div className="progress" style={{height: 18, backgroundColor: 'rgba(255,255,255,0.2)'}}>
                        <div className="progress-bar bg-success" role="progressbar" style={{width: `${p.sustainability}%`}}>
                          {p.sustainability}%
                        </div>
                      </div>
                    </td>
                    <td style={{color: '#ffffff'}}>
                      {p.leoCertified ? 
                        <span className="badge bg-warning text-dark"><i className="fas fa-certificate me-1"></i>🏆 Certified</span> : 
                        <span className="badge bg-secondary text-light">Not certified</span>
                      }
                    </td>
                    <td style={{color: '#ffffff'}}>{p.shared ? <span className="badge bg-success">Yes</span> : <span className="badge bg-secondary">No</span>}</td>
                    <td style={{color: '#ffffff'}}>${p.price.toLocaleString()}</td>
                    <td>
                      <button className="btn btn-outline-primary btn-sm" onClick={() => { setSelectedProvider(p); setShowModal(true); }}>
                        <i className="fas fa-file-signature me-1"></i>Request Quote
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gráfica de servicios (barras simples) */}
      <div className="card mb-4 p-4 animate__animated animate__fadeInUp" style={{
        background: 'rgba(255,255,255,0.1)',
        border: '2px solid rgba(58,160,255,0.3)',
        borderRadius: '15px',
        backdropFilter: 'blur(15px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        color: '#ffffff'
      }}>
        <h5 className="mb-3" style={{
          color: '#ffffff',
          fontWeight: 'bold',
          textShadow: '0 0 10px rgba(58,160,255,0.8)'
        }}>
          <i className="fas fa-chart-bar me-2 text-primary"></i>
          Distribution of offered services
        </h5>
        <div className="d-flex align-items-end gap-3" style={{height:120}}>
          {serviceCounts.map(s=>(
            <div key={s.name} className="text-center" style={{flex:1}}>
              <div style={{
                height:s.count*25, 
                background:'linear-gradient(135deg, #3aa0ff 0%, #1976d2 100%)', 
                borderRadius:8, 
                transition:'height .3s',
                boxShadow: '0 4px 15px rgba(58,160,255,0.4)'
              }} className="mb-2 animate__animated animate__fadeInUp"></div>
              <div className="small" style={{
                color: '#cccccc',
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
              }}>{s.name}</div>
              <div className="fw-bold" style={{
                color: '#ffffff',
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
              }}>{s.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Panel flotante de detalles y reviews (renderizado fuera de la tabla) */}
      {hoveredProvider && (
        <div style={{position:'fixed', left:'60vw', top:'30vh', zIndex:2000, minWidth:280, pointerEvents:'none'}}>
          <div className="card shadow animate__animated animate__fadeInRight" style={{
            background: 'rgba(255,255,255,0.1)',
            border: '2px solid rgba(58,160,255,0.5)',
            borderRadius: '15px',
            backdropFilter: 'blur(15px)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
            color: '#ffffff'
          }}>
            <div className="card-body p-3">
              <div className="fw-bold mb-2" style={{
                color: '#ffffff',
                fontSize: '16px',
                textShadow: '0 0 10px rgba(58,160,255,0.8)'
              }}>
                Details of {hoveredProvider.name}
              </div>
              <div className="mb-2">
                <span className="badge bg-info" style={{
                  borderRadius: '10px',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                }}>
                  Reputation: {hoveredProvider.reputation}
                </span> 
                {trendIcon(hoveredProvider.trend)}
              </div>
              <div className="mb-2">
                <span className="badge bg-success" style={{
                  borderRadius: '10px',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                }}>
                  Sustainability: {hoveredProvider.sustainability}%
                </span>
              </div>
              <div className="mb-2">
                <span className="badge" style={{
                  background: 'rgba(33, 37, 41, 0.8)',
                  color: '#ffffff',
                  borderRadius: '10px',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                }}>
                  Price: ${hoveredProvider.price?.toLocaleString?.() ?? ''}
                </span>
              </div>
              <div className="mb-3">
                <span className="badge bg-secondary" style={{
                  borderRadius: '10px',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                }}>
                  {hoveredProvider.shared ? 'Shares data' : 'Private'}
                </span>
              </div>
              <div className="mb-2" style={{
                color: '#ffffff',
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
              }}>
                <strong>Services:</strong> {(hoveredProvider.services||[]).join(', ')}
              </div>
              {hoveredProvider.reviews && (
                <div className="mb-2" style={{
                  color: '#ffffff',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                }}>
                  <strong>Reviews:</strong>
                  {hoveredProvider.reviews.map((r,i)=>(
                    <div key={i} className="small pb-1 mb-1" style={{
                      borderBottom: '1px solid rgba(255,255,255,0.2)',
                      color: '#ffffff'
                    }}>
                      <i className="fas fa-user-circle me-1 text-primary"></i>
                      <b>{r.user}</b>: {r.comment} 
                      <span className="text-warning ms-1">{'★'.repeat(r.rating)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal agregar proveedor (simulado) */}
      {showAdd && (
        <div className="modal fade show d-block" tabIndex="-1" style={{background: 'rgba(0,0,0,0.7)'}}>
          <div className="modal-dialog">
            <div className="modal-content animate__animated animate__zoomIn" style={{
              background: 'rgba(255,255,255,0.1)',
              border: '2px solid rgba(58,160,255,0.3)',
              borderRadius: '15px',
              backdropFilter: 'blur(15px)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
              color: '#ffffff'
            }}>
              <div className="modal-header" style={{
                background: 'linear-gradient(135deg, #3aa0ff 0%, #1976d2 100%)',
                borderBottom: '2px solid rgba(58,160,255,0.3)',
                borderRadius: '15px 15px 0 0',
                color: '#ffffff'
              }}>
                <h5 className="modal-title" style={{
                  fontWeight: 'bold',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                }}>
                  <i className="fas fa-plus me-2"></i>Add Provider
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={()=>setShowAdd(false)}
                  style={{filter: 'invert(1)'}}
                ></button>
              </div>
              <div className="modal-body" style={{color: '#ffffff'}}>
                <p style={{
                  color: '#cccccc',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                }}>
                  Simulated functionality for demo. In a real version, here you could register a new provider in the Exchange.
                </p>
                <input 
                  className="form-control mb-3" 
                  placeholder="Provider name" 
                  disabled 
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderRadius: '10px',
                    color: '#ffffff'
                  }}
                />
                <input 
                  className="form-control mb-3" 
                  placeholder="Country" 
                  disabled 
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderRadius: '10px',
                    color: '#ffffff'
                  }}
                />
                <input 
                  className="form-control mb-3" 
                  placeholder="Services" 
                  disabled 
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderRadius: '10px',
                    color: '#ffffff'
                  }}
                />
                <input 
                  className="form-control mb-3" 
                  placeholder="Reputation" 
                  disabled 
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderRadius: '10px',
                    color: '#ffffff'
                  }}
                />
                <input 
                  className="form-control mb-3" 
                  placeholder="Sustainability" 
                  disabled 
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderRadius: '10px',
                    color: '#ffffff'
                  }}
                />
              </div>
              <div className="modal-footer" style={{
                borderTop: '2px solid rgba(58,160,255,0.3)',
                borderRadius: '0 0 15px 15px'
              }}>
                <button 
                  className="btn btn-outline-light px-4" 
                  onClick={()=>setShowAdd(false)}
                  style={{
                    borderRadius: '25px',
                    fontWeight: 'bold',
                    border: '2px solid rgba(255,255,255,0.5)',
                    backdropFilter: 'blur(10px)',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
    </>
  );
}
