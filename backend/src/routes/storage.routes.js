import express from 'express';
import multer from 'multer';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { sql } from '../config/db.js';
import { s3Client, BUCKET_NAME } from '../config/storage.js';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// POST /api/imagenes - Subir archivo al bucket S3 de Neon y registrar ID en PostgreSQL
router.post('/', upload.single('imagen'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se envió ninguna imagen' });
    }

    const key = `${Date.now()}-${req.file.originalname.replace(/\s+/g, '_')}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      })
    );

    const [registro] = await sql`
      INSERT INTO imagenes_storage (nombre_archivo, mime_type, datos_base64)
      VALUES (${key}, ${req.file.mimetype}, ${'S3:' + key})
      RETURNING id, nombre_archivo, mime_type, creado_en;
    `;

    res.status(201).json({
      mensaje: 'Imagen almacenada en el bucket de Neon',
      imagen: registro,
    });
  } catch (error) {
    console.error('Error al subir imagen al bucket S3:', error);
    res.status(500).json({ error: 'Error al subir la imagen al bucket' });
  }
});

// GET /api/imagenes/:id - Descargar imagen desde el bucket S3 de Neon
router.get('/:id', async (req, res) => {
  try {
    const [img] = await sql`
      SELECT nombre_archivo, mime_type
      FROM imagenes_storage
      WHERE id = ${req.params.id};
    `;

    if (!img) {
      return res.status(404).json({ error: 'Imagen no encontrada' });
    }

    const respuestaS3 = await s3Client.send(
      new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: img.nombre_archivo,
      })
    );

    res.setHeader('Content-Type', img.mime_type);
    respuestaS3.Body.pipe(res);
  } catch (error) {
    console.error('Error al obtener imagen desde el bucket S3:', error);
    res.status(500).json({ error: 'Error al recuperar la imagen del bucket' });
  }
});

export default router;