/**
 * Servicio de Autenticación
 * Maneja login, logout y gestión de sesión con JWT
 */

import { apiClient, ApiResponse, getErrorMessage } from './api-client';
import { STORAGE_KEYS } from './config';
import type { Usuario } from '../../types/database.types';

/**
 * Credenciales de login
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Respuesta del endpoint de login
 */
export interface LoginResponse {
  success: boolean;
  token: string;
  usuario: Usuario;
  rol: { rol_nombre: string };
  estado: { estado_nombre: string };
  area: { area_nombre: string } | null;
}

/**
 * Datos del usuario almacenados en localStorage
 */
export interface StoredUserData {
  usuario: Usuario;
  rol: { rol_nombre: string };
  estado: { estado_nombre: string };
  area: { area_nombre: string } | null;
}

class AuthService {
  /**
   * Realiza el login del usuario
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
      
      const { token, usuario, rol, estado, area } = response.data;

      // Guardar token en localStorage
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);

      // Guardar datos del usuario
      const userData: StoredUserData = { usuario, rol, estado, area };
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));

      return response.data;
    } catch (error: any) {
      console.error('Error en login:', error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    window.location.href = '/';
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    return !!token;
  }

  /**
   * Obtiene el token JWT actual
   */
  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  /**
   * Obtiene los datos del usuario actual
   */
  getCurrentUser(): StoredUserData | null {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (!userData) return null;

    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error('Error al parsear datos de usuario:', error);
      return null;
    }
  }

  /**
   * Obtiene el rol del usuario actual
   */
  getCurrentUserRole(): string | null {
    const userData = this.getCurrentUser();
    return userData?.rol?.rol_nombre || null;
  }

  /**
   * Verifica si el usuario tiene un rol específico
   */
  hasRole(roleName: string): boolean {
    const currentRole = this.getCurrentUserRole();
    return currentRole === roleName;
  }

  /**
   * Verifica si el usuario es Administrador
   */
  isAdmin(): boolean {
    return this.hasRole('Administrador');
  }

  /**
   * Verifica si el usuario es Coordinador
   */
  isCoordinator(): boolean {
    return this.hasRole('Coordinador');
  }

  /**
   * Verifica si el usuario es Guardarecurso
   */
  isGuardarecurso(): boolean {
    return this.hasRole('Guardarecurso');
  }
}

// Exportar instancia única del servicio
export const authService = new AuthService();
export default authService;
