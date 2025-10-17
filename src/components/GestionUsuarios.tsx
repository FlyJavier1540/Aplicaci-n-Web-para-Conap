import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Alert, AlertDescription } from './ui/alert';
import { Plus, Edit, Search, Users, Mail, Phone, CheckCircle2, Ban, UserX, User, Shield, UserCheck, Lock, Eye, EyeOff, Info, KeyRound, ChevronDown, IdCard, Briefcase } from 'lucide-react';
import { usuarios } from '../data/mock-data';
import { toast } from 'sonner@2.0.3';
import { CambiarContrasenaAdmin } from './CambiarContrasenaAdmin';

interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  rol: 'Administrador' | 'Coordinador' | 'Guardarecurso';
  estado: 'Activo' | 'Inactivo' | 'Suspendido';
  fechaCreacion: string;
  ultimoAcceso?: string;
  permisos: {
    gestionPersonal: boolean;
    operacionesCampo: boolean;
    controlSeguimiento: boolean;
    administracion: boolean;
    reportes: boolean;
  };
  configuracion: {
    notificacionesEmail: boolean;
    notificacionesSMS: boolean;
    tema: 'claro' | 'oscuro' | 'sistema';
    idioma: 'es' | 'en';
  };
}

interface GestionUsuariosProps {
  userPermissions: {
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
  };
  currentUser?: any;
}

