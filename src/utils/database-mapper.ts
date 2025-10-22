/**
 * =============================================
 * MAPEADOR DE BASE DE DATOS
 * =============================================
 * 
 * Convierte entre el formato de la base de datos PostgreSQL
 * y el formato usado por la aplicación frontend.
 * 
 * Esto permite que la app use nombres amigables mientras
 * la BD usa su propia nomenclatura.
 */

import type {
  UsuarioDB,
  AreaProtegidaDB,
  ActividadDB,
  IncidenteDB,
  HallazgoDB,
  EquipoDB,
  EstadoDB,
  TipoDB,
  CategoriaDB,
  DepartamentoDB,
  EcosistemaDB,
  UbicacionDB
} from '../types/database.types';

import type {
  Usuario,
  AreaProtegida,
  Actividad,
  IncidenteVisitante,
  Hallazgo,
  EquipoAsignado
} from '../types';

// ============================================
// CONSTANTES DE MAPEO
// ============================================

export const ESTADO_MAP = {
  ACTIVO: 1,
  INACTIVO: 2,
  EN_PROCESO: 3,
  COMPLETADO: 4,
  REPORTADO: 5,
  EN_INVESTIGACION: 6,
  RESUELTO: 7,
  CERRADO: 8,
  PENDIENTE: 9,
  CANCELADO: 10
} as const;

export const ROL_MAP = {
  ADMINISTRADOR: 1,
  COORDINADOR: 2,
  GUARDARECURSO: 3
} as const;

export const TIPO_ACTIVIDAD_MAP = {
  PATRULLAJE: 1,
  MONITOREO: 2,
  VIGILANCIA: 3,
  MANTENIMIENTO: 4,
  INSPECCION: 5,
  RESCATE: 6,
  CAPACITACION: 7,
  INVESTIGACION: 8
} as const;

export const TIPO_INCIDENTE_MAP = {
  INCENDIO_FORESTAL: 9,
  TALA_ILEGAL: 10,
  CAZA_FURTIVA: 11,
  INVASION_TIERRAS: 12,
  CONTAMINACION: 13,
  ACCIDENTE_VISITANTE: 14,
  CONFLICTO_COMUNITARIO: 15,
  EMERGENCIA_MEDICA: 16
} as const;

export const TIPO_EQUIPO_MAP = {
  COMUNICACION: 17,
  NAVEGACION: 18,
  SEGURIDAD: 19,
  TRANSPORTE: 20,
  CAMPAMENTO: 21,
  RESCATE: 22,
  MEDICION: 23
} as const;

export const GRAVEDAD_MAP = {
  LEVE: 8,
  MODERADO: 9,
  GRAVE: 10,
  CRITICO: 11
} as const;

// ============================================
// FUNCIONES DE CONVERSIÓN: DB → APP
// ============================================

/**
 * Convierte un usuario de BD a formato de aplicación
 */
export function mapUsuarioDBToApp(
  usuarioDB: UsuarioDB,
  rol?: { rol_nombre: string },
  area?: { area_nombre: string },
  estado?: { estado_nombre: string }
): Usuario {
  return {
    id: usuarioDB.usuario_id.toString(),
    nombre: usuarioDB.usuario_nombre,
    apellido: usuarioDB.usuario_apellido,
    cedula: usuarioDB.usuario_dpi || '',
    email: usuarioDB.usuario_correo,
    telefono: usuarioDB.usuario_telefono,
    password: usuarioDB.usuario_contrasenia,
    rol: (rol?.rol_nombre as any) || 'Guardarecurso',
    estado: (estado?.estado_nombre as any) || 'Activo',
    fechaCreacion: usuarioDB.created_at || new Date().toISOString(),
    ultimoAcceso: usuarioDB.updated_at,
    permisos: [],
    areaAsignada: usuarioDB.usuario_area?.toString()
  };
}

/**
 * Convierte un área protegida de BD a formato de aplicación
 */
