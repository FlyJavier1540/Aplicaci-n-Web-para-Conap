/**
 * =============================================
 * DEFINICIONES DE TIPOS DEL SISTEMA CONAP
 * =============================================
 * 
 * Este archivo contiene todas las interfaces TypeScript que definen
 * la estructura de datos de la aplicación.
 * 
 * IMPORTANTE: Si necesitas agregar o modificar campos de datos,
 * hazlo aquí primero y luego actualiza los datos en /data/mock-data.ts
 */

// ===== ÁREAS PROTEGIDAS =====
// Define la estructura de un área protegida de Guatemala
export interface AreaProtegida {
  id: string;                    // ID único del área
  nombre: string;                // Nombre del área protegida (ej: "Parque Nacional Tikal")
  categoria: 'Parque Nacional' | 'Reserva Biológica' | 'Biotopo' | 'Refugio de Vida Silvestre' | 'Reserva Natural';
  departamento: string;          // Departamento de Guatemala donde se ubica
  extension: number;             // Tamaño en hectáreas
  fechaCreacion: string;         // Fecha de creación del área (formato: YYYY-MM-DD)
  coordenadas: {                 // Coordenadas GPS del centro del área
    lat: number;
    lng: number;
  };
  descripcion: string;           // Descripción del área
  ecosistemas: string[];         // Tipos de ecosistemas presentes
  guardarecursos: Guardarecurso[]; // Lista de guardarecursos asignados
  estado: 'Habilitado' | 'Deshabilitado'; // Estado operativo del área
}

// ===== GUARDARECURSOS =====
// Define la estructura de un empleado guardarecurso
export interface Guardarecurso {
  id: string;                    // ID único del guardarecurso
  nombre: string;                // Nombre(s)
  apellido: string;              // Apellido(s)
  cedula: string;                // DPI o cédula de identidad
  telefono: string;              // Número telefónico de contacto
  email: string;                 // Correo electrónico
  fechaIngreso: string;          // Fecha de ingreso a CONAP (formato: YYYY-MM-DD)
  puesto: 'Jefe de Área' | 'Coordinador' | 'Guardarecurso Senior' | 'Guardarecurso' | 'Guardarecurso Auxiliar';
  areaAsignada: string;          // ID del área protegida asignada
  zonaCobertura: string[];       // IDs de las zonas que cubre
  estado: 'Activo' | 'Licencia' | 'Suspendido'; // Estado laboral actual
  equiposAsignados: EquipoAsignado[]; // Equipos asignados al guardarecurso
  actividades: Actividad[];      // Historial de actividades
}

export interface ZonaCobertura {
  id: string;
  nombre: string;
  descripcion: string;
  areaProtegida: string;
  coordenadas: {
    lat: number;
    lng: number;
  };
  radio: number; // en metros
  puntosControl: PuntoControl[];
  guardarecursosAsignados: string[];
}

export interface PuntoControl {
  id: string;
  nombre: string;
  descripcion: string;
  coordenadas: {
    lat: number;
    lng: number;
  };
  tipo: 'Entrada' | 'Mirador' | 'Sendero' | 'Límite' | 'Estación' | 'Otro';
  frecuenciaControl: 'Diaria' | 'Semanal' | 'Quincenal' | 'Mensual';
}

export interface RegistroActividad {
  id: string;
  fecha: string;
  descripcion: string;
  usuario: string;
  fotografias?: string[];
}

export interface Actividad {
  id: string;
  tipo: 'Patrullaje' | 'Mantenimiento' | 'Educación Ambiental' | 'Investigación' | 'Control y Vigilancia' | 'Ronda';
  descripcion: string;
  fecha: string;
  horaInicio: string;
  horaFin?: string;
  ubicacion: string;
  coordenadas?: {
    lat: number;
    lng: number;
  };
  ruta?: Coordenada[];
  estado: 'Programada' | 'En Progreso' | 'Pausada' | 'Completada';
  observaciones?: string;
  evidencias?: EvidenciaFotografica[];
  guardarecurso: string;
  hallazgos?: Hallazgo[];
  registros?: RegistroActividad[];
  fotografias?: string[];
  registroDetallado?: any;
}

export interface Coordenada {
  lat: number;
  lng: number;
  timestamp?: string;
}

