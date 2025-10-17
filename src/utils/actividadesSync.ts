import { Actividad } from '../types';

// Sistema de sincronización de actividades entre módulos
type ActividadesListener = (actividades: Actividad[]) => void;

class ActividadesSync {
  private listeners: Set<ActividadesListener> = new Set();
  private actividades: Actividad[] = [];

  // Registrar un listener para recibir actualizaciones
  subscribe(listener: ActividadesListener) {
    this.listeners.add(listener);
    // Inmediatamente enviar el estado actual
    listener(this.actividades);
    
    // Retornar función para desuscribirse
    return () => {
      this.listeners.delete(listener);
    };
  }

  // Actualizar actividades y notificar a todos los listeners
  updateActividades(actividades: Actividad[]) {
    this.actividades = actividades;
    this.listeners.forEach(listener => listener(actividades));
  }

  // Actualizar una actividad específica
  updateActividad(actividadId: string, updates: Partial<Actividad>) {
    this.actividades = this.actividades.map(a => 
      a.id === actividadId ? { ...a, ...updates } : a
    );
    this.listeners.forEach(listener => listener(this.actividades));
  }

  // Obtener actividades actuales
  getActividades() {
    return this.actividades;
  }

  // Agregar una nueva actividad
  addActividad(actividad: Actividad) {
    this.actividades = [...this.actividades, actividad];
    this.listeners.forEach(listener => listener(this.actividades));
  }

  // Eliminar una actividad
  removeActividad(actividadId: string) {
    this.actividades = this.actividades.filter(a => a.id !== actividadId);
    this.listeners.forEach(listener => listener(this.actividades));
  }
}

// Exportar instancia singleton
export const actividadesSync = new ActividadesSync();
