# 📊 Referencia Rápida - Base de Datos CONAP

## 🎯 IDs de Catálogos

### Estados (tabla: estado)
| ID | Nombre | Uso |
|----|--------|-----|
| 1 | Activo | Usuarios, áreas activas |
| 2 | Inactivo | Usuarios, áreas deshabilitadas |
| 3 | En Proceso | Actividades en curso |
| 4 | Completado | Actividades terminadas |
| 5 | Reportado | Incidentes/hallazgos nuevos |
| 6 | En Investigación | Incidentes siendo atendidos |
| 7 | Resuelto | Incidentes solucionados |
| 8 | Cerrado | Incidentes archivados |
| 9 | Pendiente | Actividades programadas |
| 10 | Cancelado | Actividades canceladas |

### Roles de Usuario (tabla: usuario_rol)
| ID | Nombre | Permisos |
|----|--------|----------|
| 1 | Administrador | Acceso total a todos los módulos |
| 2 | Coordinador | Todos excepto Gestión de Usuarios |
| 3 | Guardarecurso | Solo 3 módulos: Registro Diario, Evidencias, Geolocalización |

### Tipos (tabla: tipo)

#### Actividades (1-8)
| ID | Nombre | Descripción |
|----|--------|-------------|
| 1 | Patrullaje | Recorridos de vigilancia |
| 2 | Monitoreo | Seguimiento de flora/fauna |
| 3 | Vigilancia | Control de zonas |
| 4 | Mantenimiento | Reparación de infraestructura |
| 5 | Inspección | Revisión de áreas |
| 6 | Rescate | Operaciones de emergencia |
| 7 | Capacitación | Formación y educación |
| 8 | Investigación | Estudios científicos |

#### Incidentes (9-16)
| ID | Nombre | Descripción |
|----|--------|-------------|
| 9 | Incendio Forestal | Fuegos en áreas protegidas |
| 10 | Tala Ilegal | Corte no autorizado de árboles |
| 11 | Caza Furtiva | Caza ilegal de animales |
| 12 | Invasión de Tierras | Ocupación ilegal de terrenos |
| 13 | Contaminación | Daños ambientales |
| 14 | Accidente de Visitante | Lesiones a turistas |
| 15 | Conflicto Comunitario | Disputas con comunidades |
| 16 | Emergencia Médica | Situaciones de salud |

#### Equipos (17-23)
| ID | Nombre | Ejemplos |
|----|--------|----------|
| 17 | Comunicación | Radios, teléfonos satelitales |
| 18 | Navegación | GPS, brújulas |
| 19 | Seguridad | Chalecos, cascos |
| 20 | Transporte | Vehículos, lanchas |
| 21 | Campamento | Tiendas, sacos de dormir |
| 22 | Rescate | Botiquines, cuerdas |
| 23 | Medición | Binoculares, cámaras trampa |

#### Fotografías (24-27)
| ID | Nombre | Uso |
|----|--------|-----|
| 24 | Evidencia | Pruebas de incidentes |
| 25 | Documentación | Registro de actividades |
| 26 | Identificación | Especies, personas |
| 27 | Reporte | Informes oficiales |

### Categorías (tabla: categoria)

#### Áreas Protegidas (1-5)
| ID | Nombre |
|----|--------|
| 1 | Parque Nacional |
| 2 | Reserva Biológica |
| 3 | Biotopo Protegido |
| 4 | Refugio de Vida Silvestre |
| 5 | Reserva Natural Privada |

#### Hallazgos (6-7)
| ID | Nombre |
|----|--------|
| 6 | Ambiental |
| 7 | Seguridad |

#### Gravedades (8-11)
| ID | Nombre | Color Sugerido |
|----|--------|----------------|
| 8 | Leve | Verde |
| 9 | Moderado | Amarillo |
| 10 | Grave | Naranja |
| 11 | Crítico | Rojo |

