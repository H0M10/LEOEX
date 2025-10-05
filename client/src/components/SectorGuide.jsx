import React, { useState } from 'react';
import '../styles/dark-theme.css';

const SectorGuide = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const sectors = {
    'space-companies': {
      title: 'Private Space Companies',
      icon: '🚀',
      companies: ['SpaceX', 'Planet Labs', 'Rocket Lab', 'OneWeb', 'Blue Origin'],
      problems: [
        'Losses of $50M+ due to avoidable collisions',
        'Regulatory fines of $2M+ for non-compliance',
        'Training time of 6-18 months',
        'Lack of expertise in LEO operations'
      ],
      solutions: [
        'Simulators that reduce collision risk by 85%',
        'Automated regulatory training',
        'Training time reduced to 2-4 weeks',
        'Proven ROI: $500K savings/year per operator'
      ],
      roi: '$500,000',
      timeToValue: '2-4 semanas',
      riskReduction: '85%'
    },
    'universities': {
      title: 'Universities and Research Centers',
      icon: '🎓',
      companies: ['MIT', 'Stanford', 'Caltech', 'Georgia Tech', 'Universidad Politécnica'],
      problems: [
        'Students without hands-on experience in space operations',
        'Expensive labs ($2M+) for LEO experiments',
        'Lack of up-to-date case studies',
        'Gap between theory and industry practice'
      ],
      solutions: [
        'Virtual labs with real-world cases',
        'Access to $50M simulators for $25/student',
        'Scenarios updated with NASA/ESA data',
        'Certifications recognized by industry'
      ],
      roi: '$150,000',
      timeToValue: '1 semestre',
      riskReduction: '100%'
    },
    'government': {
      title: 'Government Agencies',
      icon: '🏛️',
      companies: ['NASA', 'ESA', 'FAA', 'FCC', 'Defensa Nacional'],
      problems: [
        'Difficulty evaluating space policies',
        'Lack of tools for impact assessment',
        'Insufficient training for regulators',
        'Decisions based on outdated models'
      ],
      solutions: [
        'Policy simulators with real impact',
        'Crisis scenarios and emergency management',
        'Specialized training in LEO regulation',
        'Predictive analytics for policy making'
      ],
      roi: '$2,000,000',
      timeToValue: '3-6 meses',
      riskReduction: '70%'
    },
    'investors': {
      title: 'Investors and VC Funds',
      icon: '💰',
      companies: ['Andreessen Horowitz', 'Bessemer', 'Space Capital', 'Founders Fund'],
      problems: [
        'Incomplete due diligence in space-tech',
        'Lack of expertise to evaluate space startups',
        'Investment risk without understanding LEO operations',
        'Losses from betting on inexperienced teams'
      ],
      solutions: [
        'Evaluation tools for space startups',
        'Benchmarking against best practices',
        'Training to understand operational risks',
        'Data room with key industry metrics'
      ],
      roi: '$5,000,000',
      timeToValue: '1-2 meses',
      riskReduction: '60%'
    },
    'consultants': {
      title: 'Consulting and Service Firms',
      icon: '📊',
      companies: ['Deloitte Space', 'McKinsey', 'Accenture', 'PwC', 'KPMG'],
      problems: [
        'Clients demand specialized space expertise',
        'Lack of tools for space consulting',
        'Competition with specialized boutiques',
        'Need for rapid upskilling of teams'
      ],
      solutions: [
        'LEO Decisions certification for consultants',
        'White-label solutions for clients',
        'Access to exclusive industry datasets',
        'Accelerated training in 2-4 weeks'
      ],
  roi: '$750,000',
  timeToValue: '4-8 weeks',
  riskReduction: '50%'
    },
    'insurance': {
      title: 'Insurance and Risk Managers',
      icon: '🛡️',
      companies: ["Lloyd's London", 'AIG', 'Munich Re', 'Swiss Re'],
      problems: [
        'Outdated space risk models',
        'Losses of $100M+ from underestimating LEO risks',
        'Lack of data for accurate pricing',
        'Exposure without understanding real operations'
      ],
      solutions: [
        'Updated predictive collision models',
        'Risk assessment tools based on real operations',
        'Historical data from 10+ years of LEO operations',
        'Stress testing of space portfolios'
      ],
      roi: '$10,000,000',
      timeToValue: '2-3 meses',
      riskReduction: '80%'
    }
  };

  const marketplaceFeatures = [
    {
      category: 'Training and Certification',
      providers: ['LEO Decisions', 'NASA Training', 'ESA Academy', 'MIT Space Systems'],
      description: 'Courses, simulators, and official certifications',
      priceRange: '$25 - $5,000'
    },
    {
      category: 'Data and Analytics',
      providers: ['Planet Labs', 'Maxar', 'LeoLabs', 'AGI'],
      description: 'Satellite imagery, debris tracking, orbital predictions',
      priceRange: '$100 - $50,000/month'
    },
    {
      category: 'Professional Services',
      providers: ['Deloitte Space', 'Wilson Sonsini', 'Bryce Space', 'Lloyd\'s London'],
      description: 'Consulting, legal, insurance, market intelligence',
      priceRange: '$200 - $1,000/hour'
    },
    {
      category: 'Software and Tools',
      providers: ['AGI STK', 'Ansys', 'GMAT', 'Space Startups'],
      description: 'Mission planning, simulation, orbital mechanics',
      priceRange: '$500 - $25,000/month'
    },
    {
      category: 'Hardware and Components',
      providers: ['Blue Origin', 'Northrop Grumman', 'Specialized Manufacturers'],
      description: 'Satellite components, ground stations, testing equipment',
      priceRange: '$1,000 - $1,000,000'
    }
  ];

  return (
    <div className="container-fluid py-5 dark-theme" style={{background: 'linear-gradient(135deg, #0f1419 0%, #1a1f3a 50%, #2d1b69 100%)'}}>
      <div className="container">
        {/* Back Button */}
        <div className="mb-4">
          <button 
            className="btn btn-outline-light btn-lg"
            onClick={onBack}
          >
            <i className="fas fa-arrow-left me-2"></i>
            Back to Home
          </button>
        </div>

        <div className="text-center mb-5">
          <h1 className="display-4 text-white mb-3">
            <i className="fas fa-exchange-alt text-primary"></i> LEO Space Platform - Industry Guide
          </h1>
          <p className="lead text-light">
            The complete platform for satellite data exchange and LEO mission simulation. 
            Discover how each industry uses our technology to optimize space operations.
          </p>
          <div className="row mt-4">
            <div className="col-md-3 mb-2">
              <span className="badge bg-primary fs-6 px-3 py-2">🛰️ 6 Real Providers</span>
            </div>
            <div className="col-md-3 mb-2">
              <span className="badge bg-success fs-6 px-3 py-2">⭐ Reputation System</span>
            </div>
            <div className="col-md-3 mb-2">
              <span className="badge bg-warning fs-6 px-3 py-2">🏆 LEO Certification</span>
            </div>
            <div className="col-md-3 mb-2">
              <span className="badge bg-info fs-6 px-3 py-2">🌱 Sustainability</span>
            </div>
          </div>
        </div>

  {/* Navigation Tabs */}
        <div className="row mb-4">
          <div className="col-12">
            <ul className="nav nav-pills nav-fill mb-3" style={{background: 'rgba(255,255,255,0.1)', borderRadius: '15px', padding: '5px'}}>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                  style={{borderRadius: '10px', color: activeTab === 'overview' ? '#000' : '#fff'}}
                >
                  🚀 LEO Platform
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'providers' ? 'active' : ''}`}
                  onClick={() => setActiveTab('providers')}
                  style={{borderRadius: '10px', color: activeTab === 'providers' ? '#000' : '#fff'}}
                >
                  🛰️ Real Providers
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'sectors' ? 'active' : ''}`}
                  onClick={() => setActiveTab('sectors')}
                  style={{borderRadius: '10px', color: activeTab === 'sectors' ? '#000' : '#fff'}}
                >
                  🎯 By Sectors
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'features' ? 'active' : ''}`}
                  onClick={() => setActiveTab('features')}
                  style={{borderRadius: '10px', color: activeTab === 'features' ? '#000' : '#fff'}}
                >
                  ⚡ Features
                </button>
              </li>
            </ul>
          </div>
        </div>

  {/* Overview Content - LEO Platform */}
        {activeTab === 'overview' && (
          <div className="row">
            <div className="col-12 mb-4">
              <div className="card bg-dark border-primary shadow-lg">
                <div className="card-body p-5">
                  <h2 className="text-primary mb-4">🚀 LEO Space Platform: Ecosistema Completo</h2>
                  
                  <div className="row mb-4">
                    <div className="col-md-3">
                      <div className="text-center p-4" style={{background: 'rgba(13,202,240,0.1)', borderRadius: '15px'}}>
                        <h1 className="text-info mb-2">6</h1>
                        <p className="text-light">Real Satellite Providers</p>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="text-center p-4" style={{background: 'rgba(255,193,7,0.1)', borderRadius: '15px'}}>
                        <h1 className="text-warning mb-2">⭐ 4.8</h1>
                        <p className="text-light">Average Provider Reputation</p>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="text-center p-4" style={{background: 'rgba(25,135,84,0.1)', borderRadius: '15px'}}>
                        <h1 className="text-success mb-2">92%</h1>
                        <p className="text-light">Average Sustainability</p>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="text-center p-4" style={{background: 'rgba(220,53,69,0.1)', borderRadius: '15px'}}>
                        <h1 className="text-danger mb-2">67%</h1>
                        <p className="text-light">LEO Certified Providers</p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-primary mb-3">🌟 Main Features</h3>
                  <div className="row">
                    <div className="col-md-6">
                      <h5 className="text-warning">🛰️ LEO Data Exchange</h5>
                      <p className="text-light">Marketplace of satellite providers with real data from NASA, ESA, SpaceX, Planet Labs, Maxar, and JAXA</p>
                      <h5 className="text-warning">⭐ Reputation System</h5>
                      <p className="text-light">Star filters (1-5), user reviews, and verified ratings</p>
                      <h5 className="text-warning">🌱 Sustainability Analysis</h5>
                      <p className="text-light">Environmental metrics by level, ecological impact, and best practices</p>
                    </div>
                    <div className="col-md-6">
                      <h5 className="text-warning">🏆 LEO Certification</h5>
                      <p className="text-light">Quality certification system and regulatory compliance</p>
                      <h5 className="text-warning">🎮 Mission Simulator</h5>
                      <p className="text-light">Game engine with turn management, budget, and satellite resources</p>
                      <h5 className="text-warning">📊 Real-Time Analytics</h5>
                      <p className="text-light">Interactive charts, TOP 3 rankings, and provider comparison</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="card bg-gradient text-white" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                <div className="card-body p-4">
                  <h4 className="mb-3">🚀 Arquitectura Técnica Full-Stack</h4>
                  <div className="row">
                    <div className="col-md-4">
                      <h6 className="text-warning">Frontend (React + Vite)</h6>
                      <ul className="small">
                        <li>React 18 con Hooks avanzados</li>
                        <li>Bootstrap 5 + Animate.css</li>
                        <li>Axios con timeout robusto</li>
                        <li>UI/UX responsiva profesional</li>
                      </ul>
                    </div>
                    <div className="col-md-4">
                      <h6 className="text-warning">Backend (Node.js + Express)</h6>
                      <ul className="small">
                        <li>APIs RESTful para juegos y datos</li>
                        <li>Integración con APIs NASA/ESA</li>
                        <li>Sistema de fallback inteligente</li>
                        <li>Logging y manejo de errores</li>
                      </ul>
                    </div>
                    <div className="col-md-4">
                      <h6 className="text-warning">Datos & Integraciones</h6>
                      <ul className="small">
                        <li>API TLE para satélites reales</li>
                        <li>Datos curados de 6 empresas</li>
                        <li>Sistema de filtrado avanzado</li>
                        <li>Persistencia JSON para estados</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

  {/* New Tab - Real Providers */}
        {activeTab === 'providers' && (
          <div className="row">
            <div className="col-12 mb-4">
              <div className="card bg-dark border-success shadow-lg">
                <div className="card-body p-4">
                  <h2 className="text-success mb-4">🛰️ Implemented Satellite Providers</h2>
                  <p className="text-light mb-4">
                    Real data from the world's leading space companies and agencies, 
                    with verified metrics and professional rating systems.
                  </p>
                </div>
              </div>
            </div>

            {[
              {
                name: 'NASA Earth Observation',
                country: '🇺🇸 United States',
                reputation: 4.9,
                sustainability: 95,
                certified: true,
                price: '$2,500',
                services: ['Observación Terrestre', 'Monitoreo Climático', 'Datos Científicos'],
                icon: '🇺🇸',
                color: 'primary'
              },
              {
                name: 'ESA Copernicus Program',
                country: '🇪🇺 Europe',
                reputation: 4.8,
                sustainability: 98,
                certified: true,
                price: '$1,800',
                services: ['Sentinel Data', 'Monitoreo Ambiental', 'Observación Terrestre'],
                icon: '🇪🇺',
                color: 'info'
              },
              {
                name: 'SpaceX Starlink',
                country: '🇺🇸 United States',
                reputation: 4.6,
                sustainability: 75,
                certified: false,
                price: '$3,200',
                services: ['Conectividad Global', 'Internet Satelital', 'IoT'],
                icon: '🚀',
                color: 'secondary'
              },
              {
                name: 'Planet Labs',
                country: '🇺🇸 United States',
                reputation: 4.7,
                sustainability: 88,
                certified: true,
                price: '$2,800',
                services: ['Imágenes Diarias', 'Análisis Temporal', 'Agriculture Monitoring'],
                icon: '🌍',
                color: 'success'
              },
              {
                name: 'Maxar Technologies',
                country: '🇺🇸 United States',
                reputation: 4.8,
                sustainability: 82,
                certified: true,
                price: '$4,500',
                services: ['Imágenes Alta Resolución', 'Inteligencia Geoespacial', 'Análisis'],
                icon: '📡',
                color: 'warning'
              },
              {
                name: 'JAXA Earth Observation',
                country: '🇯🇵 Japan',
                reputation: 4.5,
                sustainability: 92,
                certified: false,
                price: '$2,000',
                services: ['ALOS Data', 'Disaster Monitoring', 'Forest Mapping'],
                icon: '🇯🇵',
                color: 'danger'
              }
            ].map((provider, idx) => (
              <div key={idx} className="col-md-6 mb-4">
                <div className={`card bg-dark border-${provider.color} shadow-lg h-100`}>
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <span style={{fontSize: '2em', marginRight: '10px'}}>{provider.icon}</span>
                      <div>
                        <h5 className={`text-${provider.color} mb-1`}>{provider.name}</h5>
                        <small className="text-muted">{provider.country}</small>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-6">
                        <div className="text-center p-2" style={{background: `rgba(var(--bs-${provider.color}-rgb), 0.1)`, borderRadius: '8px'}}>
                          <div className={`text-${provider.color}`}>
                            {'⭐'.repeat(Math.floor(provider.reputation))} {provider.reputation}
                          </div>
                          <small className="text-muted">Reputation</small>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="text-center p-2" style={{background: 'rgba(25,135,84,0.1)', borderRadius: '8px'}}>
                          <div className="text-success">🌱 {provider.sustainability}%</div>
                          <small className="text-muted">Sustainability</small>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      {provider.certified ? 
                        <span className="badge bg-warning text-dark me-2">🏆 LEO Certified</span> : 
                        <span className="badge bg-secondary me-2">Not certified</span>
                      }
                      <span className="badge bg-success">{provider.price}</span>
                    </div>

                    <h6 className="text-light mb-2">Services:</h6>
                    <ul className="text-light small">
                      {provider.services.map((service, sidx) => (
                        <li key={sidx}>{service}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

  {/* Sectors Content */}
        {activeTab === 'sectors' && (
          <div className="row">
            {Object.entries(sectors).map(([key, sector]) => (
              <div key={key} className="col-md-6 mb-4">
                <div className="card bg-dark border-primary shadow-lg h-100">
                  <div className="card-body">
                    <h4 className="text-primary mb-3">
                      <span style={{fontSize: '1.5em'}}>{sector.icon}</span> {sector.title}
                    </h4>
                    
                    <div className="mb-3">
                      <small className="text-muted">Examples: </small>
                      <span className="text-light">{sector.companies.slice(0, 3).join(', ')}</span>
                    </div>

                    <h6 className="text-danger">🚫 Current Problems:</h6>
                    <ul className="text-light small">
                      {sector.problems.slice(0, 2).map((problem, idx) => (
                        <li key={idx}>{problem}</li>
                      ))}
                    </ul>

                    <h6 className="text-success">✅ LEO Solutions:</h6>
                    <ul className="text-light small">
                      {sector.solutions.slice(0, 2).map((solution, idx) => (
                        <li key={idx}>{solution}</li>
                      ))}
                    </ul>

                    <div className="row text-center mt-3">
                      <div className="col-4">
                        <div className="p-2" style={{background: 'rgba(25,135,84,0.2)', borderRadius: '8px'}}>
                          <small className="text-success d-block">ROI Anual</small>
                          <strong className="text-success">{sector.roi}</strong>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="p-2" style={{background: 'rgba(13,202,240,0.2)', borderRadius: '8px'}}>
                          <small className="text-info d-block">Time to Value</small>
                          <strong className="text-info">{sector.timeToValue}</strong>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="p-2" style={{background: 'rgba(255,193,7,0.2)', borderRadius: '8px'}}>
                          <small className="text-warning d-block">Risk ↓</small>
                          <strong className="text-warning">{sector.riskReduction}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="text-center mt-3">
                      <button className="btn btn-primary btn-sm">
                        View Demo for {sector.title} →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

  {/* New Tab - Features */}
        {activeTab === 'features' && (
          <div className="row">
            <div className="col-12 mb-4">
              <div className="card bg-dark border-warning shadow-lg">
                <div className="card-body p-4">
                  <h2 className="text-warning mb-4">⚡ Advanced Features Implemented</h2>
                  <p className="text-light">
                    Complete system for filtering, visualization, and management of satellite data with professional features.
                  </p>
                </div>
              </div>
            </div>

            {[
              {
                title: '🔍 Advanced Filtering System',
                icon: '🎛️',
                color: 'primary',
                features: [
                  'Reputation filter with stars (⭐ 1-5)',
                  'Sustainability by levels (🌱 1-5)',
                  'LEO Certification (🏆 Certified only)',
                  'Filter by country and specific services',
                  'Real-time text search'
                ]
              },
              {
                title: '📊 Data Visualization',
                icon: '📈',
                color: 'success',
                features: [
                  'TOP 3 ranking with animated medals',
                  'Bar charts for service distribution',
                  'Animated progress bars for sustainability',
                  'Dynamic badges for certifications',
                  'Informative tooltips with context'
                ]
              },
              {
                title: '💫 Advanced Interactivity',
                icon: '🎮',
                color: 'info',
                features: [
                  'Floating detail panel on hover',
                  'Comparison mode between providers',
                  'User reviews and ratings',
                  'Animations with Animate.css',
                  'Responsive design for all devices'
                ]
              },
              {
                title: '🔧 Technical Features',
                icon: '⚙️',
                color: 'warning',
                features: [
                  'Robust error handling with fallbacks',
                  'Configurable timeout in API calls',
                  'Backup data if external API fails',
                  'Detailed backend logging',
                  'Scalable modular architecture'
                ]
              },
              {
                title: '🎯 Professional UX/UI',
                icon: '🎨',
                color: 'danger',
                features: [
                  'Consistent design with Bootstrap 5',
                  'Professional color palette',
                  'Integrated Font Awesome iconography',
                  'Loading states with spinners',
                  'User-friendly error messages'
                ]
              },
              {
                title: '🚀 Mission Simulator',
                icon: '🎲',
                color: 'secondary',
                features: [
                  'Game engine with turn system',
                  'Budget and resource management',
                  'Persistent states in JSON',
                  'Multiple mission scenarios',
                  'Real-time performance metrics'
                ]
              }
            ].map((feature, idx) => (
              <div key={idx} className="col-md-6 mb-4">
                <div className={`card bg-dark border-${feature.color} shadow-lg h-100`}>
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <span style={{fontSize: '2em', marginRight: '10px'}}>{feature.icon}</span>
                      <h5 className={`text-${feature.color} mb-0`}>{feature.title}</h5>
                    </div>
                    
                    <ul className="text-light">
                      {feature.features.map((item, fidx) => (
                        <li key={fidx} className="mb-2">{item}</li>
                      ))}
                    </ul>

                    <div className="text-center mt-3">
                      <span className={`badge bg-${feature.color} px-3 py-2`}>
                        ✓ Implemented and Functional
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

  {/* Marketplace Content */}
        {activeTab === 'marketplace' && (
          <div className="row">
            <div className="col-12 mb-4">
              <div className="card bg-dark border-primary">
                <div className="card-body text-center p-5">
                  <h2 className="text-primary mb-3">🌐 LEO Decisions Marketplace</h2>
                  <p className="lead text-light mb-4">
                    The complete ecosystem for space commercialization. Everything you need, verified and integrated.
                  </p>
                  <div className="row text-center">
                    <div className="col-md-3">
                      <h3 className="text-success">500+</h3>
                      <p className="text-light">Verified Providers</p>
                    </div>
                    <div className="col-md-3">
                      <h3 className="text-warning">50+</h3>
                      <p className="text-light">Service Categories</p>
                    </div>
                    <div className="col-md-3">
                      <h3 className="text-info">$2.4B</h3>
                      <p className="text-light">Transaction Volume</p>
                    </div>
                    <div className="col-md-3">
                      <h3 className="text-primary">24/7</h3>
                      <p className="text-light">Specialized Support</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {marketplaceFeatures.map((feature, idx) => (
              <div key={idx} className="col-md-6 mb-4">
                <div className="card bg-dark border-secondary h-100">
                  <div className="card-body">
                    <h5 className="text-primary">{feature.category}</h5>
                    <p className="text-light">{feature.description}</p>
                    
                    <h6 className="text-warning">Featured Providers:</h6>
                    <ul className="text-light small">
                      {feature.providers.map((provider, pidx) => (
                        <li key={pidx}>{provider}</li>
                      ))}
                    </ul>
                    
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="badge bg-success">{feature.priceRange}</span>
                      <button className="btn btn-outline-primary btn-sm">Explorar →</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="col-12 mt-4">
              <div className="card bg-primary">
                <div className="card-body text-center p-4">
                  <h4 className="text-white mb-3">🚀 Want to be a Provider in the Marketplace?</h4>
                  <p className="text-white mb-3">
                    Access thousands of potential clients in the world's largest space industry marketplace.
                  </p>
                  <div className="row">
                    <div className="col-md-4">
                      <button className="btn btn-light w-100 mb-2">
                        📝 Apply as Provider
                      </button>
                    </div>
                    <div className="col-md-4">
                      <button className="btn btn-outline-light w-100 mb-2">
                        📊 View Opportunities
                      </button>
                    </div>
                    <div className="col-md-4">
                      <button className="btn btn-outline-light w-100 mb-2">
                        💬 Talk to Sales
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

  {/* Final CTA */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="card bg-gradient text-white" style={{background: 'linear-gradient(45deg, #6f42c1, #e83e8c)'}}>
              <div className="card-body text-center p-5">
                <h2 className="mb-3">🚀 Ready to Try LEO Space Platform?</h2>
                <p className="lead mb-4">
                  Explore the world's most complete satellite data marketplace with 6 real providers, 
                  LEO certification system, and advanced mission simulator.
                </p>
                <div className="row justify-content-center">
                  <div className="col-md-4">
                    <button className="btn btn-light btn-lg w-100 mb-3">
                      🛰️ Explore LEO Exchange
                    </button>
                  </div>
                  <div className="col-md-4">
                    <button className="btn btn-outline-light btn-lg w-100 mb-3">
                      🎮 Try Simulator
                    </button>
                  </div>
                  <div className="col-md-4">
                    <button className="btn btn-outline-light btn-lg w-100 mb-3">
                      📊 View Analytics
                    </button>
                  </div>
                </div>
                <small className="text-white-50">
                  ✅ 6 Real Providers | 🏆 LEO Certification System | ⭐ Advanced Filters | 🌱 Sustainability Metrics
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectorGuide;