/**
 * Cliente API Base para la aplicación CONAP
 * Configuración de Axios con interceptores JWT y manejo de errores
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, API_TIMEOUT, STORAGE_KEYS } from './config';

/**
 * Instancia de Axios configurada con:
 * - Base URL del backend
 * - Timeout de 30 segundos
 * - Headers por defecto
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor de Request: Agrega el token JWT automáticamente
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de Response: Maneja errores globalmente
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Manejo de errores de autenticación
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token inválido o expirado - limpiar sesión
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      
      // Redirigir al login (solo si no estamos ya en login)
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }

    // Log detallado del error para debugging
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data || error.message,
    });

    return Promise.reject(error);
  }
);

/**
 * Interface para respuestas estándar de la API
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

/**
 * Interface para errores de la API
 */
export interface ApiError {
  success: false;
  message: string;
}

/**
 * Función helper para extraer mensaje de error
 */
export const getErrorMessage = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'Error desconocido en la solicitud';
};

export default apiClient;
