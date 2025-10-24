/**
 * =============================================
 * EJEMPLO DE SERVICIO API
 * =============================================
 * 
 * Este archivo muestra cómo crear servicios para conectar
 * el frontend con tu API backend.
 * 
 * INSTRUCCIONES:
 * 1. Copia este archivo y renómbralo según el módulo (ej: usuarios.service.ts)
 * 2. Actualiza la URL base con la URL de tu API
 * 3. Implementa los métodos que necesites
 * 4. Usa las funciones de database-mapper.ts para convertir datos
 */

import {
  mapUsuarioDBToApp,
  mapUsuarioAppToDB,
  mapActividadDBToApp,
  mapActividadAppToDB,
  mapIncidenteDBToApp,
  mapIncidenteAppToDB,
  createUbicacion,
  ESTADO_MAP,
  ROL_MAP
} from '../database-mapper';

import type { Usuario, Actividad, IncidenteVisitante } from '../../types';
import type { UsuarioDB, ActividadDB, IncidenteDB } from '../../types/database.types';

// ============================================
// CONFIGURACIÓN
// ============================================

// TODO: Cambiar esta URL por la URL de tu API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Obtener token de autenticación
function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

// Helper para hacer peticiones
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(error.message || `Error ${response.status}`);
  }

  return response.json();
}

// ============================================
// SERVICIO DE AUTENTICACIÓN
// ============================================

