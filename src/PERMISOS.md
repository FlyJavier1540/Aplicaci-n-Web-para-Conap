# Sistema de Permisos por Rol - CONAP

## Roles de Usuario

El sistema maneja 3 roles específicos:

1. **Administrador** - Acceso completo a todos los módulos (con restricciones específicas en Registro Diario e Incidentes)
2. **Coordinador** - Acceso a todo excepto Gestión de Usuarios (con las mismas restricciones que Administrador)
3. **Guardarecurso** - Acceso limitado a 3 módulos específicos

## Usuarios Demo

Para probar el sistema, se han configurado los siguientes usuarios:

| Email | Rol | Contraseña |
|-------|-----|------------|
| carlos.mendoza@conap.gob.gt | Administrador | conap123 |
| maria.garcia@conap.gob.gt | Coordinador | conap123 |
| jose.lopez@conap.gob.gt | Guardarecurso | conap123 |

## Matriz de Permisos

### Administrador
✅ **Dashboard** - Acceso completo
✅ **Registro de Guardarecursos** - Acceso completo (crear, editar, eliminar, visualizar)
✅ **Áreas Protegidas** - Acceso completo (crear, editar, eliminar, visualizar)
✅ **Control de Equipos** - Acceso completo (crear, editar, eliminar, visualizar)
✅ **Planificación de Actividades** - Acceso completo (crear, editar, eliminar, visualizar)
⚠️ **Registro Diario de Campo** - Solo filtrar y visualizar (NO puede crear ni editar actividades)
✅ **Registro Fotográfico** - Acceso completo (crear, editar, eliminar, visualizar)
✅ **Geolocalización de Rutas** - Acceso completo (crear, editar, eliminar, visualizar)
✅ **Reporte de Hallazgos** - Acceso completo (crear, editar, eliminar, visualizar)
✅ **Seguimiento de Cumplimiento** - Acceso completo (crear, editar, eliminar, visualizar)
⚠️ **Incidentes con Visitantes** - Solo visualizar y cambiar estados (NO puede crear nuevos incidentes)
✅ **Reportes Periódicos** - Acceso completo (crear, editar, eliminar, visualizar)
✅ **Gestión de Usuarios** - Acceso completo (crear, editar, eliminar, visualizar)

### Coordinador
✅ **Dashboard** - Acceso completo
✅ **Registro de Guardarecursos** - Acceso completo (crear, editar, eliminar, visualizar)
✅ **Áreas Protegidas** - Acceso completo (crear, editar, eliminar, visualizar)
✅ **Control de Equipos** - Acceso completo (crear, editar, eliminar, visualizar)
✅ **Planificación de Actividades** - Acceso completo (crear, editar, eliminar, visualizar)
⚠️ **Registro Diario de Campo** - Solo filtrar y visualizar (NO puede crear ni editar actividades)
✅ **Registro Fotográfico** - Acceso completo (crear, editar, eliminar, visualizar)
✅ **Geolocalización de Rutas** - Acceso completo (crear, editar, eliminar, visualizar)
✅ **Reporte de Hallazgos** - Acceso completo (crear, editar, eliminar, visualizar)
✅ **Seguimiento de Cumplimiento** - Acceso completo (crear, editar, eliminar, visualizar)
⚠️ **Incidentes con Visitantes** - Solo visualizar y cambiar estados (NO puede crear nuevos incidentes)
✅ **Reportes Periódicos** - Acceso completo (crear, editar, eliminar, visualizar)
❌ **Gestión de Usuarios** - Sin acceso

### Guardarecurso
❌ **Dashboard** - Sin acceso
❌ **Resto de módulos** - Sin acceso
✅ **Control de Equipos** - Solo visualización de equipos asignados (sin edición ni filtros)
✅ **Registro Diario de Campo** - Acceso completo para editar solo sus propias actividades (sin filtros) - **VISTA INICIAL**
✅ **Incidentes con Visitantes** - Puede crear y ver sus propios incidentes (no puede cambiar estados ni agregar seguimiento, pero SÍ puede ver el historial completo de seguimiento)

## Vistas Iniciales al Iniciar Sesión

- **Administrador** → Dashboard
- **Coordinador** → Dashboard  
- **Guardarecurso** → Registro Diario de Campo

## Implementación Técnica

El sistema de permisos está centralizado en `/utils/permissions.ts` y se aplica automáticamente en todos los módulos mediante la prop `userPermissions`.

## Navegación Dinámica

El sidebar se adapta automáticamente según el rol:
- Muestra solo las categorías con módulos accesibles
- Oculta módulos sin permisos de visualización
- Colapsa categorías vacías automáticamente
- Mensaje de "Acceso Denegado" para módulos restringidos
