import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Plus, Edit, Search, Calendar as CalendarIcon, Clock, MapPin, Users, Shield, CheckCircle, AlertCircle, XCircle, Play, MoreVertical, Binoculars, Wrench, GraduationCap, Eye, Map, ChevronDown, Activity, User, FileText, Flame, TreePine, Sprout } from 'lucide-react';
import { actividades, guardarecursos } from '../data/mock-data';
import { Actividad } from '../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'motion/react';
import { actividadesSync } from '../utils/actividadesSync';

interface PlanificacionActividadesProps {
  userPermissions: {
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
  };
}

export function PlanificacionActividades({ userPermissions }: PlanificacionActividadesProps) {
  const actividadesAdicionales = [
    {
      id: '7',
      tipo: 'Patrullaje de Control y Vigilancia' as const,
      descripcion: 'Patrullaje nocturno en zona fronteriza',
      fecha: '2025-10-19',
      horaInicio: '18:00',
      horaFin: '23:00',
      ubicacion: 'Frontera Norte - Zona 3',
      coordenadas: { lat: 17.0651, lng: -89.9098 },
      guardarecurso: '4',
      estado: 'Programada' as const,
      observaciones: 'Requiere linterna y equipo de comunicación',
      evidencias: [],
      hallazgos: []
    },
    {
      id: '8',
      tipo: 'Actividades de Prevención y Atención de Incendios Forestales' as const,
      descripcion: 'Capacitación en prevención de incendios',
      fecha: '2025-10-20',
      horaInicio: '09:00',
      horaFin: '11:00',
      ubicacion: 'Centro de Visitantes',
      guardarecurso: '5',
      estado: 'Programada' as const,
      observaciones: 'Preparar material didáctico y equipo contra incendios',
      evidencias: [],
      hallazgos: []
    },
    {
      id: '9',
      tipo: 'Mantenimiento de Área Protegida' as const,
      descripcion: 'Reparación de señalización dañada',
      fecha: '2025-10-21',
      horaInicio: '07:00',
      horaFin: '12:00',
      ubicacion: 'Sendero El Mirador',
      coordenadas: { lat: 17.2450, lng: -89.6400 },
      guardarecurso: '6',
      estado: 'Programada' as const,
      observaciones: 'Llevar herramientas y material de señalización',
      evidencias: [],
      hallazgos: []
    },
    {
      id: '10',
      tipo: 'Reforestación de Área Protegida' as const,
      descripcion: 'Plantación de árboles nativos en zona degradada',
      fecha: '2025-10-22',
      horaInicio: '06:00',
      horaFin: '14:00',
      ubicacion: 'Límite Oeste',
      coordenadas: { lat: 17.2100, lng: -89.7200 },
      guardarecurso: '7',
      estado: 'Programada' as const,
      observaciones: 'Verificar posibles invasiones',
      evidencias: [],
      hallazgos: []
    },
    {
      id: '11',
      tipo: 'Investigación' as const,
      descripcion: 'Conteo de fauna silvestre',
      fecha: '2025-10-23',
      horaInicio: '05:00',
      horaFin: '10:00',
      ubicacion: 'Zona de Bosque Húmedo',
      coordenadas: { lat: 17.2600, lng: -89.6100 },
      guardarecurso: '8',
      estado: 'Programada' as const,
      observaciones: 'Monitoreo mensual de especies',
      evidencias: [],
      hallazgos: []
    },
    {
      id: '12',
      tipo: 'Ronda' as const,
      descripcion: 'Ronda general matutina',
      fecha: '2025-10-24',
      horaInicio: '06:00',
      horaFin: '09:00',
      ubicacion: 'Circuito Principal',
      guardarecurso: '9',
      estado: 'Programada' as const,
      observaciones: 'Ronda de verificación general',
      evidencias: [],
      hallazgos: []
    },
    {
      id: '13',
      tipo: 'Patrullaje' as const,
      descripcion: 'Vigilancia zona de anidación',
      fecha: '2025-10-25',
      horaInicio: '15:00',
      horaFin: '18:00',
      ubicacion: 'Playa de Anidación',
      coordenadas: { lat: 17.1800, lng: -89.5900 },
      guardarecurso: '10',
      estado: 'Programada' as const,
      observaciones: 'Temporada de anidación activa',
      evidencias: [],
      hallazgos: []
    },
    {
      id: '14',
      tipo: 'Mantenimiento' as const,
      descripcion: 'Limpieza de senderos y miradores',
      fecha: '2025-10-26',
      horaInicio: '07:00',
      horaFin: '13:00',
      ubicacion: 'Senderos principales',
      guardarecurso: '11',
      estado: 'Programada' as const,
      observaciones: 'Mantenimiento mensual preventivo',
      evidencias: [],
      hallazgos: []
    },
    {
      id: '15',
      tipo: 'Control y Vigilancia' as const,
      descripcion: 'Operativo contra caza ilegal',
      fecha: '2025-10-27',
      horaInicio: '04:00',
      horaFin: '12:00',
      ubicacion: 'Zona Núcleo',
      coordenadas: { lat: 17.2900, lng: -89.6300 },
      guardarecurso: '12',
      estado: 'Programada' as const,
      observaciones: 'Coordinar con autoridades',
      evidencias: [],
      hallazgos: []
    },
    // Actividades de patrullaje completadas con rutas GPS
    {
      id: '16',
      tipo: 'Patrullaje' as const,
      descripcion: 'Patrullaje perimetral sector norte',
      fecha: '2025-10-12',
      horaInicio: '06:00',
      horaFin: '09:45',
      ubicacion: 'Perímetro Norte - Tikal',
      coordenadas: { lat: 17.2328, lng: -89.6239 },
      guardarecurso: '1',
      estado: 'Completada' as const,
      observaciones: 'Ruta completada sin incidentes. Se detectó presencia de fauna silvestre en buen estado.',
      evidencias: [],
      hallazgos: [],
      ruta: [
        { lat: 17.2328, lng: -89.6239, timestamp: '2025-10-12T06:00:00Z' },
        { lat: 17.2398, lng: -89.6289, timestamp: '2025-10-12T06:25:00Z' },
        { lat: 17.2478, lng: -89.6259, timestamp: '2025-10-12T06:50:00Z' },
        { lat: 17.2528, lng: -89.6189, timestamp: '2025-10-12T07:15:00Z' },
        { lat: 17.2508, lng: -89.6119, timestamp: '2025-10-12T07:40:00Z' },
        { lat: 17.2438, lng: -89.6069, timestamp: '2025-10-12T08:05:00Z' },
        { lat: 17.2368, lng: -89.6099, timestamp: '2025-10-12T08:30:00Z' },
        { lat: 17.2298, lng: -89.6169, timestamp: '2025-10-12T08:55:00Z' },
        { lat: 17.2328, lng: -89.6239, timestamp: '2025-10-12T09:20:00Z' }
      ]
    },
    {
      id: '17',
      tipo: 'Patrullaje' as const,
      descripcion: 'Vigilancia nocturna zona arqueológica',
      fecha: '2025-10-13',
      horaInicio: '18:00',
      horaFin: '23:15',
      ubicacion: 'Zona Arqueológica Central',
      coordenadas: { lat: 17.2300, lng: -89.6200 },
      guardarecurso: '2',
      estado: 'Completada' as const,
      observaciones: 'Patrullaje nocturno exitoso. No se detectaron intrusiones.',
      evidencias: [],
      hallazgos: [],
      ruta: [
        { lat: 17.2300, lng: -89.6200, timestamp: '2025-10-13T18:00:00Z' },
        { lat: 17.2320, lng: -89.6180, timestamp: '2025-10-13T18:35:00Z' },
        { lat: 17.2350, lng: -89.6210, timestamp: '2025-10-13T19:10:00Z' },
        { lat: 17.2380, lng: -89.6230, timestamp: '2025-10-13T19:45:00Z' },
        { lat: 17.2360, lng: -89.6260, timestamp: '2025-10-13T20:20:00Z' },
        { lat: 17.2330, lng: -89.6240, timestamp: '2025-10-13T20:55:00Z' },
        { lat: 17.2300, lng: -89.6220, timestamp: '2025-10-13T21:30:00Z' },
        { lat: 17.2280, lng: -89.6200, timestamp: '2025-10-13T22:05:00Z' },
        { lat: 17.2300, lng: -89.6200, timestamp: '2025-10-13T22:40:00Z' }
      ]
    },
    {
      id: '18',
      tipo: 'Patrullaje de Control y Vigilancia' as const,
      descripcion: 'Recorrido sendero El Mirador',
      fecha: '2025-10-14',
      horaInicio: '07:00',
      horaFin: '12:30',
      ubicacion: 'Sendero El Mirador',
      coordenadas: { lat: 17.2450, lng: -89.6400 },
      guardarecurso: '3',
      estado: 'Completada' as const,
      observaciones: 'Sendero en buenas condiciones. Se observaron grupos de monos aulladores.',
      evidencias: [],
      hallazgos: [],
      ruta: [
        { lat: 17.2450, lng: -89.6400, timestamp: '2025-10-14T07:00:00Z' },
        { lat: 17.2480, lng: -89.6370, timestamp: '2025-10-14T07:30:00Z' },
        { lat: 17.2520, lng: -89.6340, timestamp: '2025-10-14T08:00:00Z' },
        { lat: 17.2560, lng: -89.6310, timestamp: '2025-10-14T08:30:00Z' },
        { lat: 17.2590, lng: -89.6340, timestamp: '2025-10-14T09:00:00Z' },
        { lat: 17.2600, lng: -89.6380, timestamp: '2025-10-14T09:30:00Z' },
        { lat: 17.2570, lng: -89.6410, timestamp: '2025-10-14T10:00:00Z' },
        { lat: 17.2530, lng: -89.6430, timestamp: '2025-10-14T10:30:00Z' },
        { lat: 17.2490, lng: -89.6420, timestamp: '2025-10-14T11:00:00Z' },
        { lat: 17.2450, lng: -89.6400, timestamp: '2025-10-14T11:30:00Z' }
      ]
    },
  ];

  const [actividadesList, setActividadesList] = useState<any[]>([]);

  // Inicializar y sincronizar actividades
  useEffect(() => {
    // Combinar actividades de mock-data con actividades adicionales
    const todasLasActividades = [...actividades, ...actividadesAdicionales];
    
    // Inicializar el sync con todas las actividades
    actividadesSync.updateActividades(todasLasActividades);
    
    // Suscribirse a cambios
    const unsubscribe = actividadesSync.subscribe((actividades) => {
      setActividadesList(actividades);
    });

    return unsubscribe;
  }, []); // Solo ejecutar una vez al montar
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipo, setSelectedTipo] = useState<string>('todos');
  const [selectedEstado, setSelectedEstado] = useState<string>('todos');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingActividad, setEditingActividad] = useState<Actividad | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  

  
  const [formData, setFormData] = useState({
    codigo: '',
    titulo: '',
    tipo: '',
    descripcion: '',
    fecha: '',
    horaInicio: '',
    horaFin: '',
    ubicacion: '',
    coordenadas: { lat: 0, lng: 0 },
    guardarecurso: '',
    observaciones: ''
  });

  const filteredActividades = useMemo(() => {
    return actividadesList.filter(a => {
      // SOLO mostrar actividades Programadas (no mostrar En Progreso ni Completadas)
      const isProgramada = a.estado === 'Programada';
      
      const matchesSearch = 
        a.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.ubicacion.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTipo = selectedTipo === 'todos' || a.tipo === selectedTipo;
      const matchesEstado = selectedEstado === 'todos' || a.estado === selectedEstado;
      
      return isProgramada && matchesSearch && matchesTipo && matchesEstado;
    });
  }, [actividadesList, searchTerm, selectedTipo, selectedEstado]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingActividad) {
      actividadesSync.updateActividad(editingActividad.id, {
        ...formData,
        tipo: formData.tipo as any,
        coordenadas: formData.coordenadas.lat === 0 && formData.coordenadas.lng === 0 ? undefined : formData.coordenadas
      });
    } else {
      const nuevaActividad: Actividad = {
        id: Date.now().toString(),
        ...formData,
        tipo: formData.tipo as any,
        estado: 'Programada', // Siempre se crea como Programada
        coordenadas: formData.coordenadas.lat === 0 && formData.coordenadas.lng === 0 ? undefined : formData.coordenadas,
        evidencias: [],
        hallazgos: []
      };
      actividadesSync.addActividad(nuevaActividad);
    }
    
    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      codigo: '',
      titulo: '',
      tipo: '',
      descripcion: '',
      fecha: '',
      horaInicio: '',
      horaFin: '',
      ubicacion: '',
      coordenadas: { lat: 0, lng: 0 },
      guardarecurso: '',
      observaciones: ''
    });
    setSelectedDate(undefined);
    setEditingActividad(null);
  };

  const handleEdit = (actividad: Actividad) => {
    setFormData({
      tipo: actividad.tipo,
      descripcion: actividad.descripcion,
      fecha: actividad.fecha,
      horaInicio: actividad.horaInicio,
      horaFin: actividad.horaFin || '',
      ubicacion: actividad.ubicacion,
      coordenadas: actividad.coordenadas || { lat: 0, lng: 0 },
      guardarecurso: actividad.guardarecurso,
      observaciones: actividad.observaciones || ''
    });
    setSelectedDate(new Date(actividad.fecha));
    setEditingActividad(actividad);
    setIsDialogOpen(true);
  };



  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Patrullaje de Control y Vigilancia': return { 
        bg: 'bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40', 
        text: 'text-blue-700 dark:text-blue-300', 
        badge: 'bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
      };
      case 'Actividades de Prevención y Atención de Incendios Forestales': return { 
        bg: 'bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/40 dark:to-orange-900/40', 
        text: 'text-red-700 dark:text-red-300', 
        badge: 'bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/40 dark:to-orange-900/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
      };
      case 'Mantenimiento de Área Protegida': return { 
        bg: 'bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40', 
        text: 'text-orange-700 dark:text-orange-300', 
        badge: 'bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800'
      };
      case 'Reforestación de Área Protegida': return { 
        bg: 'bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40', 
        text: 'text-green-700 dark:text-green-300', 
        badge: 'bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
      };
      case 'Mantenimiento de Reforestación': return { 
        bg: 'bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/40 dark:to-cyan-900/40', 
        text: 'text-teal-700 dark:text-teal-300', 
        badge: 'bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/40 dark:to-cyan-900/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
      };
      default: return { 
        bg: 'bg-gray-100 dark:bg-gray-700', 
        text: 'text-gray-700 dark:text-gray-300', 
        badge: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
      };
    }
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
        icon: AlertCircle, 
        color: 'text-gray-600 dark:text-gray-400', 
        bg: 'bg-gray-100 dark:bg-gray-700',
        badge: 'bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-500/20'
      };
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'Patrullaje de Control y Vigilancia': return Binoculars;
      case 'Actividades de Prevención y Atención de Incendios Forestales': return Flame;
      case 'Mantenimiento de Área Protegida': return Wrench;
      case 'Reforestación de Área Protegida': return TreePine;
      case 'Mantenimiento de Reforestación': return Sprout;
      default: return CalendarIcon;
    }
  };

  const getEstadoBadgeClass = (estado: string) => {
    switch (estado) {
      case 'Programada':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-300 dark:border-blue-700';
      case 'En Progreso':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-700';
      case 'Completada':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-300 dark:border-green-700';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400 border border-gray-300 dark:border-gray-700';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'Programada': return Clock;
      case 'En Progreso': return Play;
      case 'Completada': return CheckCircle;
      default: return XCircle;
    }
  };

  const estadisticas = useMemo(() => {
    return {
      total: actividadesList.length,
      programadas: actividadesList.filter(a => a.estado === 'Programada').length,
      enProgreso: actividadesList.filter(a => a.estado === 'En Progreso').length,
      completadas: actividadesList.filter(a => a.estado === 'Completada').length,
    };
  }, [actividadesList]);

  const tiposActividad = [
    'Patrullaje de Control y Vigilancia',
    'Actividades de Prevención y Atención de Incendios Forestales',
    'Mantenimiento de Área Protegida',
    'Reforestación de Área Protegida',
    'Mantenimiento de Reforestación'
  ];

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda y filtros */}
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
                    placeholder="Buscar actividades..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  />
                </div>
              </div>
              
              {/* Botón nueva actividad */}
              {userPermissions.canCreate && (
                <Button 
                  onClick={() => {
                    resetForm();
                    setIsDialogOpen(true);
                  }}
                  className="w-full sm:w-auto h-10 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 whitespace-nowrap text-xs sm:text-sm"
                >
                  <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                  Nueva Actividad
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
                  {tiposActividad.map(tipo => (
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
                  <SelectItem value="Programada">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      Programada
                    </div>
                  </SelectItem>
                  <SelectItem value="En Progreso">
                    <div className="flex items-center gap-2">
                      <Play className="h-4 w-4 text-yellow-600" />
                      En Progreso
                    </div>
                  </SelectItem>
                  <SelectItem value="Completada">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Completada
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>

        {/* Diálogo para crear/editar */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="w-[95vw] sm:w-[90vw] max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader className="pb-3 sm:pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg flex-shrink-0">
                  <CalendarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <DialogTitle className="text-base sm:text-xl md:text-2xl truncate">
                    {editingActividad ? 'Editar Actividad' : 'Nueva Actividad'}
                  </DialogTitle>
                  <DialogDescription className="text-xs sm:text-sm truncate">
                    Complete la información de la actividad
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 pt-3 sm:pt-4">
              {/* Información General */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                    <Activity className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base">Información General</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pl-0 sm:pl-10">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="codigo" className="text-sm">Código *</Label>
                    <Input
                      id="codigo"
                      value={formData.codigo || ''}
                      onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                      placeholder="ACT-2024-001"
                      className="h-10 sm:h-11"
                      required
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="titulo" className="text-sm">Título de Actividad *</Label>
                    <Input
                      id="titulo"
                      value={formData.titulo || ''}
                      onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                      placeholder="Patrullaje zona norte"
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
                          <SelectItem key={tipo} value={tipo}>
                            {tipo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="guardarecurso" className="text-sm">Guardarecurso Asignado *</Label>
                    <Select value={formData.guardarecurso} onValueChange={(value) => setFormData({...formData, guardarecurso: value})}>
                      <SelectTrigger className="h-10 sm:h-11">
                        <SelectValue placeholder="Seleccione guardarecurso" />
                      </SelectTrigger>
                      <SelectContent>
                        {guardarecursos.map(g => (
                          <SelectItem key={g.id} value={g.id}>
                            {g.nombre} {g.apellido} - {g.puesto}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2 sm:col-span-2">
                    <Label htmlFor="descripcion" className="text-sm">Descripción *</Label>
                    <Textarea
                      id="descripcion"
                      value={formData.descripcion}
                      onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                      placeholder="Describa la actividad a realizar..."
                      rows={3}
                      required
                      className="resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Programación */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base">Programación</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pl-0 sm:pl-10">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-sm">Fecha de Programación *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start text-left h-10 sm:h-11"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            setSelectedDate(date);
                            if (date) {
                              setFormData({...formData, fecha: format(date, 'yyyy-MM-dd')});
                            }
                          }}
                          initialFocus
                          locale={es}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="horaProgramacion" className="text-sm">Hora de Programación *</Label>
                    <Input
                      id="horaProgramacion"
                      type="time"
                      value={formData.horaInicio}
                      onChange={(e) => setFormData({...formData, horaInicio: e.target.value})}
                      className="h-10 sm:h-11"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Ubicación */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base">Ubicación</h3>
                </div>
                
                <div className="pl-0 sm:pl-10">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="ubicacion" className="text-sm">Ubicación *</Label>
                    <Input
                      id="ubicacion"
                      value={formData.ubicacion}
                      onChange={(e) => setFormData({...formData, ubicacion: e.target.value})}
                      placeholder="Ej: Sendero Principal, Zona Norte"
                      className="h-10 sm:h-11"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Observaciones */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base">Observaciones</h3>
                </div>
                
                <div className="pl-0 sm:pl-10">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="observaciones" className="text-sm">Notas Adicionales</Label>
                    <Textarea
                      id="observaciones"
                      value={formData.observaciones}
                      onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                      placeholder="Notas adicionales sobre la actividad..."
                      rows={3}
                      className="resize-none"
                    />
                  </div>
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
                  className="w-full sm:w-auto h-10 sm:h-11 bg-gradient-to-r from-blue-600 to-cyan-700 hover:from-blue-700 hover:to-cyan-800"
                >
                  {editingActividad ? 'Actualizar' : 'Guardar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </Card>

      {/* Estadísticas responsive: arriba en móvil/tablet, sidebar en desktop */}
      <div className="lg:hidden mb-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <Card className="border-0 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 shadow-md">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col items-center justify-center gap-1 sm:gap-1.5">
                <CalendarIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-700 dark:text-blue-300" />
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

      {/* Grid principal: Actividades a la izquierda, Estadísticas a la derecha (solo desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Columna izquierda: Grid de actividades */}
        <div className="lg:col-span-11">
          {filteredActividades.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 sm:p-12">
                <div className="text-center">
                  <CalendarIcon className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 text-muted-foreground opacity-30" />
                  <h3 className="mb-2 text-sm sm:text-base">No se encontraron actividades</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                    No hay actividades que coincidan con los filtros seleccionados
                  </p>
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
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
              {filteredActividades.map((actividad, index) => {
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
                  >
                    <Card className="hover:shadow-xl transition-all duration-200 border-0 shadow-md overflow-hidden h-full">
                      <CardContent className="p-0">
                        {/* Header con tipo y estado */}
                        <div className={`${tipoColor.bg} p-4 sm:p-5 border-b-2 border-white/50 dark:border-gray-700/50 relative`}>
                          {/* Botón editar en esquina superior derecha */}
                          {userPermissions.canEdit && (
                            <Button
                              onClick={() => handleEdit(actividad)}
                              variant="ghost"
                              size="sm"
                              className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 backdrop-blur-sm shadow-sm"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                          )}

                          <div className="space-y-3 pr-10">
                            {/* Badge de tipo y estado */}
                            <div className="flex flex-col gap-2">
                              <Badge 
                                variant="outline" 
                                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-xs flex items-center gap-1.5 px-2.5 py-1 border-0 shadow-sm w-fit max-w-full"
                              >
                                <TipoIcon className="h-3 w-3 flex-shrink-0" />
                                <span className={`${tipoColor.text} line-clamp-1 text-left`}>{actividad.tipo}</span>
                              </Badge>
                              
                              <div className={`${estadoInfo.bg} px-2 py-1 rounded-md flex items-center gap-1 shadow-sm border border-white/20 w-fit`}>
                                <EstadoIcon className={`h-3 w-3 flex-shrink-0 ${estadoInfo.color} ${actividad.estado === 'En Progreso' ? 'animate-pulse' : ''}`} />
                                <span className={`text-xs font-medium ${estadoInfo.color} whitespace-nowrap`}>
                                  {actividad.estado}
                                </span>
                              </div>
                            </div>

                            {/* Código */}
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-mono ${tipoColor.text} opacity-75 truncate`}>
                                {(actividad as any).codigo || `ACT-${actividad.id.padStart(4, '0')}`}
                              </span>
                            </div>

                            {/* Título */}
                            <h3 className="font-semibold line-clamp-2 text-base sm:text-lg leading-tight text-gray-900 dark:text-white">
                              {(actividad as any).titulo || actividad.descripcion}
                            </h3>

                            {/* Fecha y Horario destacados */}
                            <div className="flex items-center gap-3 text-sm">
                              <div className="flex items-center gap-1.5">
                                <CalendarIcon className={`h-4 w-4 ${tipoColor.text}`} />
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {new Date(actividad.fecha).toLocaleDateString('es-GT', { 
                                    day: 'numeric', 
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Clock className={`h-4 w-4 ${tipoColor.text}`} />
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {actividad.horaInicio}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Contenido de la card */}
                        <div className="p-4 sm:p-5 space-y-3">{/* Detalles de la actividad */}

                          {/* Descripción si existe título */}
                          {(actividad as any).titulo && (
                            <div className="pb-3 border-b border-gray-100 dark:border-gray-800">
                              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                {actividad.descripcion}
                              </p>
                            </div>
                          )}

                          {/* Ubicación */}
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 flex items-center justify-center flex-shrink-0 shadow-sm">
                              <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{actividad.ubicacion}</p>
                              {actividad.coordenadas && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {actividad.coordenadas.lat.toFixed(4)}, {actividad.coordenadas.lng.toFixed(4)}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Guardarecurso */}
                          {guardarecurso && (
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-semibold flex-shrink-0 shadow-md">
                                {guardarecurso.nombre[0]}{guardarecurso.apellido[0]}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {guardarecurso.nombre} {guardarecurso.apellido}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                                  {guardarecurso.puesto}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Observaciones */}
                          {actividad.observaciones && (
                            <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                              <div className="flex items-start gap-2">
                                <FileText className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-muted-foreground line-clamp-2 flex-1">
                                  {actividad.observaciones}
                                </p>
                              </div>
                            </div>
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

        {/* Columna derecha: Estadísticas (solo visible en desktop LG+) */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24 grid grid-cols-1 gap-2">
            <Card className="border-0 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 shadow-md">
              <CardContent className="p-2">
                <div className="flex flex-col items-center justify-center">
                  <CalendarIcon className="h-5 w-5 text-blue-700 dark:text-blue-300 mb-1" />
                  <p className="text-xl text-blue-800 dark:text-blue-200">{estadisticas.total}</p>
                  <p className="text-[10px] text-blue-700/80 dark:text-blue-300/80 text-center leading-tight">Total</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-gradient-to-br from-cyan-100 to-cyan-200 dark:from-cyan-900/40 dark:to-cyan-800/40 shadow-md">
              <CardContent className="p-2">
                <div className="flex flex-col items-center justify-center">
                  <Clock className="h-5 w-5 text-cyan-700 dark:text-cyan-300 mb-1" />
                  <p className="text-xl text-cyan-800 dark:text-cyan-200">{estadisticas.programadas}</p>
                  <p className="text-[10px] text-cyan-700/80 dark:text-cyan-300/80 text-center leading-tight">Programadas</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/40 dark:to-yellow-800/40 shadow-md">
              <CardContent className="p-2">
                <div className="flex flex-col items-center justify-center">
                  <Play className="h-5 w-5 text-yellow-700 dark:text-yellow-300 mb-1" />
                  <p className="text-xl text-yellow-800 dark:text-yellow-200">{estadisticas.enProgreso}</p>
                  <p className="text-[10px] text-yellow-700/80 dark:text-yellow-300/80 text-center leading-tight">En Progreso</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 shadow-md">
              <CardContent className="p-2">
                <div className="flex flex-col items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-700 dark:text-green-300 mb-1" />
                  <p className="text-xl text-green-800 dark:text-green-200">{estadisticas.completadas}</p>
                  <p className="text-[10px] text-green-700/80 dark:text-green-300/80 text-center leading-tight">Completadas</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

    </div>
  );
}
