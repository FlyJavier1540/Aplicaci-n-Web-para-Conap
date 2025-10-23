// src/routes/equipos.routes.js
import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { 
    getAllEquipos,
    createEquipo,
    updateEquipo,
    updateEquipoEstado // Usamos esta función para simular DELETE/cambio de estado
} from '../controllers/equipos.controller.js'; 

const router = Router();

router.use(authenticateToken);

// GET /api/equipos - Listar todos
router.get('/', getAllEquipos);

// POST /api/equipos - Crear nuevo equipo
router.post('/', createEquipo);

// PUT /api/equipos/:id - Actualizar equipo
router.put('/:id', updateEquipo);

// DELETE /api/equipos/:id - Actualizar estado (simulación de eliminación lógica)
// El frontend espera esta ruta para cambiar el estado de un equipo a "Deshabilitado"
router.delete('/:id', updateEquipoEstado); 

export default router;