// src/controllers/equipos.controller.js
import { pool } from '../../db.js';

/**
 * 1. Obtiene todos los equipos con su tipo, estado y usuario asignado (GET /api/equipos).
 */
export const getAllEquipos = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                e.equipo_id, e.equipo_nombre, e.equipo_codigo, e.marca, e.modelo, e.equipo_observaciones, e.created_at,
                e.equipo_tipo, e.equipo_estado, e.equipo_usuario,
                t.tipo_nombre,
                es.estado_nombre,
                u.usuario_nombre, u.usuario_apellido
            FROM equipo e
            LEFT JOIN tipo t ON e.equipo_tipo = t.tipo_id
            LEFT JOIN estado es ON e.equipo_estado = es.estado_id
            LEFT JOIN usuario u ON e.equipo_usuario = u.usuario_id
            ORDER BY e.created_at DESC
        `);

        // Estructurar los datos para que el frontend pueda mapearlos
        const equiposData = result.rows.map(e => ({
            equipo_id: e.equipo_id,
            equipo_nombre: e.equipo_nombre,
            equipo_codigo: e.equipo_codigo,
            marca: e.marca,
            modelo: e.modelo,
            equipo_observaciones: e.equipo_observaciones,
            created_at: e.created_at,
            
            // Datos para el mapper del frontend
            equipo_tipo: e.equipo_tipo,
            equipo_estado: e.equipo_estado,
            equipo_usuario: e.equipo_usuario,

            tipo: { tipo_nombre: e.tipo_nombre },
            estado: { estado_nombre: e.estado_nombre },
            usuario: { usuario_nombre: e.usuario_nombre, usuario_apellido: e.usuario_apellido }
        }));

        res.status(200).json({ success: true, data: equiposData });
    } catch (error) {
        console.error('Error al obtener equipos:', error);
        res.status(500).json({ success: false, message: 'Error interno al listar equipos' });
    }
};

/**
 * 2. Crea un nuevo equipo (POST /api/equipos).
 */
export const createEquipo = async (req, res) => {
    const { 
        equipo_nombre, 
        equipo_codigo, 
        equipo_tipo, 
        equipo_estado, 
        marca, 
        modelo, 
        equipo_usuario, 
        equipo_observaciones 
    } = req.body;

    try {
        const result = await pool.query(`
            INSERT INTO equipo (
                equipo_nombre, equipo_codigo, equipo_tipo, equipo_estado, marca, modelo, equipo_usuario, equipo_observaciones
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING equipo_id, equipo_nombre, equipo_codigo
        `, [
            equipo_nombre, equipo_codigo, equipo_tipo, equipo_estado, marca, modelo, equipo_usuario, equipo_observaciones
        ]);

        res.status(201).json({ 
            success: true, 
            data: result.rows[0], 
            message: 'Equipo creado exitosamente' 
        });

    } catch (error) {
        console.error('Error al crear equipo:', error);
        res.status(500).json({ success: false, message: 'Error interno al crear equipo' });
    }
};

/**
 * 3. Actualiza un equipo existente (PUT /api/equipos/:id).
 */
export const updateEquipo = async (req, res) => {
    const { id } = req.params;
    const { 
        equipo_nombre, 
        equipo_codigo, 
        equipo_tipo, 
        equipo_estado, 
        marca, 
        modelo, 
        equipo_usuario, 
        equipo_observaciones 
    } = req.body;

    try {
        const result = await pool.query(`
            UPDATE equipo
            SET
                equipo_nombre = $1, equipo_codigo = $2, equipo_tipo = $3, equipo_estado = $4, 
                marca = $5, modelo = $6, equipo_usuario = $7, equipo_observaciones = $8,
                updated_at = NOW()
            WHERE equipo_id = $9
            RETURNING equipo_id
        `, [
            equipo_nombre, equipo_codigo, equipo_tipo, equipo_estado, marca, modelo, equipo_usuario, equipo_observaciones,
            id
        ]);

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Equipo no encontrado' });
        }

        res.status(200).json({
            success: true,
            message: 'Equipo actualizado exitosamente',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Error al actualizar equipo:', error);
        res.status(500).json({ success: false, message: 'Error interno al actualizar equipo' });
    }
};

/**
 * 4. Cambia el estado de un equipo (DELETE /api/equipos/:id) - Eliminación lógica.
 * El frontend usa esta ruta para cambiar estados entre Operativo, En Reparación, Deshabilitado.
 */
export const updateEquipoEstado = async (req, res) => {
    const { id } = req.params;
    // Asumimos que el cuerpo de la petición contendrá el nuevo estado (ej: estado: 2 para Inactivo)
    const { equipo_estado } = req.body; 

    // Aquí solo se debe permitir cambiar el estado.
    if (!equipo_estado) {
        return res.status(400).json({ success: false, message: 'Falta el nuevo equipo_estado en el cuerpo de la petición' });
    }

    try {
        const result = await pool.query(`
            UPDATE equipo
            SET equipo_estado = $1, updated_at = NOW()
            WHERE equipo_id = $2
            RETURNING equipo_id
        `, [equipo_estado, id]); 

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Equipo no encontrado' });
        }

        res.status(200).json({
            success: true,
            message: 'Estado del equipo actualizado exitosamente'
        });

    } catch (error) {
        console.error('Error al actualizar estado del equipo:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error interno al actualizar estado del equipo' 
        });
    }
};