# 📘 Guía de Desarrollo - Sistema CONAP

## 🎯 Descripción General

Este es el sistema de gestión para CONAP (Consejo Nacional de Áreas Protegidas) de Guatemala. Incluye 12 módulos organizados en 4 categorías para la gestión de guardarecursos y áreas protegidas.

### 🛠️ Tecnologías Utilizadas

```
⚛️  React 18                    → Framework principal
🎨  Tailwind CSS v4.0           → Estilos y diseño
📘  TypeScript                  → Tipado estático
🎭  Motion (Framer Motion)      → Animaciones
🎨  ShadCN UI                   → Componentes UI
🔥  Lucide React                → Iconos
📅  date-fns                    → Manejo de fechas
🍞  Sonner                      → Notificaciones toast
🚀  Lazy Loading                → Optimización de carga
🌙  Dark Mode                   → Tema oscuro/claro
📱  Responsive Design           → Móvil, tablet, desktop
```

### 📦 Dependencias Principales

```json
{
  "react": "^18.x",
  "motion/react": "Animaciones suaves",
  "tailwindcss": "^4.0",
  "lucide-react": "Iconos",
  "date-fns": "Manejo de fechas",
  "sonner": "^2.0.3 (Toast notifications)"
}
```

## 🚀 Inicio Rápido

### Usuarios de Prueba

#### 1. **ADMINISTRADOR** ✅
- **Email**: `carlos.mendoza@conap.gob.gt`
- **Password**: `conap123`
- **Vista Inicial**: Dashboard
- **Permisos**: Acceso completo excepto:
  - No puede iniciar ni editar actividades en "Registro Diario"
  - No puede crear "Incidentes con Visitantes"

#### 2. **COORDINADOR** 📊
- **Email**: `maria.garcia@conap.gob.gt`
- **Password**: `conap123`
- **Vista Inicial**: Dashboard
- **Permisos**: Todo excepto "Gestión de Usuarios"

#### 3. **GUARDARECURSO** 👤
- **Email**: `jose.lopez@conap.gob.gt`
- **Password**: `conap123`
- **Vista Inicial**: Registro Diario de Campo
- **Permisos**: Solo 3 módulos:
  - Control de Equipos (solo lectura)
  - Registro Diario de Campo (edición completa)
  - Incidentes con Visitantes (crear y ver)

---

## 📂 Estructura Completa de Archivos

