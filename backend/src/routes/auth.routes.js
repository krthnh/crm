import { Router } from 'express';
import { sql } from '../config/db.js';


const router = Router();


// POST /api/auth/login -> Consulta directa a Neon
router.post('/login', async (req, res) => {
  const { correo, contrasena } = req.body;


  if (!correo || !contrasena) {
    return res.status(400).json({ error: 'Ingrese correo y contraseña' });
  }


  try {
    const usuarios = await sql`
      SELECT id, nombre, correo
      FROM usuarios
      WHERE LOWER(correo) = LOWER(${correo.trim()})
        AND contrasena = ${contrasena}
    `;


    if (usuarios.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }


    const usuario = usuarios[0];


    const roles = await sql`
      SELECT modulo, rol
      FROM usuario_rol
      WHERE id_usuario = ${usuario.id}
      ORDER BY modulo
    `;


    res.json({
      mensaje: 'Inicio de sesión exitoso',
      usuario,
      roles
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al consultar la base de datos Neon' });
  }
});


// POST /api/auth/register -> Registro de nuevo cliente
router.post('/register', async (req, res) => {
  const { nombre, correo, contrasena, modulo = 'metrobus' } = req.body;


  if (!nombre || !correo || !contrasena) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }


  // Los clientes nuevos solo pueden registrarse en estos módulos (CRM es para personal)
  if (!['metrobus', 'agua', 'sat'].includes(modulo)) {
    return res.status(400).json({ error: 'Módulo no válido' });
  }


  if (contrasena.length < 4) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 4 caracteres' });
  }


  try {
    const nuevo = await sql`
      INSERT INTO usuarios (nombre, correo, contrasena)
      VALUES (${nombre.trim()}, ${correo.trim().toLowerCase()}, ${contrasena})
      RETURNING id, nombre, correo
    `;


    const usuario = nuevo[0];


    await sql`
      INSERT INTO usuario_rol (id_usuario, modulo, rol)
      VALUES (${usuario.id}, ${modulo}, 'cliente')
    `;


    res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      usuario,
      roles: [{ modulo, rol: 'cliente' }]
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'El correo ya está registrado' });
    }
    console.error('Error en register:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});


export default router;
