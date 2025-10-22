// src/routes/usuarios.routes.js (Actualizado)
import { Router } from 'express';
import { 
    getAllUsuarios,
    createUsuario,
    updateUsuario, // ⬅️ NUEVA
    deleteUsuario  // ⬅️ NUEVA
} from '../controllers/usuarios.controller.js'; 

const router = Router();

// Endpoint: GET /api/usuarios (Listar todos)
router.get('/', getAllUsuarios);

// Endpoint: POST /api/usuarios (Crear nuevo usuario)
router.post('/', createUsuario);

// Endpoint: PUT /api/usuarios/:id (Actualizar)
router.put('/:id', updateUsuario); // ⬅️ RUTA PUT

// Endpoint: DELETE /api/usuarios/:id (Desactivar/Eliminación lógica)
router.delete('/:id', deleteUsuario); // ⬅️ RUTA DELETE

export default router;