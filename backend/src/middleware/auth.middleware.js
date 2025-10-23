// src/middleware/auth.middleware.js
import jwt from 'jsonwebtoken';

// ⚠️ Asegúrate de que esta variable esté definida en tu archivo .env
const JWT_SECRET = process.env.JWT_SECRET; 

/**
 * Middleware para verificar la validez del token JWT y autenticar al usuario.
 * Se aplica a todas las rutas protegidas (CRUD, etc.).
 */
export const authenticateToken = (req, res, next) => {
    // 1. Obtener el token del encabezado (Header: Authorization: Bearer <token>)
    const authHeader = req.headers.authorization;
    // El token viene como "Bearer <token>"
    const token = authHeader && authHeader.split(' ')[1]; 

    if (token == null) {
        // 401: No autorizado (token no presente)
        return res.status(401).json({ success: false, message: 'Acceso denegado: Token no proporcionado.' });
    }

    // 2. Verificar y decodificar el token
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            // 403: Prohibido (token inválido o expirado)
            return res.status(403).json({ success: false, message: 'Acceso denegado: Token inválido o expirado.' });
        }
        
        // 3. Almacenar la información del usuario decodificada (id, rol)
        req.user = user; 
        
        // 4. Continuar con la siguiente función (el controlador)
        next();
    });
};