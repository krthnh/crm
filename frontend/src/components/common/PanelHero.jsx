import { useEffect, useState } from 'react';


/* ---------- Contador animado (sube de 0 al valor) ---------- */
function Contador({ valor = 0, decimales = 0, prefijo = '' }) {
  const [n, setN] = useState(0);


  useEffect(() => {
    const destino = Number(valor) || 0;
    const duracion = 900;
    const inicio = performance.now();
    let raf;
    const paso = (t) => {
      const p = Math.min((t - inicio) / duracion, 1);
      const suave = 1 - Math.pow(1 - p, 3); // ease-out
      setN(destino * suave);
      if (p < 1) raf = requestAnimationFrame(paso);
    };
    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
  }, [valor]);


  return <>{prefijo}{n.toFixed(decimales)}</>;
}


/* ---------- Ilustraciones SVG animadas por módulo ---------- */
export function EscenaModulo({ modulo }) {
  if (modulo === 'metrobus') {
    return (
      <svg viewBox="0 0 460 220" className="escena" aria-hidden="true">
        <g opacity="0.28" fill="#a7f3d0">
          <rect x="10" y="100" width="40" height="80" rx="3" />
          <rect x="60" y="70" width="34" height="110" rx="3" />
          <rect x="104" y="110" width="46" height="70" rx="3" />
          <rect x="160" y="60" width="38" height="120" rx="3" />
          <rect x="208" y="95" width="44" height="85" rx="3" />
          <rect x="262" y="75" width="36" height="105" rx="3" />
          <rect x="308" y="105" width="48" height="75" rx="3" />
          <rect x="366" y="65" width="40" height="115" rx="3" />
          <rect x="416" y="100" width="34" height="80" rx="3" />
        </g>
        <rect x="0" y="170" width="460" height="50" fill="rgba(0,0,0,0.35)" />
        <line x1="0" y1="196" x2="460" y2="196" stroke="#fff" strokeOpacity="0.5" strokeWidth="3" strokeDasharray="22 18" className="linea-via" />
        <g className="bus-run">
          <rect x="0" y="118" width="170" height="58" rx="12" fill="#10b981" />
          <rect x="0" y="150" width="170" height="8" fill="#047857" />
          <g fill="#d1fae5">
            <rect x="12" y="128" width="26" height="20" rx="4" />
            <rect x="44" y="128" width="26" height="20" rx="4" />
            <rect x="76" y="128" width="26" height="20" rx="4" />
            <rect x="108" y="128" width="26" height="20" rx="4" />
          </g>
          <rect x="140" y="126" width="22" height="42" rx="3" fill="#064e3b" />
          <rect x="164" y="150" width="6" height="10" rx="2" fill="#fde68a" />
          <g className="rueda"><circle cx="38" cy="176" r="12" fill="#0f172a" /><circle cx="38" cy="176" r="5" fill="#94a3b8" /><line x1="38" y1="171" x2="38" y2="181" stroke="#0f172a" strokeWidth="2" /></g>
          <g className="rueda"><circle cx="128" cy="176" r="12" fill="#0f172a" /><circle cx="128" cy="176" r="5" fill="#94a3b8" /><line x1="128" y1="171" x2="128" y2="181" stroke="#0f172a" strokeWidth="2" /></g>
        </g>
      </svg>
    );
  }


  if (modulo === 'agua') {
    return (
      <svg viewBox="0 0 460 220" className="escena" aria-hidden="true">
        <g opacity="0.3" fill="#bae6fd">
          <path d="M0 150 L70 90 L120 130 L190 60 L260 130 L320 85 L390 140 L460 100 V220 H0Z" />
        </g>
        <g className="gota-grande">
          <path d="M230 18 C262 62 282 86 282 112 a52 52 0 0 1 -104 0 C178 86 198 62 230 18Z" fill="#38bdf8" />
          <path d="M205 100 a28 28 0 0 0 20 30" stroke="#e0f2fe" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.8" />
        </g>
        {[60, 120, 340, 400].map((x, i) => (
          <path key={x} className="gota-cae" style={{ animationDelay: `${i * 0.6}s` }}
            transform={`translate(${x} 20)`} d="M0 -12 C8 -2 10 4 0 10 C-10 4 -8 -2 0 -12Z" fill="#7dd3fc" />
        ))}
        <g className="ola ola-1"><path d="M-460 170 q57 -26 115 0 t115 0 t115 0 t115 0 t115 0 t115 0 t115 0 t115 0 V230 H-460Z" fill="#0ea5e9" fillOpacity="0.55" /></g>
        <g className="ola ola-2"><path d="M-460 188 q57 -22 115 0 t115 0 t115 0 t115 0 t115 0 t115 0 t115 0 t115 0 V230 H-460Z" fill="#0369a1" fillOpacity="0.7" /></g>
      </svg>
    );
  }


  if (modulo === 'sat') {
    return (
      <svg viewBox="0 0 460 220" className="escena" aria-hidden="true">
        <g fill="#fde68a">
          <polygon points="230,28 340,86 120,86" opacity="0.95" />
          <rect x="120" y="92" width="220" height="10" rx="2" />
          {[140, 184, 228, 272, 310].map((x) => (<rect key={x} x={x} y="108" width="16" height="64" rx="3" opacity="0.9" />))}
          <rect x="108" y="176" width="244" height="10" rx="2" />
          <rect x="96" y="190" width="268" height="12" rx="2" opacity="0.8" />
        </g>
        <circle cx="230" cy="64" r="9" fill="#92400e" />
        <g className="doc doc-1"><rect x="364" y="40" width="48" height="62" rx="5" fill="#fff" /><g stroke="#92400e" strokeWidth="3" strokeLinecap="round"><line x1="373" y1="56" x2="403" y2="56" /><line x1="373" y1="68" x2="403" y2="68" /><line x1="373" y1="80" x2="392" y2="80" /></g></g>
        <g className="doc doc-2"><rect x="40" y="60" width="44" height="58" rx="5" fill="#fff" /><g stroke="#92400e" strokeWidth="3" strokeLinecap="round"><line x1="48" y1="76" x2="76" y2="76" /><line x1="48" y1="88" x2="76" y2="88" /><line x1="48" y1="100" x2="64" y2="100" /></g></g>
        <g className="moneda"><circle cx="410" cy="150" r="20" fill="#f59e0b" /><circle cx="410" cy="150" r="13" fill="none" stroke="#fef3c7" strokeWidth="3" /><text x="410" y="156" textAnchor="middle" fontSize="16" fontWeight="800" fill="#fef3c7">S/</text></g>
      </svg>
    );
  }


  // crm
  const nodos = [[230, 28], [372, 84], [330, 180], [130, 180], [88, 84]];
  return (
    <svg viewBox="0 0 460 220" className="escena" aria-hidden="true">
      {nodos.map(([x, y]) => (
        <line key={`l${x}`} x1="230" y1="110" x2={x} y2={y} stroke="#6ee7b7" strokeOpacity="0.5" strokeWidth="2" strokeDasharray="6 6" className="linea-red" />
      ))}
      <circle cx="230" cy="110" r="76" fill="none" stroke="#6ee7b7" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="4 10" className="orbita" />
      <circle cx="230" cy="110" r="44" fill="#10b981" className="nucleo" />
      <text x="230" y="118" textAnchor="middle" fontSize="26" fontWeight="800" fill="#ecfdf5">360°</text>
      {nodos.map(([x, y], i) => (
        <g key={`n${x}`}>
          <circle cx={x} cy={y} r="20" fill="#6ee7b7" fillOpacity="0.25" className="pulso" style={{ animationDelay: `${i * 0.35}s` }} />
          <circle cx={x} cy={y} r="11" fill="#a7f3d0" />
        </g>
      ))}
    </svg>
  );
}


