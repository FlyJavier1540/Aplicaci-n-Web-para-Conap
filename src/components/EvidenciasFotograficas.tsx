import { useState, useMemo } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Plus, Search, Camera, MapPin, Eye, Calendar, Download, Leaf, Bird, AlertTriangle, Package, FileText, Shield } from 'lucide-react';
import { evidenciasFotograficas, guardarecursos, actividades } from '../data/mock-data';
import { motion } from 'motion/react';

interface EvidenciasFotograficasProps {
  userPermissions?: {
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
  };
  currentUser?: any;
}

export function EvidenciasFotograficas({ userPermissions = { canView: true, canCreate: true, canEdit: true, canDelete: true }, currentUser }: EvidenciasFotograficasProps) {
  const [evidenciasList, setEvidenciasList] = useState([
    ...evidenciasFotograficas,
    {
      id: '3',
      url: '/evidencia/mantenimiento-1.jpg',
      descripcion: 'Reparación de sendero principal',
      coordenadas: { lat: 17.2365, lng: -89.6195 },
      fecha: '2024-10-08T10:30:00Z',
      tipo: 'Mantenimiento' as const,
      actividad: '1',
      guardarecurso: '1'
    },
    {
      id: '4',
      url: '/evidencia/flora-1.jpg',
      descripcion: 'Orquídea endémica encontrada en zona protegida',
      coordenadas: { lat: 17.2390, lng: -89.6205 },
      fecha: '2024-10-07T15:45:00Z',
      tipo: 'Flora' as const,
      actividad: '2',
      guardarecurso: '2'
    },
    {
      id: '5',
      url: '/evidencia/infraestructura-1.jpg',
      descripcion: 'Señalización dañada por vandalismo',
      coordenadas: { lat: 17.2375, lng: -89.6185 },
      fecha: '2024-10-07T08:15:00Z',
      tipo: 'Irregularidad' as const,
      actividad: '1',
      guardarecurso: '1'
    },
    {
      id: '6',
      url: '/evidencia/fauna-2.jpg',
      descripcion: 'Jaguar capturado por cámara trampa',
      coordenadas: { lat: 17.2455, lng: -89.6320 },
      fecha: '2024-10-06T03:20:00Z',
      tipo: 'Fauna' as const,
      actividad: '3',
      guardarecurso: '3'
    },
    {
      id: '7',
      url: '/evidencia/infraestructura-2.jpg',
      descripcion: 'Mirador renovado - antes y después',
      coordenadas: { lat: 17.2410, lng: -89.6150 },
      fecha: '2024-10-06T14:00:00Z',
      tipo: 'Infraestructura' as const,
      actividad: '4',
      guardarecurso: '4'
    },
    {
      id: '8',
      url: '/evidencia/irregularidad-1.jpg',
      descripcion: 'Tala ilegal detectada en sector norte',
      coordenadas: { lat: 17.2550, lng: -89.6400 },
      fecha: '2024-10-05T09:30:00Z',
      tipo: 'Irregularidad' as const,
      actividad: '5',
      guardarecurso: '5'
    },
    {
      id: '9',
      url: '/evidencia/flora-2.jpg',
      descripcion: 'Ceiba pentandra en floración',
      coordenadas: { lat: 17.2300, lng: -89.6100 },
      fecha: '2024-10-05T11:45:00Z',
      tipo: 'Flora' as const,
      actividad: '6',
      guardarecurso: '6'
    },
    {
      id: '10',
      url: '/evidencia/fauna-3.jpg',
      descripcion: 'Quetzal observado en zona de anidación',
      coordenadas: { lat: 17.2480, lng: -89.6280 },
      fecha: '2024-10-04T06:15:00Z',
      tipo: 'Fauna' as const,
      actividad: '2',
      guardarecurso: '7'
    },
    {
      id: '11',
      url: '/evidencia/mantenimiento-2.jpg',
      descripcion: 'Limpieza de senderos después de tormenta',
      coordenadas: { lat: 17.2340, lng: -89.6180 },
      fecha: '2024-10-04T13:20:00Z',
      tipo: 'Mantenimiento' as const,
      actividad: '1',
      guardarecurso: '8'
    },
    {
      id: '12',
      url: '/evidencia/otro-1.jpg',
      descripcion: 'Educación ambiental con comunidad local',
      coordenadas: { lat: 17.2260, lng: -89.6050 },
      fecha: '2024-10-03T10:00:00Z',
      tipo: 'Otro' as const,
      actividad: '3',
      guardarecurso: '9'
    },
    {
      id: '13',
      url: '/evidencia/fauna-4.jpg',
      descripcion: 'Grupo de monos aulladores en dosel',
      coordenadas: { lat: 17.2520, lng: -89.6350 },
      fecha: '2024-10-03T07:30:00Z',
      tipo: 'Fauna' as const,
      actividad: '2',
      guardarecurso: '10'
    },
    {
      id: '14',
      url: '/evidencia/irregularidad-2.jpg',
      descripcion: 'Residuos dejados por visitantes',
      coordenadas: { lat: 17.2380, lng: -89.6220 },
      fecha: '2024-10-02T16:45:00Z',
      tipo: 'Irregularidad' as const,
      actividad: '5',
      guardarecurso: '11'
    },
    {
      id: '15',
      url: '/evidencia/flora-3.jpg',
      descripcion: 'Bromelias epífitas en recuperación',
      coordenadas: { lat: 17.2420, lng: -89.6190 },
      fecha: '2024-10-02T12:15:00Z',
      tipo: 'Flora' as const,
      actividad: '6',
      guardarecurso: '12'
    },
    {
      id: '16',
      url: '/evidencia/infraestructura-3.jpg',
      descripcion: 'Nueva señalización instalada',
      coordenadas: { lat: 17.2290, lng: -89.6080 },
      fecha: '2024-10-01T15:30:00Z',
      tipo: 'Infraestructura' as const,
      actividad: '4',
      guardarecurso: '1'
    },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipo, setSelectedTipo] = useState<string>('todos');
  const [selectedGuardarecurso, setSelectedGuardarecurso] = useState<string>('todos');
  const [selectedDate, setSelectedDate] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedEvidencia, setSelectedEvidencia] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    descripcion: '',
    tipo: '',
    coordenadas: { lat: 0, lng: 0 },
    actividad: '',
    guardarecurso: '',
    observaciones: ''
  });

  // Determinar si el usuario actual es un guardarecurso
  const isGuardarecurso = currentUser?.rol === 'Guardarecurso';
  const currentGuardarecursoId = isGuardarecurso ? currentUser?.id : null;

  const filteredEvidencias = useMemo(() => {
    return evidenciasList.filter(e => {
      const matchesSearch = 
        e.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTipo = selectedTipo === 'todos' || e.tipo === selectedTipo;
      
      // Si es guardarecurso, filtrar solo sus evidencias
      const matchesGuardarecurso = isGuardarecurso 
        ? (e as any).guardarecurso === currentGuardarecursoId
        : selectedGuardarecurso === 'todos' || (e as any).guardarecurso === selectedGuardarecurso;
      
      const matchesDate = !selectedDate || e.fecha.split('T')[0] === selectedDate;
      
      return matchesSearch && matchesTipo && matchesGuardarecurso && matchesDate;
    });
  }, [evidenciasList, searchTerm, selectedTipo, selectedGuardarecurso, selectedDate, isGuardarecurso, currentGuardarecursoId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const nuevaEvidencia = {
      id: Date.now().toString(),
      url: '/evidencia/nueva-evidencia.jpg',
      ...formData,
      fecha: new Date().toISOString(),
      tipo: formData.tipo as any
    };
    
    setEvidenciasList(prev => [...prev, nuevaEvidencia]);
    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      descripcion: '',
      tipo: '',
      coordenadas: { lat: 0, lng: 0 },
      actividad: '',
      guardarecurso: '',
      observaciones: ''
    });
  };

  const handleView = (evidencia: any) => {
    setSelectedEvidencia(evidencia);
    setIsViewDialogOpen(true);
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Fauna': return { 
        bg: 'bg-green-100 dark:bg-green-900/30', 
        text: 'text-green-700 dark:text-green-300',
        badge: 'bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20',
        icon: Bird
      };
      case 'Flora': return { 
        bg: 'bg-emerald-100 dark:bg-emerald-900/30', 
        text: 'text-emerald-700 dark:text-emerald-300',
        badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
        icon: Leaf
      };
      case 'Infraestructura': return { 
        bg: 'bg-blue-100 dark:bg-blue-900/30', 
        text: 'text-blue-700 dark:text-blue-300',
        badge: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',
        icon: Package
      };
      case 'Irregularidad': return { 
        bg: 'bg-red-100 dark:bg-red-900/30', 
        text: 'text-red-700 dark:text-red-300',
        badge: 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20',
        icon: AlertTriangle
      };
      case 'Mantenimiento': return { 
        bg: 'bg-orange-100 dark:bg-orange-900/30', 
        text: 'text-orange-700 dark:text-orange-300',
        badge: 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20',
        icon: Package
      };
      default: return { 
        bg: 'bg-gray-100 dark:bg-gray-700', 
        text: 'text-gray-700 dark:text-gray-300',
        badge: 'bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-500/20',
        icon: FileText
      };
    }
  };

  const estadisticas = useMemo(() => {
    // Filtrar evidencias según el rol del usuario
    const evidenciasParaEstadisticas = isGuardarecurso 
      ? evidenciasList.filter(e => (e as any).guardarecurso === currentGuardarecursoId)
      : evidenciasList;
    
    return {
      total: evidenciasParaEstadisticas.length,
      fauna: evidenciasParaEstadisticas.filter(e => e.tipo === 'Fauna').length,
      flora: evidenciasParaEstadisticas.filter(e => e.tipo === 'Flora').length,
      irregularidades: evidenciasParaEstadisticas.filter(e => e.tipo === 'Irregularidad').length,
    };
  }, [evidenciasList, isGuardarecurso, currentGuardarecursoId]);

  const tiposEvidencia = ['Fauna', 'Flora', 'Infraestructura', 'Irregularidad', 'Mantenimiento', 'Otro'];

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda y controles con diseño mejorado */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-purple-950/20 dark:via-gray-900 dark:to-pink-950/20">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col gap-4">
            {/* Búsqueda mejorada */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <Search className="h-5 w-5 text-purple-500 dark:text-purple-400" />
              </div>
              <Input
                placeholder="Buscar por descripción, tipo o ubicación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200 dark:border-purple-800 focus:border-purple-400 dark:focus:border-purple-600 shadow-sm text-sm"
              />
            </div>

            {/* Filtros con diseño mejorado */}
            <div className={`grid grid-cols-1 gap-3 ${isGuardarecurso ? 'sm:grid-cols-2' : 'sm:grid-cols-3'}`}>
              {/* Filtro por tipo */}
              <Select value={selectedTipo} onValueChange={setSelectedTipo}>
                <SelectTrigger className="h-11 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-700 transition-colors shadow-sm">
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los tipos</SelectItem>
                  {tiposEvidencia.map(tipo => (
                    <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Filtro por guardarecurso - Solo visible para Administrador y Coordinador */}
              {!isGuardarecurso && (
                <Select value={selectedGuardarecurso} onValueChange={setSelectedGuardarecurso}>
                  <SelectTrigger className="h-11 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-700 transition-colors shadow-sm">
                    <SelectValue placeholder="Todos los guardarecursos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los guardarecursos</SelectItem>
                    {guardarecursos.map(g => (
                      <SelectItem key={g.id} value={g.id}>
                        {g.nombre} {g.apellido}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              
              {/* Filtro por fecha */}
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                placeholder="Filtrar por fecha"
                className="h-11 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200 dark:border-purple-800 focus:border-purple-400 dark:focus:border-purple-600 shadow-sm"
              />
            </div>
          </div>
        </CardContent>

        {/* Diálogo para crear evidencia */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="w-[95vw] sm:w-[90vw] max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader className="pb-3 sm:pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg flex-shrink-0">
                  <Camera className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <DialogTitle className="text-lg sm:text-2xl truncate">
                    Registrar Nueva Evidencia
                  </DialogTitle>
                  <DialogDescription className="text-xs sm:text-sm">
                    Suba y clasifique evidencia fotográfica de campo
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 pt-3 sm:pt-4">
              {/* Upload de fotografía */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 pb-1 sm:pb-2">
                  <Camera className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">Fotografía</h3>
                </div>
                
                <div>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 sm:p-8 text-center bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50">
                    <Camera className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-muted-foreground" />
                    <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                      Haga clic para seleccionar una fotografía o arrástrela aquí
                    </p>
                    <Button type="button" variant="outline" className="text-xs sm:text-sm">
                      <Camera className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                      Seleccionar Archivo
                    </Button>
                  </div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-2">
                    Formatos soportados: JPG, PNG. Máximo 10MB.
                  </p>
                </div>
              </div>

              {/* Separador */}
              <div className="border-b border-gray-200 dark:border-gray-700"></div>

              {/* Clasificación */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 pb-1 sm:pb-2">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">Clasificación</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tipo" className="flex items-center gap-2">
                      <Camera className="h-4 w-4 text-muted-foreground" />
                      Tipo de Evidencia
                    </Label>
                    <Select value={formData.tipo} onValueChange={(value) => setFormData({...formData, tipo: value})}>
                      <SelectTrigger className="h-10 border-gray-300 dark:border-gray-600">
                        <SelectValue placeholder="Seleccione tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {tiposEvidencia.map(tipo => (
                          <SelectItem key={tipo} value={tipo}>
                            {tipo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="actividad" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      Actividad Relacionada
                    </Label>
                    <Select value={formData.actividad} onValueChange={(value) => setFormData({...formData, actividad: value})}>
                      <SelectTrigger className="h-10 border-gray-300 dark:border-gray-600">
                        <SelectValue placeholder="Seleccione actividad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Ninguna</SelectItem>
                        {actividades.map(a => (
                          <SelectItem key={a.id} value={a.id}>
                            {a.tipo} - {a.fecha}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="descripcion" className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      Descripción
                    </Label>
                    <Textarea
                      id="descripcion"
                      value={formData.descripcion}
                      onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                      placeholder="Describa la evidencia fotográfica..."
                      rows={3}
                      required
                      className="resize-none border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                    />
                  </div>
                </div>
              </div>

              {/* Separador */}
              <div className="border-b border-gray-200 dark:border-gray-700"></div>

              {/* Ubicación */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 pb-1 sm:pb-2">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">Ubicación</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lat" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      Latitud
                    </Label>
                    <Input
                      id="lat"
                      type="number"
                      step="0.0001"
                      value={formData.coordenadas.lat || ''}
                      onChange={(e) => setFormData({
                        ...formData, 
                        coordenadas: { ...formData.coordenadas, lat: parseFloat(e.target.value) || 0 }
                      })}
                      placeholder="Ej: 17.2328"
                      className="h-10 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lng" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      Longitud
                    </Label>
                    <Input
                      id="lng"
                      type="number"
                      step="0.0001"
                      value={formData.coordenadas.lng || ''}
                      onChange={(e) => setFormData({
                        ...formData, 
                        coordenadas: { ...formData.coordenadas, lng: parseFloat(e.target.value) || 0 }
                      })}
                      placeholder="Ej: -89.6239"
                      className="h-10 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                    />
                  </div>
                </div>
              </div>

              {/* Separador */}
              <div className="border-b border-gray-200 dark:border-gray-700"></div>

              {/* Información adicional */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 pb-1 sm:pb-2">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">Información Adicional</h3>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="guardarecurso" className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      Guardarecurso
                    </Label>
                    <Select value={formData.guardarecurso} onValueChange={(value) => setFormData({...formData, guardarecurso: value})}>
                      <SelectTrigger className="h-10 border-gray-300 dark:border-gray-600">
                        <SelectValue placeholder="Seleccione guardarecurso" />
                      </SelectTrigger>
                      <SelectContent>
                        {guardarecursos.map(g => (
                          <SelectItem key={g.id} value={g.id}>
                            {g.nombre} {g.apellido}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="observaciones" className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      Observaciones Adicionales
                    </Label>
                    <Textarea
                      id="observaciones"
                      value={formData.observaciones}
                      onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                      placeholder="Observaciones adicionales sobre la evidencia..."
                      rows={3}
                      className="resize-none border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                    />
                  </div>
                </div>
              </div>
              
              {/* Footer con botones */}
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    resetForm();
                    setIsDialogOpen(false);
                  }}
                  className="w-full sm:w-auto sm:min-w-[100px]"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="w-full sm:w-auto sm:min-w-[100px] bg-gradient-to-r from-blue-600 to-cyan-700 hover:from-blue-700 hover:to-cyan-800"
                >
                  Guardar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </Card>

      {/* Estadísticas responsive: arriba en móvil/tablet, sidebar en desktop */}
      <div className="lg:hidden mb-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="border-0 bg-gradient-to-br from-purple-100 via-purple-200 to-pink-200 dark:from-purple-900/50 dark:via-purple-800/50 dark:to-pink-800/50 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col items-center justify-center gap-1.5 sm:gap-2">
                  <Camera className="h-7 w-7 sm:h-9 sm:w-9 text-purple-700 dark:text-purple-300" />
                  <p className="text-2xl sm:text-3xl text-purple-800 dark:text-purple-200">{estadisticas.total}</p>
                  <p className="text-xs sm:text-sm text-purple-700/90 dark:text-purple-300/90 text-center leading-tight">Total</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            <Card className="border-0 bg-gradient-to-br from-green-100 via-green-200 to-emerald-200 dark:from-green-900/50 dark:via-green-800/50 dark:to-emerald-800/50 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col items-center justify-center gap-1.5 sm:gap-2">
                  <Bird className="h-7 w-7 sm:h-9 sm:w-9 text-green-700 dark:text-green-300" />
                  <p className="text-2xl sm:text-3xl text-green-800 dark:text-green-200">{estadisticas.fauna}</p>
                  <p className="text-xs sm:text-sm text-green-700/90 dark:text-green-300/90 text-center leading-tight">Fauna</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="border-0 bg-gradient-to-br from-emerald-100 via-emerald-200 to-teal-200 dark:from-emerald-900/50 dark:via-emerald-800/50 dark:to-teal-800/50 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col items-center justify-center gap-1.5 sm:gap-2">
                  <Leaf className="h-7 w-7 sm:h-9 sm:w-9 text-emerald-700 dark:text-emerald-300" />
                  <p className="text-2xl sm:text-3xl text-emerald-800 dark:text-emerald-200">{estadisticas.flora}</p>
                  <p className="text-xs sm:text-sm text-emerald-700/90 dark:text-emerald-300/90 text-center leading-tight">Flora</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
          >
            <Card className="border-0 bg-gradient-to-br from-red-100 via-red-200 to-orange-200 dark:from-red-900/50 dark:via-red-800/50 dark:to-orange-800/50 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col items-center justify-center gap-1.5 sm:gap-2">
                  <AlertTriangle className="h-7 w-7 sm:h-9 sm:w-9 text-red-700 dark:text-red-300" />
                  <p className="text-2xl sm:text-3xl text-red-800 dark:text-red-200">{estadisticas.irregularidades}</p>
                  <p className="text-xs sm:text-sm text-red-700/90 dark:text-red-300/90 text-center leading-tight">Irregularidades</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Grid principal: Galería a la izquierda, Estadísticas a la derecha (solo desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Columna izquierda: Galería de evidencias */}
        <div className="lg:col-span-11">
          {filteredEvidencias.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-purple-950/20 dark:via-gray-900 dark:to-pink-950/20">
                <CardContent className="p-12 sm:p-16">
                  <div className="text-center">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1
                      }}
                      className="mb-6"
                    >
                      <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
                        <Camera className="h-16 w-16 sm:h-20 sm:w-20 text-purple-500 dark:text-purple-400" />
                      </div>
                    </motion.div>
                    <h3 className="mb-3 text-lg sm:text-xl">No se encontraron evidencias</h3>
                    <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-md mx-auto">
                      No hay evidencias fotográficas que coincidan con los filtros seleccionados
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedTipo('todos');
                        if (!isGuardarecurso) {
                          setSelectedGuardarecurso('todos');
                        }
                        setSelectedDate('');
                      }}
                      className="text-sm sm:text-base bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30"
                    >
                      Limpiar filtros
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
              {filteredEvidencias.map((evidencia, index) => {
                const guardarecurso = guardarecursos.find(g => g.id === (evidencia as any).guardarecurso);
                const actividad = actividades.find(a => a.id === (evidencia as any).actividad);
                const tipoColor = getTipoColor(evidencia.tipo);
                const TipoIcon = tipoColor.icon;
                
                return (
                  <motion.div
                    key={evidencia.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ y: -4 }}
                  >
                    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                      {/* Imagen placeholder con gradiente mejorado */}
                      <div className={`aspect-square ${tipoColor.bg} flex items-center justify-center relative group cursor-pointer overflow-hidden`}
                           onClick={() => handleView(evidencia)}>
                        {/* Efecto de brillo en hover */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/30 dark:from-white/0 dark:via-white/5 dark:to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Ícono de cámara */}
                        <div className="relative z-10">
                          <Camera className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        
                        {/* Badge de tipo mejorado */}
                        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-20">
                          <Badge variant="outline" className={`${tipoColor.badge} text-[10px] sm:text-xs shadow-lg backdrop-blur-sm border-2`}>
                            <TipoIcon className="h-3 w-3 mr-1" />
                            {evidencia.tipo}
                          </Badge>
                        </div>
                        
                        {/* Overlay de hover mejorado */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileHover={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-full p-3 shadow-xl"
                          >
                            <Eye className="h-6 w-6 sm:h-7 sm:w-7 text-purple-600 dark:text-purple-400" />
                          </motion.div>
                        </div>
                      </div>

                      <CardContent className="p-4 sm:p-5 bg-gradient-to-b from-white/50 to-transparent dark:from-gray-800/50 dark:to-transparent">
                        <h4 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4 line-clamp-2 min-h-[40px] sm:min-h-[48px] text-gray-900 dark:text-white">
                          {evidencia.descripcion}
                        </h4>
                        
                        <div className="space-y-2 sm:space-y-2.5">
                          {/* Ubicación */}
                          {evidencia.coordenadas && (
                            <div className="flex items-start gap-2 sm:gap-2.5">
                              <div className="p-1 rounded-md bg-purple-100 dark:bg-purple-900/30">
                                <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600 dark:text-purple-400" />
                              </div>
                              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 pt-0.5">
                                {evidencia.coordenadas.lat.toFixed(4)}, {evidencia.coordenadas.lng.toFixed(4)}
                              </span>
                            </div>
                          )}
                          
                          {/* Fecha */}
                          <div className="flex items-start gap-2 sm:gap-2.5">
                            <div className="p-1 rounded-md bg-blue-100 dark:bg-blue-900/30">
                              <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 pt-0.5">
                              {new Date(evidencia.fecha).toLocaleDateString('es-GT', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          
                          {/* Guardarecurso */}
                          {guardarecurso && (
                            <div className="flex items-start gap-2 sm:gap-2.5">
                              <div className="p-1 rounded-md bg-green-100 dark:bg-green-900/30">
                                <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 dark:text-green-400" />
                              </div>
                              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate pt-0.5">
                                {guardarecurso.nombre} {guardarecurso.apellido}
                              </span>
                            </div>
                          )}
                          
                          {/* Actividad */}
                          {actividad && (
                            <div className="flex items-start gap-2 sm:gap-2.5">
                              <div className="p-1 rounded-md bg-orange-100 dark:bg-orange-900/30">
                                <TipoIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-600 dark:text-orange-400" />
                              </div>
                              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate pt-0.5">
                                {actividad.tipo}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2 mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                          <Button
                            size="sm"
                            className="flex-1 text-xs sm:text-sm h-9 sm:h-10 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-md hover:shadow-lg transition-all"
                            onClick={() => handleView(evidencia)}
                          >
                            <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
                            Ver Detalles
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-9 sm:h-10 px-3 sm:px-4 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:border-purple-300 dark:hover:border-purple-700 transition-all"
                          >
                            <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </Button>
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
          <div className="sticky top-24 grid grid-cols-1 gap-3">
            <Card className="border-0 bg-gradient-to-br from-purple-100 via-purple-200 to-pink-200 dark:from-purple-900/50 dark:via-purple-800/50 dark:to-pink-800/50 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-3">
                <div className="flex flex-col items-center justify-center gap-1">
                  <Camera className="h-6 w-6 text-purple-700 dark:text-purple-300" />
                  <p className="text-2xl text-purple-800 dark:text-purple-200">{estadisticas.total}</p>
                  <p className="text-[11px] text-purple-700/90 dark:text-purple-300/90 text-center leading-tight">Total</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-gradient-to-br from-green-100 via-green-200 to-emerald-200 dark:from-green-900/50 dark:via-green-800/50 dark:to-emerald-800/50 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-3">
                <div className="flex flex-col items-center justify-center gap-1">
                  <Bird className="h-6 w-6 text-green-700 dark:text-green-300" />
                  <p className="text-2xl text-green-800 dark:text-green-200">{estadisticas.fauna}</p>
                  <p className="text-[11px] text-green-700/90 dark:text-green-300/90 text-center leading-tight">Fauna</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-gradient-to-br from-emerald-100 via-emerald-200 to-teal-200 dark:from-emerald-900/50 dark:via-emerald-800/50 dark:to-teal-800/50 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-3">
                <div className="flex flex-col items-center justify-center gap-1">
                  <Leaf className="h-6 w-6 text-emerald-700 dark:text-emerald-300" />
                  <p className="text-2xl text-emerald-800 dark:text-emerald-200">{estadisticas.flora}</p>
                  <p className="text-[11px] text-emerald-700/90 dark:text-emerald-300/90 text-center leading-tight">Flora</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-gradient-to-br from-red-100 via-red-200 to-orange-200 dark:from-red-900/50 dark:via-red-800/50 dark:to-orange-800/50 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-3">
                <div className="flex flex-col items-center justify-center gap-1">
                  <AlertTriangle className="h-6 w-6 text-red-700 dark:text-red-300" />
                  <p className="text-2xl text-red-800 dark:text-red-200">{estadisticas.irregularidades}</p>
                  <p className="text-[11px] text-red-700/90 dark:text-red-300/90 text-center leading-tight">Irregularidades</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialog para ver evidencia detallada */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="w-[95vw] sm:w-[90vw] max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40 flex items-center justify-center flex-shrink-0">
                <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="truncate">Detalle de Evidencia Fotográfica</span>
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Vista detallada de la evidencia seleccionada
            </DialogDescription>
          </DialogHeader>
          
          {selectedEvidencia && (() => {
            const tipoColor = getTipoColor(selectedEvidencia.tipo);
            const TipoIcon = tipoColor.icon;
            const guardarecurso = guardarecursos.find(g => g.id === selectedEvidencia.guardarecurso);
            const actividad = actividades.find(a => a.id === selectedEvidencia.actividad);
            
            return (
              <div className="space-y-4 sm:space-y-6">
                {/* Imagen grande */}
                <div className={`aspect-video ${tipoColor.bg} flex items-center justify-center rounded-lg relative`}>
                  <Camera className="h-16 w-16 sm:h-24 sm:w-24 text-muted-foreground" />
                  <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
                    <Badge variant="outline" className={`${tipoColor.badge} shadow-md text-xs`}>
                      <TipoIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                      {selectedEvidencia.tipo}
                    </Badge>
                  </div>
                </div>
                
                {/* Información */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <Label className="text-muted-foreground text-xs sm:text-sm">Descripción</Label>
                      <p className="mt-1 text-sm sm:text-base">{selectedEvidencia.descripcion}</p>
                    </div>

                    <div>
                      <Label className="text-muted-foreground text-xs sm:text-sm">Fecha y Hora</Label>
                      <p className="mt-1 text-sm sm:text-base">
                        {new Date(selectedEvidencia.fecha).toLocaleDateString('es-GT', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>

                    {guardarecurso && (
                      <div>
                        <Label className="text-muted-foreground text-xs sm:text-sm">Registrado por</Label>
                        <div className="mt-1 flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                            <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-sm sm:text-base truncate">{guardarecurso.nombre} {guardarecurso.apellido}</p>
                            <p className="text-xs sm:text-sm text-muted-foreground truncate">{guardarecurso.puesto}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    {selectedEvidencia.coordenadas && (
                      <div>
                        <Label className="text-muted-foreground text-xs sm:text-sm">Ubicación GPS</Label>
                        <div className="mt-1 space-y-1">
                          <p className="text-xs sm:text-sm">
                            <span className="font-medium">Latitud:</span> {selectedEvidencia.coordenadas.lat}
                          </p>
                          <p className="text-xs sm:text-sm">
                            <span className="font-medium">Longitud:</span> {selectedEvidencia.coordenadas.lng}
                          </p>
                        </div>
                      </div>
                    )}

                    {actividad && (
                      <div>
                        <Label className="text-muted-foreground text-xs sm:text-sm">Actividad Relacionada</Label>
                        <div className="mt-1">
                          <p className="font-medium text-sm sm:text-base">{actividad.tipo}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">{actividad.descripcion}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t">
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                    Descargar
                  </Button>
                  <Button onClick={() => setIsViewDialogOpen(false)} className="w-full sm:w-auto">
                    Cerrar
                  </Button>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}