```
📁 CONAP/
├── 📄 App.tsx                              # ⭐ COMPONENTE PRINCIPAL - Punto de entrada
│
├── 📁 components/                          # COMPONENTES DE LA APLICACIÓN
│   ├── 📄 Dashboard.tsx                    # 📊 Dashboard principal con estadísticas
│   │
│   ├── 🟢 GESTIÓN DE PERSONAL
│   ├── 📄 RegistroGuardarecursos.tsx      # Registro y gestión de guardarecursos
│   ├── 📄 AsignacionZonas.tsx             # Gestión de áreas protegidas
│   ├── 📄 ControlEquipos.tsx              # Control de equipos asignados
│   │
│   ├── 🔵 OPERACIONES DE CAMPO
│   ├── 📄 PlanificacionActividades.tsx    # Planificación de actividades
│   ├── 📄 RegistroDiario.tsx              # Registro diario de campo (módulo principal)
│   ├── 📄 EvidenciasFotograficas.tsx      # Registro fotográfico
│   ├── 📄 GeolocalizacionRutas.tsx        # Geolocalización de rutas GPS
│   │
│   ├── 🟠 CONTROL Y SEGUIMIENTO
│   ├── 📄 ReporteHallazgos.tsx            # Reporte de hallazgos ambientales
│   ├── 📄 SeguimientoCumplimiento.tsx     # Seguimiento de cumplimiento
│   ├── 📄 RegistroIncidentes.tsx          # Incidentes con visitantes
│   ├── 📄 ReportesPeriodicos.tsx          # Reportes periódicos
│   │
│   ├── 🟣 ADMINISTRACIÓN
│   ├── 📄 GestionUsuarios.tsx             # Gestión de usuarios y roles
│   │
│   ├── 🔐 AUTENTICACIÓN
│   ├── 📄 Login.tsx                        # Pantalla de inicio de sesión
│   ├── 📄 CambiarContrasena.tsx           # Diálogo para cambiar contraseña propia
│   ├── 📄 CambiarContrasenaAdmin.tsx      # Admin cambia contraseña de otro usuario
│   ├── 📄 RestablecerContrasena.tsx       # Restablecer contraseña olvidada
│   │
│   ├── 🗺️ COMPONENTES AUXILIARES
│   ├── 📄 MapaAreasProtegidas.tsx         # Mapa interactivo de Guatemala
│   ├── 📄 AreaProtegidaDetalle.tsx        # Detalles de área protegida
│   │
│   ├── 🎨 TEMA Y UI
│   ├── 📄 ThemeProvider.tsx               # Proveedor de tema oscuro/claro
│   ├── 📄 ThemeToggle.tsx                 # Botón para cambiar tema
│   │
│   ├── 📁 figma/                          # Componentes de Figma
│   │   └── 📄 ImageWithFallback.tsx       # Componente de imagen con fallback
│   │
│   └── 📁 ui/                             # COMPONENTES UI (SHADCN)
│       ├── 📄 alert-dialog.tsx            # ✅ Diálogos de confirmación
│       ├── 📄 alert.tsx                   # ✅ Alertas y notificaciones
│       ├── 📄 badge.tsx                   # ✅ Etiquetas de estado
│       ├── 📄 button.tsx                  # ✅ Botones
│       ├── 📄 calendar.tsx                # ✅ Calendario
│       ├── 📄 card.tsx                    # ✅ Tarjetas
│       ├── 📄 dialog.tsx                  # ✅ Diálogos modales
│       ├── 📄 dropdown-menu.tsx           # ✅ Menús desplegables
│       ├── 📄 input.tsx                   # ✅ Campos de texto
│       ├── 📄 label.tsx                   # ✅ Etiquetas de formulario
│       ├── 📄 popover.tsx                 # ✅ Popovers
│       ├── 📄 progress.tsx                # ✅ Barras de progreso
│       ├── 📄 select.tsx                  # ✅ Selectores
│       ├── 📄 sidebar.tsx                 # ✅ Menú lateral
│       ├── 📄 sonner.tsx                  # ✅ Toast notifications
│       ├── 📄 switch.tsx                  # ✅ Interruptores
│       ├── 📄 table.tsx                   # ✅ Tablas
│       ├── 📄 tabs.tsx                    # ✅ Pestañas
│       ├── 📄 textarea.tsx                # ✅ Áreas de texto
│       ├── 📄 use-mobile.ts               # Hook para detectar móvil
│       ├── 📄 utils.ts                    # Utilidades UI
│       │
│       ├── ❌ COMPONENTES NO USADOS (Pueden eliminarse si lo deseas)
│       ├── 📄 accordion.tsx
│       ├── 📄 aspect-ratio.tsx
│       ├── 📄 avatar.tsx
│       ├── 📄 breadcrumb.tsx
│       ├── 📄 carousel.tsx
│       ├── 📄 chart.tsx
│       ├── 📄 checkbox.tsx
│       ├── 📄 collapsible.tsx
│       ├── 📄 command.tsx
│       ├── 📄 context-menu.tsx
│       ├── 📄 drawer.tsx
│       ├── 📄 form.tsx
│       ├── 📄 hover-card.tsx
│       ├── 📄 input-otp.tsx
│       ├── 📄 menubar.tsx
│       ├── 📄 navigation-menu.tsx
│       ├── 📄 pagination.tsx
│       ├── 📄 radio-group.tsx
│       ├── 📄 resizable.tsx
│       ├── 📄 scroll-area.tsx
│       ├── 📄 separator.tsx
│       ├── 📄 sheet.tsx
│       ├── 📄 skeleton.tsx
│       ├── 📄 slider.tsx
│       ├── 📄 toggle-group.tsx
│       └── 📄 toggle.tsx
│       └── 📄 tooltip.tsx
│
├── 📁 data/                               # DATOS DE EJEMPLO
│   └── 📄 mock-data.ts                    # ⭐ TODOS los datos mock (usuarios, áreas, etc.)
│
├── 📁 types/                              # DEFINICIONES DE TIPOS
│   └── 📄 index.ts                        # ⭐ TODAS las interfaces TypeScript
│
├── 📁 utils/                              # UTILIDADES
│   ├── 📄 permissions.ts                  # ⭐ SISTEMA DE PERMISOS (MUY IMPORTANTE)
│   └── 📄 actividadesSync.ts              # Sincronización de actividades en tiempo real
│
├── 📁 styles/                             # ESTILOS GLOBALES
│   └── 📄 globals.css                     # Estilos CSS globales y tema
│
├── 📁 guidelines/                         # DOCUMENTACIÓN INTERNA
│   └── 📄 Guidelines.md                   # Guías de Figma Make
│
├── 📄 GUIA_DESARROLLO.md                  # 📘 ESTA GUÍA - Desarrollo completo
├── 📄 CAMBIOS_RAPIDOS.md                  # ⚡ Referencia rápida de cambios
├── 📄 VERIFICACION_SISTEMA.md             # ✅ Checklist de funcionalidad
├── 📄 PERMISOS.md                         # 🔐 Documentación de permisos
└── 📄 Attributions.md                     # Atribuciones de componentes
```

