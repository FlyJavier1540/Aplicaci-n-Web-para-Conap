import { useState, useMemo, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Search, Clock, MapPin, Camera, AlertTriangle, Activity, CheckCircle, Play, Calendar, X, Plus, Trash2, MapPinned, FileText, Image as ImageIcon, Pause, StopCircle, Binoculars, Wrench, GraduationCap, Eye, Map, Search as SearchIcon, Upload } from 'lucide-react';
import { actividades, guardarecursos } from '../data/mock-data';
import { motion, AnimatePresence } from 'motion/react';
import { actividadesSync } from '../utils/actividadesSync';
import { Hallazgo, EvidenciaFotografica } from '../types';

interface RegistroDiarioProps {
  userPermissions: {
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
  };
  currentUser?: any;
}

interface HallazgoFormData {
  tipo: 'Ambiental' | 'Irregularidad' | 'Fauna' | 'Flora' | 'Infraestructura';
  titulo: string;
  descripcion: string;
  gravedad: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  latitud: string;
  longitud: string;
  fotografias: Array<{ url: string; descripcion: string; tipoEvidencia: string; }>;
}

interface EvidenciaFormData {
  url: string;
  descripcion: string;
  tipo: 'Fauna' | 'Flora' | 'Infraestructura' | 'Irregularidad' | 'Mantenimiento' | 'Otro';
}

