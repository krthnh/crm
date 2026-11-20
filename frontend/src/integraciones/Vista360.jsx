import { useEffect, useState } from 'react';
import { apiFetch } from '../api/client.js';
import BadgeEstado from '../components/common/BadgeEstado.jsx';

export default function Vista360() {
  const [registros, setRegistros] = useState([]);
  const [filtroEmpresa, setFiltroEmpresa] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch('/api/crm/vista-360')
      .then(setRegistros)
      .catch((err) => setError(err.message));
  }, []);

  const filtrados = filtroEmpresa
    ? registros.filter((r) => r.empresa.toLowerCase().includes(filtroEmpresa.toLowerCase()))
    : registros;

  return (
    <div className="card">
      <p style={{ margin: 0, fontSize: '0.85rem', color: '#16a34a', fontWeight: 700 }}>
        INTEGRACIÓN HU-6.4 · SQL VIEW vista_360 (UNION ALL)
      </p>
      <h1 style={{ margin: '0.2rem 0 0.75rem', color: '#0f3d24' }}>Vista 360 del CRM Andino</h1>
      <p style={{ color: '#4b6658', marginTop: 0 }}>
        Consolidado en tiempo real de recargas (MetroBus), fugas (AguaViva) y reclamos (SAT) de los clientes:
      </p>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="form-group" style={{ maxWidth: '360px' }}>
        <label htmlFor="filtro-360">Filtrar por empresa / cliente</label>
        <input
          id="filtro-360"
          className="form-control"
          placeholder="Ej. MetroBus Lima"
          value={filtroEmpresa}
          onChange={(e) => setFiltroEmpresa(e.target.value)}
        />
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Módulo / Tipo</th>
              <th>Código</th>
              <th>Empresa / Usuario</th>
              <th>Correo</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((r) => (
              <tr key={`${r.tipo}-${r.id}`}>
                <td style={{ textTransform: 'uppercase', fontWeight: 700 }}>{r.tipo}</td>
                <td><code>{r.codigo}</code></td>
                <td><strong>{r.empresa}</strong></td>
                <td>{r.correo}</td>
                <td><BadgeEstado estado={r.estado} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}