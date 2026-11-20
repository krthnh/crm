import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Inicio() {
  const { usuario, roles } = useAuth();

  return (
    <div>
      <div className="card">
        <h1 style={{ margin: '0 0 0.4rem', color: '#0f3d24' }}>Bienvenido, {usuario?.nombre}</h1>
        <p style={{ margin: 0, color: '#4b6658' }}>
          Has iniciado sesión con una única cuenta. Tu menú lateral se ha configurado automáticamente según tus roles asignados en <code>usuario_rol</code>:
        </p>
      </div>

      <div className="grid-2">
        {roles.map((r) => (
          <div key={r.modulo} className="card">
            <span className="badge badge-green" style={{ marginBottom: '0.5rem' }}>
              Rol: {r.rol}
            </span>
            <h3 style={{ margin: '0.2rem 0 0.75rem', textTransform: 'capitalize' }}>
              Módulo {r.modulo}
            </h3>
            <Link to={`/${r.modulo}`} className="btn btn-primary btn-sm">
              Abrir módulo
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}