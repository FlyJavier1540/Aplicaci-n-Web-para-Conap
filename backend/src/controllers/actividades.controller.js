// src/controllers/actividades.controller.js
import { pool } from '../../db.js';
import { 
    ESTADO_MAP,
    TIPO_ACTIVIDAD_MAP 
} from '../utils/constants.js'; // Asumimos esta importación

/**
 * Helper para generar el código de actividad (ACT-AAAAMMDD-XXX)
 */
function generateActivityCode() {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 999).toString().padStart(3, '0');
    return `ACT-${date}-${random}`;
}

/**
 * 1. Obtiene todas las actividades con sus datos de catálogo (GET /api/actividades).
 */
export const getAllActividades = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                a.actividad_id, a.actividad_codigo, a.actividad_nombre, a.actividad_descripcion, 
                a.actividad_fecha, a.actividad_h_inicio, a.actividad_h_fin, a.actividad_ubicacion, 
                a.actividad_notas, a.actividad_tipo, a.actividad_estado, a.actividad_usuario,
                t.tipo_nombre,
                u.usuario_nombre, u.usuario_apellido,
                es.estado_nombre
            FROM actividad a
            LEFT JOIN tipo t ON a.actividad_tipo = t.tipo_id
            LEFT JOIN usuario u ON a.actividad_usuario = u.usuario_id
            LEFT JOIN estado es ON a.actividad_estado = es.estado_id
            ORDER BY a.actividad_fecha DESC, a.actividad_h_inicio DESC
        `);

        // Estructurar los datos para que el frontend pueda mapearlos
        const actividadesData = result.rows.map(a => ({
            actividad_id: a.actividad_id,
            actividad_codigo: a.actividad_codigo,
            actividad_nombre: a.actividad_nombre,
            actividad_descripcion: a.actividad_descripcion,
            actividad_fecha: a.actividad_fecha.toISOString().split('T')[0], // Formato YYYY-MM-DD
            actividad_h_inicio: a.actividad_h_inicio,
            actividad_h_fin: a.actividad_h_fin,
            actividad_ubicacion: a.actividad_ubicacion,
            actividad_notas: a.actividad_notas,
            
            // Datos de catálogo para el mapper
            actividad_tipo: a.actividad_tipo,
            actividad_estado: a.actividad_estado,
            actividad_usuario: a.actividad_usuario,

            tipo: { tipo_nombre: a.tipo_nombre },
            usuario: { usuario_nombre: a.usuario_nombre, usuario_apellido: a.usuario_apellido },
            estado: { estado_nombre: a.estado_nombre }
        }));

        res.status(200).json({ success: true, data: actividadesData });
    } catch (error) {
        console.error('Error al obtener actividades:', error);
        res.status(500).json({ success: false, message: 'Error interno al listar actividades' });
    }
};

/**
 * 2. Crea una nueva actividad (POST /api/actividades).
 */
export const createActividad = async (req, res) => {
    const { 
        actividad_nombre, 
        actividad_tipo, 
        actividad_usuario, 
        actividad_descripcion, 
        actividad_estado, 
        actividad_fecha, 
        actividad_h_inicio, 
        actividad_ubicacion, 
        actividad_h_fin, 
        actividad_notas 
    } = req.body;

    try {
        const codigo = generateActivityCode();

        const result = await pool.query(`
            INSERT INTO actividad (
                actividad_codigo, actividad_nombre, actividad_tipo, actividad_usuario, actividad_descripcion, 
                actividad_estado, actividad_fecha, actividad_h_inicio, actividad_ubicacion, 
                actividad_h_fin, actividad_notas
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING actividad_id, actividad_codigo
        `, [
            codigo, actividad_nombre, actividad_tipo, actividad_usuario, actividad_descripcion, 
            actividad_estado, actividad_fecha, actividad_h_inicio, actividad_ubicacion, 
            actividad_h_fin, actividad_notas
        ]);

        res.status(201).json({ 
            success: true, 
            data: result.rows[0], 
            message: 'Actividad creada exitosamente' 
        });

    } catch (error) {
        console.error('Error al crear actividad:', error);
        res.status(500).json({ success: false, message: 'Error interno al crear actividad' });
    }
};

/**
 * 3. Actualiza una actividad existente (PUT /api/actividades/:id).
 */
export const updateActividad = async (req, res) => {
    const { id } = req.params;
    const { 
        actividad_nombre, 
        actividad_tipo, 
        actividad_descripcion, 
        actividad_estado, 
        actividad_fecha, 
        actividad_h_inicio, 
        actividad_ubicacion, 
        actividad_h_fin, 
        actividad_notas
    } = req.body;

    try {
        const result = await pool.query(`
            UPDATE actividad
            SET
                actividad_nombre = $1, actividad_tipo = $2, actividad_descripcion = $3, 
                actividad_estado = $4, actividad_fecha = $5, actividad_h_inicio = $6, 
                actividad_ubicacion = $7, actividad_h_fin = $8, actividad_notas = $9,
                updated_at = NOW()
            WHERE actividad_id = $10
            RETURNING actividad_id
        `, [
            actividad_nombre, actividad_tipo, actividad_descripcion, actividad_estado, 
            actividad_fecha, actividad_h_inicio, actividad_ubicacion, actividad_h_fin, 
            actividad_notas, id
        ]);

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Actividad no encontrada' });
        }

        res.status(200).json({
            success: true,
            message: 'Actividad actualizada exitosamente',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Error al actualizar actividad:', error);
        res.status(500).json({ success: false, message: 'Error interno al actualizar actividad' });
    }
};

/**
 * 4. Elimina (lógica) una actividad (DELETE /api/actividades/:id).
 */
export const deleteActividad = async (req, res) => {
    const { id } = req.params;
    const CANCELADO_ID = 10; // ID del estado 'Cancelado'

    try {
        const result = await pool.query(`
            UPDATE actividad
            SET actividad_estado = $1, updated_at = NOW()
            WHERE actividad_id = $2
            RETURNING actividad_id
        `, [CANCELADO_ID, id]); 

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Actividad no encontrada' });
        }

        res.status(200).json({
            success: true,
            message: 'Actividad cancelada exitosamente'
        });

    } catch (error) {
        console.error('Error al cancelar actividad:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error interno al cancelar actividad' 
        });
    }
};