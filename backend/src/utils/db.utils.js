// src/utils/db.utils.js
import { pool } from '../../db.js';

/**
 * Inserta una nueva ubicación en la tabla 'ubicacion' y retorna su ID.
 * @param {object} param0 - Contiene latitud y longitud.
 * @returns {number} El ubicacion_id recién creado.
 */
export const createUbicacionDB = async ({ latitud, longitud }) => {
    const ubicacionResult = await pool.query(
        `INSERT INTO ubicacion (ubicacion_latitud, ubicacion_longitud, ubicacion_fecha) 
         VALUES ($1, $2, NOW()) 
         RETURNING ubicacion_id`,
        [latitud, longitud]
    );
    return ubicacionResult.rows[0].ubicacion_id;
};

/**
 * Actualiza una ubicación existente por su ID.
 */
export const updateUbicacionDB = async (id, { latitud, longitud }) => {
    await pool.query(
        `UPDATE ubicacion 
         SET ubicacion_latitud = $1, ubicacion_longitud = $2, updated_at = NOW() 
         WHERE ubicacion_id = $3`,
        [latitud, longitud, id]
    );
};