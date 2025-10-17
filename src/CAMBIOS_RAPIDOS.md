# ⚡ Cambios Rápidos - Referencia

## 🎯 Cambios Más Comunes

### 1️⃣ Cambiar Permisos de un Rol

**Archivo**: `/utils/permissions.ts`

**Ubicación**: Busca `ROLE_PERMISSIONS`

```typescript
// Ejemplo: Dar permiso a Coordinador para crear incidentes
Coordinador: {
  [MODULES.INCIDENTES]: { 
    canView: true, 
    canCreate: true,  // ← Cambiar de false a true
    canEdit: true, 
    canDelete: true 
  },
}
```

---

### 2️⃣ Cambiar Vista Inicial de un Rol

**Archivo**: `/App.tsx`

**Ubicación**: Busca `// ===== VISTA INICIAL POR ROL =====`

```typescript
// Ejemplo: Que Coordinador inicie en Reportes
const initialSection = 
  currentUser.rol === 'Guardarecurso' ? 'registro-diario' :
  currentUser.rol === 'Coordinador' ? 'reportes' :  // ← Agregar esta línea
  'dashboard';
```

**IDs de Módulos Disponibles**:
- `dashboard`
- `registro-guarda`
- `asignacion-zonas`
- `control-equipos`
- `planificacion`
- `registro-diario`
- `evidencias`
- `geolocalizacion`
- `hallazgos`
- `seguimiento`
- `incidentes`
- `reportes`
- `usuarios`

---

### 3️⃣ Agregar Nuevo Usuario

**Archivo**: `/data/mock-data.ts`

**Ubicación**: Busca `export const usuarios: Usuario[]`

```typescript
{
  id: '4',                          // ← ID único (cambia el número)
  nombre: 'Ana',
  apellido: 'Rodríguez',
  email: 'ana.rodriguez@conap.gob.gt',
  telefono: '+502 5555-4444',
  password: 'conap123',
  rol: 'Coordinador',               // Administrador | Coordinador | Guardarecurso
  estado: 'Activo',
  fechaCreacion: '2025-10-17',
  permisos: [],
  areaAsignada: '1'
}
```

---

### 4️⃣ Agregar Nueva Área Protegida

**Archivo**: `/data/mock-data.ts`

**Ubicación**: Busca `areasProtegidasBase`

```typescript
{
  id: '6',                          // ← ID único
  nombre: 'Parque Nacional Las Victorias',
  categoria: 'Parque Nacional',
  departamento: 'Alta Verapaz',
  extension: 82,
  fechaCreacion: '1980-05-30',
  coordenadas: { lat: 15.4667, lng: -90.3833 },
  descripcion: 'Parque urbano con bosque nublado',
  ecosistemas: ['Bosque Nublado'],
  estado: 'Habilitado'
}
```

---

### 5️⃣ Agregar Nuevo Guardarecurso

**Archivo**: `/data/mock-data.ts`

**Ubicación**: Busca `export const guardarecursos: Guardarecurso[]`

```typescript
{
  id: '4',                          // ← ID único
  nombre: 'Pedro',
  apellido: 'González',
  cedula: '1234-56789-0101',
  telefono: '+502 5555-7777',
  email: 'pedro.gonzalez@conap.gob.gt',
  fechaIngreso: '2025-01-15',
  puesto: 'Guardarecurso',
  areaAsignada: '1',                // ← ID del área protegida
  zonaCobertura: ['1'],
  estado: 'Activo',
  equiposAsignados: [],
  actividades: []
}
```

---

### 6️⃣ Cambiar Colores del Tema

**Archivo**: `/styles/globals.css`

**Ubicación**: Busca `:root` y `.dark`

```css
:root {
  --primary: 142 76% 36%;        /* ← Verde principal CONAP */
  --secondary: 214 32% 91%;      /* ← Gris secundario */
  /* Cambiar estos valores para cambiar colores */
}
```

**Formato**: `H S% L%` (Hue, Saturation, Lightness)

**Ejemplos**:
- Azul: `217 91% 60%`
- Rojo: `0 84% 60%`
- Verde: `142 76% 36%` (actual)

---

### 7️⃣ Cambiar Logo de CONAP

**Archivo**: `/App.tsx`