export function GestionUsuarios({ userPermissions, currentUser }: GestionUsuariosProps) {
  const [usuariosList, setUsuariosList] = useState<Usuario[]>([
    ...usuarios.map(u => ({
      ...u,
      // Convertir roles anteriores al nuevo sistema de 3 roles
      rol: (u.rol === 'Guardarecurso Senior' || u.rol === 'Guardarecurso Auxiliar') 
        ? 'Guardarecurso' as const
        : u.rol as 'Administrador' | 'Coordinador' | 'Guardarecurso',
      estado: 'Activo' as const,
      fechaCreacion: '2024-01-15',
      ultimoAcceso: '2024-10-08T10:30:00Z',
      permisos: {
        gestionPersonal: u.rol === 'Administrador' || u.rol === 'Coordinador',
        operacionesCampo: true,
        controlSeguimiento: u.rol === 'Administrador' || u.rol === 'Coordinador',
        administracion: u.rol === 'Administrador',
        reportes: u.rol === 'Administrador' || u.rol === 'Coordinador'
      },
      configuracion: {
        notificacionesEmail: true,
        notificacionesSMS: false,
        tema: 'sistema' as const,
        idioma: 'es' as const
      }
    }))
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRol, setSelectedRol] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [userToChangePassword, setUserToChangePassword] = useState<Usuario | null>(null);
  
  // Estados para el AlertDialog de cambio de estado
  const [isEstadoAlertOpen, setIsEstadoAlertOpen] = useState(false);
  const [estadoPendiente, setEstadoPendiente] = useState<{
    id: string;
    nombre: string;
    nuevoEstado: 'Activo' | 'Inactivo' | 'Suspendido';
  } | null>(null);

  const [userForm, setUserForm] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    telefono: '',
    email: '',
    password: '',
    rol: ''
  });

  // Filtrar SOLO Administradores y Coordinadores (excluir Guardarecursos)
  const filteredUsers = usuariosList.filter(u => {
    // Solo mostrar Administradores y Coordinadores
    const isAdminOrCoordinator = u.rol === 'Administrador' || u.rol === 'Coordinador';
    
    const matchesSearch = 
      u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRol = !selectedRol || selectedRol === 'all' || u.rol === selectedRol;
    
    return isAdminOrCoordinator && matchesSearch && matchesRol;
  });

  const handleSubmitUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      // Validar que se puede editar este usuario
      if (!canEditUser(editingUser)) {
        toast.error('Permisos insuficientes', {
          description: 'No tienes permiso para editar este usuario.'
        });
        return;
      }
      
      // Editar existente (sin cambiar contraseña)
      setUsuariosList(prev => prev.map(u => 
        u.id === editingUser.id 
          ? { 
              ...u, 
              nombre: userForm.nombre,
              apellido: userForm.apellido,
              email: userForm.email,
              telefono: userForm.telefono,
              rol: userForm.rol as any
            }
          : u
      ));
      
      // Actualizar también en los datos globales
      const userIndex = usuarios.findIndex(u => u.id === editingUser.id);
      if (userIndex !== -1) {
        usuarios[userIndex] = {
          ...usuarios[userIndex],
          nombre: userForm.nombre,
          apellido: userForm.apellido,
          email: userForm.email,
          telefono: userForm.telefono,
          rol: userForm.rol as any
        };
      }
      
      toast.success('Usuario actualizado', {
        description: 'Los datos del usuario han sido actualizados correctamente.'
      });
    } else {
      // Crear nuevo usuario - siempre Activo
      const nuevoUsuario: Usuario = {
        id: Date.now().toString(),
        nombre: userForm.nombre,
        apellido: userForm.apellido,
        email: userForm.email,
        telefono: userForm.telefono,
        rol: userForm.rol as any,
        estado: 'Activo', // Siempre activo al crear
        fechaCreacion: new Date().toISOString().split('T')[0],
        permisos: {
          gestionPersonal: userForm.rol === 'Administrador' || userForm.rol === 'Coordinador',
          operacionesCampo: true,
          controlSeguimiento: userForm.rol === 'Administrador' || userForm.rol === 'Coordinador',
          administracion: userForm.rol === 'Administrador',
          reportes: userForm.rol === 'Administrador' || userForm.rol === 'Coordinador'
        },
        configuracion: {
          notificacionesEmail: true,
          notificacionesSMS: false,
          tema: 'sistema',
          idioma: 'es'
        }
      };
      
      // Agregar usuario con contraseña a los datos globales
      usuarios.push({
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        apellido: nuevoUsuario.apellido,
        email: nuevoUsuario.email,
        telefono: nuevoUsuario.telefono || '',
        password: userForm.password,
        rol: nuevoUsuario.rol as any,
        estado: nuevoUsuario.estado,
        fechaCreacion: nuevoUsuario.fechaCreacion,
        permisos: [],
        areaAsignada: undefined
      });
      
      setUsuariosList(prev => [...prev, nuevoUsuario]);
      
      toast.success('Usuario creado exitosamente', {
        description: `Se ha creado la cuenta de ${userForm.rol} para ${userForm.nombre} ${userForm.apellido}.`
      });
    }
    
    resetUserForm();
    setIsDialogOpen(false);
  };

  const resetUserForm = () => {
    setUserForm({
      nombre: '',
      apellido: '',
      cedula: '',
      telefono: '',
      email: '',
      password: '',
      rol: ''
    });
    setEditingUser(null);
    setShowPassword(false);
  };

  const handleEditUser = (usuario: Usuario) => {
    setUserForm({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      cedula: '',
      telefono: usuario.telefono || '',
      email: usuario.email,
      password: '', // No mostrar contraseña en edición
      rol: usuario.rol
    });
    setEditingUser(usuario);
    setIsDialogOpen(true);
  };

  const handleChangePassword = (usuario: Usuario) => {
    setUserToChangePassword(usuario);
    setIsPasswordDialogOpen(true);
  };

  // Función para manejar el click en cambio de estado (abre el AlertDialog)
  const handleEstadoClick = (id: string, nuevoEstado: 'Activo' | 'Inactivo' | 'Suspendido') => {
    const usuario = usuariosList.find(u => u.id === id);
    if (usuario) {
      setEstadoPendiente({
        id,
        nombre: `${usuario.nombre} ${usuario.apellido}`,
        nuevoEstado
      });
      setIsEstadoAlertOpen(true);
    }
  };

  // Función para confirmar el cambio de estado
  const handleConfirmEstadoChange = () => {
    if (estadoPendiente) {
      setUsuariosList(prev => prev.map(u => 
        u.id === estadoPendiente.id 
          ? { ...u, estado: estadoPendiente.nuevoEstado }
          : u
      ));
      
      // Actualizar también en los datos globales
      const userIndex = usuarios.findIndex(u => u.id === estadoPendiente.id);
      if (userIndex !== -1) {
        usuarios[userIndex].estado = estadoPendiente.nuevoEstado;
      }
      
      const estadoTexto = estadoPendiente.nuevoEstado === 'Activo' ? 'activado' 
        : estadoPendiente.nuevoEstado === 'Suspendido' ? 'suspendido' 
        : 'desactivado';
      
      toast.success('Estado actualizado', {
        description: `El usuario ${estadoPendiente.nombre} ha sido ${estadoTexto} correctamente.`
      });
    }
    setIsEstadoAlertOpen(false);
    setEstadoPendiente(null);
  };

  const canChangeUserPassword = (targetUser: Usuario) => {
    if (!currentUser) return false;
    
    // NUNCA se puede cambiar la contraseña de un Administrador (solo ellos mismos)
    if (targetUser.rol === 'Administrador') return false;
    
    // Administradores pueden cambiar contraseñas de Coordinadores
    if (currentUser.rol === 'Administrador' && targetUser.rol === 'Coordinador') return true;
    
    return false;
  };

  // Verificar si el usuario actual puede editar a otro usuario
  const canEditUser = (targetUser: Usuario) => {
    if (!currentUser) return false;
    
    // Un Administrador solo puede editar:
    // 1. A sí mismo
    // 2. A Coordinadores
    // NO puede editar a otros Administradores
    if (currentUser.rol === 'Administrador') {
      // Puede editar a sí mismo
      if (currentUser.id === targetUser.id) return true;
      
      // NO puede editar a otros Administradores
      if (targetUser.rol === 'Administrador') return false;
      
      // Puede editar a Coordinadores
      if (targetUser.rol === 'Coordinador') return true;
    }
    
    return false;
  };

  // Verificar si el usuario actual puede cambiar el estado de otro usuario
  const canChangeUserEstado = (targetUser: Usuario) => {
    if (!currentUser) return false;
    
    // No se puede cambiar el estado del usuario actual
    if (currentUser.id === targetUser.id) return false;
    
    // Un Administrador SÍ puede cambiar el estado de otros Administradores
    return true;
  };

  const getEstadoBadgeClass = (estado: string) => {
    switch (estado) {
      case 'Activo': 
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-300 dark:border-green-700';
      case 'Suspendido': 
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-300 dark:border-orange-700';
      case 'Inactivo': 
        return 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400 border border-gray-300 dark:border-gray-700';
      default: 
        return 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400 border border-gray-300 dark:border-gray-700';
    }
  };

  const getRolBadgeClass = (rol: string) => {
    switch (rol) {
      case 'Administrador': 
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-300 dark:border-red-700';
      case 'Coordinador': 
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-300 dark:border-blue-700';
      case 'Guardarecurso': 
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-300 dark:border-green-700';
      default: 
        return 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400 border border-gray-300 dark:border-gray-700';
    }
  };

  const getRolIcon = (rol: string) => {
    switch (rol) {
      case 'Administrador': return Shield;
      case 'Coordinador': return UserCheck;
      default: return User;
    }
  };

  // Estadísticas solo de Administradores y Coordinadores
  const adminCoordinatorUsers = usuariosList.filter(u => u.rol === 'Administrador' || u.rol === 'Coordinador');
  const estadisticas = {
    total: adminCoordinatorUsers.length,
    activos: adminCoordinatorUsers.filter(u => u.estado === 'Activo').length,
    suspendidos: adminCoordinatorUsers.filter(u => u.estado === 'Suspendido').length,
    inactivos: adminCoordinatorUsers.filter(u => u.estado === 'Inactivo').length
  };

  // Solo Administrador y Coordinador - Los Guardarecursos se crean en el módulo de Registro de Guardarecursos
  const roles = ['Administrador', 'Coordinador'];

  return (
    <div className="space-y-4">
      {/* Barra superior con búsqueda y botón */}
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Búsqueda */}
            <div className="flex-1">
              <div className="relative h-10">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                />
              </div>
            </div>

            {/* Filtro por rol */}
            <div className="flex-1 sm:max-w-[250px]">
              <Select value={selectedRol} onValueChange={setSelectedRol}>
                <SelectTrigger className="h-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="Filtrar por rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los roles</SelectItem>
                  {roles.map(rol => (
                    <SelectItem key={rol} value={rol}>
                      {rol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Botón de acción */}
            <div className="w-full sm:w-auto">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={resetUserForm}
                    className="w-full sm:w-auto h-10 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Usuario
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] sm:w-[90vw] max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader className="pb-3 sm:pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg flex-shrink-0">
                  <UserCheck className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <DialogTitle className="text-base sm:text-xl md:text-2xl truncate">
                    {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                  </DialogTitle>
                  <DialogDescription className="text-xs sm:text-sm truncate">
                    Configure los datos del usuario administrativo
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            
            <form onSubmit={handleSubmitUser} className="space-y-4 sm:space-y-6 pt-3 sm:pt-4">
              {!editingUser && (
                <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                  <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <AlertDescription className="text-blue-800 dark:text-blue-300 text-xs sm:text-sm">
                    Este módulo es exclusivo para crear cuentas de Administradores y Coordinadores.
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Información Personal */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                    <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base">Información Personal</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pl-0 sm:pl-10">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="nombre" className="text-sm">Nombre *</Label>
                    <Input
                      id="nombre"
                      value={userForm.nombre}
                      onChange={(e) => setUserForm({...userForm, nombre: e.target.value})}
                      placeholder="Ingrese el nombre"
                      className="h-10 sm:h-11"
                      required
                    />
                  </div>
                  
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="apellido" className="text-sm">Apellido *</Label>
                    <Input
                      id="apellido"
                      value={userForm.apellido}
                      onChange={(e) => setUserForm({...userForm, apellido: e.target.value})}
                      placeholder="Ingrese el apellido"
                      className="h-10 sm:h-11"
                      required
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="cedula" className="text-sm">Cédula *</Label>
                    <Input
                      id="cedula"
                      value={userForm.cedula}
                      onChange={(e) => setUserForm({...userForm, cedula: e.target.value})}
                      placeholder="0000-00000-0000"
                      className="h-10 sm:h-11"
                      required
                    />
                  </div>
                  
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="telefono" className="text-sm">Teléfono *</Label>
                    <Input
                      id="telefono"
                      value={userForm.telefono}
                      onChange={(e) => setUserForm({...userForm, telefono: e.target.value})}
                      placeholder="+502 0000-0000"
                      className="h-10 sm:h-11"
                      required
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2 sm:col-span-2">
                    <Label htmlFor="email" className="text-sm">Correo Electrónico *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userForm.email}
                      onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                      placeholder="correo@ejemplo.com"
                      className="h-10 sm:h-11"
                      required
                    />
                  </div>
                  
                  {!editingUser && (
                    <div className="space-y-1.5 sm:space-y-2 sm:col-span-2">
                      <Label htmlFor="password" className="text-sm">Contraseña *</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={userForm.password}
                          onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                          placeholder="Ingrese la contraseña"
                          className="h-10 sm:h-11 pr-10"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Mínimo 6 caracteres. Esta será la contraseña de acceso al sistema.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Rol del Usuario */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base">Rol del Usuario</h3>
                </div>
                
                <div className="pl-0 sm:pl-10">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="rol" className="text-sm">Rol *</Label>
                    <Select 
                      value={userForm.rol} 
                      onValueChange={(value) => setUserForm({...userForm, rol: value})}
                      disabled={editingUser && currentUser && editingUser.id === currentUser.id}
                    >
                      <SelectTrigger className="h-10 sm:h-11">
                        <SelectValue placeholder="Seleccione rol" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map(rol => (
                          <SelectItem key={rol} value={rol}>
                            {rol}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {editingUser && currentUser && editingUser.id === currentUser.id && (
                      <p className="text-xs text-muted-foreground">
                        No puedes cambiar tu propio rol.
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Botones de acción */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="w-full sm:w-auto h-10 sm:h-11"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  className="w-full sm:w-auto h-10 sm:h-11 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 whitespace-nowrap text-xs sm:text-sm"
                >
                  {editingUser ? (
                    <>
                      <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                      Actualizar Usuario
                    </>
                  ) : (
                    <>
                      <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                      Crear Usuario
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas responsive: arriba en móvil/tablet, sidebar en desktop */}
      <div className="lg:hidden mb-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <Card className="border-0 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 shadow-md">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col items-center justify-center gap-1 sm:gap-1.5">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-700 dark:text-blue-300" />
                <p className="text-xl sm:text-2xl text-blue-800 dark:text-blue-200">{estadisticas.total}</p>
                <p className="text-[10px] sm:text-xs text-blue-700/80 dark:text-blue-300/80 text-center leading-tight">Total</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 shadow-md">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col items-center justify-center gap-1 sm:gap-1.5">
                <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8 text-green-700 dark:text-green-300" />
                <p className="text-xl sm:text-2xl text-green-800 dark:text-green-200">{estadisticas.activos}</p>
                <p className="text-[10px] sm:text-xs text-green-700/80 dark:text-green-300/80 text-center leading-tight">Activos</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/40 dark:to-orange-800/40 shadow-md">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col items-center justify-center gap-1 sm:gap-1.5">
                <Ban className="h-6 w-6 sm:h-8 sm:w-8 text-orange-700 dark:text-orange-300" />
                <p className="text-xl sm:text-2xl text-orange-800 dark:text-orange-200">{estadisticas.suspendidos}</p>
                <p className="text-[10px] sm:text-xs text-orange-700/80 dark:text-orange-300/80 text-center leading-tight">Suspendidos</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900/40 dark:to-gray-800/40 shadow-md">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col items-center justify-center gap-1 sm:gap-1.5">
                <UserX className="h-6 w-6 sm:h-8 sm:w-8 text-gray-700 dark:text-gray-300" />
                <p className="text-xl sm:text-2xl text-gray-800 dark:text-gray-200">{estadisticas.inactivos}</p>
                <p className="text-[10px] sm:text-xs text-gray-700/80 dark:text-gray-300/80 text-center leading-tight">Inactivos</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Grid principal: Tabla a la izquierda, Estadísticas a la derecha (solo desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Columna izquierda: Tabla responsive */}
        <div className="lg:col-span-11">
          <Card className="h-full">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              {/* Scroll horizontal container */}
              <div className="overflow-x-auto -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {/* Siempre visible */}
                      <TableHead className="min-w-[140px]">Nombre Completo</TableHead>
                      <TableHead className="min-w-[90px]">Estado</TableHead>
                      
                      {/* Visible desde SM (640px+) */}
                      <TableHead className="hidden sm:table-cell min-w-[100px]">Rol</TableHead>
                      
                      {/* Visible desde MD (768px+) */}
                      <TableHead className="hidden md:table-cell min-w-[120px]">Teléfono</TableHead>
                      
                      {/* Visible desde LG (1024px+) */}
                      <TableHead className="hidden lg:table-cell min-w-[180px]">Email</TableHead>
                      
                      {/* Visible desde XL (1280px+) */}
                      <TableHead className="hidden xl:table-cell min-w-[110px]">Fecha Ingreso</TableHead>
                      
                      {/* Siempre visible */}
                      <TableHead className="text-right min-w-[140px]">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((usuario) => (
                      <TableRow key={usuario.id}>
                        {/* Siempre visible - Nombre */}
                        <TableCell>
                          <div className="font-medium whitespace-nowrap">
                            {usuario.nombre} {usuario.apellido}
                          </div>
                        </TableCell>
                        
                        {/* Siempre visible - Estado */}
                        <TableCell>
                          <Badge className={getEstadoBadgeClass(usuario.estado)}>
                            {usuario.estado}
                          </Badge>
                        </TableCell>
                        
                        {/* Visible desde SM - Rol */}
                        <TableCell className="hidden sm:table-cell">
                          <Badge className={getRolBadgeClass(usuario.rol)}>
                            {usuario.rol}
                          </Badge>
                        </TableCell>
                        
                        {/* Visible desde MD - Teléfono */}
                        <TableCell className="hidden md:table-cell whitespace-nowrap">
                          {usuario.telefono || 'N/A'}
                        </TableCell>
                        
                        {/* Visible desde LG - Email */}
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{usuario.email}</span>
                          </div>
                        </TableCell>
                        
                        {/* Visible desde XL - Fecha Ingreso */}
                        <TableCell className="hidden xl:table-cell whitespace-nowrap">
                          {usuario.fechaCreacion}
                        </TableCell>
                        
                        {/* Siempre visible - Acciones */}
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {canChangeUserPassword(usuario) && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleChangePassword(usuario)}
                                title="Cambiar contraseña"
                                className="flex-shrink-0"
                              >
                                <KeyRound className="h-4 w-4" />
                              </Button>
                            )}
                            {canEditUser(usuario) && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditUser(usuario)}
                                title="Editar información"
                                className="flex-shrink-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                            
                            {/* Dropdown para cambiar estado */}
                            {canChangeUserEstado(usuario) && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    title={`Cambiar estado (actual: ${usuario.estado})`}
                                    className="flex-shrink-0"
                                  >
                                    {usuario.estado === 'Activo' ? (
                                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    ) : usuario.estado === 'Suspendido' ? (
                                      <Ban className="h-4 w-4 text-orange-600" />
                                    ) : (
                                      <UserX className="h-4 w-4 text-gray-600" />
                                    )}
                                    <ChevronDown className="h-3 w-3 ml-1" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem 
                                    onClick={() => handleEstadoClick(usuario.id, 'Activo')}
                                    className="cursor-pointer"
                                  >
                                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                                    Activo
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleEstadoClick(usuario.id, 'Suspendido')}
                                    className="cursor-pointer"
                                  >
                                    <Ban className="h-4 w-4 mr-2 text-orange-500" />
                                    Suspendido
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleEstadoClick(usuario.id, 'Inactivo')}
                                    className="cursor-pointer"
                                  >
                                    <UserX className="h-4 w-4 mr-2 text-gray-500" />
                                    Inactivo
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
              </Table>
              </div>
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-8 sm:py-12 text-muted-foreground px-4">
                  <Users className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 opacity-30" />
                  <p className="text-sm sm:text-base">No se encontraron usuarios que coincidan con los filtros</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Columna derecha: Estadísticas (solo desktop) */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24 space-y-3">
            <Card className="border-0 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 shadow-md">
              <CardContent className="p-4">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Users className="h-9 w-9 text-blue-700 dark:text-blue-300" />
                  <div className="text-center">
                    <p className="text-3xl text-blue-800 dark:text-blue-200 mb-1">{estadisticas.total}</p>
                    <p className="text-xs text-blue-700/80 dark:text-blue-300/80">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 shadow-md">
              <CardContent className="p-4">
                <div className="flex flex-col items-center justify-center gap-2">
                  <CheckCircle2 className="h-9 w-9 text-green-700 dark:text-green-300" />
                  <div className="text-center">
                    <p className="text-3xl text-green-800 dark:text-green-200 mb-1">{estadisticas.activos}</p>
                    <p className="text-xs text-green-700/80 dark:text-green-300/80">Activos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/40 dark:to-orange-800/40 shadow-md">
              <CardContent className="p-4">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Ban className="h-9 w-9 text-orange-700 dark:text-orange-300" />
                  <div className="text-center">
                    <p className="text-3xl text-orange-800 dark:text-orange-200 mb-1">{estadisticas.suspendidos}</p>
                    <p className="text-xs text-orange-700/80 dark:text-orange-300/80">Suspendidos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800/40 dark:to-gray-700/40 shadow-md">
              <CardContent className="p-4">
                <div className="flex flex-col items-center justify-center gap-2">
                  <UserX className="h-9 w-9 text-gray-700 dark:text-gray-300" />
                  <div className="text-center">
                    <p className="text-3xl text-gray-800 dark:text-gray-200 mb-1">{estadisticas.inactivos}</p>
                    <p className="text-xs text-gray-700/80 dark:text-gray-300/80">Inactivos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Diálogo para cambiar contraseña de otro usuario */}
      {currentUser && userToChangePassword && (
        <CambiarContrasenaAdmin
          isOpen={isPasswordDialogOpen}
          onClose={() => {
            setIsPasswordDialogOpen(false);
            setUserToChangePassword(null);
          }}
          currentUser={currentUser}
          targetUser={userToChangePassword}
        />
      )}

      {/* Alert Dialog para confirmar cambio de estado */}
      <AlertDialog open={isEstadoAlertOpen} onOpenChange={setIsEstadoAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmar cambio de estado?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                {estadoPendiente && (
                  <>
                    <p className="mb-3">
                      Está a punto de cambiar el estado de <strong>{estadoPendiente.nombre}</strong> a{' '}
                      <span className={
                        estadoPendiente.nuevoEstado === 'Activo' 
                          ? 'text-green-600 dark:text-green-400 font-semibold' 
                          : estadoPendiente.nuevoEstado === 'Suspendido'
                          ? 'text-orange-600 dark:text-orange-400 font-semibold'
                          : 'text-gray-600 dark:text-gray-400 font-semibold'
                      }>
                        {estadoPendiente.nuevoEstado}
                      </span>.
                    </p>
                    
                    {estadoPendiente.nuevoEstado === 'Suspendido' && (
                      <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 mb-2">
                        <p className="text-sm text-orange-800 dark:text-orange-200">
                          <strong>⚠️ Suspensión:</strong> El usuario no podrá acceder al sistema temporalmente.
                        </p>
                      </div>
                    )}
                    
                    {estadoPendiente.nuevoEstado === 'Inactivo' && (
                      <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-3 mb-2">
                        <p className="text-sm text-gray-800 dark:text-gray-200">
                          <strong>ℹ️ Desactivación:</strong> El usuario será marcado como inactivo en el sistema.
                        </p>
                      </div>
                    )}
                    
                    {estadoPendiente.nuevoEstado === 'Activo' && (
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-2">
                        <p className="text-sm text-green-800 dark:text-green-200">
                          <strong>✓ Activación:</strong> El usuario podrá acceder al sistema normalmente.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setIsEstadoAlertOpen(false);
              setEstadoPendiente(null);
            }}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmEstadoChange}
              className={
                estadoPendiente?.nuevoEstado === 'Activo'
                  ? 'bg-green-600 hover:bg-green-700'
                  : estadoPendiente?.nuevoEstado === 'Suspendido'
                  ? 'bg-orange-600 hover:bg-orange-700'
                  : 'bg-gray-600 hover:bg-gray-700'
              }
            >
              Confirmar cambio
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
