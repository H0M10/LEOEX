
import React, { useState, useEffect } from 'react';
import UploadImage from './UploadImage';



export default function SpaceTourism() {
  const [images, setImages] = useState([]);
  const [lastUrl, setLastUrl] = useState(null);

  const base = import.meta.env.VITE_API_BASE || '${base}';

  // Cargar imágenes desde el backend
  useEffect(() => {
    fetch(`${base}/api/images`)
      .then(res => res.json())
      .then(setImages)
      .catch(() => setImages([]));
  }, [lastUrl]);

  // ...removed globe.gl setup; using SpaceTourism3D instead

  return (
    <div className="container py-5 text-white">
      <h2 className="mb-4 text-warning"><i className="fas fa-rocket me-2"></i>Turismo Espacial en LEO</h2>
      {/* Bloque explicativo con alto contraste y texto negro */}
      <div className="card bg-light text-dark border-0 mb-3" style={{boxShadow: '0 2px 12px rgba(0,0,0,0.25)'}}>
        <div className="card-body">
          <p className="lead fw-semibold mb-2">
            El turismo espacial en órbita terrestre baja (LEO) se refiere a viajes recreativos para ciudadanos que los llevan a la órbita de la Tierra, utilizando cohetes y plataformas orbitales. Empresas como <strong>Axiom Space</strong> y <strong>SpaceX</strong> ofrecen estas misiones a la Estación Espacial Internacional o a estaciones privadas planificadas, con costos que pueden superar los 55 millones de dólares. El objetivo de la <strong>NASA</strong> es promover estaciones espaciales privadas para impulsar estas actividades comerciales y científicas.
          </p>
          <p className="mb-2">
            <strong>Simbolismo de la simulación:</strong> Cada imagen que ves orbitando la Tierra representa a un usuario, una experiencia o un sueño de turismo espacial. Así como hoy subes tu imagen, en el futuro podrías ser uno de los pioneros en viajar y compartir tu perspectiva desde el espacio. Esta visualización no busca mostrar trayectorias físicas reales, sino inspirar y comunicar cómo el turismo espacial podría conectar a personas de todo el mundo en torno a la aventura y la exploración.
          </p>
          <ul className="mb-2">
            <li><strong>LEO</strong> (Low Earth Orbit) abarca entre ~160 y 2,000 km de altitud.</li>
            <li><strong>Imágenes</strong> = futuros viajeros, experiencias, proveedores o sueños.</li>
            <li><strong>Interacción</strong>: rota, haz zoom y abre miniaturas para imaginar tu propio viaje.</li>
          </ul>
          <p className="small text-muted mb-0">
            ¿Te imaginas tu foto realmente orbitando la Tierra? Aquí, cada usuario puede visualizarse como parte de la próxima era de exploración humana.
          </p>
        </div>
      </div>
      <div className="alert bg-dark text-info border border-info" role="alert">
        <i className="fas fa-info-circle me-2"></i>
        Consejo: arrastra para orbitar, haz zoom con la rueda y toca cualquier miniatura para abrirla en grande. Esto emula el “tráfico turístico” alrededor de la Tierra.
      </div>

      {/* Subida directa aquí debajo de la explicación */}
      <div className="card bg-dark border-info mb-4" style={{boxShadow: '0 2px 12px #0008'}}>
        <div className="card-header border-info d-flex align-items-center">
          <i className="fas fa-cloud-upload-alt me-2 text-info"></i>
          <span className="text-light">Sube tu imagen para la simulación</span>
        </div>
        <div className="card-body">
          <UploadImage onUploaded={setLastUrl} />
          {lastUrl && (
            <div className="alert alert-success mt-3">
              Imagen subida correctamente. <a href={lastUrl} target="_blank" rel="noopener noreferrer">Ver imagen</a>
            </div>
          )}
          <p className="small text-muted m-0">Las miniaturas aparecerán orbitando la Tierra en esta simulación simbólica.</p>
        </div>
      </div>
      <div className="d-flex gap-2 mb-4">
        <a className="btn btn-outline-info" href="#" onClick={(e)=>{e.preventDefault(); window.open('?view=spaceTourismGallery', '_blank');}}>
          <i className="fas fa-images me-2"></i>
          Abrir Galería y Subidas (nueva pestaña)
        </a>
        <a className="btn btn-outline-light" href="https://www.nasa.gov/humans-in-space/commercial-low-earth-orbit-development/" target="_blank" rel="noopener noreferrer">
          <i className="fas fa-book me-2"></i>
          Contexto NASA LEO Comercial
        </a>
      </div>

      {/* Visualización simple de imágenes */}
      <h4 className="mb-3">Imágenes Subidas</h4>
      <div className="row">
        {images.map(img => (
          <div key={img.id} className="col-md-3 mb-3">
            <img src={img.image_url} alt="Space Tourism" className="img-fluid rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