const TEMAS = {
  metrobus: { nombre: 'MetroBus Lima' },
  agua: { nombre: 'AguaViva Huancayo' },
  sat: { nombre: 'SAT Perú' },
  crm: { nombre: 'CRM Andino Perú' },
};


/* ---------- Banner principal de cada panel ---------- */
export default function PanelHero({ modulo, rol, titulo, subtitulo, stats = [] }) {
  const tema = TEMAS[modulo] || TEMAS.crm;
  return (
    <section className={`panel-hero tema-${modulo}`}>
      <div className="panel-hero-texto">
        <span className="panel-hero-tag">{tema.nombre} · {rol}</span>
        <h1>{titulo}</h1>
        {subtitulo && <p>{subtitulo}</p>}
        {stats.length > 0 && (
          <div className="hero-stats">
            {stats.map((s, i) => (
              <div key={s.label} className="hero-stat" style={{ animationDelay: `${0.15 + i * 0.1}s` }}>
                <strong><Contador valor={s.valor} decimales={s.decimales} prefijo={s.prefijo} /></strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="panel-hero-arte"><EscenaModulo modulo={modulo} /></div>
    </section>
  );
}


/* ---------- Estado vacío para tablas ---------- */
export function EstadoVacio({ texto = 'Aún no hay registros' }) {
  return (
    <div className="vacio">
      <svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true">
        <rect x="10" y="14" width="44" height="38" rx="6" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M10 30h14l4 6h8l4-6h14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      </svg>
      <p>{texto}</p>
    </div>
  );
}
