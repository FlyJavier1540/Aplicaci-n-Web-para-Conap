# 🏗️ Arquitectura del Sistema CONAP

## 📐 Vista General

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                        │
│                                                              │
│  ┌────────────────┐    ┌─────────────────┐                 │
│  │  Componentes   │───▶│  Servicios API  │                 │
│  │  React         │    │  (ejemplo-api.  │                 │
│  │  (.tsx)        │    │   service.ts)   │                 │
│  └────────────────┘    └────────┬────────┘                 │
│         │                        │                           │
│         │                        ▼                           │
│         │              ┌─────────────────┐                  │
│         └─────────────▶│  Mapeador de    │                  │
│                        │  Datos          │                  │
│                        │  (database-     │                  │
│                        │   mapper.ts)    │                  │
│                        └────────┬────────┘                  │
│                                 │                            │
└─────────────────────────────────┼────────────────────────────┘
                                  │
                                  │ HTTP/REST
                                  │
┌─────────────────────────────────┼────────────────────────────┐
│                      BACKEND (API REST)                      │
│                                 │                            │
│                        ┌────────▼────────┐                  │
│                        │  Rutas/Routes   │                  │
│                        │  (Express)      │                  │
│                        └────────┬────────┘                  │
│                                 │                            │
│                        ┌────────▼────────┐                  │
│                        │  Controladores  │                  │
│                        │  (Controllers)  │                  │
│                        └────────┬────────┘                  │
│                                 │                            │
│                        ┌────────▼────────┐                  │
│                        │   Queries SQL   │                  │
│                        │   (pg/Pool)     │                  │
│                        └────────┬────────┘                  │
│                                 │                            │
└─────────────────────────────────┼────────────────────────────┘
                                  │
                                  │ PostgreSQL Protocol
                                  │
┌─────────────────────────────────┼────────────────────────────┐
│                   BASE DE DATOS (PostgreSQL)                 │
│                                 │                            │
│  ┌──────────────┐  ┌──────────┴─────────┐  ┌─────────────┐ │
│  │  Catálogos   │  │  Tablas Principales │  │  Relaciones │ │
│  │              │  │                     │  │             │ │
│  │ - estado     │  │ - usuario           │  │ Foreign     │ │
│  │ - usuario_rol│  │ - area_protegida    │  │ Keys        │ │
│  │ - tipo       │  │ - actividad         │  │             │ │
│  │ - categoria  │  │ - incidentes        │  │             │ │
│  │ - depto      │  │ - hallazgo          │  │             │ │
│  │ - ecosistema │  │ - equipo            │  │             │ │
│  │ - ubicacion  │  │ - fotografia        │  │             │ │
│  │              │  │ - seguimiento       │  │             │ │
│  │              │  │ - ruta_geolocal.    │  │             │ │
│  └──────────────┘  └─────────────────────┘  └─────────────┘ │
│                                                              │
│  Total: 16 Tablas                                            │
└──────────────────────────────────────────────────────────────┘
```

## 🔄 Flujo de Datos

### Login (Autenticación)

```
Usuario ingresa email/password
         │
         ▼
┌─────────────────────┐
│ Login.tsx           │
│ - Formulario        │
└──────────┬──────────┘
           │
           │ authService.login(email, password)
           ▼
┌─────────────────────┐
│ ejemplo-api.service │
│ - POST /auth/login  │
└──────────┬──────────┘
           │
           │ HTTP Request
           ▼
┌─────────────────────┐
│ Backend API         │
│ - Verifica email    │
│ - Verifica password │
│ - Genera JWT token  │
└──────────┬──────────┘
           │
           │ SQL Query con JOINs
           ▼
┌─────────────────────┐
│ PostgreSQL          │
│ SELECT usuario      │
│ JOIN usuario_rol    │
│ JOIN area_protegida │
│ JOIN estado         │
└──────────┬──────────┘
           │
           │ Datos de BD (formato DB)
           ▼