export function RegistroDiario({ userPermissions, currentUser }: RegistroDiarioProps) {
  const [actividadesList, setActividadesList] = useState(actividades);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipo, setSelectedTipo] = useState<string>('todos');
  const [selectedEstado, setSelectedEstado] = useState<string>('todos');
  const [selectedGuardarecurso, setSelectedGuardarecurso] = useState<string>('todos');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Modales
  const [isPatrullajeDialogOpen, setIsPatrullajeDialogOpen] = useState(false);
  const [isCompletarDialogOpen, setIsCompletarDialogOpen] = useState(false);
  const [isAddHallazgoOpen, setIsAddHallazgoOpen] = useState(false);
  const [isAddEvidenciaOpen, setIsAddEvidenciaOpen] = useState(false);
  const [isReportarHallazgoIndependienteOpen, setIsReportarHallazgoIndependienteOpen] = useState(false);
  
  const [actividadActiva, setActividadActiva] = useState<any>(null);
  const [selectedActividad, setSelectedActividad] = useState<any>(null);
  
  // Hallazgos independientes (no vinculados a actividades)
  const [hallazgosIndependientes, setHallazgosIndependientes] = useState<Hallazgo[]>([]);
  
  // Formularios
  const [hallazgoForm, setHallazgoForm] = useState<HallazgoFormData>({
    tipo: 'Ambiental',
    titulo: '',
    descripcion: '',
    gravedad: 'Media',
    latitud: '',
    longitud: '',
    fotografias: []
  });

  const [fotoTemp, setFotoTemp] = useState({ url: '', descripcion: '', tipoEvidencia: 'Fauna' });
  const [fotoPendiente, setFotoPendiente] = useState<{ url: string; nombre: string } | null>(null);
  const [isEditandoFoto, setIsEditandoFoto] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [evidenciaForm, setEvidenciaForm] = useState<EvidenciaFormData>({
    url: '',
    descripcion: '',
    tipo: 'Otro'
  });

  const [hallazgosTemporales, setHallazgosTemporales] = useState<Hallazgo[]>([]);
  const [evidenciasTemporales, setEvidenciasTemporales] = useState<EvidenciaFotografica[]>([]);
  const [observacionesFinal, setObservacionesFinal] = useState('');

  // Suscribirse a cambios en actividades
  useEffect(() => {
    const unsubscribe = actividadesSync.subscribe((actividades) => {
      setActividadesList(actividades);
      // Actualizar actividad activa si existe
      if (actividadActiva) {
        const actividadActualizada = actividades.find(a => a.id === actividadActiva.id);
        if (actividadActualizada) {
          setActividadActiva(actividadActualizada);
        }
      }
    });

    return unsubscribe;
  }, [actividadActiva]);

  // Determinar si el usuario actual es un guardarecurso
  const isGuardarecurso = currentUser?.rol === 'Guardarecurso';
  const currentGuardarecursoId = isGuardarecurso ? currentUser?.id : null;

  const tiposActividad = [
    'Patrullaje de Control y Vigilancia',
    'Actividades de Prevención y Atención de Incendios Forestales',
    'Mantenimiento de Área Protegida',
    'Reforestación de Área Protegida',
    'Mantenimiento de Reforestación'
  ];

  const actividadesFiltradas = useMemo(() => {
    let filtered = actividadesList;

    // Filtrar por fecha
    filtered = filtered.filter(a => a.fecha === selectedDate);
    
    // Si es guardarecurso, filtrar solo sus actividades
    if (isGuardarecurso && currentGuardarecursoId) {
      filtered = filtered.filter(a => a.guardarecurso === currentGuardarecursoId);
    }

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(a => {
        const guardarecurso = guardarecursos.find(g => g.id === a.guardarecurso);
        return (
          a.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.ubicacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (guardarecurso && `${guardarecurso.nombre} ${guardarecurso.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      });
    }

    // Filtrar por tipo
    if (selectedTipo !== 'todos') {
      filtered = filtered.filter(a => a.tipo === selectedTipo);
    }

    // Filtrar por estado
    if (selectedEstado !== 'todos') {
      filtered = filtered.filter(a => a.estado === selectedEstado);
    }

    // Filtrar por guardarecurso (solo para admin/coordinador)
    if (!isGuardarecurso && selectedGuardarecurso !== 'todos') {
      filtered = filtered.filter(a => a.guardarecurso === selectedGuardarecurso);
    }

    return filtered;
  }, [actividadesList, selectedDate, searchTerm, selectedTipo, selectedEstado, selectedGuardarecurso, isGuardarecurso, currentGuardarecursoId]);

  const handleIniciarActividad = (actividad: any) => {
    const now = new Date();
    const horaActual = now.toTimeString().slice(0, 5);
    
    // Actualizar estado a "En Progreso"
    actividadesSync.updateActividad(actividad.id, {
      estado: 'En Progreso',
      horaInicio: horaActual
    });

    // Si es patrullaje, abrir modal especial que no se puede cerrar
    if (actividad.tipo === 'Patrullaje' || actividad.tipo === 'Patrullaje de Control y Vigilancia') {
      const actividadActualizada = { ...actividad, estado: 'En Progreso', horaInicio: horaActual };
      setActividadActiva(actividadActualizada);
      setHallazgosTemporales([]);
      setEvidenciasTemporales([]);
      setObservacionesFinal('');
      // Resetear formulario de hallazgos
      setHallazgoForm({
        tipo: 'Ambiental',
        titulo: '',
        descripcion: '',
        gravedad: 'Baja',
        latitud: '',
        longitud: '',
        fotografias: []
      });
      setIsPatrullajeDialogOpen(true);
    }
  };

  const handleCompletarActividad = (actividad: any) => {
    setSelectedActividad(actividad);
    setObservacionesFinal(actividad.observaciones || '');
    setHallazgosTemporales(actividad.hallazgos || []);
    setEvidenciasTemporales(actividad.evidencias || []);
    setIsCompletarDialogOpen(true);
  };

  const handleFinalizarActividad = () => {
    if (selectedActividad) {
      const now = new Date();
      const horaActual = now.toTimeString().slice(0, 5);

      actividadesSync.updateActividad(selectedActividad.id, {
        estado: 'Completada',
        horaFin: horaActual,
        observaciones: observacionesFinal,
        hallazgos: hallazgosTemporales,
        evidencias: evidenciasTemporales
      });

      setIsCompletarDialogOpen(false);
      setSelectedActividad(null);
      setObservacionesFinal('');
      setHallazgosTemporales([]);
      setEvidenciasTemporales([]);
    }
  };

  const handleCompletarPatrullaje = () => {
    if (actividadActiva) {
      const now = new Date();
      const horaActual = now.toTimeString().slice(0, 5);

      actividadesSync.updateActividad(actividadActiva.id, {
        estado: 'Completada',
        horaFin: horaActual,
        observaciones: observacionesFinal,
        hallazgos: hallazgosTemporales,
        evidencias: evidenciasTemporales
      });

      setIsPatrullajeDialogOpen(false);
      setActividadActiva(null);
      setObservacionesFinal('');
      setHallazgosTemporales([]);
      setEvidenciasTemporales([]);
    }
  };

  const handleAgregarHallazgo = () => {
    if (!hallazgoForm.titulo || !hallazgoForm.descripcion) return;

    // Convertir fotografías del formulario a evidencias
    const evidencias = hallazgoForm.fotografias.map((foto, index) => ({
      id: `evidencia-${Date.now()}-${index}`,
      url: foto.url,
      descripcion: foto.descripcion || '',
      fecha: new Date().toISOString(),
      tipo: 'Hallazgo' as const
    }));

    const nuevoHallazgo: Hallazgo = {
      id: `hallazgo-${Date.now()}`,
      tipo: hallazgoForm.tipo,
      titulo: hallazgoForm.titulo,
      descripcion: hallazgoForm.descripcion,
      ubicacion: actividadActiva?.ubicacion || selectedActividad?.ubicacion || '',
      coordenadas: {
        lat: hallazgoForm.latitud ? parseFloat(hallazgoForm.latitud) : 0,
        lng: hallazgoForm.longitud ? parseFloat(hallazgoForm.longitud) : 0
      },
      fecha: new Date().toISOString(),
      guardarecurso: currentUser?.id || '',
      gravedad: hallazgoForm.gravedad,
      estado: 'Reportado',
      evidencias: evidencias,
      seguimientos: []
    };

    setHallazgosTemporales([...hallazgosTemporales, nuevoHallazgo]);
    
    // Limpiar formulario
    setHallazgoForm({
      tipo: 'Ambiental',
      titulo: '',
      descripcion: '',
      gravedad: 'Baja',
      latitud: '',
      longitud: '',
      fotografias: []
    });
    setFotoTemp({ url: '', descripcion: '' });
    setIsAddHallazgoOpen(false);
  };

  const handleReportarHallazgoIndependiente = () => {
    if (!hallazgoForm.titulo || !hallazgoForm.descripcion) return;

    const nuevoHallazgo: Hallazgo = {
      id: `hallazgo-ind-${Date.now()}`,
      tipo: hallazgoForm.tipo,
      titulo: hallazgoForm.titulo,
      descripcion: hallazgoForm.descripcion,
      ubicacion: hallazgoForm.latitud && hallazgoForm.longitud 
        ? `Lat: ${hallazgoForm.latitud}, Lng: ${hallazgoForm.longitud}` 
        : 'Ubicación no especificada',
      coordenadas: {
        lat: hallazgoForm.latitud ? parseFloat(hallazgoForm.latitud) : 0,
        lng: hallazgoForm.longitud ? parseFloat(hallazgoForm.longitud) : 0
      },
      fecha: new Date().toISOString(),
      guardarecurso: currentUser?.id || '',
      gravedad: hallazgoForm.gravedad,
      estado: 'Reportado',
      evidencias: hallazgoForm.fotografias || [],
      seguimientos: []
    };

    setHallazgosIndependientes([...hallazgosIndependientes, nuevoHallazgo]);
    setHallazgoForm({
      tipo: 'Ambiental',
      titulo: '',
      descripcion: '',
      gravedad: 'Media',
      latitud: '',
      longitud: '',
      fotografias: []
    });
    setFotoTemp({ url: '', descripcion: '' });
    setIsReportarHallazgoIndependienteOpen(false);
  };

  const handleAgregarEvidencia = () => {
    if (!evidenciaForm.url) return;

    const nuevaEvidencia: EvidenciaFotografica = {
      id: `evidencia-${Date.now()}`,
      url: evidenciaForm.url,
      descripcion: evidenciaForm.descripcion,
      fecha: new Date().toISOString(),
      tipo: evidenciaForm.tipo
    };

    setEvidenciasTemporales([...evidenciasTemporales, nuevaEvidencia]);
    
    setEvidenciaForm({
      url: '',
      descripcion: '',
      tipo: 'Otro'
    });
    setIsAddEvidenciaOpen(false);
  };

  // Manejadores de Drag & Drop para fotografías
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    // Procesar cada archivo uno por uno
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const url = e.target?.result as string;
          // Abrir modal para editar descripción y tipo
          setFotoPendiente({ url, nombre: file.name });
          setFotoTemp({ url: '', descripcion: '', tipoEvidencia: 'Fauna' });
          setIsEditandoFoto(true);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleGuardarFoto = () => {
    if (fotoPendiente) {
      setHallazgoForm({
        ...hallazgoForm,
        fotografias: [...hallazgoForm.fotografias, { 
          url: fotoPendiente.url, 
          descripcion: fotoTemp.descripcion || fotoPendiente.nombre,
          tipoEvidencia: fotoTemp.tipoEvidencia
        }]
      });
      setFotoPendiente(null);
      setFotoTemp({ url: '', descripcion: '', tipoEvidencia: 'Fauna' });
      setIsEditandoFoto(false);
    }
  };

  const handleEliminarHallazgo = (id: string) => {
    setHallazgosTemporales(hallazgosTemporales.filter(h => h.id !== id));
  };

  const handleEliminarEvidencia = (id: string) => {
    setEvidenciasTemporales(evidenciasTemporales.filter(e => e.id !== id));
  };

  const getEstadoInfo = (estado: string) => {
    switch (estado) {
      case 'Programada': return { 
        icon: Clock, 
        color: 'text-blue-600 dark:text-blue-400', 
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        badge: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20'
      };
      case 'En Progreso': return { 
        icon: Play, 
        color: 'text-yellow-600 dark:text-yellow-400', 
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        badge: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border-yellow-500/20'
      };
      case 'Completada': return { 
        icon: CheckCircle, 
        color: 'text-green-600 dark:text-green-400', 
        bg: 'bg-green-100 dark:bg-green-900/30',
        badge: 'bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20'
      };
      default: return { 
        icon: AlertTriangle, 
        color: 'text-gray-600 dark:text-gray-400', 
        bg: 'bg-gray-100 dark:bg-gray-700',
        badge: 'bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-500/20'
      };
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Patrullaje': return { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300' };
      case 'Mantenimiento': return { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300' };
      case 'Educación Ambiental': return { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300' };
      case 'Investigación': return { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300' };
      case 'Control y Vigilancia': return { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300' };
      case 'Ronda': return { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300' };
      default: return { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-700 dark:text-gray-300' };
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'Patrullaje': return Binoculars;
      case 'Mantenimiento': return Wrench;
      case 'Educación Ambiental': return GraduationCap;
      case 'Investigación': return SearchIcon;
      case 'Control y Vigilancia': return Eye;
      case 'Ronda': return Map;
      default: return Activity;
    }
  };

  const estadisticas = useMemo(() => {
    const actividadesParaEstadisticas = isGuardarecurso 
      ? actividadesFiltradas.filter(a => a.guardarecurso === currentGuardarecursoId)
      : actividadesFiltradas;
    
    return {
      programadas: actividadesParaEstadisticas.filter(a => a.estado === 'Programada').length,
      enProgreso: actividadesParaEstadisticas.filter(a => a.estado === 'En Progreso').length,
      completadas: actividadesParaEstadisticas.filter(a => a.estado === 'Completada').length,
      total: actividadesParaEstadisticas.length
    };
  }, [actividadesFiltradas, isGuardarecurso, currentGuardarecursoId]);

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda y filtros */}
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col gap-3">
            {/* Primera fila: Búsqueda y Botón de Acción */}
            <div className="flex gap-3">
              <div className="flex-1">
                <div className="relative h-10">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar actividades..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  />
                </div>
              </div>
              
              {/* Botón de acción rápida */}
              {userPermissions.canCreate && (
                <Button
                  onClick={() => setIsReportarHallazgoIndependienteOpen(true)}
                  variant="outline"
                  size="sm"
                  className="h-10 px-3 border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-950/20"
                >
                  <AlertTriangle className="h-4 w-4 mr-2 text-orange-600" />
                  <span className="hidden sm:inline">Hallazgo</span>
                </Button>
              )}
              
              {/* Selector de fecha para Guardarecursos */}
              {isGuardarecurso && (
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="h-10 w-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                />
              )}
            </div>

            {/* Segunda fila: Filtros - Solo para Admin/Coordinador */}
            {!isGuardarecurso && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Filtro por tipo */}
                <Select value={selectedTipo} onValueChange={setSelectedTipo}>
                  <SelectTrigger className="h-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <SelectValue placeholder="Tipo de actividad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los tipos</SelectItem>
                    {tiposActividad.map(tipo => (
                      <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Filtro por estado */}
                <Select value={selectedEstado} onValueChange={setSelectedEstado}>
                  <SelectTrigger className="h-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los estados</SelectItem>
                    <SelectItem value="Programada">Programada</SelectItem>
                    <SelectItem value="En Progreso">En Progreso</SelectItem>
                    <SelectItem value="Completada">Completada</SelectItem>
                  </SelectContent>
                </Select>

                {/* Filtro por guardarecurso */}
                <Select value={selectedGuardarecurso} onValueChange={setSelectedGuardarecurso}>
                  <SelectTrigger className="h-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <SelectValue placeholder="Guardarecurso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {guardarecursos.map(g => (
                      <SelectItem key={g.id} value={g.id}>
                        {g.nombre} {g.apellido}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Selector de fecha */}
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="h-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas responsive */}
      <div className="lg:hidden">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <Card className="border-0 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 shadow-md">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col items-center justify-center gap-1 sm:gap-1.5">
                <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-blue-700 dark:text-blue-300" />
                <p className="text-xl sm:text-2xl text-blue-800 dark:text-blue-200">{estadisticas.total}</p>
                <p className="text-[10px] sm:text-xs text-blue-700/80 dark:text-blue-300/80 text-center leading-tight">Total</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-cyan-100 to-cyan-200 dark:from-cyan-900/40 dark:to-cyan-800/40 shadow-md">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col items-center justify-center gap-1 sm:gap-1.5">
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-700 dark:text-cyan-300" />
                <p className="text-xl sm:text-2xl text-cyan-800 dark:text-cyan-200">{estadisticas.programadas}</p>
                <p className="text-[10px] sm:text-xs text-cyan-700/80 dark:text-cyan-300/80 text-center leading-tight">Programadas</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/40 dark:to-yellow-800/40 shadow-md">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col items-center justify-center gap-1 sm:gap-1.5">
                <Play className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-700 dark:text-yellow-300" />
                <p className="text-xl sm:text-2xl text-yellow-800 dark:text-yellow-200">{estadisticas.enProgreso}</p>
                <p className="text-[10px] sm:text-xs text-yellow-700/80 dark:text-yellow-300/80 text-center leading-tight">En Progreso</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 shadow-md">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col items-center justify-center gap-1 sm:gap-1.5">
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-700 dark:text-green-300" />
                <p className="text-xl sm:text-2xl text-green-800 dark:text-green-200">{estadisticas.completadas}</p>
                <p className="text-[10px] sm:text-xs text-green-700/80 dark:text-green-300/80 text-center leading-tight">Completadas</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Hallazgos Independientes */}
      {hallazgosIndependientes.length > 0 && (
        <div className="mb-6">
          <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                Hallazgos Reportados Hoy ({hallazgosIndependientes.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {hallazgosIndependientes.map((hallazgo) => (
                  <motion.div
                    key={hallazgo.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 bg-white dark:bg-gray-800 border border-orange-200 dark:border-orange-800 rounded-lg"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Badge variant="outline" className="text-xs">{hallazgo.tipo}</Badge>
                          <Badge variant="outline" className={`text-xs ${
                            hallazgo.gravedad === 'Crítica' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                            hallazgo.gravedad === 'Alta' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                            hallazgo.gravedad === 'Media' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                          }`}>
                            {hallazgo.gravedad}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(hallazgo.fecha).toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="font-medium text-sm">{hallazgo.titulo}</p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{hallazgo.descripcion}</p>
                        {hallazgo.evidencias && hallazgo.evidencias.length > 0 && (
                          <div className="flex items-center gap-1 mt-2">
                            <Camera className="h-3 w-3 text-blue-600" />
                            <span className="text-xs text-muted-foreground">
                              {hallazgo.evidencias.length} {hallazgo.evidencias.length === 1 ? 'fotografía' : 'fotografías'}
                            </span>
                          </div>
                        )}
                      </div>
                      <Button
                        onClick={() => {
                          setHallazgosIndependientes(hallazgosIndependientes.filter(h => h.id !== hallazgo.id));
                        }}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Columna izquierda: Actividades */}
        <div className="lg:col-span-11">
          {actividadesFiltradas.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 sm:p-12">
                <div className="text-center">
                  <Calendar className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 text-muted-foreground opacity-30" />
                  <h3 className="mb-2 text-sm sm:text-base">No hay actividades</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                    No se encontraron actividades con los filtros seleccionados
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedTipo('todos');
                      setSelectedEstado('todos');
                      if (!isGuardarecurso) setSelectedGuardarecurso('todos');
                    }}
                    className="text-xs sm:text-sm"
                  >
                    Limpiar filtros
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
              {actividadesFiltradas.map((actividad, index) => {
                const guardarecurso = guardarecursos.find(g => g.id === actividad.guardarecurso);
                const tipoColor = getTipoColor(actividad.tipo);
                const estadoInfo = getEstadoInfo(actividad.estado);
                const EstadoIcon = estadoInfo.icon;
                const TipoIcon = getTipoIcon(actividad.tipo);
                
                return (
                  <motion.div
                    key={actividad.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="h-full"
                  >
                    <Card className="group relative overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300 h-full border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
                      {/* Borde decorativo con gradiente según estado */}
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
                        actividad.estado === 'Programada' ? 'from-blue-500 to-cyan-600' :
                        actividad.estado === 'En Progreso' ? 'from-yellow-500 to-orange-600' :
                        'from-green-500 to-emerald-600'
                      }`} />
                      
                      <CardContent className="p-5 sm:p-6">
                        {/* Header con tipo e icono */}
                        <div className="flex items-start justify-between mb-4 gap-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-10 h-10 rounded-xl ${tipoColor.bg} flex items-center justify-center shadow-sm`}>
                              <TipoIcon className={`h-5 w-5 ${tipoColor.text}`} />
                            </div>
                            <div className="flex flex-col">
                              <Badge variant="outline" className={`${tipoColor.bg} ${tipoColor.text} border-0 text-[10px] sm:text-xs w-fit`}>
                                {actividad.tipo}
                              </Badge>
                            </div>
                          </div>
                          
                          <Badge variant="outline" className={`${estadoInfo.badge} border text-[10px] sm:text-xs flex items-center gap-1.5 px-2.5 py-1`}>
                            <EstadoIcon className={`h-3.5 w-3.5 ${actividad.estado === 'En Progreso' ? 'animate-pulse' : ''}`} />
                            <span className="hidden sm:inline">{actividad.estado}</span>
                          </Badge>
                        </div>

                        {/* Título/Descripción */}
                        <h3 className="font-semibold line-clamp-2 text-sm sm:text-base mb-4 text-gray-900 dark:text-gray-100">
                          {actividad.descripcion}
                        </h3>

                        {/* Info Cards - Diseño más compacto y visual */}
                        <div className="space-y-2.5 mb-4">
                          {/* Horario */}
                          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-sm flex-shrink-0">
                              <Clock className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-900 dark:text-gray-100">
                                {actividad.horaInicio}
                                {actividad.horaFin && ` - ${actividad.horaFin}`}
                              </p>
                            </div>
                          </div>

                          {/* Ubicación */}
                          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-green-50/50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/30">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm flex-shrink-0">
                              <MapPin className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium truncate text-gray-900 dark:text-gray-100">
                                {actividad.ubicacion}
                              </p>
                            </div>
                          </div>

                          {/* Guardarecurso */}
                          {guardarecurso && (
                            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white text-xs font-semibold shadow-sm flex-shrink-0">
                                {guardarecurso.nombre[0]}{guardarecurso.apellido[0]}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium truncate text-gray-900 dark:text-gray-100">
                                  {guardarecurso.nombre} {guardarecurso.apellido}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Hallazgos y Evidencias - Mejorado */}
                        {(actividad.hallazgos?.length > 0 || actividad.evidencias?.length > 0) && (
                          <div className="flex items-center gap-2 mb-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                            {actividad.hallazgos?.length > 0 && (
                              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800">
                                <AlertTriangle className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
                                <span className="text-xs font-medium text-orange-700 dark:text-orange-300">
                                  {actividad.hallazgos.length}
                                </span>
                              </div>
                            )}
                            {actividad.evidencias?.length > 0 && (
                              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                                <Camera className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                                  {actividad.evidencias.length}
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Botones - Mejorados */}
                        <div className="flex gap-2">
                          {actividad.estado === 'Programada' && userPermissions.canEdit && (
                            <Button
                              onClick={() => handleIniciarActividad(actividad)}
                              className="flex-1 h-10 bg-gradient-to-r from-blue-600 to-cyan-700 hover:from-blue-700 hover:to-cyan-800 shadow-md hover:shadow-lg transition-all duration-200 group"
                              size="sm"
                            >
                              <Play className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                              <span className="font-medium">Iniciar</span>
                            </Button>
                          )}
                          {actividad.estado === 'En Progreso' && userPermissions.canEdit && (
                            <Button
                              onClick={() => handleCompletarActividad(actividad)}
                              className="flex-1 h-10 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 shadow-md hover:shadow-lg transition-all duration-200 group"
                              size="sm"
                            >
                              <CheckCircle className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                              <span className="font-medium">Completar</span>
                            </Button>
                          )}
                          {actividad.estado === 'Completada' && (
                            <Badge variant="outline" className="flex-1 justify-center h-9 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Finalizada
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Columna derecha: Estadísticas (solo desktop) */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="space-y-3 sticky top-4">
            <Card className="border-0 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 shadow-md">
              <CardContent className="p-4">
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <Activity className="h-8 w-8 text-blue-700 dark:text-blue-300" />
                  <p className="text-2xl text-blue-800 dark:text-blue-200">{estadisticas.total}</p>
                  <p className="text-xs text-blue-700/80 dark:text-blue-300/80 text-center leading-tight">Total</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-gradient-to-br from-cyan-100 to-cyan-200 dark:from-cyan-900/40 dark:to-cyan-800/40 shadow-md">
              <CardContent className="p-4">
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <Clock className="h-8 w-8 text-cyan-700 dark:text-cyan-300" />
                  <p className="text-2xl text-cyan-800 dark:text-cyan-200">{estadisticas.programadas}</p>
                  <p className="text-xs text-cyan-700/80 dark:text-cyan-300/80 text-center leading-tight">Programadas</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/40 dark:to-yellow-800/40 shadow-md">
              <CardContent className="p-4">
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <Play className="h-8 w-8 text-yellow-700 dark:text-yellow-300" />
                  <p className="text-2xl text-yellow-800 dark:text-yellow-200">{estadisticas.enProgreso}</p>
                  <p className="text-xs text-yellow-700/80 dark:text-yellow-300/80 text-center leading-tight">En Progreso</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 shadow-md">
              <CardContent className="p-4">
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <CheckCircle className="h-8 w-8 text-green-700 dark:text-green-300" />
                  <p className="text-2xl text-green-800 dark:text-green-200">{estadisticas.completadas}</p>
                  <p className="text-xs text-green-700/80 dark:text-green-300/80 text-center leading-tight">Completadas</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de Patrullaje en Progreso (no se puede cerrar hasta completar) */}
      <Dialog open={isPatrullajeDialogOpen} onOpenChange={() => {}}>
        <DialogContent 
          className="max-w-4xl max-h-[90vh] overflow-y-auto [&>button]:hidden"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader className="pb-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
                <Binoculars className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-xl">Patrullaje en Progreso</DialogTitle>
                <DialogDescription>
                  {actividadActiva?.descripcion}
                </DialogDescription>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1.5 rounded-md flex items-center gap-2">
                <Play className="h-4 w-4 text-yellow-600 dark:text-yellow-400 animate-pulse" />
                <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Activo</span>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            {/* Info del patrullaje */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Hora de inicio</p>
                <p className="font-medium">{actividadActiva?.horaInicio}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Ubicación</p>
                <p className="font-medium">{actividadActiva?.ubicacion}</p>
              </div>
            </div>

            {/* Formulario de Hallazgos Integrado */}
            <div className="space-y-4 p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-lg border-2 border-orange-200 dark:border-orange-800">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Reportar Hallazgos Durante el Patrullaje
                </h3>
                <Badge variant="outline" className="bg-white dark:bg-gray-800">
                  {hallazgosTemporales.length} registrados
                </Badge>
              </div>

              {/* Formulario de nuevo hallazgo */}
              <div className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg border">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patrol-hallazgo-tipo">Tipo de Hallazgo</Label>
                    <Select value={hallazgoForm.tipo} onValueChange={(value: any) => setHallazgoForm({...hallazgoForm, tipo: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ambiental">Ambiental</SelectItem>
                        <SelectItem value="Irregularidad">Irregularidad</SelectItem>
                        <SelectItem value="Fauna">Fauna</SelectItem>
                        <SelectItem value="Flora">Flora</SelectItem>
                        <SelectItem value="Infraestructura">Infraestructura</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="patrol-hallazgo-gravedad">Gravedad</Label>
                    <Select value={hallazgoForm.gravedad} onValueChange={(value: any) => setHallazgoForm({...hallazgoForm, gravedad: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Baja">Baja</SelectItem>
                        <SelectItem value="Media">Media</SelectItem>
                        <SelectItem value="Alta">Alta</SelectItem>
                        <SelectItem value="Crítica">Crítica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="patrol-hallazgo-titulo">Título</Label>
                  <Input
                    id="patrol-hallazgo-titulo"
                    value={hallazgoForm.titulo}
                    onChange={(e) => setHallazgoForm({...hallazgoForm, titulo: e.target.value})}
                    placeholder="Título breve del hallazgo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="patrol-hallazgo-descripcion">Descripción</Label>
                  <Textarea
                    id="patrol-hallazgo-descripcion"
                    value={hallazgoForm.descripcion}
                    onChange={(e) => setHallazgoForm({...hallazgoForm, descripcion: e.target.value})}
                    placeholder="Describa detalladamente el hallazgo..."
                    rows={3}
                    className="resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patrol-hallazgo-lat">Latitud (opcional)</Label>
                    <Input
                      id="patrol-hallazgo-lat"
                      type="number"
                      step="0.000001"
                      value={hallazgoForm.latitud}
                      onChange={(e) => setHallazgoForm({...hallazgoForm, latitud: e.target.value})}
                      placeholder="14.6349"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="patrol-hallazgo-lng">Longitud (opcional)</Label>
                    <Input
                      id="patrol-hallazgo-lng"
                      type="number"
                      step="0.000001"
                      value={hallazgoForm.longitud}
                      onChange={(e) => setHallazgoForm({...hallazgoForm, longitud: e.target.value})}
                      placeholder="-90.5069"
                    />
                  </div>
                </div>

                {/* Drag & Drop para fotografías */}
                <div className="space-y-3 pt-3 border-t">
                  <Label className="flex items-center gap-2">
                    <Camera className="h-4 w-4 text-blue-600" />
                    Fotografías del Hallazgo ({hallazgoForm.fotografias.length})
                  </Label>

                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`
                      relative border-2 border-dashed rounded-lg p-6 transition-all duration-200
                      ${isDragging 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
                        : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
                      }
                      hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/10
                      cursor-pointer
                    `}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    
                    <div className="flex flex-col items-center justify-center gap-2 text-center">
                      <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center
                        ${isDragging 
                          ? 'bg-blue-100 dark:bg-blue-900/40' 
                          : 'bg-gray-100 dark:bg-gray-800'
                        }
                      `}>
                        <Upload className={`
                          h-6 w-6
                          ${isDragging 
                            ? 'text-blue-600 dark:text-blue-400' 
                            : 'text-gray-400 dark:text-gray-600'
                          }
                        `} />
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium">
                          {isDragging 
                            ? 'Suelta las imágenes aquí' 
                            : 'Arrastra imágenes o haz clic'
                          }
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          PNG, JPG, GIF • Múltiples archivos
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Lista de fotografías */}
                  {hallazgoForm.fotografias.length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                      {hallazgoForm.fotografias.map((foto, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative group"
                        >
                          <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                            <img
                              src={foto.url}
                              alt={foto.descripcion || 'Fotografía'}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                            <p className="text-xs text-white font-medium truncate">{foto.tipoEvidencia}</p>
                            {foto.descripcion && (
                              <p className="text-xs text-white/80 truncate">{foto.descripcion}</p>
                            )}
                          </div>
                          <Button
                            type="button"
                            onClick={() => {
                              setHallazgoForm({
                                ...hallazgoForm,
                                fotografias: hallazgoForm.fotografias.filter((_, i) => i !== index)
                              });
                            }}
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleAgregarHallazgo}
                  disabled={!hallazgoForm.titulo || !hallazgoForm.descripcion}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Hallazgo al Patrullaje
                </Button>
              </div>

              {/* Lista de hallazgos registrados */}
              {hallazgosTemporales.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm">Hallazgos registrados en este patrullaje:</Label>
                  {hallazgosTemporales.map((hallazgo) => (
                    <motion.div
                      key={hallazgo.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-3 bg-white dark:bg-gray-800 border border-orange-200 dark:border-orange-700 rounded-lg"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <Badge variant="outline" className="text-xs">{hallazgo.tipo}</Badge>
                            <Badge variant="outline" className={`text-xs ${
                              hallazgo.gravedad === 'Crítica' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                              hallazgo.gravedad === 'Alta' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                              hallazgo.gravedad === 'Media' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                              'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                            }`}>
                              {hallazgo.gravedad}
                            </Badge>
                            {hallazgo.evidencias && hallazgo.evidencias.length > 0 && (
                              <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/20">
                                <Camera className="h-3 w-3 mr-1" />
                                {hallazgo.evidencias.length}
                              </Badge>
                            )}
                          </div>
                          <p className="font-medium text-sm">{hallazgo.titulo}</p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{hallazgo.descripcion}</p>
                        </div>
                        <Button
                          onClick={() => handleEliminarHallazgo(hallazgo.id)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Evidencias Fotográficas */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Camera className="h-5 w-5 text-blue-600" />
                  Fotografías ({evidenciasTemporales.length})
                </h3>
                <Button
                  onClick={() => setIsAddEvidenciaOpen(true)}
                  size="sm"
                  variant="outline"
                  className="h-8"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Agregar
                </Button>
              </div>

              {evidenciasTemporales.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <Camera className="h-12 w-12 mx-auto mb-2 text-muted-foreground opacity-30" />
                  <p className="text-sm text-muted-foreground">No se han agregado fotografías</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {evidenciasTemporales.map((evidencia) => (
                    <div key={evidencia.id} className="relative group">
                      <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                        <img
                          src={evidencia.url}
                          alt={evidencia.descripcion}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        onClick={() => handleEliminarEvidencia(evidencia.id)}
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      {evidencia.descripcion && (
                        <p className="text-xs mt-1 text-muted-foreground truncate">{evidencia.descripcion}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Observaciones */}
            <div className="space-y-2">
              <Label htmlFor="observaciones-patrullaje" className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Observaciones Generales del Patrullaje
              </Label>
              <Textarea
                id="observaciones-patrullaje"
                value={observacionesFinal}
                onChange={(e) => setObservacionesFinal(e.target.value)}
                placeholder="Escriba observaciones generales, condiciones del área, detalles adicionales del patrullaje..."
                rows={4}
                className="resize-none"
              />
            </div>
          </div>

          {/* Footer destacado con botón para completar */}
          <div className="flex flex-col gap-3 pt-6 border-t bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-4 rounded-lg -mx-6 -mb-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-semibold text-green-800 dark:text-green-200">¿Finalizar Patrullaje?</p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    {hallazgosTemporales.length} hallazgo(s) registrado(s)
                  </p>
                </div>
              </div>
              <Button
                onClick={handleCompletarPatrullaje}
                size="lg"
                className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 shadow-lg"
              >
                <StopCircle className="h-5 w-5 mr-2" />
                Finalizar Patrullaje
              </Button>
            </div>
            <p className="text-xs text-center text-muted-foreground px-2">
              Al finalizar, no podrá agregar más hallazgos a este patrullaje
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para editar foto (descripción y tipo) */}
      <Dialog open={isEditandoFoto} onOpenChange={setIsEditandoFoto}>
        <DialogContent className="w-[95vw] sm:w-[90vw] max-w-xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Detalles de la Fotografía</DialogTitle>
            <DialogDescription>
              Agregue descripción y tipo de evidencia para la fotografía
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            {/* Vista previa */}
            {fotoPendiente && (
              <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border">
                <img
                  src={fotoPendiente.url}
                  alt="Vista previa"
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* Tipo de evidencia */}
            <div className="space-y-2">
              <Label htmlFor="foto-tipo">Tipo de Evidencia Fotográfica</Label>
              <Select 
                value={fotoTemp.tipoEvidencia} 
                onValueChange={(value) => setFotoTemp({...fotoTemp, tipoEvidencia: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fauna">Fauna</SelectItem>
                  <SelectItem value="Flora">Flora</SelectItem>
                  <SelectItem value="Infraestructura">Infraestructura</SelectItem>
                  <SelectItem value="Irregularidad">Irregularidad</SelectItem>
                  <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="foto-descripcion">Descripción (opcional)</Label>
              <Textarea
                id="foto-descripcion"
                value={fotoTemp.descripcion}
                onChange={(e) => setFotoTemp({...fotoTemp, descripcion: e.target.value})}
                placeholder="Describa brevemente lo que se observa en la fotografía..."
                rows={3}
                className="resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              onClick={() => {
                setIsEditandoFoto(false);
                setFotoPendiente(null);
                setFotoTemp({ url: '', descripcion: '', tipoEvidencia: 'Fauna' });
              }} 
              variant="outline"
            >
              Cancelar
            </Button>
            <Button onClick={handleGuardarFoto} className="bg-gradient-to-r from-blue-600 to-cyan-700 hover:from-blue-700 hover:to-cyan-800">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Fotografía
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para completar actividad normal (con formulario integrado) */}
      <Dialog open={isCompletarDialogOpen} onOpenChange={setIsCompletarDialogOpen}>
        <DialogContent className="w-[95vw] sm:w-[90vw] max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader className="pb-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-xl">Completar Actividad</DialogTitle>
                <DialogDescription>
                  {selectedActividad?.descripcion}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            {/* Hallazgos Reportados */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Hallazgos Reportados ({hallazgosTemporales.length})
                </h3>
              </div>

              {hallazgosTemporales.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <AlertTriangle className="h-10 w-10 mx-auto mb-2 text-muted-foreground opacity-30" />
                  <p className="text-sm text-muted-foreground">No se han reportado hallazgos</p>
                  <p className="text-xs text-muted-foreground mt-1">Agregue hallazgos usando el formulario abajo</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {hallazgosTemporales.map((hallazgo) => (
                    <div key={hallazgo.id} className="p-4 bg-white dark:bg-gray-800 border rounded-lg">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">{hallazgo.tipo}</Badge>
                            <Badge variant="outline" className={`text-xs ${
                              hallazgo.gravedad === 'Crítica' ? 'bg-red-100 text-red-700' :
                              hallazgo.gravedad === 'Alta' ? 'bg-orange-100 text-orange-700' :
                              hallazgo.gravedad === 'Media' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {hallazgo.gravedad}
                            </Badge>
                          </div>
                          <p className="font-medium">{hallazgo.titulo}</p>
                          <p className="text-sm text-muted-foreground mt-1">{hallazgo.descripcion}</p>
                          {hallazgo.evidencias && hallazgo.evidencias.length > 0 && (
                            <div className="grid grid-cols-4 gap-2 mt-3">
                              {hallazgo.evidencias.map((evidencia, idx) => (
                                <div key={idx} className="aspect-square bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
                                  <img src={evidencia.url} alt="" className="w-full h-full object-cover" />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <Button
                          onClick={() => handleEliminarHallazgo(hallazgo.id)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Formulario de Hallazgo Integrado */}
            <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border-2 border-orange-200 dark:border-orange-800 rounded-xl space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                  <Plus className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Reportar Nuevo Hallazgo</h3>
                  <p className="text-xs text-muted-foreground">Complete la información y agregue fotografías</p>
                </div>
              </div>

              {/* Información del Hallazgo */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hallazgo-tipo">Tipo de Hallazgo</Label>
                    <Select value={hallazgoForm.tipo} onValueChange={(value: any) => setHallazgoForm({...hallazgoForm, tipo: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ambiental">Ambiental</SelectItem>
                        <SelectItem value="Irregularidad">Irregularidad</SelectItem>
                        <SelectItem value="Fauna">Fauna</SelectItem>
                        <SelectItem value="Flora">Flora</SelectItem>
                        <SelectItem value="Infraestructura">Infraestructura</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hallazgo-gravedad">Gravedad</Label>
                    <Select value={hallazgoForm.gravedad} onValueChange={(value: any) => setHallazgoForm({...hallazgoForm, gravedad: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Baja">Baja</SelectItem>
                        <SelectItem value="Media">Media</SelectItem>
                        <SelectItem value="Alta">Alta</SelectItem>
                        <SelectItem value="Crítica">Crítica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hallazgo-titulo">Título</Label>
                  <Input
                    id="hallazgo-titulo"
                    value={hallazgoForm.titulo}
                    onChange={(e) => setHallazgoForm({...hallazgoForm, titulo: e.target.value})}
                    placeholder="Título breve del hallazgo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hallazgo-descripcion">Descripción</Label>
                  <Textarea
                    id="hallazgo-descripcion"
                    value={hallazgoForm.descripcion}
                    onChange={(e) => setHallazgoForm({...hallazgoForm, descripcion: e.target.value})}
                    placeholder="Describa detalladamente el hallazgo..."
                    rows={3}
                    className="resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hallazgo-lat">Latitud (opcional)</Label>
                    <Input
                      id="hallazgo-lat"
                      type="number"
                      step="0.000001"
                      value={hallazgoForm.latitud}
                      onChange={(e) => setHallazgoForm({...hallazgoForm, latitud: e.target.value})}
                      placeholder="14.6349"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hallazgo-lng">Longitud (opcional)</Label>
                    <Input
                      id="hallazgo-lng"
                      type="number"
                      step="0.000001"
                      value={hallazgoForm.longitud}
                      onChange={(e) => setHallazgoForm({...hallazgoForm, longitud: e.target.value})}
                      placeholder="-90.5069"
                    />
                  </div>
                </div>
              </div>

              {/* Fotografías */}
              <div className="space-y-4 pt-4 border-t border-orange-300 dark:border-orange-700">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <Camera className="h-4 w-4 text-blue-600" />
                    Fotografías del Hallazgo ({hallazgoForm.fotografias.length})
                  </h3>
                </div>

                {/* Zona de Drag & Drop */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`
                    relative border-2 border-dashed rounded-lg p-6 transition-all duration-200
                    ${isDragging 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
                      : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50'
                    }
                    hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/10
                    cursor-pointer
                  `}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center
                      ${isDragging 
                        ? 'bg-blue-100 dark:bg-blue-900/40' 
                        : 'bg-gray-100 dark:bg-gray-800'
                      }
                    `}>
                      <Upload className={`
                        h-6 w-6
                        ${isDragging 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : 'text-gray-400 dark:text-gray-600'
                        }
                      `} />
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium">
                        {isDragging 
                          ? 'Suelta las imágenes aquí' 
                          : 'Arrastra imágenes o haz clic'
                        }
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        PNG, JPG, GIF • Múltiples archivos
                      </p>
                    </div>
                  </div>
                </div>

                {/* Lista de fotografías */}
                {hallazgoForm.fotografias.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {hallazgoForm.fotografias.map((foto, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative group"
                      >
                        <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                          <img
                            src={foto.url}
                            alt={foto.descripcion || 'Fotografía'}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                          <p className="text-xs text-white font-medium truncate">{foto.tipoEvidencia}</p>
                          {foto.descripcion && (
                            <p className="text-xs text-white/80 truncate">{foto.descripcion}</p>
                          )}
                        </div>
                        <Button
                          type="button"
                          onClick={() => {
                            setHallazgoForm({
                              ...hallazgoForm,
                              fotografias: hallazgoForm.fotografias.filter((_, i) => i !== index)
                            });
                          }}
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Botón para agregar hallazgo */}
              <div className="flex justify-end pt-2">
                <Button 
                  onClick={handleAgregarHallazgo} 
                  disabled={!hallazgoForm.titulo || !hallazgoForm.descripcion}
                  className="bg-gradient-to-r from-orange-600 to-amber-700 hover:from-orange-700 hover:to-amber-800"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Hallazgo a la Actividad
                </Button>
              </div>
            </div>

            {/* Evidencias Fotográficas Generales */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Camera className="h-5 w-5 text-blue-600" />
                  Fotografías Generales ({evidenciasTemporales.length})
                </h3>
                <Button
                  onClick={() => setIsAddEvidenciaOpen(true)}
                  size="sm"
                  variant="outline"
                  className="h-8"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Agregar
                </Button>
              </div>

              {evidenciasTemporales.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <Camera className="h-10 w-10 mx-auto mb-2 text-muted-foreground opacity-30" />
                  <p className="text-sm text-muted-foreground">No se han agregado fotografías generales</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {evidenciasTemporales.map((evidencia) => (
                    <div key={evidencia.id} className="relative group">
                      <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border">
                        <img
                          src={evidencia.url}
                          alt={evidencia.descripcion}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                        <p className="text-xs text-white font-medium">{evidencia.tipo}</p>
                        {evidencia.descripcion && (
                          <p className="text-xs text-white/80 truncate">{evidencia.descripcion}</p>
                        )}
                      </div>
                      <Button
                        onClick={() => handleEliminarEvidencia(evidencia.id)}
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Observaciones */}
            <div className="space-y-2">
              <Label htmlFor="observaciones-final" className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Observaciones Generales de la Actividad
              </Label>
              <Textarea
                id="observaciones-final"
                value={observacionesFinal}
                onChange={(e) => setObservacionesFinal(e.target.value)}
                placeholder="Escriba observaciones generales, condiciones del área, detalles adicionales de la actividad..."
                rows={4}
                className="resize-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              onClick={() => {
                setIsCompletarDialogOpen(false);
                setSelectedActividad(null);
              }}
              variant="outline"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleFinalizarActividad}
              className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Finalizar Actividad
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para agregar hallazgo */}
      <Dialog open={isAddHallazgoOpen} onOpenChange={setIsAddHallazgoOpen}>
        <DialogContent className="w-[95vw] sm:w-[90vw] max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Reportar Hallazgo</DialogTitle>
            <DialogDescription>
              Registre un hallazgo encontrado durante la actividad
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            {/* Información del Hallazgo */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                Información del Hallazgo
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hallazgo-tipo">Tipo de Hallazgo</Label>
                  <Select value={hallazgoForm.tipo} onValueChange={(value: any) => setHallazgoForm({...hallazgoForm, tipo: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ambiental">Ambiental</SelectItem>
                      <SelectItem value="Irregularidad">Irregularidad</SelectItem>
                      <SelectItem value="Fauna">Fauna</SelectItem>
                      <SelectItem value="Flora">Flora</SelectItem>
                      <SelectItem value="Infraestructura">Infraestructura</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hallazgo-gravedad">Gravedad</Label>
                  <Select value={hallazgoForm.gravedad} onValueChange={(value: any) => setHallazgoForm({...hallazgoForm, gravedad: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Baja">Baja</SelectItem>
                      <SelectItem value="Media">Media</SelectItem>
                      <SelectItem value="Alta">Alta</SelectItem>
                      <SelectItem value="Crítica">Crítica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hallazgo-titulo">Título</Label>
                <Input
                  id="hallazgo-titulo"
                  value={hallazgoForm.titulo}
                  onChange={(e) => setHallazgoForm({...hallazgoForm, titulo: e.target.value})}
                  placeholder="Título breve del hallazgo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hallazgo-descripcion">Descripción</Label>
                <Textarea
                  id="hallazgo-descripcion"
                  value={hallazgoForm.descripcion}
                  onChange={(e) => setHallazgoForm({...hallazgoForm, descripcion: e.target.value})}
                  placeholder="Describa detalladamente el hallazgo..."
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hallazgo-lat">Latitud (opcional)</Label>
                  <Input
                    id="hallazgo-lat"
                    type="number"
                    step="0.000001"
                    value={hallazgoForm.latitud}
                    onChange={(e) => setHallazgoForm({...hallazgoForm, latitud: e.target.value})}
                    placeholder="14.6349"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hallazgo-lng">Longitud (opcional)</Label>
                  <Input
                    id="hallazgo-lng"
                    type="number"
                    step="0.000001"
                    value={hallazgoForm.longitud}
                    onChange={(e) => setHallazgoForm({...hallazgoForm, longitud: e.target.value})}
                    placeholder="-90.5069"
                  />
                </div>
              </div>
            </div>

            {/* Fotografías */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Camera className="h-4 w-4 text-blue-600" />
                  Fotografías ({hallazgoForm.fotografias.length})
                </h3>
              </div>

              {/* Agregar fotografía */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="foto-url">URL de la Fotografía</Label>
                  <Input
                    id="foto-url"
                    value={fotoTemp.url}
                    onChange={(e) => setFotoTemp({...fotoTemp, url: e.target.value})}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                  <p className="text-xs text-muted-foreground">
                    Ingrese la URL de la fotografía (en un sistema real, aquí se subiría el archivo)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="foto-descripcion">Descripción (opcional)</Label>
                  <Input
                    id="foto-descripcion"
                    value={fotoTemp.descripcion}
                    onChange={(e) => setFotoTemp({...fotoTemp, descripcion: e.target.value})}
                    placeholder="Descripción de la fotografía..."
                  />
                </div>

                <Button
                  type="button"
                  onClick={() => {
                    if (fotoTemp.url) {
                      setHallazgoForm({
                        ...hallazgoForm,
                        fotografias: [...hallazgoForm.fotografias, fotoTemp]
                      });
                      setFotoTemp({ url: '', descripcion: '' });
                    }
                  }}
                  variant="outline"
                  size="sm"
                  disabled={!fotoTemp.url}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Fotografía
                </Button>
              </div>

              {/* Lista de fotografías */}
              {hallazgoForm.fotografias.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {hallazgoForm.fotografias.map((foto, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border">
                        <img
                          src={foto.url}
                          alt={foto.descripcion || 'Fotografía'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={() => {
                          setHallazgoForm({
                            ...hallazgoForm,
                            fotografias: hallazgoForm.fotografias.filter((_, i) => i !== index)
                          });
                        }}
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      {foto.descripcion && (
                        <p className="text-xs mt-1 text-muted-foreground truncate">{foto.descripcion}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button onClick={() => {
              setIsAddHallazgoOpen(false);
              setFotoTemp({ url: '', descripcion: '' });
            }} variant="outline">
              Cancelar
            </Button>
            <Button onClick={handleAgregarHallazgo} disabled={!hallazgoForm.titulo || !hallazgoForm.descripcion}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Hallazgo
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para agregar evidencia */}
      <Dialog open={isAddEvidenciaOpen} onOpenChange={setIsAddEvidenciaOpen}>
        <DialogContent className="w-[95vw] sm:w-[90vw] max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Agregar Fotografía</DialogTitle>
            <DialogDescription>
              Agregue una fotografía como evidencia de la actividad
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="evidencia-tipo">Tipo de Evidencia</Label>
              <Select value={evidenciaForm.tipo} onValueChange={(value: any) => setEvidenciaForm({...evidenciaForm, tipo: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fauna">Fauna</SelectItem>
                  <SelectItem value="Flora">Flora</SelectItem>
                  <SelectItem value="Infraestructura">Infraestructura</SelectItem>
                  <SelectItem value="Irregularidad">Irregularidad</SelectItem>
                  <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Drag & Drop para evidencia */}
            <div className="space-y-2">
              <Label>Fotografía</Label>
              
              {!evidenciaForm.url ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const files = Array.from(e.dataTransfer.files);
                    if (files.length > 0 && files[0].type.startsWith('image/')) {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        const url = e.target?.result as string;
                        setEvidenciaForm({...evidenciaForm, url});
                      };
                      reader.readAsDataURL(files[0]);
                    }
                  }}
                  className={`
                    relative border-2 border-dashed rounded-lg p-8 transition-all duration-200
                    ${isDragging 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
                      : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
                    }
                    hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/10
                    cursor-pointer
                  `}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          const url = e.target?.result as string;
                          setEvidenciaForm({...evidenciaForm, url});
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                  
                  <div className="flex flex-col items-center justify-center gap-3 text-center">
                    <div className={`
                      w-16 h-16 rounded-full flex items-center justify-center
                      ${isDragging 
                        ? 'bg-blue-100 dark:bg-blue-900/40' 
                        : 'bg-gray-100 dark:bg-gray-800'
                      }
                    `}>
                      <Upload className={`
                        h-8 w-8
                        ${isDragging 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : 'text-gray-400 dark:text-gray-600'
                        }
                      `} />
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium">
                        {isDragging 
                          ? 'Suelta la imagen aquí' 
                          : 'Arrastra una imagen o haz clic para seleccionar'
                        }
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG, GIF • Máximo 10 MB
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative group">
                  <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border-2 border-blue-200 dark:border-blue-700">
                    <img
                      src={evidenciaForm.url}
                      alt="Vista previa"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <Button
                    onClick={() => setEvidenciaForm({...evidenciaForm, url: ''})}
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Eliminar
                  </Button>
                  <div className="absolute bottom-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                    Click para cambiar imagen
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          const url = e.target?.result as string;
                          setEvidenciaForm({...evidenciaForm, url});
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                  <div 
                    className="absolute inset-0 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="evidencia-descripcion">Descripción (opcional)</Label>
              <Textarea
                id="evidencia-descripcion"
                value={evidenciaForm.descripcion}
                onChange={(e) => setEvidenciaForm({...evidenciaForm, descripcion: e.target.value})}
                placeholder="Describa brevemente la fotografía..."
                rows={2}
                className="resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button onClick={() => setIsAddEvidenciaOpen(false)} variant="outline">
              Cancelar
            </Button>
            <Button onClick={handleAgregarEvidencia} disabled={!evidenciaForm.url}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Fotografía
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para reportar hallazgo independiente */}
      <Dialog open={isReportarHallazgoIndependienteOpen} onOpenChange={setIsReportarHallazgoIndependienteOpen}>
        <DialogContent className="w-[95vw] sm:w-[90vw] max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Reportar Hallazgo
            </DialogTitle>
            <DialogDescription>
              Registre un hallazgo encontrado en el área protegida
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            {/* Información del Hallazgo */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Información del Hallazgo
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hallazgo-ind-tipo">Tipo de Hallazgo</Label>
                  <Select value={hallazgoForm.tipo} onValueChange={(value: any) => setHallazgoForm({...hallazgoForm, tipo: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ambiental">Ambiental</SelectItem>
                      <SelectItem value="Irregularidad">Irregularidad</SelectItem>
                      <SelectItem value="Fauna">Fauna</SelectItem>
                      <SelectItem value="Flora">Flora</SelectItem>
                      <SelectItem value="Infraestructura">Infraestructura</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hallazgo-ind-gravedad">Gravedad</Label>
                  <Select value={hallazgoForm.gravedad} onValueChange={(value: any) => setHallazgoForm({...hallazgoForm, gravedad: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Baja">Baja</SelectItem>
                      <SelectItem value="Media">Media</SelectItem>
                      <SelectItem value="Alta">Alta</SelectItem>
                      <SelectItem value="Crítica">Crítica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hallazgo-ind-titulo">Título</Label>
                <Input
                  id="hallazgo-ind-titulo"
                  value={hallazgoForm.titulo}
                  onChange={(e) => setHallazgoForm({...hallazgoForm, titulo: e.target.value})}
                  placeholder="Título breve del hallazgo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hallazgo-ind-descripcion">Descripción</Label>
                <Textarea
                  id="hallazgo-ind-descripcion"
                  value={hallazgoForm.descripcion}
                  onChange={(e) => setHallazgoForm({...hallazgoForm, descripcion: e.target.value})}
                  placeholder="Describa detalladamente el hallazgo..."
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hallazgo-ind-lat">Latitud</Label>
                  <Input
                    id="hallazgo-ind-lat"
                    type="number"
                    step="0.000001"
                    value={hallazgoForm.latitud}
                    onChange={(e) => setHallazgoForm({...hallazgoForm, latitud: e.target.value})}
                    placeholder="14.6349"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hallazgo-ind-lng">Longitud</Label>
                  <Input
                    id="hallazgo-ind-lng"
                    type="number"
                    step="0.000001"
                    value={hallazgoForm.longitud}
                    onChange={(e) => setHallazgoForm({...hallazgoForm, longitud: e.target.value})}
                    placeholder="-90.5069"
                  />
                </div>
              </div>
            </div>

            {/* Fotografías con Drag & Drop */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Camera className="h-4 w-4 text-blue-600" />
                  Fotografías ({hallazgoForm.fotografias.length})
                </h3>
              </div>

              {/* Zona de Drag & Drop */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                  relative border-2 border-dashed rounded-lg p-8 transition-all duration-200
                  ${isDragging 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
                    : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
                  }
                  hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/10
                  cursor-pointer
                `}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                <div className="flex flex-col items-center justify-center gap-3 text-center">
                  <div className={`
                    w-16 h-16 rounded-full flex items-center justify-center
                    ${isDragging 
                      ? 'bg-blue-100 dark:bg-blue-900/40' 
                      : 'bg-gray-100 dark:bg-gray-800'
                    }
                  `}>
                    <Upload className={`
                      h-8 w-8
                      ${isDragging 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-gray-400 dark:text-gray-600'
                      }
                    `} />
                  </div>
                  
                  <div>
                    <p className="font-medium text-sm">
                      {isDragging 
                        ? 'Suelta las imágenes aquí' 
                        : 'Arrastra imágenes o haz clic para seleccionar'
                      }
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Soporta múltiples archivos • PNG, JPG, GIF
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="mt-2"
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Seleccionar Archivos
                  </Button>
                </div>
              </div>

              {/* Lista de fotografías */}
              {hallazgoForm.fotografias.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {hallazgoForm.fotografias.map((foto, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative group"
                    >
                      <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                        <img
                          src={foto.url}
                          alt={foto.descripcion || 'Fotografía'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={() => {
                          setHallazgoForm({
                            ...hallazgoForm,
                            fotografias: hallazgoForm.fotografias.filter((_, i) => i !== index)
                          });
                        }}
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      {foto.descripcion && (
                        <p className="text-xs mt-1 text-muted-foreground truncate px-1">{foto.descripcion}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button onClick={() => {
              setIsReportarHallazgoIndependienteOpen(false);
              setHallazgoForm({
                tipo: 'Ambiental',
                titulo: '',
                descripcion: '',
                gravedad: 'Media',
                latitud: '',
                longitud: '',
                fotografias: []
              });
              setFotoTemp({ url: '', descripcion: '' });
            }} variant="outline">
              Cancelar
            </Button>
            <Button 
              onClick={handleReportarHallazgoIndependiente} 
              disabled={!hallazgoForm.titulo || !hallazgoForm.descripcion}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Reportar Hallazgo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
