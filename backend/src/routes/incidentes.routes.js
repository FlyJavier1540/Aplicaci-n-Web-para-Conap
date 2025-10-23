// src/routes/incidentes.routes.js
import { Router } from 'express';
import { 
    getAllIncidentes,
    createIncidente,
    updateIncidente,
    deleteIncidente
} from '../controllers/incidentes.controller.js'; 

const router = Router();

// GET /api/incidentes - Listar todos
router.get('/', getAllIncidentes);

// POST /api/incidentes - Crear nuevo incidente
router.post('/', createIncidente);

// PUT /api/incidentes/:id - Actualizar incidente
router.put('/:id', updateIncidente);

// DELETE /api/incidentes/:id - Cerrar incidente (Eliminación lógica)
router.delete('/:id', deleteIncidente); 

export default router;