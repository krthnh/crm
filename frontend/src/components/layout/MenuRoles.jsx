import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const ETIQUETAS_MODULO = {
  metrobus: { nombre: 'MetroBus Lima', ruta: '/metrobus' },
  agua: { nombre: 'AguaViva Huancayo', ruta: '/agua' },
  sat: { nombre: 'SAT Perú', ruta: '/sat' },
  crm: { nombre: 'CRM Andino', ruta: '/crm' },
};

export default function MenuRoles({ children }) {
  const { usuario, roles, logout, tieneRol } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/inicio" className="topbar-brand">
          Grupo 6 · CRM Andino · Vista 360
        </NavLink>
        <div className="topbar-user">
          <span>{usuario?.nombre} ({usuario?.correo})</span>
          <button type="button" onClick={handleLogout} className="btn btn-outline">
            Salir
          </button>
        </div>
      </header>

      <div className="workspace">
        <aside className="sidebar" aria-label="Menú por roles">
          <NavLink to="/inicio" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span>Inicio</span>
            <small>Panel general</small>
          </NavLink>

          {roles.map((r) => {
            const info = ETIQUETAS_MODULO[r.modulo];
            if (!info) return null;
            return (
              <NavLink
                key={r.modulo}
                to={info.ruta}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <span>{info.nombre}</span>
                <small>{r.rol}</small>
              </NavLink>
            );
          })}

          {tieneRol('agua', ['cliente']) && (
            <NavLink to="/agua/fuga" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span>Reportar Fuga (HU-6.1)</span>
              <small>Integración AguaViva</small>
            </NavLink>
          )}

          {tieneRol('sat', ['cliente']) && (
            <NavLink to="/sat/reclamo" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span>Reclamar Arbitrios (HU-6.2)</span>
              <small>Integración SAT</small>
            </NavLink>
          )}

          {tieneRol('metrobus', ['administrador']) && (
            <NavLink to="/metrobus/mis-reportes" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span>Mis Reportes Cruzados</span>
              <small>Seguimiento MetroBus</small>
            </NavLink>
          )}

          {tieneRol('crm', ['administrador', 'empleado']) && (
            <NavLink to="/crm/vista-360" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span>Vista 360 (HU-6.4)</span>
              <small>Consolidado CRM</small>
            </NavLink>
          )}
        </aside>

        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}