export interface EvidenciaFotografica {
  id: string;
  url: string;
  descripcion: string;
  coordenadas?: {
    lat: number;
    lng: number;
  };
  fecha: string;
  tipo: 'Fauna' | 'Flora' | 'Infraestructura' | 'Irregularidad' | 'Mantenimiento' | 'Otro';
}

export interface Hallazgo {
  id: string;
  tipo: 'Ambiental' | 'Irregularidad' | 'Fauna' | 'Flora' | 'Infraestructura';
  titulo: string;
  descripcion: string;
  ubicacion: string;
  coordenadas: {
    lat: number;
    lng: number;
  };
  fecha: string;
  guardarecurso: string;
  gravedad: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  estado: 'Reportado' | 'En Investigación' | 'Resuelto' | 'Cerrado';
  evidencias: EvidenciaFotografica[];
  seguimientos: SeguimientoHallazgo[];
}

export interface SeguimientoHallazgo {
  id: string;
  hallazgoId: string;
  fecha: string;
  descripcion: string;
  usuario: string;
  estado: string;
  evidencias?: EvidenciaFotografica[];
}

export interface EquipoAsignado {
  id: string;
  nombre: string;
  tipo: 'Radio' | 'GPS' | 'Binoculares' | 'Cámara' | 'Vehículo' | 'Herramienta' | 'Otro';
  codigo: string;
  marca?: string;
  modelo?: string;
  fechaAsignacion: string;
  estado: 'Operativo' | 'En Reparación' | 'Deshabilitado';
  observaciones?: string;
}

export interface IncidenteVisitante {
  id: string;
  tipo: 'Accidente' | 'Emergencia Médica' | 'Conflicto' | 'Violación Normativa' | 'Otro';
  titulo: string;
  descripcion: string;
  ubicacion: string;
  coordenadas?: {
    lat: number;
    lng: number;
  };
  fecha: string;
  guardarecurso: string;
  visitantesInvolucrados: string[];
  gravedad: 'Leve' | 'Moderado' | 'Grave' | 'Crítico';
  estado: 'Nuevo' | 'En Atención' | 'Resuelto' | 'Cerrado';
  acciones: AccionIncidente[];
  evidencias?: EvidenciaFotografica[];
}

export interface AccionIncidente {
  id: string;
  incidenteId: string;
  fecha: string;
  descripcion: string;
  usuario: string;
  tipo: 'Primeros Auxilios' | 'Evacuación' | 'Mediación' | 'Sanción' | 'Seguimiento';
}

export interface ReportePeriodico {
  id: string;
  titulo: string;
  tipo: 'Diario' | 'Semanal' | 'Mensual' | 'Trimestral' | 'Anual' | 'Especial';
  fechaCreacion: string;
  periodo: {
    inicio: string;
    fin: string;
  };
  areaProtegida?: string;
  zona?: string;
  guardarecurso?: string;
  resumen: string;
  datos: {
    actividades: number;
    patrullajes: number;
    hallazgos: number;
    incidentes: number;
    visitantes: number;
    horasTrabajadas: number;
  };
  estado: 'Borrador' | 'Enviado' | 'Aprobado' | 'Rechazado';
  observaciones?: string;
}

// ===== USUARIOS DEL SISTEMA =====
// Define los usuarios que pueden iniciar sesión en la aplicación
// IMPORTANTE: Los roles determinan los permisos (ver /utils/permissions.ts)
export interface Usuario {
  id: string;                    // ID único del usuario
  nombre: string;                // Nombre(s) del usuario
  apellido: string;              // Apellido(s) del usuario
  email: string;                 // Email para login y notificaciones
  telefono: string;              // Teléfono de contacto
  password: string;              // Contraseña (en producción debe estar hasheada)
  rol: 'Administrador' | 'Coordinador' | 'Guardarecurso'; // ROL DEL USUARIO - DETERMINA PERMISOS
  estado: 'Activo' | 'Inactivo' | 'Suspendido'; // Estado de la cuenta
  fechaCreacion: string;         // Fecha de creación de la cuenta
  ultimoAcceso?: string;         // Última vez que inició sesión
  permisos: string[];            // Lista de permisos específicos
  areaAsignada?: string;         // ID del área asignada (solo para Guardarecursos)
}