### Departamentos (tabla: departamento)
| ID | Nombre |
|----|--------|
| 1 | Petén |
| 2 | Guatemala |
| 3 | Escuintla |
| 4 | Izabal |
| 5 | Quetzaltenango |
| 6 | Alta Verapaz |
| 7 | Sacatepéquez |
| 8 | Sololá |
| 9 | Quiché |
| 10 | Huehuetenango |

### Ecosistemas (tabla: ecosistema)
| ID | Nombre |
|----|--------|
| 1 | Bosque Tropical Húmedo |
| 2 | Bosque Nuboso |
| 3 | Manglar |
| 4 | Humedal |
| 5 | Bosque Seco |
| 6 | Páramo |
| 7 | Arrecife de Coral |
| 8 | Bosque de Coníferas |
| 9 | Selva Tropical |
| 10 | Lago |

## 📋 Áreas Protegidas (tabla: area_protegida)

### 10 Áreas Principales
| ID | Nombre | Depto ID | Categoría ID |
|----|--------|----------|--------------|
| 1 | Parque Nacional Tikal | 1 | 1 |
| 2 | Volcán de Pacaya | 2 | 1 |
| 3 | Reserva de Biosfera Maya | 1 | 2 |
| 4 | Biotopo del Quetzal | 6 | 3 |
| 5 | Parque Nacional Laguna Lachuá | 6 | 1 |
| 6 | Cerro Cahuí | 1 | 1 |
| 7 | Parque Nacional Río Dulce | 4 | 1 |
| 8 | Monterrico | 3 | 4 |
| 9 | Volcán Atitlán | 8 | 1 |
| 10 | Volcán Tajumulco | 5 | 1 |

## 👥 Usuarios de Prueba (tabla: usuario)

| ID | Email | Password | Rol | Área |
|----|-------|----------|-----|------|
| 1 | admin@conap.gob.gt | Admin123! | 1 (Admin) | NULL |
| 2 | coordinador@conap.gob.gt | Coord123! | 2 (Coord) | NULL |
| 3 | guardarecurso@conap.gob.gt | Guard123! | 3 (Guard) | 1 (Tikal) |

## 🔗 Relaciones Importantes

### Usuario
- `usuario_rol` → FK a `usuario_rol.rol_id`
- `usuario_area` → FK a `area_protegida.area_id`
- `usuario_estado` → FK a `estado.estado_id`

### Área Protegida
- `area_categoria` → FK a `categoria.categoria_id`
- `area_departamento` → FK a `departamento.depto_id`
- `area_ubicacion` → FK a `ubicacion.ubicacion_id`
- `area_ecosistema` → FK a `ecosistema.eco_id`
- `estado` → FK a `estado.estado_id`

### Actividad
- `actividad_tipo` → FK a `tipo.tipo_id` (IDs 1-8)
- `actividad_usuario` → FK a `usuario.usuario_id`
- `actividad_estado` → FK a `estado.estado_id`

### Incidente
- `inc_tipo` → FK a `tipo.tipo_id` (IDs 9-16)
- `inc_categoria` → FK a `categoria.categoria_id` (IDs 8-11 para gravedad)
- `inc_usuario` → FK a `usuario.usuario_id`
- `inc_ubicacion` → FK a `ubicacion.ubicacion_id`
- `inc_estado` → FK a `estado.estado_id`

### Equipo
- `equipo_tipo` → FK a `tipo.tipo_id` (IDs 17-23)
- `equipo_usuario` → FK a `usuario.usuario_id`
- `equipo_estado` → FK a `estado.estado_id`

### Hallazgo
- `hallazgo_tipo` → FK a `tipo.tipo_id`
- `hallazgo_categoria` → FK a `categoria.categoria_id`
- `hallazgo_ubicacion` → FK a `ubicacion.ubicacion_id`
- `hallazgo_estado` → FK a `estado.estado_id`
- `hallazgo_actividad` → FK a `actividad.actividad_id`

