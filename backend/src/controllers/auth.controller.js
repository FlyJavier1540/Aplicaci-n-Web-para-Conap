// src/controllers/auth.controller.js (Modificación CRÍTICA en la función login)

import { pool } from '../../db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; // ⬅️ Asegúrate de tener esta importación

// ...

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // ... (Tu consulta SQL permanece igual) ...

        const usuario = result.rows[0];

        // 1. Verificar existencia
        if (!usuario) {
            return res.status(401).json({ success: false, message: 'Credenciales incorrectas o usuario inactivo' });
        }

        // 2. ✅ AHORA: Verificar contraseña hasheada con BCrypt
        const validPassword = await bcrypt.compare(password, usuario.usuario_contrasenia); 

        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas o usuario inactivo'
            });
        }
        
        // ... (El resto del código de generación de token permanece igual) ...

    } catch (error) {
        // ...
    }
};