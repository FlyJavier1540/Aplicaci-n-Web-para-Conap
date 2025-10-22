// src/routes/auth.routes.js
import { Router } from 'express';
import { login } from '../controllers/auth.controller.js';

const router = Router();

// Endpoint para el inicio de sesión
router.post('/login', login);

export default router;