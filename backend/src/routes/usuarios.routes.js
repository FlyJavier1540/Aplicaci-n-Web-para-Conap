// src/routes/usuarios.routes.js
import { Router } from 'express';
import { 
    getAllUsuarios,
    createUsuario 
} from '../controllers/usuarios.controller.js'; // ⬅️ Importa la nueva función

const router = Router();

// Endpoint: GET /api/usuarios (Listar todos)
router.get('/', getAllUsuarios);

// Endpoint: POST /api/usuarios (Crear nuevo usuario)
router.post('/', createUsuario); // ⬅️ NUEVA RUTA CONECTADA

export default router;