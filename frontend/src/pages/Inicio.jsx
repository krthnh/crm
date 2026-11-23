import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { EscenaModulo } from '../components/common/PanelHero.jsx';


const INFO = {
  metrobus: { nombre: 'MetroBus Lima', desc: 'Recargas de tarjeta y seguimiento de pagos.' },
  agua: { nombre: 'AguaViva Huancayo', desc: 'Reportes de fugas y atención de incidencias.' },
  sat: { nombre: 'SAT Perú', desc: 'Reclamos de arbitrios y tributos.' },
  crm: { nombre: 'CRM Andino', desc: 'Demos, clientes activos y vista consolidada.' },
};


export default function Inicio() {
  const { usuario, roles } = useAuth();
  const primerNombre = (usuario?.nombre || '').split(' ')[0];


  return (
    <div>
      <section className="panel-hero tema-crm">
        <div className="panel-hero-texto">
          <span className="panel-hero-tag">Grupo 6 · CRM Andino · Vista 360</span>
          <h1>¡Hola, {primerNombre}! 👋</h1>
          <p>
            Ingresaste con una única cuenta. Tu menú se armó automáticamente según los
            roles que tienes asignados en cada servicio.
          </p>
          <div className="hero-stats">
            <div className="hero-stat">
              <strong>{roles.length}</strong>
              <span>{roles.length === 1 ? 'Módulo activo' : 'Módulos activos'}</span>
            </div>
          </div>
        </div>
        <div className="panel-hero-arte"><EscenaModulo modulo="crm" /></div>
      </section>


      <div className="grid-2">
        {roles.map((r, i) => {
          const info = INFO[r.modulo] || { nombre: r.modulo, desc: '' };
          return (
            <div key={r.modulo} className={`card modulo-card tema-${r.modulo}`} style={{ '--i': i }}>
              <div className="modulo-card-arte"><EscenaModulo modulo={r.modulo} /></div>
              <div className="modulo-card-cuerpo">
                <span className="badge badge-green">Rol: {r.rol}</span>
                <h3>{info.nombre}</h3>
                <p>{info.desc}</p>
                <Link to={`/${r.modulo}`} className="btn btn-primary btn-sm">Abrir módulo →</Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
