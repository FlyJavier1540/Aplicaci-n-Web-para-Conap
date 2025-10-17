/**
 * =============================================
 * DATOS DE EJEMPLO (MOCK DATA)
 * =============================================
 * 
 * Este archivo contiene todos los datos de ejemplo de la aplicación.
 * 
 * ⚠️ IMPORTANTE PARA PRODUCCIÓN:
 * En producción, estos datos deberían venir de una base de datos real.
 * Este archivo es solo para desarrollo y demostración.
 * 
 * 📝 CÓMO MODIFICAR DATOS:
 * 1. Encuentra la sección que quieres modificar (ej: usuarios, areasProtegidas)
 * 2. Edita o agrega nuevos objetos siguiendo la estructura existente
 * 3. Asegúrate de que los IDs sean únicos
 * 4. Verifica que las relaciones entre datos sean correctas (ej: areaAsignada debe existir en areasProtegidas)
 */

import { 
  AreaProtegida, 
  Guardarecurso, 
  ZonaCobertura,
  PuntoControl,
  Actividad, 
  Hallazgo,
  EvidenciaFotografica,
  EquipoAsignado,
  IncidenteVisitante,
  ReportePeriodico,
  Usuario
} from '../types';

// Primero definimos las áreas sin guardarecursos
const areasProtegidasBase: Omit<AreaProtegida, 'guardarecursos'>[] = [
  {
    id: '1',
    nombre: 'Parque Nacional Tikal',
    categoria: 'Parque Nacional',
    departamento: 'Petén',
    extension: 57500,
    fechaCreacion: '1955-05-26',
    coordenadas: { lat: 17.2328, lng: -89.6239 },
    descripcion: 'Área protegida que resguarda ruinas mayas y biodiversidad tropical',
    ecosistemas: ['Bosque Tropical Húmedo', 'Humedales'],
    estado: 'Habilitado'
  },
  {
    id: '2',
    nombre: 'Volcán de Pacaya',
    categoria: 'Parque Nacional',
    departamento: 'Escuintla',
    extension: 2065,
    fechaCreacion: '1963-09-20',
    coordenadas: { lat: 14.3812, lng: -90.6014 },
    descripcion: 'Volcán activo y área de conservación',
    ecosistemas: ['Bosque Seco', 'Matorral Volcánico'],
    estado: 'Habilitado'
  },
  {
    id: '3',
    nombre: 'Reserva de la Biosfera Maya',
    categoria: 'Reserva Biológica',
    departamento: 'Petén',
    extension: 2112940,
    fechaCreacion: '1990-01-30',
    coordenadas: { lat: 17.7539, lng: -89.7878 },
    descripcion: 'La reserva de biosfera más grande de Guatemala',
    ecosistemas: ['Bosque Tropical', 'Sabanas', 'Humedales'],
    estado: 'Habilitado'
  },
  {
    id: '4',
    nombre: 'Semuc Champey',
    categoria: 'Parque Nacional',
    departamento: 'Alta Verapaz',
    extension: 440,
    fechaCreacion: '1999-12-07',
    coordenadas: { lat: 15.5339, lng: -89.9858 },
    descripcion: 'Formaciones naturales de piedra caliza con piscinas naturales',
    ecosistemas: ['Bosque Nublado', 'Karst'],
    estado: 'Deshabilitado'
  },
  {
    id: '5',
    nombre: 'Biotopo del Quetzal',
    categoria: 'Biotopo',
    departamento: 'Baja Verapaz',
    extension: 1044,
    fechaCreacion: '1976-08-07',
    coordenadas: { lat: 15.2108, lng: -90.2158 },
    descripcion: 'Santuario del Quetzal y bosque nublado',
    ecosistemas: ['Bosque Nublado', 'Bosque Mixto'],
    estado: 'Habilitado'
  }
];

