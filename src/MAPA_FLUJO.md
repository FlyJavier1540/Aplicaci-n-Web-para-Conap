# 🗺️ Mapa de Flujo - Sistema CONAP

## 📍 Flujo de Autenticación

```
┌─────────────────────┐
│   Usuario visita    │
│    la aplicación    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Login.tsx         │
│  (Pantalla Login)   │
└──────────┬──────────┘
           │
           ├──────────────────────────────────────────┐
           │                                          │
           ▼                                          ▼
    ┌─────────────┐                          ┌────────────────┐
    │ Credenciales│                          │ ¿Olvidó        │
    │   Válidas?  │                          │ Contraseña?    │
    └──────┬──────┘                          └───────┬────────┘
           │                                         │
           │ SÍ                                      ▼
           │                              ┌──────────────────────┐
           │                              │ RestablecerContrasena│
           │                              │      .tsx            │
           │                              └──────────────────────┘
           │
           ▼
    ┌─────────────────┐
    │ Verificar ROL   │
    │ del Usuario     │
    └──────┬──────────┘
           │
           ├──────────────────┬──────────────────┐
           │                  │                  │
           ▼                  ▼                  ▼
    ┌─────────────┐   ┌─────────────┐   ┌─────────────────┐
    │ADMINISTRADOR│   │ COORDINADOR │   │ GUARDARECURSO   │
    └──────┬──────┘   └──────┬──────┘   └────────┬────────┘
           │                  │                    │
           ▼                  ▼                    ▼
    ┌─────────────┐   ┌─────────────┐   ┌──────────────────┐
    │  Dashboard  │   │  Dashboard  │   │ Registro Diario  │
    │             │   │             │   │   de Campo       │
    └─────────────┘   └─────────────┘   └──────────────────┘
```

---

## 🎭 Flujo por Rol

### 👑 ADMINISTRADOR

```
App.tsx
  │
  ├─ Dashboard ✅
  │
  ├─ Gestión de Personal
  │  ├─ Registro de Guardarecursos ✅ (CRUD completo)
  │  ├─ Áreas Protegidas ✅ (CRUD completo)
  │  └─ Control de Equipos ✅ (CRUD completo)
  │
  ├─ Operaciones de Campo
  │  ├─ Planificación de Actividades ✅ (CRUD completo)
  │  ├─ Registro Diario ⚠️ (SOLO VER Y FILTRAR)
  │  ├─ Registro Fotográfico ✅ (CRUD completo)
  │  └─ Geolocalización de Rutas ✅ (Ver todas)
  │
  ├─ Control y Seguimiento
  │  ├─ Reporte de Hallazgos ✅ (CRUD completo)
  │  ├─ Seguimiento de Cumplimiento ✅ (Ver todo)
  │  ├─ Incidentes ⚠️ (VER Y CAMBIAR ESTADOS, NO CREAR)
  │  └─ Reportes Periódicos ✅ (CRUD completo)
  │
  └─ Administración
     └─ Gestión de Usuarios ✅ (CRUD completo)
```

### 📊 COORDINADOR

```
App.tsx
  │
  ├─ Dashboard ✅
  │
  ├─ Gestión de Personal
  │  ├─ Registro de Guardarecursos ✅ (CRUD completo)
  │  ├─ Áreas Protegidas ✅ (CRUD completo)
  │  └─ Control de Equipos ✅ (CRUD completo)
  │
  ├─ Operaciones de Campo
  │  ├─ Planificación de Actividades ✅ (CRUD completo)
  │  ├─ Registro Diario ⚠️ (SOLO VER Y FILTRAR)
  │  ├─ Registro Fotográfico ✅ (CRUD completo)
  │  └─ Geolocalización de Rutas ✅ (Ver todas)
  │
  ├─ Control y Seguimiento
  │  ├─ Reporte de Hallazgos ✅ (CRUD completo)
  │  ├─ Seguimiento de Cumplimiento ✅ (Ver todo)
  │  ├─ Incidentes ⚠️ (VER Y CAMBIAR ESTADOS, NO CREAR)
  │  └─ Reportes Periódicos ✅ (CRUD completo)
  │
  └─ Administración
     └─ Gestión de Usuarios ❌ (SIN ACCESO)
```

