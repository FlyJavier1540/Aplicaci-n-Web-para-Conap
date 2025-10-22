/**
 * =============================================
 * TIPOS DE BASE DE DATOS
 * =============================================
 * 
 * Estos tipos mapean directamente a las tablas de PostgreSQL.
 * Mantienen los nombres de columnas exactos de la base de datos.
 * 
 * NO modificar estos tipos sin actualizar la base de datos.
 */

// ============================================
// TABLAS DE CATÁLOGO
// ============================================

export interface EstadoDB {
  estado_id: number;
  estado_nombre: string;
  created_at?: string;
  updated_at?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
}

export interface UsuarioRolDB {
  rol_id: number;
  rol_nombre: string;
  created_at?: string;
  updated_at?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
}

export interface CategoriaDB {
  categoria_id: number;
  categoria_nombre: string;
  created_at?: string;
  updated_at?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
}

export interface DepartamentoDB {
  depto_id: number;
  depto: string;
  created_at?: string;
  updated_at?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
}

export interface EcosistemaDB {
  eco_id: number;
  eco_nombre: string;
  created_at?: string;
  updated_at?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
}

export interface TipoDB {
  tipo_id: number;
  tipo_nombre: string;
  created_at?: string;
  updated_at?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
}

export interface UbicacionDB {
  ubicacion_id: number;
  ubicacion_latitud: number;
  ubicacion_longitud: number;
  ubicacion_fecha: string;
  created_at?: string;
  updated_at?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
}

// ============================================
// TABLAS PRINCIPALES
// ============================================

export interface AreaProtegidaDB {
  area_id: number;
  area_nombre: string;
  area_categoria: number; // FK a categoria
  area_departamento: number; // FK a departamento
  area_extension?: number | null;
  estado: number; // FK a estado
  area_descripcion?: string | null;
  area_ubicacion: number; // FK a ubicacion
  area_ecosistema: number; // FK a ecosistema
  created_at?: string;
  updated_at?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
}

export interface UsuarioDB {
  usuario_id: number;
  usuario_nombre: string;
  usuario_apellido: string;
  usuario_dpi?: string | null;
  usuario_telefono: string;
  usuario_correo: string;
  usuario_contrasenia: string;
  usuario_rol: number; // FK a usuario_rol
  usuario_area?: number | null; // FK a area_protegida
  usuario_estado: number; // FK a estado
  created_at?: string;
  updated_at?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
}

export interface EquipoDB {
  equipo_id: number;
  equipo_nombre: string;
  equipo_codigo: string;
  equipo_tipo: number; // FK a tipo
  equipo_estado: number; // FK a estado
  marca?: string | null;
  modelo?: string | null;
  equipo_usuario: number; // FK a usuario
  equipo_observaciones?: string | null;
  created_at?: string;
  updated_at?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
}

export interface ActividadDB {
  actividad_id: number;
  actividad_codigo: string;
  actividad_nombre: string;
  actividad_tipo: number; // FK a tipo
  actividad_usuario: number; // FK a usuario
  actividad_descripcion?: string | null;
  actividad_estado: number; // FK a estado
  actividad_fecha: string;
  actividad_h_programada?: string | null; // TIME
  actividad_ubicacion?: string | null;
  actividad_h_inicio: string; // TIME
  actividad_h_fin: string; // TIME
  actividad_notas?: string | null;
  created_at?: string;
  updated_at?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
}

export interface IncidenteDB {
  inc_id: number;
  inc_nombre: string;
  inc_tipo: number; // FK a tipo
  inc_descripcion: string;
  inc_categoria: number; // FK a categoria (gravedad)
  inc_usuario: number; // FK a usuario
  inc_ubicacion: number; // FK a ubicacion
  inc_involucrados?: string | null;
  observaciones?: string | null;
  inc_estado: number; // FK a estado
  created_at?: string;
  updated_at?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
}

export interface HallazgoDB {
  hallazgos_id: number;
  hallazgo_titulo: string;
  hallazgo_tipo: number; // FK a tipo
  hallazgo_categoria: number; // FK a categoria
  hallazgo_descripcion: string;
  hallazgo_ubicacion: number; // FK a ubicacion
  hallazgo_estado: number; // FK a estado
  hallazgo_actividad: number; // FK a actividad
  created_at?: string;
  updated_at?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
}

export interface SeguimientoDB {
  seg_id: number;
  seg_nombre: string;
  seg_incidente?: number | null; // FK a incidentes
  seg_hallazgo?: number | null; // FK a hallazgo
  seg_descripcion: string;
  seg_fecha: string;
  seg_usuario: number; // FK a usuario
  created_at?: string;
  updated_at?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
}

export interface FotografiaDB {
  foto_id: number;
  foto_tipo: number; // FK a tipo
  foto_descripcion: string;
  foto_ubicacion: number; // FK a ubicacion
  foto_fecha: string;
  foto_ruta: string; // URL o path del archivo
  foto_actividad?: number | null; // FK a actividad
  foto_hallazgo?: number | null; // FK a hallazgo
  created_at?: string;
  updated_at?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
}

export interface RutaGeolocalizacionDB {
  ruta_id: number;
  ruta_actividad: number; // FK a actividad
  ruta_ubicacion: number; // FK a ubicacion
  created_at?: string;
  updated_at?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
}
