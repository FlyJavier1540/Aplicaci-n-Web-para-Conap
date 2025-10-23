// src/routes/catalogos.routes.js
import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { 
    getRoles,
    getEstados,
    getCategorias,
    getTipos
} from '../controllers/catalogos.controller.js'; 

const router = Router();

router.use(authenticateToken);

// Endpoint: /api/catalogos/roles
router.get('/roles', getRoles);

// Endpoint: /api/catalogos/estados
router.get('/estados', getEstados);

// Endpoint: /api/catalogos/categorias
router.get('/categorias', getCategorias);

// Endpoint: /api/catalogos/tipos
router.get('/tipos', getTipos);

export default router;