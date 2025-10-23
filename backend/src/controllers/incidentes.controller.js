// src/controllers/incidentes.controller.js
import { pool } from '../../db.js';
import { 
    createUbicacionDB, 
    updateUbicacionDB 
} from '../utils/db.utils.js';

/**
 * 1. Obtiene todos los incidentes con sus datos de catálogo (GET /api/incidentes).
 */
export const getAllIncidentes = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                i.inc_id, i.inc_nombre, i.inc_descripcion, i.inc_involucrados, i.observaciones, i.created_at,
                i.inc_tipo, i.inc_categoria, i.inc_usuario, i.inc_ubicacion, i.inc_estado,
                t.tipo_nombre,
                c.categoria_nombre AS gravedad_nombre,
                u.usuario_nombre, u.usuario_apellido,
                es.estado_nombre,
                ub.ubicacion_latitud, ub.ubicacion_longitud
            FROM incidentes i
            LEFT JOIN tipo t ON i.inc_tipo = t.tipo_id
            LEFT JOIN categoria c ON i.inc_categoria = c.categoria_id
            LEFT JOIN usuario u ON i.inc_usuario = u.usuario_id
            LEFT JOIN estado es ON i.inc_estado = es.estado_id
            LEFT JOIN ubicacion ub ON i.inc_ubicacion = ub.ubicacion_id
            ORDER BY i.created_at DESC
        `);

        // Estructurar los datos para que el frontend pueda mapearlos
        const incidentesData = result.rows.map(i => ({
            inc_id: i.inc_id,
            inc_nombre: i.inc_nombre,
            inc_descripcion: i.inc_descripcion,
            inc_involucrados: i.inc_involucrados,
            observaciones: i.observaciones,
            created_at: i.created_at,
            
            // IDs
            inc_tipo: i.inc_tipo,
            inc_categoria: i.inc_categoria,
            inc_usuario: i.inc_usuario,
            inc_ubicacion: i.inc_ubicacion,
            inc_estado: i.inc_estado,

            // Nombres de catálogo para el mapper
            tipo: { tipo_nombre: i.tipo_nombre },
            categoria: { categoria_nombre: i.gravedad_nombre },
            usuario: { usuario_nombre: i.usuario_nombre, usuario_apellido: i.usuario_apellido },
            estado: { estado_nombre: i.estado_nombre },
            ubicacion: { ubicacion_latitud: i.ubicacion_latitud, ubicacion_longitud: i.ubicacion_longitud }
        }));

        res.status(200).json({ success: true, data: incidentesData });
    } catch (error) {
        console.error('Error al obtener incidentes:', error);
        res.status(500).json({ success: false, message: 'Error interno al listar incidentes' });
    }
};

/**
 * 2. Crea un nuevo incidente (POST /api/incidentes).
 */
export const createIncidente = async (req, res) => {
    const { 
        inc_nombre, 
        inc_tipo, 
        inc_descripcion, 
        inc_categoria, 
        inc_usuario, 
        inc_estado,
        inc_involucrados, 
        observaciones,
        coordenadas // { lat, lng }
    } = req.body;

    try {
        await pool.query('BEGIN'); // ⬅️ INICIA TRANSACCIÓN

        // 1. Insertar en Ubicacion y obtener el ID
        const ubicacionId = await createUbicacionDB({
            latitud: coordenadas.lat,
            longitud: coordenadas.lng
        });

        // 2. Insertar en incidentes
        const incidenteResult = await pool.query(
            `INSERT INTO incidentes (
                inc_nombre, inc_tipo, inc_descripcion, inc_categoria, inc_usuario, 
                inc_ubicacion, inc_involucrados, observaciones, inc_estado
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING inc_id, inc_nombre, inc_ubicacion, created_at`,
            [
                inc_nombre, inc_tipo, inc_descripcion, inc_categoria, inc_usuario, 
                ubicacionId, inc_involucrados, observaciones, inc_estado
            ]
        );

        await pool.query('COMMIT'); // ⬅️ CONFIRMA TRANSACCIÓN

        res.status(201).json({ 
            success: true, 
            data: incidenteResult.rows[0], 
            message: 'Incidente creado exitosamente' 
        });

    } catch (error) {
        await pool.query('ROLLBACK'); // ⬅️ REVierte si falla
        console.error('Error en transacción de creación de incidente:', error);
        res.status(500).json({ success: false, message: 'Error interno al crear incidente' });
    }
};

/**
 * 3. Actualiza un incidente existente (PUT /api/incidentes/:id).
 */
export const updateIncidente = async (req, res) => {
    const { id } = req.params;
    const { 
        inc_nombre, 
        inc_tipo, 
        inc_descripcion, 
        inc_categoria, 
        inc_estado,
        inc_ubicacion, // ID de ubicación
        inc_involucrados, 
        observaciones,
        coordenadas // { lat, lng }
    } = req.body;

    try {
        await pool.query('BEGIN'); // ⬅️ INICIA TRANSACCIÓN

        // 1. Actualizar la ubicación existente
        await updateUbicacionDB(inc_ubicacion, {
            latitud: coordenadas.lat,
            longitud: coordenadas.lng
        });

        // 2. Actualizar el incidente
        const incidenteResult = await pool.query(
            `UPDATE incidentes SET
                inc_nombre = $1, inc_tipo = $2, inc_descripcion = $3, 
                inc_categoria = $4, inc_estado = $5, inc_involucrados = $6, 
                observaciones = $7, updated_at = NOW()
            WHERE inc_id = $8
            RETURNING inc_id`,
            [
                inc_nombre, inc_tipo, inc_descripcion, inc_categoria, inc_estado, 
                inc_involucrados, observaciones, id
            ]
        );

        await pool.query('COMMIT'); // ⬅️ CONFIRMA TRANSACCIÓN

        if (incidenteResult.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Incidente no encontrado' });
        }

        res.status(200).json({
            success: true,
            message: 'Incidente actualizado exitosamente',
            data: incidenteResult.rows[0]
        });

    } catch (error) {
        await pool.query('ROLLBACK'); // ⬅️ REVierte si falla
        console.error('Error en transacción de actualización de incidente:', error);
        res.status(500).json({ success: false, message: 'Error interno al actualizar incidente' });
    }
};

/**
 * 4. Elimina (lógica) un incidente (DELETE /api/incidentes/:id).
 * Lo marcamos como Cerrado (ID 8) o como el estado que el frontend defina como final.
 */
export const deleteIncidente = async (req, res) => {
    const { id } = req.params;
    const CERRADO_ID = 8; // ID del estado 'Cerrado'

    try {
        const result = await pool.query(`
            UPDATE incidentes
            SET inc_estado = $1, updated_at = NOW()
            WHERE inc_id = $2
            RETURNING inc_id
        `, [CERRADO_ID, id]); 

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Incidente no encontrado' });
        }

        res.status(200).json({
            success: true,
            message: 'Incidente marcado como Cerrado exitosamente (Eliminación lógica)'
        });

    } catch (error) {
        console.error('Error al cerrar incidente:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error interno al cerrar incidente' 
        });
    }
};