### 📊 Estadísticas del Proyecto

```
📦 Total de Archivos: 84 archivos

📂 Componentes Principales:    21 archivos
   ├── Módulos de negocio:     12 archivos (los 12 módulos del sistema)
   ├── Autenticación:           4 archivos
   ├── UI/Auxiliares:           5 archivos

📂 Componentes UI (ShadCN):    45 archivos
   ├── En uso:                 18 archivos ✅
   ├── Sin usar:               27 archivos ❌

📂 Utilidades y Tipos:          3 archivos
📂 Datos:                       1 archivo
📂 Estilos:                     1 archivo
📂 Documentación:               5 archivos
```

### 📝 Descripción Detallada de Archivos

#### 🎯 Archivos Principales (MUY IMPORTANTES)

| Archivo | Descripción | Cuándo Modificar |
|---------|-------------|------------------|
| **App.tsx** | Componente raíz, maneja navegación, autenticación y permisos | Agregar módulos, cambiar vistas iniciales |
| **utils/permissions.ts** | Sistema completo de permisos por rol | Cambiar permisos de cualquier rol |
| **data/mock-data.ts** | Todos los datos de ejemplo | Agregar usuarios, áreas, guardarecursos |
| **types/index.ts** | Interfaces TypeScript del sistema | Agregar nuevos campos a datos existentes |

#### 🟢 Módulos - Gestión de Personal

| Archivo | Descripción | Características |
|---------|-------------|----------------|
| **RegistroGuardarecursos.tsx** | CRUD de guardarecursos | Crear, editar, suspender, cambiar contraseña |
| **AsignacionZonas.tsx** | Gestión de áreas protegidas | Asignar guardarecursos, editar zonas |
| **ControlEquipos.tsx** | Equipos asignados | Radios, GPS, vehículos, herramientas |

#### 🔵 Módulos - Operaciones de Campo

| Archivo | Descripción | Características |
|---------|-------------|----------------|
| **PlanificacionActividades.tsx** | Planificar actividades futuras | Calendario, asignación, tipos de actividad |
| **RegistroDiario.tsx** | 🔥 MÓDULO PRINCIPAL | Cronómetro, hallazgos, evidencias, GPS |
| **EvidenciasFotograficas.tsx** | Galería de fotos | Fauna, flora, infraestructura |
| **GeolocalizacionRutas.tsx** | Visualización de rutas GPS | Mapas, puntos, recorridos |

#### 🟠 Módulos - Control y Seguimiento

| Archivo | Descripción | Características |
|---------|-------------|----------------|
| **ReporteHallazgos.tsx** | Hallazgos ambientales | Estados, seguimiento, evidencias |
| **SeguimientoCumplimiento.tsx** | Seguimiento de cumplimiento | Estadísticas, progreso, métricas |
| **RegistroIncidentes.tsx** | Incidentes con visitantes | Acciones, gravedad, seguimiento |
| **ReportesPeriodicos.tsx** | Reportes programados | Diario, semanal, mensual, anual |

