// src/routes/actividades.routes.js
import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { 
    getAllActividades,
    createActividad,
    updateActividad,
    deleteActividad
} from '../controllers/actividades.controller.js'; 

const router = Router();

router.use(authenticateToken);

// GET /api/actividades - Listar todas
router.get('/', getAllActividades);

// POST /api/actividades - Crear nueva actividad
router.post('/', createActividad);

// PUT /api/actividades/:id - Actualizar actividad
router.put('/:id', updateActividad);

// DELETE /api/actividades/:id - Cancelar actividad (Eliminación lógica)
router.delete('/:id', deleteActividad); 

export default router;