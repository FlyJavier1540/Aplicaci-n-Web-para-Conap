# 🚀 Guía de Integración con API Backend

## 📋 Resumen

Esta guía explica cómo integrar el frontend de CONAP con tu API backend PostgreSQL.

## ✅ Lo que ya está hecho

### 1. Tipos de Base de Datos
- ✅ `/types/database.types.ts` - Tipos que mapean exactamente a tu esquema PostgreSQL
- ✅ Incluye todas las 16 tablas de tu base de datos

### 2. Mapeador de Datos
- ✅ `/utils/database-mapper.ts` - Funciones para convertir entre BD y App
- ✅ Mapeo bidireccional (DB → App y App → DB)
- ✅ Constantes para IDs de estados, roles, tipos, etc.

## 🎯 Estructura de tu Base de Datos

### IDs de Catálogos

```typescript
// Estados
1 = Activo
2 = Inactivo
3 = En Proceso
4 = Completado
5 = Reportado
6 = En Investigación
7 = Resuelto
8 = Cerrado
9 = Pendiente
10 = Cancelado

// Roles
1 = Administrador
2 = Coordinador
3 = Guardarecurso

// Tipos de Actividades (tipo_id 1-8)
1 = Patrullaje
2 = Monitoreo
3 = Vigilancia
4 = Mantenimiento
5 = Inspección
6 = Rescate
7 = Capacitación
8 = Investigación

// Tipos de Incidentes (tipo_id 9-16)
9 = Incendio Forestal
10 = Tala Ilegal
11 = Caza Furtiva
12 = Invasión de Tierras
13 = Contaminación
14 = Accidente de Visitante
15 = Conflicto Comunitario
16 = Emergencia Médica

// Gravedades (categoria_id 8-11)
8 = Leve
9 = Moderado
10 = Grave
11 = Crítico
```

## 🔧 Cómo Crear tu Capa de API

### Opción 1: Usar Fetch Directamente

Crea `/utils/api.ts`:

```typescript
const API_BASE_URL = 'https://tu-api.com/api';

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  // Usuarios
  login: (email: string, password: string) =>
    fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getUsuarios: () => fetchAPI('/usuarios'),
  
  createUsuario: (usuario: any) =>
    fetchAPI('/usuarios', {
      method: 'POST',
      body: JSON.stringify(usuario),
    }),

  updateUsuario: (id: number, usuario: any) =>
    fetchAPI(`/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(usuario),
    }),

  // Actividades
  getActividades: () => fetchAPI('/actividades'),
  
  createActividad: (actividad: any) =>
    fetchAPI('/actividades', {
      method: 'POST',
      body: JSON.stringify(actividad),
    }),

  // Incidentes
  getIncidentes: () => fetchAPI('/incidentes'),
  
  createIncidente: (incidente: any) =>
    fetchAPI('/incidentes', {
      method: 'POST',
      body: JSON.stringify(incidente),
    }),

  // Catálogos
  getEstados: () => fetchAPI('/catalogos/estados'),
  getRoles: () => fetchAPI('/catalogos/roles'),
  getTipos: () => fetchAPI('/catalogos/tipos'),
  getAreasProtegidas: () => fetchAPI('/areas-protegidas'),
};
```

### Opción 2: Usar Axios

```bash
npm install axios
```

Crea `/utils/api-client.ts`:

```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://tu-api.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token si existe
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

## 📝 Ejemplos de Uso

### Ejemplo 1: Login

```typescript
// En tu componente Login.tsx
import { mapUsuarioDBToApp } from '../utils/database-mapper';

const handleLogin = async (email: string, password: string) => {
  try {
    // Llamar a tu API
    const response = await fetch('https://tu-api.com/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const usuarioDB = await response.json();

    // Convertir de BD a formato de App
    const usuarioApp = mapUsuarioDBToApp(
      usuarioDB.usuario,
      usuarioDB.rol,
      usuarioDB.area,
      usuarioDB.estado
    );

    // Usar en la app
    onLogin(usuarioApp);
  } catch (error) {
    console.error('Error en login:', error);
  }
};
```

### Ejemplo 2: Crear Actividad