#### 🟣 Módulos - Administración

| Archivo | Descripción | Características |
|---------|-------------|----------------|
| **GestionUsuarios.tsx** | CRUD de usuarios del sistema | Roles, permisos, activar/desactivar |

#### 🔐 Autenticación

| Archivo | Descripción | Cuándo se Usa |
|---------|-------------|---------------|
| **Login.tsx** | Pantalla de login | Inicio de sesión |
| **CambiarContrasena.tsx** | Usuario cambia su propia contraseña | Desde menú de usuario |
| **CambiarContrasenaAdmin.tsx** | Admin cambia contraseña de otro usuario | Gestión de Usuarios/Guardarecursos |
| **RestablecerContrasena.tsx** | Recuperar contraseña olvidada | Link en pantalla de login |

#### 🎨 UI y Componentes Auxiliares

| Archivo | Descripción | Dónde se Usa |
|---------|-------------|--------------|
| **Dashboard.tsx** | Pantalla principal | Vista inicial de Admin/Coordinador |
| **MapaAreasProtegidas.tsx** | Mapa de Guatemala | Dashboard |
| **AreaProtegidaDetalle.tsx** | Detalles de área | Dashboard (al hacer clic en área) |
| **ThemeProvider.tsx** | Contexto de tema | Toda la aplicación |
| **ThemeToggle.tsx** | Botón cambiar tema | Header, Login |

#### 🛠️ Utilidades

| Archivo | Descripción | Importancia |
|---------|-------------|-------------|
| **utils/permissions.ts** | Sistema de permisos | ⭐⭐⭐⭐⭐ CRÍTICO |
| **utils/actividadesSync.ts** | Sincronización de actividades | Importante para Registro Diario |
| **components/ui/utils.ts** | Utilidades de UI | Helper functions |
| **components/ui/use-mobile.ts** | Detectar dispositivo móvil | Responsive design |

#### 🎨 Estilos

| Archivo | Descripción | Para Cambiar |
|---------|-------------|--------------|
| **styles/globals.css** | Estilos globales + variables de tema | Colores, fuentes, espaciados |

#### 📚 Documentación

| Archivo | Descripción | Para Quién |
|---------|-------------|------------|
| **GUIA_DESARROLLO.md** | Esta guía completa | Desarrolladores nuevos |
| **CAMBIOS_RAPIDOS.md** | Referencia rápida | Desarrollo diario |
| **VERIFICACION_SISTEMA.md** | Checklist de testing | QA y testing |
| **PERMISOS.md** | Doc. de permisos | Entender sistema de roles |
| **Attributions.md** | Licencias | Legal |

#### ✅ Componentes UI - EN USO

Estos componentes ShadCN se usan activamente:

```
alert-dialog.tsx      → Confirmaciones de eliminación
alert.tsx             → Mensajes de error/éxito
badge.tsx             → Estados (Activo, Suspendido, etc.)
button.tsx            → Todos los botones
calendar.tsx          → Selección de fechas
card.tsx              → Contenedores principales
dialog.tsx            → Diálogos modales
dropdown-menu.tsx     → Menús de usuario/acciones
input.tsx             → Campos de texto
label.tsx             → Etiquetas de formulario
popover.tsx           → Popovers de fecha
progress.tsx          → Barras de progreso
select.tsx            → Selectores de opciones
sidebar.tsx           → Menú lateral principal
sonner.tsx            → Notificaciones toast
switch.tsx            → Toggle tema oscuro/claro
table.tsx             → Tablas de datos
tabs.tsx              → Pestañas en formularios
textarea.tsx          → Campos de texto largo
```

#### ❌ Componentes UI - SIN USAR

Estos componentes están disponibles pero no se usan actualmente. Puedes eliminarlos si deseas reducir el tamaño del proyecto:

