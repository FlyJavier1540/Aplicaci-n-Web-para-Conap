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
    // Error de red (backend no disponible)
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      console.error('❌ ERROR DE CONEXIÓN:');
      console.error('   El backend NO está disponible en:', API_BASE_URL);
      console.error('');
      console.error('   SOLUCIONES:');
      console.error('   1. Verifica que el backend esté corriendo:');
      console.error('      Terminal → cd backend-guardarrecursos');
      console.error('      Terminal → npm start');
      console.error('');
      console.error('   2. Verifica que el puerto sea correcto (3002)');
      console.error('');
      console.error('   3. Prueba abrir en el navegador:');
      console.error('      http://localhost:3002/api/catalogos/roles');
      console.error('      (Debe mostrar JSON, no error)');
      console.error('');
    }

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