```typescript
import { mapActividadAppToDB } from '../utils/database-mapper';

const handleCreateActividad = async (actividadForm: any) => {
  try {
    // Convertir de formato App a formato DB
    const actividadDB = mapActividadAppToDB(actividadForm, currentUser.id);

    // Enviar a tu API
    const response = await fetch('https://tu-api.com/api/actividades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(actividadDB)
    });

    const newActividad = await response.json();
    console.log('Actividad creada:', newActividad);
  } catch (error) {
    console.error('Error al crear actividad:', error);
  }
};
```

### Ejemplo 3: Crear Incidente con Ubicación

```typescript
import { 
  mapIncidenteAppToDB, 
  createUbicacion 
} from '../utils/database-mapper';

const handleCreateIncidente = async (incidenteForm: any) => {
  try {
    // 1. Primero crear la ubicación
    const ubicacionData = createUbicacion(
      incidenteForm.coordenadas.lat,
      incidenteForm.coordenadas.lng
    );

    const ubicacionResponse = await fetch('https://tu-api.com/api/ubicaciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ubicacionData)
    });

    const ubicacion = await ubicacionResponse.json();

    // 2. Luego crear el incidente con la ubicación
    const incidenteDB = mapIncidenteAppToDB(
      incidenteForm,
      currentUser.id,
      ubicacion.ubicacion_id
    );

    const incidenteResponse = await fetch('https://tu-api.com/api/incidentes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(incidenteDB)
    });

    const incidente = await incidenteResponse.json();
    console.log('Incidente creado:', incidente);
  } catch (error) {
    console.error('Error al crear incidente:', error);
  }
};
```

### Ejemplo 4: Obtener y Mostrar Actividades

```typescript
import { mapActividadDBToApp } from '../utils/database-mapper';

const loadActividades = async () => {
  try {
    const response = await fetch('https://tu-api.com/api/actividades');
    const actividadesDB = await response.json();

    // Convertir todas las actividades de BD a App
    const actividadesApp = actividadesDB.map((actDB: any) =>
      mapActividadDBToApp(
        actDB,
        actDB.tipo,
        actDB.usuario,
        actDB.estado
      )
    );

    setActividades(actividadesApp);
  } catch (error) {
    console.error('Error al cargar actividades:', error);
  }
};
```

## 🎯 Endpoints Recomendados para tu API

### Autenticación
```
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/change-password
```

### Usuarios
```
GET    /api/usuarios
GET    /api/usuarios/:id
POST   /api/usuarios
PUT    /api/usuarios/:id
DELETE /api/usuarios/:id
```

### Actividades
```
GET    /api/actividades
GET    /api/actividades/:id
POST   /api/actividades
PUT    /api/actividades/:id
DELETE /api/actividades/:id
GET    /api/actividades/usuario/:usuarioId
```

### Incidentes
```
GET    /api/incidentes
GET    /api/incidentes/:id
POST   /api/incidentes
PUT    /api/incidentes/:id
DELETE /api/incidentes/:id
```

### Hallazgos
```
GET    /api/hallazgos
GET    /api/hallazgos/:id
POST   /api/hallazgos
PUT    /api/hallazgos/:id
GET    /api/hallazgos/actividad/:actividadId
```

### Equipos
```
GET    /api/equipos
GET    /api/equipos/:id
POST   /api/equipos
PUT    /api/equipos/:id
GET    /api/equipos/usuario/:usuarioId
```

### Catálogos
```
GET    /api/catalogos/estados
GET    /api/catalogos/roles
GET    /api/catalogos/tipos
GET    /api/catalogos/categorias
GET    /api/catalogos/departamentos
GET    /api/catalogos/ecosistemas
```

### Áreas Protegidas
```
GET    /api/areas-protegidas
GET    /api/areas-protegidas/:id
POST   /api/areas-protegidas
PUT    /api/areas-protegidas/:id
```

### Ubicaciones
```
POST   /api/ubicaciones
```

## 📊 Formato de Respuestas Esperado

