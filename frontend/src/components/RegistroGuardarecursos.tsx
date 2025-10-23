import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Plus, Edit, Search, Users, FileText, Mail, Phone, CheckCircle2, XCircle, Ban, UserX, User, IdCard, Briefcase, MapPin, Shield, Info, Lock, Eye, EyeOff, KeyRound, ChevronDown } from 'lucide-react';
import { Guardarecurso, Usuario } from '../types';
import { toast } from 'sonner@2.0.3';
import { CambiarContrasenaAdmin } from './CambiarContrasenaAdmin';

interface RegistroGuardarecursosProps {
  userPermissions: {
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
  };
  currentUser?: any;
}

export function RegistroGuardarecursos({ userPermissions, currentUser }: RegistroGuardarecursosProps) {
  const [guardarecursosList, setGuardarecursosList] = useState(guardarecursos);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGuardarecurso, setEditingGuardarecurso] = useState<Guardarecurso | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [guardarecursoToChangePassword, setGuardarecursoToChangePassword] = useState<any>(null);
  const [isEstadoAlertOpen, setIsEstadoAlertOpen] = useState(false);
  const [estadoPendiente, setEstadoPendiente] = useState<{ id: string; nuevoEstado: 'Activo' | 'Suspendido' | 'Desactivado'; nombre: string } | null>(null);
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    telefono: '',
    email: '',
    password: '',
    areaAsignada: '',
    estado: 'Activo'
  });

  // Filtrar SOLO guardarecursos (excluir administradores y coordinadores)
  const filteredGuardarecursos = guardarecursosList.filter(g => {
    // Solo mostrar guardarecursos (excluir otros roles)
    const usuarioAsociado = usuarios.find(u => u.email === g.email);
    const isGuardarecurso = !usuarioAsociado || usuarioAsociado.rol === 'Guardarecurso';
    
    const matchesSearch = 
      g.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.cedula.includes(searchTerm) ||
      g.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesArea = !selectedArea || selectedArea === 'all' || g.areaAsignada === selectedArea;
    
    return isGuardarecurso && matchesSearch && matchesArea;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingGuardarecurso) {
      // Editar existente (sin tocar la contraseña ni el estado)
      setGuardarecursosList(prev => prev.map(g => 
        g.id === editingGuardarecurso.id 
          ? { 
              ...g, 
              nombre: formData.nombre,
              apellido: formData.apellido,
              cedula: formData.cedula,
              telefono: formData.telefono,
              email: formData.email,
              areaAsignada: formData.areaAsignada
              // NO actualizar estado aquí - usar el botón específico
            }
          : g
      ));
      
      // Actualizar también el usuario correspondiente (sin cambiar contraseña ni estado)
      const usuarioIndex = usuarios.findIndex(u => u.email === editingGuardarecurso.email);
      if (usuarioIndex !== -1) {
        usuarios[usuarioIndex] = {
          ...usuarios[usuarioIndex],
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          telefono: formData.telefono,
          areaAsignada: formData.areaAsignada
          // NO actualizar contraseña ni estado aquí - usar botones específicos
        };
      }
      
      toast.success('Guardarecurso actualizado', {
        description: 'Los datos del guardarecurso han sido actualizados correctamente.'
      });
    } else {
      // Crear nuevo guardarecurso (siempre con estado "Activo")
      const newId = Date.now().toString();
      const newGuardarecurso: Guardarecurso = {
        id: newId,
        nombre: formData.nombre,
        apellido: formData.apellido,
        cedula: formData.cedula,
        telefono: formData.telefono,
        email: formData.email,
        password: formData.password,
        puesto: 'Guardarecurso', // Asignar automáticamente
        areaAsignada: formData.areaAsignada,
        fechaIngreso: new Date().toISOString().split('T')[0],
        estado: 'Activo', // Siempre se crea como Activo
        zonaCobertura: [],
        equiposAsignados: [],
        actividades: []
      };
      setGuardarecursosList(prev => [...prev, newGuardarecurso]);
      
      // Crear automáticamente un usuario para el guardarecurso
      const newUsuario: Usuario = {
        id: newId, // Usar el mismo ID para mantener la relación
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        telefono: formData.telefono,
        password: formData.password,
        rol: 'Guardarecurso',
        estado: 'Activo', // Siempre se crea como Activo
        fechaCreacion: new Date().toISOString().split('T')[0],
        ultimoAcceso: new Date().toISOString(),
        permisos: ['guarda.view', 'guarda.create.incidentes', 'guarda.create.fotos'],
        areaAsignada: formData.areaAsignada
      };
      usuarios.push(newUsuario);
      
      toast.success('Guardarecurso creado exitosamente', {
        description: `Se ha creado el acceso al sistema para ${formData.nombre} ${formData.apellido} con la contraseña proporcionada.`
      });
    }
    
    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      apellido: '',
      cedula: '',
      telefono: '',
      email: '',
      password: '',
      areaAsignada: '',
      estado: 'Activo'
    });
    setEditingGuardarecurso(null);
  };

  const handleEdit = (guardarecurso: Guardarecurso) => {
    setFormData({
      nombre: guardarecurso.nombre,
      apellido: guardarecurso.apellido,
      cedula: guardarecurso.cedula,
      telefono: guardarecurso.telefono,
      email: guardarecurso.email,
      password: '', // Dejar vacío para no cambiar la contraseña
      areaAsignada: guardarecurso.areaAsignada,
      estado: guardarecurso.estado
    });
    setEditingGuardarecurso(guardarecurso);
    setIsDialogOpen(true);
  };

  const handleEstadoClick = (id: string, nuevoEstado: 'Activo' | 'Suspendido' | 'Desactivado') => {
    const guardarecurso = guardarecursosList.find(g => g.id === id);
    if (!guardarecurso) return;

    // Si es el mismo estado, no hacer nada
    if (guardarecurso.estado === nuevoEstado) {
      toast.info('Sin cambios', {
        description: `El guardarecurso ya está en estado ${nuevoEstado}.`
      });
      return;
    }

    // Guardar el estado pendiente y mostrar la alerta de confirmación
    setEstadoPendiente({
      id,
      nuevoEstado,
      nombre: `${guardarecurso.nombre} ${guardarecurso.apellido}`
    });
    setIsEstadoAlertOpen(true);
  };

  const confirmarCambioEstado = () => {
    if (!estadoPendiente) return;

    const { id, nuevoEstado, nombre } = estadoPendiente;

    // Actualizar el guardarecurso
    setGuardarecursosList(prev => prev.map(g => 
      g.id === id ? { ...g, estado: nuevoEstado } : g
    ));

    // Actualizar también el usuario asociado
    const guardarecurso = guardarecursosList.find(g => g.id === id);
    if (guardarecurso) {
      const usuarioIndex = usuarios.findIndex(u => u.email === guardarecurso.email);
      if (usuarioIndex !== -1) {
        usuarios[usuarioIndex] = {
          ...usuarios[usuarioIndex],
          estado: nuevoEstado as any
        };
      }
    }

    const mensajes = {
      'Activo': 'activado',
      'Suspendido': 'suspendido',
      'Desactivado': 'desactivado'
    };

    toast.success('Estado actualizado', {
      description: `${nombre} ha sido ${mensajes[nuevoEstado]}.`
    });

    // Limpiar y cerrar
    setIsEstadoAlertOpen(false);
    setEstadoPendiente(null);
  };

  const handleChangePassword = (guardarecurso: Guardarecurso) => {
    // Buscar el usuario asociado al guardarecurso
    const usuario = usuarios.find(u => u.email === guardarecurso.email);
    if (usuario) {
      setGuardarecursoToChangePassword(usuario);
      setIsPasswordDialogOpen(true);
    } else {
      toast.error('Error', {
        description: 'No se encontró el usuario asociado a este guardarecurso.'
      });
    }
  };

  const canChangePassword = () => {
    if (!currentUser) return false;
    // Administradores y Coordinadores pueden cambiar contraseñas de guardarecursos
    return currentUser.rol === 'Administrador' || currentUser.rol === 'Coordinador';
  };

  const getEstadoBadgeClass = (estado: string) => {
    switch (estado) {
      case 'Activo': 
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-300 dark:border-green-700';
      case 'Suspendido': 
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-300 dark:border-orange-700';
      case 'Desactivado': 
        return 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400 border border-gray-300 dark:border-gray-700';
      default: 
        return 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400 border border-gray-300 dark:border-gray-700';
    }
  };

  // Estadísticas solo de guardarecursos (excluir administradores y coordinadores)
  const soloGuardarecursos = guardarecursosList.filter(g => {
    const usuarioAsociado = usuarios.find(u => u.email === g.email);
    return !usuarioAsociado || usuarioAsociado.rol === 'Guardarecurso';
  });
  
  const estadisticas = {
    total: soloGuardarecursos.length,
    activos: soloGuardarecursos.filter(g => g.estado === 'Activo').length,
    suspendidos: soloGuardarecursos.filter(g => g.estado === 'Suspendido').length,
    desactivados: soloGuardarecursos.filter(g => g.estado === 'Desactivado').length
  };

  return (
    <div className="space-y-4">
      {/* Barra superior con búsqueda y botón */}
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col gap-3">
            {/* Primera fila: Búsqueda y Botón */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Búsqueda */}
              <div className="flex-1">
                <div className="relative h-10">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre, cédula o email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  />
                </div>
              </div>

              {/* Botón crear */}
              <Button 
                onClick={() => {
                  resetForm();
                  setIsDialogOpen(true);
                }}
                className="w-full sm:w-auto h-10 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 whitespace-nowrap text-xs sm:text-sm"
              >
                <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                Nuevo Guardarecurso
              </Button>
            </div>

            {/* Segunda fila: Filtro por área */}
            <div className="w-full">
              <Select value={selectedArea} onValueChange={setSelectedArea}>
                <SelectTrigger className="h-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="Filtrar por área" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las áreas</SelectItem>
                  {areasProtegidas.map(area => (
                    <SelectItem key={area.id} value={area.id}>
                      {area.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog separado del Card */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[95vw] sm:w-[90vw] max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader className="pb-3 sm:pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg flex-shrink-0">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <DialogTitle className="text-base sm:text-xl md:text-2xl truncate">
                    {editingGuardarecurso ? 'Editar Guardarecurso' : 'Nuevo Guardarecurso'}
                  </DialogTitle>
                  <DialogDescription className="text-xs sm:text-sm truncate">
                    Complete los datos del personal de guardarecursos
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 pt-3 sm:pt-4">
              {/* Alerta informativa sobre creación automática de acceso */}
              {!editingGuardarecurso && (
                <Alert className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                  <Info className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription className="text-green-800 dark:text-green-300 text-xs sm:text-sm">
                    El guardarecurso podrá iniciar sesión y ver únicamente su información personal sin filtros ni opciones de edición.
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
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      placeholder="Ingrese el nombre"
                      className="h-10 sm:h-11"
                      required
                    />
                  </div>
                  
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="apellido" className="text-sm">Apellido *</Label>
                    <Input
                      id="apellido"
                      value={formData.apellido}
                      onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                      placeholder="Ingrese el apellido"
                      className="h-10 sm:h-11"
                      required
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="cedula" className="text-sm">Cédula *</Label>
                    <Input
                      id="cedula"
                      value={formData.cedula}
                      onChange={(e) => setFormData({...formData, cedula: e.target.value})}
                      placeholder="0000-00000-0000"
                      className="h-10 sm:h-11"
                      required
                    />
                  </div>
                  
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="telefono" className="text-sm">Teléfono *</Label>
                    <Input
                      id="telefono"
                      value={formData.telefono}
                      onChange={(e) => setFormData({...formData, telefono: e.target.value})}
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
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="correo@ejemplo.com"
                      className="h-10 sm:h-11"
                      required
                    />
                  </div>
                  
                  {/* Solo mostrar campo de contraseña al CREAR, no al EDITAR */}
                  {!editingGuardarecurso && (
                    <div className="space-y-1.5 sm:space-y-2 sm:col-span-2">
                      <Label htmlFor="password" className="text-sm">Contraseña *</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
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

              {/* Información Laboral */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base">Información Laboral</h3>
                </div>
                
                <div className="pl-0 sm:pl-10">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="area" className="text-sm">Área Asignada *</Label>
                    <Select value={formData.areaAsignada} onValueChange={(value) => setFormData({...formData, areaAsignada: value})}>
                      <SelectTrigger className="h-10 sm:h-11">
                        <SelectValue placeholder="Seleccione área" />
                      </SelectTrigger>
                      <SelectContent>
                        {areasProtegidas.map(area => (
                          <SelectItem key={area.id} value={area.id}>
                            {area.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                  className="w-full sm:w-auto h-10 sm:h-11 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800"
                >
                  {editingGuardarecurso ? (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Actualizar Guardarecurso
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Crear Guardarecurso
                    </>
                  )}
                </Button>
              </div>
            </form>
        </DialogContent>
      </Dialog>

      {/* Estadísticas responsive: arriba en móvil/tablet, sidebar en desktop */}
      <div className="lg:hidden mb-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <Card className="border-0 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 shadow-md">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col items-center justify-center gap-1.5 sm:gap-2">
                <Users className="h-7 w-7 sm:h-9 sm:w-9 text-blue-700 dark:text-blue-300" />
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl text-blue-800 dark:text-blue-200 mb-0.5 sm:mb-1">{estadisticas.total}</p>
                  <p className="text-xs text-blue-700/80 dark:text-blue-300/80">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 shadow-md">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col items-center justify-center gap-1.5 sm:gap-2">
                <CheckCircle2 className="h-7 w-7 sm:h-9 sm:w-9 text-green-700 dark:text-green-300" />
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl text-green-800 dark:text-green-200 mb-0.5 sm:mb-1">{estadisticas.activos}</p>
                  <p className="text-xs text-green-700/80 dark:text-green-300/80">Activos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/40 dark:to-orange-800/40 shadow-md">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col items-center justify-center gap-1.5 sm:gap-2">
                <Ban className="h-7 w-7 sm:h-9 sm:w-9 text-orange-700 dark:text-orange-300" />
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl text-orange-800 dark:text-orange-200 mb-0.5 sm:mb-1">{estadisticas.suspendidos}</p>
                  <p className="text-xs text-orange-700/80 dark:text-orange-300/80">Suspendidos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800/40 dark:to-gray-700/40 shadow-md">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col items-center justify-center gap-1.5 sm:gap-2">
                <UserX className="h-7 w-7 sm:h-9 sm:w-9 text-gray-700 dark:text-gray-300" />
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl text-gray-800 dark:text-gray-200 mb-0.5 sm:mb-1">{estadisticas.desactivados}</p>
                  <p className="text-xs text-gray-700/80 dark:text-gray-300/80">Desactivados</p>
                </div>
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
                      <TableHead className="hidden sm:table-cell min-w-[110px]">Cédula</TableHead>
                      
                      {/* Visible desde MD (768px+) */}
                      <TableHead className="hidden md:table-cell min-w-[160px]">Área Asignada</TableHead>
                      
                      {/* Visible desde LG (1024px+) */}
                      <TableHead className="hidden lg:table-cell min-w-[200px]">Contacto</TableHead>
                      
                      {/* Visible desde XL (1280px+) */}
                      <TableHead className="hidden xl:table-cell min-w-[110px]">Fecha Ingreso</TableHead>
                      
                      {/* Siempre visible */}
                      <TableHead className="text-right min-w-[140px]">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGuardarecursos.map((guardarecurso) => {
                      const area = areasProtegidas.find(a => a.id === guardarecurso.areaAsignada);
                      return (
                        <TableRow key={guardarecurso.id}>
                          {/* Siempre visible - Nombre */}
                          <TableCell>
                            <div className="font-medium whitespace-nowrap">
                              {guardarecurso.nombre} {guardarecurso.apellido}
                            </div>
                          </TableCell>
                          
                          {/* Siempre visible - Estado */}
                          <TableCell>
                            <Badge className={getEstadoBadgeClass(guardarecurso.estado)}>
                              {guardarecurso.estado}
                            </Badge>
                          </TableCell>
                          
                          {/* Visible desde SM - Cédula */}
                          <TableCell className="hidden sm:table-cell whitespace-nowrap">
                            {guardarecurso.cedula}
                          </TableCell>
                          
                          {/* Visible desde MD - Área */}
                          <TableCell className="hidden md:table-cell whitespace-nowrap">
                            {area?.nombre || 'No asignada'}
                          </TableCell>
                          
                          {/* Visible desde LG - Contacto */}
                          <TableCell className="hidden lg:table-cell">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-sm whitespace-nowrap">
                                <Mail className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">{guardarecurso.email}</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm whitespace-nowrap">
                                <Phone className="h-3 w-3 flex-shrink-0" />
                                {guardarecurso.telefono}
                              </div>
                            </div>
                          </TableCell>
                          
                          {/* Visible desde XL - Fecha */}
                          <TableCell className="hidden xl:table-cell whitespace-nowrap">
                            {guardarecurso.fechaIngreso}
                          </TableCell>
                          
                          {/* Siempre visible - Acciones */}
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {canChangePassword() && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleChangePassword(guardarecurso)}
                                  title="Cambiar contraseña"
                                  className="flex-shrink-0"
                                >
                                  <KeyRound className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(guardarecurso)}
                                title="Editar información"
                                className="flex-shrink-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              
                              {/* Dropdown para cambiar estado */}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    title={`Cambiar estado (actual: ${guardarecurso.estado})`}
                                    className={`flex-shrink-0 ${
                                      guardarecurso.estado === 'Activo' 
                                        ? 'border-green-300 hover:border-green-400 text-green-600 hover:text-green-700' 
                                        : guardarecurso.estado === 'Suspendido'
                                        ? 'border-orange-300 hover:border-orange-400 text-orange-600 hover:text-orange-700'
                                        : 'border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-700'
                                    }`}
                                  >
                                    {guardarecurso.estado === 'Activo' ? (
                                      <CheckCircle2 className="h-4 w-4" />
                                    ) : guardarecurso.estado === 'Suspendido' ? (
                                      <Ban className="h-4 w-4" />
                                    ) : (
                                      <UserX className="h-4 w-4" />
                                    )}
                                    <ChevronDown className="h-3 w-3 ml-1" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem 
                                    onClick={() => handleEstadoClick(guardarecurso.id, 'Activo')}
                                    className="cursor-pointer"
                                  >
                                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                                    Activo
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleEstadoClick(guardarecurso.id, 'Suspendido')}
                                    className="cursor-pointer"
                                  >
                                    <Ban className="h-4 w-4 mr-2 text-orange-500" />
                                    Suspendido
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleEstadoClick(guardarecurso.id, 'Desactivado')}
                                    className="cursor-pointer"
                                  >
                                    <UserX className="h-4 w-4 mr-2 text-gray-500" />
                                    Desactivado
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              
              {filteredGuardarecursos.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No se encontraron guardarecursos que coincidan con los filtros</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Columna derecha: Estadísticas (solo visible en desktop LG+) */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24 grid grid-cols-1 gap-2">
            <Card className="border-0 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 shadow-md">
              <CardContent className="p-4">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Users className="h-10 w-10 text-blue-700 dark:text-blue-300" />
                  <div className="text-center">
                    <p className="text-3xl text-blue-800 dark:text-blue-200 mb-1">{estadisticas.total}</p>
                    <p className="text-xs text-blue-700/80 dark:text-blue-300/80">Total Personal</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 shadow-md">
              <CardContent className="p-4">
                <div className="flex flex-col items-center justify-center gap-2">
                  <CheckCircle2 className="h-10 w-10 text-green-700 dark:text-green-300" />
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
                  <Ban className="h-10 w-10 text-orange-700 dark:text-orange-300" />
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
                  <UserX className="h-10 w-10 text-gray-700 dark:text-gray-300" />
                  <div className="text-center">
                    <p className="text-3xl text-gray-800 dark:text-gray-200 mb-1">{estadisticas.desactivados}</p>
                    <p className="text-xs text-gray-700/80 dark:text-gray-300/80">Desactivados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Diálogo para cambiar contraseña de guardarecurso */}
      {currentUser && guardarecursoToChangePassword && (
        <CambiarContrasenaAdmin
          isOpen={isPasswordDialogOpen}
          onClose={() => {
            setIsPasswordDialogOpen(false);
            setGuardarecursoToChangePassword(null);
          }}
          currentUser={currentUser}
          targetUser={guardarecursoToChangePassword}
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
                      <strong className={
                        estadoPendiente.nuevoEstado === 'Activo' 
                          ? 'text-green-600 dark:text-green-400' 
                          : estadoPendiente.nuevoEstado === 'Suspendido'
                          ? 'text-orange-600 dark:text-orange-400'
                          : 'text-gray-600 dark:text-gray-400'
                      }>
                        {estadoPendiente.nuevoEstado}
                      </strong>.
                    </p>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm">
                        {estadoPendiente.nuevoEstado === 'Activo' && (
                          <>✓ El guardarecurso podrá acceder al sistema normalmente.</>
                        )}
                        {estadoPendiente.nuevoEstado === 'Suspendido' && (
                          <>⚠️ El guardarecurso tendrá acceso limitado al sistema.</>
                        )}
                        {estadoPendiente.nuevoEstado === 'Desactivado' && (
                          <>✗ El guardarecurso NO podrá acceder al sistema.</>
                        )}
                      </p>
                    </div>
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
              onClick={confirmarCambioEstado}
              className={
                estadoPendiente?.nuevoEstado === 'Activo'
                  ? 'bg-green-600 hover:bg-green-700'
                  : estadoPendiente?.nuevoEstado === 'Suspendido'
                  ? 'bg-orange-600 hover:bg-orange-700'
                  : 'bg-gray-600 hover:bg-gray-700'
              }
            >
              Confirmar Cambio
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}