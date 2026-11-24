
import { useEffect, useState } from 'react';
import { apiFetch, API_URL } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';
import BadgeEstado from '../../components/common/BadgeEstado.jsx';
import PanelHero, { EstadoVacio } from '../../components/common/PanelHero.jsx';
import SubirImagenNeon from '../../components/common/SubirImagenNeon.jsx';

export default function AguaPanel() {
  const { obtenerRol } = useAuth();
  const rol = obtenerRol('agua');

  const [fugas, setFugas] = useState([]);
  const [ubicacion, setUbicacion] = useState('');
  const [tipoFuga, setTipoFuga] = useState('Tubería rota');
  const [urgencia, setUrgencia] = useState('Alta');
  const [imagenId, setImagenId] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const cargar = async () => {
    try {
      const data = await apiFetch('/api/agua');
      setFugas(data);
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
      const nuevo = await apiFetch('/api/agua', {
        method: 'POST',
        body: JSON.stringify({ ubicacion, tipo_fuga: tipoFuga, urgencia, imagen_id: imagenId }),
      });
      setMensaje(`Fuga registrada con código ${nuevo.codigo}`);
      setUbicacion('');
      setImagenId(null);
      cargar();
    } catch (err) {
      setError(err.message);
    }
  };

  const cambiarEstado = async (id, estado) => {
    try {
      await apiFetch(`/api/agua/${id}/estado`, {
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
      await apiFetch(`/api/agua/${id}`, { method: 'DELETE' });
      cargar();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <PanelHero
        modulo="agua"
        rol={rol}
        titulo="Reportes de Fuga de Agua"
        subtitulo="Reporta fugas en tu zona de Huancayo y haz seguimiento hasta que sean atendidas."
        stats={[
          { label: 'Reportes', valor: fugas.length },
          { label: 'Pendientes', valor: fugas.filter((f) => f.estado === 'registrado').length },
          { label: 'Atendidos', valor: fugas.filter((f) => f.estado === 'atendido').length },
        ]}
      />

      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {(rol === 'cliente' || rol === 'administrador') && (
        <form onSubmit={handleCrear} className="card">
          <h2 style={{ marginTop: 0 }}>Reportar incidencia</h2>
          <div className="form-group">
            <label htmlFor="av-ubicacion">Ubicación exacta</label>
            <input
              id="av-ubicacion"
              className="form-control"
              placeholder="Ej. Jr. Ancash 450 - Huancayo"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              required
            />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label htmlFor="av-tipo">Tipo de fuga</label>
              <select id="av-tipo" className="form-control" value={tipoFuga} onChange={(e) => setTipoFuga(e.target.value)}>
                <option value="Tubería rota">Tubería rota</option>
                <option value="Medidor dañado">Medidor dañado</option>
                <option value="Filtración en vereda">Filtración en vereda</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="av-urgencia">Nivel de urgencia</label>
              <select id="av-urgencia" className="form-control" value={urgencia} onChange={(e) => setUrgencia(e.target.value)}>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>
          </div>
          <SubirImagenNeon onImagenSubida={setImagenId} imagenActualId={imagenId} />
          <button type="submit" className="btn btn-primary">Enviar reporte</button>
        </form>
      )}

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Panel de reportes ({fugas.length})</h2>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Reportante</th>
                <th>Ubicación</th>
                <th>Tipo / Urgencia</th>
                <th>Foto</th>
                <th>Estado</th>
                {(rol === 'empleado' || rol === 'administrador') && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {fugas.map((f) => (
                <tr key={f.id} className={f.estado === 'atendido' ? 'fila-cerrada' : undefined}>
                  <td><strong>{f.codigo}</strong></td>
                  <td>{f.reportante}</td>
                  <td>{f.ubicacion}</td>
                  <td>{f.tipo_fuga} ({f.urgencia})</td>
                  <td>
                    {f.imagen_id ? (
                      <a href={`${API_URL}/api/imagenes/${f.imagen_id}`} target="_blank" rel="noreferrer">
                        Ver foto
                      </a>
                    ) : '—'}
                  </td>
                  <td><BadgeEstado estado={f.estado} /></td>
                  {(rol === 'empleado' || rol === 'administrador') && (
                    <td style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <button type="button" className="btn btn-primary btn-sm" disabled={f.estado === 'atendido'} title={f.estado === 'atendido' ? 'Operación cerrada' : undefined} onClick={() => cambiarEstado(f.id, 'atendido')}>
                        Marcar atendido
                      </button>
                      {rol === 'administrador' && (
                        <button type="button" className="btn btn-danger btn-sm" disabled={f.estado === 'atendido'} title={f.estado === 'atendido' ? 'Operación cerrada' : undefined} onClick={() => eliminar(f.id)}>
                          Eliminar
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
              {fugas.length === 0 && (
                <tr><td colSpan={7}><EstadoVacio texto="Aún no hay reportes de fuga" /></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
