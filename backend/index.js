// index.js (Actualizado)
import express from 'express';
import cors from 'cors'; 
import { 
  testConnection 
} from './db.js';
import authRoutes from './src/routes/auth.routes.js';
import usuariosRoutes from './src/routes/usuarios.routes.js';
import areasProtegidasRoutes from './src/routes/areasProtegidas.routes.js';
import equiposRoutes from './src/routes/equipos.routes.js';
import actividadesRoutes from './src/routes/actividades.routes.js';
import incidentesRoutes from './src/routes/incidentes.routes.js';
import hallazgosRoutes from './src/routes/hallazgos.routes.js';
import catalogosRoutes from './src/routes/catalogos.routes.js';
import fotografiaRoutes from './src/routes/fotografia.routes.js';
import seguimientoRoutes from './src/routes/seguimiento.routes.js';

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
// CONEXIÓN DE RUTAS API (CRÍTICO)
// ===============================================
app.use('/api/auth', authRoutes); 
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/areas-protegidas', areasProtegidasRoutes);
app.use('/api/equipos', equiposRoutes);
app.use('/api/actividades', actividadesRoutes);
app.use('/api/incidentes', incidentesRoutes);
app.use('/api/hallazgo', hallazgosRoutes);
app.use('/api/catalogos', catalogosRoutes);
app.use('/api/fotografia', fotografiaRoutes);
app.use('/api/seguimiento', seguimientoRoutes);

app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'API de Guardarecursos funcionando',
    status: 'online'
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en http://localhost:${PORT}`);
});