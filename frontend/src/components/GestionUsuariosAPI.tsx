/**
 * Gestión de Usuarios - Versión con API real
 * CRUD completo de usuarios conectado al backend PostgreSQL
 */

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Plus, Edit, Search, Users, Mail, Phone, Ban, Shield, Eye, EyeOff, Loader2, KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import { usuariosService, catalogosService, areasProtegidasService } from '../utils/api';
import type { Usuario } from '../types/database.types';
import type { Rol, Estado } from '../utils/api/catalogos.service';
import type { AreaProtegida } from '../types/database.types';
import { ROL_IDS } from '../utils/api/config';

interface GestionUsuariosAPIProps {
  userPermissions: {
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
  };
  currentUser?: any;
}

// Interfaz extendida para el formulario (usando los campos del backend)
interface UserFormState {
    usuario_nombre: string;
    usuario_apellido: string;
    usuario_dpi: string;
    usuario_correo: string;
    usuario_telefono: string;
    usuario_contrasenia: string;
    usuario_rol: number;
    usuario_area: number | null;
    usuario_estado: number;
    // Campo extra para el formulario
    area_display: string; 
}

export function GestionUsuariosAPI({ userPermissions, currentUser }: GestionUsuariosAPIProps) {
  // Estados de datos
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [estados, setEstados] = useState<Estado[]>([]);
  const [areas, setAreas] = useState<AreaProtegida[]>([]);

  // Estados de UI
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRol, setSelectedRol] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Estados para confirmación de eliminación
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Usuario | null>(null);

  // Formulario de usuario (Alineado con los campos del servicio/backend)
  const [userForm, setUserForm] = useState<UserFormState>({
    usuario_nombre: '',
    usuario_apellido: '',
    usuario_dpi: '',
    usuario_correo: '',
    usuario_telefono: '',
    usuario_contrasenia: '',
    usuario_rol: 0,
    usuario_area: 0,
    usuario_estado: 1, // Activo por defecto
    area_display: '0'
  });

  // Función de carga inicial de todos los datos
  const loadInitialData = async () => {
    setIsLoading(true);
  // Función para cargar solo los usuarios
  const loadUsuarios = async () => {
    try {
      const [usuariosData, catalogosData, areasData] = await Promise.all([
        usuariosService.getAll(),
        catalogosService.getAllCatalogos(),
        areasProtegidasService.getAll()
      ]);

      const usuariosData = await usuariosService.getAll();
      setUsuarios(usuariosData);
      setRoles(catalogosData.roles.filter(r => r.rol_id === ROL_IDS.ADMINISTRADOR || r.rol_id === ROL_IDS.COORDINADOR));
      setEstados(catalogosData.estados);
      setAreas(areasData);
    } catch (error: any) {
      toast.error('Error al cargar datos', {
        description: error.message
      });
    } finally {
      setIsLoading(false);
      toast.error('Error al cargar usuarios', { description: error.message });
    }
  };

  // Cargar datos al montar
  // Cargar datos de catálogos una sola vez al montar el componente
  useEffect(() => {
    loadInitialData();
    setIsLoading(true);
    const fetchInitialData = async () => {
      try {
        const [catalogosData, areasData] = await Promise.all([
        catalogosService.getAllCatalogos(),
        areasProtegidasService.getAll()
        ]);
        setRoles(catalogosData.roles.filter(r => r.rol_id === ROL_IDS.ADMINISTRADOR || r.rol_id === ROL_IDS.COORDINADOR));
        setEstados(catalogosData.estados);
        setAreas(areasData);
        await loadUsuarios(); // Cargar usuarios después de los catálogos
      } catch (error: any) {
        toast.error('Error al cargar datos iniciales', { description: error.message });
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Filtrar usuarios (solo Administradores y Coordinadores)
  const filteredUsers = usuarios.filter(u => {
    // ⬅️ CRÍTICO: Usar Optional Chaining (?.) para prevenir fallos al acceder a propiedades de catálogos
    const isAdminOrCoordinator = u.rol?.rol_nombre === 'Administrador' || u.rol?.rol_nombre === 'Coordinador';
    
    const matchesSearch = 
      u.usuario_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.usuario_apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.usuario_correo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRol = selectedRol === 'all' || u.rol?.rol_nombre === selectedRol;
    
    return isAdminOrCoordinator && matchesSearch && matchesRol;
  });

  // Abrir diálogo de crear/editar
  const handleOpenDialog = (user?: Usuario) => {
    if (user) {
      setEditingUser(user);
      setUserForm({
        usuario_nombre: user.usuario_nombre,
        usuario_apellido: user.usuario_apellido,
        usuario_dpi: user.usuario_dpi || '',
        usuario_correo: user.usuario_correo,
        usuario_telefono: user.usuario_telefono || '',
        usuario_contrasenia: '',
        usuario_rol: user.usuario_rol,
        usuario_area: user.usuario_area || 0,
        usuario_estado: user.usuario_estado,
        area_display: (user.usuario_area || 0).toString()
      });
    } else {
      setEditingUser(null);
      setUserForm({
        usuario_nombre: '',
        usuario_apellido: '',
        usuario_dpi: '',
        usuario_correo: '',
        usuario_telefono: '',
        usuario_contrasenia: '',
        usuario_rol: ROL_IDS.COORDINADOR, // Valor por defecto sensato
        usuario_area: 0,
        usuario_estado: ROL_IDS.ACTIVO,
        area_display: '0'
      });
    }
    setIsDialogOpen(true);
  };

  // Guardar usuario (crear o editar)
  const handleSubmitUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Preparar los datos del formulario, excluyendo los campos de UI
    const dataToSend = {
      usuario_nombre: userForm.usuario_nombre,
      usuario_apellido: userForm.usuario_apellido,
      usuario_dpi: userForm.usuario_dpi,
      usuario_correo: userForm.usuario_correo,
      usuario_telefono: userForm.usuario_telefono,
      usuario_rol: userForm.usuario_rol,
      usuario_area: userForm.usuario_area || null,
      usuario_estado: userForm.usuario_estado
    };

    try {
      if (editingUser) {
        // Actualizar usuario existente
        await usuariosService.update(editingUser.usuario_id, dataToSend);

        toast.success('Usuario actualizado', {
          description: 'Los datos del usuario se actualizaron correctamente'
        });
      } else {
        // Crear nuevo usuario (se requiere contraseña y es hasheada en el backend)
        if (!userForm.usuario_contrasenia) {
          toast.error('Error', { description: 'La contraseña es requerida' });
          setIsSaving(false);
          return;
        }

        await usuariosService.create({
          ...dataToSend,
          usuario_contrasenia: userForm.usuario_contrasenia // Incluir contraseña solo para la creación
        });

        toast.success('Usuario creado', {
          description: 'El nuevo usuario se creó correctamente'
        });
      }

      // Recargar lista de usuarios
      loadInitialData();
      loadUsuarios();
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error('Error al guardar usuario', {
        description: error.message
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Confirmación de eliminación
  const confirmDelete = (user: Usuario) => {
    setUserToDelete(user);
    setIsDeleteAlertOpen(true);
  };

  // Eliminar usuario (desactivar)
  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      // ⬅️ CRÉDITO: Llama a DELETE (eliminación lógica)
      await usuariosService.delete(userToDelete.usuario_id);
      
      toast.success('Usuario desactivado', {
        description: 'El usuario ha sido desactivado correctamente'
      });

      // Recargar lista de usuarios
      loadInitialData();
      loadUsuarios();
      
      setIsDeleteAlertOpen(false);
      setUserToDelete(null);
    } catch (error: any) {
      toast.error('Error al desactivar usuario', {
        description: error.message
      });
    }
  };

  // Funciones de utilidad para el renderizado
  const getEstadoBadgeClass = (estado: string | undefined) => {
    if (!estado) return 'bg-gray-100 text-gray-600';
    switch (estado) {
      case 'Activo': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-300 dark:border-green-700';
      case 'Suspendido': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-300 dark:border-orange-700';
      case 'Inactivo':
      case 'Desactivado': return 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400 border border-gray-300 dark:border-gray-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };
  
  const getRolBadgeClass = (rol: string | undefined) => {
    if (!rol) return 'bg-gray-100 text-gray-600';
    switch (rol) {
      case 'Administrador': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-300 dark:border-red-700';
      case 'Coordinador': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-300 dark:border-blue-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };


  if (!userPermissions.canView) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Acceso Denegado</h3>
          <p className="text-muted-foreground">No tienes permisos para ver esta sección</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Gestión de Usuarios
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Administración de usuarios del sistema
              </p>
            </div>
            
            {userPermissions.canCreate && (
              <Button onClick={() => handleOpenDialog()} className="gap-2">
                <Plus className="h-4 w-4" />
                Nuevo Usuario
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, apellido o correo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedRol} onValueChange={setSelectedRol}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filtrar por rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los roles</SelectItem>
                {roles.map(rol => (
                  <SelectItem key={rol.rol_id} value={rol.rol_nombre}>
                    {rol.rol_nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tabla de usuarios */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Área</TableHead>
                  <TableHead>Estado</TableHead>
                  {(userPermissions.canEdit || userPermissions.canDelete) && (
                    <TableHead className="text-right">Acciones</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No se encontraron usuarios
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.usuario_id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {user.usuario_nombre} {user.usuario_apellido}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            DPI: {user.usuario_dpi || 'N/A'}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            {user.usuario_correo}
                          </div>
                          {user.usuario_telefono && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              {user.usuario_telefono}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge variant="outline" className={getRolBadgeClass(user.rol?.rol_nombre)}>
                          {user.rol?.rol_nombre}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <span className="text-sm">
                          {user.area?.area_nombre || 'Sin área'}
                        </span>
                      </TableCell>
                      
                      <TableCell>
                        <Badge 
                          className={getEstadoBadgeClass(user.estado?.estado_nombre)}
                        >
                          {user.estado?.estado_nombre}
                        </Badge>
                      </TableCell>
                      
                      {(userPermissions.canEdit || userPermissions.canDelete) && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {userPermissions.canEdit && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenDialog(user)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                            
                            {/* Botón de cambio de contraseña */}
                            <Button
                                variant="ghost"
                                size="sm"
                                // Asume que tienes una función para abrir el modal de cambio de contraseña
                                // onClick={() => handleOpenPasswordDialog(user)}
                              >
                                <KeyRound className="h-4 w-4" />
                            </Button>


                            {userPermissions.canDelete && user.estado?.estado_nombre === 'Activo' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => confirmDelete(user)}
                              >
                                <Ban className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Diálogo de Crear/Editar Usuario */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmitUser} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  // ⬅️ CRÍTICO: Alineación de campos con el estado
                  value={userForm.usuario_nombre}
                  onChange={(e) => setUserForm({ ...userForm, usuario_nombre: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apellido">Apellido *</Label>
                 {/* ⬅️ CRÍTICO: Alineación de campos con el estado */}
                <Input
                  id="apellido"
                  value={userForm.usuario_apellido}
                  onChange={(e) => setUserForm({ ...userForm, usuario_apellido: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dpi">DPI *</Label>
                 {/* ⬅️ CRÍTICO: Alineación de campos con el estado */}
                <Input
                  id="dpi"
                  value={userForm.usuario_dpi}
                  onChange={(e) => setUserForm({ ...userForm, usuario_dpi: e.target.value })}
                  placeholder="0000 00000 0000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                 {/* ⬅️ CRÍTICO: Alineación de campos con el estado */}
                <Input
                  id="telefono"
                  value={userForm.usuario_telefono}
                  onChange={(e) => setUserForm({ ...userForm, usuario_telefono: e.target.value })}
                  placeholder="+502 0000-0000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="correo">Correo Electrónico *</Label>
              <Input
                id="correo"
                type="email"
                value={userForm.usuario_correo}
                onChange={(e) => setUserForm({ ...userForm, usuario_correo: e.target.value })}
                placeholder="usuario@conap.gob.gt"
                required
              />
            </div>

            {!editingUser && (
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={userForm.usuario_contrasenia}
                    onChange={(e) => setUserForm({ ...userForm, usuario_contrasenia: e.target.value })}
                    required
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rol">Rol *</Label>
                <Select
                  // ⬅️ CRÍTICO: Alineación de campos con el estado (ID numérico)
                  value={userForm.usuario_rol.toString()}
                  onValueChange={(value) => setUserForm({ ...userForm, usuario_rol: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(rol => (
                      <SelectItem key={rol.rol_id} value={rol.rol_id.toString()}>
                        {rol.rol_nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="area">Área Protegida</Label>
                <Select
                  // ⬅️ CRÍTICO: Alineación de campos con el estado (ID numérico)
                  value={userForm.usuario_area?.toString() || '0'}
                  onValueChange={(value) => setUserForm({ ...userForm, usuario_area: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar área" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Sin área asignada</SelectItem>
                    {areas.map(area => (
                      <SelectItem key={area.area_id} value={area.area_id.toString()}>
                        {area.area_nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {editingUser && (
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select
                   // ⬅️ CRÍTICO: Alineación de campos con el estado (ID numérico)
                  value={userForm.usuario_estado.toString()}
                  onValueChange={(value) => setUserForm({ ...userForm, usuario_estado: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {estados.map(estado => (
                      <SelectItem key={estado.estado_id} value={estado.estado_id.toString()}>
                        {estado.estado_nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSaving}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  editingUser ? 'Actualizar' : 'Crear Usuario'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación de eliminación */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Desactivar usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de desactivar al usuario <strong>{userToDelete?.usuario_nombre} {userToDelete?.usuario_apellido}</strong>?
              Esta acción cambiará el estado del usuario a "Inactivo".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive hover:bg-destructive/90">
              Desactivar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}