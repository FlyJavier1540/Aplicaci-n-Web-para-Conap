// src/routes/seguimiento.routes.js
import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js'; 
import { 
    createSeguimiento,
    getSeguimientoByIncidente,
    getSeguimientoByHallazgo
} from '../controllers/seguimiento.controller.js'; 

const router = Router();
router.use(authenticateToken); 

// POST /api/seguimiento - Crear nueva entrada
router.post('/', createSeguimiento);

// GET /api/seguimiento/incidente/:id - Obtener por incidente
router.get('/incidente/:id', getSeguimientoByIncidente);

// GET /api/seguimiento/hallazgo/:id - Obtener por hallazgo
router.get('/hallazgo/:id', getSeguimientoByHallazgo);

export default router;