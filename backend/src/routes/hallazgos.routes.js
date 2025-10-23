// src/routes/hallazgos.routes.js
import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { 
    getAllHallazgos,
    createHallazgo,
    updateHallazgo,
    deleteHallazgo
} from '../controllers/hallazgos.controller.js'; 

const router = Router();

router.use(authenticateToken);

// GET /api/hallazgos - Listar todos
router.get('/', getAllHallazgos);

// POST /api/hallazgos - Crear nuevo hallazgo
router.post('/', createHallazgo);

// PUT /api/hallazgos/:id - Actualizar hallazgo
router.put('/:id', updateHallazgo);

// DELETE /api/hallazgos/:id - Cerrar hallazgo (Eliminación lógica)
router.delete('/:id', deleteHallazgo); 

export default router;