```
accordion.tsx, aspect-ratio.tsx, avatar.tsx, breadcrumb.tsx,
carousel.tsx, chart.tsx, checkbox.tsx, collapsible.tsx,
command.tsx, context-menu.tsx, drawer.tsx, form.tsx,
hover-card.tsx, input-otp.tsx, menubar.tsx, navigation-menu.tsx,
pagination.tsx, radio-group.tsx, resizable.tsx, scroll-area.tsx,
separator.tsx, sheet.tsx, skeleton.tsx, slider.tsx,
toggle-group.tsx, toggle.tsx, tooltip.tsx
```

---

## 🔐 Sistema de Permisos

### Archivo Principal: `/utils/permissions.ts`

Este archivo controla **TODOS** los permisos de la aplicación.

### ⚠️ Cómo Cambiar Permisos

1. Abre `/utils/permissions.ts`
2. Busca la sección `ROLE_PERMISSIONS`
3. Encuentra el rol que quieres modificar
4. Cambia los valores `true/false`

**Ejemplo**: Si quieres que los Coordinadores puedan crear incidentes:

```typescript
Coordinador: {
  ...
  [MODULES.INCIDENTES]: { 
    canView: true, 
    canCreate: true,  // ← Cambiar de false a true
    canEdit: true, 
    canDelete: true 
  },
  ...
}
```

### Estructura de Permisos

```typescript
{
  canView: boolean,    // ¿Puede ver el módulo?
  canCreate: boolean,  // ¿Puede crear registros?
  canEdit: boolean,    // ¿Puede editar registros?
  canDelete: boolean   // ¿Puede eliminar registros?
}
```

---

## 📝 Modificar Datos de Ejemplo

### Archivo Principal: `/data/mock-data.ts`

Contiene todos los datos de prueba.

### ⚠️ Para Producción

> **IMPORTANTE**: En producción, estos datos deben venir de una base de datos real (Supabase, PostgreSQL, etc.)

### Cómo Agregar Datos

#### 1. Agregar un Nuevo Usuario

```typescript
// En /data/mock-data.ts, busca: export const usuarios: Usuario[]
{
  id: '4',                          // ID único
  nombre: 'Nombre',
  apellido: 'Apellido',
  email: 'email@conap.gob.gt',
  telefono: '+502 5555-0000',
  password: 'password123',
  rol: 'Coordinador',               // Administrador | Coordinador | Guardarecurso
  estado: 'Activo',
  fechaCreacion: '2025-10-17',
  permisos: [],
  areaAsignada: '1'
}
```

#### 2. Agregar un Área Protegida

```typescript
// En /data/mock-data.ts, busca: areasProtegidasBase
{
  id: '6',
  nombre: 'Nueva Área',
  categoria: 'Parque Nacional',     // Ver opciones en /types/index.ts
  departamento: 'Guatemala',
  extension: 5000,                  // En hectáreas
  fechaCreacion: '2025-01-01',
  coordenadas: { lat: 14.6407, lng: -90.5133 },
  descripcion: 'Descripción del área',
  ecosistemas: ['Bosque Húmedo'],
  estado: 'Habilitado'
}
```

---

## 🎨 Cambiar Vistas Iniciales por Rol

### Archivo: `/App.tsx`

Busca la sección comentada con `// ===== VISTA INICIAL POR ROL =====`

```typescript
// Vista inicial para cada rol
const initialSection = currentUser.rol === 'Guardarecurso' 
  ? 'registro-diario'  // ← Vista para Guardarecurso
  : 'dashboard';       // ← Vista para Admin y Coordinador

const initialCategory = currentUser.rol === 'Guardarecurso' 
  ? 'operaciones'      // ← Categoría para Guardarecurso
  : 'personal';        // ← Categoría para Admin y Coordinador
```

**Opciones de Secciones**:
- `'dashboard'`
- `'registro-guarda'`
- `'asignacion-zonas'`
- `'control-equipos'`
- `'planificacion'`
- `'registro-diario'`
- `'evidencias'`
- `'geolocalizacion'`
- `'hallazgos'`
- `'seguimiento'`
- `'incidentes'`
- `'reportes'`
- `'usuarios'`

**Opciones de Categorías**:
- `'personal'` - Gestión de Personal
- `'operaciones'` - Operaciones de Campo
- `'control'` - Control y Seguimiento
- `'admin'` - Administración

---

## ➕ Agregar un Nuevo Módulo

