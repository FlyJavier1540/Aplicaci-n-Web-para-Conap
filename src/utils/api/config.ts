/**
 * Configuración de la API
 * Variables de entorno y constantes de configuración
 */

/**
 * URL base de la API del backend
 * En producción, cambiar a la URL del servidor real
 */
export const API_BASE_URL = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || 
  'http://localhost:3002/api';

// Log de configuración en desarrollo
if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
  console.log('🔧 Configuración API:');
  console.log('   Base URL:', API_BASE_URL);
  console.log('   Modo:', import.meta.env.MODE);
  console.log('');
  console.log('⚠️  IMPORTANTE: Asegúrate que el backend esté corriendo en http://localhost:3002');
  console.log('   Ejecuta: cd backend-guardarrecursos && npm start');
  console.log('');
}

/**
 * Timeout de las peticiones (en milisegundos)
 */
export const API_TIMEOUT = 30000;

/**
 * Claves de localStorage
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'conap_auth_token',
  USER_DATA: 'conap_user_data',
  THEME: 'conap_theme',
} as const;

/**
 * IDs de estados del catálogo
 */
export const ESTADO_IDS = {
  ACTIVO: 1,
  INACTIVO: 2,
  SUSPENDIDO: 3,
  PENDIENTE: 4,
  COMPLETADO: 5,
  EN_PROGRESO: 6,
} as const;

/**
 * IDs de roles del catálogo
 */
export const ROL_IDS = {
  ADMINISTRADOR: 1,
  COORDINADOR: 2,
  GUARDARECURSO: 3,
} as const;

/**
 * Configuración de entorno
 */
export const ENV = {
  isDevelopment: typeof import.meta !== 'undefined' ? import.meta.env?.DEV : false,
  isProduction: typeof import.meta !== 'undefined' ? import.meta.env?.PROD : false,
  apiUrl: API_BASE_URL,
} as const;

export default {
  API_BASE_URL,
  API_TIMEOUT,
  STORAGE_KEYS,
  ESTADO_IDS,
  ROL_IDS,
  ENV,
};
