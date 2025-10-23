// src/routes/auth.routes.js

import { Router } from 'express';
import { login } from '../controllers/auth.controller.js';

const router = Router();

// Asegúrate de que SOLO esta ruta exista en este archivo.
router.post('/login', login); 

export default router;