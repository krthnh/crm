import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const [correo, setCorreo] = useState('admin@metrobus.pe');
  const [contrasena, setContrasena] = useState('1234');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      await login(correo, contrasena);
      navigate('/inicio');
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, #0f3d24, #165c36)', padding: '1rem' }}>
      <form onSubmit={handleSubmit} className="card" style={{ width: '100%', maxWidth: '410px' }}>
        <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase' }}>
          Grupo 6 · Trabajo Final
        </p>
        <h1 style={{ margin: '0.2rem 0 0.5rem', fontSize: '1.65rem', color: '#0f3d24' }}>
          CRM Andino · Vista 360
        </h1>
        <p style={{ margin: '0 0 1.2rem', color: '#4b6658', fontSize: '0.95rem' }}>
          Acceso único conectado a Neon PostgreSQL
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="form-group">
          <label htmlFor="correo">Correo electrónico</label>
          <input
            id="correo"
            type="email"
            className="form-control"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="contrasena">Contraseña</label>
          <input
            id="contrasena"
            type="password"
            className="form-control"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={cargando}>
          {cargando ? 'Validando en Neon...' : 'Ingresar al sistema'}
        </button>

        <div style={{ marginTop: '1rem', fontSize: '0.82rem', color: '#4b6658', background: '#f8faf9', padding: '0.65rem', borderRadius: '8px' }}>
          <strong>Cuentas rápidas (clave: 1234):</strong><br />
          • Admin MetroBus: <code>admin@metrobus.pe</code><br />
          • Admin AguaViva: <code>admin@aguaviva.pe</code><br />
          • Admin CRM: <code>admin@crmandino.pe</code><br />
          • Empleado AguaViva: <code>emp@aguaviva.pe</code>
        </div>
      </form>
    </div>
  );
}