┌─────────────────────┐
│ mapUsuarioDBToApp() │
│ - Convierte IDs     │
│ - Adapta campos     │
└──────────┬──────────┘
           │
           │ Usuario (formato App)
           ▼
┌─────────────────────┐
│ App State           │
│ - currentUser       │
│ - localStorage      │
└─────────────────────┘
```

### Crear Actividad

```
Usuario llena formulario
         │
         ▼
┌─────────────────────────┐
│ PlanificacionActividades│
│ - Form inputs           │
│ - Validación            │
└──────────┬──────────────┘
           │
           │ actividadesService.create(actividad)
           ▼
┌─────────────────────────┐
│ mapActividadAppToDB()   │
│ - tipo → tipo_id        │
│ - estado → estado_id    │
│ - Genera código ACT-XXX │
└──────────┬──────────────┘
           │
           │ POST /actividades
           ▼
┌─────────────────────────┐
│ Backend API             │
│ - Valida datos          │
│ - INSERT INTO actividad │
└──────────┬──────────────┘
           │
           │ SQL INSERT
           ▼
┌─────────────────────────┐
│ PostgreSQL              │
│ INSERT INTO actividad   │
│ VALUES (...)            │
│ RETURNING *             │
└──────────┬──────────────┘
           │
           │ Actividad creada (formato DB)
           ▼
┌─────────────────────────┐
│ mapActividadDBToApp()   │
│ - tipo_id → tipo        │
│ - estado_id → estado    │
└──────────┬──────────────┘
           │
           │ Actividad (formato App)
           ▼
┌─────────────────────────┐
│ UI actualizada          │
│ - Lista de actividades  │
│ - Toast de éxito        │
└─────────────────────────┘
```

### Crear Incidente (con Ubicación)

```
Usuario llena formulario + selecciona mapa
         │
         ▼
┌─────────────────────────┐
│ RegistroIncidentes      │
│ - Form + Mapa           │
│ - lat/lng del clic      │
└──────────┬──────────────┘
           │
           │ 1. createUbicacion(lat, lng)
           ▼
┌─────────────────────────┐
│ Backend API             │
│ POST /ubicaciones       │
│ INSERT INTO ubicacion   │
└──────────┬──────────────┘
           │
           │ { ubicacion_id: 123 }
           ▼
┌─────────────────────────┐
│ mapIncidenteAppToDB()   │
│ - inc_ubicacion = 123   │
│ - tipo → tipo_id        │
│ - gravedad → cat_id     │
└──────────┬──────────────┘
           │
           │ 2. POST /incidentes
           ▼
┌─────────────────────────┐
│ Backend API             │
│ INSERT INTO incidentes  │
│ VALUES (..., 123, ...)  │
└──────────┬──────────────┘
           │
           │ Incidente creado
           ▼
