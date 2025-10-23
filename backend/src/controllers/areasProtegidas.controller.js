// src/controllers/areasProtegidas.controller.js
import { pool } from '../../db.js';
import { 
    createUbicacionDB, 
    updateUbicacionDB
} from '../utils/db.utils.js';
import { ESTADO_MAP } from '../utils/constants.js'; // Asumimos esta importación existe

/**
 * 1. Obtiene todas las áreas protegidas con sus datos de catálogo (GET /api/areas-protegidas).
 */
export const getAllAreasProtegidas = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                ap.area_id, ap.area_nombre, ap.area_extension, ap.area_descripcion, ap.estado, ap.area_ubicacion,
                c.categoria_nombre,
                d.depto AS departamento_nombre,
                e.eco_nombre AS ecosistema_nombre,
                es.estado_nombre,
                u.ubicacion_latitud,
                u.ubicacion_longitud
            FROM area_protegida ap
            LEFT JOIN categoria c ON ap.area_categoria = c.categoria_id
            LEFT JOIN departamento d ON ap.area_departamento = d.depto_id
            LEFT JOIN ecosistema e ON ap.area_ecosistema = e.eco_id
            LEFT JOIN estado es ON ap.estado = es.estado_id
            LEFT JOIN ubicacion u ON ap.area_ubicacion = u.ubicacion_id
            ORDER BY ap.area_nombre
        `);

        // Estructurar los datos para que el frontend pueda mapearlos (simulando JOINs)
        const areasData = result.rows.map(a => ({
            area_id: a.area_id,
            area_nombre: a.area_nombre,
            area_extension: a.area_extension,
            area_descripcion: a.area_descripcion,
            area_ubicacion: a.area_ubicacion,
            
            // Datos de catálogo para el mapper del frontend
            categoria: { categoria_nombre: a.categoria_nombre },
            departamento: { depto: a.departamento_nombre },
            ecosistema: { eco_nombre: a.ecosistema_nombre },
            estado_info: { estado_nombre: a.estado_nombre },
            ubicacion: { 
                ubicacion_latitud: a.ubicacion_latitud, 
                ubicacion_longitud: a.ubicacion_longitud 
            }
        }));

        res.status(200).json({ success: true, data: areasData });
    } catch (error) {
        console.error('Error al obtener áreas protegidas:', error);
        res.status(500).json({ success: false, message: 'Error interno al listar áreas' });
    }
};

/**
 * 2. Crea una nueva área protegida (POST /api/areas-protegidas).
 */
export const createAreaProtegida = async (req, res) => {
    const { 
        area_nombre, 
        area_categoria, 
        area_departamento, 
        area_extension, 
        estado, 
        area_descripcion, 
        area_ecosistema,
        coordenadas 
    } = req.body;

    try {
        await pool.query('BEGIN'); // ⬅️ INICIA TRANSACCIÓN

        // 1. Insertar en Ubicacion y obtener el ID
        const ubicacionId = await createUbicacionDB({
            latitud: coordenadas.lat,
            longitud: coordenadas.lng
        });

        // 2. Insertar en area_protegida
        const areaResult = await pool.query(
            `INSERT INTO area_protegida (
                area_nombre, area_categoria, area_departamento, area_extension, estado, 
                area_descripcion, area_ubicacion, area_ecosistema
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING area_id, area_nombre, area_ubicacion, created_at`,
            [
                area_nombre, area_categoria, area_departamento, area_extension, estado,
                area_descripcion, ubicacionId, area_ecosistema
            ]
        );

        await pool.query('COMMIT'); // ⬅️ CONFIRMA TRANSACCIÓN

        res.status(201).json({ 
            success: true, 
            data: areaResult.rows[0], 
            message: 'Área Protegida creada exitosamente' 
        });

    } catch (error) {
        await pool.query('ROLLBACK'); // ⬅️ REVierte si falla
        console.error('Error en transacción de creación de área:', error);
        res.status(500).json({ success: false, message: 'Error interno al crear área protegida' });
    }
};

/**
 * 3. Actualiza una área protegida existente (PUT /api/areas-protegidas/:id).
 */
export const updateAreaProtegida = async (req, res) => {
    const { id } = req.params;
    const { 
        area_nombre, 
        area_categoria, 
        area_departamento, 
        area_extension, 
        estado, 
        area_descripcion, 
        area_ecosistema,
        area_ubicacion, // ID de ubicación para actualizar
        coordenadas 
    } = req.body;

    try {
        await pool.query('BEGIN'); // ⬅️ INICIA TRANSACCIÓN

        // 1. Actualizar la ubicación existente
        await updateUbicacionDB(area_ubicacion, {
            latitud: coordenadas.lat,
            longitud: coordenadas.lng
        });

        // 2. Actualizar el área protegida
        const areaResult = await pool.query(
            `UPDATE area_protegida SET
                area_nombre = $1, 
                area_categoria = $2, 
                area_departamento = $3, 
                area_extension = $4, 
                estado = $5, 
                area_descripcion = $6, 
                area_ecosistema = $7,
                updated_at = NOW()
            WHERE area_id = $8
            RETURNING area_id`,
            [
                area_nombre, area_categoria, area_departamento, area_extension, estado, 
                area_descripcion, area_ecosistema, id
            ]
        );

        await pool.query('COMMIT'); // ⬅️ CONFIRMA TRANSACCIÓN

        if (areaResult.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Área Protegida no encontrada' });
        }

        res.status(200).json({
            success: true,
            message: 'Área Protegida actualizada exitosamente',
            data: areaResult.rows[0]
        });

    } catch (error) {
        await pool.query('ROLLBACK'); // ⬅️ REVierte si falla
        console.error('Error en transacción de actualización de área:', error);
        res.status(500).json({ success: false, message: 'Error interno al actualizar área' });
    }
};

/**
 * 4. Desactiva (Eliminación lógica) un área protegida (DELETE /api/areas-protegidas/:id).
 */
export const deleteAreaProtegida = async (req, res) => {
    const { id } = req.params;
    const DESHABILITADO_ID = 2; // Inactivo/Deshabilitado

    try {
        const result = await pool.query(`
            UPDATE area_protegida
            SET estado = $1, updated_at = NOW()
            WHERE area_id = $2
            RETURNING area_id
        `, [DESHABILITADO_ID, id]); 

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Área Protegida no encontrada' });
        }

        res.status(200).json({
            success: true,
            message: 'Área Protegida desactivada exitosamente (Eliminación lógica)'
        });

    } catch (error) {
        console.error('Error al desactivar área protegida:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error interno al desactivar área protegida' 
        });
    }
};