/**
 * Servicio de Actividades
 * Maneja registro y planificación de actividades de campo
 */

import { apiClient, ApiResponse, getErrorMessage } from './api-client';
import type { Actividad } from '../../types/database.types';

/**
 * Datos para crear una nueva actividad
 */
export interface CreateActividadData {
  actividad_tipo: number;
  actividad_descripcion: string;
  actividad_fecha_inicio: string;
  actividad_fecha_fin: string;
  actividad_responsable: number;
  actividad_area: number;
  actividad_estado: number;
  actividad_observaciones?: string;
}

/**
 * Datos para actualizar una actividad
 */
export interface UpdateActividadData {
  actividad_tipo: number;
  actividad_descripcion: string;
  actividad_fecha_inicio: string;
  actividad_fecha_fin: string;
  actividad_responsable: number;
  actividad_area: number;
  actividad_estado: number;
  actividad_observaciones?: string;
}

class ActividadesService {
  /**
   * Obtiene todas las actividades
   */
  async getAll(): Promise<Actividad[]> {
    try {
      const response = await apiClient.get<ApiResponse<Actividad[]>>('/actividades');
      return response.data.data || [];
    } catch (error: any) {
      console.error('Error al obtener actividades:', error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Obtiene una actividad por ID
   */
  async getById(id: number): Promise<Actividad> {
    try {
      const response = await apiClient.get<ApiResponse<Actividad>>(`/actividades/${id}`);
      return response.data.data!;
    } catch (error: any) {
      console.error(`Error al obtener actividad ${id}:`, error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Crea una nueva actividad
   */
  async create(data: CreateActividadData): Promise<Actividad> {
    try {
      const response = await apiClient.post<ApiResponse<Actividad>>('/actividades', data);
      return response.data.data!;
    } catch (error: any) {
      console.error('Error al crear actividad:', error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Actualiza una actividad existente
   */
  async update(id: number, data: UpdateActividadData): Promise<Actividad> {
    try {
      const response = await apiClient.put<ApiResponse<Actividad>>(`/actividades/${id}`, data);
      return response.data.data!;
    } catch (error: any) {
      console.error(`Error al actualizar actividad ${id}:`, error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Elimina una actividad
   */
  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete<ApiResponse>(`/actividades/${id}`);
    } catch (error: any) {
      console.error(`Error al eliminar actividad ${id}:`, error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Obtiene actividades por área protegida
   */
  async getByArea(areaId: number): Promise<Actividad[]> {
    try {
      const allActivities = await this.getAll();
      return allActivities.filter(act => act.actividad_area === areaId);
    } catch (error: any) {
      console.error(`Error al filtrar actividades por área ${areaId}:`, error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Obtiene actividades por responsable
   */
  async getByResponsable(usuarioId: number): Promise<Actividad[]> {
    try {
      const allActivities = await this.getAll();
      return allActivities.filter(act => act.actividad_responsable === usuarioId);
    } catch (error: any) {
      console.error(`Error al filtrar actividades por responsable ${usuarioId}:`, error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Obtiene actividades por rango de fechas
   */
  async getByDateRange(fechaInicio: string, fechaFin: string): Promise<Actividad[]> {
    try {
      const allActivities = await this.getAll();
      return allActivities.filter(act => {
        const actFecha = new Date(act.actividad_fecha_inicio);
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        return actFecha >= inicio && actFecha <= fin;
      });
    } catch (error: any) {
      console.error(`Error al filtrar actividades por rango de fechas:`, error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Obtiene actividades pendientes
   */
  async getPendientes(): Promise<Actividad[]> {
    try {
      const allActivities = await this.getAll();
      // Estado 1 = Pendiente (ajustar según tu catálogo)
      return allActivities.filter(act => act.actividad_estado === 1);
    } catch (error: any) {
      console.error('Error al filtrar actividades pendientes:', error);
      throw new Error(getErrorMessage(error));
    }
  }
}

// Exportar instancia única del servicio
export const actividadesService = new ActividadesService();
export default actividadesService;
