import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';


const MODULOS_CLIENTE = [
  { id: 'metrobus', nombre: 'MetroBus Lima', desc: 'Transporte público' },
  { id: 'agua', nombre: 'AguaViva Huancayo', desc: 'Agua potable y fugas' },
  { id: 'sat', nombre: 'SAT Perú', desc: 'Arbitrios y tributos' },
];


export default function Login() {
  const [modo, setModo] = useState('login'); // 'login' | 'registro'
  const [verClave, setVerClave] = useState(false);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);


  // Login
  const [correo, setCorreo] = useState('admin@metrobus.pe');
  const [contrasena, setContrasena] = useState('1234');


  // Registro
  const [nombre, setNombre] = useState('');
  const [correoReg, setCorreoReg] = useState('');
  const [claveReg, setClaveReg] = useState('');
  const [claveReg2, setClaveReg2] = useState('');
  const [modulo, setModulo] = useState('metrobus');


  const { login, registrar } = useAuth();
  const navigate = useNavigate();


  const cambiarModo = (nuevo) => {
    setModo(nuevo);
    setError('');
    setVerClave(false);
  };


  const handleLogin = async (e) => {
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


  const handleRegistro = async (e) => {
    e.preventDefault();
    setError('');


    if (claveReg !== claveReg2) {
      setError('Las contraseñas no coinciden');
      return;
    }


    setCargando(true);
    try {
      await registrar({ nombre, correo: correoReg, contrasena: claveReg, modulo });
      navigate('/inicio');
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };


  const esLogin = modo === 'login';


  return (
    <div className="login-bg">
      <div className="login-wrap">
        {/* Panel de marca */}
        <section className="login-brand">
          <span className="login-brand-tag">Grupo 6 · Trabajo Final</span>
          <h1>CRM Andino<br /><span>Vista 360</span></h1>
          <p>
            Una sola cuenta para ver y gestionar tus servicios: transporte, agua y tributos,
            conectados en una misma plataforma.
          </p>
          <ul>
            {MODULOS_CLIENTE.map((m) => (
              <li key={m.id}>
                <strong>{m.nombre}</strong>
                <small>{m.desc}</small>
              </li>
            ))}
          </ul>
        </section>


        {/* Formulario */}
        <div className="card login-card">
          <div className="login-tabs" role="tablist">
            <button type="button" role="tab" aria-selected={esLogin}
              className={esLogin ? 'activo' : ''} onClick={() => cambiarModo('login')}>
              Ingresar
            </button>
            <button type="button" role="tab" aria-selected={!esLogin}
              className={!esLogin ? 'activo' : ''} onClick={() => cambiarModo('registro')}>
              Crear cuenta
            </button>
          </div>


          <h2 className="login-titulo">{esLogin ? 'Bienvenido de nuevo' : 'Regístrate como cliente'}</h2>
          <p className="login-sub">
            {esLogin ? 'Acceso único conectado a Neon PostgreSQL' : 'Crea tu cuenta en menos de un minuto'}
          </p>


          {error && <div className="alert alert-error">{error}</div>}


          {esLogin ? (
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="correo">Correo electrónico</label>
                <input id="correo" type="email" className="form-control" value={correo}
                  onChange={(e) => setCorreo(e.target.value)} required />
              </div>


              <div className="form-group">
                <label htmlFor="contrasena">Contraseña</label>
                <div className="input-clave">
                  <input id="contrasena" type={verClave ? 'text' : 'password'} className="form-control"
                    value={contrasena} onChange={(e) => setContrasena(e.target.value)} required />
                  <button type="button" onClick={() => setVerClave(!verClave)}>
                    {verClave ? 'Ocultar' : 'Ver'}
                  </button>
                </div>
              </div>


              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={cargando}>
                {cargando ? 'Validando en Neon...' : 'Ingresar al sistema'}
              </button>


              <div className="login-rapidas">
                <strong>Cuentas rápidas (clave: 1234):</strong><br />
                • Admin MetroBus: <code>admin@metrobus.pe</code><br />
                • Admin AguaViva: <code>admin@aguaviva.pe</code><br />
                • Admin CRM: <code>admin@crmandino.pe</code><br />
                • Empleado AguaViva: <code>emp@aguaviva.pe</code>
              </div>


              <p className="login-cambio">
                ¿Eres nuevo?{' '}
                <button type="button" onClick={() => cambiarModo('registro')}>Crea tu cuenta</button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegistro}>
              <div className="form-group">
                <label htmlFor="nombre">Nombre completo</label>
                <input id="nombre" type="text" className="form-control" value={nombre}
                  onChange={(e) => setNombre(e.target.value)} placeholder="Ej. María Quispe" required />
              </div>


              <div className="form-group">
                <label htmlFor="correoReg">Correo electrónico</label>
                <input id="correoReg" type="email" className="form-control" value={correoReg}
                  onChange={(e) => setCorreoReg(e.target.value)} placeholder="tucorreo@ejemplo.com" required />
              </div>


              <div className="form-group">
                <label htmlFor="claveReg">Contraseña</label>
                <div className="input-clave">
                  <input id="claveReg" type={verClave ? 'text' : 'password'} className="form-control"
                    value={claveReg} onChange={(e) => setClaveReg(e.target.value)}
                    minLength={4} placeholder="Mínimo 4 caracteres" required />
                  <button type="button" onClick={() => setVerClave(!verClave)}>
                    {verClave ? 'Ocultar' : 'Ver'}
                  </button>
                </div>
              </div>


              <div className="form-group">
                <label htmlFor="claveReg2">Repetir contraseña</label>
                <input id="claveReg2" type={verClave ? 'text' : 'password'} className="form-control"
                  value={claveReg2} onChange={(e) => setClaveReg2(e.target.value)} required />
              </div>


              <div className="form-group">
                <label>¿Qué servicio quieres usar primero?</label>
                <div className="modulo-opciones">
                  {MODULOS_CLIENTE.map((m) => (
                    <button type="button" key={m.id}
                      className={modulo === m.id ? 'activo' : ''} onClick={() => setModulo(m.id)}>
                      <strong>{m.nombre}</strong>
                      <small>{m.desc}</small>
                    </button>
                  ))}
                </div>
              </div>


              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={cargando}>
                {cargando ? 'Creando cuenta...' : 'Crear mi cuenta'}
              </button>


              <p className="login-cambio">
                ¿Ya tienes cuenta?{' '}
                <button type="button" onClick={() => cambiarModo('login')}>Inicia sesión</button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
