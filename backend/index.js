// index.js (Actualizado)
import express from 'express';
import cors from 'cors'; 
import { 
  testConnection 
} from './db.js';
import authRoutes from './src/routes/auth.routes.js'; // ⬅️ Importa las nuevas rutas

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Configuración CORS
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Prueba de conexión
testConnection();

// ===============================================
// CONEXIÓN DE RUTAS API
// ===============================================
app.use('/api/auth', authRoutes); // ⬅️ Usa las rutas de autenticación

app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'API de Guardarecursos funcionando',
    status: 'online'
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor Express escuchando en http://localhost:${PORT}`);
  console.log(`Endpoint de Login: POST http://localhost:${PORT}/api/auth/login`);
});