┌─────────────────────────┐
│ UI actualizada          │
│ - Marcador en mapa      │
│ - Lista de incidentes   │
└─────────────────────────┘
```

## 📊 Mapeo de Datos

### Ejemplo: Usuario

```typescript
// FORMATO BASE DE DATOS (PostgreSQL)
{
  usuario_id: 3,
  usuario_nombre: "Juan",
  usuario_apellido: "Pérez",
  usuario_dpi: "1234567890101",
  usuario_correo: "juan@conap.gob.gt",
  usuario_telefono: "12345678",
  usuario_contrasenia: "Guard123!",
  usuario_rol: 3,              // ← FK numérico
  usuario_area: 1,             // ← FK numérico
  usuario_estado: 1,           // ← FK numérico
  created_at: "2025-01-18T10:00:00Z"
}
```

```typescript
// ↓↓↓ CONVERSIÓN con mapUsuarioDBToApp() ↓↓↓
```

```typescript
// FORMATO APLICACIÓN (React)
{
  id: "3",
  nombre: "Juan",
  apellido: "Pérez",
  cedula: "1234567890101",
  email: "juan@conap.gob.gt",
  telefono: "12345678",
  password: "Guard123!",
  rol: "Guardarecurso",        // ← String amigable
  areaAsignada: "1",
  estado: "Activo",            // ← String amigable
  fechaCreacion: "2025-01-18T10:00:00Z",
  permisos: []
}
```

## 🗂️ Estructura de Archivos

```
frontend/
├── types/
│   ├── index.ts                 # Tipos de la App
│   └── database.types.ts        # Tipos de la BD (NUEVO ✅)
│
├── utils/
│   ├── database-mapper.ts       # Conversiones (NUEVO ✅)
│   ├── permissions.ts           # Sistema de permisos
│   └── services/
│       └── ejemplo-api.service.ts  # Servicios API (NUEVO ✅)
│
├── components/
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── GestionUsuarios.tsx
│   ├── PlanificacionActividades.tsx
│   ├── RegistroIncidentes.tsx
│   └── ... (12 módulos totales)
│
├── data/
│   └── mock-data.ts             # Datos de prueba (temporales)
│
└── App.tsx                      # Componente principal
```

## 🎯 Responsabilidades

### Frontend
- ✅ UI/UX
- ✅ Validación de formularios
- ✅ Permisos por rol
- ✅ Conversión de datos (mapper)
- ✅ Estado local (useState, localStorage)

### Backend (TU IMPLEMENTACIÓN)
- ⬜ Autenticación JWT
- ⬜ Validación de datos
- ⬜ Queries SQL
- ⬜ Manejo de errores
- ⬜ CORS
- ⬜ Rate limiting (opcional)

### Base de Datos
- ✅ 16 tablas creadas
- ✅ Relaciones FK
- ✅ Datos de prueba
- ✅ Índices
- ✅ Triggers de timestamp

## 🔐 Flujo de Autenticación

```
1. Login
   │
   ├─▶ Frontend envía email/password
   │
   ├─▶ Backend verifica credenciales
   │
   ├─▶ Backend genera JWT token
   │
   └─▶ Frontend guarda token en localStorage

2. Requests Autenticados
   │
   ├─▶ Frontend agrega header: Authorization: Bearer <token>
   │
   ├─▶ Backend valida token (middleware)
   │
   ├─▶ Backend extrae usuario_id del token
   │
   └─▶ Backend procesa request

3. Logout
   │
   └─▶ Frontend elimina token de localStorage
```

## 📈 Escalabilidad

### Actual (Fase 1)
- Frontend: React + TypeScript
- Backend: API REST (por implementar)
- BD: PostgreSQL

### Futuro (Fase 2+)
- WebSockets para actualizaciones en tiempo real
- Cache con Redis
- Upload de imágenes a S3/Cloud Storage
- Notificaciones push
- Reportes PDF
- Exportación a Excel
- Búsqueda avanzada
- Gráficas con Chart.js

## ✅ Ventajas de esta Arquitectura

1. **Separación de Responsabilidades**
   - Frontend solo maneja UI
   - Backend maneja lógica de negocio
   - BD maneja persistencia

2. **Flexibilidad**
   - Puedes cambiar el frontend sin tocar el backend
   - Puedes cambiar la BD sin tocar el frontend
   - Puedes agregar más clientes (mobile app)

3. **Mantenibilidad**
   - Código organizado en capas
   - Tipos estrictos en ambos lados
   - Funciones de conversión centralizadas

4. **Seguridad**
   - JWT tokens
   - Validación en ambos lados
   - CORS configurado
   - SQL injection prevenido (prepared statements)

5. **Performance**
   - Lazy loading de componentes
   - Caché de catálogos
   - Queries optimizadas con índices

## 🚀 Listo para Producción

Cuando implementes todo:

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│              │     │              │     │              │
│   Frontend   │────▶│   Backend    │────▶│  PostgreSQL  │
│   (Vercel)   │     │  (Railway/   │     │  (Supabase/  │
│              │     │   Render)    │     │   Railway)   │
│              │     │              │     │              │
└──────────────┘     └──────────────┘     └──────────────┘
   React App           Node.js API          Base de Datos
   Build estático      REST Endpoints      16 Tablas
```

---

¿Tienes preguntas sobre la arquitectura? 🏗️
