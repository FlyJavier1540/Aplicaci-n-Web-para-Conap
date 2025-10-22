// src/controllers/usuarios.controller.js
import { pool } from '../../db.js';
// No necesitamos BCrypt en la función de listar

/**
 * Obtiene todos los usuarios del sistema con sus roles, estados y áreas asignadas.
 */
export const getAllUsuarios = async (req, res) => {
    try {
        // Consulta SQL para obtener todos los usuarios y sus datos de catálogo
        const result = await pool.query(`
            SELECT 
                u.usuario_id, u.usuario_nombre, u.usuario_apellido, 
                u.usuario_correo, u.usuario_telefono, u.usuario_rol, 
                u.usuario_area, u.usuario_estado, u.created_at,
                r.rol_nombre,
                e.estado_nombre,
                a.area_nombre
            FROM usuario u
            LEFT JOIN usuario_rol r ON u.usuario_rol = r.rol_id
            LEFT JOIN estado e ON u.usuario_estado = e.estado_id
            LEFT JOIN area_protegida a ON u.usuario_area = a.area_id
            ORDER BY u.usuario_apellido, u.usuario_nombre
        `);

        // Estructura la respuesta para que el frontend la reciba en formato de lista
        const usuariosData = result.rows.map(u => ({
            usuario_id: u.usuario_id,
            usuario_nombre: u.usuario_nombre,
            usuario_apellido: u.usuario_apellido,
            usuario_correo: u.usuario_correo,
            usuario_telefono: u.usuario_telefono,
            created_at: u.created_at,
            
            // Campos FK que el frontend necesita para el mapeo
            usuario_rol: u.usuario_rol,
            usuario_area: u.usuario_area,
            usuario_estado: u.usuario_estado,
            
            rol: { rol_nombre: u.rol_nombre },
            estado: { estado_nombre: u.estado_nombre },
            area: u.area_nombre ? { area_nombre: u.area_nombre } : null
        }));

        res.status(200).json({
            success: true,
            data: usuariosData
        });

    } catch (error) {
        console.error('Error al obtener todos los usuarios:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error interno al listar usuarios' 
        });
    }
};