### 👤 GUARDARECURSO

```
App.tsx
  │
  ├─ Dashboard ❌ (NO DISPONIBLE)
  │
  ├─ Gestión de Personal ❌ (TODO BLOQUEADO)
  │
  ├─ Operaciones de Campo
  │  ├─ Planificación ❌
  │  ├─ Registro Diario ✅ (EDITAR SUS ACTIVIDADES)
  │  ├─ Registro Fotográfico ❌
  │  └─ Geolocalización ❌
  │
  ├─ Control y Seguimiento
  │  ├─ Hallazgos ❌
  │  ├─ Seguimiento ❌
  │  ├─ Incidentes ✅ (CREAR Y VER PROPIOS)
  │  └─ Reportes ❌
  │
  └─ Administración
     ├─ Control de Equipos ✅ (SOLO VER PROPIOS)
     └─ Usuarios ❌
```

---

## 🔄 Flujo de Datos

### Estructura de Permisos

```
┌─────────────────────┐
│   App.tsx           │
│  (Usuario inicia)   │
└──────────┬──────────┘
           │
           │ currentUser.rol
           ▼
┌─────────────────────────────────┐
│   utils/permissions.ts          │
│                                 │
│   getModulePermissions(rol, id) │
│         │                       │
│         ▼                       │
│   ┌─────────────────┐          │
│   │ Retorna:        │          │
│   │ - canView       │          │
│   │ - canCreate     │          │
│   │ - canEdit       │          │
│   │ - canDelete     │          │
│   └─────────────────┘          │
└──────────┬──────────────────────┘
           │
           │ userPermissions prop
           ▼
┌─────────────────────────────────┐
│   Componente del Módulo         │
│   (ej: RegistroDiario.tsx)      │
│                                 │
│   {userPermissions.canCreate && │
│     <Button>Nuevo</Button>      │
│   }                             │
└─────────────────────────────────┘
```

### Flujo de Datos Mock

```
┌─────────────────────┐
│   data/mock-data.ts │
│                     │
│   - usuarios        │
│   - guardarecursos  │
│   - areasProtegidas │
│   - actividades     │
│   - hallazgos       │
│   - incidentes      │
│   - equipos         │
│   - etc.            │
└──────────┬──────────┘
           │
           │ import
           ▼
┌─────────────────────┐
│   Componentes       │
│                     │
│   useState([...     │
│     mockData])      │
└─────────────────────┘
```

**PARA PRODUCCIÓN:**

```
┌─────────────────────┐
│   API / Database    │
│   (Supabase, etc.)  │
└──────────┬──────────┘
           │
           │ fetch/query
           ▼
┌─────────────────────┐
│   Componentes       │
│                     │
│   useEffect(() => { │
│     fetch()         │
│   })                │
└─────────────────────┘
```

---

## 🎬 Flujo del Módulo Principal: Registro Diario