### Paso 1: Crear el Componente

Crea un nuevo archivo en `/components/NuevoModulo.tsx`:

```typescript
import { Card } from './ui/card';

interface NuevoModuloProps {
  userPermissions: {
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
  };
  currentUser?: any;
}

export function NuevoModulo({ userPermissions, currentUser }: NuevoModuloProps) {
  return (
    <div>
      <h1>Nuevo Módulo</h1>
      {/* Tu contenido aquí */}
    </div>
  );
}
```

### Paso 2: Agregar a la Navegación

En `/App.tsx`, busca `navigationCategories` y agrega:

```typescript
{
  id: 'nuevo-modulo',           // ← ID único
  name: 'Nombre del Módulo',
  icon: FileText                // ← Ícono de lucide-react
}
```

### Paso 3: Agregar Import Lazy

Al inicio de `/App.tsx`:

```typescript
const NuevoModulo = lazy(() => import('./components/NuevoModulo')
  .then(m => ({ default: m.NuevoModulo })));
```

### Paso 4: Agregar al Renderizador

En la función `renderContent()` de `/App.tsx`:

```typescript
case 'nuevo-modulo':
  return userPermissions.canView ? (
    <Suspense fallback={<LoadingFallback />}>
      <NuevoModulo userPermissions={userPermissions} currentUser={currentUser} />
    </Suspense>
  ) : <AccessDenied />;
```

### Paso 5: Agregar Permisos

En `/utils/permissions.ts`, agrega en `MODULES`:

```typescript
export const MODULES = {
  ...
  NUEVO_MODULO: 'nuevo-modulo',
  ...
}
```

Luego agrega permisos para cada rol en `ROLE_PERMISSIONS`:

```typescript
Administrador: {
  ...
  [MODULES.NUEVO_MODULO]: { 
    canView: true, 
    canCreate: true, 
    canEdit: true, 
    canDelete: true 
  },
  ...
}
```

---

## 🎨 Personalización del Tema

### Colores Principales

En `/styles/globals.css`:

```css
--primary: 142 76% 36%;        /* Verde CONAP */
--secondary: 214 32% 91%;      /* Gris claro */
```

### Modo Oscuro

El sistema tiene modo oscuro completo implementado. Los usuarios pueden cambiar el tema con el botón en la esquina superior derecha.

---

## 🔍 Debugging y Desarrollo

### Ver Estado Actual del Usuario

En cualquier componente:

```typescript
console.log('Usuario actual:', currentUser);
console.log('Permisos:', userPermissions);
```

### Verificar Permisos

```typescript
import { getModulePermissions } from './utils/permissions';

const permisos = getModulePermissions('Coordinador', 'registro-diario');
console.log(permisos); // { canView: true, canCreate: false, ... }
```

---

## 📱 Responsive Design

La aplicación es completamente responsive:
- **Móvil**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

El menú lateral se convierte en un menú hamburguesa en dispositivos móviles.

---

## 🚀 Preparar para Producción

### 1. Conectar Base de Datos

Reemplaza `/data/mock-data.ts` con llamadas a tu API:

```typescript
// Antes (mock-data)
import { usuarios } from '../data/mock-data';

// Después (API real)
const usuarios = await fetch('/api/usuarios').then(r => r.json());
```

### 2. Hash de Contraseñas

**NUNCA** almacenes contraseñas en texto plano. Usa bcrypt:

```typescript
import bcrypt from 'bcrypt';

const hashedPassword = await bcrypt.hash('conap123', 10);
```

### 3. Variables de Entorno

Crea un archivo `.env`:

```bash
VITE_API_URL=https://api.conap.gob.gt
VITE_SUPABASE_URL=tu-url
VITE_SUPABASE_KEY=tu-key
```

### 4. Autenticación Real

Implementa JWT o sesiones:

```typescript
// Ejemplo con JWT
localStorage.setItem('token', jwtToken);
```

---

## 📞 Soporte y Recursos

### 📚 Documentación Disponible

