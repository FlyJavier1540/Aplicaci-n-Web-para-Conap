import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Alert } from './ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Plus, Edit, Search, MapPin, Layers, Briefcase, Info, CheckCircle2, XCircle, Trash2, Globe, Mountain, Droplet } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

// ⬅️ Importamos los servicios modulares
import { areasProtegidasService, catalogosService } from '../utils/api'; 
import { AreaProtegida } from '../types'; 

// Interfaces para Catálogos
interface CatalogoItem {
  id: string; // La API devuelve IDs numéricos, pero se manejan como strings
  nombre: string;
}

interface AsignacionZonasProps {
  userPermissions: {
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
  };
}

export function AsignacionZonas({ userPermissions }: AsignacionZonasProps) {
  // 1. Estados principales
  const [areasList, setAreasList] = useState<AreaProtegida[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 2. Estados de Catálogos (para filtros y formulario)
  const [departamentos, setDepartamentos] = useState<CatalogoItem[]>([]);
  const [categorias, setCategorias] = useState<CatalogoItem[]>([]);
  const [ecosistemas, setEcosistemas] = useState<CatalogoItem[]>([]);

  // ... (El resto de hooks de estado) ...
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState<string>('all');
  const [selectedDepartamento, setSelectedDepartamento] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<AreaProtegida | null>(null);
  
  const [formData, setFormData] = useState({
    nombre: '', 
    categoria: '', 
    departamento: '', 
    extension: 0, 
    descripcion: '', 
    ecosistema: '',
    latitud: 0,
    longitud: 0,
    area_ubicacion: '' // ID de ubicación para el PUT
  });

  // 3. Función de Carga de Datos y Catálogos desde la API
  const loadData = async () => {
    if (!userPermissions.canView) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // ⬅️ CARGA PARALELA DE ÁREAS Y TODOS LOS CATÁLOGOS NECESARIOS
      const [areasData, deptosData, catsData, ecosData] = await Promise.all([
        areasProtegidasService.getAll(),
        catalogosService.getDepartamentos(),
        catalogosService.getCategorias(),
        catalogosService.getEcosistemas(),
      ]);
      
      // Mapeo de datos (ID es numérico, lo convertimos a string para usar en select)
      setAreasList(areasData as AreaProtegida[]);
      setDepartamentos(deptosData.map(d => ({ id: d.id.toString(), nombre: d.nombre })));
      setCategorias(catsData.map(c => ({ id: c.id.toString(), nombre: c.nombre })));
      setEcosistemas(ecosData.map(e => ({ id: e.id.toString(), nombre: e.nombre })));

    } catch (error: any) {
      console.error('Error al cargar datos iniciales:', error);
      toast.error('Error de API', { description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar datos al montar
  useEffect(() => {
    loadData();
  }, [userPermissions.canView]); 

  // 4. Lógica de Creación/Edición (Usa la API Transaccional)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ⬅️ Mapeo de nombres de catálogos (strings) a IDs (numbers) para el backend
    const categoriaId = categorias.find(c => c.nombre === formData.categoria)?.id;
    const departamentoId = departamentos.find(d => d.nombre === formData.departamento)?.id;
    const ecosistemaId = ecosistemas.find(e => e.nombre === formData.ecosistema)?.id;
    
    if (!categoriaId || !departamentoId || !ecosistemaId) {
        toast.error('Error de catálogo', { description: 'Seleccione valores válidos para Categoría, Departamento y Ecosistema.' });
        return;
    }

    // Objeto de datos con los IDs listos para el backend
    const areaData: Partial<AreaProtegida> & { 
        coordenadas: { lat: number, lng: number }, 
        area_ubicacion?: string,
        area_categoria: number, // Campos extra para el backend
        area_departamento: number,
        area_ecosistema: number,
    } = {
        nombre: formData.nombre,
        categoria: formData.categoria as any,
        departamento: formData.departamento,
        extension: formData.extension,
        descripcion: formData.descripcion,
        ecosistemas: [formData.ecosistema as any],
        coordenadas: { lat: formData.latitud, lng: formData.longitud },
        
        // Mapeo final a IDs numéricos (el backend lo espera)
        area_categoria: parseInt(categoriaId), 
        area_departamento: parseInt(departamentoId),
        area_ecosistema: parseInt(ecosistemaId),
    };


    try {
        if (editingArea) {
            // Edición: se requiere el ID de ubicación existente para la transacción
            areaData.area_ubicacion = editingArea.area_ubicacion; 
            await areasProtegidasService.update(editingArea.id, areaData as any); // Se asume que el servicio maneja el mapeo de IDs a DB
            toast.success('Área actualizada', { description: 'Los datos del área protegida han sido actualizados.' });

        } else {
            // Creación: Llama a POST (el backend maneja la creación de la ubicación y el área en una transacción)
            await areasProtegidasService.create(areaData as any);
            toast.success('Área creada', { description: `El área ${formData.nombre} fue registrada exitosamente.` });
        }
        
        resetForm();
        setIsDialogOpen(false);
        loadData(); // Recargar la lista

    } catch (error: any) {
        toast.error('Error de Operación', { description: error.message });
    }
  };

  // 5. Lógica de Eliminación (Desactivación)
  const handleDeleteArea = async (areaId: string) => {
    try {
        // Llama a DELETE (eliminación lógica)
        await areasProtegidasService.delete(areaId);
        toast.success('Área desactivada', { description: 'El área fue marcada como Deshabilitada (Eliminación lógica).' });
        loadData();
    } catch (error: any) {
        toast.error('Error al desactivar área', { description: error.message });
    }
  };
  
  // 6. Lógica de Filtrado
  const filteredAreas = useMemo(() => {
    return areasList.filter(area => {
      const matchesSearch = 
        area.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        area.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategoria = selectedCategoria === 'all' || area.categoria === selectedCategoria;
      const matchesDepartamento = selectedDepartamento === 'all' || area.departamento === selectedDepartamento;
      
      return matchesSearch && matchesCategoria && matchesDepartamento;
    });
  }, [areasList, searchTerm, selectedCategoria, selectedDepartamento]);
  
  // 7. Funciones Auxiliares
  const resetForm = () => {
    setFormData({
        nombre: '', 
        categoria: '', 
        departamento: '', 
        extension: 0, 
        descripcion: '', 
        ecosistema: '',
        latitud: 0,
        longitud: 0,
        area_ubicacion: ''
    });
    setEditingArea(null);
  };

  const handleEdit = (area: AreaProtegida) => {
    setFormData({
        nombre: area.nombre,
        categoria: area.categoria,
        departamento: area.departamento,
        extension: area.extension,
        descripcion: area.descripcion,
        ecosistema: area.ecosistemas[0],
        latitud: area.coordenadas.lat,
        longitud: area.coordenadas.lng,
        area_ubicacion: area.area_ubicacion || '' // Guarda el ID de ubicación del área
    });
    setEditingArea(area);
    setIsDialogOpen(true);
  };
  
  const getEstadoBadgeClass = (estado: string) => {
    return estado === 'Habilitado' 
      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-300 dark:border-green-700'
      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-300 dark:border-red-700';
  };
  
  // 8. Renderizado de carga
  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-96">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-muted-foreground ml-4">Cargando áreas protegidas y catálogos...</p>
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
                  placeholder="Buscar por nombre o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                />
              </div>
            </div>

            {/* Filtro por Categoría */}
            <div className="flex-1 sm:max-w-[200px]">
              <Select value={selectedCategoria} onValueChange={setSelectedCategoria}>
                <SelectTrigger className="h-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="Filtrar por Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las Categorías</SelectItem>
                  {categorias.map(cat => (
                    <SelectItem key={cat.id} value={cat.nombre}>
                      {cat.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Filtro por Departamento */}
            <div className="flex-1 sm:max-w-[200px]">
              <Select value={selectedDepartamento} onValueChange={setSelectedDepartamento}>
                <SelectTrigger className="h-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="Filtrar por Departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los Departamentos</SelectItem>
                  {departamentos.map(dep => (
                    <SelectItem key={dep.id} value={dep.nombre}>
                      {dep.nombre}
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
                    Nueva Área
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] sm:w-[90vw] max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader className="pb-3 sm:pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg flex-shrink-0">
                  <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <DialogTitle className="text-base sm:text-xl md:text-2xl truncate">
                    {editingArea ? 'Editar Área Protegida' : 'Nueva Área Protegida'}
                  </DialogTitle>
                  <DialogDescription className="text-xs sm:text-sm truncate">
                    Defina los límites y características del área
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 pt-3 sm:pt-4">
              
              {/* Información General */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                    <Layers className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base">Datos Generales</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pl-0 sm:pl-10">
                  <div className="space-y-1.5 sm:space-y-2 sm:col-span-2">
                    <Label htmlFor="nombre" className="text-sm">Nombre del Área *</Label>
                    <Input
                      id="nombre"
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      placeholder="Ej: Parque Nacional Tikal"
                      className="h-10 sm:h-11"
                      required
                    />
                  </div>
                  
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="categoria" className="text-sm">Categoría *</Label>
                    <Select value={formData.categoria} onValueChange={(value) => setFormData({...formData, categoria: value})}>
                      <SelectTrigger className="h-10 sm:h-11">
                        <SelectValue placeholder="Seleccione categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categorias.map(cat => (
                          <SelectItem key={cat.id} value={cat.nombre}>
                            {cat.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="departamento" className="text-sm">Departamento *</Label>
                    <Select value={formData.departamento} onValueChange={(value) => setFormData({...formData, departamento: value})}>
                      <SelectTrigger className="h-10 sm:h-11">
                        <SelectValue placeholder="Seleccione departamento" />
                      </SelectTrigger>
                      <SelectContent>
                        {departamentos.map(dep => (
                          <SelectItem key={dep.id} value={dep.nombre}>
                            {dep.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="extension" className="text-sm">Extensión (ha) *</Label>
                    <Input
                      id="extension"
                      type="number"
                      value={formData.extension}
                      onChange={(e) => setFormData({...formData, extension: parseInt(e.target.value) || 0})}
                      placeholder="Ej: 10,000"
                      className="h-10 sm:h-11"
                      required
                    />
                  </div>
                  
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="ecosistema" className="text-sm">Ecosistema Principal *</Label>
                    <Select value={formData.ecosistema} onValueChange={(value) => setFormData({...formData, ecosistema: value})}>
                      <SelectTrigger className="h-10 sm:h-11">
                        <SelectValue placeholder="Seleccione ecosistema" />
                      </SelectTrigger>
                      <SelectContent>
                        {ecosistemas.map(eco => (
                          <SelectItem key={eco.id} value={eco.nombre}>
                            {eco.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1.5 sm:space-y-2 sm:col-span-2">
                    <Label htmlFor="descripcion" className="text-sm">Descripción Breve</Label>
                    <Input
                      id="descripcion"
                      value={formData.descripcion}
                      onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                      placeholder="Características clave del área"
                      className="h-10 sm:h-11"
                    />
                  </div>
                </div>
              </div>

              {/* Información de Geolocalización (Punto Central) */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0">
                    <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base">Punto Central (Coordenadas GPS)</h3>
                </div>
                
                <Alert className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 pl-4 sm:pl-10">
                    <Info className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <div className='pl-2'>
                        <AlertDescription className="text-red-800 dark:text-red-300 text-xs sm:text-sm">
                            Este punto central será guardado en la tabla *ubicacion* y vinculado al área.
                        </AlertDescription>
                    </div>
                </Alert>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pl-0 sm:pl-10">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="latitud" className="text-sm">Latitud *</Label>
                    <Input
                      id="latitud"
                      type="number"
                      step="0.000001"
                      value={formData.latitud}
                      onChange={(e) => setFormData({...formData, latitud: parseFloat(e.target.value) || 0})}
                      placeholder="Ej: 17.2300"
                      className="h-10 sm:h-11"
                      required
                    />
                  </div>
                  
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="longitud" className="text-sm">Longitud *</Label>
                    <Input
                      id="longitud"
                      type="number"
                      step="0.000001"
                      value={formData.longitud}
                      onChange={(e) => setFormData({...formData, longitud: parseFloat(e.target.value) || 0})}
                      placeholder="Ej: -89.6200"
                      className="h-10 sm:h-11"
                      required
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
                  {editingArea ? (
                    <>
                      <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                      Actualizar Área
                    </>
                  ) : (
                    <>
                      <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                      Crear Área
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


      {/* Tabla de Áreas Protegidas */}
      <Card>
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="overflow-x-auto -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Nombre y Categoría</TableHead>
                  <TableHead className="min-w-[100px] hidden sm:table-cell">Departamento</TableHead>
                  <TableHead className="min-w-[100px] hidden md:table-cell">Ecosistema</TableHead>
                  <TableHead className="min-w-[100px] hidden lg:table-cell">Extensión (ha)</TableHead>
                  <TableHead className="min-w-[90px] hidden xl:table-cell">Estado</TableHead>
                  <TableHead className="text-right min-w-[140px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAreas.map((area) => (
                  <TableRow key={area.id}>
                    <TableCell>
                      <div className="font-medium whitespace-nowrap">{area.nombre}</div>
                      <p className="text-xs text-muted-foreground">{area.categoria}</p>
                    </TableCell>
                    
                    <TableCell className="hidden sm:table-cell whitespace-nowrap">
                      {area.departamento}
                    </TableCell>
                    
                    <TableCell className="hidden md:table-cell whitespace-nowrap">
                       <Badge variant="outline" className="text-xs flex items-center w-fit">
                         <Mountain className="h-3 w-3 mr-1 text-cyan-600" />
                         {area.ecosistemas[0]}
                       </Badge>
                    </TableCell>
                    
                    <TableCell className="hidden lg:table-cell whitespace-nowrap">
                      {area.extension.toLocaleString()} ha
                    </TableCell>
                    
                    <TableCell className="hidden xl:table-cell">
                      <Badge className={getEstadoBadgeClass(area.estado)}>
                        {area.estado}
                      </Badge>
                    </TableCell>
                    
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {userPermissions.canEdit && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(area)}
                            title="Editar área"
                            className="flex-shrink-0"
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
                                title="Desactivar área"
                                className="flex-shrink-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Desactivar Área Protegida?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Está a punto de marcar "{area.nombre}" como Deshabilitada. El registro permanecerá, pero no podrá ser asignada a nuevas actividades.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteArea(area.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Desactivar
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
          
          {filteredAreas.length === 0 && (
            <div className="text-center py-8 sm:py-12 text-muted-foreground px-4">
              <MapPin className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 opacity-30" />
              <p className="text-sm sm:text-base">No se encontraron áreas protegidas que coincidan con los filtros</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}