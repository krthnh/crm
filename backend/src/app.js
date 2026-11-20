import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import storageRoutes from './routes/storage.routes.js';
import modulosRoutes from './routes/modulos.routes.js';

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true, servicio: 'API Grupo 6 · CRM Andino · Neon' });
});

app.use('/api/auth', authRoutes);
app.use('/api/imagenes', storageRoutes);
app.use('/api', modulosRoutes);

export default app;