```
┌─────────────────────────────────────────┐
│   RegistroDiario.tsx                    │
└──────────────┬──────────────────────────┘
               │
               ▼
        ┌──────────────┐
        │ ¿Quién es el │
        │   usuario?   │
        └──────┬───────┘
               │
       ┌───────┴───────┐
       │               │
       ▼               ▼
┌─────────────┐  ┌────────────────┐
│ Admin/Coord │  │ Guardarecurso  │
│             │  │                │
│ - Ver todas │  │ - Ver solo las │
│   las       │  │   asignadas    │
│   activid.  │  │   a él         │
│             │  │                │
│ - Usar      │  │ - SIN filtros  │
│   filtros   │  │                │
│             │  │ - Puede editar │
│ - NO puede  │  │   sus          │
│   editar    │  │   actividades  │
└─────────────┘  └───────┬────────┘
                         │
                         ▼
                 ┌───────────────┐
                 │ Estado de la  │
                 │   Actividad   │
                 └───────┬───────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
  ┌──────────┐    ┌───────────┐    ┌──────────┐
  │Programada│    │En Progreso│    │Completada│
  └────┬─────┘    └─────┬─────┘    └──────────┘
       │                │
       ▼                ▼
  ┌─────────┐    ┌─────────────┐
  │ Iniciar │    │ - Pausar    │
  │ Activid.│    │ - Reanudar  │
  └─────────┘    │ - Completar │
                 │ - Agregar   │
                 │   hallazgos │
                 │ - Subir     │
                 │   fotos     │
                 └─────────────┘
```

---

## 🔐 Mapa de Permisos Detallado

### Matriz de Permisos

| Módulo | Administrador | Coordinador | Guardarecurso |
|--------|--------------|-------------|---------------|
| **Dashboard** | ✅ Ver | ✅ Ver | ❌ Sin acceso |
| **Registro Guardarecursos** | ✅ CRUD | ✅ CRUD | ❌ Sin acceso |
| **Áreas Protegidas** | ✅ CRUD | ✅ CRUD | ❌ Sin acceso |
| **Control de Equipos** | ✅ CRUD | ✅ CRUD | 👁️ Solo ver propios |
| **Planificación** | ✅ CRUD | ✅ CRUD | ❌ Sin acceso |
| **Registro Diario** | 👁️ Solo ver | 👁️ Solo ver | ✅ Editar propios |
| **Evidencias Fotográficas** | ✅ CRUD | ✅ CRUD | ❌ Sin acceso |
| **Geolocalización** | ✅ Ver todas | ✅ Ver todas | ❌ Sin acceso |
| **Hallazgos** | ✅ CRUD | ✅ CRUD | ❌ Sin acceso |
| **Seguimiento** | ✅ Ver todo | ✅ Ver todo | ❌ Sin acceso |
| **Incidentes** | 📝 Ver + Estados | 📝 Ver + Estados | ✅ Crear + Ver propios |
| **Reportes** | ✅ CRUD | ✅ CRUD | ❌ Sin acceso |
| **Gestión Usuarios** | ✅ CRUD | ❌ Sin acceso | ❌ Sin acceso |

**Leyenda:**
- ✅ CRUD = Crear, Ver, Editar, Eliminar
- 👁️ Solo ver = Visualización únicamente
- 📝 Ver + Estados = Ver todo y cambiar estados, pero no crear
- ❌ Sin acceso = No aparece en el menú

---

## 📱 Flujo Responsive

```
┌─────────────────────────────────────────┐
│   Detección de Tamaño de Pantalla      │
└──────────────┬──────────────────────────┘
               │
       ┌───────┴───────┬─────────────┐
       │               │             │
       ▼               ▼             ▼
┌─────────────┐  ┌──────────┐  ┌─────────┐
│   Móvil     │  │  Tablet  │  │ Desktop │
│   < 640px   │  │  640-    │  │ > 1024px│
│             │  │  1024px  │  │         │
├─────────────┤  ├──────────┤  ├─────────┤
│             │  │          │  │         │
│ Menú =      │  │ Menú =   │  │ Menú =  │
│ Hamburguesa │  │ Colapsad │  │ Sidebar │
│             │  │          │  │ Fijo    │
│             │  │          │  │         │
│ Dashboard:  │  │Dashboard:│  │Dashboard│
│ - 2 cols    │  │ - 2 cols │  │ - 4 cols│
│ - Stack     │  │ - Grid   │  │ - Grid  │
│   vertical  │  │          │  │         │
│             │  │          │  │         │
│ Tablas:     │  │ Tablas:  │  │ Tablas: │
│ - Scroll    │  │ - Scroll │  │ - Full  │
│   horizontal│  │          │  │   width │
│             │  │          │  │         │
│ Theme:      │  │ Theme:   │  │ Theme:  │
│ - Botón     │  │ - Botón  │  │ - Switch│
│   simple    │  │          │  │         │
└─────────────┘  └──────────┘  └─────────┘
```

