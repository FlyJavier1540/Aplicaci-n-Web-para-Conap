// src/controllers/auth.controller.js
import { pool } from '../../db.js';
import jwt from 'jsonwebtoken';
import { 
    ROL_MAP, 
    ESTADO_MAP 
} from '../../utils/constants.js'; // Asumimos un archivo de constantes

const JWT_SECRET = process.env.JWT_SECRET;

// Lógica de autenticación
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Buscar usuario por correo y unir con tablas de catálogo
        const result = await pool.query(`
            SELECT 
                u.*,
                r.rol_nombre,
                e.estado_nombre,
                a.area_nombre
            FROM usuario u
            LEFT JOIN usuario_rol r ON u.usuario_rol = r.rol_id
            LEFT JOIN estado e ON u.usuario_estado = e.estado_id
            LEFT JOIN area_protegida a ON u.usuario_area = a.area_id
            WHERE u.usuario_correo = $1
        `, [email]);

        const usuario = result.rows[0];

        // 2. Verificar existencia y contraseña
        if (!usuario || usuario.usuario_contrasenia !== password) {
            // ⚠️ En producción, usa: !(await bcrypt.compare(password, usuario.usuario_contrasenia))
            return res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas o usuario inactivo'
            });
        }
        
        // 3. Generar token de sesión (válido por 24 horas)
        const token = jwt.sign(
            { 
                id: usuario.usuario_id, 
                rol: usuario.rol_nombre 
            }, 
            JWT_SECRET, 
            { expiresIn: '24h' }
        );

        // 4. Respuesta exitosa (datos en formato DB para el mapper del frontend)
        res.status(200).json({
            success: true,
            token,
            // Los campos que el frontend necesita para el mapeo
            usuario: {
                usuario_id: usuario.usuario_id,
                usuario_nombre: usuario.usuario_nombre,
                usuario_apellido: usuario.usuario_apellido,
                usuario_correo: usuario.usuario_correo,
                usuario_telefono: usuario.usuario_telefono,
                usuario_rol: usuario.usuario_rol,
                usuario_area: usuario.usuario_area,
                usuario_estado: usuario.usuario_estado,
                created_at: usuario.created_at
            },
            rol: { rol_nombre: usuario.rol_nombre },
            estado: { estado_nombre: usuario.estado_nombre },
            area: usuario.area_nombre ? { area_nombre: usuario.area_nombre } : null
        });

    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor.' 
        });
    }
};