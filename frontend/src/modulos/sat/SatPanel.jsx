import { useEffect, useState } from 'react';
import { apiFetch, API_URL } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';
import BadgeEstado from '../../components/common/BadgeEstado.jsx';
import PanelHero, { EstadoVacio } from '../../components/common/PanelHero.jsx';
import SubirImagenNeon from '../../components/common/SubirImagenNeon.jsx';


export default function SatPanel() {
  const { obtenerRol } = useAuth();
  const rol = obtenerRol('sat');


  const [reclamos, setReclamos] = useState([]);
  const [predio, setPredio] = useState('');
  const [tributo, setTributo] = useState('Arbitrios 2026');
  const [motivo, setMotivo] = useState('');
  const [imagenId, setImagenId] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');


  const cargar = async () => {
    try {
      const data = await apiFetch('/api/sat');
      setReclamos(data);
    } catch (err) {
      setError(err.message);
    }
  };


  useEffect(() => {
    cargar();
  }, []);


  const handleCrear = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    try {
      const nuevo = await apiFetch('/api/sat', {
        method: 'POST',
        body: JSON.stringify({ predio, tributo, motivo, imagen_id: imagenId }),
      });
      setMensaje(`Reclamo tributario registrado: ${nuevo.codigo}`);
      setPredio('');
      setMotivo('');
      setImagenId(null);
      cargar();
    } catch (err) {
      setError(err.message);
    }
  };


  const resolver = async (id, estado) => {
    try {
      await apiFetch(`/api/sat/${id}/estado`, {
        method: 'PATCH',
        body: JSON.stringify({ estado }),
      });
      cargar();
    } catch (err) {
      setError(err.message);
    }
  };


  const eliminar = async (id) => {
    try {
      await apiFetch(`/api/sat/${id}`, { method: 'DELETE' });
      cargar();
    } catch (err) {
      setError(err.message);
    }
  };


  return (
    <div>
      <PanelHero
        modulo="sat"
        rol={rol}
        titulo="Reclamos Tributarios"
        subtitulo="Presenta reclamos de arbitrios y tributos con tu sustento y consulta la resolución."
        stats={[
          { label: 'Expedientes', valor: reclamos.length },
          { label: 'En trámite', valor: reclamos.filter((r) => !['fundado', 'infundado'].includes(r.estado)).length },
          { label: 'Fundados', valor: reclamos.filter((r) => r.estado === 'fundado').length },
          { label: 'Infundados', valor: reclamos.filter((r) => r.estado === 'infundado').length },
        ]}
      />


      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-error">{error}</div>}


      {(rol === 'cliente' || rol === 'administrador') && (
        <form onSubmit={handleCrear} className="card">
          <h2 style={{ marginTop: 0 }}>Presentar reclamo tributario</h2>
          <div className="grid-2">
            <div className="form-group">
              <label htmlFor="sat-predio">Predio / Estación</label>
              <input
                id="sat-predio"
                className="form-control"
                placeholder="Ej. Predio Mz. B Lt. 12"
                value={predio}
                onChange={(e) => setPredio(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="sat-tributo">Tributo reclamado</label>
              <select id="sat-tributo" className="form-control" value={tributo} onChange={(e) => setTributo(e.target.value)}>
                <option value="Arbitrios 2026">Arbitrios 2026</option>
                <option value="Impuesto Predial 2026">Impuesto Predial 2026</option>
                <option value="Impuesto Vehicular 2026">Impuesto Vehicular 2026</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="sat-motivo">Sustento del reclamo</label>
            <input
              id="sat-motivo"
              className="form-control"
              placeholder="Describe el motivo del reclamo"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              required
            />
          </div>
          <SubirImagenNeon onImagenSubida={setImagenId} imagenActualId={imagenId} />
          <button type="submit" className="btn btn-primary">Registrar reclamo</button>
        </form>
      )}


      <div className="card">
        <h2 style={{ marginTop: 0 }}>Expedientes registrados ({reclamos.length})</h2>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Contribuyente</th>
                <th>Predio / Tributo</th>
                <th>Motivo</th>
                <th>Sustento</th>
                <th>Estado</th>
                {(rol === 'empleado' || rol === 'administrador') && <th>Resolución</th>}
              </tr>
            </thead>
            <tbody>
              {reclamos.map((r) => (
                <tr key={r.id}>
                  <td><strong>{r.codigo}</strong></td>
                  <td>{r.contribuyente}</td>
                  <td>{r.predio} · {r.tributo}</td>
                  <td>{r.motivo}</td>
                  <td>
                    {r.imagen_id ? (
                      <a href={`${API_URL}/api/imagenes/${r.imagen_id}`} target="_blank" rel="noreferrer">
                        Ver doc
                      </a>
                    ) : '—'}
                  </td>
                  <td><BadgeEstado estado={r.estado} /></td>
                  {(rol === 'empleado' || rol === 'administrador') && (
                    <td style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <button type="button" className="btn btn-primary btn-sm" onClick={() => resolver(r.id, 'fundado')}>
                        Fundado
                      </button>
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => resolver(r.id, 'infundado')}>
                        Infundado
                      </button>
                      {rol === 'administrador' && (
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => eliminar(r.id)}>
                          Eliminar
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
              {reclamos.length === 0 && (
                <tr><td colSpan={7}><EstadoVacio texto="Aún no hay expedientes registrados" /></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
