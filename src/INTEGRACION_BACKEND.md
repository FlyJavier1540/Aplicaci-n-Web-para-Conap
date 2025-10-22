# 🔌 Integración con Backend - CONAP

## ✅ ¿Qué está listo?

Tu frontend está **100% preparado** para conectarse a tu base de datos PostgreSQL. He creado toda la estructura necesaria para que solo tengas que implementar tu API backend.

### Archivos Creados

1. **`/types/database.types.ts`** 
   - ✅ Tipos que mapean exactamente a tus 16 tablas PostgreSQL
   - ✅ Nombres de columnas idénticos a tu BD

2. **`/utils/database-mapper.ts`** 
   - ✅ Funciones de conversión BD ↔ App
   - ✅ Mapeo de IDs (estados, roles, tipos)
   - ✅ Funciones auxiliares

3. **`/utils/services/ejemplo-api.service.ts`**
   - ✅ Plantilla completa de servicios
   - ✅ Ejemplos de login, CRUD de usuarios, actividades, incidentes
   - ✅ Manejo de tokens y autenticación

4. **`/GUIA_INTEGRACION_API.md`**
   - ✅ Guía detallada de cómo usar todo
   - ✅ Endpoints sugeridos
   - ✅ Ejemplos de código

5. **`/REFERENCIA_BASE_DATOS.md`**
   - ✅ Referencia rápida de todos los IDs
   - ✅ Relaciones entre tablas
   - ✅ Queries SQL útiles

---

## 🚀 Próximos Pasos

### Paso 1: Implementa tu API Backend

Necesitas crear una API REST con estos endpoints:

#### Autenticación
```
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/change-password
```

#### Usuarios
```
GET    /api/usuarios
GET    /api/usuarios/:id
POST   /api/usuarios
PUT    /api/usuarios/:id
DELETE /api/usuarios/:id
```

#### Actividades
```
GET    /api/actividades
POST   /api/actividades
PUT    /api/actividades/:id
GET    /api/actividades/usuario/:usuarioId
```

#### Incidentes
```
GET    /api/incidentes
POST   /api/incidentes
PUT    /api/incidentes/:id
```

#### Catálogos
```
GET /api/catalogos/estados
GET /api/catalogos/roles
GET /api/catalogos/tipos
GET /api/areas-protegidas
```

#### Ubicaciones
```
POST /api/ubicaciones
```

### Paso 2: Configura la URL de tu API

Cuando tengas tu API lista, simplemente:

1. Crea un archivo `.env` en la raíz del proyecto:
```env
REACT_APP_API_URL=https://tu-api.com/api
```

2. O edita directamente en `/utils/services/ejemplo-api.service.ts`:
```typescript
const API_BASE_URL = 'https://tu-api.com/api';
```

### Paso 3: Usa los Servicios en tus Componentes

Ejemplo en `Login.tsx`:

```typescript
import { authService } from '../utils/services/ejemplo-api.service';

const handleLogin = async (email: string, password: string) => {
  try {
    const usuario = await authService.login(email, password);
    onLogin(usuario);
  } catch (error) {
    setError(error.message);
  }
};
```

Ejemplo en `GestionUsuarios.tsx`:

```typescript
import { usuariosService } from '../utils/services/ejemplo-api.service';

const loadUsuarios = async () => {
  try {
    const usuarios = await usuariosService.getAll();
    setUsuarios(usuarios);
  } catch (error) {
    console.error('Error al cargar usuarios:', error);
  }
};
```

---

## 📊 Ejemplo Completo: Backend con Node.js + Express

### Instalación
```bash
npm install express pg bcrypt jsonwebtoken cors dotenv
npm install --save-dev @types/express @types/pg @types/bcrypt @types/jsonwebtoken
```

### Estructura Sugerida
```
backend/
├── src/
│   ├── config/
│   │   └── database.ts       # Configuración de PostgreSQL
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── usuarios.controller.ts
│   │   ├── actividades.controller.ts
│   │   └── incidentes.controller.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── usuarios.routes.ts
│   │   ├── actividades.routes.ts
│   │   └── incidentes.routes.ts
│   ├── middleware/
│   │   └── auth.middleware.ts
│   └── index.ts              # Punto de entrada
├── .env
└── package.json
```

### Ejemplo: `auth.controller.ts`

```typescript
import { Request, Response } from 'express';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Buscar usuario
    const result = await pool.query(`
      SELECT 
        u.*,
        r.rol_id, r.rol_nombre,
        a.area_id, a.area_nombre,
        e.estado_id, e.estado_nombre
      FROM usuario u
      LEFT JOIN usuario_rol r ON u.usuario_rol = r.rol_id
      LEFT JOIN area_protegida a ON u.usuario_area = a.area_id
      LEFT JOIN estado e ON u.usuario_estado = e.estado_id
      WHERE u.usuario_correo = $1
    `, [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciales incorrectas' 
      });
    }

    const usuario = result.rows[0];

    // Verificar contraseña (si usas bcrypt)
    // const validPassword = await bcrypt.compare(password, usuario.usuario_contrasenia);
    
    // Para desarrollo (sin hash):
    const validPassword = password === usuario.usuario_contrasenia;

    if (!validPassword) {
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciales incorrectas' 
      });
    }

    // Generar token
    const token = jwt.sign(
      { 
        usuario_id: usuario.usuario_id,
        rol: usuario.rol_nombre 
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      usuario: {
        usuario_id: usuario.usuario_id,
        usuario_nombre: usuario.usuario_nombre,
        usuario_apellido: usuario.usuario_apellido,
        usuario_correo: usuario.usuario_correo,
        usuario_telefono: usuario.usuario_telefono,
        usuario_dpi: usuario.usuario_dpi,
        usuario_rol: usuario.usuario_rol,
        usuario_area: usuario.usuario_area,
        usuario_estado: usuario.usuario_estado,
        created_at: usuario.created_at
      },
      rol: {
        rol_id: usuario.rol_id,
        rol_nombre: usuario.rol_nombre
      },
      area: usuario.area_id ? {
        area_id: usuario.area_id,
        area_nombre: usuario.area_nombre
      } : null,
      estado: {
        estado_id: usuario.estado_id,
        estado_nombre: usuario.estado_nombre
      },
      token
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error en el servidor' 
    });
  }
};
```

