import React, { useState } from 'react';

const Marketplace = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = {
    all: 'Todos los Servicios',
    training: 'Entrenamiento',
    data: 'Datos y Analytics', 
    consulting: 'Consultoría',
    software: 'Software',
    hardware: 'Hardware',
    legal: 'Legal y Seguros'
  };

  const providers = [
    {
      id: 1,
      name: 'LEO Decisions',
      category: 'training',
      rating: 4.9,
      reviews: 234,
      description: 'Simuladores interactivos para operaciones LEO y entrenamiento regulatorio',
      services: ['Simulación Satelital', 'Compliance Training', 'Risk Assessment'],
      priceRange: '$99-899/mes',
      verified: true,
      featured: true
    },
    {
      id: 2,
      name: 'Planet Labs',
      category: 'data',
      rating: 4.8,
      reviews: 156,
      description: 'Imágenes satelitales diarias de toda la Tierra con resolución de 3-5 metros',
      services: ['Daily Imagery', 'Archive Access', 'Analytics APIs'],
      priceRange: '$500-5000/mes',
      verified: true,
      featured: true
    },
    {
      id: 3,
      name: 'Deloitte Space Practice',
      category: 'consulting',
      rating: 4.7,
      reviews: 89,
      description: 'Consultoría estratégica para empresas espaciales y transformación digital',
      services: ['Strategy Consulting', 'Digital Transformation', 'M&A Advisory'],
      priceRange: '$500-1000/hora',
      verified: true,
      featured: false
    },
    {
      id: 4,
      name: 'AGI (STK)',
      category: 'software',
      rating: 4.6,
      reviews: 312,
      description: 'Software líder mundial para mission planning y análisis espacial',
      services: ['Mission Planning', 'Orbital Analysis', 'Communications Planning'],
      priceRange: '$2000-25000/mes',
      verified: true,
      featured: true
    },
    {
      id: 5,
      name: 'LeoLabs',
      category: 'data',
      rating: 4.8,
      reviews: 67,
      description: 'Tracking preciso de debris espacial y servicios de collision avoidance',
      services: ['Debris Tracking', 'Collision Alerts', 'Orbital Predictions'],
      priceRange: '$1000-10000/mes',
      verified: true,
      featured: false
    },
    {
      id: 6,
      name: 'Wilson Sonsini',
      category: 'legal',
      rating: 4.9,
      reviews: 45,
      description: 'Firma legal especializada en regulación espacial y compliance internacional',
      services: ['Regulatory Compliance', 'International Law', 'Licensing Support'],
      priceRange: '$800-1200/hora',
      verified: true,
      featured: false
    },
    {
      id: 7,
      name: 'Blue Origin Manufacturing',
      category: 'hardware',
      rating: 4.5,
      reviews: 23,
      description: 'Componentes espaciales de alta calidad: motores, estructura, propulsión',
      services: ['Rocket Engines', 'Structural Components', 'Propulsion Systems'],
      priceRange: '$10K-1M/componente',
      verified: true,
      featured: false
    },
    {
      id: 8,
      name: 'NASA Training Academy',
      category: 'training',
      rating: 5.0,
      reviews: 178,
      description: 'Cursos oficiales NASA para operaciones espaciales y certificaciones',
      services: ['Official NASA Courses', 'Certifications', 'Expert Mentoring'],
      priceRange: '$200-2000/curso',
      verified: true,
      featured: true
    }
  ];

  const filteredProviders = providers.filter(provider => {
    const matchesCategory = activeCategory === 'all' || provider.category === activeCategory;
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredProviders = providers.filter(p => p.featured);

  return (
    <div className="container-fluid py-5" style={{background: 'linear-gradient(135deg, #0f1419 0%, #1a1f3a 50%, #2d1b69 100%)'}}>
      <div className="container">
        
        {/* Back Button */}
        <div className="mb-4">
          <button 
            className="btn btn-outline-light btn-lg"
            onClick={onBack}
          >
            <i className="fas fa-arrow-left me-2"></i>
            Volver al Inicio
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="display-4 text-white mb-3">
            🌐 LEO Decisions Marketplace
          </h1>
          <p className="lead text-light mb-4">
            El ecosistema completo para comercialización espacial. Encuentra, compara y contrata los mejores servicios espaciales del mundo.
          </p>
          
          {/* Stats */}
          <div className="row">
            <div className="col-md-3">
              <div className="p-3" style={{background: 'rgba(25,135,84,0.2)', borderRadius: '15px'}}>
                <h3 className="text-success mb-1">500+</h3>
                <small className="text-light">Proveedores Verificados</small>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-3" style={{background: 'rgba(13,202,240,0.2)', borderRadius: '15px'}}>
                <h3 className="text-info mb-1">$2.4B</h3>
                <small className="text-light">Volumen de Transacciones</small>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-3" style={{background: 'rgba(255,193,7,0.2)', borderRadius: '15px'}}>
                <h3 className="text-warning mb-1">50+</h3>
                <small className="text-light">Categorías de Servicios</small>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-3" style={{background: 'rgba(220,53,69,0.2)', borderRadius: '15px'}}>
                <h3 className="text-danger mb-1">24/7</h3>
                <small className="text-light">Soporte Especializado</small>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="row mb-5">
          <div className="col-md-6">
            <div className="input-group input-group-lg">
              <span className="input-group-text bg-dark text-light border-primary">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control bg-dark text-light border-primary"
                placeholder="Buscar servicios, empresas, o tecnologías..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="row">
              {Object.entries(categories).map(([key, label]) => (
                <div key={key} className="col-auto">
                  <button
                    className={`btn ${activeCategory === key ? 'btn-primary' : 'btn-outline-primary'} btn-sm`}
                    onClick={() => setActiveCategory(key)}
                  >
                    {label}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Providers */}
        {activeCategory === 'all' && (
          <div className="mb-5">
            <h3 className="text-primary mb-4">⭐ Proveedores Destacados</h3>
            <div className="row">
              {featuredProviders.map(provider => (
                <div key={provider.id} className="col-md-6 col-lg-3 mb-4">
                  <div className="card bg-dark border-warning shadow-lg h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="text-warning mb-0">{provider.name}</h6>
                        {provider.verified && <span className="badge bg-success">✓ Verificado</span>}
                      </div>
                      
                      <div className="mb-2">
                        <span className="text-warning">
                          {'★'.repeat(Math.floor(provider.rating))} {provider.rating}
                        </span>
                        <small className="text-muted ms-1">({provider.reviews} reviews)</small>
                      </div>
                      
                      <p className="text-light small">{provider.description}</p>
                      
                      <div className="mb-2">
                        <small className="text-info">{provider.priceRange}</small>
                      </div>
                      
                      <div className="d-grid">
                        <button className="btn btn-primary btn-sm">Ver Detalles</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Providers Grid */}
        <div className="mb-4">
          <h3 className="text-primary mb-4">
            📋 Todos los Proveedores 
            <span className="badge bg-secondary ms-2">{filteredProviders.length} resultados</span>
          </h3>
        </div>

        <div className="row">
          {filteredProviders.map(provider => (
            <div key={provider.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card bg-dark border-primary shadow h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5 className="text-primary mb-1">{provider.name}</h5>
                      <span className="badge bg-secondary">{categories[provider.category]}</span>
                    </div>
                    <div className="text-end">
                      {provider.verified && <div className="badge bg-success mb-1">✓ Verificado</div>}
                      {provider.featured && <div className="badge bg-warning">⭐ Destacado</div>}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <span className="text-warning">
                      {'★'.repeat(Math.floor(provider.rating))} {provider.rating}
                    </span>
                    <small className="text-muted ms-2">({provider.reviews} reviews)</small>
                  </div>
                  
                  <p className="text-light">{provider.description}</p>
                  
                  <div className="mb-3">
                    <h6 className="text-info mb-2">Servicios:</h6>
                    <div>
                      {provider.services.map((service, idx) => (
                        <span key={idx} className="badge bg-info me-1 mb-1">{service}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-success fw-bold">{provider.priceRange}</small>
                    <div>
                      <button className="btn btn-outline-primary btn-sm me-2">💬 Contactar</button>
                      <button className="btn btn-primary btn-sm">Ver Perfil</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Become a Provider CTA */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="card bg-gradient" style={{background: 'linear-gradient(45deg, #6f42c1, #e83e8c)'}}>
              <div className="card-body text-center p-5">
                <h2 className="text-white mb-3">🚀 ¿Quieres ser Proveedor en el Marketplace?</h2>
                <p className="text-white lead mb-4">
                  Accede a miles de clientes potenciales en la industria espacial. Únete a 500+ proveedores verificados.
                </p>
                
                <div className="row justify-content-center">
                  <div className="col-md-8">
                    <div className="row">
                      <div className="col-md-4">
                        <div className="p-3 mb-3" style={{background: 'rgba(255,255,255,0.2)', borderRadius: '10px'}}>
                          <h4 className="text-white mb-2">📈 Beneficios</h4>
                          <ul className="text-white text-start small">
                            <li>Acceso a 10,000+ compradores</li>
                            <li>Lead generation automático</li>
                            <li>Analytics de performance</li>
                          </ul>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="p-3 mb-3" style={{background: 'rgba(255,255,255,0.2)', borderRadius: '10px'}}>
                          <h4 className="text-white mb-2">💰 Comisiones</h4>
                          <ul className="text-white text-start small">
                            <li>5-25% según categoría</li>
                            <li>0% los primeros 3 meses</li>
                            <li>Pagos semanales garantizados</li>
                          </ul>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="p-3 mb-3" style={{background: 'rgba(255,255,255,0.2)', borderRadius: '10px'}}>
                          <h4 className="text-white mb-2">🛠️ Herramientas</h4>
                          <ul className="text-white text-start small">
                            <li>Dashboard completo</li>
                            <li>CRM integrado</li>
                            <li>Soporte 24/7</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row justify-content-center mt-3">
                  <div className="col-md-3">
                    <button className="btn btn-light btn-lg w-100">
                      📝 Aplicar Ahora
                    </button>
                  </div>
                  <div className="col-md-3">
                    <button className="btn btn-outline-light btn-lg w-100">
                      📞 Hablar con Ventas
                    </button>
                  </div>
                </div>

                <small className="text-white-50 mt-3 d-block">
                  * Proceso de verificación en 48-72 horas | Sin costos de setup | Comisión solo por venta exitosa
                </small>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Marketplace;