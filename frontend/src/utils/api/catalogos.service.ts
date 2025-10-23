/**
 * Servicio de Catálogos
 * Obtiene datos de tablas de catálogo (roles, estados, tipos, etc.)
 */

import { apiClient, ApiResponse, getErrorMessage } from './api-client';

/**
 * Rol de usuario
 */
export interface Rol {
  rol_id: number;
  rol_nombre: string;
  rol_descripcion?: string;
}

/**
 * Estado general
 */
export interface Estado {
  estado_id: number;
  estado_nombre: string;
  estado_descripcion?: string;
}

/**
 * Tipo de incidente
 */
export interface TipoIncidente {
  tipo_incidente_id: number;
  tipo_incidente_nombre: string;
  tipo_incidente_descripcion?: string;
}

/**
 * Tipo de actividad
 */
export interface TipoActividad {
  tipo_actividad_id: number;
  tipo_actividad_nombre: string;
  tipo_actividad_descripcion?: string;
}

/**
 * Tipo de hallazgo
 */
export interface TipoHallazgo {
  tipo_hallazgo_id: number;
  tipo_hallazgo_nombre: string;
  tipo_hallazgo_descripcion?: string;
}

/**
 * Tipo de equipo
 */
export interface TipoEquipo {
  tipo_equipo_id: number;
  tipo_equipo_nombre: string;
  tipo_equipo_descripcion?: string;
}

/**
 * Categoría de zona
 */
export interface CategoriaZona {
  categoria_zona_id: number;
  categoria_zona_nombre: string;
  categoria_zona_descripcion?: string;
}

class CatalogosService {
  /**
   * Obtiene todos los roles de usuario
   */
  async getRoles(): Promise<Rol[]> {
    try {
      const response = await apiClient.get<ApiResponse<Rol[]>>('/catalogos/roles');
      return response.data.data || [];
    } catch (error: any) {
      console.error('Error al obtener roles:', error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Obtiene todos los estados
   */
  async getEstados(): Promise<Estado[]> {
    try {
      const response = await apiClient.get<ApiResponse<Estado[]>>('/catalogos/estados');
      return response.data.data || [];
    } catch (error: any) {
      console.error('Error al obtener estados:', error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Obtiene todos los tipos de incidente
   */
  async getTiposIncidente(): Promise<TipoIncidente[]> {
    try {
      const response = await apiClient.get<ApiResponse<TipoIncidente[]>>('/catalogos/tipos-incidente');
      return response.data.data || [];
    } catch (error: any) {
      console.error('Error al obtener tipos de incidente:', error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Obtiene todos los tipos de actividad
   */
  async getTiposActividad(): Promise<TipoActividad[]> {
    try {
      const response = await apiClient.get<ApiResponse<TipoActividad[]>>('/catalogos/tipos-actividad');
      return response.data.data || [];
    } catch (error: any) {
      console.error('Error al obtener tipos de actividad:', error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Obtiene todos los tipos de hallazgo
   */
  async getTiposHallazgo(): Promise<TipoHallazgo[]> {
    try {
      const response = await apiClient.get<ApiResponse<TipoHallazgo[]>>('/catalogos/tipos-hallazgo');
      return response.data.data || [];
    } catch (error: any) {
      console.error('Error al obtener tipos de hallazgo:', error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Obtiene todos los tipos de equipo
   */
  async getTiposEquipo(): Promise<TipoEquipo[]> {
    try {
      const response = await apiClient.get<ApiResponse<TipoEquipo[]>>('/catalogos/tipos-equipo');
      return response.data.data || [];
    } catch (error: any) {
      console.error('Error al obtener tipos de equipo:', error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Obtiene todas las categorías de zona
   */
  async getCategoriasZona(): Promise<CategoriaZona[]> {
    try {
      const response = await apiClient.get<ApiResponse<CategoriaZona[]>>('/catalogos/categorias-zona');
      return response.data.data || [];
    } catch (error: any) {
      console.error('Error al obtener categorías de zona:', error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Obtiene todos los catálogos en una sola llamada
   */
  async getAllCatalogos(): Promise<{
    roles: Rol[];
    estados: Estado[];
    tiposIncidente: TipoIncidente[];
    tiposActividad: TipoActividad[];
    tiposHallazgo: TipoHallazgo[];
    tiposEquipo: TipoEquipo[];
    categoriasZona: CategoriaZona[];
  }> {
    try {
      const [roles, estados, tiposIncidente, tiposActividad, tiposHallazgo, tiposEquipo, categoriasZona] = 
        await Promise.all([
          this.getRoles(),
          this.getEstados(),
          this.getTiposIncidente(),
          this.getTiposActividad(),
          this.getTiposHallazgo(),
          this.getTiposEquipo(),
          this.getCategoriasZona(),
        ]);

      return {
        roles,
        estados,
        tiposIncidente,
        tiposActividad,
        tiposHallazgo,
        tiposEquipo,
        categoriasZona,
      };
    } catch (error: any) {
      console.error('Error al obtener todos los catálogos:', error);
      throw new Error(getErrorMessage(error));
    }
  }
}

// Exportar instancia única del servicio
export const catalogosService = new CatalogosService();
export default catalogosService;
