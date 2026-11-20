import { Router } from 'express';
import { sql } from '../config/db.js';
import { verificarRol } from '../middlewares/roleMiddleware.js';

const router = Router();
const genCodigo = (prefijo) => `${prefijo}-${Math.floor(10000 + Math.random() * 90000)}`;

// ============================================================================
// 1. MÓDULO METROBUS (recargas_tarjeta)
// ============================================================================
router.get('/metrobus', verificarRol('metrobus'), async (req, res) => {
  try {
    const filas = req.rolModulo === 'cliente'
      ? await sql`SELECT r.*, u.nombre AS usuario_nombre FROM recargas_tarjeta r JOIN usuarios u ON u.id = r.id_usuario WHERE r.id_usuario = ${req.usuarioId} ORDER BY r.creado_en DESC`
      : await sql`SELECT r.*, u.nombre AS usuario_nombre FROM recargas_tarjeta r JOIN usuarios u ON u.id = r.id_usuario ORDER BY r.creado_en DESC`;
    res.json(filas);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar recargas' });
  }
});

router.post('/metrobus', verificarRol('metrobus', ['cliente', 'administrador']), async (req, res) => {
  const { numero_tarjeta, monto, imagen_id = null } = req.body;
  try {
    const codigo = genCodigo('RCG');
    const [nuevo] = await sql`
      INSERT INTO recargas_tarjeta (codigo, id_usuario, numero_tarjeta, monto, estado, imagen_id)
      VALUES (${codigo}, ${req.usuarioId}, ${numero_tarjeta}, ${Number(monto)}, 'registrado', ${imagen_id})
      RETURNING *
    `;
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar recarga' });
  }
});

router.patch('/metrobus/:id/estado', verificarRol('metrobus', ['empleado', 'administrador']), async (req, res) => {
  const { estado } = req.body;
  try {
    const [act] = await sql`
      UPDATE recargas_tarjeta SET estado = ${estado} WHERE id = ${Number(req.params.id)} RETURNING *
    `;
    res.json(act);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar estado de recarga' });
  }
});

router.delete('/metrobus/:id', verificarRol('metrobus', ['administrador']), async (req, res) => {
  try {
    await sql`DELETE FROM recargas_tarjeta WHERE id = ${Number(req.params.id)}`;
    res.json({ mensaje: 'Recarga eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar recarga' });
  }
});

// ============================================================================
// 2. MÓDULO AGUAVIVA (reportes_fuga)
// ============================================================================
router.get('/agua', verificarRol('agua'), async (req, res) => {
  try {
    const filas = req.rolModulo === 'cliente'
      ? await sql`SELECT f.*, u.nombre AS reportante FROM reportes_fuga f JOIN usuarios u ON u.id = f.id_usuario WHERE f.id_usuario = ${req.usuarioId} ORDER BY f.creado_en DESC`
      : await sql`SELECT f.*, u.nombre AS reportante FROM reportes_fuga f JOIN usuarios u ON u.id = f.id_usuario ORDER BY f.creado_en DESC`;
    res.json(filas);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar fugas' });
  }
});

router.post('/agua', verificarRol('agua', ['cliente', 'administrador']), async (req, res) => {
  const { ubicacion, tipo_fuga, urgencia, imagen_id = null } = req.body;
  try {
    const codigo = genCodigo('FUG');
    const [nuevo] = await sql`
      INSERT INTO reportes_fuga (codigo, id_usuario, ubicacion, tipo_fuga, urgencia, estado, imagen_id)
      VALUES (${codigo}, ${req.usuarioId}, ${ubicacion}, ${tipo_fuga}, ${urgencia}, 'registrado', ${imagen_id})
      RETURNING *
    `;
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar fuga' });
  }
});

router.patch('/agua/:id/estado', verificarRol('agua', ['empleado', 'administrador']), async (req, res) => {
  const { estado } = req.body;
  try {
    const [act] = await sql`
      UPDATE reportes_fuga SET estado = ${estado} WHERE id = ${Number(req.params.id)} RETURNING *
    `;
    res.json(act);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar estado de fuga' });
  }
});

router.delete('/agua/:id', verificarRol('agua', ['administrador']), async (req, res) => {
  try {
    await sql`DELETE FROM reportes_fuga WHERE id = ${Number(req.params.id)}`;
    res.json({ mensaje: 'Reporte de fuga eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar fuga' });
  }
});

