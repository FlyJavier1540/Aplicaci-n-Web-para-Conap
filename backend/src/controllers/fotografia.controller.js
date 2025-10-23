// src/controllers/fotografia.controller.js
import { pool } from '../../db.js';
import { 
    createUbicacionDB 
} from '../utils/db.utils.js';

/**
 * 1. Registra una nueva fotografía/evidencia (POST /api/fotografia).
 */
export const createFotografia = async (req, res) => {
    const {
        foto_tipo,
        foto_descripcion,
        foto_ruta, // URL o Path del archivo subido
        foto_actividad, // Opcional
        foto_hallazgo,  // Opcional
        coordenadas // { lat, lng }
    } = req.body;

    try {
        await pool.query('BEGIN'); // ⬅️ INICIA TRANSACCIÓN

        // 1. Insertar en Ubicacion
        const ubicacionId = await createUbicacionDB({
            latitud: coordenadas.lat,
            longitud: coordenadas.lng
        });

        // 2. Insertar en fotografia
        const result = await pool.query(
            `INSERT INTO fotografia (
                foto_tipo, foto_descripcion, foto_ubicacion, foto_fecha, foto_ruta, foto_actividad, foto_hallazgo
            ) VALUES ($1, $2, $3, NOW(), $4, $5, $6)
            RETURNING foto_id, foto_ruta, foto_descripcion`,
            [
                foto_tipo, foto_descripcion, ubicacionId, foto_ruta, foto_actividad, foto_hallazgo
            ]
        );

        await pool.query('COMMIT'); // ⬅️ CONFIRMA TRANSACCIÓN

        res.status(201).json({ 
            success: true, 
            data: result.rows[0], 
            message: 'Fotografía/Evidencia registrada exitosamente.' 
        });

    } catch (error) {
        await pool.query('ROLLBACK'); // ⬅️ REVierte si falla
        console.error('Error al registrar fotografía:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error interno al registrar fotografía.' 
        });
    }
};

/**
 * 2. Obtiene las fotografías vinculadas a un Hallazgo (GET /api/fotografia/hallazgo/:id).
 */
export const getFotosByHallazgo = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT * FROM fotografia WHERE foto_hallazgo = $1
            ORDER BY foto_fecha DESC
        `, [id]);
        
        res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error interno.' });
    }
};
// Nota: Puedes agregar más funciones para GET por actividad, etc.