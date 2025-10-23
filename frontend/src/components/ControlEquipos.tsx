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
import { Plus, Edit, Search, HardHat, Radio, MapPin, Truck, CheckCircle2, XCircle, Ban, User, ChevronDown, Wrench, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

// ⬅️ Importamos los servicios modulares
import { equiposService, usuariosService, catalogosService } from '../utils/api'; 
import { EquipoAsignado, Usuario as UsuarioType } from '../types'; 

// Interfaces para Catálogos
interface CatalogoItem { id: string; nombre: string; }

interface ControlEquiposProps {
  userPermissions: {
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
  };
  currentUser?: any;
}

export function ControlEquipos({ userPermissions, currentUser }: ControlEquiposProps) {
  // 1. Estados principales
  const [equiposList, setEquiposList] = useState<EquipoAsignado[]>([]);
  const [guardarecursosList, setGuardarecursosList] = useState<UsuarioType[]>([]);
  const [tiposCatalogo, setTiposCatalogo] = useState<CatalogoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ... (El resto de hooks de estado) ...
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipo, setSelectedTipo] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEquipo, setEditingEquipo] = useState<EquipoAsignado | null>(null);
  const [isEstadoAlertOpen, setIsEstadoAlertOpen] = useState(false);
  const [estadoPendiente, setEstadoPendiente] = useState<{ id: string; nombre: string; nuevoEstado: 'Operativo' | 'En Reparación' | 'Deshabilitado'; } | null>(null);
  
  const [formData, setFormData] = useState({
    nombre: '', 
    codigo: '', 
    tipo: '', 
    marca: '', 
    modelo: '', 
    guardarecursoAsignado: '', 
    observaciones: '', 
    estado: 'Operativo'
  });

  // 2. Función de Carga de Datos y Catálogos desde la API
  const loadData = async () => {
    if (!userPermissions.canView) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // ⬅️ CARGA PARALELA DE EQUIPOS, USUARIOS (para asignación) y CATÁLOGOS
      const [equiposData, usuariosData, tiposData] = await Promise.all([
        equiposService.getAll(),
        usuariosService.getAll(),
        catalogosService.getTipos()
      ]);
      
      // Filtra solo los Guardarecursos para la asignación
      const guardaRecursos = usuariosData.filter(u => u.rol === 'Guardarecurso');

      setEquiposList(equiposData as EquipoAsignado[]);
      setGuardarecursosList(guardaRecursos as UsuarioType[]);
      // Filtra tipos para obtener solo los de equipo (si es necesario)
      setTiposCatalogo(tiposData.map(t => ({ id: t.id.toString(), nombre: t.nombre })));

    } catch (error: any) {
      console.error('Error al cargar datos de equipos:', error);
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

    // Mapeo de nombre de Tipo a ID (el backend necesita ID)
    const tipoItem = tiposCatalogo.find(t => t.nombre === formData.tipo);
    if (!tipoItem) {
        toast.error('Error', { description: 'Seleccione un tipo de equipo válido.' });
        return;
    }

    const equipoData: Partial<EquipoAsignado> = {
        nombre: formData.nombre,
        codigo: formData.codigo,
        tipo: formData.tipo as any,
        marca: formData.marca,
        modelo: formData.modelo,
        guardarecursoAsignado: formData.guardarecursoAsignado,
        observaciones: formData.observaciones,
        estado: formData.estado as any,
        // IDs requeridos por el backend:
        equipo_tipo: parseInt(tipoItem.id),
        equipo_usuario: parseInt(formData.guardarecursoAsignado),
    };

    try {
        if (editingEquipo) {
            // Edición: Actualizamos la información
            await equiposService.update(editingEquipo.id, equipoData as any);
            toast.success('Equipo actualizado', { description: 'Los datos del equipo han sido actualizados.' });
        } else {
            // Creación: Llama a POST /api/equipos
            await equiposService.create(equipoData as any);
            toast.success('Equipo registrado', { description: `El equipo ${formData.nombre} fue registrado exitosamente.` });
        }
        
        resetForm();
        setIsDialogOpen(false);
        loadData(); // Recargar la lista

    } catch (error: any) {
        toast.error('Error de Operación', { description: error.message });
    }
  };

  // 4. Lógica de Cambio de Estado (Usa la API)
  const confirmarCambioEstado = async () => {
    if (!estadoPendiente) return;

    try {
        // Mapeo del estado de frontend al estado de la DB (el servicio se encarga del ID)
        await equiposService.updateEstado(estadoPendiente.id, estadoPendiente.nuevoEstado);
        
        const estadoTexto = estadoPendiente.nuevoEstado === 'Operativo' ? 'marcado como Operativo' 
          : estadoPendiente.nuevoEstado === 'En Reparación' ? 'enviado a Reparación' 
          : 'Deshabilitado';
        
        toast.success('Estado actualizado', {
          description: `El equipo ${estadoPendiente.nombre} ha sido ${estadoTexto}.`
        });
        
        loadData(); // Recargar la lista
    } catch (error: any) {
        toast.error('Error de Operación', { description: error.message });
    }
    
    setIsEstadoAlertOpen(false);
    setEstadoPendiente(null);
  };
  
  
  // 5. Lógica de Filtrado
  const filteredEquipos = useMemo(() => {
    return equiposList.filter(equipo => {
      const matchesSearch = 
        equipo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        equipo.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        equipo.marca.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTipo = selectedTipo === 'all' || equipo.tipo === selectedTipo;
      
      return matchesSearch && matchesTipo;
    });
  }, [equiposList, searchTerm, selectedTipo]);
  
  
  // 6. Funciones Auxiliares
  const resetForm = () => {
    setFormData({ nombre: '', codigo: '', tipo: '', marca: '', modelo: '', guardarecursoAsignado: '', observaciones: '', estado: 'Operativo' });
    setEditingEquipo(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (equipo: EquipoAsignado) => {
    // Mapeo de equipo a formulario
    setFormData({
      nombre: equipo.nombre,
      codigo: equipo.codigo,
      tipo: equipo.tipo,
      marca: equipo.marca || '',
      modelo: equipo.modelo || '',
      guardarecursoAsignado: equipo.guardarecursoAsignado,
      observaciones: equipo.observaciones || '',
      estado: equipo.estado
    });
    setEditingEquipo(equipo);
    setIsDialogOpen(true);
  };

  const handleEstadoClick = (equipo: EquipoAsignado, nuevoEstado: 'Operativo' | 'En Reparación' | 'Deshabilitado') => {
    setEstadoPendiente({ id: equipo.id, nuevoEstado, nombre: `${equipo.nombre} (${equipo.codigo})` });
    setIsEstadoAlertOpen(true);
  };


  const getEstadoBadgeClass = (estado: string) => {
    switch (estado) {
      case 'Operativo': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-300 dark:border-green-700';
      case 'En Reparación': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-300 dark:border-orange-700';
      case 'Deshabilitado': return 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400 border border-gray-300 dark:border-gray-700';
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400 border border-gray-300 dark:border-gray-700';
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
        case 'Comunicación': return Radio;
        case 'Transporte': return Truck;
        case 'Navegación': return MapPin;
        case 'Herramienta': return Wrench;
        default: return HardHat;
    }
  };
  
  // 7. Renderizado de carga
  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-96">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-muted-foreground ml-4">Cargando equipos y catálogos...</p>
        </div>
    );
  }

  // Mapeo auxiliar para encontrar el nombre del Guardarecurso
  const guardarecursosMap = useMemo(() => {
    return new Map(guardarecursosList.map(g => [g.id, `${g.nombre} ${g.apellido}`]));
  }, [guardarecursosList]);

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
                  placeholder="Buscar por código, marca o nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                />
              </div>
            </div>

            {/* Filtro por Tipo */}
            <div className="flex-1 sm:max-w-[200px]">
              <Select value={selectedTipo} onValueChange={setSelectedTipo}>
                <SelectTrigger className="h-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="Filtrar por Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los Tipos</SelectItem>
                  {tiposCatalogo.map(tipo => (
                    <SelectItem key={tipo.id} value={tipo.nombre}>
                      {tipo.nombre}
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
                    Nuevo Equipo
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] sm:w-[90vw] max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader className="pb-3 sm:pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg flex-shrink-0">
                  <HardHat className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <DialogTitle className="text-base sm:text-xl md:text-2xl truncate">
                    {editingEquipo ? 'Editar Equipo' : 'Nuevo Equipo'}
                  </DialogTitle>
                  <DialogDescription className="text-xs sm:text-sm truncate">
                    Defina las características y asignación del activo
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 pt-3 sm:pt-4">
              
              {/* Información del Equipo */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                    <Wrench className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base">Datos del Activo</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pl-0 sm:pl-10">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="nombre" className="text-sm">Nombre/Descripción *</Label>
                    <Input
                      id="nombre"
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      placeholder="Ej: Radio Satelital"
                      className="h-10 sm:h-11"
                      required
                    />
                  </div>
                  
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="codigo" className="text-sm">Código de Inventario *</Label>
                    <Input
                      id="codigo"
                      value={formData.codigo}
                      onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                      placeholder="Ej: RAD-S-001"
                      className="h-10 sm:h-11"
                      required
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="tipo" className="text-sm">Tipo de Equipo *</Label>
                    <Select value={formData.tipo} onValueChange={(value) => setFormData({...formData, tipo: value})}>
                      <SelectTrigger className="h-10 sm:h-11">
                        <SelectValue placeholder="Seleccione tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {tiposCatalogo.map(tipo => (
                            <SelectItem key={tipo.id} value={tipo.nombre}>
                                {tipo.nombre}
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="marca" className="text-sm">Marca</Label>
                    <Input
                      id="marca"
                      value={formData.marca}
                      onChange={(e) => setFormData({...formData, marca: e.target.value})}
                      placeholder="Ej: Garmin"
                      className="h-10 sm:h-11"
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="modelo" className="text-sm">Modelo</Label>
                    <Input
                      id="modelo"
                      value={formData.modelo}
                      onChange={(e) => setFormData({...formData, modelo: e.target.value})}
                      placeholder="Ej: inReach Mini"
                      className="h-10 sm:h-11"
                    />
                  </div>
                  
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="estado" className="text-sm">Estado *</Label>
                    <Select value={formData.estado} onValueChange={(value) => setFormData({...formData, estado: value})}>
                      <SelectTrigger className="h-10 sm:h-11">
                        <SelectValue placeholder="Seleccione estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Operativo">Operativo</SelectItem>
                        <SelectItem value="En Reparación">En Reparación</SelectItem>
                        <SelectItem value="Deshabilitado">Deshabilitado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Asignación y Observaciones */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0">
                    <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base">Asignación</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pl-0 sm:pl-10">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="guardarecurso" className="text-sm">Asignar a Guardarecurso *</Label>
                    <Select value={formData.guardarecursoAsignado} onValueChange={(value) => setFormData({...formData, guardarecursoAsignado: value})}>
                      <SelectTrigger className="h-10 sm:h-11">
                        <SelectValue placeholder="Seleccione Guardarecurso" />
                      </SelectTrigger>
                      <SelectContent>
                        {guardarecursosList.map(guarda => (
                            <SelectItem key={guarda.id} value={guarda.id}>
                                {guarda.nombre} {guarda.apellido}
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="observaciones" className="text-sm">Observaciones</Label>
                    <Input
                      id="observaciones"
                      value={formData.observaciones}
                      onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                      placeholder="Notas sobre el estado del equipo"
                      className="h-10 sm:h-11"
                    />
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
                  {editingEquipo ? (
                    <>
                      <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                      Actualizar Equipo
                    </>
                  ) : (
                    <>
                      <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                      Crear Equipo
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


      {/* Tabla de Equipos */}
      <Card>
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="overflow-x-auto -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Nombre y Código</TableHead>
                  <TableHead className="min-w-[100px] hidden sm:table-cell">Tipo</TableHead>
                  <TableHead className="min-w-[100px]">Estado</TableHead>
                  <TableHead className="min-w-[150px] hidden md:table-cell">Asignado a</TableHead>
                  <TableHead className="min-w-[100px] hidden lg:table-cell">Marca/Modelo</TableHead>
                  <TableHead className="text-right min-w-[140px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEquipos.map((equipo) => (
                  <TableRow key={equipo.id}>
                    <TableCell>
                      <div className="font-medium whitespace-nowrap">{equipo.nombre}</div>
                      <p className="text-xs text-muted-foreground">{equipo.codigo}</p>
                    </TableCell>
                    
                    <TableCell className="hidden sm:table-cell">
                       <Badge variant="outline" className="text-xs flex items-center w-fit">
                         {getTipoIcon(equipo.tipo)}
                         <span className="ml-1">{equipo.tipo}</span>
                       </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <Badge className={getEstadoBadgeClass(equipo.estado)}>
                        {equipo.estado}
                      </Badge>
                    </TableCell>
                    
                    <TableCell className="hidden md:table-cell whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {guardarecursosMap.get(equipo.guardarecursoAsignado) || 'No asignado'}
                      </div>
                    </TableCell>
                    
                    <TableCell className="hidden lg:table-cell whitespace-nowrap">
                      {equipo.marca}/{equipo.modelo}
                    </TableCell>
                    
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {userPermissions.canEdit && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(equipo)}
                            title="Editar equipo"
                            className="flex-shrink-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {userPermissions.canDelete && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                title="Cambiar estado"
                                className="flex-shrink-0"
                              >
                                <ArrowUpRight className="h-4 w-4" />
                                <ChevronDown className="h-3 w-3 ml-1" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEstadoClick(equipo, 'Operativo')}>
                                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" /> Operativo
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEstadoClick(equipo, 'En Reparación')}>
                                <Wrench className="h-4 w-4 mr-2 text-orange-500" /> En Reparación
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEstadoClick(equipo, 'Deshabilitado')}>
                                <XCircle className="h-4 w-4 mr-2 text-gray-500" /> Deshabilitado
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
          
          {filteredEquipos.length === 0 && (
            <div className="text-center py-8 sm:py-12 text-muted-foreground px-4">
              <HardHat className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 opacity-30" />
              <p className="text-sm sm:text-base">No se encontraron equipos que coincidan con los filtros</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alert Dialog para confirmar cambio de estado */}
      <AlertDialog open={isEstadoAlertOpen} onOpenChange={setIsEstadoAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cambio de Estado</AlertDialogTitle>
            <AlertDialogDescription>
              {estadoPendiente && `¿Confirmar el cambio de estado del equipo ${estadoPendiente.nombre} a "${estadoPendiente.nuevoEstado}"?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmarCambioEstado}
              className="bg-green-600 hover:bg-green-700"
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}