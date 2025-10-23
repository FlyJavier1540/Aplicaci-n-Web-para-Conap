// src/controllers/catalogos.controller.js
import { pool } from '../../db.js';

/**
 * Obtiene los datos de una tabla de catálogo específica.
 */
const getCatalogoData = async (tableName, idField, nameField) => {
    const result = await pool.query(`
        SELECT ${idField} AS id, ${nameField} AS nombre 
        FROM ${tableName} 
        ORDER BY nombre
    `);
    return result.rows;
};

/**
 * Rutas individuales de catálogo (GET /api/catalogos/...)
 */
export const getRoles = async (req, res) => {
    try {
        const data = await getCatalogoData('usuario_rol', 'rol_id', 'rol_nombre');
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener roles' });
    }
};

export const getEstados = async (req, res) => {
    try {
        const data = await getCatalogoData('estado', 'estado_id', 'estado_nombre');
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener estados' });
    }
};

export const getCategorias = async (req, res) => {
    try {
        const data = await getCatalogoData('categoria', 'categoria_id', 'categoria_nombre');
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener categorías' });
    }
};

export const getTipos = async (req, res) => {
    try {
        const data = await getCatalogoData('tipo', 'tipo_id', 'tipo_nombre');
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener tipos' });
    }
};