export const authService = {
  /**
   * Iniciar sesión
   */
  async login(email: string, password: string): Promise<Usuario> {
    const response = await fetchAPI<{
      success: boolean;
      usuario: UsuarioDB;
      rol: { rol_nombre: string };
      area?: { area_nombre: string };
      estado: { estado_nombre: string };
      token: string;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // Guardar token
    localStorage.setItem('auth_token', response.token);

    // Convertir a formato de app
    const usuarioApp = mapUsuarioDBToApp(
      response.usuario,
      response.rol,
      response.area,
      response.estado
    );

    // Guardar usuario en localStorage
    localStorage.setItem('current_user', JSON.stringify(usuarioApp));

    return usuarioApp;
  },

  /**
   * Cerrar sesión
   */
  async logout(): Promise<void> {
    try {
      await fetchAPI('/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('current_user');
    }
  },

  /**
   * Cambiar contraseña
   */
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    await fetchAPI('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  /**
   * Obtener usuario actual
   */
  getCurrentUser(): Usuario | null {
    const userStr = localStorage.getItem('current_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
};

// ============================================
// SERVICIO DE USUARIOS
// ============================================

export const usuariosService = {
  /**
   * Obtener todos los usuarios
   */
  async getAll(): Promise<Usuario[]> {
    const response = await fetchAPI<{
      success: boolean;
      data: Array<UsuarioDB & {
        rol?: { rol_nombre: string };
        area?: { area_nombre: string };
        estado?: { estado_nombre: string };
      }>;
    }>('/usuarios');

    return response.data.map(u =>
      mapUsuarioDBToApp(u, u.rol, u.area, u.estado)
    );
  },

  /**
   * Obtener un usuario por ID
   */
  async getById(id: string): Promise<Usuario> {
    const response = await fetchAPI<{
      success: boolean;
      data: UsuarioDB & {
        rol?: { rol_nombre: string };
        area?: { area_nombre: string };
        estado?: { estado_nombre: string };
      };
    }>(`/usuarios/${id}`);

    return mapUsuarioDBToApp(
      response.data,
      response.data.rol,
      response.data.area,
      response.data.estado
    );
  },

  /**
   * Crear un nuevo usuario
   */
  async create(usuario: Omit<Usuario, 'id'>): Promise<Usuario> {
    const usuarioDB = mapUsuarioAppToDB(usuario as Usuario);

    const response = await fetchAPI<{
      success: boolean;
      data: UsuarioDB & {
        rol?: { rol_nombre: string };
        area?: { area_nombre: string };
        estado?: { estado_nombre: string };
      };
    }>('/usuarios', {
      method: 'POST',
      body: JSON.stringify(usuarioDB),
    });

    return mapUsuarioDBToApp(
      response.data,
      response.data.rol,
      response.data.area,
      response.data.estado
    );
  },

  /**
   * Actualizar un usuario
   */
  async update(id: string, usuario: Partial<Usuario>): Promise<Usuario> {
    const usuarioDB = mapUsuarioAppToDB(usuario as Usuario);

    const response = await fetchAPI<{
      success: boolean;
      data: UsuarioDB & {
        rol?: { rol_nombre: string };
        area?: { area_nombre: string };
        estado?: { estado_nombre: string };
      };
    }>(`/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(usuarioDB),
    });

    return mapUsuarioDBToApp(
      response.data,
      response.data.rol,
      response.data.area,
      response.data.estado
    );
  },

  /**
   * Eliminar un usuario (desactivar)
   */
  async delete(id: string): Promise<void> {
    await fetchAPI(`/usuarios/${id}`, {
      method: 'DELETE',
    });
  }
};

// ============================================
// SERVICIO DE ACTIVIDADES
// ============================================

export const actividadesService = {
  /**
   * Obtener todas las actividades
   */
  async getAll(): Promise<Actividad[]> {
    const response = await fetchAPI<{
      success: boolean;
      data: Array<ActividadDB & {
        tipo?: { tipo_nombre: string };
        usuario?: { usuario_nombre: string; usuario_apellido: string };
        estado?: { estado_nombre: string };
      }>;
    }>('/actividades');

    return response.data.map(a =>
      mapActividadDBToApp(a, a.tipo, a.usuario, a.estado)
    ) as Actividad[];
  },

  /**
   * Obtener actividades de un usuario
   */
  async getByUsuario(usuarioId: string): Promise<Actividad[]> {
    const response = await fetchAPI<{
      success: boolean;
      data: Array<ActividadDB & {
        tipo?: { tipo_nombre: string };
        usuario?: { usuario_nombre: string; usuario_apellido: string };
        estado?: { estado_nombre: string };
      }>;
    }>(`/actividades/usuario/${usuarioId}`);

    return response.data.map(a =>
      mapActividadDBToApp(a, a.tipo, a.usuario, a.estado)
    ) as Actividad[];
  },

  /**
   * Crear una nueva actividad
   */
  async create(
    actividad: Partial<Actividad>,
    usuarioId: number
  ): Promise<Actividad> {
    const actividadDB = mapActividadAppToDB(actividad, usuarioId);

    const response = await fetchAPI<{
      success: boolean;
      data: ActividadDB & {
        tipo?: { tipo_nombre: string };
        usuario?: { usuario_nombre: string; usuario_apellido: string };
        estado?: { estado_nombre: string };
      };
    }>('/actividades', {
      method: 'POST',
      body: JSON.stringify(actividadDB),
    });

    return mapActividadDBToApp(
      response.data,
      response.data.tipo,
      response.data.usuario,
      response.data.estado
    ) as Actividad;
  },

  /**
   * Actualizar una actividad
   */
  async update(
    id: string,
    actividad: Partial<Actividad>,
    usuarioId: number
  ): Promise<Actividad> {
    const actividadDB = mapActividadAppToDB(actividad, usuarioId);

    const response = await fetchAPI<{
      success: boolean;
      data: ActividadDB & {
        tipo?: { tipo_nombre: string };
        usuario?: { usuario_nombre: string; usuario_apellido: string };
        estado?: { estado_nombre: string };
      };
    }>(`/actividades/${id}`, {
      method: 'PUT',
      body: JSON.stringify(actividadDB),
    });

    return mapActividadDBToApp(
      response.data,
      response.data.tipo,
      response.data.usuario,
      response.data.estado
    ) as Actividad;
  }
};

// ============================================
// SERVICIO DE INCIDENTES
// ============================================

export const incidentesService = {
  /**
   * Obtener todos los incidentes
   */
  async getAll(): Promise<IncidenteVisitante[]> {
    const response = await fetchAPI<{
      success: boolean;
      data: any[];
    }>('/incidentes');

    return response.data.map(i =>
      mapIncidenteDBToApp(
        i,
        i.tipo,
        i.categoria,
        i.ubicacion,
        i.estado,
        i.usuario
      )
    ) as IncidenteVisitante[];
  },

  /**
   * Crear un nuevo incidente
   */
  async create(
    incidente: Partial<IncidenteVisitante>,
    usuarioId: number
  ): Promise<IncidenteVisitante> {
    // 1. Primero crear la ubicación
    const ubicacionData = createUbicacion(
      incidente.coordenadas?.lat || 0,
      incidente.coordenadas?.lng || 0
    );

    const ubicacionResponse = await fetchAPI<{
      success: boolean;
      data: { ubicacion_id: number };
    }>('/ubicaciones', {
      method: 'POST',
      body: JSON.stringify(ubicacionData),
    });

    // 2. Luego crear el incidente
    const incidenteDB = mapIncidenteAppToDB(
      incidente,
      usuarioId,
      ubicacionResponse.data.ubicacion_id
    );

    const response = await fetchAPI<{
      success: boolean;
      data: any;
    }>('/incidentes', {
      method: 'POST',
      body: JSON.stringify(incidenteDB),
    });

    return mapIncidenteDBToApp(
      response.data,
      response.data.tipo,
      response.data.categoria,
      response.data.ubicacion,
      response.data.estado,
      response.data.usuario
    ) as IncidenteVisitante;
  }
};

// ============================================
// SERVICIO DE CATÁLOGOS
// ============================================

export const catalogosService = {
  /**
   * Obtener todos los estados
   */
  async getEstados() {
    const response = await fetchAPI<{
      success: boolean;
      data: Array<{ estado_id: number; estado_nombre: string }>;
    }>('/catalogos/estados');
    return response.data;
  },

  /**
   * Obtener todos los roles
   */
  async getRoles() {
    const response = await fetchAPI<{
      success: boolean;
      data: Array<{ rol_id: number; rol_nombre: string }>;
    }>('/catalogos/roles');
    return response.data;
  },

  /**
   * Obtener todos los tipos
   */
  async getTipos() {
    const response = await fetchAPI<{
      success: boolean;
      data: Array<{ tipo_id: number; tipo_nombre: string }>;
    }>('/catalogos/tipos');
    return response.data;
  },

  /**
   * Obtener todas las áreas protegidas
   */
  async getAreasProtegidas() {
    const response = await fetchAPI<{
      success: boolean;
      data: any[];
    }>('/areas-protegidas');
    return response.data;
  }
};

// ============================================
// EXPORTAR TODO
// ============================================

export default {
  auth: authService,
  usuarios: usuariosService,
  actividades: actividadesService,
  incidentes: incidentesService,
  catalogos: catalogosService
};