### Login
```json
{
  "success": true,
  "usuario": {
    "usuario_id": 1,
    "usuario_nombre": "Juan",
    "usuario_apellido": "Pérez",
    "usuario_correo": "juan@conap.gob.gt",
    "usuario_telefono": "12345678",
    "usuario_rol": 3,
    "usuario_area": 1,
    "usuario_estado": 1
  },
  "rol": {
    "rol_id": 3,
    "rol_nombre": "Guardarecurso"
  },
  "area": {
    "area_id": 1,
    "area_nombre": "Tikal"
  },
  "estado": {
    "estado_id": 1,
    "estado_nombre": "Activo"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Lista de Actividades
```json
{
  "success": true,
  "data": [
    {
      "actividad_id": 1,
      "actividad_codigo": "ACT-20250118-001",
      "actividad_nombre": "Patrullaje zona norte",
      "actividad_tipo": 1,
      "actividad_usuario": 3,
      "actividad_fecha": "2025-01-18",
      "actividad_h_inicio": "08:00",
      "actividad_h_fin": "12:00",
      "actividad_estado": 3,
      "tipo": {
        "tipo_id": 1,
        "tipo_nombre": "Patrullaje"
      },
      "usuario": {
        "usuario_nombre": "Juan",
        "usuario_apellido": "Pérez"
      },
      "estado": {
        "estado_nombre": "En Proceso"
      }
    }
  ]
}
```

## 🔐 Manejo de Autenticación

### Guardar Token
```typescript
// Después de login exitoso
localStorage.setItem('auth_token', response.token);
localStorage.setItem('current_user', JSON.stringify(usuarioApp));
```

### Interceptor para Agregar Token
```typescript
// Agregar a todas las peticiones
const token = localStorage.getItem('auth_token');
fetch(url, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

## 📝 Siguiente Paso

1. ✅ Crea tu API REST en el backend
2. ✅ Implementa los endpoints listados arriba
3. ✅ Usa las funciones de `database-mapper.ts` para convertir datos
4. ✅ Prueba con Postman o similar
5. ✅ Integra en el frontend reemplazando los mock data

## 💡 Ejemplo Completo: Servicio de Usuarios

```typescript
// /utils/services/usuarios.service.ts
import { mapUsuarioDBToApp, mapUsuarioAppToDB } from '../database-mapper';
import type { Usuario } from '../../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const usuariosService = {
  async getAll(): Promise<Usuario[]> {
    const response = await fetch(`${API_URL}/usuarios`);
    const data = await response.json();
    
    return data.map((u: any) => 
      mapUsuarioDBToApp(u, u.rol, u.area, u.estado)
    );
  },

  async getById(id: string): Promise<Usuario> {
    const response = await fetch(`${API_URL}/usuarios/${id}`);
    const data = await response.json();
    
    return mapUsuarioDBToApp(data, data.rol, data.area, data.estado);
  },

  async create(usuario: Usuario): Promise<Usuario> {
    const usuarioDB = mapUsuarioAppToDB(usuario);
    
    const response = await fetch(`${API_URL}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuarioDB)
    });
    
    const data = await response.json();
    return mapUsuarioDBToApp(data, data.rol, data.area, data.estado);
  },

  async update(id: string, usuario: Partial<Usuario>): Promise<Usuario> {
    const usuarioDB = mapUsuarioAppToDB(usuario as Usuario);
    
    const response = await fetch(`${API_URL}/usuarios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuarioDB)
    });
    
    const data = await response.json();
    return mapUsuarioDBToApp(data, data.rol, data.area, data.estado);
  },

  async delete(id: string): Promise<void> {
    await fetch(`${API_URL}/usuarios/${id}`, {
      method: 'DELETE'
    });
  }
};
```

## ✅ Checklist de Integración

- [ ] Backend API implementada
- [ ] Endpoints probados con Postman
- [ ] Frontend configurado con URL de API
- [ ] Login funcionando con API real
- [ ] CRUD de usuarios integrado
- [ ] CRUD de actividades integrado
- [ ] CRUD de incidentes integrado
- [ ] Catálogos cargados desde API
- [ ] Manejo de errores implementado
- [ ] Tokens de autenticación funcionando

¿Necesitas ayuda con algún paso específico? 🚀
