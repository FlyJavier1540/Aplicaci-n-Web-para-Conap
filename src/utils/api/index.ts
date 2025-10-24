/**
 * Exportación centralizada de todos los servicios API
 * Punto de entrada único para importar servicios en componentes
 */

// Cliente base
export { apiClient, getErrorMessage } from './api-client';
export type { ApiResponse, ApiError } from './api-client';

// Servicio de Autenticación
export { authService } from './auth.service';
export type { LoginCredentials, LoginResponse, StoredUserData } from './auth.service';

// Servicio de Usuarios
export { usuariosService } from './usuarios.service';
export type { CreateUsuarioData, UpdateUsuarioData } from './usuarios.service';

// Servicio de Catálogos
export { catalogosService } from './catalogos.service';
export type { 
  Rol, 
  Estado, 
  TipoIncidente, 
  TipoActividad, 
  TipoHallazgo, 
  TipoEquipo, 
  CategoriaZona 
} from './catalogos.service';

// Servicio de Áreas Protegidas
export { areasProtegidasService } from './areas-protegidas.service';

// Servicio de Actividades
export { actividadesService } from './actividades.service';
export type { CreateActividadData, UpdateActividadData } from './actividades.service';

// Servicio de Incidentes
export { incidentesService } from './incidentes.service';
export type { CreateIncidenteData, UpdateIncidenteData } from './incidentes.service';

/**
 * EJEMPLO DE USO EN COMPONENTES:
 * 
 * import { authService, usuariosService } from '../utils/api';
 * 
 * // Login
 * const response = await authService.login({ email, password });
 * 
 * // Obtener usuarios
 * const usuarios = await usuariosService.getAll();
 * 
 * // Crear usuario
 * const nuevoUsuario = await usuariosService.create(data);
 */
