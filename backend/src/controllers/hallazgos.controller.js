// src/controllers/hallazgos.controller.js
import { pool } from '../../db.js';
import { 
    createUbicacionDB, 
    updateUbicacionDB 
} from '../utils/db.utils.js'; // Reusa las utilidades de ubicación

/**
 * 1. Obtiene todos los hallazgos con sus datos de catálogo (GET /api/hallazgos).
 */
export const getAllHallazgos = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                h.hallazgos_id, h.hallazgo_titulo, h.hallazgo_descripcion, h.created_at,
                h.hallazgo_tipo, h.hallazgo_categoria, h.hallazgo_estado, h.hallazgo_actividad,
                t.tipo_nombre,
                c.categoria_nombre AS gravedad_nombre,
                es.estado_nombre,
                ub.ubicacion_latitud, ub.ubicacion_longitud
            FROM hallazgo h
            LEFT JOIN tipo t ON h.hallazgo_tipo = t.tipo_id
            LEFT JOIN categoria c ON h.hallazgo_categoria = c.categoria_id
            LEFT JOIN estado es ON h.hallazgo_estado = es.estado_id
            LEFT JOIN ubicacion ub ON h.hallazgo_ubicacion = ub.ubicacion_id
            ORDER BY h.created_at DESC
        `);

        // Estructurar los datos para que el frontend pueda mapearlos
        const hallazgosData = result.rows.map(h => ({
            hallazgos_id: h.hallazgos_id,
            hallazgo_titulo: h.hallazgo_titulo,
            hallazgo_descripcion: h.hallazgo_descripcion,
            created_at: h.created_at,
            
            // IDs
            hallazgo_tipo: h.hallazgo_tipo,
            hallazgo_categoria: h.hallazgo_categoria,
            hallazgo_estado: h.hallazgo_estado,
            hallazgo_actividad: h.hallazgo_actividad, // Puede ser NULL

            // Nombres de catálogo para el mapper
            tipo: { tipo_nombre: h.tipo_nombre },
            categoria: { categoria_nombre: h.gravedad_nombre },
            estado: { estado_nombre: h.estado_nombre },
            ubicacion: { ubicacion_latitud: h.ubicacion_latitud, ubicacion_longitud: h.ubicacion_longitud }
        }));

        res.status(200).json({ success: true, data: hallazgosData });
    } catch (error) {
        console.error('Error al obtener hallazgos:', error);
        res.status(500).json({ success: false, message: 'Error interno al listar hallazgos' });
    }
};

/**
 * 2. Crea un nuevo hallazgo (POST /api/hallazgos).
 */
export const createHallazgo = async (req, res) => {
    const { 
        hallazgo_titulo, 
        hallazgo_tipo, 
        hallazgo_categoria, 
        hallazgo_descripcion, 
        hallazgo_estado,
        hallazgo_actividad, // Puede ser NULL
        coordenadas // { lat, lng }
    } = req.body;

    try {
        await pool.query('BEGIN'); // ⬅️ INICIA TRANSACCIÓN

        // 1. Insertar en Ubicacion y obtener el ID
        const ubicacionId = await createUbicacionDB({
            latitud: coordenadas.lat,
            longitud: coordenadas.lng
        });

        // 2. Insertar en hallazgo
        const hallazgoResult = await pool.query(
            `INSERT INTO hallazgo (
                hallazgo_titulo, hallazgo_tipo, hallazgo_categoria, hallazgo_descripcion, 
                hallazgo_estado, hallazgo_ubicacion, hallazgo_actividad
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING hallazgos_id, hallazgo_titulo, created_at`,
            [
                hallazgo_titulo, hallazgo_tipo, hallazgo_categoria, hallazgo_descripcion, 
                hallazgo_estado, ubicacionId, hallazgo_actividad
            ]
        );

        await pool.query('COMMIT'); // ⬅️ CONFIRMA TRANSACCIÓN

        res.status(201).json({ 
            success: true, 
            data: hallazgoResult.rows[0], 
            message: 'Hallazgo creado exitosamente' 
        });

    } catch (error) {
        await pool.query('ROLLBACK'); // ⬅️ REVierte si falla
        console.error('Error en transacción de creación de hallazgo:', error);
        res.status(500).json({ success: false, message: 'Error interno al crear hallazgo' });
    }
};

/**
 * 3. Actualiza un hallazgo existente (PUT /api/hallazgos/:id).
 */
export const updateHallazgo = async (req, res) => {
    const { id } = req.params;
    const { 
        hallazgo_titulo, 
        hallazgo_tipo, 
        hallazgo_categoria, 
        hallazgo_descripcion, 
        hallazgo_estado,
        hallazgo_actividad,
        hallazgo_ubicacion, // ID de ubicación
        coordenadas // { lat, lng }
    } = req.body;

    try {
        await pool.query('BEGIN'); // ⬅️ INICIA TRANSACCIÓN

        // 1. Actualizar la ubicación existente
        await updateUbicacionDB(hallazgo_ubicacion, {
            latitud: coordenadas.lat,
            longitud: coordenadas.lng
        });

        // 2. Actualizar el hallazgo
        const hallazgoResult = await pool.query(
            `UPDATE hallazgo
            SET
                hallazgo_titulo = $1, hallazgo_tipo = $2, hallazgo_categoria = $3, 
                hallazgo_descripcion = $4, hallazgo_estado = $5, hallazgo_actividad = $6,
                updated_at = NOW()
            WHERE hallazgos_id = $7
            RETURNING hallazgos_id`,
            [
                hallazgo_titulo, hallazgo_tipo, hallazgo_categoria, hallazgo_descripcion, 
                hallazgo_estado, hallazgo_actividad, id
            ]
        );

        await pool.query('COMMIT'); // ⬅️ CONFIRMA TRANSACCIÓN

        if (hallazgoResult.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Hallazgo no encontrado' });
        }

        res.status(200).json({
            success: true,
            message: 'Hallazgo actualizado exitosamente',
            data: hallazgoResult.rows[0]
        });

    } catch (error) {
        await pool.query('ROLLBACK'); // ⬅️ REVierte si falla
        console.error('Error en transacción de actualización de hallazgo:', error);
        res.status(500).json({ success: false, message: 'Error interno al actualizar hallazgo' });
    }
};

/**
 * 4. Elimina (lógica) un hallazgo (DELETE /api/hallazgos/:id).
 * Lo marcamos como Cerrado (ID 8)
 */
export const deleteHallazgo = async (req, res) => {
    const { id } = req.params;
    const CERRADO_ID = 8; // ID del estado 'Cerrado'

    try {
        const result = await pool.query(`
            UPDATE hallazgo
            SET hallazgo_estado = $1, updated_at = NOW()
            WHERE hallazgos_id = $2
            RETURNING hallazgos_id
        `, [CERRADO_ID, id]); 

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Hallazgo no encontrado' });
        }

        res.status(200).json({
            success: true,
            message: 'Hallazgo marcado como Cerrado exitosamente (Eliminación lógica)'
        });

    } catch (error) {
        console.error('Error al cerrar hallazgo:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error interno al cerrar hallazgo' 
        });
    }
};