export function mapAreaProtegidaDBToApp(
  areaDB: AreaProtegidaDB,
  categoria?: { categoria_nombre: string },
  departamento?: { depto: string },
  ubicacion?: UbicacionDB,
  ecosistema?: { eco_nombre: string },
  estado?: { estado_nombre: string }
): Partial<AreaProtegida> {
  return {
    id: areaDB.area_id.toString(),
    nombre: areaDB.area_nombre,
    categoria: (categoria?.categoria_nombre as any) || 'Parque Nacional',
    departamento: departamento?.depto || 'Desconocido',
    extension: areaDB.area_extension || 0,
    coordenadas: ubicacion ? {
      lat: ubicacion.ubicacion_latitud,
      lng: ubicacion.ubicacion_longitud
    } : { lat: 0, lng: 0 },
    descripcion: areaDB.area_descripcion || '',
    ecosistemas: ecosistema ? [ecosistema.eco_nombre] : [],
    estado: (estado?.estado_nombre === 'Activo' ? 'Habilitado' : 'Deshabilitado') as any,
    guardarecursos: [] // Se llena aparte
  };
}

/**
 * Convierte una actividad de BD a formato de aplicación
 */
export function mapActividadDBToApp(
  actividadDB: ActividadDB,
  tipo?: { tipo_nombre: string },
  usuario?: { usuario_nombre: string; usuario_apellido: string },
  estado?: { estado_nombre: string }
): Partial<Actividad> {
  return {
    id: actividadDB.actividad_id.toString(),
    tipo: (tipo?.tipo_nombre as any) || 'Patrullaje',
    descripcion: actividadDB.actividad_descripcion || '',
    fecha: actividadDB.actividad_fecha,
    horaInicio: actividadDB.actividad_h_inicio,
    horaFin: actividadDB.actividad_h_fin || undefined,
    ubicacion: actividadDB.actividad_ubicacion || '',
    estado: mapEstadoToActividad(estado?.estado_nombre || 'Programada'),
    observaciones: actividadDB.actividad_notas,
    guardarecurso: usuario ? `${usuario.usuario_nombre} ${usuario.usuario_apellido}` : ''
  };
}

/**
 * Convierte un incidente de BD a formato de aplicación
 */
export function mapIncidenteDBToApp(
  incidenteDB: IncidenteDB,
  tipo?: { tipo_nombre: string },
  categoria?: { categoria_nombre: string },
  ubicacion?: UbicacionDB,
  estado?: { estado_nombre: string },
  usuario?: { usuario_nombre: string; usuario_apellido: string }
): Partial<IncidenteVisitante> {
  return {
    id: incidenteDB.inc_id.toString(),
    titulo: incidenteDB.inc_nombre,
    tipo: mapTipoToIncidente(tipo?.tipo_nombre || 'Otro'),
    descripcion: incidenteDB.inc_descripcion,
    gravedad: mapCategoriaToGravedad(categoria?.categoria_nombre || 'Leve'),
    ubicacion: '',
    coordenadas: ubicacion ? {
      lat: ubicacion.ubicacion_latitud,
      lng: ubicacion.ubicacion_longitud
    } : undefined,
    fecha: incidenteDB.created_at || new Date().toISOString(),
    estado: mapEstadoToIncidente(estado?.estado_nombre || 'Nuevo'),
    visitantesInvolucrados: incidenteDB.inc_involucrados?.split(',') || [],
    guardarecurso: usuario ? `${usuario.usuario_nombre} ${usuario.usuario_apellido}` : '',
    acciones: []
  };
}

/**
 * Convierte un equipo de BD a formato de aplicación
 */
export function mapEquipoDBToApp(
  equipoDB: EquipoDB,
  tipo?: { tipo_nombre: string },
  estado?: { estado_nombre: string }
): EquipoAsignado {
  return {
    id: equipoDB.equipo_id.toString(),
    nombre: equipoDB.equipo_nombre,
    codigo: equipoDB.equipo_codigo,
    tipo: mapTipoToEquipo(tipo?.tipo_nombre || 'Otro'),
    marca: equipoDB.marca,
    modelo: equipoDB.modelo,
    estado: (estado?.estado_nombre as any) || 'Operativo',
    fechaAsignacion: equipoDB.created_at || new Date().toISOString(),
    observaciones: equipoDB.equipo_observaciones
  };
}

