import { sql } from '../config/db.js';

export const verificarRol = (modulo, rolesPermitidos = []) => {
  return async (req, res, next) => {
    try {
      const userId = req.headers['x-user-id'];
      if (!userId) {
        return res.status(401).json({ error: 'Sesión no iniciada (falta x-user-id)' });
      }

      const filas = await sql`
        SELECT rol FROM usuario_rol
        WHERE id_usuario = ${Number(userId)} AND modulo = ${modulo}
      `;

      if (filas.length === 0) {
        return res.status(403).json({ error: `Sin acceso al módulo ${modulo}` });
      }

      const rolActual = filas[0].rol;
      if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(rolActual)) {
        return res.status(403).json({ error: `Rol '${rolActual}' no autorizado para esta acción` });
      }

      req.usuarioId = Number(userId);
      req.rolModulo = rolActual;
      next();
    } catch (error) {
      console.error('Error en verificarRol:', error);
      res.status(500).json({ error: 'Error al validar permisos en la base de datos' });
    }
  };
};