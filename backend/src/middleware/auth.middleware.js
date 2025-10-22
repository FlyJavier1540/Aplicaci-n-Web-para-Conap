// src/middleware/auth.middleware.js
import jwt from 'jsonwebtoken';

// Secreto usado para firmar y verificar tokens
const JWT_SECRET = process.env.JWT_SECRET;

// Este middleware se usará para proteger otras rutas (no el login)
export const authenticateToken = (req, res, next) => {
    // Implementaremos la lógica de verificación aquí
    // ...
    next();
};