export const zonasCobertura: ZonaCobertura[] = [
  {
    id: '1',
    nombre: 'Sector Norte - Tikal',
    descripcion: 'Zona que incluye templo IV y área de acampar',
    areaProtegida: '1',
    coordenadas: { lat: 17.2400, lng: -89.6200 },
    radio: 2000,
    puntosControl: [
      {
        id: '1',
        nombre: 'Entrada Principal Norte',
        descripcion: 'Control de acceso principal',
        coordenadas: { lat: 17.2450, lng: -89.6180 },
        tipo: 'Entrada',
        frecuenciaControl: 'Diaria'
      },
      {
        id: '2',
        nombre: 'Mirador Templo IV',
        descripcion: 'Punto de observación turística',
        coordenadas: { lat: 17.2380, lng: -89.6220 },
        tipo: 'Mirador',
        frecuenciaControl: 'Diaria'
      }
    ],
    guardarecursosAsignados: ['1', '2']
  },
  {
    id: '2',
    nombre: 'Cráter Principal - Pacaya',
    descripcion: 'Zona del cráter activo y rutas de ascenso',
    areaProtegida: '2',
    coordenadas: { lat: 14.3820, lng: -90.6010 },
    radio: 1500,
    puntosControl: [
      {
        id: '3',
        nombre: 'Base del Volcán',
        descripcion: 'Inicio del sendero de ascenso',
        coordenadas: { lat: 14.3800, lng: -90.6020 },
        tipo: 'Entrada',
        frecuenciaControl: 'Diaria'
      }
    ],
    guardarecursosAsignados: ['3']
  }
];

export const equiposAsignados: EquipoAsignado[] = [
  {
    id: '1',
    nombre: 'Radio Motorola XTN446',
    tipo: 'Radio',
    codigo: 'RAD-001',
    marca: 'Motorola',
    modelo: 'XTN446',
    fechaAsignacion: '2024-01-15',
    estado: 'Operativo'
  },
  {
    id: '2',
    nombre: 'GPS Garmin eTrex 32x',
    tipo: 'GPS',
    codigo: 'GPS-001',
    marca: 'Garmin',
    modelo: 'eTrex 32x',
    fechaAsignacion: '2024-01-15',
    estado: 'Operativo'
  },
  {
    id: '3',
    nombre: 'Binoculares Bushnell 10x42',
    tipo: 'Binoculares',
    codigo: 'BIN-001',
    marca: 'Bushnell',
    modelo: '10x42',
    fechaAsignacion: '2024-02-01',
    estado: 'Operativo'
  }
];