**Ubicación**: Busca `import conapLogo`

```typescript
// Reemplazar el import con tu imagen
import conapLogo from './assets/tu-logo.png';
```

---

### 8️⃣ Agregar Nueva Categoría al Menú

**Archivo**: `/App.tsx`

**Ubicación**: Busca `const navigationCategories`

```typescript
{
  id: 'nueva-categoria',          // ← ID único
  title: 'Mi Nueva Categoría',
  icon: Settings,                 // ← Ícono de lucide-react
  color: 'indigo',
  gradient: 'from-indigo-500 to-purple-600',
  bgGradient: 'from-indigo-50/50 to-purple-50/50',
  darkBgGradient: 'from-indigo-950/50 to-purple-950/50',
  items: [
    { id: 'nuevo-modulo', name: 'Nuevo Módulo', icon: FileText }
  ]
}
```

---

### 9️⃣ Deshabilitar Modo Oscuro

**Archivo**: `/App.tsx`

**Ubicación**: Busca `<ThemeToggle`

```typescript
// Comentar o eliminar estas líneas:
// <ThemeToggle variant="compact" />
```

---

### 🔟 Cambiar Título de la Aplicación

**Archivo**: `/App.tsx`

**Ubicación**: Busca el texto `"CONAP"`

```typescript
<span className="text-sm font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
  TU NUEVO TÍTULO  {/* ← Cambiar aquí */}
</span>
```

---

## 📍 Archivos Clave para Editar

| Archivo | Para Cambiar |
|---------|-------------|
| `/utils/permissions.ts` | Permisos de roles |
| `/data/mock-data.ts` | Usuarios, áreas, guardarecursos |
| `/App.tsx` | Navegación, vistas iniciales |
| `/types/index.ts` | Estructura de datos |
| `/styles/globals.css` | Colores y estilos globales |

---

## 🚨 Cambios que Requieren Más Pasos

### Agregar Nuevo Módulo Completo

1. Crear componente en `/components/NuevoModulo.tsx`
2. Agregar import lazy en `/App.tsx`
3. Agregar al menú en `navigationCategories`
4. Agregar case en `renderContent()`
5. Agregar permisos en `/utils/permissions.ts`

Ver guía completa en `/GUIA_DESARROLLO.md` → Sección "Agregar un Nuevo Módulo"

---

### Conectar Base de Datos Real

1. Instalar cliente de base de datos (ej: Supabase)
2. Crear archivo `.env` con credenciales
3. Reemplazar imports de `mock-data` con llamadas API
4. Implementar autenticación real
5. Hash de contraseñas

Ver guía completa en `/GUIA_DESARROLLO.md` → Sección "Preparar para Producción"

---

## 💡 Tips Rápidos

### Encontrar Dónde Se Usa Algo

Usa la búsqueda de tu editor:

```
Ctrl/Cmd + F → Buscar en archivo actual
Ctrl/Cmd + Shift + F → Buscar en todo el proyecto
```

### Verificar Permisos de un Módulo

```typescript
import { getModulePermissions } from './utils/permissions';

const permisos = getModulePermissions('Coordinador', 'registro-diario');
console.log(permisos);
```

### Ver Usuario Actual en Consola

Agrega en cualquier componente:

```typescript
console.log('Usuario actual:', currentUser);
console.log('Permisos:', userPermissions);
```

---

## 🔗 Enlaces a Documentación

- **Guía Completa**: `/GUIA_DESARROLLO.md`
- **Verificación del Sistema**: `/VERIFICACION_SISTEMA.md`
- **Documentación de Permisos**: `/PERMISOS.md`
- **Esta Guía**: `/CAMBIOS_RAPIDOS.md`

---

## ✅ Optimización Completa de Formularios (100% Responsive)

### Todos los DialogContent Estandarizados

Se han actualizado **TODOS** los formularios de la aplicación para garantizar un comportamiento 100% responsive:

**Estándar aplicado a DialogContent**:
```tsx
// Para formularios grandes (4xl)
className="w-[95vw] sm:w-[90vw] max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6"

// Para formularios medianos (2xl-3xl)
className="w-[95vw] sm:w-[90vw] max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6"

// Para formularios pequeños (md)
className="w-[95vw] sm:w-[90vw] sm:max-w-md p-4 sm:p-6"
```