---

## 🎨 Flujo de Tema (Dark Mode)

```
┌─────────────────────┐
│  ThemeProvider.tsx  │
│  (Contexto global)  │
└──────────┬──────────┘
           │
           │ Provee: theme, setTheme
           │
           ▼
┌─────────────────────────────────┐
│   Toda la aplicación            │
│                                 │
│   useTheme() hook disponible    │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────┐
│  ThemeToggle.tsx    │
│                     │
│  - Botón móvil      │
│  - Switch desktop   │
│                     │
│  onClick =>         │
│    setTheme(new)    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  localStorage       │
│  guarda preferencia │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Clases CSS         │
│  .dark aplicadas    │
│  automáticamente    │
└─────────────────────┘
```

---

## 🔄 Sincronización de Actividades

```
┌──────────────────────────┐
│ utils/actividadesSync.ts │
│ (Gestor de estado)       │
└────────────┬─────────────┘
             │
             │ Singleton instance
             │
     ┌───────┴───────┬─────────────┐
     │               │             │
     ▼               ▼             ▼
┌──────────┐  ┌─────────────┐  ┌──────────────┐
│ Registro │  │ Planificac. │  │ Geolocaliz.  │
│  Diario  │  │ Actividades │  │    Rutas     │
└────┬─────┘  └──────┬──────┘  └──────┬───────┘
     │               │                │
     │ subscribe()   │ subscribe()    │ subscribe()
     │               │                │
     ▼               ▼                ▼
┌──────────────────────────────────────┐
│   Cambios en actividades se          │
│   sincronizan automáticamente        │
│   entre todos los componentes        │
└──────────────────────────────────────┘
```

---

## 📊 Flujo de Creación de Datos

### Ejemplo: Crear un Nuevo Incidente (Guardarecurso)

```
1. Usuario → Guardarecurso inicia sesión
   └─→ Va a "Incidentes con Visitantes"

2. Click en "Nuevo Incidente"
   └─→ Se abre Dialog con formulario

3. Llena formulario:
   - Tipo de incidente
   - Título
   - Descripción
   - Ubicación
   - Gravedad
   - Visitantes involucrados

4. Click en "Crear Incidente"
   └─→ Validación de formulario

5. Si válido:
   └─→ Crea objeto con estructura de IncidenteVisitante
   └─→ Agrega a lista de incidentes
   └─→ Muestra notificación de éxito (toast)
   └─→ Cierra diálogo
   └─→ Actualiza lista

6. Guardarecurso ve su incidente en la lista
   - Estado inicial: "Nuevo"
   - Solo puede verlo, NO puede cambiar estado

7. Admin/Coordinador:
   - Ven el incidente
   - Pueden cambiar estado
   - Pueden agregar seguimiento
```

---

## 🛣️ Roadmap de Archivos para Producción

### Fase 1: Conectar Backend

```
📁 utils/
  └── 📄 api.ts              ← CREAR: Cliente API
  └── 📄 auth.ts             ← CREAR: Autenticación real
  
📁 hooks/
  └── 📄 useAuth.ts          ← CREAR: Hook de auth
  └── 📄 useData.ts          ← CREAR: Hook para datos
```

### Fase 2: Gestión de Estado

```
📁 store/
  └── 📄 authStore.ts        ← CREAR: Estado de auth
  └── 📄 dataStore.ts        ← CREAR: Estado de datos
```

### Fase 3: Configuración

```
📄 .env                      ← CREAR: Variables de entorno
📄 .env.example              ← CREAR: Template de .env
```

---

**Este mapa te ayuda a visualizar cómo fluye la información en el sistema** 🗺️