export const guardarecursos: Guardarecurso[] = [
  {
    id: '1',
    nombre: 'Carlos',
    apellido: 'Mendoza',
    cedula: '1234567890101',
    telefono: '+502 5555-1234',
    email: 'carlos.mendoza@conap.gob.gt',
    fechaIngreso: '2020-03-15',
    puesto: 'Jefe de Área',
    areaAsignada: '1',
    zonaCobertura: ['1'],
    estado: 'Activo',
    equiposAsignados: [equiposAsignados[0], equiposAsignados[1]],
    actividades: []
  },
  {
    id: '2',
    nombre: 'María',
    apellido: 'García',
    cedula: '1234567890102',
    telefono: '+502 5555-5678',
    email: 'maria.garcia@conap.gob.gt',
    fechaIngreso: '2019-07-20',
    puesto: 'Coordinador',
    areaAsignada: '1',
    zonaCobertura: ['1'],
    estado: 'Activo',
    equiposAsignados: [equiposAsignados[2]],
    actividades: []
  },
  {
    id: '3',
    nombre: 'José',
    apellido: 'López',
    cedula: '1234567890103',
    telefono: '+502 5555-9012',
    email: 'jose.lopez@conap.gob.gt',
    fechaIngreso: '2021-01-10',
    puesto: 'Guardarecurso',
    areaAsignada: '2',
    zonaCobertura: ['2'],
    estado: 'Activo',
    equiposAsignados: [],
    actividades: []
  },
  {
    id: '4',
    nombre: 'Ana',
    apellido: 'Rodríguez',
    cedula: '1234567890104',
    telefono: '+502 5555-3456',
    email: 'ana.rodriguez@conap.gob.gt',
    fechaIngreso: '2022-05-15',
    puesto: 'Guardarecurso',
    areaAsignada: '3',
    zonaCobertura: [],
    estado: 'Activo',
    equiposAsignados: [],
    actividades: []
  },
  {
    id: '5',
    nombre: 'Pedro',
    apellido: 'Martínez',
    cedula: '1234567890105',
    telefono: '+502 5555-7890',
    email: 'pedro.martinez@conap.gob.gt',
    fechaIngreso: '2018-11-08',
    puesto: 'Guardarecurso Senior',
    areaAsignada: '4',
    zonaCobertura: [],
    estado: 'Activo',
    equiposAsignados: [],
    actividades: []
  },
  {
    id: '6',
    nombre: 'Sofía',
    apellido: 'Hernández',
    cedula: '1234567890106',
    telefono: '+502 5555-2345',
    email: 'sofia.hernandez@conap.gob.gt',
    fechaIngreso: '2023-02-14',
    puesto: 'Guardarecurso Auxiliar',
    areaAsignada: '5',
    zonaCobertura: [],
    estado: 'Activo',
    equiposAsignados: [],
    actividades: []
  },
  {
    id: '7',
    nombre: 'Luis',
    apellido: 'Ramírez',
    cedula: '1234567890107',
    telefono: '+502 5555-6789',
    email: 'luis.ramirez@conap.gob.gt',
    fechaIngreso: '2021-09-20',
    puesto: 'Coordinador',
    areaAsignada: '2',
    zonaCobertura: [],
    estado: 'Suspendido',
    equiposAsignados: [],
    actividades: []
  },
  {
    id: '8',
    nombre: 'Carmen',
    apellido: 'Flores',
    cedula: '1234567890108',
    telefono: '+502 5555-4567',
    email: 'carmen.flores@conap.gob.gt',
    fechaIngreso: '2020-06-30',
    puesto: 'Guardarecurso',
    areaAsignada: '3',
    zonaCobertura: [],
    estado: 'Activo',
    equiposAsignados: [],
    actividades: []
  },
  {
    id: '9',
    nombre: 'Roberto',
    apellido: 'Morales',
    cedula: '1234567890109',
    telefono: '+502 5555-8901',
    email: 'roberto.morales@conap.gob.gt',
    fechaIngreso: '2017-04-12',
    puesto: 'Jefe de Área',
    areaAsignada: '4',
    zonaCobertura: [],
    estado: 'Activo',
    equiposAsignados: [],
    actividades: []
  },
  {
    id: '10',
    nombre: 'Gabriela',
    apellido: 'Castro',
    cedula: '1234567890110',
    telefono: '+502 5555-3210',
    email: 'gabriela.castro@conap.gob.gt',
    fechaIngreso: '2022-08-25',
    puesto: 'Guardarecurso',
    areaAsignada: '1',
    zonaCobertura: [],
    estado: 'Activo',
    equiposAsignados: [],
    actividades: []
  },
  {
    id: '11',
    nombre: 'Miguel',
    apellido: 'Vargas',
    cedula: '1234567890111',
    telefono: '+502 5555-5432',
    email: 'miguel.vargas@conap.gob.gt',
    fechaIngreso: '2019-12-03',
    puesto: 'Guardarecurso Senior',
    areaAsignada: '2',
    zonaCobertura: [],
    estado: 'Desactivado',
    equiposAsignados: [],
    actividades: []
  },
  {
    id: '12',
    nombre: 'Isabel',
    apellido: 'Ortiz',
    cedula: '1234567890112',
    telefono: '+502 5555-7654',
    email: 'isabel.ortiz@conap.gob.gt',
    fechaIngreso: '2023-05-18',
    puesto: 'Guardarecurso Auxiliar',
    areaAsignada: '5',
    zonaCobertura: [],
    estado: 'Activo',
    equiposAsignados: [],
    actividades: []
  },
  {
    id: '13',
    nombre: 'Fernando',
    apellido: 'Reyes',
    cedula: '1234567890113',
    telefono: '+502 5555-9876',
    email: 'fernando.reyes@conap.gob.gt',
    fechaIngreso: '2021-03-22',
    puesto: 'Guardarecurso',
    areaAsignada: '3',
    zonaCobertura: [],
    estado: 'Suspendido',
    equiposAsignados: [],
    actividades: []
  },
  {
    id: '14',
    nombre: 'Claudia',
    apellido: 'Guzmán',
    cedula: '1234567890114',
    telefono: '+502 5555-1357',
    email: 'claudia.guzman@conap.gob.gt',
    fechaIngreso: '2020-10-07',
    puesto: 'Coordinador',
    areaAsignada: '4',
    zonaCobertura: [],
    estado: 'Activo',
    equiposAsignados: [],
    actividades: []
  },
  {
    id: '15',
    nombre: 'Andrés',
    apellido: 'Díaz',
    cedula: '1234567890115',
    telefono: '+502 5555-2468',
    email: 'andres.diaz@conap.gob.gt',
    fechaIngreso: '2018-07-14',
    puesto: 'Guardarecurso Senior',
    areaAsignada: '1',
    zonaCobertura: [],
    estado: 'Activo',
    equiposAsignados: [],
    actividades: []
  },
  {
    id: '16',
    nombre: 'Patricia',
    apellido: 'Sánchez',
    cedula: '1234567890116',
    telefono: '+502 5555-3698',
    email: 'patricia.sanchez@conap.gob.gt',
    fechaIngreso: '2022-11-30',
    puesto: 'Guardarecurso',
    areaAsignada: '2',
    zonaCobertura: [],
    estado: 'Desactivado',
    equiposAsignados: [],
    actividades: []
  },
  {
    id: '17',
    nombre: 'Ricardo',
    apellido: 'Torres',
    cedula: '1234567890117',
    telefono: '+502 5555-1478',
    email: 'ricardo.torres@conap.gob.gt',
    fechaIngreso: '2019-01-17',
    puesto: 'Jefe de Área',
    areaAsignada: '5',
    zonaCobertura: [],
    estado: 'Activo',
    equiposAsignados: [],
    actividades: []
  },
  {
    id: '18',
    nombre: 'Beatriz',
    apellido: 'Ruiz',
    cedula: '1234567890118',
    telefono: '+502 5555-2589',
    email: 'beatriz.ruiz@conap.gob.gt',
    fechaIngreso: '2023-08-09',
    puesto: 'Guardarecurso Auxiliar',
    areaAsignada: '3',
    zonaCobertura: [],
    estado: 'Activo',
    equiposAsignados: [],
    actividades: []
  }
];

