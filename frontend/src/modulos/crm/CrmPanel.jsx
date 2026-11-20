import { useEffect, useState } from 'react';
import { apiFetch } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';
import BadgeEstado from '../../components/common/BadgeEstado.jsx';

export default function CrmPanel() {
  const { usuario, obtenerRol } = useAuth();
  const rol = obtenerRol('crm');

  const [demos, setDemos] = useState([]);
  const [empresa, setEmpresa] = useState(usuario?.nombre || '');
  const [contacto, setContacto] = useState(usuario?.correo || '');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const cargar = async () => {
    try {
      const data = await apiFetch('/api/crm/demos');
      setDemos(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const solicitarDemo = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    try {
      const nueva = await apiFetch('/api/crm/demos', {
        method: 'POST',
        body: JSON.stringify({ empresa, contacto }),
      });
      setMensaje(`Solicitud de demo enviada con código ${nueva.codigo}`);
      cargar();
    } catch (err) {
      setError(err.message);
    }
  };

  const aprobarDemo = async (id) => {
    try {
      await apiFetch(`/api/crm/demos/${id}/estado`, {
        method: 'PATCH',
        body: JSON.stringify({ estado: 'aprobada' }),
      });
      setMensaje('Demo aprobada: la empresa ya es cliente activo del CRM.');
      cargar();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="card">
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#16a34a', fontWeight: 700 }}>
          MÓDULO CRM ANDINO PERÚ · ROL ACTIVO: {rol?.toUpperCase()}
        </p>
        <h1 style={{ margin: '0.2rem 0 0', color: '#0f3d24' }}>Solicitudes de Demo CRM (HU-6.3)</h1>
      </div>

      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {rol === 'cliente' && (
        <form onSubmit={solicitarDemo} className="card">
          <h2 style={{ marginTop: 0 }}>Solicitar demostración del CRM Andino</h2>
          <div className="grid-2">
            <div className="form-group">
              <label htmlFor="crm-empresa">Empresa solicitante</label>
              <input
                id="crm-empresa"
                className="form-control"
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="crm-contacto">Correo de contacto</label>
              <input
                id="crm-contacto"
                className="form-control"
                value={contacto}
                onChange={(e) => setContacto(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Solicitar demo</button>
        </form>
      )}

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Solicitudes registradas ({demos.length})</h2>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Empresa</th>
                <th>Contacto</th>
                <th>Estado</th>
                {rol === 'administrador' && <th>Acción</th>}
              </tr>
            </thead>
            <tbody>
              {demos.map((d) => (
                <tr key={d.id}>
                  <td><strong>{d.codigo}</strong></td>
                  <td>{d.empresa}</td>
                  <td>{d.contacto}</td>
                  <td><BadgeEstado estado={d.estado} /></td>
                  {rol === 'administrador' && (
                    <td>
                      {d.estado !== 'aprobada' ? (
                        <button type="button" className="btn btn-primary btn-sm" onClick={() => aprobarDemo(d.id)}>
                          Aprobar demo
                        </button>
                      ) : (
                        <span style={{ color: '#15803d', fontWeight: 600 }}>Cliente activo</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}