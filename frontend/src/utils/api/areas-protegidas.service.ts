/**
 * Servicio de Áreas Protegidas
 * Maneja consultas y operaciones sobre áreas protegidas de Guatemala
 */

import { apiClient, ApiResponse, getErrorMessage } from './api-client';
import type { AreaProtegida } from '../../types/database.types';

class AreasProtegidasService {
  /**
   * Obtiene todas las áreas protegidas
   */
  async getAll(): Promise<AreaProtegida[]> {
    try {
      const response = await apiClient.get<ApiResponse<AreaProtegida[]>>('/areas-protegidas');
      return response.data.data || [];
    } catch (error: any) {
      console.error('Error al obtener áreas protegidas:', error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Obtiene un área protegida por ID
   */
  async getById(id: number): Promise<AreaProtegida> {
    try {
      const response = await apiClient.get<ApiResponse<AreaProtegida>>(`/areas-protegidas/${id}`);
      return response.data.data!;
    } catch (error: any) {
      console.error(`Error al obtener área protegida ${id}:`, error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Obtiene áreas protegidas por departamento
   */
  async getByDepartamento(departamento: string): Promise<AreaProtegida[]> {
    try {
      const allAreas = await this.getAll();
      return allAreas.filter(area => area.area_departamento === departamento);
    } catch (error: any) {
      console.error(`Error al filtrar áreas por departamento ${departamento}:`, error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Obtiene áreas protegidas activas
   */
  async getActive(): Promise<AreaProtegida[]> {
    try {
      const allAreas = await this.getAll();
      // Estado 1 = Activo
      return allAreas.filter(area => area.area_estado === 1);
    } catch (error: any) {
      console.error('Error al filtrar áreas protegidas activas:', error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Busca áreas protegidas por nombre (búsqueda parcial)
   */
  async searchByName(searchTerm: string): Promise<AreaProtegida[]> {
    try {
      const allAreas = await this.getAll();
      const lowerSearch = searchTerm.toLowerCase();
      return allAreas.filter(area => 
        area.area_nombre.toLowerCase().includes(lowerSearch)
      );
    } catch (error: any) {
      console.error(`Error al buscar áreas por nombre "${searchTerm}":`, error);
      throw new Error(getErrorMessage(error));
    }
  }
}

// Exportar instancia única del servicio
export const areasProtegidasService = new AreasProtegidasService();
export default areasProtegidasService;