export const evidenciasFotograficas: EvidenciaFotografica[] = [
  {
    id: '1',
    url: '/evidencia/fauna-1.jpg',
    descripcion: 'Jaguar avistado en sendero principal',
    coordenadas: { lat: 17.2350, lng: -89.6210 },
    fecha: '2025-10-15T08:30:00Z',
    tipo: 'Fauna'
  },
  {
    id: '2',
    url: '/evidencia/irregularidad-1.jpg',
    descripcion: 'Basura dejada por visitantes',
    coordenadas: { lat: 17.2380, lng: -89.6200 },
    fecha: '2025-10-15T14:15:00Z',
    tipo: 'Irregularidad'
  }
];

export const actividades: Actividad[] = [
  {
    id: '1',
    tipo: 'Patrullaje de Control y Vigilancia',
    descripcion: 'Patrullaje rutinario sector norte',
    fecha: '2025-10-16',
    horaInicio: '06:00',
    horaFin: '14:00',
    ubicacion: 'Sendero Principal Norte',
    coordenadas: { lat: 17.2400, lng: -89.6200 },
    ruta: [
      { lat: 17.2400, lng: -89.6200, timestamp: '2025-10-16T06:00:00Z' },
      { lat: 17.2420, lng: -89.6180, timestamp: '2025-10-16T07:30:00Z' },
      { lat: 17.2380, lng: -89.6220, timestamp: '2025-10-16T10:00:00Z' }
    ],
    estado: 'Programada',
    observaciones: 'Ruta matutina por sector norte',
    evidencias: [evidenciasFotograficas[0]],
    guardarecurso: '1',
    hallazgos: []
  },
  {
    id: '2',
    tipo: 'Mantenimiento de Área Protegida',
    descripcion: 'Mantenimiento de senderos y señalización',
    fecha: '2025-10-16',
    horaInicio: '08:00',
    horaFin: '12:00',
    ubicacion: 'Sendero El Mirador',
    coordenadas: { lat: 17.2450, lng: -89.6400 },
    estado: 'Programada',
    observaciones: 'Reparación de señales informativas y limpieza de sendero',
    guardarecurso: '2',
    hallazgos: []
  },
  {
    id: '3',
    tipo: 'Reforestación de Área Protegida',
    descripcion: 'Plantación de árboles nativos en zona degradada',
    fecha: '2025-10-16',
    horaInicio: '07:00',
    horaFin: '11:00',
    ubicacion: 'Zona Norte - Sector Reforestación',
    coordenadas: { lat: 17.2300, lng: -89.6150 },
    estado: 'Programada',
    observaciones: 'Plantar 150 árboles de especies nativas: ceiba, caoba y chicozapote',
    guardarecurso: '3',
    hallazgos: []
  },
  {
    id: '4',
    tipo: 'Patrullaje de Control y Vigilancia',
    descripcion: 'Verificación de límites del área protegida',
    fecha: '2025-10-17',
    horaInicio: '07:00',
    ubicacion: 'Límite Este',
    estado: 'Programada',
    guardarecurso: '2'
  },
  {
    id: '5',
    tipo: 'Actividades de Prevención y Atención de Incendios Forestales',
    descripcion: 'Capacitación en prevención y combate de incendios',
    fecha: '2025-10-18',
    horaInicio: '09:00',
    horaFin: '11:00',
    ubicacion: 'Centro de Visitantes',
    estado: 'Programada',
    observaciones: 'Capacitación teórica y práctica para el equipo de guardarecursos',
    guardarecurso: '1'
  }
];