// ============================================================================
// 3. MÓDULO SAT PERÚ (reclamos_tributarios)
// ============================================================================
router.get('/sat', verificarRol('sat'), async (req, res) => {
  try {
    const filas = req.rolModulo === 'cliente'
      ? await sql`SELECT r.*, u.nombre AS contribuyente FROM reclamos_tributarios r JOIN usuarios u ON u.id = r.id_usuario WHERE r.id_usuario = ${req.usuarioId} ORDER BY r.creado_en DESC`
      : await sql`SELECT r.*, u.nombre AS contribuyente FROM reclamos_tributarios r JOIN usuarios u ON u.id = r.id_usuario ORDER BY r.creado_en DESC`;
    res.json(filas);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar reclamos' });
  }
});

router.post('/sat', verificarRol('sat', ['cliente', 'administrador']), async (req, res) => {
  const { predio, tributo, motivo, imagen_id = null } = req.body;
  try {
    const codigo = genCodigo('RT');
    const [nuevo] = await sql`
      INSERT INTO reclamos_tributarios (codigo, id_usuario, predio, tributo, motivo, estado, imagen_id)
      VALUES (${codigo}, ${req.usuarioId}, ${predio}, ${tributo}, ${motivo}, 'registrado', ${imagen_id})
      RETURNING *
    `;
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar reclamo tributario' });
  }
});

router.patch('/sat/:id/estado', verificarRol('sat', ['empleado', 'administrador']), async (req, res) => {
  const { estado } = req.body;
  try {
    const [act] = await sql`
      UPDATE reclamos_tributarios SET estado = ${estado} WHERE id = ${Number(req.params.id)} RETURNING *
    `;
    res.json(act);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar reclamo' });
  }
});

router.delete('/sat/:id', verificarRol('sat', ['administrador']), async (req, res) => {
  try {
    await sql`DELETE FROM reclamos_tributarios WHERE id = ${Number(req.params.id)}`;
    res.json({ mensaje: 'Reclamo eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar reclamo' });
  }
});

// ============================================================================
// 4. MÓDULO CRM ANDINO Y VISTA 360 (solicitudes_demo_crm + vista_360)
// ============================================================================
router.get('/crm/demos', verificarRol('crm'), async (req, res) => {
  try {
    const filas = req.rolModulo === 'cliente'
      ? await sql`SELECT * FROM solicitudes_demo_crm WHERE id_usuario = ${req.usuarioId} ORDER BY creado_en DESC`
      : await sql`SELECT * FROM solicitudes_demo_crm ORDER BY creado_en DESC`;
    res.json(filas);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar solicitudes de demo' });
  }
});

router.post('/crm/demos', verificarRol('crm', ['cliente', 'administrador']), async (req, res) => {
  const { empresa, contacto } = req.body;
  try {
    const codigo = genCodigo('DEM');
    const [nuevo] = await sql`
      INSERT INTO solicitudes_demo_crm (codigo, id_usuario, empresa, contacto, estado)
      VALUES (${codigo}, ${req.usuarioId}, ${empresa}, ${contacto}, 'registrado')
      RETURNING *
    `;
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: 'Error al solicitar demo CRM' });
  }
});

router.patch('/crm/demos/:id/estado', verificarRol('crm', ['empleado', 'administrador']), async (req, res) => {
  const { estado } = req.body;
  try {
    const [demo] = await sql`
      UPDATE solicitudes_demo_crm SET estado = ${estado} WHERE id = ${Number(req.params.id)} RETURNING *
    `;

    // RF-6.2: Al aprobar demo, asegura el rol cliente en el módulo crm
    if (demo && estado === 'aprobada') {
      await sql`
        INSERT INTO usuario_rol (id_usuario, modulo, rol)
        VALUES (${demo.id_usuario}, 'crm', 'cliente')
        ON CONFLICT (id_usuario, modulo) DO NOTHING
      `;
    }

    res.json(demo);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar solicitud de demo' });
  }
});

// Consulta consolidada Vista 360 para Admin CRM
router.get('/crm/vista-360', verificarRol('crm', ['administrador', 'empleado']), async (req, res) => {
  try {
    const registros = await sql`
      SELECT v.*, u.nombre AS empresa, u.correo
      FROM vista_360 v
      JOIN usuarios u ON u.id = v.id_usuario
      ORDER BY v.creado_en DESC
    `;
    res.json(registros);
  } catch (error) {
    console.error('Error en vista_360:', error);
    res.status(500).json({ error: 'Error al consultar la Vista 360' });
  }
});

// Seguimiento propio de reportes cruzados (para MetroBus / empresas)
router.get('/mis-reportes-cruzados', async (req, res) => {
  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(401).json({ error: 'Falta x-user-id' });
  try {
    const registros = await sql`
      SELECT * FROM vista_360 WHERE id_usuario = ${Number(userId)} ORDER BY creado_en DESC
    `;
    res.json(registros);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar mis reportes' });
  }
});

export default router;