### Fotografía
- `foto_tipo` → FK a `tipo.tipo_id` (IDs 24-27)
- `foto_ubicacion` → FK a `ubicacion.ubicacion_id`
- `foto_actividad` → FK a `actividad.actividad_id` (opcional)
- `foto_hallazgo` → FK a `hallazgo.hallazgos_id` (opcional)

### Seguimiento
- `seg_incidente` → FK a `incidentes.inc_id` (opcional)
- `seg_hallazgo` → FK a `hallazgo.hallazgos_id` (opcional)
- `seg_usuario` → FK a `usuario.usuario_id`

### Ruta de Geolocalización
- `ruta_actividad` → FK a `actividad.actividad_id`
- `ruta_ubicacion` → FK a `ubicacion.ubicacion_id`

## 🎨 Mapeo de Estados

### Para Actividades
- `Programada` → estado_id = 9 (Pendiente)
- `En Progreso` → estado_id = 3 (En Proceso)
- `Pausada` → estado_id = 9 (Pendiente)
- `Completada` → estado_id = 4 (Completado)

### Para Incidentes
- `Nuevo` → estado_id = 5 (Reportado)
- `En Atención` → estado_id = 6 (En Investigación)
- `Resuelto` → estado_id = 7 (Resuelto)
- `Cerrado` → estado_id = 8 (Cerrado)

### Para Usuarios
- `Activo` → estado_id = 1 (Activo)
- `Inactivo` → estado_id = 2 (Inactivo)
- `Suspendido` → estado_id = 2 (Inactivo)

## 📝 Notas Importantes

1. **Ubicaciones**: Siempre crear ubicación ANTES de crear incidentes/hallazgos
2. **Códigos de Actividad**: Formato `ACT-YYYYMMDD-XXX` generado automáticamente
3. **Timestamps**: Campos `created_at` y `updated_at` gestionados por PostgreSQL
4. **Auditoría**: Campos `created_by` y `updated_by` deben contener `usuario_id`
5. **Estados**: Usar IDs numéricos, no nombres de texto
6. **Foreign Keys**: Siempre validar que existan antes de insertar

## 🔍 Queries Útiles

### Obtener usuario con relaciones
```sql
SELECT u.*, r.rol_nombre, a.area_nombre, e.estado_nombre
FROM usuario u
LEFT JOIN usuario_rol r ON u.usuario_rol = r.rol_id
LEFT JOIN area_protegida a ON u.usuario_area = a.area_id
LEFT JOIN estado e ON u.usuario_estado = e.estado_id
WHERE u.usuario_id = 1;
```

### Obtener actividades con relaciones
```sql
SELECT 
  act.*,
  t.tipo_nombre,
  u.usuario_nombre,
  u.usuario_apellido,
  e.estado_nombre
FROM actividad act
LEFT JOIN tipo t ON act.actividad_tipo = t.tipo_id
LEFT JOIN usuario u ON act.actividad_usuario = u.usuario_id
LEFT JOIN estado e ON act.actividad_estado = e.estado_id
ORDER BY act.actividad_fecha DESC;
```

### Obtener incidentes con ubicación
```sql
SELECT 
  i.*,
  t.tipo_nombre,
  c.categoria_nombre as gravedad,
  u.usuario_nombre,
  ub.ubicacion_latitud,
  ub.ubicacion_longitud,
  e.estado_nombre
FROM incidentes i
LEFT JOIN tipo t ON i.inc_tipo = t.tipo_id
LEFT JOIN categoria c ON i.inc_categoria = c.categoria_id
LEFT JOIN usuario u ON i.inc_usuario = u.usuario_id
LEFT JOIN ubicacion ub ON i.inc_ubicacion = ub.ubicacion_id
LEFT JOIN estado e ON i.inc_estado = e.estado_id
ORDER BY i.created_at DESC;
```