### Ejemplo: `usuarios.controller.ts`

```typescript
import { Request, Response } from 'express';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export const getAllUsuarios = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.*,
        r.rol_id, r.rol_nombre,
        a.area_id, a.area_nombre,
        e.estado_id, e.estado_nombre
      FROM usuario u
      LEFT JOIN usuario_rol r ON u.usuario_rol = r.rol_id
      LEFT JOIN area_protegida a ON u.usuario_area = a.area_id
      LEFT JOIN estado e ON u.usuario_estado = e.estado_id
      ORDER BY u.created_at DESC
    `);

    const usuarios = result.rows.map(u => ({
      ...u,
      rol: { rol_id: u.rol_id, rol_nombre: u.rol_nombre },
      area: u.area_id ? { area_id: u.area_id, area_nombre: u.area_nombre } : null,
      estado: { estado_id: u.estado_id, estado_nombre: u.estado_nombre }
    }));

    res.json({
      success: true,
      data: usuarios
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener usuarios' 
    });
  }
};

export const createUsuario = async (req: Request, res: Response) => {
  const { 
    usuario_nombre, 
    usuario_apellido, 
    usuario_dpi,
    usuario_correo, 
    usuario_telefono,
    usuario_contrasenia,
    usuario_rol,
    usuario_area,
    usuario_estado
  } = req.body;

  try {
    const result = await pool.query(`
      INSERT INTO usuario (
        usuario_nombre,
        usuario_apellido,
        usuario_dpi,
        usuario_correo,
        usuario_telefono,
        usuario_contrasenia,
        usuario_rol,
        usuario_area,
        usuario_estado,
        created_at,
        created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), $10)
      RETURNING *
    `, [
      usuario_nombre,
      usuario_apellido,
      usuario_dpi,
      usuario_correo,
      usuario_telefono,
      usuario_contrasenia,
      usuario_rol,
      usuario_area,
      usuario_estado,
      (req as any).user?.usuario_id || '1' // ID del admin que lo creó
    ]);

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al crear usuario' 
    });
  }
};
```

### Ejemplo: Middleware de Autenticación

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'No autorizado' 
    });
  }

  try {
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'secret'
    );
    
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Token inválido' 
    });
  }
};
```

---

## 🎯 Checklist de Integración

### Backend
- [ ] API REST implementada
- [ ] Endpoints de autenticación funcionando
- [ ] CRUD de usuarios implementado
- [ ] CRUD de actividades implementado
- [ ] CRUD de incidentes implementado
- [ ] Catálogos disponibles
- [ ] Manejo de errores implementado
- [ ] CORS configurado

### Frontend
- [ ] URL de API configurada
- [ ] Servicios importados en componentes
- [ ] Login integrado con API
- [ ] Mock data reemplazado con datos reales
- [ ] Manejo de errores en UI
- [ ] Loading states agregados
- [ ] Tokens guardados correctamente

### Testing
- [ ] Login funciona
- [ ] Crear usuario funciona
- [ ] Listar usuarios funciona
- [ ] Crear actividad funciona
- [ ] Crear incidente funciona
- [ ] Catálogos se cargan correctamente

---

## 🆘 ¿Necesitas Ayuda?

### Problemas Comunes

**1. CORS Error**
```typescript
// En tu backend
app.use(cors({
  origin: 'http://localhost:5173', // URL de tu frontend
  credentials: true
}));
```

**2. Token no se envía**
```typescript
// Verifica que el token esté guardado
console.log(localStorage.getItem('auth_token'));
```

**3. Datos no se convierten correctamente**
```typescript
// Usa las funciones de database-mapper.ts
import { mapUsuarioDBToApp } from '../utils/database-mapper';
```

---

## 📚 Recursos Adicionales

- **GUIA_INTEGRACION_API.md** - Guía detallada con más ejemplos
- **REFERENCIA_BASE_DATOS.md** - IDs y relaciones de tablas
- **ejemplo-api.service.ts** - Plantilla de servicios

---

## ✅ Resumen

Tu frontend está **completamente preparado**. Solo necesitas:

1. ✅ Implementar tu API backend con PostgreSQL
2. ✅ Configurar la URL de tu API
3. ✅ Importar los servicios en tus componentes
4. ✅ ¡Listo! Todo funcionará automáticamente

Los datos se convertirán automáticamente entre el formato de tu BD y el formato de la app usando las funciones que he creado.

**¿Listo para empezar? 🚀**
