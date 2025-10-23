// src/routes/fotografia.routes.js
import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js'; 
import { 
    createFotografia,
    getFotosByHallazgo
} from '../controllers/fotografia.controller.js'; 

const router = Router();
router.use(authenticateToken); 

// POST /api/fotografia - Crear nueva entrada
router.post('/', createFotografia);

// GET /api/fotografia/hallazgo/:id - Obtener fotos de un hallazgo
router.get('/hallazgo/:id', getFotosByHallazgo);

export default router;