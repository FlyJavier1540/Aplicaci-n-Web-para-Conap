import { useState, useMemo } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Plus, MapPin, Edit, Search, Globe, Trees, Shield, Map, CheckCircle2, XCircle, TreePine } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { AreaProtegida } from '../types';

interface AsignacionZonasProps {
  userPermissions: {
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
  };
}

export function AsignacionZonas({ userPermissions }: AsignacionZonasProps) {
  // Estados principales
  const [areasList, setAreasList] = useState(areasProtegidas);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState<string>('todas');
  const [selectedDepartamento, setSelectedDepartamento] = useState<string>('todos');
  
  // Estados para diálogo
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<AreaProtegida | null>(null);
  
  // Estados para confirmación de cambio de estado
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [areaToChange, setAreaToChange] = useState<AreaProtegida | null>(null);
  
  // Form data
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: 'Parque Nacional' as AreaProtegida['categoria'],
    departamento: '',
    extension: 0,
    fechaCreacion: new Date().toISOString().split('T')[0],
    coordenadas: { lat: 0, lng: 0 },
    descripcion: '',
    ecosistemas: ['Bosque Tropical Húmedo']
  });

  // Opciones
  const categorias = ['Parque Nacional', 'Reserva Biológica', 'Biotopo', 'Refugio de Vida Silvestre', 'Reserva Natural'];
  const ecosistemas = [
    'Bosque Tropical Húmedo',
    'Bosque Tropical Seco', 
    'Bosque Nublado',
    'Humedales',
    'Manglares',
    'Sabanas',
    'Bosque Mixto',
    'Matorral Volcánico',
    'Karst'
  ];
  const departamentos = [
    'Petén', 'Alta Verapaz', 'Baja Verapaz', 'Chimaltenango', 
    'Escuintla', 'Guatemala', 'Quetzaltenango', 'Huehuetenango',
    'Izabal', 'Jalapa', 'Jutiapa', 'Quiché', 'Retalhuleu',
    'Sacatepéquez', 'San Marcos', 'Santa Rosa', 'Sololá',
    'Suchitepéquez', 'Totonicapán', 'Zacapa', 'El Progreso', 'Chiquimula'
  ];

  // Filtros
  const filteredAreas = useMemo(() => {
    return areasList.filter(area => {
      const matchSearch = area.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         area.departamento.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         area.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategoria = selectedCategoria === 'todas' || area.categoria === selectedCategoria;
      const matchDepartamento = selectedDepartamento === 'todos' || area.departamento === selectedDepartamento;
      
      return matchSearch && matchCategoria && matchDepartamento;
    });
  }, [areasList, searchTerm, selectedCategoria, selectedDepartamento]);

  // Estadísticas
  const estadisticas = useMemo(() => {
    const porCategoria = categorias.reduce((acc, cat) => {
      acc[cat] = areasList.filter(a => a.categoria === cat).length;
      return acc;
    }, {} as Record<string, number>);

    const extensionTotal = areasList.reduce((sum, area) => sum + area.extension, 0);
    
    // Calcular departamentos únicos
    const departamentosUnicos = new Set(areasList.map(area => area.departamento));

    return {
      total: areasList.length,
      extensionTotal,
      porCategoria,
      categorias: Object.keys(porCategoria).filter(cat => porCategoria[cat] > 0),
      departamentos: departamentosUnicos.size
    };
  }, [areasList]);

  // Funciones de manejo
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingArea) {
      setAreasList(prev => prev.map(a => 
        a.id === editingArea.id 
          ? { ...a, ...formData, guardarecursos: a.guardarecursos }
          : a
      ));
    } else {
      // Al crear, usar estado Habilitado por defecto
      const nuevaArea: AreaProtegida = {
        id: Date.now().toString(),
        ...formData,
        estado: 'Habilitado',
        guardarecursos: []
      };
      setAreasList(prev => [...prev, nuevaArea]);
    }
    
    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      categoria: 'Parque Nacional',
      departamento: '',
      extension: 0,
      fechaCreacion: new Date().toISOString().split('T')[0],
      coordenadas: { lat: 0, lng: 0 },
      descripcion: '',
      ecosistemas: ['Bosque Tropical Húmedo']
    });
    setEditingArea(null);
  };

  const handleEdit = (area: AreaProtegida) => {
    setFormData({
      nombre: area.nombre,
      categoria: area.categoria,
      departamento: area.departamento,
      extension: area.extension,
      fechaCreacion: area.fechaCreacion,
      coordenadas: area.coordenadas,
      descripcion: area.descripcion,
      ecosistemas: area.ecosistemas
    });
    setEditingArea(area);
    setIsDialogOpen(true);
  };

  const handleEstadoClick = (area: AreaProtegida) => {
    setAreaToChange(area);
    setConfirmDialogOpen(true);
  };

  const confirmEstadoChange = () => {
    if (areaToChange) {
      const nuevoEstado: AreaProtegida['estado'] = 
        areaToChange.estado === 'Habilitado' ? 'Deshabilitado' : 'Habilitado';
      
      setAreasList(prev => prev.map(area =>
        area.id === areaToChange.id ? { ...area, estado: nuevoEstado } : area
      ));
    }
    setConfirmDialogOpen(false);
    setAreaToChange(null);
  };

  const getCategoriaColor = (categoria: string) => {
    const colors: Record<string, string> = {
      'Parque Nacional': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700',
      'Reserva Biológica': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-300 dark:border-blue-700',
      'Biotopo': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-300 dark:border-purple-700',
      'Refugio de Vida Silvestre': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-300 dark:border-amber-700',
      'Reserva Natural': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 border border-teal-300 dark:border-teal-700'
    };
    return colors[categoria] || 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400 border border-gray-300 dark:border-gray-700';
  };

  const getEstadoBadgeClass = (estado: string) => {
    switch (estado) {
      case 'Habilitado':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-300 dark:border-green-700';
      case 'Deshabilitado':
        return 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400 border border-gray-300 dark:border-gray-700';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400 border border-gray-300 dark:border-gray-700';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'Habilitado': return CheckCircle2;
      case 'Deshabilitado': return XCircle;
      default: return XCircle;
    }
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
              <div className="flex-1 w-full">
                <div className="relative h-10">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar áreas protegidas..."
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
                  Nueva Área Protegida
                </Button>
              )}
            </div>

            {/* Segunda fila: Filtros */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Filtro por categoría */}
              <Select value={selectedCategoria} onValueChange={setSelectedCategoria}>
                <SelectTrigger className="h-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las categorías</SelectItem>
                  {categorias.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Filtro por departamento */}
              <Select value={selectedDepartamento} onValueChange={setSelectedDepartamento}>
                <SelectTrigger className="h-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="Todos los departamentos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los departamentos</SelectItem>
                  {departamentos.map(dep => (
                    <SelectItem key={dep} value={dep}>{dep}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>

        {/* Diálogo para crear/editar área protegida */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="w-[95vw] sm:w-[90vw] max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader className="pb-3 sm:pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg flex-shrink-0">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <DialogTitle className="text-base sm:text-xl md:text-2xl truncate">
                    {editingArea ? 'Editar Área Protegida' : 'Nueva Área Protegida'}
                  </DialogTitle>
                  <DialogDescription className="text-xs sm:text-sm truncate">
                    Complete la información del área protegida
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 pt-3 sm:pt-4">
              {/* Información General */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base">Información General</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pl-0 sm:pl-10">
                  <div className="space-y-1.5 sm:space-y-2">
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
                    <Select 
                      value={formData.categoria} 
                      onValueChange={(value) => setFormData({...formData, categoria: value as AreaProtegida['categoria']})}
                    >
                      <SelectTrigger className="h-10 sm:h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categorias.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="departamento" className="text-sm">Departamento *</Label>
                    <Select 
                      value={formData.departamento} 
                      onValueChange={(value) => setFormData({...formData, departamento: value})}
                    >
                      <SelectTrigger className="h-10 sm:h-11">
                        <SelectValue placeholder="Seleccione departamento" />
                      </SelectTrigger>
                      <SelectContent>
                        {departamentos.map(dep => (
                          <SelectItem key={dep} value={dep}>{dep}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1.5 sm:space-y-2 sm:col-span-2">
                    <Label htmlFor="extension" className="text-sm">Extensión (hectáreas) *</Label>
                    <Input
                      id="extension"
                      type="number"
                      min="1"
                      value={formData.extension || ''}
                      onChange={(e) => setFormData({...formData, extension: parseInt(e.target.value) || 0})}
                      placeholder="57500"
                      className="h-10 sm:h-11"
                      required
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2 sm:col-span-2">
                    <Label htmlFor="descripcion" className="text-sm">Descripción *</Label>
                    <Textarea
                      id="descripcion"
                      value={formData.descripcion}
                      onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                      placeholder="Descripción del área protegida..."
                      rows={3}
                      className="resize-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Ubicación */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center flex-shrink-0">
                    <Map className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base">Ubicación Geográfica</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pl-0 sm:pl-10">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="lat" className="text-sm">Latitud *</Label>
                    <Input
                      id="lat"
                      type="number"
                      step="0.0001"
                      value={formData.coordenadas.lat || ''}
                      onChange={(e) => setFormData({
                        ...formData, 
                        coordenadas: { ...formData.coordenadas, lat: parseFloat(e.target.value) || 0 }
                      })}
                      placeholder="17.2328"
                      className="h-10 sm:h-11"
                      required
                    />
                  </div>
                  
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="lng" className="text-sm">Longitud *</Label>
                    <Input
                      id="lng"
                      type="number"
                      step="0.0001"
                      value={formData.coordenadas.lng || ''}
                      onChange={(e) => setFormData({
                        ...formData, 
                        coordenadas: { ...formData.coordenadas, lng: parseFloat(e.target.value) || 0 }
                      })}
                      placeholder="-89.6239"
                      className="h-10 sm:h-11"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Ecosistema */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0">
                    <TreePine className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base">Ecosistema</h3>
                </div>
                
                <div className="pl-0 sm:pl-10">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-sm">Ecosistema Principal *</Label>
                    <Select 
                      value={formData.ecosistemas[0]} 
                      onValueChange={(value) => setFormData({...formData, ecosistemas: [value]})}
                    >
                      <SelectTrigger className="h-10 sm:h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ecosistemas.map(eco => (
                          <SelectItem key={eco} value={eco}>{eco}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
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
                  {editingArea ? (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Actualizar Área
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Crear Área
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </Card>

      {/* Estadísticas responsive: arriba en móvil/tablet, sidebar en desktop */}
      <div className="lg:hidden mb-4">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <Card className="border-0 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 shadow-md">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col items-center justify-center gap-1.5 sm:gap-2">
                <Globe className="h-7 w-7 sm:h-9 sm:w-9 text-blue-700 dark:text-blue-300" />
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl text-blue-800 dark:text-blue-200 mb-0.5 sm:mb-1">{estadisticas.total}</p>
                  <p className="text-xs text-blue-700/80 dark:text-blue-300/80">Total Áreas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 shadow-md">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col items-center justify-center gap-1.5 sm:gap-2">
                <TreePine className="h-7 w-7 sm:h-9 sm:w-9 text-green-700 dark:text-green-300" />
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl text-green-800 dark:text-green-200 mb-0.5 sm:mb-1">
                    {(estadisticas.extensionTotal / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-xs text-green-700/80 dark:text-green-300/80">Hectáreas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-yellow-100 to-amber-200 dark:from-yellow-900/40 dark:to-amber-800/40 shadow-md">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col items-center justify-center gap-1.5 sm:gap-2">
                <MapPin className="h-7 w-7 sm:h-9 sm:w-9 text-yellow-700 dark:text-yellow-300" />
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl text-yellow-800 dark:text-yellow-200 mb-0.5 sm:mb-1">
                    {estadisticas.departamentos}
                  </p>
                  <p className="text-xs text-yellow-700/80 dark:text-yellow-300/80">Departamentos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Grid principal: Cards a la izquierda, Estadísticas a la derecha (solo desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Columna izquierda: Cards de áreas */}
        <div className="lg:col-span-11">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
            {filteredAreas.map((area) => (
              <Card key={area.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-4 sm:p-5">
                  {/* Header con nombre y acciones */}
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold mb-2 line-clamp-2 text-sm sm:text-base">{area.nombre}</h3>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        <Badge className={`${getCategoriaColor(area.categoria)} text-xs`}>
                          <Trees className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                          <span className="hidden sm:inline">{area.categoria}</span>
                          <span className="sm:hidden">{area.categoria.split(' ')[0]}</span>
                        </Badge>
                        <Badge className={`${getEstadoBadgeClass(area.estado)} text-xs`}>
                          {(() => {
                            const IconComponent = getEstadoIcon(area.estado);
                            return <IconComponent className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />;
                          })()}
                          {area.estado}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-1 ml-2 flex-shrink-0">
                      {userPermissions.canEdit && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(area)}
                          className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                        >
                          <Edit className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        </Button>
                      )}
                      {userPermissions.canDelete && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEstadoClick(area)}
                          className={`h-7 w-7 sm:h-8 sm:w-8 p-0 ${
                            area.estado === 'Habilitado'
                              ? 'text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950'
                              : 'text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950'
                          }`}
                          title={area.estado === 'Habilitado' ? 'Deshabilitar área' : 'Habilitar área'}
                        >
                          {area.estado === 'Habilitado' ? (
                            <XCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          ) : (
                            <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Información del área */}
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                      <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                      <span className="text-muted-foreground truncate">{area.departamento}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                      <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500 dark:text-green-400 flex-shrink-0" />
                      <span className="text-muted-foreground">
                        {area.extension.toLocaleString()} ha
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                      <TreePine className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                      <span className="text-muted-foreground truncate">{area.ecosistemas[0]}</span>
                    </div>

                    <div className="flex items-start gap-2 text-xs">
                      <Map className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-500 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                      <div className="text-muted-foreground">
                        <div className="truncate">Lat: {area.coordenadas.lat}</div>
                        <div className="truncate">Lng: {area.coordenadas.lng}</div>
                      </div>
                    </div>
                  </div>

                  {/* Descripción */}
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
                    {area.descripcion}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredAreas.length === 0 && (
            <Card className="col-span-full">
              <CardContent className="p-8 sm:p-12">
                <div className="text-center">
                  <MapPin className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-muted-foreground opacity-30" />
                  <h3 className="font-medium mb-2 text-sm sm:text-base">No se encontraron áreas protegidas</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Intente ajustar los filtros de búsqueda
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Columna derecha: Estadísticas (solo visible en desktop LG+) */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24 grid grid-cols-1 gap-2">
            <Card className="border-0 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 shadow-md">
              <CardContent className="p-4">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Globe className="h-10 w-10 text-blue-700 dark:text-blue-300" />
                  <div className="text-center">
                    <p className="text-3xl text-blue-800 dark:text-blue-200 mb-1">{estadisticas.total}</p>
                    <p className="text-xs text-blue-700/80 dark:text-blue-300/80">Total Áreas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 shadow-md">
              <CardContent className="p-4">
                <div className="flex flex-col items-center justify-center gap-2">
                  <TreePine className="h-10 w-10 text-green-700 dark:text-green-300" />
                  <div className="text-center">
                    <p className="text-3xl text-green-800 dark:text-green-200 mb-1">
                      {(estadisticas.extensionTotal / 1000000).toFixed(1)}M
                    </p>
                    <p className="text-xs text-green-700/80 dark:text-green-300/80">Hectáreas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-gradient-to-br from-yellow-100 to-amber-200 dark:from-yellow-900/40 dark:to-amber-800/40 shadow-md">
              <CardContent className="p-4">
                <div className="flex flex-col items-center justify-center gap-2">
                  <MapPin className="h-10 w-10 text-yellow-700 dark:text-yellow-300" />
                  <div className="text-center">
                    <p className="text-3xl text-yellow-800 dark:text-yellow-200 mb-1">
                      {estadisticas.departamentos}
                    </p>
                    <p className="text-xs text-yellow-700/80 dark:text-yellow-300/80">Departamentos</p>
                  </div>
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
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40 flex items-center justify-center flex-shrink-0">
                {areaToChange?.estado === 'Habilitado' ? (
                  <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
                )}
              </div>
              <span className="min-w-0">
                {areaToChange?.estado === 'Habilitado' 
                  ? 'Deshabilitar Área' 
                  : 'Habilitar Área'}
              </span>
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              {areaToChange?.estado === 'Habilitado' ? (
                <div className="space-y-2 text-xs sm:text-sm">
                  <p>¿Está seguro de que desea <strong className="text-orange-600 dark:text-orange-400">deshabilitar</strong> el área protegida <strong>"{areaToChange?.nombre}"</strong>?</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Al deshabilitar esta área, no estará disponible para asignaciones nuevas hasta que se vuelva a habilitar.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 text-xs sm:text-sm">
                  <p>¿Está seguro de que desea <strong className="text-green-600 dark:text-green-400">habilitar</strong> el área protegida <strong>"{areaToChange?.nombre}"</strong>?</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Al habilitar esta área, estará disponible nuevamente para asignaciones.
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmEstadoChange}
              className={`w-full sm:w-auto ${
                areaToChange?.estado === 'Habilitado'
                  ? 'bg-orange-600 hover:bg-orange-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {areaToChange?.estado === 'Habilitado' ? (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Deshabilitar
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Habilitar
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
