// src/utils/constants.js
// Basado en /src/utils/database-mapper.ts y /src/REFERENCIA_BASE_DATOS.md

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
};

export const ROL_MAP = {
    ADMINISTRADOR: 1,
    COORDINADOR: 2,
    GUARDARECURSO: 3
};

// Tipos de Actividad (IDs 1-8)
export const TIPO_ACTIVIDAD_MAP = {
    PATRULLAJE: 1,
    MONITOREO: 2,
    VIGILANCIA: 3,
    MANTENIMIENTO: 4,
    INSPECCION: 5,
    RESCATE: 6,
    CAPACITACION: 7,
    INVESTIGACION: 8
};

// Tipos de Incidente (IDs 9-16)
export const TIPO_INCIDENTE_MAP = {
    INCENDIO_FORESTAL: 9,
    TALA_ILEGAL: 10,
    CAZA_FURTIVA: 11,
    INVASION_TIERRAS: 12,
    CONTAMINACION: 13,
    ACCIDENTE_VISITANTE: 14,
    CONFLICTO_COMUNITARIO: 15,
    EMERGENCIA_MEDICA: 16
};

// Tipos de Equipo (IDs 17-23)
export const TIPO_EQUIPO_MAP = {
    COMUNICACION: 17,
    NAVEGACION: 18,
    SEGURIDAD: 19,
    TRANSPORTE: 20,
    CAMPAMENTO: 21,
    RESCATE: 22,
    MEDICION: 23
};

// Gravedades (Categoría IDs 8-11)
export const GRAVEDAD_MAP = {
    LEVE: 8,
    MODERADO: 9,
    GRAVE: 10,
    CRITICO: 11
};