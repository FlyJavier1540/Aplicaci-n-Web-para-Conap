// src/routes/usuarios.routes.js
import { Router } from 'express';
import { getAllUsuarios } from '../controllers/usuarios.controller.js'; // ⬅️ Importa la función

const router = Router();

// Endpoint: GET /api/usuarios
router.get('/', getAllUsuarios);

// TODO: Implementar POST, PUT, DELETE en el siguiente paso

export default router;