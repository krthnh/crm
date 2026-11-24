import { useState } from 'react';


const METODOS = [
  { id: 'tarjeta', nombre: 'Tarjeta', desc: 'Débito o crédito' },
  { id: 'yape', nombre: 'Yape', desc: 'Pago con celular' },
  { id: 'plin', nombre: 'Plin', desc: 'Pago con celular' },
];


function Icono({ id }) {
  if (id === 'tarjeta') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <rect x="4" y="10" width="40" height="28" rx="5" fill="currentColor" />
        <rect x="4" y="16" width="40" height="7" fill="rgba(0,0,0,0.35)" />
        <rect x="9" y="29" width="14" height="4" rx="2" fill="rgba(255,255,255,0.8)" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <rect x="13" y="4" width="22" height="40" rx="5" fill="currentColor" />
      <rect x="16" y="10" width="16" height="24" rx="2" fill="rgba(255,255,255,0.9)" />
      <circle cx="24" cy="39" r="2" fill="rgba(255,255,255,0.9)" />
      <path d="M20 22l3 3 6-7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}


// QR decorativo de demostración (no es un código de pago real)
function QrDemo() {
  const celdas = [];
  for (let y = 0; y < 11; y++) {
    for (let x = 0; x < 11; x++) {
      const esquina = (x < 3 && y < 3) || (x > 7 && y < 3) || (x < 3 && y > 7);
      if (esquina || ((x * 7 + y * 13 + x * y) % 3 === 0)) {
        celdas.push(<rect key={`${x}-${y}`} x={x * 8 + 4} y={y * 8 + 4} width="7" height="7" rx="1.5" />);
      }
    }
  }
  return <svg viewBox="0 0 96 96" className="qr-demo" aria-label="QR de demostración" fill="currentColor">{celdas}</svg>;
}


const soloDigitos = (v, max) => v.replace(/\D/g, '').slice(0, max);


/**
 * Selector de método de pago.
 * Informa al padre: onChange({ metodo, referencia })
 *  - tarjeta: referencia = "**** 1234" (nunca se envía el número completo ni el CVV)
 *  - yape / plin: referencia = número de operación
 */
export default function MetodosPago({ metodo, onChange }) {
  const [numTarjeta, setNumTarjeta] = useState('');
  const [titular, setTitular] = useState('');
  const [vence, setVence] = useState('');
  const [cvv, setCvv] = useState('');
  const [operacion, setOperacion] = useState('');


  const elegir = (id) => onChange({ metodo: id, referencia: '' });


  const formatearTarjeta = (v) => soloDigitos(v, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatearVence = (v) => {
    const d = soloDigitos(v, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };


  return (
    <div className="pago">
      <div className="pago-opciones" role="radiogroup" aria-label="Método de pago">
        {METODOS.map((m) => (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={metodo === m.id}
            className={`pago-opcion pago-${m.id} ${metodo === m.id ? 'activo' : ''}`}
            onClick={() => elegir(m.id)}
          >
            <span className="pago-ico"><Icono id={m.id} /></span>
            <strong>{m.nombre}</strong>
            <small>{m.desc}</small>
            <span className="pago-check">✓</span>
          </button>
        ))}
      </div>


      {metodo === 'tarjeta' && (
        <div className="pago-detalle" key="tarjeta">
          <div className="tarjeta-vista">
            <span className="chip" />
            <div className="tv-num">{numTarjeta || '•••• •••• •••• ••••'}</div>
            <div className="tv-pie">
              <span>{titular || 'NOMBRE DEL TITULAR'}</span>
              <span>{vence || 'MM/AA'}</span>
            </div>
          </div>
          <div className="pago-campos">
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="pg-num">Número de tarjeta</label>
              <input id="pg-num" className="form-control" inputMode="numeric" placeholder="0000 0000 0000 0000"
                value={numTarjeta} required minLength={19}
                onChange={(e) => {
                  const v = formatearTarjeta(e.target.value);
                  setNumTarjeta(v);
                  onChange({ metodo, referencia: v.length === 19 ? `**** ${v.slice(-4)}` : '' });
                }} />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="pg-titular">Titular</label>
              <input id="pg-titular" className="form-control" placeholder="Como figura en la tarjeta"
                value={titular} onChange={(e) => setTitular(e.target.value.toUpperCase())} required />
            </div>
            <div className="form-group">
              <label htmlFor="pg-vence">Vence</label>
              <input id="pg-vence" className="form-control" inputMode="numeric" placeholder="MM/AA"
                value={vence} onChange={(e) => setVence(formatearVence(e.target.value))} required minLength={5} />
            </div>
            <div className="form-group">
              <label htmlFor="pg-cvv">CVV</label>
              <input id="pg-cvv" className="form-control" inputMode="numeric" type="password" placeholder="•••"
                value={cvv} onChange={(e) => setCvv(soloDigitos(e.target.value, 4))} required minLength={3} />
            </div>
          </div>
          <p className="pago-nota">🔒 Solo se guardan los últimos 4 dígitos. El CVV y el número completo no se envían.</p>
        </div>
      )}


      {(metodo === 'yape' || metodo === 'plin') && (
        <div className={`pago-detalle pago-app pago-app-${metodo}`} key={metodo}>
          <div className="pago-qr">
            <QrDemo />
            <small>QR de demostración</small>
          </div>
          <div className="pago-pasos">
            <ol>
              <li>Abre <strong>{metodo === 'yape' ? 'Yape' : 'Plin'}</strong> en tu celular.</li>
              <li>Paga al número <strong>987 654 321</strong> (CRM Andino).</li>
              <li>Escribe aquí el <strong>N° de operación</strong> y adjunta tu captura.</li>
            </ol>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="pg-op">N° de operación</label>
              <input id="pg-op" className="form-control" inputMode="numeric" placeholder="Ej. 12345678"
                value={operacion} required minLength={6}
                onChange={(e) => {
                  const v = soloDigitos(e.target.value, 10);
                  setOperacion(v);
                  onChange({ metodo, referencia: v.length >= 6 ? v : '' });
                }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


/* Etiqueta pequeña para la tabla */
export function BadgeMetodo({ metodo }) {
  if (!metodo) return <span>—</span>;
  const m = METODOS.find((x) => x.id === metodo);
  return <span className={`badge-metodo pago-${metodo}`}><span className="pago-ico-mini"><Icono id={metodo} /></span>{m ? m.nombre : metodo}</span>;
}