| Documento | Descripción | Cuándo Usarlo |
|-----------|-------------|---------------|
| **GUIA_DESARROLLO.md** | Esta guía completa | Desarrollo general, agregar módulos |
| **CAMBIOS_RAPIDOS.md** | Referencia rápida | Cambios comunes del día a día |
| **MAPA_FLUJO.md** | Diagramas de flujo | Entender flujo de datos y permisos |
| **VERIFICACION_SISTEMA.md** | Checklist de testing | Testing y QA |
| **PERMISOS.md** | Documentación de permisos | Sistema de roles |

### 🔍 Resolución de Problemas

**¿No puedes acceder a un módulo?**
1. Verifica el rol del usuario en `/data/mock-data.ts`
2. Revisa los permisos en `/utils/permissions.ts`
3. Consulta la matriz en `/MAPA_FLUJO.md`

**¿Un componente no muestra datos?**
1. Verifica que existan datos en `/data/mock-data.ts`
2. Revisa la consola del navegador (F12)
3. Verifica que el componente tenga `userPermissions.canView`

**¿Quieres entender cómo fluye un proceso?**
1. Consulta `/MAPA_FLUJO.md`
2. Busca el diagrama del módulo específico

---

## 📄 Archivos Comentados

Todos los archivos clave tienen comentarios detallados:

| Archivo | Comentarios |
|---------|-------------|
| ✅ `/types/index.ts` | Cada interfaz explicada |
| ✅ `/utils/permissions.ts` | Sistema completo documentado |
| ✅ `/data/mock-data.ts` | Usuarios de prueba explicados |
| ✅ `/App.tsx` | Navegación y vistas iniciales |

---

## 🎯 Próximos Pasos Recomendados

### Día 1: Familiarización
1. ✅ **Lee esta guía completa** - Especialmente las secciones de permisos
2. ✅ **Revisa `/MAPA_FLUJO.md`** - Entiende los diagramas
3. ✅ **Inicia sesión con los 3 roles** - Administrador, Coordinador, Guardarecurso
4. ✅ **Explora cada módulo** - Verifica qué puede hacer cada rol

### Día 2: Código
1. ✅ **Lee los archivos comentados** - `/types`, `/utils/permissions`, `/data/mock-data`
2. ✅ **Inspecciona un componente simple** - Por ejemplo, `ControlEquipos.tsx`
3. ✅ **Inspecciona un componente complejo** - Por ejemplo, `RegistroDiario.tsx`
4. ✅ **Entiende el flujo de permisos** - Cómo `userPermissions` controla la UI

### Día 3: Práctica
1. ✅ **Haz un cambio sencillo** - Por ejemplo, cambiar un color en `globals.css`
2. ✅ **Agrega un nuevo usuario** - Siguiendo `/CAMBIOS_RAPIDOS.md`
3. ✅ **Modifica un permiso** - Cambia algo en `/utils/permissions.ts`
4. ✅ **Prueba el cambio** - Verifica que funciona como esperas

### Semana 2: Desarrollo
1. ✅ **Intenta agregar un módulo pequeño** - Sigue la guía paso a paso
2. ✅ **Personaliza el diseño** - Cambia colores, logos, etc.
3. ✅ **Planifica integración con backend** - Lee sección "Preparar para Producción"

---

## 🚀 Checklist de Inicio Rápido

Antes de empezar a desarrollar, verifica:

- [ ] He leído esta guía completa
- [ ] He revisado `/MAPA_FLUJO.md`
- [ ] He iniciado sesión con los 3 roles diferentes
- [ ] Entiendo el sistema de permisos
- [ ] Sé dónde están los datos mock (`/data/mock-data.ts`)
- [ ] Sé cómo cambiar permisos (`/utils/permissions.ts`)
- [ ] He revisado la estructura de archivos completa
- [ ] Tengo `/CAMBIOS_RAPIDOS.md` a mano para consultas rápidas

---

**¡Listo para desarrollar! 🚀**

### 💡 Tip Final

Mantén estas 4 ventanas abiertas mientras desarrollas:
1. **Tu editor de código** (VS Code, etc.)
2. **El navegador** con la aplicación corriendo
3. **`/CAMBIOS_RAPIDOS.md`** para consultas rápidas
4. **`/MAPA_FLUJO.md`** para entender flujos

**¡Éxito en tu desarrollo!** 🎉