export const hallazgos: Hallazgo[] = [
  {
    id: '1',
    tipo: 'Irregularidad',
    titulo: 'Basura acumulada en sendero',
    descripcion: 'Gran cantidad de basura dejada por visitantes en el sendero principal',
    ubicacion: 'Sendero Principal Norte',
    coordenadas: { lat: 17.2380, lng: -89.6200 },
    fecha: '2025-10-15',
    guardarecurso: '1',
    gravedad: 'Media',
    estado: 'Reportado',
    evidencias: [evidenciasFotograficas[1]],
    seguimientos: []
  }
];

export const incidentesVisitantes: IncidenteVisitante[] = [
  {
    id: '1',
    tipo: 'Accidente',
    titulo: 'Visitante se resbaló en sendero',
    descripcion: 'Turista se resbaló en sendero húmedo, lesión menor en tobillo',
    ubicacion: 'Sendero a Templo IV',
    coordenadas: { lat: 17.2390, lng: -89.6210 },
    fecha: '2025-10-14T11:30:00Z',
    guardarecurso: '1',
    visitantesInvolucrados: ['Juan Pérez - Pasaporte: A123456'],
    gravedad: 'Leve',
    estado: 'Resuelto',
    acciones: [
      {
        id: '1',
        incidenteId: '1',
        fecha: '2025-10-14T11:35:00Z',
        descripcion: 'Se brindaron primeros auxilios y se acompañó al centro médico',
        usuario: 'Carlos Mendoza',
        tipo: 'Primeros Auxilios'
      }
    ]
  }
];

