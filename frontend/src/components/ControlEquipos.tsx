import { useState, useMemo } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Plus, Edit, Search, Package, AlertTriangle, CheckCircle, Clock, Radio, Navigation, Eye, Camera, Car, Wrench, Box, Shield, XCircle, Tag, Hash, FileText, User, CheckCircle2, MoreVertical } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { motion } from 'motion/react';

interface ControlEquiposProps {
  userPermissions: {
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
  };
  currentUser?: {
    id: string;
    rol: string;
    nombre: string;
    apellido: string;
    email?: string;
  };
}

export function ControlEquipos({ userPermissions, currentUser }: ControlEquiposProps) {
  const isGuardarecurso = currentUser?.rol === 'Guardarecurso';
  const [equiposList, setEquiposList] = useState([
    ...equiposAsignados,
    {
      id: '4',
      nombre: 'Cámara Canon EOS R6',
      tipo: 'Cámara' as const,
      codigo: 'CAM-001',
      marca: 'Canon',
      modelo: 'EOS R6',
      fechaAsignacion: '2024-03-15',
      estado: 'Operativo' as const,
      guardarecursoAsignado: '1'
    },
    {
      id: '5',
      nombre: 'Vehículo Toyota Hilux',
      tipo: 'Vehículo' as const,
      codigo: 'VEH-001',
      marca: 'Toyota',
      modelo: 'Hilux 2023',
      fechaAsignacion: '2024-01-10',
      estado: 'Operativo' as const,
      observaciones: 'Mantenimiento completado'
    },
    {
      id: '6',
      nombre: 'Radio Motorola XTR',
      tipo: 'Radio' as const,
      codigo: 'RAD-004',
      marca: 'Motorola',
      modelo: 'XTR 446',
      fechaAsignacion: '2024-02-05',
      estado: 'Operativo' as const,
      guardarecursoAsignado: '3'
    },
    {
      id: '7',
      nombre: 'GPS Garmin Montana 700i',
      tipo: 'GPS' as const,
      codigo: 'GPS-003',
      marca: 'Garmin',
      modelo: 'Montana 700i',
      fechaAsignacion: '2024-03-10',
      estado: 'Operativo' as const,
      guardarecursoAsignado: '4'
    },
    {
      id: '8',
      nombre: 'Binoculares Bushnell Legend',
      tipo: 'Binoculares' as const,
      codigo: 'BIN-003',
      marca: 'Bushnell',
      modelo: 'Legend Ultra HD',
      fechaAsignacion: '2024-01-20',
      estado: 'Operativo' as const,
      guardarecursoAsignado: '5'
    },
    {
      id: '9',
      nombre: 'Cámara Nikon D850',
      tipo: 'Cámara' as const,
      codigo: 'CAM-002',
      marca: 'Nikon',
      modelo: 'D850',
      fechaAsignacion: '2024-02-15',
      estado: 'Operativo' as const,
      guardarecursoAsignado: '2'
    },
    {
      id: '10',
      nombre: 'Vehículo Ford Ranger',
      tipo: 'Vehículo' as const,
      codigo: 'VEH-002',
      marca: 'Ford',
      modelo: 'Ranger XLT 2023',
      fechaAsignacion: '2024-01-05',
      estado: 'Operativo' as const,
      observaciones: 'Asignado a Petén'
    },
    {
      id: '11',
      nombre: 'Machete Tramontina',
      tipo: 'Herramienta' as const,
      codigo: 'HER-001',
      marca: 'Tramontina',
      modelo: '18 pulgadas',
      fechaAsignacion: '2024-03-01',
      estado: 'Operativo' as const,
      guardarecursoAsignado: '6'
    },
    {
      id: '12',
      nombre: 'GPS Garmin eTrex 32x',
      tipo: 'GPS' as const,
      codigo: 'GPS-004',
      marca: 'Garmin',
      modelo: 'eTrex 32x',
      fechaAsignacion: '2024-02-20',
      estado: 'En Reparación' as const,
      observaciones: 'Pantalla dañada'
    },
    {
      id: '13',
      nombre: 'Radio Baofeng UV-5R',
      tipo: 'Radio' as const,
      codigo: 'RAD-005',
      marca: 'Baofeng',
      modelo: 'UV-5R',
      fechaAsignacion: '2024-03-05',
      estado: 'Operativo' as const,
      guardarecursoAsignado: '7'
    },
    {
      id: '14',
      nombre: 'Laptop Dell Latitude',
      tipo: 'Otro' as const,
      codigo: 'LAP-001',
      marca: 'Dell',
      modelo: 'Latitude 5420',
      fechaAsignacion: '2024-01-15',
      estado: 'Operativo' as const,
      guardarecursoAsignado: '8'
    },
    {
      id: '15',
      nombre: 'Cámara GoPro Hero 11',
      tipo: 'Cámara' as const,
      codigo: 'CAM-003',
      marca: 'GoPro',
      modelo: 'Hero 11 Black',
      fechaAsignacion: '2024-02-28',
      estado: 'Operativo' as const,
      guardarecursoAsignado: '9'
    },
    {
      id: '16',
      nombre: 'Binoculares Nikon Monarch',
      tipo: 'Binoculares' as const,
      codigo: 'BIN-004',
      marca: 'Nikon',
      modelo: 'Monarch 7',
      fechaAsignacion: '2024-03-12',
      estado: 'Operativo' as const,
      guardarecursoAsignado: '10'
    },
    {
      id: '17',
      nombre: 'Vehículo Chevrolet S10',
      tipo: 'Vehículo' as const,
      codigo: 'VEH-003',
      marca: 'Chevrolet',
      modelo: 'S10 High Country',
      fechaAsignacion: '2023-12-20',
      estado: 'En Reparación' as const,
      observaciones: 'Motor averiado, en espera de repuestos'
    },
    {
      id: '18',
      nombre: 'GPS Magellan eXplorist',
      tipo: 'GPS' as const,
      codigo: 'GPS-005',
      marca: 'Magellan',
      modelo: 'eXplorist 310',
      fechaAsignacion: '2024-01-25',
      estado: 'Operativo' as const,
      guardarecursoAsignado: '11'
    },
    {
      id: '19',
      nombre: 'Radio Kenwood TK-3402',
      tipo: 'Radio' as const,
      codigo: 'RAD-006',
      marca: 'Kenwood',
      modelo: 'TK-3402U16P',
      fechaAsignacion: '2024-02-10',
      estado: 'Operativo' as const,
      guardarecursoAsignado: '12'
    },
    {
      id: '20',
      nombre: 'Drone DJI Mavic 3',
      tipo: 'Otro' as const,
      codigo: 'DRO-001',
      marca: 'DJI',
      modelo: 'Mavic 3',
      fechaAsignacion: '2024-03-20',
      estado: 'Operativo' as const,
      observaciones: 'Para vigilancia aérea'
    },
    {
      id: '21',
      nombre: 'Kit de Primeros Auxilios',
      tipo: 'Otro' as const,
      codigo: 'MED-001',
      marca: 'Adventure Medical',
      modelo: 'Ultralight/Watertight',
      fechaAsignacion: '2024-01-30',
      estado: 'Operativo' as const,
      guardarecursoAsignado: '13'
    },
    {
      id: '22',
      nombre: 'Tableta Samsung Galaxy Tab',
      tipo: 'Otro' as const,
      codigo: 'TAB-001',
      marca: 'Samsung',
      modelo: 'Galaxy Tab S8',
      fechaAsignacion: '2024-02-22',
      estado: 'Deshabilitado' as const,
      observaciones: 'Actualización de software'
    },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipo, setSelectedTipo] = useState<string>('todos');
  const [selectedEstado, setSelectedEstado] = useState<string>('todos');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEquipo, setEditingEquipo] = useState<any>(null);
  
  // Estados para confirmación de cambio de estado
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [equipoToChange, setEquipoToChange] = useState<any>(null);
  const [newEstado, setNewEstado] = useState<string>('');
  
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: '',
    codigo: '',
    marca: '',
    modelo: '',
    observaciones: '',
    guardarecursoAsignado: ''
  });

  const filteredEquipos = useMemo(() => {
    // Si es guardarecurso, solo mostrar sus equipos
    if (isGuardarecurso) {
      // Buscar el ID del guardarecurso basado en el email del usuario actual
      const guardarecursoData = guardarecursos.find(g => 
        g.email === currentUser?.email || 
        (currentUser?.nombre && currentUser?.apellido && 
         g.nombre === currentUser.nombre && g.apellido === currentUser.apellido)
      );
      
      if (guardarecursoData) {
        return equiposList.filter(e => e.guardarecursoAsignado === guardarecursoData.id);
      }
      return [];
    }
    
    // Para otros roles, aplicar filtros normalmente
    return equiposList.filter(e => {
      const matchesSearch = 
        e.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.marca && e.marca.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesTipo = selectedTipo === 'todos' || e.tipo === selectedTipo;
      const matchesEstado = selectedEstado === 'todos' || e.estado === selectedEstado;
      
      return matchesSearch && matchesTipo && matchesEstado;
    });
  }, [equiposList, searchTerm, selectedTipo, selectedEstado, isGuardarecurso, currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingEquipo) {
      setEquiposList(prev => prev.map(eq => 
        eq.id === editingEquipo.id 
          ? { 
              ...eq, 
              ...formData,
              tipo: formData.tipo as any
            }
          : eq
      ));
    } else {
      // Al crear, usar estado Operativo por defecto
      const nuevoEquipo = {
        id: Date.now().toString(),
        ...formData,
        fechaAsignacion: new Date().toISOString().split('T')[0],
        tipo: formData.tipo as any,
        estado: 'Operativo' as any
      };
      setEquiposList(prev => [...prev, nuevoEquipo]);
    }
    
    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      tipo: '',
      codigo: '',
      marca: '',
      modelo: '',
      observaciones: '',
      guardarecursoAsignado: ''
    });
    setEditingEquipo(null);
  };

  const handleEdit = (equipo: any) => {
    setFormData({
      nombre: equipo.nombre,
      tipo: equipo.tipo,
      codigo: equipo.codigo,
      marca: equipo.marca || '',
      modelo: equipo.modelo || '',
      observaciones: equipo.observaciones || '',
      guardarecursoAsignado: equipo.guardarecursoAsignado || ''
    });
    setEditingEquipo(equipo);
    setIsDialogOpen(true);
  };

  const handleEstadoClick = (equipo: any, estado: string) => {
    setEquipoToChange(equipo);
    setNewEstado(estado);
    setConfirmDialogOpen(true);
  };

  const confirmEstadoChange = () => {
    if (equipoToChange && newEstado) {
      setEquiposList(prev => prev.map(equipo =>
        equipo.id === equipoToChange.id ? { ...equipo, estado: newEstado as any } : equipo
      ));
    }
    setConfirmDialogOpen(false);
    setEquipoToChange(null);
    setNewEstado('');
  };

  const getEstadoBadgeClass = (estado: string) => {
    switch (estado) {
      case 'Operativo':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-300 dark:border-green-700';
      case 'En Reparación':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-300 dark:border-orange-700';
      case 'Deshabilitado':
        return 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400 border border-gray-300 dark:border-gray-700';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400 border border-gray-300 dark:border-gray-700';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'Operativo': return CheckCircle;
      case 'En Reparación': return Clock;
      case 'Deshabilitado': return XCircle;
      default: return XCircle;
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'Radio': return <Radio className="h-5 w-5" />;
      case 'GPS': return <Navigation className="h-5 w-5" />;
      case 'Binoculares': return <Eye className="h-5 w-5" />;
      case 'Cámara': return <Camera className="h-5 w-5" />;
      case 'Vehículo': return <Car className="h-5 w-5" />;
      case 'Herramienta': return <Wrench className="h-5 w-5" />;
      case 'Otro': return <Box className="h-5 w-5" />;
      default: return <Package className="h-5 w-5" />;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Radio': return { badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-300 dark:border-blue-700' };
      case 'GPS': return { badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-300 dark:border-purple-700' };
      case 'Binoculares': return { badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700' };
      case 'Cámara': return { badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-300 dark:border-orange-700' };
      case 'Vehículo': return { badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-300 dark:border-red-700' };
      case 'Herramienta': return { badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-300 dark:border-amber-700' };
      default: return { badge: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400 border-gray-300 dark:border-gray-700' };
    }
  };

  // Estadísticas (basadas en equipos filtrados para guardarecursos)
  const estadisticas = useMemo(() => {
    const equiposParaEstadisticas = isGuardarecurso ? filteredEquipos : equiposList;
    return {
      total: equiposParaEstadisticas.length,
      operativos: equiposParaEstadisticas.filter(e => e.estado === 'Operativo').length,
      enReparacion: equiposParaEstadisticas.filter(e => e.estado === 'En Reparación').length,
      deshabilitados: equiposParaEstadisticas.filter(e => e.estado === 'Deshabilitado').length,
      porTipo: equiposParaEstadisticas.reduce((acc, e) => {
        acc[e.tipo] = (acc[e.tipo] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }, [equiposList, filteredEquipos, isGuardarecurso]);

  const tiposEquipo = ['Radio', 'GPS', 'Binoculares', 'Cámara', 'Vehículo', 'Herramienta', 'Otro'];

  return (
    <div className="space-y-4">
      {/* Barra superior con búsqueda y botón - Solo para Administradores y Coordinadores */}
      {!isGuardarecurso && (
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col gap-3">
              {/* Primera fila: Búsqueda y Botón */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Búsqueda */}
                <div className="flex-1 w-full">
                  <div className="relative h-10">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar equipos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    />
                  </div>
                </div>
                
                {/* Botón crear */}
                {userPermissions.canCreate && (
                  <Button 
                    onClick={() => {
                      resetForm();
                      setIsDialogOpen(true);
                    }}
                    className="w-full sm:w-auto h-10 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 whitespace-nowrap text-xs sm:text-sm"
                  >
                    <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                    Nuevo Equipo
                  </Button>
                )}
              </div>

              {/* Segunda fila: Filtros */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Filtro por tipo */}
                <Select value={selectedTipo} onValueChange={setSelectedTipo}>
                  <SelectTrigger className="h-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los tipos</SelectItem>
                    {tiposEquipo.map(tipo => (
                      <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Filtro por estado */}
                <Select value={selectedEstado} onValueChange={setSelectedEstado}>
                  <SelectTrigger className="h-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los estados</SelectItem>
                    <SelectItem value="Operativo">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Operativo
                      </div>
                    </SelectItem>
                    <SelectItem value="En Reparación">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-600" />
                        En Reparación
                      </div>
                    </SelectItem>
                    <SelectItem value="Deshabilitado">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-gray-600" />
                        Deshabilitado
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Vista especial para Guardarecursos */}
      {isGuardarecurso && (
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg flex-shrink-0">
                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-base sm:text-lg text-green-900 dark:text-green-100 truncate">
                  Mis Equipos Asignados
                </h3>
                <p className="text-xs sm:text-sm text-green-700 dark:text-green-300 truncate">
                  {currentUser?.nombre} {currentUser?.apellido} - Vista personal
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estadísticas responsive: arriba en móvil/tablet, sidebar en desktop */}
      <div className="lg:hidden mb-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <Card className="border-0 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 shadow-md">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col items-center justify-center gap-1 sm:gap-1.5">
                <Package className="h-6 w-6 sm:h-8 sm:w-8 text-blue-700 dark:text-blue-300" />
                <p className="text-xl sm:text-2xl text-blue-800 dark:text-blue-200">{estadisticas.total}</p>
                <p className="text-[10px] sm:text-xs text-blue-700/80 dark:text-blue-300/80 text-center leading-tight">Total Equipos</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 shadow-md">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col items-center justify-center gap-1 sm:gap-1.5">
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-700 dark:text-green-300" />
                <p className="text-xl sm:text-2xl text-green-800 dark:text-green-200">{estadisticas.operativos}</p>
                <p className="text-[10px] sm:text-xs text-green-700/80 dark:text-green-300/80">Operativos</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/40 dark:to-yellow-800/40 shadow-md">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col items-center justify-center gap-1 sm:gap-1.5">
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-700 dark:text-yellow-300" />
                <p className="text-xl sm:text-2xl text-yellow-800 dark:text-yellow-200">{estadisticas.enReparacion}</p>
                <p className="text-[10px] sm:text-xs text-yellow-700/80 dark:text-yellow-300/80 text-center leading-tight">En Reparación</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900/40 dark:to-gray-800/40 shadow-md">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col items-center justify-center gap-1 sm:gap-1.5">
                <XCircle className="h-6 w-6 sm:h-8 sm:w-8 text-gray-700 dark:text-gray-300" />
                <p className="text-xl sm:text-2xl text-gray-800 dark:text-gray-200">{estadisticas.deshabilitados}</p>
                <p className="text-[10px] sm:text-xs text-gray-700/80 dark:text-gray-300/80">Deshabilitados</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Diálogo para crear/editar - Solo para usuarios con permiso */}
      {!isGuardarecurso && userPermissions.canCreate && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="w-[95vw] sm:w-[90vw] max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader className="pb-3 sm:pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg flex-shrink-0">
                  <Package className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <DialogTitle className="text-base sm:text-xl md:text-2xl truncate">
                    {editingEquipo ? 'Editar Equipo' : 'Nuevo Equipo'}
                  </DialogTitle>
                  <DialogDescription className="text-xs sm:text-sm truncate">
                    Complete la información del equipo o recurso
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 pt-3 sm:pt-4">
              {/* Información General */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                    <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base">Información General</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pl-0 sm:pl-10">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="nombre" className="text-sm flex items-center gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      Nombre del Equipo *
                    </Label>
                    <Input
                      id="nombre"
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      placeholder="Ej: Radio Motorola XTR"
                      className="h-10 sm:h-11"
                      required
                    />
                  </div>
                  
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="codigo" className="text-sm flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      Código de Inventario *
                    </Label>
                    <Input
                      id="codigo"
                      value={formData.codigo}
                      onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                      placeholder="Ej: RAD-001"
                      className="h-10 sm:h-11"
                      required
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="tipo" className="text-sm flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      Tipo de Equipo *
                    </Label>
                    <Select value={formData.tipo} onValueChange={(value) => setFormData({...formData, tipo: value})}>
                      <SelectTrigger className="h-10 sm:h-11">
                        <SelectValue placeholder="Seleccione tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {tiposEquipo.map(tipo => (
                          <SelectItem key={tipo} value={tipo}>
                            {tipo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Separador */}
              <div className="border-b border-gray-200 dark:border-gray-700"></div>

              {/* Especificaciones Técnicas */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center flex-shrink-0">
                    <Wrench className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base">Especificaciones Técnicas</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pl-0 sm:pl-10">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="marca" className="text-sm flex items-center gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      Marca
                    </Label>
                    <Input
                      id="marca"
                      value={formData.marca}
                      onChange={(e) => setFormData({...formData, marca: e.target.value})}
                      placeholder="Ej: Motorola"
                      className="h-10 sm:h-11"
                    />
                  </div>
                  
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="modelo" className="text-sm flex items-center gap-2">
                      <Box className="h-4 w-4 text-muted-foreground" />
                      Modelo
                    </Label>
                    <Input
                      id="modelo"
                      value={formData.modelo}
                      onChange={(e) => setFormData({...formData, modelo: e.target.value})}
                      placeholder="Ej: XTR 446"
                      className="h-10 sm:h-11"
                    />
                  </div>
                </div>
              </div>

              {/* Separador */}
              <div className="border-b border-gray-200 dark:border-gray-700"></div>

              {/* Asignación */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base">Asignación</h3>
                </div>
                
                <div className="space-y-1.5 sm:space-y-2 pl-0 sm:pl-10">
                  <Label htmlFor="guardarecurso" className="text-sm flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Asignado a
                  </Label>
                  <Select value={formData.guardarecursoAsignado} onValueChange={(value) => setFormData({...formData, guardarecursoAsignado: value})}>
                    <SelectTrigger className="h-10 sm:h-11">
                      <SelectValue placeholder="Seleccione guardarecurso (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin asignar</SelectItem>
                      {guardarecursos.map(g => (
                        <SelectItem key={g.id} value={g.id}>
                          {g.nombre} {g.apellido} - {g.puesto}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Separador */}
              <div className="border-b border-gray-200 dark:border-gray-700"></div>

              {/* Observaciones */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base">Observaciones</h3>
                </div>
                
                <div className="space-y-1.5 sm:space-y-2 pl-0 sm:pl-10">
                  <Label htmlFor="observaciones" className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Notas Adicionales
                  </Label>
                  <Textarea
                    id="observaciones"
                    value={formData.observaciones}
                    onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                    placeholder="Notas adicionales sobre el equipo..."
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </div>
              
              {/* Footer con botones */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    resetForm();
                    setIsDialogOpen(false);
                  }}
                  className="w-full sm:w-auto h-10 sm:h-11"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="w-full sm:w-auto h-10 sm:h-11 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800"
                >
                  {editingEquipo ? (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Actualizar Equipo
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Crear Equipo
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Grid principal: Equipos a la izquierda, Estadísticas a la derecha (solo desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Columna izquierda: Grid de equipos */}
        <div className="lg:col-span-11">
          {filteredEquipos.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 sm:p-12">
                <div className="text-center">
                  <Package className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 text-muted-foreground opacity-30" />
                  <h3 className="mb-2 text-sm sm:text-base">
                    {isGuardarecurso ? 'No tienes equipos asignados' : 'No se encontraron equipos'}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                    {isGuardarecurso 
                      ? 'Actualmente no tienes ningún equipo asignado a tu cargo'
                      : 'No hay equipos que coincidan con los filtros seleccionados'
                    }
                  </p>
                  {!isGuardarecurso && (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedTipo('todos');
                        setSelectedEstado('todos');
                      }}
                      className="text-xs sm:text-sm"
                    >
                      Limpiar filtros
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
              {filteredEquipos.map((equipo, index) => {
                const guardarecurso = guardarecursos.find(g => g.id === (equipo as any).guardarecursoAsignado);
                const tipoColor = getTipoColor(equipo.tipo);
                
                return (
                  <motion.div
                    key={equipo.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow duration-200">
                      <CardContent className="p-4 sm:p-5">
                        {/* Header con tipo de equipo y color */}
                        <div className={`${tipoColor.badge} -m-4 sm:-m-5 mb-3 sm:mb-4 p-3 sm:p-4 flex items-center justify-between rounded-t-lg border-b`}>
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                              <div className="flex-shrink-0">
                                {getTipoIcon(equipo.tipo)}
                              </div>
                              <span className="font-semibold text-sm sm:text-base truncate">{equipo.tipo}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                            <Badge className="text-[10px] sm:text-xs bg-white/80 dark:bg-gray-900/80 border whitespace-nowrap text-black dark:text-white">
                              {equipo.codigo}
                            </Badge>
                            {!isGuardarecurso && userPermissions.canEdit && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(equipo)}
                                className="h-7 w-7 sm:h-8 sm:w-8 p-0 bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-800"
                                title="Editar equipo"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            )}
                            {!isGuardarecurso && userPermissions.canDelete && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 w-7 sm:h-8 sm:w-8 p-0 bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-800"
                                    title="Cambiar estado"
                                  >
                                    <MoreVertical className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel className="text-xs sm:text-sm">Cambiar Estado</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleEstadoClick(equipo, 'Operativo')}
                                    disabled={equipo.estado === 'Operativo'}
                                    className="text-xs sm:text-sm"
                                  >
                                    <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 text-green-600" />
                                    Operativo
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleEstadoClick(equipo, 'En Reparación')}
                                    disabled={equipo.estado === 'En Reparación'}
                                    className="text-xs sm:text-sm"
                                  >
                                    <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 text-orange-600" />
                                    En Reparación
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleEstadoClick(equipo, 'Deshabilitado')}
                                    disabled={equipo.estado === 'Deshabilitado'}
                                    className="text-xs sm:text-sm"
                                  >
                                    <XCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 text-gray-600" />
                                    Deshabilitado
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        </div>

                        {/* Contenido principal */}
                        <div className="space-y-2.5 sm:space-y-3">
                          {/* Nombre y Estado */}
                          <div>
                            <h3 className="font-semibold mb-2 line-clamp-2 text-sm sm:text-base">{equipo.nombre}</h3>
                            <Badge className={`${getEstadoBadgeClass(equipo.estado)} text-xs`}>
                              {(() => {
                                const IconComponent = getEstadoIcon(equipo.estado);
                                return <IconComponent className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />;
                              })()}
                              {equipo.estado}
                            </Badge>
                          </div>

                          {/* Especificaciones */}
                          <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm pt-2 border-t">
                            {equipo.marca && (
                              <div>
                                <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Marca</p>
                                <p className="font-medium truncate">{equipo.marca}</p>
                              </div>
                            )}
                          </div>

                          {equipo.modelo && (
                            <div className="text-xs sm:text-sm">
                              <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Modelo</p>
                              <p className="font-medium truncate">{equipo.modelo}</p>
                            </div>
                          )}

                          {/* Asignado a */}
                          <div className="pt-2.5 sm:pt-3 border-t">
                            <p className="text-[10px] sm:text-xs text-muted-foreground mb-1.5 sm:mb-2">Asignado a</p>
                            {guardarecurso ? (
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                                  <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs sm:text-sm font-medium truncate">
                                    {guardarecurso.nombre} {guardarecurso.apellido}
                                  </p>
                                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                                    {guardarecurso.puesto}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <p className="text-xs sm:text-sm text-muted-foreground italic">Sin asignar</p>
                            )}
                          </div>

                          {equipo.observaciones && (
                            <div className="pt-2.5 sm:pt-3 border-t">
                              <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Observaciones</p>
                              <p className="text-xs sm:text-sm line-clamp-2">
                                {equipo.observaciones}
                              </p>
                            </div>
                          )}

                          {/* Fecha de asignación */}
                          <div className="pt-2.5 sm:pt-3 border-t">
                            <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">
                                {new Date(equipo.fechaAsignacion).toLocaleDateString('es-GT', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Columna derecha: Estadísticas (solo visible en desktop LG+) */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24 grid grid-cols-1 gap-2">
            <Card className="border-0 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 shadow-md">
              <CardContent className="p-2">
                <div className="flex flex-col items-center justify-center">
                  <Package className="h-5 w-5 text-blue-700 dark:text-blue-300 mb-1" />
                  <p className="text-xl text-blue-800 dark:text-blue-200">{estadisticas.total}</p>
                  <p className="text-[10px] text-blue-700/80 dark:text-blue-300/80 text-center leading-tight">Total Equipos</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 shadow-md">
              <CardContent className="p-2">
                <div className="flex flex-col items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-700 dark:text-green-300 mb-1" />
                  <p className="text-xl text-green-800 dark:text-green-200">{estadisticas.operativos}</p>
                  <p className="text-[10px] text-green-700/80 dark:text-green-300/80">Operativos</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/40 dark:to-yellow-800/40 shadow-md">
              <CardContent className="p-2">
                <div className="flex flex-col items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-700 dark:text-yellow-300 mb-1" />
                  <p className="text-xl text-yellow-800 dark:text-yellow-200">{estadisticas.enReparacion}</p>
                  <p className="text-[10px] text-yellow-700/80 dark:text-yellow-300/80 text-center leading-tight">En Reparación</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900/40 dark:to-gray-800/40 shadow-md">
              <CardContent className="p-2">
                <div className="flex flex-col items-center justify-center">
                  <XCircle className="h-5 w-5 text-gray-700 dark:text-gray-300 mb-1" />
                  <p className="text-xl text-gray-800 dark:text-gray-200">{estadisticas.deshabilitados}</p>
                  <p className="text-[10px] text-gray-700/80 dark:text-gray-300/80">Deshabilitados</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Diálogo de confirmación de cambio de estado */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent className="max-w-[calc(100%-2rem)] sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-base sm:text-lg">
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                newEstado === 'Operativo' 
                  ? 'bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40'
                  : newEstado === 'En Reparación'
                  ? 'bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40'
                  : 'bg-gradient-to-br from-gray-100 to-slate-100 dark:from-gray-900/40 dark:to-slate-900/40'
              }`}>
                {newEstado === 'Operativo' && <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />}
                {newEstado === 'En Reparación' && <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400" />}
                {newEstado === 'Deshabilitado' && <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400" />}
              </div>
              <span className="min-w-0">Cambiar Estado del Equipo</span>
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-xs sm:text-sm">
                <p>¿Está seguro de que desea cambiar el estado del equipo <strong>"{equipoToChange?.nombre}"</strong> a <strong className={
                  newEstado === 'Operativo' 
                    ? 'text-green-600 dark:text-green-400'
                    : newEstado === 'En Reparación'
                    ? 'text-orange-600 dark:text-orange-400'
                    : 'text-gray-600 dark:text-gray-400'
                }>{newEstado}</strong>?</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {newEstado === 'Operativo' && 'El equipo estará disponible para su uso normal.'}
                  {newEstado === 'En Reparación' && 'El equipo se marcará como en proceso de reparación.'}
                  {newEstado === 'Deshabilitado' && 'El equipo quedará deshabilitado y no estará disponible para asignaciones.'}
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmEstadoChange}
              className={`w-full sm:w-auto ${
                newEstado === 'Operativo'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : newEstado === 'En Reparación'
                  ? 'bg-orange-600 hover:bg-orange-700 text-white'
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
            >
              {newEstado === 'Operativo' && (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Marcar como Operativo
                </>
              )}
              {newEstado === 'En Reparación' && (
                <>
                  <Clock className="h-4 w-4 mr-2" />
                  Marcar en Reparación
                </>
              )}
              {newEstado === 'Deshabilitado' && (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Deshabilitar Equipo
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
