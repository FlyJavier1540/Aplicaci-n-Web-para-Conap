/**
 * Servicio de Usuarios
 * Maneja CRUD completo de usuarios del sistema
 */

import { apiClient, ApiResponse, getErrorMessage } from './api-client';
import type { Usuario } from '../../types/database.types';

/**
 * Datos para crear un nuevo usuario
 */
export interface CreateUsuarioData {
  usuario_nombre: string;
  usuario_apellido: string;
  usuario_dpi: string;
  usuario_correo: string;
  usuario_telefono?: string;
  usuario_contrasenia: string;
  usuario_rol: number;
  usuario_area?: number | null;
  usuario_estado: number;
}

/**
 * Datos para actualizar un usuario existente
 */
export interface UpdateUsuarioData {
  usuario_nombre: string;
  usuario_apellido: string;
  usuario_dpi: string;
  usuario_correo: string;
  usuario_telefono?: string;
  usuario_rol: number;
  usuario_area?: number | null;
  usuario_estado: number;
}

class UsuariosService {
  /**
   * Obtiene todos los usuarios del sistema
   */
  async getAll(): Promise<Usuario[]> {
    try {
      const response = await apiClient.get<ApiResponse<Usuario[]>>('/usuarios');
      return response.data.data || [];
    } catch (error: any) {
      console.error('Error al obtener usuarios:', error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Obtiene un usuario por ID
   */
  async getById(id: number): Promise<Usuario> {
    try {
      const response = await apiClient.get<ApiResponse<Usuario>>(`/usuarios/${id}`);
      return response.data.data!;
    } catch (error: any) {
      console.error(`Error al obtener usuario ${id}:`, error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Crea un nuevo usuario
   */
  async create(data: CreateUsuarioData): Promise<Usuario> {
    try {
      const response = await apiClient.post<ApiResponse<Usuario>>('/usuarios', data);
      return response.data.data!;
    } catch (error: any) {
      console.error('Error al crear usuario:', error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Actualiza un usuario existente
   */
  async update(id: number, data: UpdateUsuarioData): Promise<Usuario> {
    try {
      const response = await apiClient.put<ApiResponse<Usuario>>(`/usuarios/${id}`, data);
      return response.data.data!;
    } catch (error: any) {
      console.error(`Error al actualizar usuario ${id}:`, error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Desactiva un usuario (eliminación lógica)
   */
  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete<ApiResponse>(`/usuarios/${id}`);
    } catch (error: any) {
      console.error(`Error al desactivar usuario ${id}:`, error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Filtra usuarios por rol
   */
  async getByRole(rolId: number): Promise<Usuario[]> {
    try {
      const allUsers = await this.getAll();
      return allUsers.filter(user => user.usuario_rol === rolId);
    } catch (error: any) {
      console.error(`Error al filtrar usuarios por rol ${rolId}:`, error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Filtra usuarios por área protegida
   */
  async getByArea(areaId: number): Promise<Usuario[]> {
    try {
      const allUsers = await this.getAll();
      return allUsers.filter(user => user.usuario_area === areaId);
    } catch (error: any) {
      console.error(`Error al filtrar usuarios por área ${areaId}:`, error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Filtra usuarios activos
   */
  async getActive(): Promise<Usuario[]> {
    try {
      const allUsers = await this.getAll();
      // Estado 1 = Activo (basado en tu catálogo)
      return allUsers.filter(user => user.usuario_estado === 1);
    } catch (error: any) {
      console.error('Error al filtrar usuarios activos:', error);
      throw new Error(getErrorMessage(error));
    }
  }
}

// Exportar instancia única del servicio
export const usuariosService = new UsuariosService();
export default usuariosService;
