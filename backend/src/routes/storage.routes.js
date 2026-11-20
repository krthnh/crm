import { Router } from 'express';
import multer from 'multer';
import { sql } from '../config/db.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 } // Máximo 2 MB por imagen
});

// POST /api/imagenes -> Guarda la imagen en Neon
router.post('/', upload.single('imagen'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se envió ningún archivo de imagen' });
    }

    const userId = req.headers['x-user-id'] ? Number(req.headers['x-user-id']) : null;
    const base64 = req.file.buffer.toString('base64');

    const resultado = await sql`
      INSERT INTO imagenes_storage (nombre_archivo, mime_type, datos_base64, subido_por)
      VALUES (${req.file.originalname}, ${req.file.mimetype}, ${base64}, ${userId})
      RETURNING id, nombre_archivo, mime_type, creado_en
    `;

    const img = resultado[0];
    res.status(201).json({
      mensaje: 'Imagen almacenada en Neon',
      imagen: {
        ...img,
        url: `/api/imagenes/${img.id}`
      }
    });
  } catch (error) {
    console.error('Error al subir imagen a Neon:', error);
    res.status(500).json({ error: 'Error al guardar la imagen en Neon' });
  }
});

// GET /api/imagenes/:id -> Sirve la imagen directamente desde Neon
router.get('/:id', async (req, res) => {
  try {
    const filas = await sql`
      SELECT mime_type, datos_base64
      FROM imagenes_storage
      WHERE id = ${Number(req.params.id)}
    `;

    if (filas.length === 0) {
      return res.status(404).json({ error: 'Imagen no encontrada' });
    }

    const { mime_type, datos_base64 } = filas[0];
    const buffer = Buffer.from(datos_base64, 'base64');
    res.set('Content-Type', mime_type);
    res.send(buffer);
  } catch (error) {
    console.error('Error al leer imagen de Neon:', error);
    res.status(500).json({ error: 'Error al obtener la imagen' });
  }
});

export default router;