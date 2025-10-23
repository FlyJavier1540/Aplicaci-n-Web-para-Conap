import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Plus, Edit, Search, Calendar, Clock, User, Info, CheckCircle2, XCircle, Trash2, MapPin, ListChecks, ChevronDown } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { format } from 'date-fns';

// ⬅️ Importamos los servicios modulares
import { actividadesService, usuariosService, catalogosService } from '../utils/api'; 
import { Actividad, Usuario as UsuarioType } from '../types'; 

// Interfaces para Catálogos
interface CatalogoItem { id: string; nombre: string; }

interface PlanificacionActividadesProps {
  userPermissions: {
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
  };
  currentUser: UsuarioType;
}

// Valores de estado por defecto para el formulario
const defaultFormState = {
    nombre: '',
    descripcion: '',
    tipo: '',
    fecha: format(new Date(), 'yyyy-MM-dd'), // Fecha de hoy por defecto
    horaInicio: '07:00',
    horaFin: '12:00',
    ubicacion: '',
    notas: '',
    usuarioId: '',
    estado: 'Pendiente',
};

export function PlanificacionActividades({ userPermissions, currentUser }: PlanificacionActividadesProps) {
  // 1. Estados principales
  const [actividadesList, setActividadesList] = useState<Actividad[]>([]);
  const [guardarecursosList, setGuardarecursosList] = useState<UsuarioType[]>([]);
  const [tiposActividad, setTiposActividad] = useState<CatalogoItem[]>([]);
  const [estadosCatalogo, setEstadosCatalogo] = useState<CatalogoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ... (El resto de hooks de estado) ...
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipo, setSelectedTipo] = useState<string>('all');
  const [selectedEstado, setSelectedEstado] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingActividad, setEditingActividad] = useState<Actividad | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [actividadToDelete, setActividadToDelete] = useState<{ id: string; nombre: string } | null>(null);
  
  const [formData, setFormData] = useState(defaultFormState);


  // 2. Función de Carga de Datos y Catálogos desde la API
  const loadData = async () => {
    if (!userPermissions.canView) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // ⬅️ CARGA PARALELA DE ACTIVIDADES, USUARIOS y CATÁLOGOS
      const [actividadesData, usuariosData, tiposData, estadosData] = await Promise.all([
        actividadesService.getAll(),
        usuariosService.getAll(),
        catalogosService.getTipos(),
        catalogosService.getEstados(),
      ]);
      
      // Filtra solo los Guardarecursos (rol === 'Guardarecurso') para asignación
      const guardaRecursos = usuariosData.filter(u => u.rol === 'Guardarecurso');

      setActividadesList(actividadesData as Actividad[]);
      setGuardarecursosList(guardaRecursos as UsuarioType[]);
      // Filtra tipos y estados relevantes (ej. tipos 1-8 para actividades)
      setTiposActividad(tiposData.filter(t => parseInt(t.id) <= 8).map(t => ({ id: t.id.toString(), nombre: t.nombre })));
      setEstadosCatalogo(estadosData.map(e => ({ id: e.id.toString(), nombre: e.nombre })));

    } catch (error: any) {
      console.error('Error al cargar datos de planificación:', error);
      toast.error('Error de API', { description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar datos al montar
  useEffect(() => {
    loadData();
  }, [userPermissions.canView]); 

  // 3. Lógica de Creación/Edición (Usa la API)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mapeo de nombre de Tipo a ID (el servicio se encarga de esto, solo enviamos el string)
    const actividadData: Partial<Actividad> & { usuarioId: number } = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        tipo: formData.tipo as any,
        fecha: formData.fecha,
        horaInicio: formData.horaInicio,
        horaFin: formData.horaFin,
        ubicacion: formData.ubicacion,
        notas: formData.notas,
        // El estado inicial es siempre Pendiente (ID 9)
        estado: editingActividad ? editingActividad.estado : 'Pendiente' as any, 
        usuarioId: parseInt(formData.usuarioId),
    };

    try {
        if (editingActividad) {
            // Edición: usa PUT para actualizar
            await actividadesService.update(editingActividad.id, actividadData, currentUser.id);
            toast.success('Actividad actualizada', { description: 'Los datos de la actividad han sido actualizados.' });

        } else {
            // Creación: Llama a POST /api/actividades
            await actividadesService.create(actividadData, currentUser.id);
            toast.success('Actividad programada', { description: `La actividad ${formData.nombre} fue programada exitosamente.` });
        }
        
        resetForm();
        setIsDialogOpen(false);
        loadData(); // Recargar la lista

    } catch (error: any) {
        toast.error('Error de Operación', { description: error.message });
    }
  };

  // 4. Lógica de Cancelación (Eliminación Lógica)
  const handleConfirmDelete = async () => {
    if (!actividadToDelete) return;

    try {
        // Llama a DELETE (eliminación lógica, cambia estado a 'Cancelado')
        await actividadesService.delete(actividadToDelete.id);
        toast.success('Actividad cancelada', { description: `La actividad ${actividadToDelete.nombre} ha sido cancelada.` });
        loadData();
    } catch (error: any) {
        toast.error('Error al cancelar', { description: error.message });
    } finally {
        setIsDeleteAlertOpen(false);
        setActividadToDelete(null);
    }
  };
  
  
  // 5. Lógica de Filtrado
  const filteredActividades = useMemo(() => {
    return actividadesList.filter(act => {
      const matchesSearch = 
        act.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        act.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        act.codigo.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTipo = selectedTipo === 'all' || act.tipo === selectedTipo;
      const matchesEstado = selectedEstado === 'all' || act.estado === selectedEstado;
      
      return matchesSearch && matchesTipo && matchesEstado;
    });
  }, [actividadesList, searchTerm, selectedTipo, selectedEstado]);
  
  
  // 6. Funciones Auxiliares
  const resetForm = () => {
    setFormData(defaultFormState);
    setEditingActividad(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (actividad: Actividad) => {
    // Mapeo de Actividad a formulario
    setFormData({
        nombre: actividad.nombre,
        descripcion: actividad.descripcion || '',
        tipo: actividad.tipo,
        fecha: actividad.fecha, // Ya está en formato YYYY-MM-DD
        horaInicio: actividad.horaInicio,
        horaFin: actividad.horaFin,
        ubicacion: actividad.ubicacion || '',
        notas: actividad.notas || '',
        usuarioId: actividad.usuarioId,
        estado: actividad.estado,
    });
    setEditingActividad(actividad);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (actividad: Actividad) => {
    setActividadToDelete({ id: actividad.id, nombre: actividad.nombre });
    setIsDeleteAlertOpen(true);
  };

  // Mapeo auxiliar para encontrar el nombre del Guardarecurso
  const guardarecursosMap = useMemo(() => {
    return new Map(guardarecursosList.map(g => [g.id, `${g.nombre} ${g.apellido}`]));
  }, [guardarecursosList]);


  const getEstadoBadgeClass = (estado: string) => {
    switch (estado) {
        case 'Pendiente': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-300 dark:border-blue-700';
        case 'En Proceso': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-300 dark:border-orange-700';
        case 'Completado': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-300 dark:border-green-700';
        case 'Cancelado': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-300 dark:border-red-700';
        default: return 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400 border border-gray-300 dark:border-gray-700';
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
        case 'Patrullaje': return ListChecks;
        case 'Monitoreo': return MapPin;
        case 'Rescate': return User;
        default: return Briefcase;
    }
  };
  
  // 7. Renderizado de carga
  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-96">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-muted-foreground ml-4">Cargando actividades planificadas...</p>
        </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Barra superior con filtros y botón */}
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Búsqueda */}
            <div className="flex-1">
              <div className="relative h-10">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por código, nombre o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                />
              </div>
            </div>

            {/* Filtro por Tipo */}
            <div className="flex-1 sm:max-w-[180px]">
              <Select value={selectedTipo} onValueChange={setSelectedTipo}>
                <SelectTrigger className="h-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="Filtrar por Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los Tipos</SelectItem>
                  {tiposActividad.map(tipo => (
                    <SelectItem key={tipo.id} value={tipo.nombre}>
                      {tipo.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por Estado */}
            <div className="flex-1 sm:max-w-[180px]">
              <Select value={selectedEstado} onValueChange={setSelectedEstado}>
                <SelectTrigger className="h-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="Filtrar por Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los Estados</SelectItem>
                  {estadosCatalogo.map(estado => (
                    <SelectItem key={estado.id} value={estado.nombre}>
                      {estado.nombre}
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
                    onClick={resetForm}
                    className="w-full sm:w-auto h-10 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Actividad
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] sm:w-[90vw] max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader className="pb-3 sm:pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg flex-shrink-0">
                  <ListChecks className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <DialogTitle className="text-base sm:text-xl md:text-2xl truncate">
                    {editingActividad ? 'Editar Actividad' : 'Nueva Actividad'}
                  </DialogTitle>
                  <DialogDescription className="text-xs sm:text-sm truncate">
                    Defina los parámetros de la actividad de campo
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 pt-3 sm:pt-4">
              
              {/* Información General */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                    <ListChecks className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base">Detalles de la Actividad</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pl-0 sm:pl-10">
                  <div className="space-y-1.5 sm:space-y-2 sm:col-span-2">
                    <Label htmlFor="nombre" className="text-sm">Nombre Corto *</Label>
                    <Input
                      id="nombre"
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      placeholder="Ej: Patrullaje Sector Norte"
                      className="h-10 sm:h-11"
                      required
                    />
                  </div>
                  
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="tipo" className="text-sm">Tipo de Actividad *</Label>
                    <Select value={formData.tipo} onValueChange={(value) => setFormData({...formData, tipo: value})}>
                      <SelectTrigger className="h-10 sm:h-11">
                        <SelectValue placeholder="Seleccione tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {tiposActividad.map(tipo => (
                          <SelectItem key={tipo.id} value={tipo.nombre}>
                            {tipo.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="usuarioId" className="text-sm">Asignar a Guardarecurso *</Label>
                    <Select value={formData.usuarioId} onValueChange={(value) => setFormData({...formData, usuarioId: value})}>
                      <SelectTrigger className="h-10 sm:h-11">
                        <SelectValue placeholder="Seleccione guardarecurso" />
                      </SelectTrigger>
                      <SelectContent>
                        {guardarecursosList.map(user => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.nombre} {user.apellido}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2 sm:col-span-2">
                    <Label htmlFor="descripcion" className="text-sm">Descripción</Label>
                    <Input
                      id="descripcion"
                      value={formData.descripcion}
                      onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                      placeholder="Detalle de los objetivos de la actividad"
                      className="h-10 sm:h-11"
                    />
                  </div>
                  
                  <div className="space-y-1.5 sm:space-y-2 sm:col-span-2">
                    <Label htmlFor="ubicacion" className="text-sm">Ubicación/Sector *</Label>
                    <Input
                      id="ubicacion"
                      value={formData.ubicacion}
                      onChange={(e) => setFormData({...formData, ubicacion: e.target.value})}
                      placeholder="Ej: Sendero Principal / Zona de Amortiguamiento"
                      className="h-10 sm:h-11"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Tiempos de Programación */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base">Horario y Fecha</h3>
                </div>
                
                <div className="grid grid-cols-3 gap-3 sm:gap-4 pl-0 sm:pl-10">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="fecha" className="text-sm">Fecha *</Label>
                    <Input
                      id="fecha"
                      type="date"
                      value={formData.fecha}
                      onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                      className="h-10 sm:h-11"
                      required
                    />
                  </div>
                  
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="horaInicio" className="text-sm">Hora Inicio *</Label>
                    <Input
                      id="horaInicio"
                      type="time"
                      value={formData.horaInicio}
                      onChange={(e) => setFormData({...formData, horaInicio: e.target.value})}
                      className="h-10 sm:h-11"
                      required
                    />
                  </div>
                  
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="horaFin" className="text-sm">Hora Fin *</Label>
                    <Input
                      id="horaFin"
                      type="time"
                      value={formData.horaFin}
                      onChange={(e) => setFormData({...formData, horaFin: e.target.value})}
                      className="h-10 sm:h-11"
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* Notas y Botones */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-100 dark:bg-gray-700/40 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base">Notas Adicionales</h3>
                </div>
                
                <div className="pl-0 sm:pl-10">
                  <Input
                    id="notas"
                    value={formData.notas}
                    onChange={(e) => setFormData({...formData, notas: e.target.value})}
                    placeholder="Comentarios internos o instrucciones especiales"
                    className="h-10 sm:h-11"
                  />
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
                  {editingActividad ? (
                    <>
                      <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                      Actualizar Actividad
                    </>
                  ) : (
                    <>
                      <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                      Programar Actividad
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


      {/* Tabla de Actividades */}
      <Card>
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="overflow-x-auto -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Actividad y Código</TableHead>
                  <TableHead className="min-w-[100px] hidden sm:table-cell">Fecha y Hora</TableHead>
                  <TableHead className="min-w-[100px]">Estado</TableHead>
                  <TableHead className="min-w-[120px] hidden md:table-cell">Asignado a</TableHead>
                  <TableHead className="min-w-[150px] hidden lg:table-cell">Ubicación</TableHead>
                  <TableHead className="text-right min-w-[140px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActividades.map((actividad) => (
                  <TableRow key={actividad.id}>
                    <TableCell>
                      <div className="font-medium whitespace-nowrap">{actividad.nombre}</div>
                      <p className="text-xs text-muted-foreground">{actividad.codigo}</p>
                    </TableCell>
                    
                    <TableCell className="hidden sm:table-cell whitespace-nowrap">
                       <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {actividad.fecha}
                      </div>
                       <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {actividad.horaInicio} - {actividad.horaFin}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge className={getEstadoBadgeClass(actividad.estado)}>
                        {actividad.estado}
                      </Badge>
                    </TableCell>
                    
                    <TableCell className="hidden md:table-cell whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {guardarecursosMap.get(actividad.usuarioId) || 'N/A'}
                      </div>
                    </TableCell>
                    
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {actividad.ubicacion}
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {userPermissions.canEdit && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(actividad)}
                                title="Editar actividad"
                                className="flex-shrink-0"
                                disabled={actividad.estado !== 'Pendiente'} // Solo se puede editar si está Pendiente
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                        )}
                        {userPermissions.canDelete && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        title="Cancelar actividad"
                                        className="flex-shrink-0"
                                        disabled={actividad.estado === 'Completado' || actividad.estado === 'Cancelado'}
                                    >
                                        <XCircle className="h-4 w-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>¿Cancelar Actividad?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Está a punto de cancelar la actividad <strong>{actividad.nombre}</strong>. Esta acción no se puede deshacer.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Mantener</AlertDialogCancel>
                                        <AlertDialogAction 
                                            onClick={handleConfirmDelete}
                                            className="bg-red-600 hover:bg-red-700"
                                        >
                                            Sí, Cancelar
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredActividades.length === 0 && (
            <div className="text-center py-8 sm:py-12 text-muted-foreground px-4">
              <Calendar className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 opacity-30" />
              <p className="text-sm sm:text-base">No se encontraron actividades planificadas que coincidan con los filtros</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}