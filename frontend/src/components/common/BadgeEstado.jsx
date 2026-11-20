const VERDES = ['aprobada', 'atendido', 'pagado', 'fundado'];
const AMBAR = ['en proceso', 'derivado'];
const ROJOS = ['infundado', 'rechazado'];

export default function BadgeEstado({ estado }) {
  const val = String(estado || '').toLowerCase();
  let clase = 'badge-blue';
  if (VERDES.includes(val)) clase = 'badge-green';
  else if (AMBAR.includes(val)) clase = 'badge-amber';
  else if (ROJOS.includes(val)) clase = 'badge-red';
  else if (val === 'registrado') clase = 'badge-gray';

  return <span className={`badge ${clase}`}>{estado}</span>;
}