import { useEffect, useState } from 'react';
import { apiFetch } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import BadgeEstado from '../components/common/BadgeEstado.jsx';

export default function ReclamoArbitrios({ soloSeguimiento = false }) {
  const { usuario } = useAuth();
  const [predio, setPredio] = useState('Estación Central');
  const [tributo, setTributo] = useState('Arbitrios 2026');
  const [motivo, setMotivo] = useState('Cobro duplicado en estación');
  const [misReportes, setMisReportes] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const cargarConsolidado = async () => {
    try {
      const data = await apiFetch('/api/mis-reportes-cruzados');
      setMisReportes(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    cargarConsolidado();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    try {
      const res = await apiFetch('/api/sat', {
        method: 'POST',
        body: JSON.stringify({ predio, tributo, motivo }),
      });
      setMensaje(`Reclamo tributario enviado al SAT · Código: ${res.codigo}`);
      cargarConsolidado();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      {!soloSeguimiento && (
        <form onSubmit={handleSubmit} className="card">
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#16a34a', fontWeight: 700 }}>
            INTEGRACIÓN HU-6.2 · METROBUS → SAT PERÚ
          </p>
          <h1 style={{ margin: '0.2rem 0 1rem', color: '#0f3d24' }}>Reclamo de arbitrios por estación</h1>

          {mensaje && <div className="alert alert-success">{mensaje}</div>}
          {error && <div className="alert alert-error">{error}</div>}

          <div className="grid-2">
            <div className="form-group">
              <label htmlFor="sat-cont">Contribuyente (precargado)</label>
              <input id="sat-cont" className="form-control" value={usuario?.nombre || ''} readOnly />
            </div>
            <div className="form-group">
              <label htmlFor="sat-est">Predio / Estación</label>
              <input
                id="sat-est"
                className="form-control"
                value={predio}
                onChange={(e) => setPredio(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="sat-trib">Tributo</label>
              <input
                id="sat-trib"
                className="form-control"
                value={tributo}
                onChange={(e) => setTributo(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="sat-mot">Motivo</label>
              <input
                id="sat-mot"
                className="form-control"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary">Presentar reclamo en SAT</button>
        </form>
      )}

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Mis reportes en otras apps (RF-6.4)</h2>
        <p style={{ color: '#4b6658', marginTop: 0 }}>
          Estado en tiempo real de todas las operaciones vinculadas a <strong>{usuario?.nombre}</strong> en Neon:
        </p>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Tipo de operación</th>
                <th>Código</th>
                <th>Estado actual</th>
              </tr>
            </thead>
            <tbody>
              {misReportes.map((item) => (
                <tr key={`${item.tipo}-${item.id}`}>
                  <td style={{ textTransform: 'capitalize', fontWeight: 600 }}>{item.tipo}</td>
                  <td><code>{item.codigo}</code></td>
                  <td><BadgeEstado estado={item.estado} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}