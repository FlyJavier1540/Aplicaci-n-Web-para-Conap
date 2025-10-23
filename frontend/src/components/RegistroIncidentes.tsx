import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, AlertTriangle, Users, MapPin, Eye, FileText, Clock, CheckCircle, AlertCircle, ListPlus, History, Search, Activity, TrendingUp, XCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { toast } from 'sonner@2.0.3';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Incidente {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: 'Visitante' | 'Comunidad' | 'Turista' | 'Investigador' | 'Autoridad' | 'Emergencia';
  gravedad: 'Leve' | 'Moderado' | 'Grave' | 'Crítico';
  estado: 'Reportado' | 'En Atención' | 'Escalado' | 'Resuelto';
  coordenadas: { lat: number; lng: number };
  areaProtegida: string;
  guardarecurso: string;
  fechaIncidente: string;
  fechaReporte: string;
  fechaResolucion?: string;
  personasInvolucradas: string[];
  acciones: string[];
  autoridades: string[];
  seguimiento: Array<{
    fecha: string;
    accion: string;
    responsable: string;
    observaciones: string;
  }>;
  observaciones: string;
}

interface RegistroIncidentesProps {
  userPermissions?: {
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
  };
  currentUser?: any;
}

export function RegistroIncidentes({ userPermissions = { canView: true, canCreate: true, canEdit: true, canDelete: true }, currentUser }: RegistroIncidentesProps) {
  const [incidentesList, setIncidentesList] = useState<Incidente[]>([
    {
      id: '1',
      titulo: 'Conflicto con visitantes por acceso restringido',
      descripcion: 'Grupo de turistas intentó acceder a zona restringida sin autorización y se mostró agresivo al ser detenido',
      tipo: 'Turista',
      gravedad: 'Moderado',
      estado: 'Resuelto',
      coordenadas: { lat: 17.2328, lng: -89.6239 },
      areaProtegida: 'tikal',
      guardarecurso: '1',
      fechaIncidente: '2024-09-01T14:30:00Z',
      fechaReporte: '2024-09-01T14:45:00Z',
      fechaResolucion: '2024-09-01T16:00:00Z',
      personasInvolucradas: ['Juan Pérez (guía turístico)', '4 turistas extranjeros'],
      acciones: ['Explicación de normas', 'Redirección a zona permitida', 'Registro de incidente'],
      autoridades: [],
      seguimiento: [
        {
          fecha: '2024-09-01T14:45:00Z',
          accion: 'Reporte inicial',
          responsable: 'Carlos Mendoza',
          observaciones: 'Incidente controlado sin mayores complicaciones'
        },
        {
          fecha: '2024-09-01T15:15:00Z',
          accion: 'Intervención y mediación',
          responsable: 'Carlos Mendoza',
          observaciones: 'Se explicó la importancia de respetar las zonas restringidas'
        },
        {
          fecha: '2024-09-01T16:00:00Z',
          accion: 'Resolución',
          responsable: 'Carlos Mendoza',
          observaciones: 'Visitantes aceptaron explicación y continuaron tour en zona permitida'
        }
      ],
      observaciones: 'Se recomienda mejorar señalización en el área'
    },
    {
      id: '2',
      titulo: 'Solicitud de comunidad local por recursos',
      descripcion: 'Representantes de comunidad solicitan permiso para recolección de plantas medicinales',
      tipo: 'Comunidad',
      gravedad: 'Leve',
      estado: 'En Atención',
      coordenadas: { lat: 16.9229, lng: -89.9053 },
      areaProtegida: 'biotopo-cerro-cahui',
      guardarecurso: '2',
      fechaIncidente: '2024-08-30T10:00:00Z',
      fechaReporte: '2024-08-30T10:15:00Z',
      personasInvolucradas: ['Alcalde auxiliar', '5 representantes comunitarios'],
      acciones: ['Reunión informativa', 'Documentación de solicitud'],
      autoridades: ['CONAP Regional'],
      seguimiento: [
        {
          fecha: '2024-08-30T10:15:00Z',
          accion: 'Reporte y escalación',
          responsable: 'María García',
          observaciones: 'Solicitud enviada a oficinas centrales para evaluación'
        },
        {
          fecha: '2024-09-02T09:00:00Z',
          accion: 'Reunión con comunidad',
          responsable: 'María García',
          observaciones: 'Se estableció diálogo para encontrar soluciones conjuntas'
        }
      ],
      observaciones: 'Requiere evaluación de impacto ambiental'
    },
    {
      id: '3',
      titulo: 'Visitantes alimentando fauna silvestre',
      descripcion: 'Turistas fueron observados alimentando monos en zona prohibida',
      tipo: 'Visitante',
      gravedad: 'Leve',
      estado: 'Reportado',
      coordenadas: { lat: 17.2215, lng: -89.6254 },
      areaProtegida: 'tikal',
      guardarecurso: '1',
      fechaIncidente: '2024-09-08T11:00:00Z',
      fechaReporte: '2024-09-08T11:15:00Z',
      personasInvolucradas: ['Familia de 4 personas', 'Guía turístico local'],
      acciones: ['Intervención educativa', 'Decomiso de alimentos'],
      autoridades: [],
      seguimiento: [
        {
          fecha: '2024-09-08T11:15:00Z',
          accion: 'Reporte inicial',
          responsable: 'Carlos Mendoza',
          observaciones: 'Visitantes fueron educados sobre el impacto de alimentar fauna'
        }
      ],
      observaciones: 'Se requiere campaña de concientización más visible'
    },
    {
      id: '4',
      titulo: 'Turistas extraviados en sendero del volcán',
      descripcion: 'Pareja de turistas se desvió del sendero principal y se extravió durante aproximadamente 2 horas en la zona de descenso del volcán',
      tipo: 'Emergencia',
      gravedad: 'Moderado',
      estado: 'Resuelto',
      coordenadas: { lat: 14.3815, lng: -90.6018 },
      areaProtegida: '2',
      guardarecurso: '3',
      fechaIncidente: '2024-10-14T16:30:00Z',
      fechaReporte: '2024-10-14T16:45:00Z',
      fechaResolucion: '2024-10-14T18:30:00Z',
      personasInvolucradas: ['Pareja de turistas alemanes (2 personas)'],
      acciones: ['Búsqueda y rescate', 'Primeros auxilios básicos', 'Orientación y acompañamiento'],
      autoridades: [],
      seguimiento: [
        {
          fecha: '2024-10-14T16:45:00Z',
          accion: 'Reporte de emergencia',
          responsable: 'José López',
          observaciones: 'Se recibió reporte de guía turístico sobre pareja extraviada. Se inició protocolo de búsqueda.'
        },
        {
          fecha: '2024-10-14T17:15:00Z',
          accion: 'Localización de visitantes',
          responsable: 'José López',
          observaciones: 'Turistas localizados a 500 metros del sendero principal, desorientados pero en buen estado de salud.'
        },
        {
          fecha: '2024-10-14T17:45:00Z',
          accion: 'Atención y evaluación',
          responsable: 'José López',
          observaciones: 'Se proporcionó agua e hidratación. Ambos presentaban cansancio leve pero sin lesiones. Se verificó estado general.'
        },
        {
          fecha: '2024-10-14T18:30:00Z',
          accion: 'Resolución exitosa',
          responsable: 'José López',
          observaciones: 'Turistas acompañados de regreso al sendero principal y punto de partida. Se les educó sobre importancia de permanecer en senderos marcados.'
        }
      ],
      observaciones: 'Se recomienda mejorar la señalización en puntos críticos del descenso y considerar la instalación de marcadores más visibles. Los turistas agradecieron la pronta respuesta.'
    },
    {
      id: '5',
      titulo: 'Incidente con ceniza volcánica en zona turística',
      descripcion: 'Visitante sufrió irritación ocular por contacto con ceniza volcánica activa durante el recorrido cerca del cráter',
      tipo: 'Emergencia',
      gravedad: 'Leve',
      estado: 'En Atención',
      coordenadas: { lat: 14.3822, lng: -90.6008 },
      areaProtegida: '2',
      guardarecurso: '3',
      fechaIncidente: '2024-10-16T10:30:00Z',
      fechaReporte: '2024-10-16T10:35:00Z',
      personasInvolucradas: ['Turista nacional (1 persona)', 'Grupo de 6 personas'],
      acciones: ['Primeros auxilios', 'Lavado ocular', 'Recomendación médica'],
      autoridades: [],
      seguimiento: [
        {
          fecha: '2024-10-16T10:35:00Z',
          accion: 'Atención inmediata',
          responsable: 'José López',
          observaciones: 'Se aplicó lavado ocular con agua limpia. Visitante reporta mejoría pero persiste molestia leve.'
        },
        {
          fecha: '2024-10-16T11:00:00Z',
          accion: 'Evaluación y seguimiento',
          responsable: 'José López',
          observaciones: 'Se recomienda al visitante acudir a centro de salud más cercano para evaluación médica. Se proporcionó información de ubicación.'
        }
      ],
      observaciones: 'Incidente en seguimiento. Se debe verificar que el visitante reciba atención médica profesional si los síntomas persisten. Considerar alertas sobre riesgos de ceniza volcánica en días de mayor actividad.'
    },
    {
      id: '6',
      titulo: 'Visitante con lesión en tobillo durante ascenso',
      descripcion: 'Turista nacional sufrió esguince de tobillo al tropezar con roca suelta en la zona de ascenso al cráter',
      tipo: 'Turista',
      gravedad: 'Moderado',
      estado: 'Reportado',
      coordenadas: { lat: 14.3810, lng: -90.6025 },
      areaProtegida: '2',
      guardarecurso: '3',
      fechaIncidente: '2024-10-16T14:15:00Z',
      fechaReporte: '2024-10-16T14:20:00Z',
      personasInvolucradas: ['Visitante nacional - hombre de 35 años', 'Grupo familiar de 4 personas'],
      acciones: ['Evaluación de lesión', 'Inmovilización básica', 'Asistencia en descenso'],
      autoridades: [],
      seguimiento: [
        {
          fecha: '2024-10-16T14:20:00Z',
          accion: 'Reporte inicial',
          responsable: 'José López',
          observaciones: 'Visitante presenta inflamación en tobillo derecho. Se aplicó vendaje de compresión y se asistió en el descenso con apoyo.'
        }
      ],
      observaciones: 'Se recomienda al visitante acudir a centro médico para evaluación completa. Se sugiere mejorar señalización de zonas con terreno irregular.'
    },
    {
      id: '7',
      titulo: 'Grupo excedió horario permitido en área del volcán',
      descripcion: 'Grupo de 8 turistas permaneció en el área del cráter más allá del horario establecido, requiriendo escolta de regreso en condiciones de baja visibilidad',
      tipo: 'Visitante',
      gravedad: 'Leve',
      estado: 'Resuelto',
      coordenadas: { lat: 14.3820, lng: -90.6010 },
      areaProtegida: '2',
      guardarecurso: '3',
      fechaIncidente: '2024-10-15T17:45:00Z',
      fechaReporte: '2024-10-15T17:50:00Z',
      fechaResolucion: '2024-10-15T18:45:00Z',
      personasInvolucradas: ['Grupo de 8 turistas internacionales', 'Guía turístico local'],
      acciones: ['Ubicación del grupo', 'Escolta segura al punto de partida', 'Educación sobre normativas'],
      autoridades: [],
      seguimiento: [
        {
          fecha: '2024-10-15T17:50:00Z',
          accion: 'Reporte y búsqueda',
          responsable: 'José López',
          observaciones: 'Grupo localizado en zona del cráter 45 minutos después del horario límite. Condiciones de visibilidad comenzaban a deteriorarse.'
        },
        {
          fecha: '2024-10-15T18:15:00Z',
          accion: 'Escolta de regreso',
          responsable: 'José López',
          observaciones: 'Se proporcionó escolta al grupo utilizando linternas. Todos los visitantes descendieron sin incidentes.'
        },
        {
          fecha: '2024-10-15T18:45:00Z',
          accion: 'Resolución y educación',
          responsable: 'José López',
          observaciones: 'Se explicó la importancia de respetar horarios por seguridad. Guía turístico fue informado sobre las normativas y consecuencias.'
        }
      ],
      observaciones: 'Se recomienda reforzar comunicación de horarios límite en puntos de acceso. Considerar instalación de alertas sonoras o visuales 30 minutos antes del cierre.'
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipo, setSelectedTipo] = useState<string>('todos');
  const [selectedGravedad, setSelectedGravedad] = useState<string>('todos');
  const [selectedEstado, setSelectedEstado] = useState<string>('todos');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIncidente, setEditingIncidente] = useState<Incidente | null>(null);
  const [selectedIncidente, setSelectedIncidente] = useState<Incidente | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isSeguimientoDialogOpen, setIsSeguimientoDialogOpen] = useState(false);
  const [incidenteParaSeguimiento, setIncidenteParaSeguimiento] = useState<Incidente | null>(null);
  const [activeTab, setActiveTab] = useState('activos');
  
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    tipo: '',
    gravedad: 'Leve',
    coordenadas: { lat: 0, lng: 0 },
    areaProtegida: '',
    personasInvolucradas: '',
    observaciones: ''
  });

  const [seguimientoFormData, setSeguimientoFormData] = useState({
    accion: '',
    observaciones: ''
  });

  const tiposIncidente = ['Visitante', 'Comunidad', 'Turista', 'Investigador', 'Autoridad', 'Emergencia'];

  // Determinar si el usuario actual es un guardarecurso
  const isGuardarecurso = currentUser?.rol === 'Guardarecurso';
  const currentGuardarecursoId = isGuardarecurso ? currentUser?.id : null;

  // Separar incidentes activos y resueltos
  const incidentesActivos = useMemo(() => {
    return incidentesList.filter(i => {
      const esActivo = i.estado !== 'Resuelto';
      const matchesSearch = searchTerm === '' ||
        i.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTipo = selectedTipo === 'todos' || i.tipo === selectedTipo;
      const matchesGravedad = selectedGravedad === 'todos' || i.gravedad === selectedGravedad;
      const matchesEstado = selectedEstado === 'todos' || i.estado === selectedEstado;
      const matchesGuardarecurso = isGuardarecurso 
        ? i.guardarecurso === currentGuardarecursoId
        : true;
      
      return esActivo && matchesSearch && matchesTipo && matchesGravedad && matchesEstado && matchesGuardarecurso;
    });
  }, [incidentesList, searchTerm, selectedTipo, selectedGravedad, selectedEstado, isGuardarecurso, currentGuardarecursoId]);

  const incidentesResueltos = useMemo(() => {
    return incidentesList.filter(i => {
      const esResuelto = i.estado === 'Resuelto';
      const matchesSearch = searchTerm === '' ||
        i.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTipo = selectedTipo === 'todos' || i.tipo === selectedTipo;
      const matchesGravedad = selectedGravedad === 'todos' || i.gravedad === selectedGravedad;
      const matchesGuardarecurso = isGuardarecurso 
        ? i.guardarecurso === currentGuardarecursoId
        : true;
      
      return esResuelto && matchesSearch && matchesTipo && matchesGravedad && matchesGuardarecurso;
    });
  }, [incidentesList, searchTerm, selectedTipo, selectedGravedad, isGuardarecurso, currentGuardarecursoId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingIncidente) {
      setIncidentesList(prev => prev.map(i => 
        i.id === editingIncidente.id 
          ? { 
              ...i, 
              ...formData,
              tipo: formData.tipo as any,
              gravedad: formData.gravedad as any,
              personasInvolucradas: formData.personasInvolucradas.split('\n').filter(p => p.trim())
            }
          : i
      ));
      toast.success('Incidente actualizado', {
        description: 'El incidente ha sido actualizado correctamente'
      });
    } else {
      const nuevoIncidente: Incidente = {
        id: Date.now().toString(),
        ...formData,
        tipo: formData.tipo as any,
        gravedad: formData.gravedad as any,
        estado: 'Reportado',
        areaProtegida: formData.areaProtegida || 'tikal', // Área protegida por defecto
        guardarecurso: currentGuardarecursoId || '1',
        fechaIncidente: new Date().toISOString(),
        fechaReporte: new Date().toISOString(),
        personasInvolucradas: formData.personasInvolucradas.split('\n').filter(p => p.trim()),
        acciones: [],
        autoridades: [],
        seguimiento: [{
          fecha: new Date().toISOString(),
          accion: 'Reporte inicial',
          responsable: 'Sistema',
          observaciones: 'Incidente reportado a través del sistema'
        }]
      };
      setIncidentesList(prev => [...prev, nuevoIncidente]);
      toast.success('Incidente creado', {
        description: 'El incidente ha sido reportado correctamente'
      });
    }
    
    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      descripcion: '',
      tipo: '',
      gravedad: 'Leve',
      coordenadas: { lat: 0, lng: 0 },
      areaProtegida: '',
      personasInvolucradas: '',
      observaciones: ''
    });
    setEditingIncidente(null);
  };

  const handleView = (incidente: Incidente) => {
    setSelectedIncidente(incidente);
    setIsViewDialogOpen(true);
  };

  const handleAgregarSeguimiento = (incidente: Incidente) => {
    setIncidenteParaSeguimiento(incidente);
    setSeguimientoFormData({ accion: '', observaciones: '' });
    setIsSeguimientoDialogOpen(true);
  };

  const handleSeguimientoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!incidenteParaSeguimiento) return;
    
    const nuevoSeguimiento = {
      fecha: new Date().toISOString(),
      accion: seguimientoFormData.accion,
      responsable: 'Usuario Actual',
      observaciones: seguimientoFormData.observaciones
    };
    
    setIncidentesList(prev => prev.map(i => 
      i.id === incidenteParaSeguimiento.id
        ? {
            ...i,
            seguimiento: [...i.seguimiento, nuevoSeguimiento]
          }
        : i
    ));
    
    toast.success('Seguimiento agregado', {
      description: 'Se ha registrado la nueva acción de seguimiento'
    });
    
    setSeguimientoFormData({ accion: '', observaciones: '' });
    setIsSeguimientoDialogOpen(false);
    setIncidenteParaSeguimiento(null);
  };

  const handleCambiarEstado = (incidenteId: string, nuevoEstado: string) => {
    const incidente = incidentesList.find(i => i.id === incidenteId);
    if (!incidente) return;

    const estadosPermitidos: Record<string, string[]> = {
      'Reportado': ['En Atención', 'Escalado'],
      'En Atención': ['Escalado', 'Resuelto'],
      'Escalado': ['En Atención', 'Resuelto'],
      'Resuelto': []
    };

    if (!estadosPermitidos[incidente.estado]?.includes(nuevoEstado)) {
      toast.error('Cambio de estado no permitido', {
        description: `No se puede cambiar de ${incidente.estado} a ${nuevoEstado}`
      });
      return;
    }

    const nuevoSeguimiento = {
      fecha: new Date().toISOString(),
      accion: `Cambio de estado a ${nuevoEstado}`,
      responsable: 'Usuario Actual',
      observaciones: `Estado cambiado de ${incidente.estado} a ${nuevoEstado}`
    };

    setIncidentesList(prev => prev.map(i =>
      i.id === incidenteId
        ? {
            ...i,
            estado: nuevoEstado as any,
            seguimiento: [...i.seguimiento, nuevoSeguimiento],
            fechaResolucion: nuevoEstado === 'Resuelto' ? new Date().toISOString() : i.fechaResolucion
          }
        : i
    ));

    toast.success('Estado actualizado', {
      description: `El incidente ahora está en estado: ${nuevoEstado}`
    });
  };

  const getGravedadColor = (gravedad: string) => {
    switch (gravedad) {
      case 'Crítico': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-300 dark:border-red-700';
      case 'Grave': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-300 dark:border-orange-700';
      case 'Moderado': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-700';
      case 'Leve': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-300 dark:border-green-700';
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400 border border-gray-300 dark:border-gray-700';
    }
  };

  const getEstadoBadgeClass = (estado: string): string => {
    switch (estado) {
      case 'Reportado': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-300 dark:border-blue-700';
      case 'En Atención': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-300 dark:border-purple-700';
      case 'Escalado': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-300 dark:border-orange-700';
      case 'Resuelto': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-300 dark:border-green-700';
      default: return '';
    }
  };

  const estadisticas = useMemo(() => {
    return {
      total: incidentesList.length,
      activos: incidentesActivos.length,
      resueltos: incidentesResueltos.length,
      graves: incidentesList.filter(i => i.gravedad === 'Grave' || i.gravedad === 'Crítico').length,
      reportados: incidentesList.filter(i => i.estado === 'Reportado').length,
      enAtencion: incidentesList.filter(i => i.estado === 'En Atención').length,
      escalados: incidentesList.filter(i => i.estado === 'Escalado').length
    };
  }, [incidentesList, incidentesActivos, incidentesResueltos]);

  const renderIncidenteCard = (incidente: Incidente, index: number, showActions: boolean = true) => {
    const area = areasProtegidas.find(a => a.id === incidente.areaProtegida);
    const guardarecurso = guardarecursos.find(g => g.id === incidente.guardarecurso);
    
    return (
      <motion.div
        key={incidente.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
      >
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-4 sm:p-5">
            {/* Header */}
            <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                  <h3 className="font-semibold line-clamp-2 text-sm sm:text-base">
                    {incidente.titulo}
                  </h3>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={`${getEstadoBadgeClass(incidente.estado)} text-xs`}>
                    {incidente.estado}
                  </Badge>
                  <Badge className={`${getGravedadColor(incidente.gravedad)} text-xs`}>
                    {incidente.gravedad}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {incidente.tipo}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Contenido principal */}
            <div className="space-y-2.5 sm:space-y-3">
              {/* Descripción */}
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-100 dark:bg-gray-900/30 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm line-clamp-2">{incidente.descripcion}</p>
                </div>
              </div>

              {/* Ubicación */}
              {area && (
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium truncate">{area.nombre}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      {incidente.coordenadas.lat.toFixed(4)}, {incidente.coordenadas.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
              )}

              {/* Fecha */}
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium">
                    {format(new Date(incidente.fechaIncidente), "d 'de' MMMM, yyyy", { locale: es })}
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    {format(new Date(incidente.fechaIncidente), "HH:mm")}
                  </p>
                </div>
              </div>

              {/* Guardarecurso */}
              {guardarecurso && !isGuardarecurso && (
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                    <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium truncate">
                      {guardarecurso.nombre} {guardarecurso.apellido}
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                      Reportado por
                    </p>
                  </div>
                </div>
              )}

              {/* Botones de acción */}
              <div className="pt-2 sm:pt-3 border-t flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs sm:text-sm h-8 sm:h-9"
                  onClick={() => handleView(incidente)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Ver Detalles
                </Button>
                
                {showActions && userPermissions.canEdit && !isGuardarecurso && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="text-xs sm:text-sm h-8 sm:h-9">
                        <ListPlus className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel className="text-xs">Acciones</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleAgregarSeguimiento(incidente)} className="text-xs">
                        <ListPlus className="mr-2 h-3.5 w-3.5" />
                        Agregar Seguimiento
                      </DropdownMenuItem>
                      {incidente.estado === 'Reportado' && (
                        <>
                          <DropdownMenuItem onClick={() => handleCambiarEstado(incidente.id, 'En Atención')} className="text-xs">
                            <Clock className="mr-2 h-3.5 w-3.5" />
                            Pasar a En Atención
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCambiarEstado(incidente.id, 'Escalado')} className="text-xs">
                            <AlertCircle className="mr-2 h-3.5 w-3.5" />
                            Escalar Incidente
                          </DropdownMenuItem>
                        </>
                      )}
                      {incidente.estado === 'En Atención' && (
                        <>
                          <DropdownMenuItem onClick={() => handleCambiarEstado(incidente.id, 'Escalado')} className="text-xs">
                            <AlertCircle className="mr-2 h-3.5 w-3.5" />
                            Escalar Incidente
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCambiarEstado(incidente.id, 'Resuelto')} className="text-xs">
                            <CheckCircle className="mr-2 h-3.5 w-3.5" />
                            Marcar como Resuelto
                          </DropdownMenuItem>
                        </>
                      )}
                      {incidente.estado === 'Escalado' && (
                        <>
                          <DropdownMenuItem onClick={() => handleCambiarEstado(incidente.id, 'En Atención')} className="text-xs">
                            <Clock className="mr-2 h-3.5 w-3.5" />
                            Regresar a En Atención
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCambiarEstado(incidente.id, 'Resuelto')} className="text-xs">
                            <CheckCircle className="mr-2 h-3.5 w-3.5" />
                            Marcar como Resuelto
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Barra de búsqueda y filtros */}
      <Card>
        <CardContent className="p-3 sm:p-4 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Campo de búsqueda */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar incidentes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-xs sm:text-sm"
                />
              </div>
            </div>
            
            {/* Botón crear */}
            {userPermissions.canCreate && (
              <Button 
                onClick={() => { resetForm(); setIsDialogOpen(true); }}
                className="w-full sm:w-auto h-10 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 whitespace-nowrap text-xs sm:text-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Incidente
              </Button>
            )}
          </div>

          {/* Filtros - Solo para Admin/Coordinador */}
          {!isGuardarecurso && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Select value={selectedTipo} onValueChange={setSelectedTipo}>
                <SelectTrigger className="h-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-xs sm:text-sm">
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los tipos</SelectItem>
                  {tiposIncidente.map(tipo => (
                    <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedGravedad} onValueChange={setSelectedGravedad}>
                <SelectTrigger className="h-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-xs sm:text-sm">
                  <SelectValue placeholder="Todas las gravedades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas las gravedades</SelectItem>
                  <SelectItem value="Leve">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      Leve
                    </div>
                  </SelectItem>
                  <SelectItem value="Moderado">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      Moderado
                    </div>
                  </SelectItem>
                  <SelectItem value="Grave">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      Grave
                    </div>
                  </SelectItem>
                  <SelectItem value="Crítico">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      Crítico
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedEstado} onValueChange={setSelectedEstado}>
              <SelectTrigger className="h-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-xs sm:text-sm">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="Reportado">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    Reportado
                  </div>
                </SelectItem>
                <SelectItem value="En Atención">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-purple-600" />
                    En Atención
                  </div>
                </SelectItem>
                <SelectItem value="Escalado">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    Escalado
                  </div>
                </SelectItem>
                <SelectItem value="Resuelto">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Resuelto
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estadísticas responsive: arriba en móvil/tablet, sidebar en desktop */}
      <div className="lg:hidden">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <Card className="border-0 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 shadow-md">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col items-center justify-center gap-1 sm:gap-1.5">
                <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-blue-700 dark:text-blue-300" />
                <p className="text-xl sm:text-2xl text-blue-800 dark:text-blue-200">{estadisticas.activos}</p>
                <p className="text-[10px] sm:text-xs text-blue-700/80 dark:text-blue-300/80 text-center leading-tight">Activos</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40 shadow-md">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col items-center justify-center gap-1 sm:gap-1.5">
                <XCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-700 dark:text-red-300" />
                <p className="text-xl sm:text-2xl text-red-800 dark:text-red-200">{estadisticas.graves}</p>
                <p className="text-[10px] sm:text-xs text-red-700/80 dark:text-red-300/80 text-center leading-tight">Graves</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/40 dark:to-yellow-800/40 shadow-md">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col items-center justify-center gap-1 sm:gap-1.5">
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-700 dark:text-yellow-300" />
                <p className="text-xl sm:text-2xl text-yellow-800 dark:text-yellow-200">{estadisticas.reportados}</p>
                <p className="text-[10px] sm:text-xs text-yellow-700/80 dark:text-yellow-300/80 text-center leading-tight">Reportados</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 shadow-md">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col items-center justify-center gap-1 sm:gap-1.5">
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-700 dark:text-green-300" />
                <p className="text-xl sm:text-2xl text-green-800 dark:text-green-200">{estadisticas.resueltos}</p>
                <p className="text-[10px] sm:text-xs text-green-700/80 dark:text-green-300/80 text-center leading-tight">Resueltos</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Grid principal: Incidentes a la izquierda, Estadísticas a la derecha (solo desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Columna izquierda: Tabs e Incidentes */}
        <div className="lg:col-span-11">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="activos" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Activos ({estadisticas.activos})
              </TabsTrigger>
              <TabsTrigger value="historial" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Historial ({estadisticas.resueltos})
              </TabsTrigger>
            </TabsList>
        
            <TabsContent value="activos" className="space-y-3">
              {incidentesActivos.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No hay incidentes activos</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {incidentesActivos.map((incidente, index) => renderIncidenteCard(incidente, index, true))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="historial" className="space-y-3">
              {incidentesResueltos.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No hay incidentes resueltos</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {incidentesResueltos.map((incidente, index) => renderIncidenteCard(incidente, index, false))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Columna derecha: Estadísticas (solo desktop) */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="space-y-3 sticky top-4">
            <Card className="border-0 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 shadow-md">
              <CardContent className="p-4">
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <AlertTriangle className="h-8 w-8 text-blue-700 dark:text-blue-300" />
                  <p className="text-2xl text-blue-800 dark:text-blue-200">{estadisticas.activos}</p>
                  <p className="text-xs text-blue-700/80 dark:text-blue-300/80 text-center leading-tight">Activos</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40 shadow-md">
              <CardContent className="p-4">
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <XCircle className="h-8 w-8 text-red-700 dark:text-red-300" />
                  <p className="text-2xl text-red-800 dark:text-red-200">{estadisticas.graves}</p>
                  <p className="text-xs text-red-700/80 dark:text-red-300/80 text-center leading-tight">Graves</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/40 dark:to-yellow-800/40 shadow-md">
              <CardContent className="p-4">
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <FileText className="h-8 w-8 text-yellow-700 dark:text-yellow-300" />
                  <p className="text-2xl text-yellow-800 dark:text-yellow-200">{estadisticas.reportados}</p>
                  <p className="text-xs text-yellow-700/80 dark:text-yellow-300/80 text-center leading-tight">Reportados</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 shadow-md">
              <CardContent className="p-4">
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <CheckCircle className="h-8 w-8 text-green-700 dark:text-green-300" />
                  <p className="text-2xl text-green-800 dark:text-green-200">{estadisticas.resueltos}</p>
                  <p className="text-xs text-green-700/80 dark:text-green-300/80 text-center leading-tight">Resueltos</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialog para crear/editar incidente */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[95vw] sm:w-[90vw] max-w-4xl max-h-[90vh] overflow-y-auto p-3 sm:p-4 md:p-6">
          <DialogHeader className="pb-2 sm:pb-3 md:pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg flex-shrink-0">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-sm sm:text-base md:text-xl lg:text-2xl truncate">
                  {editingIncidente ? 'Editar Incidente' : 'Nuevo Incidente'}
                </DialogTitle>
                <DialogDescription className="text-[10px] sm:text-xs md:text-sm truncate">
                  {editingIncidente ? 'Modifica la información del incidente' : 'Completa los datos del nuevo incidente'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-6 pt-2 sm:pt-3 md:pt-4">
            {/* Información básica */}
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-xs sm:text-sm md:text-base">Información del Incidente</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4 pl-0 sm:pl-9 md:pl-10">
                <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                  <Label htmlFor="titulo" className="text-xs sm:text-sm">Título del Incidente *</Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                    placeholder="Resumen del incidente..."
                    className="h-9 sm:h-10 md:h-11 text-xs sm:text-sm"
                    required
                  />
                </div>
                
                <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                  <Label htmlFor="tipo" className="text-xs sm:text-sm">Tipo de Incidente *</Label>
                  <Select value={formData.tipo} onValueChange={(value) => setFormData({...formData, tipo: value})}>
                    <SelectTrigger className="h-9 sm:h-10 md:h-11 text-xs sm:text-sm">
                      <SelectValue placeholder="Seleccione tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposIncidente.map(tipo => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1 sm:space-y-1.5 md:space-y-2 sm:col-span-2">
                  <Label htmlFor="descripcion" className="text-xs sm:text-sm">Descripción Detallada *</Label>
                  <Textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    placeholder="Describa detalladamente el incidente..."
                    rows={4}
                    className="resize-none text-xs sm:text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Clasificación */}
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-lg bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-semibold text-xs sm:text-sm md:text-base">Clasificación</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-2 sm:gap-3 md:gap-4 pl-0 sm:pl-9 md:pl-10">
                <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                  <Label htmlFor="gravedad" className="text-xs sm:text-sm">Gravedad *</Label>
                  <Select value={formData.gravedad} onValueChange={(value) => setFormData({...formData, gravedad: value})}>
                    <SelectTrigger className="h-9 sm:h-10 md:h-11 text-xs sm:text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Leve">Leve</SelectItem>
                      <SelectItem value="Moderado">Moderado</SelectItem>
                      <SelectItem value="Grave">Grave</SelectItem>
                      <SelectItem value="Crítico">Crítico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Coordenadas */}
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-xs sm:text-sm md:text-base">Coordenadas</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4 pl-0 sm:pl-9 md:pl-10">
                <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                  <Label htmlFor="lat" className="text-xs sm:text-sm">Latitud *</Label>
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
                    className="h-9 sm:h-10 md:h-11 text-xs sm:text-sm"
                    required
                  />
                </div>
                
                <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                  <Label htmlFor="lng" className="text-xs sm:text-sm">Longitud *</Label>
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
                    className="h-9 sm:h-10 md:h-11 text-xs sm:text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Involucrados */}
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center flex-shrink-0">
                  <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-xs sm:text-sm md:text-base">Involucrados</h3>
              </div>
              
              <div className="pl-0 sm:pl-9 md:pl-10">
                <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                  <Label htmlFor="personas" className="text-xs sm:text-sm">Involucrados</Label>
                  <Textarea
                    id="personas"
                    value={formData.personasInvolucradas}
                    onChange={(e) => setFormData({...formData, personasInvolucradas: e.target.value})}
                    placeholder="Nombre de persona 1&#10;Nombre de persona 2..."
                    rows={4}
                    className="resize-none text-xs sm:text-sm"
                  />
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    Escriba cada persona en una línea diferente
                  </p>
                </div>
              </div>
            </div>

            {/* Observaciones */}
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-lg bg-pink-100 dark:bg-pink-900/40 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-pink-600 dark:text-pink-400" />
                </div>
                <h3 className="font-semibold text-xs sm:text-sm md:text-base">Observaciones Adicionales</h3>
              </div>
              
              <div className="pl-0 sm:pl-9 md:pl-10">
                <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                  <Label htmlFor="observaciones" className="text-xs sm:text-sm">Información adicional</Label>
                  <Textarea
                    id="observaciones"
                    value={formData.observaciones}
                    onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                    placeholder="Información adicional relevante..."
                    rows={3}
                    className="resize-none text-xs sm:text-sm"
                  />
                </div>
              </div>
            </div>
            
            {/* Footer con botones */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-2.5 md:gap-3 pt-3 sm:pt-4 md:pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  resetForm();
                  setIsDialogOpen(false);
                }}
                className="w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm"
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                className="w-full sm:w-auto h-9 sm:h-10 bg-gradient-to-r from-orange-600 to-amber-700 hover:from-orange-700 hover:to-amber-800 text-xs sm:text-sm"
              >
                {editingIncidente ? 'Actualizar' : 'Guardar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog para agregar seguimiento */}
      <Dialog open={isSeguimientoDialogOpen} onOpenChange={setIsSeguimientoDialogOpen}>
        <DialogContent className="w-[95vw] sm:w-[90vw] max-w-2xl p-3 sm:p-4 md:p-6">
          <DialogHeader className="pb-2 sm:pb-3 md:pb-4 border-b border-gray-200 dark:border-gray-700">
            <DialogTitle className="text-sm sm:text-base md:text-xl flex items-center gap-2">
              <ListPlus className="h-4 w-4 sm:h-5 sm:w-5" />
              Agregar Seguimiento
            </DialogTitle>
            <DialogDescription className="text-[10px] sm:text-xs md:text-sm">
              Registra una nueva acción de seguimiento para este incidente
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSeguimientoSubmit} className="space-y-3 sm:space-y-4 pt-2 sm:pt-3 md:pt-4">
            <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
              <Label htmlFor="accion" className="text-xs sm:text-sm">Acción Realizada *</Label>
              <Input
                id="accion"
                value={seguimientoFormData.accion}
                onChange={(e) => setSeguimientoFormData({...seguimientoFormData, accion: e.target.value})}
                placeholder="Ej: Reunión con autoridades..."
                className="h-9 sm:h-10 text-xs sm:text-sm"
                required
              />
            </div>
            
            <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
              <Label htmlFor="obs" className="text-xs sm:text-sm">Observaciones *</Label>
              <Textarea
                id="obs"
                value={seguimientoFormData.observaciones}
                onChange={(e) => setSeguimientoFormData({...seguimientoFormData, observaciones: e.target.value})}
                placeholder="Detalles adicionales sobre la acción..."
                rows={4}
                className="resize-none text-xs sm:text-sm"
                required
              />
            </div>
            
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-2.5 md:gap-3 pt-3 sm:pt-4 md:pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsSeguimientoDialogOpen(false)}
                className="w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm"
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                className="w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm"
              >
                Agregar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog para ver detalles con línea temporal */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="w-[95vw] sm:w-[90vw] max-w-4xl max-h-[90vh] overflow-y-auto p-3 sm:p-4 md:p-6">
          <DialogHeader className="pb-2 sm:pb-3 md:pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
              <DialogTitle className="text-sm sm:text-base md:text-xl">Detalles del Incidente</DialogTitle>
            </div>
            <DialogDescription className="text-[10px] sm:text-xs md:text-sm">
              Información completa del incidente registrado
            </DialogDescription>
          </DialogHeader>
          
          {selectedIncidente && (
            <div className="space-y-4 sm:space-y-6 pt-2 sm:pt-3 md:pt-4">
              {/* Información general */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm sm:text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Información General
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label className="text-xs sm:text-sm font-semibold">Título</Label>
                    <p className="text-xs sm:text-sm mt-1">{selectedIncidente.titulo}</p>
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm font-semibold">Tipo</Label>
                    <Badge variant="outline" className="mt-1 text-xs">{selectedIncidente.tipo}</Badge>
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm font-semibold">Gravedad</Label>
                    <Badge className={`${getGravedadColor(selectedIncidente.gravedad)} mt-1 text-xs`}>
                      {selectedIncidente.gravedad}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm font-semibold">Estado</Label>
                    <Badge className={`${getEstadoBadgeClass(selectedIncidente.estado)} mt-1 text-xs`}>
                      {selectedIncidente.estado}
                    </Badge>
                  </div>
                  <div className="sm:col-span-2">
                    <Label className="text-xs sm:text-sm font-semibold">Descripción</Label>
                    <p className="text-xs sm:text-sm mt-1">{selectedIncidente.descripcion}</p>
                  </div>
                </div>
              </div>

              {/* Involucrados */}
              {selectedIncidente.personasInvolucradas.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm sm:text-base flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Involucrados
                  </h3>
                  <ul className="list-disc list-inside text-xs sm:text-sm space-y-1 pl-2">
                    {selectedIncidente.personasInvolucradas.map((persona, i) => (
                      <li key={i}>{persona}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Línea temporal de seguimiento */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm sm:text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Línea Temporal de Seguimiento
                </h3>
                <div className="relative pl-6 sm:pl-8">
                  {/* Línea vertical */}
                  <div className="absolute left-2 sm:left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500"></div>
                  
                  {/* Items de seguimiento */}
                  <div className="space-y-4 sm:space-y-6">
                    {selectedIncidente.seguimiento.map((seg, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="relative"
                      >
                        {/* Punto en la línea */}
                        <div className="absolute -left-[1.6rem] sm:-left-[2.1rem] top-1">
                          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-500 dark:bg-blue-400 border-4 border-white dark:border-gray-800 shadow-lg"></div>
                        </div>
                        
                        {/* Contenido */}
                        <Card className="bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-blue-950/20">
                          <CardContent className="p-3 sm:p-4">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h4 className="font-semibold text-xs sm:text-sm">{seg.accion}</h4>
                              <Badge variant="outline" className="text-[10px] sm:text-xs flex-shrink-0">
                                {format(new Date(seg.fecha), "HH:mm")}
                              </Badge>
                            </div>
                            <p className="text-[10px] sm:text-xs text-muted-foreground mb-2">
                              {seg.observaciones}
                            </p>
                            <div className="flex items-center gap-2 text-[10px] sm:text-xs">
                              <Users className="h-3 w-3" />
                              <span className="font-medium">{seg.responsable}</span>
                              <span className="text-muted-foreground">•</span>
                              <span className="text-muted-foreground">
                                {format(new Date(seg.fecha), "d 'de' MMMM, yyyy", { locale: es })}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Observaciones finales */}
              {selectedIncidente.observaciones && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm sm:text-base flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Observaciones Finales
                  </h3>
                  <p className="text-xs sm:text-sm bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                    {selectedIncidente.observaciones}
                  </p>
                </div>
              )}

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button 
                  variant="outline" 
                  onClick={() => setIsViewDialogOpen(false)}
                  className="w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm"
                >
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