// ============================================
// FUNCIONES DE CONVERSIÓN: APP → DB
// ============================================

/**
 * Convierte un usuario de app a formato de BD
 */
export function mapUsuarioAppToDB(usuario: Usuario): Partial<UsuarioDB> {
  return {
    usuario_nombre: usuario.nombre,
    usuario_apellido: usuario.apellido,
    usuario_dpi: usuario.cedula,
    usuario_correo: usuario.email,
    usuario_telefono: usuario.telefono,
    usuario_contrasenia: usuario.password,
    usuario_rol: getRolId(usuario.rol),
    usuario_estado: getEstadoId(usuario.estado),
    usuario_area: usuario.areaAsignada ? parseInt(usuario.areaAsignada) : null
  };
}

/**
 * Convierte una actividad de app a formato de BD
 */
export function mapActividadAppToDB(
  actividad: Partial<Actividad>,
  usuarioId: number
): Partial<ActividadDB> {
  return {
    actividad_codigo: generateActivityCode(),
    actividad_nombre: actividad.descripcion || '',
    actividad_tipo: getTipoActividadId(actividad.tipo || 'Patrullaje'),
    actividad_usuario: usuarioId,
    actividad_descripcion: actividad.descripcion,
    actividad_estado: getEstadoIdFromActividad(actividad.estado || 'Programada'),
    actividad_fecha: actividad.fecha || new Date().toISOString().split('T')[0],
    actividad_h_inicio: actividad.horaInicio || '00:00',
    actividad_h_fin: actividad.horaFin || '00:00',
    actividad_ubicacion: actividad.ubicacion,
    actividad_notas: actividad.observaciones
  };
}

/**
 * Convierte un incidente de app a formato de BD  
 */
export function mapIncidenteAppToDB(
  incidente: Partial<IncidenteVisitante>,
  usuarioId: number,
  ubicacionId: number
): Partial<IncidenteDB> {
  return {
    inc_nombre: incidente.titulo || '',
    inc_tipo: getTipoIncidenteId(incidente.tipo || 'Otro'),
    inc_descripcion: incidente.descripcion || '',
    inc_categoria: getGravedadId(incidente.gravedad || 'Leve'),
    inc_usuario: usuarioId,
    inc_ubicacion: ubicacionId,
    inc_involucrados: incidente.visitantesInvolucrados?.join(','),
    inc_estado: getEstadoIdFromIncidente(incidente.estado || 'Nuevo')
  };
}

// ============================================
// FUNCIONES AUXILIARES DE MAPEO
// ============================================

function mapEstadoToActividad(estado: string): 'Programada' | 'En Progreso' | 'Pausada' | 'Completada' {
  const map: Record<string, any> = {
    'Pendiente': 'Programada',
    'En Proceso': 'En Progreso',
    'Pausada': 'Pausada',
    'Completado': 'Completada'
  };
  return map[estado] || 'Programada';
}

function mapEstadoToIncidente(estado: string): 'Nuevo' | 'En Atención' | 'Resuelto' | 'Cerrado' {
  const map: Record<string, any> = {
    'Reportado': 'Nuevo',
    'En Investigación': 'En Atención',
    'Resuelto': 'Resuelto',
    'Cerrado': 'Cerrado'
  };
  return map[estado] || 'Nuevo';
}

function mapTipoToIncidente(tipo: string): 'Accidente' | 'Emergencia Médica' | 'Conflicto' | 'Violación Normativa' | 'Otro' {
  const map: Record<string, any> = {
    'Accidente de Visitante': 'Accidente',
    'Emergencia Médica': 'Emergencia Médica',
    'Conflicto Comunitario': 'Conflicto'
  };
  return map[tipo] || 'Otro';
}

function mapTipoToEquipo(tipo: string): 'Radio' | 'GPS' | 'Binoculares' | 'Cámara' | 'Vehículo' | 'Herramienta' | 'Otro' {
  const map: Record<string, any> = {
    'Comunicación': 'Radio',
    'Navegación': 'GPS',
    'Transporte': 'Vehículo'
  };
  return map[tipo] || 'Otro';
}

