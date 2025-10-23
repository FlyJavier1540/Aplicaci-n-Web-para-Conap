// src/controllers/seguimiento.controller.js
import { pool } from '../../db.js';

/**
 * 1. Crea una nueva entrada de seguimiento para un incidente o hallazgo (POST /api/seguimiento).
 */
export const createSeguimiento = async (req, res) => {
    const {
        seg_nombre,
        seg_incidente, // Opcional
        seg_hallazgo,  // Opcional
        seg_descripcion,
        seg_fecha,
        seg_usuario
    } = req.body;

    // Validación básica: Debe estar vinculado a algo
    if (!seg_incidente && !seg_hallazgo) {
        return res.status(400).json({ 
            success: false, 
            message: 'El seguimiento debe estar vinculado a un incidente o un hallazgo.' 
        });
    }

    try {
        const result = await pool.query(
            `INSERT INTO seguimiento (
                seg_nombre, seg_incidente, seg_hallazgo, seg_descripcion, seg_fecha, seg_usuario
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING seg_id, seg_nombre, seg_fecha`,
            [
                seg_nombre, seg_incidente, seg_hallazgo, seg_descripcion, seg_fecha, seg_usuario
            ]
        );

        res.status(201).json({ 
            success: true, 
            data: result.rows[0], 
            message: 'Seguimiento registrado exitosamente.' 
        });

    } catch (error) {
        console.error('Error al crear seguimiento:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error interno al registrar seguimiento.' 
        });
    }
};

/**
 * 2. Obtiene el seguimiento por ID de Incidente (GET /api/seguimiento/incidente/:id).
 */
export const getSeguimientoByIncidente = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT seg.*, u.usuario_nombre, u.usuario_apellido
            FROM seguimiento seg
            LEFT JOIN usuario u ON seg.seg_usuario = u.usuario_id
            WHERE seg_incidente = $1
            ORDER BY seg_fecha DESC
        `, [id]);
        
        res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Error al obtener seguimiento de incidente:', error);
        res.status(500).json({ success: false, message: 'Error interno.' });
    }
};

/**
 * 3. Obtiene el seguimiento por ID de Hallazgo (GET /api/seguimiento/hallazgo/:id).
 */
export const getSeguimientoByHallazgo = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT seg.*, u.usuario_nombre, u.usuario_apellido
            FROM seguimiento seg
            LEFT JOIN usuario u ON seg.seg_usuario = u.usuario_id
            WHERE seg_hallazgo = $1
            ORDER BY seg_fecha DESC
        `, [id]);
        
        res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error interno.' });
    }
};