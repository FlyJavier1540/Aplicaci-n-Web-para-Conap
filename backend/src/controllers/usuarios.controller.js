// src/controllers/usuarios.controller.js
import { pool } from '../../db.js';
import bcrypt from 'bcrypt'; // ⬅️ NUEVA IMPORTACIÓN DE SEGURIDAD

// Importamos la función de listar que ya creamos
export const getAllUsuarios = async (req, res) => {
    // ... (Tu código de getAllUsuarios permanece aquí) ...
    try {
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

        const usuariosData = result.rows.map(u => ({
            usuario_id: u.usuario_id,
            usuario_nombre: u.usuario_nombre,
            usuario_apellido: u.usuario_apellido,
            usuario_correo: u.usuario_correo,
            usuario_telefono: u.usuario_telefono,
            created_at: u.created_at,
            
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

/**
 * Crea un nuevo usuario y hashea la contraseña.
 */
export const createUsuario = async (req, res) => {
    const { 
        usuario_nombre, 
        usuario_apellido, 
        usuario_dpi,
        usuario_correo, 
        usuario_telefono,
        usuario_contrasenia, // Contraseña en texto plano
        usuario_rol,
        usuario_area,
        usuario_estado
    } = req.body;

    try {
        // 1. Crear el hash de la contraseña (CRÍTICO para seguridad)
        const hashedPassword = await bcrypt.hash(usuario_contrasenia, 10);

        // 2. Ejecutar la inserción en la base de datos (SQL LIMPIO)
        const result = await pool.query(`
            INSERT INTO usuario (
                usuario_nombre,
                usuario_apellido,
                usuario_dpi,
                usuario_correo,
                usuario_telefono,
                usuario_contrasenia, 
                usuario_rol,
                usuario_area,
                usuario_estado
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING usuario_id, usuario_nombre, usuario_apellido, usuario_correo 
        `, [
            usuario_nombre,
            usuario_apellido,
            usuario_dpi,
            usuario_correo,
            usuario_telefono,
            hashedPassword, // ⬅️ Este valor se pasa aquí
            usuario_rol,
            usuario_area,
            usuario_estado
        ]);

        res.status(201).json({
            success: true,
            message: 'Usuario creado exitosamente',
            data: result.rows[0]
        });

    } catch (error) {
        // ... (Manejo de errores)
        console.error('Error al crear usuario:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error interno al crear usuario. (Verifique datos y catálogos)'
        });
    }
};