function mapCategoriaToGravedad(categoria: string): 'Leve' | 'Moderado' | 'Grave' | 'Crítico' {
  return (categoria as any) || 'Leve';
}

function getRolId(rol: string): number {
  const map: Record<string, number> = {
    'Administrador': ROL_MAP.ADMINISTRADOR,
    'Coordinador': ROL_MAP.COORDINADOR,
    'Guardarecurso': ROL_MAP.GUARDARECURSO
  };
  return map[rol] || ROL_MAP.GUARDARECURSO;
}

function getEstadoId(estado: string): number {
  const map: Record<string, number> = {
    'Activo': ESTADO_MAP.ACTIVO,
    'Inactivo': ESTADO_MAP.INACTIVO,
    'Suspendido': ESTADO_MAP.INACTIVO
  };
  return map[estado] || ESTADO_MAP.ACTIVO;
}

function getEstadoIdFromActividad(estado: string): number {
  const map: Record<string, number> = {
    'Programada': ESTADO_MAP.PENDIENTE,
    'En Progreso': ESTADO_MAP.EN_PROCESO,
    'Pausada': ESTADO_MAP.PENDIENTE,
    'Completada': ESTADO_MAP.COMPLETADO
  };
  return map[estado] || ESTADO_MAP.PENDIENTE;
}

function getEstadoIdFromIncidente(estado: string): number {
  const map: Record<string, number> = {
    'Nuevo': ESTADO_MAP.REPORTADO,
    'En Atención': ESTADO_MAP.EN_INVESTIGACION,
    'Resuelto': ESTADO_MAP.RESUELTO,
    'Cerrado': ESTADO_MAP.CERRADO
  };
  return map[estado] || ESTADO_MAP.REPORTADO;
}

function getTipoActividadId(tipo: string): number {
  const map: Record<string, number> = {
    'Patrullaje': TIPO_ACTIVIDAD_MAP.PATRULLAJE,
    'Mantenimiento': TIPO_ACTIVIDAD_MAP.MANTENIMIENTO,
    'Educación Ambiental': TIPO_ACTIVIDAD_MAP.CAPACITACION,
    'Investigación': TIPO_ACTIVIDAD_MAP.INVESTIGACION,
    'Control y Vigilancia': TIPO_ACTIVIDAD_MAP.VIGILANCIA,
    'Ronda': TIPO_ACTIVIDAD_MAP.PATRULLAJE
  };
  return map[tipo] || TIPO_ACTIVIDAD_MAP.PATRULLAJE;
}

function getTipoIncidenteId(tipo: string): number {
  const map: Record<string, number> = {
    'Accidente': TIPO_INCIDENTE_MAP.ACCIDENTE_VISITANTE,
    'Emergencia Médica': TIPO_INCIDENTE_MAP.EMERGENCIA_MEDICA,
    'Conflicto': TIPO_INCIDENTE_MAP.CONFLICTO_COMUNITARIO,
    'Violación Normativa': TIPO_INCIDENTE_MAP.TALA_ILEGAL,
    'Otro': TIPO_INCIDENTE_MAP.ACCIDENTE_VISITANTE
  };
  return map[tipo] || TIPO_INCIDENTE_MAP.ACCIDENTE_VISITANTE;
}

function getGravedadId(gravedad: string): number {
  const map: Record<string, number> = {
    'Leve': GRAVEDAD_MAP.LEVE,
    'Moderado': GRAVEDAD_MAP.MODERADO,
    'Grave': GRAVEDAD_MAP.GRAVE,
    'Crítico': GRAVEDAD_MAP.CRITICO
  };
  return map[gravedad] || GRAVEDAD_MAP.LEVE;
}

function generateActivityCode(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ACT-${year}${month}${day}-${random}`;
}

// ============================================
// FUNCIONES DE CREACIÓN DE UBICACIÓN
// ============================================

/**
 * Crea un objeto de ubicación para insertar en BD
 */
export function createUbicacion(lat: number, lng: number): Partial<UbicacionDB> {
  return {
    ubicacion_latitud: lat,
    ubicacion_longitud: lng,
    ubicacion_fecha: new Date().toISOString()
  };
}
