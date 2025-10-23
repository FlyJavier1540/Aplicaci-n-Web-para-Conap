/**
 * Servicio de Incidentes
 * Maneja registro y seguimiento de incidentes en áreas protegidas
 */

import { apiClient, ApiResponse, getErrorMessage } from './api-client';
import type { Incidente } from '../../types/database.types';

/**
 * Datos para crear un nuevo incidente
 */
export interface CreateIncidenteData {
  incidente_tipo: number;
  incidente_descripcion: string;
  incidente_fecha: string;
  incidente_ubicacion: string;
  incidente_latitud?: number;
  incidente_longitud?: number;
  incidente_reportado_por: number;
  incidente_area: number;
  incidente_estado: number;
  incidente_gravedad?: string;
  incidente_observaciones?: string;
}

/**
 * Datos para actualizar un incidente
 */
export interface UpdateIncidenteData {
  incidente_tipo: number;
  incidente_descripcion: string;
  incidente_fecha: string;
  incidente_ubicacion: string;
  incidente_latitud?: number;
  incidente_longitud?: number;
  incidente_reportado_por: number;
  incidente_area: number;
  incidente_estado: number;
  incidente_gravedad?: string;
  incidente_observaciones?: string;
}

class IncidentesService {
  /**
   * Obtiene todos los incidentes
   */
  async getAll(): Promise<Incidente[]> {
    try {
      const response = await apiClient.get<ApiResponse<Incidente[]>>('/incidentes');
      return response.data.data || [];
    } catch (error: any) {
      console.error('Error al obtener incidentes:', error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Obtiene un incidente por ID
   */
  async getById(id: number): Promise<Incidente> {
    try {
      const response = await apiClient.get<ApiResponse<Incidente>>(`/incidentes/${id}`);
      return response.data.data!;
    } catch (error: any) {
      console.error(`Error al obtener incidente ${id}:`, error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Crea un nuevo incidente
   */
  async create(data: CreateIncidenteData): Promise<Incidente> {
    try {
      const response = await apiClient.post<ApiResponse<Incidente>>('/incidentes', data);
      return response.data.data!;
    } catch (error: any) {
      console.error('Error al crear incidente:', error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Actualiza un incidente existente
   */
  async update(id: number, data: UpdateIncidenteData): Promise<Incidente> {
    try {
      const response = await apiClient.put<ApiResponse<Incidente>>(`/incidentes/${id}`, data);
      return response.data.data!;
    } catch (error: any) {
      console.error(`Error al actualizar incidente ${id}:`, error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Elimina un incidente
   */
  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete<ApiResponse>(`/incidentes/${id}`);
    } catch (error: any) {
      console.error(`Error al eliminar incidente ${id}:`, error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Obtiene incidentes por área protegida
   */
  async getByArea(areaId: number): Promise<Incidente[]> {
    try {
      const allIncidentes = await this.getAll();
      return allIncidentes.filter(inc => inc.incidente_area === areaId);
    } catch (error: any) {
      console.error(`Error al filtrar incidentes por área ${areaId}:`, error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Obtiene incidentes por tipo
   */
  async getByTipo(tipoId: number): Promise<Incidente[]> {
    try {
      const allIncidentes = await this.getAll();
      return allIncidentes.filter(inc => inc.incidente_tipo === tipoId);
    } catch (error: any) {
      console.error(`Error al filtrar incidentes por tipo ${tipoId}:`, error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Obtiene incidentes por gravedad
   */
  async getByGravedad(gravedad: string): Promise<Incidente[]> {
    try {
      const allIncidentes = await this.getAll();
      return allIncidentes.filter(inc => inc.incidente_gravedad === gravedad);
    } catch (error: any) {
      console.error(`Error al filtrar incidentes por gravedad ${gravedad}:`, error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Obtiene incidentes por rango de fechas
   */
  async getByDateRange(fechaInicio: string, fechaFin: string): Promise<Incidente[]> {
    try {
      const allIncidentes = await this.getAll();
      return allIncidentes.filter(inc => {
        const incFecha = new Date(inc.incidente_fecha);
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        return incFecha >= inicio && incFecha <= fin;
      });
    } catch (error: any) {
      console.error(`Error al filtrar incidentes por rango de fechas:`, error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Obtiene incidentes pendientes de resolución
   */
  async getPendientes(): Promise<Incidente[]> {
    try {
      const allIncidentes = await this.getAll();
      // Estado 1 = Pendiente (ajustar según tu catálogo)
      return allIncidentes.filter(inc => inc.incidente_estado === 1);
    } catch (error: any) {
      console.error('Error al filtrar incidentes pendientes:', error);
      throw new Error(getErrorMessage(error));
    }
  }
}

// Exportar instancia única del servicio
export const incidentesService = new IncidentesService();
export default incidentesService;