export const reportesPeriodicos: ReportePeriodico[] = [
  {
    id: '1',
    titulo: 'Reporte Mensual Octubre 2025 - Tikal',
    tipo: 'Mensual',
    fechaCreacion: '2025-10-15',
    periodo: {
      inicio: '2025-10-01',
      fin: '2025-10-15'
    },
    areaProtegida: '1',
    resumen: 'Primera quincena con actividad normal, incremento en visitantes del 15%',
    datos: {
      actividades: 35,
      patrullajes: 25,
      hallazgos: 3,
      incidentes: 2,
      visitantes: 1450,
      horasTrabajadas: 672
    },
    estado: 'Enviado'
  }
];

// ===== USUARIOS DEL SISTEMA =====
// 
// ⚠️ USUARIOS PARA PROBAR LA APLICACIÓN:
// 
// 1. ADMINISTRADOR:
//    Email: carlos.mendoza@conap.gob.gt
//    Password: conap123
//    - Vista inicial: Dashboard
//    - Acceso: Completo excepto crear actividades en Registro Diario y crear Incidentes
//
// 2. COORDINADOR:
//    Email: maria.garcia@conap.gob.gt
//    Password: conap123
//    - Vista inicial: Dashboard
//    - Acceso: Todo excepto Gestión de Usuarios
//
// 3. GUARDARECURSO:
//    Email: jose.lopez@conap.gob.gt
//    Password: conap123
//    - Vista inicial: Registro Diario de Campo
//    - Acceso: Solo 3 módulos (Control Equipos, Registro Diario, Incidentes)
//
export const usuarios: Usuario[] = [
  // USUARIO 1: ADMINISTRADOR
  {
    id: '1',
    nombre: 'Carlos',
    apellido: 'Mendoza',
    email: 'carlos.mendoza@conap.gob.gt',
    telefono: '+502 5555-1234',
    password: 'conap123', // ⚠️ En producción, esto debe estar hasheado
    rol: 'Administrador',
    estado: 'Activo',
    fechaCreacion: '2024-01-15',
    ultimoAcceso: '2025-10-15T08:00:00Z',
    permisos: ['admin.all'],
    areaAsignada: '1'
  },
  {
    id: '2',
    nombre: 'María',
    apellido: 'García',
    email: 'maria.garcia@conap.gob.gt',
    telefono: '+502 5555-5678',
    password: 'conap123',
    rol: 'Coordinador',
    estado: 'Activo',
    fechaCreacion: '2024-01-20',
    ultimoAcceso: '2025-10-15T16:30:00Z',
    permisos: ['coord.area', 'coord.actividades'],
    areaAsignada: '1'
  },
  {
    id: '3',
    nombre: 'José',
    apellido: 'López',
    email: 'jose.lopez@conap.gob.gt',
    telefono: '+502 5555-9012',
    password: 'conap123',
    rol: 'Guardarecurso',
    estado: 'Activo',
    fechaCreacion: '2024-02-10',
    ultimoAcceso: '2025-10-15T10:15:00Z',
    permisos: ['guarda.view', 'guarda.create.incidentes', 'guarda.create.fotos'],
    areaAsignada: '2'
  }
];

// Crear las áreas protegidas con guardarecursos asignados
export const areasProtegidas: AreaProtegida[] = areasProtegidasBase.map(area => ({
  ...area,
  guardarecursos: guardarecursos.filter(gr => gr.areaAsignada === area.id)
}));