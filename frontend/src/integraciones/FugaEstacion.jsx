import { useState } from 'react';
import { apiFetch } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import SubirImagenNeon from '../components/common/SubirImagenNeon.jsx';

export default function FugaEstacion() {
  const { usuario } = useAuth();
  const [ubicacion, setUbicacion] = useState('Estación Central · andén 2');
  const [tipoFuga, setTipoFuga] = useState('Tubería rota');
  const [urgencia, setUrgencia] = useState('Alta');
  const [imagenId, setImagenId] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    try {
      const res = await apiFetch('/api/agua', {
        method: 'POST',
        body: JSON.stringify({ ubicacion, tipo_fuga: tipoFuga, urgencia, imagen_id: imagenId }),
      });
      setMensaje(`Fuga en estación registrada en AguaViva · Código: ${res.codigo}`);
      setImagenId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <p style={{ margin: 0, fontSize: '0.85rem', color: '#16a34a', fontWeight: 700 }}>
        INTEGRACIÓN HU-6.1 · METROBUS → AGUAVIVA
      </p>
      <h1 style={{ margin: '0.2rem 0 1rem', color: '#0f3d24' }}>Reportar fuga de agua en estación</h1>

      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="grid-2">
        <div className="form-group">
          <label htmlFor="fuga-rep">Reportante (precargado desde sesión única)</label>
          <input id="fuga-rep" className="form-control" value={usuario?.nombre || ''} readOnly />
        </div>
        <div className="form-group">
          <label htmlFor="fuga-ubi">Estación / Ubicación</label>
          <input
            id="fuga-ubi"
            className="form-control"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="fuga-tipo">Tipo de avería</label>
          <input
            id="fuga-tipo"
            className="form-control"
            value={tipoFuga}
            onChange={(e) => setTipoFuga(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="fuga-urg">Urgencia</label>
          <select id="fuga-urg" className="form-control" value={urgencia} onChange={(e) => setUrgencia(e.target.value)}>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
          </select>
        </div>
      </div>

      <SubirImagenNeon onImagenSubida={setImagenId} imagenActualId={imagenId} />

      <button type="submit" className="btn btn-primary">Reportar fuga en AguaViva</button>
    </form>
  );
}