// src/routes/areasProtegidas.routes.js
import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { 
    getAllAreasProtegidas,
    createAreaProtegida,
    updateAreaProtegida,
    deleteAreaProtegida
} from '../controllers/areasProtegidas.controller.js'; 

const router = Router();

router.use(authenticateToken);

// GET /api/areas-protegidas - Listar todas
router.get('/', getAllAreasProtegidas);

// POST /api/areas-protegidas - Crear nueva área
router.post('/', createAreaProtegida);

// PUT /api/areas-protegidas/:id - Actualizar área
router.put('/:id', updateAreaProtegida);

// DELETE /api/areas-protegidas/:id - Desactivar área (Eliminación lógica)
router.delete('/:id', deleteAreaProtegida); 

export default router;