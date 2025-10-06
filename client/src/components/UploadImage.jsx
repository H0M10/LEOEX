import React, { useState } from 'react';
import { resizeImageToBlob } from '../utils/resizeImageToBlob';
import { uploadToCloudinary } from '../utils/uploadToCloudinary';

export default function UploadImage({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState(null);
  const base = import.meta.env.VITE_API_BASE || 'http://localhost:9002';

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
    setUrl(null);
  };


  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const blob = await resizeImageToBlob(file);
      const result = await uploadToCloudinary(blob);
      setUrl(result.secure_url);
      // Guardar metadata en backend
      await fetch(`${base}/api/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: result.secure_url,
          platform_id: 'space-tourism',
          lat: null,
          lon: null
        })
      });
      if (onUploaded) onUploaded(result.secure_url);
    } catch (err) {
      setError('Error al subir la imagen');
    }
    setLoading(false);
  };

  return (
    <div className="mb-3">
      <label className="form-label">Selecciona una imagen para subir a Cloudinary:</label>
      <input type="file" accept="image/*" className="form-control mb-2" onChange={handleFileChange} />
      <button className="btn btn-primary" onClick={handleUpload} disabled={loading || !file}>
        {loading ? 'Subiendo...' : 'Subir Imagen'}
      </button>
      {error && <div className="text-danger mt-2">{error}</div>}
      {url && <div className="mt-2"><a href={url} target="_blank" rel="noopener noreferrer">Ver imagen subida</a></div>}
    </div>
  );
}
