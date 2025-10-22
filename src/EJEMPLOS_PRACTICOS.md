# 💡 Ejemplos Prácticos - Integración API

## 🎯 Guía Rápida de Implementación

Esta guía te muestra exactamente cómo usar las funciones de mapeo en tus componentes.

---

## 1️⃣ Login - Autenticación

### Frontend (Login.tsx)

```typescript
import { useState } from 'react';
import { login } from '../utils/database-mapper';

export function Login({ onLogin }: { onLogin: (user: any) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 1. Llamar a tu API
      const response = await fetch('https://tu-api.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Credenciales incorrectas');
      }

      const data = await response.json();

      // 2. El backend ya te devuelve el usuario convertido
      // O si viene en formato DB, conviértelo:
      const usuarioApp = {
        id: data.usuario.usuario_id.toString(),
        nombre: data.usuario.usuario_nombre,
        apellido: data.usuario.usuario_apellido,
        email: data.usuario.usuario_correo,
        telefono: data.usuario.usuario_telefono,
        password: data.usuario.usuario_contrasenia,
        rol: data.rol.rol_nombre,
        estado: data.estado.estado_nombre,
        fechaCreacion: data.usuario.created_at,
        permisos: [],
        areaAsignada: data.usuario.usuario_area?.toString()
      };

      // 3. Guardar token
      localStorage.setItem('auth_token', data.token);
      
      // 4. Login exitoso
      onLogin(usuarioApp);

    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Tu formulario aquí */}
    </form>
  );
}
```

---

## 2️⃣ Listar Actividades

### Frontend (PlanificacionActividades.tsx)

```typescript
import { useState, useEffect } from 'react';
import { mapActividadDBToApp } from '../utils/database-mapper';
import type { Actividad } from '../types';

export function PlanificacionActividades() {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadActividades();
  }, []);

  const loadActividades = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch('https://tu-api.com/api/actividades', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      // Convertir cada actividad de BD a App
      const actividadesApp = data.data.map((actDB: any) => 
        mapActividadDBToApp(
          actDB,
          actDB.tipo,
          actDB.usuario,
          actDB.estado
        )
      );

      setActividades(actividadesApp as Actividad[]);
    } catch (error) {
      console.error('Error al cargar actividades:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Cargando actividades...</div>;
  }

  return (
    <div>
      {actividades.map(actividad => (
        <div key={actividad.id}>
          <h3>{actividad.tipo}</h3>
          <p>{actividad.descripcion}</p>
          <span>{actividad.estado}</span>
        </div>
      ))}
    </div>
  );
}
```

---

## 3️⃣ Crear Actividad

### Frontend (PlanificacionActividades.tsx)

```typescript
import { mapActividadAppToDB } from '../utils/database-mapper';
import { toast } from 'sonner';

const handleCreateActividad = async (formData: any) => {
  try {
    const currentUser = JSON.parse(localStorage.getItem('current_user') || '{}');
    const token = localStorage.getItem('auth_token');

    // 1. Convertir de formato App a formato BD
    const actividadDB = mapActividadAppToDB(
      {
        tipo: formData.tipo,
        descripcion: formData.descripcion,
        fecha: formData.fecha,
        horaInicio: formData.horaInicio,
        horaFin: formData.horaFin,
        ubicacion: formData.ubicacion,
        estado: 'Programada'
      },
      parseInt(currentUser.id) // usuario_id
    );

    // 2. Enviar a la API
    const response = await fetch('https://tu-api.com/api/actividades', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(actividadDB)
    });

    if (!response.ok) {
      throw new Error('Error al crear actividad');
    }

    const data = await response.json();

    // 3. Convertir respuesta de BD a App
    const nuevaActividad = mapActividadDBToApp(
      data.data,
      data.data.tipo,
      data.data.usuario,
      data.data.estado
    );

    // 4. Actualizar UI
    setActividades(prev => [...prev, nuevaActividad as Actividad]);
    
    toast.success('Actividad creada exitosamente');
    setIsDialogOpen(false);

  } catch (error: any) {
    toast.error(error.message || 'Error al crear actividad');
  }
};
```

---

## 4️⃣ Crear Incidente con Ubicación

### Frontend (RegistroIncidentes.tsx)

