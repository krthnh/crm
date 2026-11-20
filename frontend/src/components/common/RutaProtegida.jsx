import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function RutaProtegida({ modulo, rolesPermitidos = [], children }) {
  const { usuario, tieneRol } = useAuth();

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (modulo && !tieneRol(modulo, rolesPermitidos)) {
    return (
      <div className="card">
        <h2>Acceso restringido</h2>
        <p>Tu cuenta no cuenta con permisos para acceder al módulo <strong>{modulo}</strong>.</p>
      </div>
    );
  }

  return children;
}