**Componentes actualizados**:
1. ✅ **RegistroDiario** (5 modales):
   - Modal editar foto
   - Modal completar actividad
   - Modal agregar hallazgo
   - Modal agregar evidencia
   - Modal reportar hallazgo independiente

2. ✅ **ReporteHallazgos** (3 modales):
   - Crear/Editar hallazgo
   - Ver detalles
   - Agregar seguimiento

3. ✅ **GeolocalizacionRutas**:
   - Ver detalles de ruta

4. ✅ **EvidenciasFotograficas** (2 modales):
   - Crear/Editar evidencia
   - Ver detalles

5. ✅ **CambiarContrasena**:
   - Modal cambio de contraseña
   - Inputs con altura responsive (h-10 sm:h-11)
   - Header responsive con iconos y textos escalables

6. ✅ **CambiarContrasenaAdmin**:
   - Modal cambio de contraseña admin
   - Inputs con altura responsive
   - Header responsive

7. ✅ **RestablecerContrasena**:
   - Modal restablecer contraseña
   - Input con altura responsive

**Mejoras aplicadas**:
- ✅ **Ancho responsive**: `w-[95vw]` en móvil, `sm:w-[90vw]` en tablet+
- ✅ **Altura máxima**: `max-h-[90vh]` para evitar modales muy altos
- ✅ **Scroll**: `overflow-y-auto` cuando el contenido excede la altura
- ✅ **Padding responsive**: `p-4 sm:p-6` (más compacto en móvil)
- ✅ **Headers responsive**:
  - Iconos: `w-10 h-10 sm:w-12 sm:h-12`
  - Títulos: `text-lg sm:text-xl md:text-2xl truncate`
  - Descripciones: `text-xs sm:text-sm truncate`
- ✅ **Inputs responsive**: `h-10 sm:h-11` en todos los campos de texto

### Botón de Cerrar (X) Optimizado

El botón X ahora es **sticky** y siempre visible:
- ✅ Posición `sticky top-0` (no se pierde al hacer scroll)
- ✅ Fondo `bg-background` con borde para mayor visibilidad
- ✅ Tamaño fijo `h-8 w-8` (mejor tap target en móvil)
- ✅ `z-10` para estar siempre visible sobre el contenido

## 📱 Optimizaciones Móviles

### Vista de Detalle de Área Protegida (Móvil)

En dispositivos móviles, cuando se selecciona un área protegida en el mapa del Dashboard:
- ✅ **Solo se muestra la información** (ubicación, extensión, ecosistema)
- ✅ **El mapa se oculta** para ahorrar espacio
- ✅ **Información ocupa todo el ancho** del modal

En tablets y desktop:
- ✅ **Se muestra el mapa** del área a la izquierda
- ✅ **Información a la derecha** en dos columnas

**Implementado en**: `/components/AreaProtegidaDetalle.tsx`

### Planificación de Actividades - Mejoras Responsive

**Problema resuelto**: Los badges de tipo de actividad se sobreponían al contenido
**Solución**:
- ✅ Badges en **columna** (uno debajo del otro) en lugar de fila
- ✅ Badge de tipo con `line-clamp-1` y ancho máximo
- ✅ Badge de estado con `whitespace-nowrap`
- ✅ Título más pequeño en móvil (`text-base` en lugar de `text-lg`)

**Implementado en**: `/components/PlanificacionActividades.tsx` (líneas 892-926)

### Reporte de Hallazgos - Vista Móvil Optimizada

**Cambios en vista móvil** (< 768px):
- ✅ **Solo se muestra el título** del hallazgo en la tabla
- ✅ **Descripción oculta** para ahorrar espacio
- ✅ **Acciones completas visibles** (Ver, Agregar seguimiento, Cambiar estado)

**Cambios en desktop**:
- ✅ **Título y descripción** visible
- ✅ **Todos los botones** de acciones visibles

**Implementado en**: `/components/ReporteHallazgos.tsx`
- Tabla de Activos (líneas 1212-1218)
- Tabla de Historial (líneas 1368-1375)
- Acciones siempre visibles (línea 1262-1323)

---

**¡Listo para hacer cambios rápidos! ⚡**
