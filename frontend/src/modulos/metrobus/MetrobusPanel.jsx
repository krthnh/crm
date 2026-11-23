import { useEffect, useState } from 'react';
import { apiFetch, API_URL } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';
import BadgeEstado from '../../components/common/BadgeEstado.jsx';
import PanelHero, { EstadoVacio } from '../../components/common/PanelHero.jsx';
import SubirImagenNeon from '../../components/common/SubirImagenNeon.jsx';


export default function MetrobusPanel() {
  const { obtenerRol } = useAuth();
  const rol = obtenerRol('metrobus');


  const [registros, setRegistros] = useState([]);
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [monto, setMonto] = useState('');
  const [imagenId, setImagenId] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');


  const cargar = async () => {
    try {
      const data = await apiFetch('/api/metrobus');
      setRegistros(data);
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
      const nuevo = await apiFetch('/api/metrobus', {
        method: 'POST',
        body: JSON.stringify({ numero_tarjeta: numeroTarjeta, monto, imagen_id: imagenId }),
      });
      setMensaje(`Recarga registrada con código ${nuevo.codigo}`);
      setNumeroTarjeta('');
      setMonto('');
      setImagenId(null);
      cargar();
    } catch (err) {
      setError(err.message);
    }
  };


  const cambiarEstado = async (id, estado) => {
    try {
      await apiFetch(`/api/metrobus/${id}/estado`, {
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
      await apiFetch(`/api/metrobus/${id}`, { method: 'DELETE' });
      cargar();
    } catch (err) {
      setError(err.message);
    }
  };


  return (
    <div>
      <PanelHero
        modulo="metrobus"
        rol={rol}
        titulo="Gestión de Recargas de Tarjeta"
        subtitulo="Recarga tu tarjeta MetroBus, adjunta tu comprobante y sigue el estado de cada operación."
        stats={[
          { label: 'Recargas', valor: registros.length },
          { label: 'Pendientes', valor: registros.filter((r) => r.estado === 'registrado').length },
          { label: 'Pagadas', valor: registros.filter((r) => r.estado === 'pagado').length },
          { label: 'Monto total', valor: registros.reduce((a, r) => a + Number(r.monto || 0), 0), prefijo: 'S/ ', decimales: 2 },
        ]}
      />


      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-error">{error}</div>}


      {(rol === 'cliente' || rol === 'administrador') && (
        <form onSubmit={handleCrear} className="card">
          <h2 style={{ marginTop: 0 }}>Registrar nueva recarga</h2>
          <div className="grid-2">
            <div className="form-group">
              <label htmlFor="mb-tarjeta">Número de tarjeta</label>
              <input
                id="mb-tarjeta"
                className="form-control"
                placeholder="Ej. 4557-8800-1024"
                value={numeroTarjeta}
                onChange={(e) => setNumeroTarjeta(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="mb-monto">Monto (S/)</label>
              <input
                id="mb-monto"
                type="number"
                step="0.50"
                min="1"
                className="form-control"
                placeholder="20.00"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                required
              />
            </div>
          </div>
          <SubirImagenNeon onImagenSubida={setImagenId} imagenActualId={imagenId} />
          <button type="submit" className="btn btn-primary">Guardar recarga</button>
        </form>
      )}


      <div className="card">
        <h2 style={{ marginTop: 0 }}>Listado de recargas ({registros.length})</h2>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Usuario</th>
                <th>Tarjeta</th>
                <th>Monto</th>
                <th>Evidencia</th>
                <th>Estado</th>
                {(rol === 'empleado' || rol === 'administrador') && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {registros.map((r) => (
                <tr key={r.id}>
                  <td><strong>{r.codigo}</strong></td>
                  <td>{r.usuario_nombre}</td>
                  <td>{r.numero_tarjeta}</td>
                  <td>S/ {Number(r.monto).toFixed(2)}</td>
                  <td>
                    {r.imagen_id ? (
                      <a href={`${API_URL}/api/imagenes/${r.imagen_id}`} target="_blank" rel="noreferrer">
                        Ver imagen
                      </a>
                    ) : '—'}
                  </td>
                  <td><BadgeEstado estado={r.estado} /></td>
                  {(rol === 'empleado' || rol === 'administrador') && (
                    <td style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <button type="button" className="btn btn-primary btn-sm" onClick={() => cambiarEstado(r.id, 'pagado')}>
                        Validar pago
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
              {registros.length === 0 && (
                <tr><td colSpan={7}><EstadoVacio texto="Aún no hay recargas registradas" /></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
