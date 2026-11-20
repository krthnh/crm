import { useState } from 'react';
import { apiFetch, API_URL } from '../../api/client.js';

export default function SubirImagenNeon({ onImagenSubida, imagenActualId }) {
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState('');

  const handleArchivo = async (e) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    setError('');
    setSubiendo(true);
    try {
      const formData = new FormData();
      formData.append('imagen', archivo);

      const res = await apiFetch('/api/imagenes', {
        method: 'POST',
        body: formData,
      });

      onImagenSubida(res.imagen.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="form-group">
      <label htmlFor="archivo-neon">Evidencia o comprobante (Object Storage en Neon · máx. 2 MB)</label>
      <input
        id="archivo-neon"
        type="file"
        accept="image/*"
        className="form-control"
        onChange={handleArchivo}
        disabled={subiendo}
      />
      {subiendo && <small style={{ color: '#15803d' }}>Subiendo imagen a Neon...</small>}
      {error && <small style={{ color: '#dc2626' }}>{error}</small>}
      {imagenActualId && (
        <div style={{ marginTop: '0.5rem' }}>
          <small style={{ display: 'block', color: '#15803d', fontWeight: 600 }}>
            Imagen guardada en Neon (ID #{imagenActualId}):
          </small>
          <img
            src={`${API_URL}/api/imagenes/${imagenActualId}`}
            alt="Vista previa almacenada en Neon"
            style={{ maxHeight: '110px', borderRadius: '8px', marginTop: '0.3rem', border: '1px solid #cfdcd5' }}
          />
        </div>
      )}
    </div>
  );
}