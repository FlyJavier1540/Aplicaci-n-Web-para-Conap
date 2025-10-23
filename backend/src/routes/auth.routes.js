// src/routes/auth.routes.js
import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { login } from '../controllers/auth.controller.js';

const router = Router();

router.use(authenticateToken);

// Endpoint para el inicio de sesión
router.post('/login', login);

export default router;