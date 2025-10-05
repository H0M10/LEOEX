import React, { useState, useEffect } from 'react';
import UploadImage from './UploadImage';

export default function SpaceTourismGallery() {
  const [lastUrl, setLastUrl] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch('http://localhost:9002/api/images')
      .then(res => res.json())
      .then(setImages)
      .catch(() => setImages([]));
  }, [lastUrl]);

  return (
    <div className="container py-5 text-white">
      <div className="d-flex align-items-center mb-3">
        <i className="fas fa-image me-2 text-info"></i>
        <h2 className="m-0">Turismo Espacial - Galería y Subidas</h2>
      </div>
      <p className="text-muted">
        Administra y visualiza las imágenes subidas por los visitantes de la misión de Turismo Espacial. Aquí puedes subir nuevas imágenes,
        verlas en grande y consultar el historial.
      </p>

      <div className="mb-4">
        <UploadImage onUploaded={setLastUrl} />
      </div>
      {lastUrl && (
        <div className="alert alert-success">
          Imagen subida correctamente. <a href={lastUrl} target="_blank" rel="noopener noreferrer">Ver imagen</a>
        </div>
      )}

      <h4 className="mt-4 mb-3">Galería de Imágenes Subidas</h4>
      <div className="row g-3">
        {images.length === 0 && <div className="text-muted">No hay imágenes aún.</div>}
        {images.map(img => (
          <div className="col-6 col-md-3" key={img.id}>
            <div className="card bg-dark border-info h-100">
              <img src={img.image_url} alt="turismo espacial" className="card-img-top" style={{height: '140px', objectFit: 'cover'}} />
              <div className="card-body p-2">
                <small className="text-info">ID: {img.id}</small><br/>
                <a href={img.image_url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-info mt-2 w-100">Ver grande</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