```typescript
import { mapIncidenteAppToDB, createUbicacion } from '../utils/database-mapper';
import { toast } from 'sonner';

const handleCreateIncidente = async (formData: any) => {
  try {
    const currentUser = JSON.parse(localStorage.getItem('current_user') || '{}');
    const token = localStorage.getItem('auth_token');

    // 1. Primero crear la ubicación
    const ubicacionData = createUbicacion(
      formData.coordenadas.lat,
      formData.coordenadas.lng
    );

    const ubicacionResponse = await fetch('https://tu-api.com/api/ubicaciones', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(ubicacionData)
    });

    const ubicacion = await ubicacionResponse.json();

    // 2. Luego crear el incidente con el ubicacion_id
    const incidenteDB = mapIncidenteAppToDB(
      {
        titulo: formData.titulo,
        tipo: formData.tipo,
        descripcion: formData.descripcion,
        gravedad: formData.gravedad,
        visitantesInvolucrados: formData.involucrados.split(','),
        estado: 'Nuevo',
        coordenadas: formData.coordenadas
      },
      parseInt(currentUser.id), // usuario_id
      ubicacion.data.ubicacion_id // ubicacion_id
    );

    const incidenteResponse = await fetch('https://tu-api.com/api/incidentes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(incidenteDB)
    });

    const nuevoIncidente = await incidenteResponse.json();

    toast.success('Incidente registrado exitosamente');
    loadIncidentes(); // Recargar lista

  } catch (error: any) {
    toast.error(error.message || 'Error al registrar incidente');
  }
};
```

---

## 5️⃣ Crear Usuario (Admin)

### Frontend (GestionUsuarios.tsx)

```typescript
import { mapUsuarioAppToDB } from '../utils/database-mapper';
import { toast } from 'sonner';

const handleCreateUsuario = async (formData: any) => {
  try {
    const token = localStorage.getItem('auth_token');

    // 1. Convertir de formato App a formato BD
    const usuarioDB = mapUsuarioAppToDB({
      id: '', // No importa para creación
      nombre: formData.nombre,
      apellido: formData.apellido,
      cedula: formData.dpi,
      email: formData.email,
      telefono: formData.telefono,
      password: formData.password,
      rol: formData.rol,
      estado: 'Activo',
      areaAsignada: formData.areaId,
      fechaCreacion: new Date().toISOString(),
      permisos: []
    });

    // 2. Enviar a la API
    const response = await fetch('https://tu-api.com/api/usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(usuarioDB)
    });

    if (!response.ok) {
      throw new Error('Error al crear usuario');
    }

    toast.success('Usuario creado exitosamente');
    loadUsuarios(); // Recargar lista

  } catch (error: any) {
    toast.error(error.message || 'Error al crear usuario');
  }
};
```

---

## 6️⃣ Cargar Catálogos (Dropdowns)

### Frontend (Cualquier componente)

```typescript
import { useState, useEffect } from 'react';

export function MiComponente() {
  const [tipos, setTipos] = useState<any[]>([]);
  const [estados, setEstados] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);

  useEffect(() => {
    loadCatalogos();
  }, []);

  const loadCatalogos = async () => {
    try {
      const token = localStorage.getItem('auth_token');

      // Cargar todos en paralelo
      const [tiposRes, estadosRes, areasRes] = await Promise.all([
        fetch('https://tu-api.com/api/catalogos/tipos', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('https://tu-api.com/api/catalogos/estados', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('https://tu-api.com/api/areas-protegidas', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const [tiposData, estadosData, areasData] = await Promise.all([
        tiposRes.json(),
        estadosRes.json(),
        areasRes.json()
      ]);

      setTipos(tiposData.data);
      setEstados(estadosData.data);
      setAreas(areasData.data);

    } catch (error) {
      console.error('Error al cargar catálogos:', error);
    }
  };

  return (
    <div>
      {/* Dropdown de tipos */}
      <select>
        {tipos.map(tipo => (
          <option key={tipo.tipo_id} value={tipo.tipo_id}>
            {tipo.tipo_nombre}
          </option>
        ))}
      </select>

      {/* Dropdown de áreas */}
      <select>
        {areas.map(area => (
          <option key={area.area_id} value={area.area_id}>
            {area.area_nombre}
          </option>
        ))}
      </select>
    </div>
  );
}
```

---

## 7️⃣ Actualizar Estado de Actividad

### Frontend (RegistroDiario.tsx)

```typescript
import { ESTADO_MAP } from '../utils/database-mapper';
import { toast } from 'sonner';

const handleUpdateEstado = async (actividadId: string, nuevoEstado: string) => {
  try {
    const token = localStorage.getItem('auth_token');

    // Mapear estado de App a ID de BD
    const estadoIdMap: Record<string, number> = {
      'Programada': ESTADO_MAP.PENDIENTE,
      'En Progreso': ESTADO_MAP.EN_PROCESO,
      'Pausada': ESTADO_MAP.PENDIENTE,
      'Completada': ESTADO_MAP.COMPLETADO
    };

    const response = await fetch(`https://tu-api.com/api/actividades/${actividadId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        actividad_estado: estadoIdMap[nuevoEstado]
      })
    });

    if (!response.ok) {
      throw new Error('Error al actualizar estado');
    }

    toast.success('Estado actualizado');
    loadActividades(); // Recargar

  } catch (error: any) {
    toast.error(error.message || 'Error al actualizar estado');
  }
};
```

---

## 8️⃣ Dashboard con Estadísticas

### Frontend (Dashboard.tsx)

```typescript
import { useState, useEffect } from 'react';

export function Dashboard() {
  const [stats, setStats] = useState({
    totalActividades: 0,
    actividadesHoy: 0,
    incidentesAbiertos: 0,
    hallazgosRecientes: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('auth_token');

      const response = await fetch('https://tu-api.com/api/dashboard/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      setStats(data.stats);

    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="card">
        <h3>Total Actividades</h3>
        <p className="text-3xl">{stats.totalActividades}</p>
      </div>
      <div className="card">
        <h3>Actividades Hoy</h3>
        <p className="text-3xl">{stats.actividadesHoy}</p>
      </div>
      <div className="card">
        <h3>Incidentes Abiertos</h3>
        <p className="text-3xl">{stats.incidentesAbiertos}</p>
      </div>
      <div className="card">
        <h3>Hallazgos Recientes</h3>
        <p className="text-3xl">{stats.hallazgosRecientes}</p>
      </div>
    </div>
  );
}
```

---

## 9️⃣ Manejo de Errores Global

### Crear un hook personalizado

```typescript
// /utils/useApi.ts
import { useState } from 'react';
import { toast } from 'sonner';

export function useApi<T>() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (
    apiCall: () => Promise<T>,
    successMessage?: string
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      
      if (successMessage) {
        toast.success(successMessage);
      }
      
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Error desconocido';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { execute, isLoading, error };
}
```

### Uso en componentes

```typescript
import { useApi } from '../utils/useApi';

export function MiComponente() {
  const { execute, isLoading } = useApi();

  const handleCreate = async () => {
    const result = await execute(
      async () => {
        const response = await fetch('https://tu-api.com/api/actividades', {
          method: 'POST',
          body: JSON.stringify(data)
        });
        return response.json();
      },
      'Actividad creada exitosamente'
    );

    if (result) {
      // Éxito
      console.log(result);
    }
  };

  return (
    <button onClick={handleCreate} disabled={isLoading}>
      {isLoading ? 'Creando...' : 'Crear'}
    </button>
  );
}
```

---

## 🎯 Tips Importantes

### 1. Siempre maneja el token

```typescript
const token = localStorage.getItem('auth_token');
if (!token) {
  // Redirigir a login
  return;
}
```

### 2. Maneja errores de red

```typescript
try {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const data = await response.json();
} catch (error) {
  if (error instanceof TypeError) {
    toast.error('Error de conexión. Verifica tu internet.');
  } else {
    toast.error(error.message);
  }
}
```

### 3. Loading states

```typescript
const [isLoading, setIsLoading] = useState(false);

// Antes de fetch
setIsLoading(true);

// Después de fetch (en try/catch/finally)
finally {
  setIsLoading(false);
}
```

### 4. Validación antes de enviar

```typescript
if (!formData.nombre || !formData.email) {
  toast.error('Todos los campos son obligatorios');
  return;
}

if (!/\S+@\S+\.\S+/.test(formData.email)) {
  toast.error('Email inválido');
  return;
}
```

---

## ✅ Checklist Rápido

Antes de cada llamada a la API:

- [ ] ¿Tengo el token de autenticación?
- [ ] ¿Estoy usando el mapper correcto?
- [ ] ¿Manejo errores con try/catch?
- [ ] ¿Muestro loading state?
- [ ] ¿Valido los datos antes de enviar?
- [ ] ¿Actualizo la UI después de éxito?
- [ ] ¿Muestro mensajes al usuario?

---

¿Necesitas más ejemplos? 💡
