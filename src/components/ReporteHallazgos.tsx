import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, Edit, Search, AlertTriangle, FileText, Camera, MapPin, Clock, Eye, Shield, Calendar, CheckCircle, XCircle, AlertCircle, ListPlus, ArrowRight, ChevronDown, Upload, X, Image as ImageIcon, Tag, User, Activity, History } from 'lucide-react';
import { guardarecursos, areasProtegidas } from '../data/mock-data';
import { toast } from 'sonner@2.0.3';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useIsMobile } from './ui/use-mobile';

interface Hallazgo {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: 'Ambiental' | 'Infraestructura' | 'Fauna' | 'Flora' | 'Contaminación' | 'Incendio' | 'Tala Ilegal' | 'Caza Furtiva';
  prioridad: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  estado: 'Reportado' | 'En Investigación' | 'En Proceso' | 'Resuelto';
  ubicacion: string;
  coordenadas?: { lat: number; lng: number };
  areaProtegida: string;
  guardarecurso: string;
  fechaReporte: string;
  fechaResolucion?: string;
  observaciones?: string;
  accionesTomadas?: string;
  evidencias: string[];
  seguimiento: Array<{
    fecha: string;
    accion: string;
    responsable: string;
    observaciones: string;
  }>;
}

interface ReporteHallazgosProps {
  userPermissions: {
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
  };
  currentUser?: any;
}

export function ReporteHallazgos({ userPermissions, currentUser }: ReporteHallazgosProps) {
  const isMobile = useIsMobile();
  const [hallazgosList, setHallazgosList] = useState<Hallazgo[]>([
    {
      id: '1',
      titulo: 'Tala ilegal detectada en sector norte',
      descripcion: 'Se encontraron árboles cortados recientemente sin autorización en el sector norte del área protegida',
      tipo: 'Tala Ilegal',
      prioridad: 'Alta',
      estado: 'En Investigación',
      ubicacion: 'Sendero Norte, km 2.5',
      coordenadas: { lat: 17.2345, lng: -89.6234 },
      areaProtegida: 'tikal',
      guardarecurso: '1',
      fechaReporte: '2024-10-05T10:30:00Z',
      observaciones: 'Se estima que la tala ocurrió durante la madrugada. Se encontraron herramientas abandonadas.',
      evidencias: ['foto1.jpg', 'foto2.jpg'],
      seguimiento: [
        {
          fecha: '2024-10-05T10:30:00Z',
          accion: 'Reporte inicial',
          responsable: 'Carlos Mendoza',
          observaciones: 'Hallazgo reportado durante patrullaje matutino'
        },
        {
          fecha: '2024-10-05T14:00:00Z',
          accion: 'Inspección detallada',
          responsable: 'María García',
          observaciones: 'Se documentaron 8 árboles cortados, especies de caoba'
        }
      ]
    },
    {
      id: '2',
      titulo: 'Contaminación de agua en laguna',
      descripcion: 'Se observa cambio de coloración en el agua de la laguna principal',
      tipo: 'Contaminación',
      prioridad: 'Crítica',
      estado: 'En Proceso',
      ubicacion: 'Laguna Central',
      coordenadas: { lat: 16.9850, lng: -89.8670 },
      areaProtegida: 'biotopo-cerro-cahui',
      guardarecurso: '2',
      fechaReporte: '2024-10-04T08:00:00Z',
      observaciones: 'Posible contaminación por agroquímicos de fincas cercanas',
      evidencias: ['agua1.jpg', 'muestra1.jpg'],
      seguimiento: [
        {
          fecha: '2024-10-04T08:00:00Z',
          accion: 'Reporte inicial',
          responsable: 'María García',
          observaciones: 'Coloración amarillenta del agua detectada'
        },
        {
          fecha: '2024-10-04T12:00:00Z',
          accion: 'Toma de muestras',
          responsable: 'Luis Ramírez',
          observaciones: 'Muestras enviadas a laboratorio para análisis'
        }
      ]
    },
    {
      id: '3',
      titulo: 'Incendio forestal controlado',
      descripcion: 'Pequeño incendio forestal detectado y controlado en la zona sur',
      tipo: 'Incendio',
      prioridad: 'Alta',
      estado: 'Resuelto',
      ubicacion: 'Sector Sur, Zona 3',
      coordenadas: { lat: 17.2100, lng: -89.6400 },
      areaProtegida: 'sierra-del-lacandon',
      guardarecurso: '3',
      fechaReporte: '2024-10-03T14:20:00Z',
      fechaResolucion: '2024-10-03T18:00:00Z',
      observaciones: 'Incendio causado por visitantes. Área afectada: 0.5 hectáreas',
      accionesTomadas: 'Se controló el incendio con brigadas forestales. Se identificó a responsables',
      evidencias: ['incendio1.jpg', 'incendio2.jpg', 'incendio3.jpg'],
      seguimiento: [
        {
          fecha: '2024-10-03T14:20:00Z',
          accion: 'Reporte inicial',
          responsable: 'Pedro Sánchez',
          observaciones: 'Incendio detectado, se activa protocolo de emergencia'
        },
        {
          fecha: '2024-10-03T15:00:00Z',
          accion: 'Brigadas en sitio',
          responsable: 'Ana Morales',
          observaciones: 'Brigada forestal iniciando control del fuego'
        },
        {
          fecha: '2024-10-03T18:00:00Z',
          accion: 'Incendio controlado',
          responsable: 'Pedro Sánchez',
          observaciones: 'Incendio totalmente controlado, evaluando daños'
        }
      ]
    },
    {
      id: '4',
      titulo: 'Caza furtiva de venado',
      descripcion: 'Se encontraron restos de venado cazado ilegalmente',
      tipo: 'Caza Furtiva',
      prioridad: 'Alta',
      estado: 'En Investigación',
      ubicacion: 'Zona de Amortiguamiento Norte',
      coordenadas: { lat: 15.2200, lng: -89.9600 },
      areaProtegida: 'sierra-de-las-minas',
      guardarecurso: '4',
      fechaReporte: '2024-10-02T07:15:00Z',
      observaciones: 'Se encontraron trampas y evidencia de campamento',
      evidencias: ['caza1.jpg'],
      seguimiento: [
        {
          fecha: '2024-10-02T07:15:00Z',
          accion: 'Reporte inicial',
          responsable: 'Jorge López',
          observaciones: 'Hallazgo durante patrullaje matutino'
        }
      ]
    },
    {
      id: '5',
      titulo: 'Daño a infraestructura turística',
      descripcion: 'Mirador principal vandalizado con grafitis',
      tipo: 'Infraestructura',
      prioridad: 'Media',
      estado: 'En Proceso',
      ubicacion: 'Mirador Principal',
      coordenadas: { lat: 17.2400, lng: -89.6200 },
      areaProtegida: 'tikal',
      guardarecurso: '5',
      fechaReporte: '2024-10-01T09:00:00Z',
      observaciones: 'Grafitis en paredes y barandales dañados',
      accionesTomadas: 'Se inició proceso de limpieza y reparación',
      evidencias: ['vandalismo1.jpg', 'vandalismo2.jpg'],
      seguimiento: [
        {
          fecha: '2024-10-01T09:00:00Z',
          accion: 'Reporte inicial',
          responsable: 'Carmen Ruiz',
          observaciones: 'Vandalismo reportado por guardarecurso'
        },
        {
          fecha: '2024-10-01T14:00:00Z',
          accion: 'Evaluación de daños',
          responsable: 'Mario Castillo',
          observaciones: 'Se evaluó costo de reparación'
        }
      ]
    },
    {
      id: '6',
      titulo: 'Avistamiento de fauna herida',
      descripcion: 'Jaguar con herida en pata detectado en zona de monitoreo',
      tipo: 'Fauna',
      prioridad: 'Alta',
      estado: 'Reportado',
      ubicacion: 'Zona de Monitoreo B',
      coordenadas: { lat: 16.1100, lng: -90.8400 },
      areaProtegida: 'sierra-del-lacandon',
      guardarecurso: '6',
      fechaReporte: '2024-10-08T06:30:00Z',
      observaciones: 'Animal observado mediante cámara trampa, posible trampa',
      evidencias: ['jaguar1.jpg'],
      seguimiento: [
        {
          fecha: '2024-10-08T06:30:00Z',
          accion: 'Reporte inicial',
          responsable: 'Roberto Díaz',
          observaciones: 'Se notificó a veterinarios de vida silvestre'
        }
      ]
    },
    {
      id: '7',
      titulo: 'Especie de flora endémica amenazada',
      descripcion: 'Población de orquídeas endémicas afectada por extracción ilegal',
      tipo: 'Flora',
      prioridad: 'Alta',
      estado: 'En Investigación',
      ubicacion: 'Bosque Nuboso Sector 2',
      coordenadas: { lat: 15.2100, lng: -89.9500 },
      areaProtegida: 'sierra-de-las-minas',
      guardarecurso: '7',
      fechaReporte: '2024-09-30T11:00:00Z',
      observaciones: 'Se detectó extracción de aproximadamente 15 plantas',
      evidencias: ['orquideas1.jpg', 'orquideas2.jpg'],
      seguimiento: [
        {
          fecha: '2024-09-30T11:00:00Z',
          accion: 'Reporte inicial',
          responsable: 'Elena Vargas',
          observaciones: 'Extracción ilegal detectada'
        },
        {
          fecha: '2024-10-01T09:00:00Z',
          accion: 'Inventario de daños',
          responsable: 'Elena Vargas',
          observaciones: 'Se realizó inventario completo de la zona'
        }
      ]
    },
    {
      id: '8',
      titulo: 'Erosión en sendero principal',
      descripcion: 'Erosión severa causada por lluvias en sendero turístico',
      tipo: 'Ambiental',
      prioridad: 'Media',
      estado: 'En Proceso',
      ubicacion: 'Sendero Los Cipreses',
      coordenadas: { lat: 14.3820, lng: -90.6010 },
      areaProtegida: 'volcan-pacaya',
      guardarecurso: '8',
      fechaReporte: '2024-09-28T13:00:00Z',
      observaciones: 'Sendero parcialmente intransitable, riesgo para visitantes',
      accionesTomadas: 'Se colocó señalización de peligro, programada reparación',
      evidencias: ['erosion1.jpg'],
      seguimiento: [
        {
          fecha: '2024-09-28T13:00:00Z',
          accion: 'Reporte inicial',
          responsable: 'Marcos Hernández',
          observaciones: 'Daños reportados después de tormenta'
        },
        {
          fecha: '2024-09-29T08:00:00Z',
          accion: 'Evaluación técnica',
          responsable: 'Ingeniero de Senderos',
          observaciones: 'Se evaluó alcance de reparaciones necesarias'
        }
      ]
    },
    {
      id: '9',
      titulo: 'Basura acumulada en zona de playa',
      descripcion: 'Acumulación de desechos plásticos en zona de anidación',
      tipo: 'Contaminación',
      prioridad: 'Alta',
      estado: 'Resuelto',
      ubicacion: 'Playa de Anidación',
      coordenadas: { lat: 13.9220, lng: -90.8260 },
      areaProtegida: 'monterrico',
      guardarecurso: '9',
      fechaReporte: '2024-09-25T16:00:00Z',
      fechaResolucion: '2024-09-26T12:00:00Z',
      observaciones: 'Desechos plásticos afectando zona de anidación de tortugas',
      accionesTomadas: 'Jornada de limpieza realizada con voluntarios',
      evidencias: ['basura1.jpg', 'limpieza1.jpg'],
      seguimiento: [
        {
          fecha: '2024-09-25T16:00:00Z',
          accion: 'Reporte inicial',
          responsable: 'Sandra Torres',
          observaciones: 'Contaminación detectada'
        },
        {
          fecha: '2024-09-26T12:00:00Z',
          accion: 'Limpieza completada',
          responsable: 'Sandra Torres',
          observaciones: 'Se recolectaron 50kg de desechos plásticos'
        }
      ]
    },
    {
      id: '10',
      titulo: 'Señalización deteriorada',
      descripcion: 'Señales informativas y de advertencia en mal estado',
      tipo: 'Infraestructura',
      prioridad: 'Baja',
      estado: 'Reportado',
      ubicacion: 'Entrada Principal',
      coordenadas: { lat: 17.2300, lng: -89.6250 },
      areaProtegida: 'tikal',
      guardarecurso: '10',
      fechaReporte: '2024-09-27T10:00:00Z',
      observaciones: 'Señales decoloradas por sol y lluvia',
      evidencias: [],
      seguimiento: [
        {
          fecha: '2024-09-27T10:00:00Z',
          accion: 'Reporte inicial',
          responsable: 'Laura Mejía',
          observaciones: 'Se solicitó presupuesto para reemplazo'
        }
      ]
    },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipo, setSelectedTipo] = useState<string>('todos');
  const [selectedPrioridad, setSelectedPrioridad] = useState<string>('todos');
  const [selectedEstado, setSelectedEstado] = useState<string>('todos');
  const [activeTab, setActiveTab] = useState<'activos' | 'historial'>('activos');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHallazgo, setEditingHallazgo] = useState<Hallazgo | null>(null);
  const [selectedHallazgo, setSelectedHallazgo] = useState<Hallazgo | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isSeguimientoDialogOpen, setIsSeguimientoDialogOpen] = useState(false);
  const [hallazgoParaSeguimiento, setHallazgoParaSeguimiento] = useState<Hallazgo | null>(null);
  
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    tipo: '',
    prioridad: 'Media',
    ubicacion: '',
    coordenadas: { lat: 0, lng: 0 },
    areaProtegida: '',
    observaciones: ''
  });

  const [seguimientoFormData, setSeguimientoFormData] = useState({
    accion: '',
    observaciones: ''
  });

  const [evidenciasPreview, setEvidenciasPreview] = useState<string[]>([]);

  const tiposHallazgo = ['Ambiental', 'Infraestructura', 'Fauna', 'Flora', 'Contaminación', 'Incendio', 'Tala Ilegal', 'Caza Furtiva'];

  // Determinar si el usuario actual es un guardarecurso
  const isGuardarecurso = currentUser?.rol === 'Guardarecurso';
  const currentGuardarecursoId = isGuardarecurso ? currentUser?.id : null;

  const filteredHallazgos = useMemo(() => {
    return hallazgosList.filter(h => {
      const matchesSearch = 
        h.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.ubicacion.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTipo = selectedTipo === 'todos' || h.tipo === selectedTipo;
      const matchesPrioridad = selectedPrioridad === 'todos' || h.prioridad === selectedPrioridad;
      const matchesEstado = selectedEstado === 'todos' || h.estado === selectedEstado;
      
      // Si es guardarecurso, filtrar solo sus hallazgos
      const matchesGuardarecurso = isGuardarecurso 
        ? h.guardarecurso === currentGuardarecursoId
        : true;
      
      return matchesSearch && matchesTipo && matchesPrioridad && matchesEstado && matchesGuardarecurso;
    });
  }, [hallazgosList, searchTerm, selectedTipo, selectedPrioridad, selectedEstado, isGuardarecurso, currentGuardarecursoId]);

  // Separar hallazgos activos y resueltos
  const hallazgosActivos = useMemo(() => {
    return filteredHallazgos.filter(h => h.estado !== 'Resuelto');
  }, [filteredHallazgos]);

  const hallazgosResueltos = useMemo(() => {
    return filteredHallazgos.filter(h => h.estado === 'Resuelto');
  }, [filteredHallazgos]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingHallazgo) {
      setHallazgosList(prev => prev.map(h => 
        h.id === editingHallazgo.id 
          ? { 
              ...h, 
              ...formData,
              tipo: formData.tipo as any,
              prioridad: formData.prioridad as any,
              evidencias: evidenciasPreview
            }
          : h
      ));
      toast.success('Hallazgo actualizado', {
        description: 'El hallazgo ha sido actualizado correctamente'
      });
    } else {
      const nuevoHallazgo: Hallazgo = {
        id: Date.now().toString(),
        ...formData,
        tipo: formData.tipo as any,
        prioridad: formData.prioridad as any,
        estado: 'Reportado',
        guardarecurso: '1',
        fechaReporte: new Date().toISOString(),
        evidencias: evidenciasPreview,
        seguimiento: [{
          fecha: new Date().toISOString(),
          accion: 'Reporte inicial',
          responsable: 'Sistema',
          observaciones: 'Hallazgo reportado a través del sistema'
        }]
      };
      setHallazgosList(prev => [...prev, nuevoHallazgo]);
      toast.success('Hallazgo creado', {
        description: 'El hallazgo ha sido reportado correctamente'
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
      prioridad: 'Media',
      ubicacion: '',
      coordenadas: { lat: 0, lng: 0 },
      areaProtegida: '',
      observaciones: ''
    });
    setEditingHallazgo(null);
    setEvidenciasPreview([]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPreviews: string[] = [];
    const fileArray = Array.from(files);

    fileArray.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setEvidenciasPreview(prev => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      }
    });

    // Limpiar el input para permitir subir el mismo archivo nuevamente
    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setEvidenciasPreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleEdit = (hallazgo: Hallazgo) => {
    setFormData({
      titulo: hallazgo.titulo,
      descripcion: hallazgo.descripcion,
      tipo: hallazgo.tipo,
      prioridad: hallazgo.prioridad,
      ubicacion: hallazgo.ubicacion,
      coordenadas: hallazgo.coordenadas || { lat: 0, lng: 0 },
      areaProtegida: hallazgo.areaProtegida,
      observaciones: hallazgo.observaciones || ''
    });
    setEditingHallazgo(hallazgo);
    // Cargar evidencias existentes (simuladas)
    setEvidenciasPreview(hallazgo.evidencias || []);
    setIsDialogOpen(true);
  };

  const handleView = (hallazgo: Hallazgo) => {
    setSelectedHallazgo(hallazgo);
    setIsViewDialogOpen(true);
  };

  const handleAgregarSeguimiento = (hallazgo: Hallazgo) => {
    setHallazgoParaSeguimiento(hallazgo);
    setIsSeguimientoDialogOpen(true);
  };

  const handleSubmitSeguimiento = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hallazgoParaSeguimiento) return;
    
    const nuevoSeguimiento = {
      fecha: new Date().toISOString(),
      accion: seguimientoFormData.accion,
      responsable: 'Sistema', // En producción sería el usuario actual
      observaciones: seguimientoFormData.observaciones
    };
    
    setHallazgosList(prev => prev.map(h => 
      h.id === hallazgoParaSeguimiento.id 
        ? { ...h, seguimiento: [...h.seguimiento, nuevoSeguimiento] }
        : h
    ));
    
    setSeguimientoFormData({ accion: '', observaciones: '' });
    setIsSeguimientoDialogOpen(false);
    setHallazgoParaSeguimiento(null);
  };

  // Obtener estados siguientes disponibles según el estado actual
  const getNextEstados = (estadoActual: string): Array<{value: string, label: string, icon: any}> => {
    const estadosOrden = ['Reportado', 'En Investigación', 'En Proceso', 'Resuelto'];
    const currentIndex = estadosOrden.indexOf(estadoActual);
    
    if (currentIndex === -1 || currentIndex === estadosOrden.length - 1) {
      return []; // No hay estados siguientes
    }
    
    const nextEstados = estadosOrden.slice(currentIndex + 1);
    
    return nextEstados.map(estado => {
      switch (estado) {
        case 'En Investigación':
          return { value: estado, label: estado, icon: Search };
        case 'En Proceso':
          return { value: estado, label: estado, icon: Clock };
        case 'Resuelto':
          return { value: estado, label: estado, icon: CheckCircle };
        default:
          return { value: estado, label: estado, icon: FileText };
      }
    });
  };

  const handleCambiarEstado = (hallazgoId: string, nuevoEstado: string) => {
    setHallazgosList(prev => prev.map(h => {
      if (h.id === hallazgoId) {
        // Agregar seguimiento automático del cambio de estado
        const nuevoSeguimiento = {
          fecha: new Date().toISOString(),
          accion: `Cambio de estado a: ${nuevoEstado}`,
          responsable: 'Sistema',
          observaciones: `El hallazgo cambió de estado de "${h.estado}" a "${nuevoEstado}"`
        };
        
        // Si el estado es Resuelto, agregar fecha de resolución
        const updates: Partial<Hallazgo> = {
          estado: nuevoEstado as any,
          seguimiento: [...h.seguimiento, nuevoSeguimiento]
        };
        
        if (nuevoEstado === 'Resuelto') {
          updates.fechaResolucion = new Date().toISOString();
        }
        
        // Mostrar notificación
        toast.success('Estado actualizado', {
          description: `El hallazgo cambió a estado: ${nuevoEstado}`
        });
        
        return { ...h, ...updates };
      }
      return h;
    }));
  };

  const getPrioridadInfo = (prioridad: string) => {
    switch (prioridad) {
      case 'Crítica': return { 
        color: 'text-red-700 dark:text-red-300', 
        bg: 'bg-red-100 dark:bg-red-900/30',
        badge: 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20'
      };
      case 'Alta': return { 
        color: 'text-orange-700 dark:text-orange-300', 
        bg: 'bg-orange-100 dark:bg-orange-900/30',
        badge: 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20'
      };
      case 'Media': return { 
        color: 'text-yellow-700 dark:text-yellow-300', 
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        badge: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border-yellow-500/20'
      };
      case 'Baja': return { 
        color: 'text-green-700 dark:text-green-300', 
        bg: 'bg-green-100 dark:bg-green-900/30',
        badge: 'bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20'
      };
      default: return { 
        color: 'text-gray-700 dark:text-gray-300', 
        bg: 'bg-gray-100 dark:bg-gray-700',
        badge: 'bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-500/20'
      };
    }
  };

  const getEstadoBadgeVariant = (estado: string): "default" | "secondary" | "outline" | "destructive" => {
    switch (estado) {
      case 'Reportado': return 'secondary';
      case 'En Investigación': return 'default';
      case 'En Proceso': return 'outline';
      case 'Resuelto': return 'secondary';
      default: return 'outline';
    }
  };

  const estadisticas = useMemo(() => {
    // Filtrar hallazgos según el rol del usuario
    const hallazgosParaEstadisticas = isGuardarecurso 
      ? hallazgosList.filter(h => h.guardarecurso === currentGuardarecursoId)
      : hallazgosList;
    
    return {
      total: hallazgosParaEstadisticas.length,
      activos: hallazgosParaEstadisticas.filter(h => h.estado !== 'Resuelto').length,
      criticos: hallazgosParaEstadisticas.filter(h => h.prioridad === 'Crítica').length,
      reportados: hallazgosParaEstadisticas.filter(h => h.estado === 'Reportado').length,
      enInvestigacion: hallazgosParaEstadisticas.filter(h => h.estado === 'En Investigación').length,
      enProceso: hallazgosParaEstadisticas.filter(h => h.estado === 'En Proceso').length,
      resueltos: hallazgosParaEstadisticas.filter(h => h.estado === 'Resuelto').length,
    };
  }, [hallazgosList, isGuardarecurso, currentGuardarecursoId]);

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda y controles */}
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col gap-3">
            {/* Primera fila: Búsqueda */}
            <div className="flex gap-3">
              {/* Búsqueda */}
              <div className="flex-1 w-full">
                <div className="relative h-10">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar hallazgos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* Segunda fila: Filtros */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {/* Filtro por tipo */}
              <Select value={selectedTipo} onValueChange={setSelectedTipo}>
                <SelectTrigger className="h-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los tipos</SelectItem>
                  {tiposHallazgo.map(tipo => (
                    <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Filtro por prioridad */}
              <Select value={selectedPrioridad} onValueChange={setSelectedPrioridad}>
                <SelectTrigger className="h-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="Todas las prioridades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas las prioridades</SelectItem>
                  <SelectItem value="Crítica">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      Crítica
                    </div>
                  </SelectItem>
                  <SelectItem value="Alta">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      Alta
                    </div>
                  </SelectItem>
                  <SelectItem value="Media">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      Media
                    </div>
                  </SelectItem>
                  <SelectItem value="Baja">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                      Baja
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              
              {/* Filtro por estado */}
              <Select value={selectedEstado} onValueChange={setSelectedEstado}>
                <SelectTrigger className="h-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
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
                  <SelectItem value="En Investigación">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-purple-600" />
                      En Investigación
                    </div>
                  </SelectItem>
                  <SelectItem value="En Proceso">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      En Proceso
                    </div>
                  </SelectItem>
                  <SelectItem value="Resuelto">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Resuelto
                    </div>
                  </SelectItem>
                  <SelectItem value="Cerrado">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-gray-600" />
                      Cerrado
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>

        {/* Diálogo para crear/editar hallazgo */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="w-[95vw] sm:w-[90vw] max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader className="pb-3 sm:pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <DialogTitle className="text-base sm:text-xl md:text-2xl truncate">
                    {editingHallazgo ? 'Editar Hallazgo' : 'Reportar Nuevo Hallazgo'}
                  </DialogTitle>
                  <DialogDescription className="text-xs sm:text-sm line-clamp-2">
                    Complete la información del hallazgo o irregularidad encontrada
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 pt-3 sm:pt-4">
              {/* Información básica */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 pb-2">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">Información del Hallazgo</h3>
                </div>
                
                <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="titulo" className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      Título del Hallazgo
                    </Label>
                    <Input
                      id="titulo"
                      value={formData.titulo}
                      onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                      placeholder="Resumen del hallazgo..."
                      className="h-10 border-gray-300 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-400"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tipo" className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                      Tipo de Hallazgo
                    </Label>
                    <Select value={formData.tipo} onValueChange={(value) => setFormData({...formData, tipo: value})}>
                      <SelectTrigger className="h-10 border-gray-300 dark:border-gray-600">
                        <SelectValue placeholder="Seleccione tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {tiposHallazgo.map(tipo => (
                          <SelectItem key={tipo} value={tipo}>
                            {tipo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="descripcion" className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      Descripción Detallada
                    </Label>
                    <Textarea
                      id="descripcion"
                      value={formData.descripcion}
                      onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                      placeholder="Describa detalladamente el hallazgo..."
                      rows={4}
                      required
                      className="resize-none border-gray-300 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-400"
                    />
                  </div>
                </div>
              </div>

              {/* Separador */}
              <div className="border-b border-gray-200 dark:border-gray-700"></div>

              {/* Clasificación */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 pb-2">
                  <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400" />
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">Clasificación</h3>
                </div>
                
                <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="prioridad" className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-muted-foreground" />
                      Prioridad
                    </Label>
                    <Select value={formData.prioridad} onValueChange={(value) => setFormData({...formData, prioridad: value})}>
                      <SelectTrigger className="h-10 border-gray-300 dark:border-gray-600">
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="area" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      Área Protegida
                    </Label>
                    <Select value={formData.areaProtegida} onValueChange={(value) => setFormData({...formData, areaProtegida: value})}>
                      <SelectTrigger className="h-10 border-gray-300 dark:border-gray-600">
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

              {/* Separador */}
              <div className="border-b border-gray-200 dark:border-gray-700"></div>

              {/* Ubicación */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 pb-2">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">Ubicación</h3>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ubicacion" className="flex items-center gap-2 text-xs sm:text-sm">
                      <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                      Ubicación
                    </Label>
                    <Input
                      id="ubicacion"
                      value={formData.ubicacion}
                      onChange={(e) => setFormData({...formData, ubicacion: e.target.value})}
                      placeholder="Descripción de la ubicación exacta..."
                      className="h-10 border-gray-300 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-400"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="lat" className="text-xs text-muted-foreground font-normal">Latitud (opcional)</Label>
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
                        className="h-10 border-gray-300 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-400"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lng" className="text-xs text-muted-foreground font-normal">Longitud (opcional)</Label>
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
                        className="h-10 border-gray-300 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Separador */}
              <div className="border-b border-gray-200 dark:border-gray-700"></div>

              {/* Observaciones */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 pb-2">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">Observaciones Adicionales</h3>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="observaciones" className="flex items-center gap-2 text-xs sm:text-sm">
                    <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                    Información Adicional
                  </Label>
                  <Textarea
                    id="observaciones"
                    value={formData.observaciones}
                    onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                    placeholder="Información adicional relevante..."
                    rows={3}
                    className="resize-none border-gray-300 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-400"
                  />
                </div>
              </div>

              {/* Evidencias Fotográficas */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-pink-100 dark:bg-pink-900/40 flex items-center justify-center flex-shrink-0">
                    <Camera className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-pink-600 dark:text-pink-400" />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base">Evidencias Fotográficas</h3>
                </div>
                
                <div className="pl-0 sm:pl-10 space-y-3 sm:space-y-4">
                  {/* Botón para subir fotografías */}
                  <div className="space-y-2">
                    <Label>Agregar fotografías</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        id="file-upload"
                        accept="image/*"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('file-upload')?.click()}
                        className="w-full sm:w-auto"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Subir Fotografías
                      </Button>
                      <span className="text-xs text-muted-foreground">
                        Puede seleccionar múltiples imágenes
                      </span>
                    </div>
                  </div>

                  {/* Vista previa de imágenes */}
                  {evidenciasPreview.length > 0 && (
                    <div className="space-y-2">
                      <Label>Fotografías cargadas ({evidenciasPreview.length})</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {evidenciasPreview.map((preview, index) => (
                          <div
                            key={index}
                            className="relative group rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-pink-500 dark:hover:border-pink-500 transition-all duration-200"
                          >
                            <div className="aspect-square bg-gray-100 dark:bg-gray-800">
                              <img
                                src={preview}
                                alt={`Evidencia ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                              title="Eliminar fotografía"
                            >
                              <X className="h-3 w-3" />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <p className="text-xs text-white text-center">
                                Foto {index + 1}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mensaje cuando no hay imágenes */}
                  {evidenciasPreview.length === 0 && (
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                      <ImageIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                      <p className="text-sm text-muted-foreground mb-2">
                        No hay fotografías cargadas
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Las fotografías ayudan a documentar mejor el hallazgo
                      </p>
                    </div>
                  )}
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
                  className="w-full sm:w-auto sm:min-w-[100px] bg-gradient-to-r from-orange-600 to-amber-700 hover:from-orange-700 hover:to-amber-800"
                >
                  {editingHallazgo ? 'Actualizar' : 'Guardar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </Card>

      {/* Estadísticas responsive: arriba en móvil/tablet, sidebar en desktop */}
      <div className="lg:hidden mb-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          <Card className="border-0 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 shadow-md">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col items-center justify-center gap-1 sm:gap-1.5">
                <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-blue-700 dark:text-blue-300" />
                <p className="text-xl sm:text-2xl text-blue-800 dark:text-blue-200">{estadisticas.activos}</p>
                <p className="text-[10px] sm:text-xs text-blue-700/80 dark:text-blue-300/80 text-center leading-tight">Activos</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40 shadow-md">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col items-center justify-center gap-1 sm:gap-1.5">
                <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-red-700 dark:text-red-300" />
                <p className="text-xl sm:text-2xl text-red-800 dark:text-red-200">{estadisticas.criticos}</p>
                <p className="text-[10px] sm:text-xs text-red-700/80 dark:text-red-300/80 text-center leading-tight">Críticos</p>
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
          
          <Card className="border-0 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 shadow-md">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col items-center justify-center gap-1 sm:gap-1.5">
                <Search className="h-6 w-6 sm:h-8 sm:w-8 text-purple-700 dark:text-purple-300" />
                <p className="text-xl sm:text-2xl text-purple-800 dark:text-purple-200">{estadisticas.enInvestigacion}</p>
                <p className="text-[10px] sm:text-xs text-purple-700/80 dark:text-purple-300/80 text-center leading-tight">Investigación</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/40 dark:to-orange-800/40 shadow-md">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col items-center justify-center gap-1 sm:gap-1.5">
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-orange-700 dark:text-orange-300" />
                <p className="text-xl sm:text-2xl text-orange-800 dark:text-orange-200">{estadisticas.enProceso}</p>
                <p className="text-[10px] sm:text-xs text-orange-700/80 dark:text-orange-300/80 text-center leading-tight">En Proceso</p>
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

      {/* Grid principal: Tabs a la izquierda, Estadísticas a la derecha (solo desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Columna izquierda: Tabs e Hallazgos */}
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

            <TabsContent value="activos">
              <Card className="border-0 shadow-lg">
                <CardHeader className="px-4 sm:px-6 py-4 sm:py-5">
                  <CardTitle className="text-base sm:text-lg">Hallazgos Activos</CardTitle>
                </CardHeader>
                <CardContent className="px-0 sm:px-6 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">Hallazgo</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden md:table-cell">Tipo</TableHead>
                        <TableHead className="text-xs sm:text-sm">Prioridad</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden xl:table-cell">Ubicación</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Área Protegida</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Reportado por</TableHead>
                        <TableHead className="text-xs sm:text-sm">Estado</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Fecha</TableHead>
                        <TableHead className="text-right text-xs sm:text-sm">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {hallazgosActivos.map((hallazgo) => {
                    const area = areasProtegidas.find(a => a.id === hallazgo.areaProtegida);
                    const guardarecurso = guardarecursos.find(g => g.id === hallazgo.guardarecurso);
                    const prioridadInfo = getPrioridadInfo(hallazgo.prioridad);
                    
                    return (
                      <TableRow key={hallazgo.id}>
                        <TableCell className="text-xs sm:text-sm">
                          <div>
                            <div className="font-medium line-clamp-1">{hallazgo.titulo}</div>
                            {!isMobile && (
                              <div className="text-xs text-muted-foreground line-clamp-2">
                                {hallazgo.descripcion}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden md:table-cell">
                          <span className="text-xs sm:text-sm truncate block max-w-[120px]">{hallazgo.tipo}</span>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          <Badge variant="outline" className={`${prioridadInfo.badge} text-xs whitespace-nowrap`}>
                            {hallazgo.prioridad}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden xl:table-cell">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                            <span className="truncate max-w-[150px]">{hallazgo.ubicacion}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-400 flex-shrink-0" />
                            <span className="truncate max-w-[150px]">{area?.nombre || 'N/A'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0">
                              {guardarecurso?.nombre[0]}{guardarecurso?.apellido[0]}
                            </div>
                            <span className="truncate max-w-[120px]">
                              {guardarecurso ? `${guardarecurso.nombre} ${guardarecurso.apellido}` : 'N/A'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          <Badge variant={getEstadoBadgeVariant(hallazgo.estado)} className="text-xs whitespace-nowrap">
                            {hallazgo.estado}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                          {new Date(hallazgo.fechaReporte).toLocaleDateString('es-GT')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1 sm:gap-2">
                            {/* Botón Ver - Siempre visible */}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleView(hallazgo)}
                              title="Ver detalles"
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Button>
                            
                            {userPermissions.canEdit && (
                              <>
                                {/* Botón de seguimiento - Siempre visible si no está resuelto */}
                                {hallazgo.estado !== 'Resuelto' && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleAgregarSeguimiento(hallazgo)}
                                    title="Agregar seguimiento"
                                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 h-8 w-8 p-0"
                                  >
                                    <ListPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                  </Button>
                                )}
                                
                                {/* Dropdown de cambio de estado - Siempre visible si hay estados disponibles */}
                                {getNextEstados(hallazgo.estado).length > 0 && (
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        title="Cambiar estado"
                                        className="text-green-600 hover:text-green-700 dark:text-green-400 h-8 w-8 p-0"
                                      >
                                        <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                      <DropdownMenuLabel>Cambiar Estado</DropdownMenuLabel>
                                      <DropdownMenuSeparator />
                                      {getNextEstados(hallazgo.estado).map((estado) => {
                                        const IconComponent = estado.icon;
                                        return (
                                          <DropdownMenuItem
                                            key={estado.value}
                                            onClick={() => handleCambiarEstado(hallazgo.id, estado.value)}
                                            className="cursor-pointer"
                                          >
                                            <IconComponent className="mr-2 h-4 w-4" />
                                            <span>{estado.label}</span>
                                          </DropdownMenuItem>
                                        );
                                      })}
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                )}
                              </>
                            )}
                          </div>
                        </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                  
                  {hallazgosActivos.length === 0 && (
                    <div className="text-center py-8 sm:py-12 text-muted-foreground px-4">
                      <AlertTriangle className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 opacity-30" />
                      <p className="text-sm sm:text-base">No hay hallazgos activos que coincidan con los filtros</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="historial">
              <Card className="border-0 shadow-lg">
                <CardHeader className="px-4 sm:px-6 py-4 sm:py-5">
                  <CardTitle className="text-base sm:text-lg">Historial de Hallazgos Resueltos</CardTitle>
                </CardHeader>
                <CardContent className="px-0 sm:px-6 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">Hallazgo</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden md:table-cell">Tipo</TableHead>
                        <TableHead className="text-xs sm:text-sm">Prioridad</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden xl:table-cell">Ubicación</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Área Protegida</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Reportado por</TableHead>
                        <TableHead className="text-xs sm:text-sm">Fecha Reporte</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Fecha Resolución</TableHead>
                        <TableHead className="text-right text-xs sm:text-sm">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {hallazgosResueltos.map((hallazgo) => {
                        const area = areasProtegidas.find(a => a.id === hallazgo.areaProtegida);
                        const guardarecurso = guardarecursos.find(g => g.id === hallazgo.guardarecurso);
                        const prioridadInfo = getPrioridadInfo(hallazgo.prioridad);
                        
                        return (
                          <TableRow key={hallazgo.id}>
                            <TableCell className="text-xs sm:text-sm">
                              <div>
                                <div className="font-medium line-clamp-1">{hallazgo.titulo}</div>
                                {!isMobile && (
                                  <div className="text-xs text-muted-foreground line-clamp-2">
                                    {hallazgo.descripcion}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-xs sm:text-sm hidden md:table-cell">
                              <span className="text-xs sm:text-sm truncate block max-w-[120px]">{hallazgo.tipo}</span>
                            </TableCell>
                            <TableCell className="text-xs sm:text-sm">
                              <Badge variant="outline" className={`${prioridadInfo.badge} text-xs whitespace-nowrap`}>
                                {hallazgo.prioridad}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs sm:text-sm hidden xl:table-cell">
                              <div className="flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                                <span className="truncate max-w-[150px]">{hallazgo.ubicacion}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                              <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-400 flex-shrink-0" />
                                <span className="truncate max-w-[150px]">{area?.nombre || 'N/A'}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0">
                                  {guardarecurso?.nombre[0]}{guardarecurso?.apellido[0]}
                                </div>
                                <span className="truncate max-w-[120px]">
                                  {guardarecurso ? `${guardarecurso.nombre} ${guardarecurso.apellido}` : 'N/A'}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-xs sm:text-sm">
                              {new Date(hallazgo.fechaReporte).toLocaleDateString('es-GT')}
                            </TableCell>
                            <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                              {hallazgo.fechaResolucion ? new Date(hallazgo.fechaResolucion).toLocaleDateString('es-GT') : 'N/A'}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1 sm:gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleView(hallazgo)}
                                  title="Ver detalles"
                                  className="h-8 w-8 p-0"
                                >
                                  <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                  
                  {hallazgosResueltos.length === 0 && (
                    <div className="text-center py-8 sm:py-12 text-muted-foreground px-4">
                      <History className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 opacity-30" />
                      <p className="text-sm sm:text-base">No hay hallazgos resueltos que coincidan con los filtros</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Columna derecha: Estadísticas (solo visible en desktop LG+) */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24 grid grid-cols-1 gap-2">
            <Card className="border-0 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 shadow-md">
              <CardContent className="p-2">
                <div className="flex flex-col items-center justify-center">
                  <Activity className="h-5 w-5 text-blue-700 dark:text-blue-300 mb-1" />
                  <p className="text-xl text-blue-800 dark:text-blue-200">{estadisticas.activos}</p>
                  <p className="text-[10px] text-blue-700/80 dark:text-blue-300/80 text-center leading-tight">Activos</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40 shadow-md">
              <CardContent className="p-2">
                <div className="flex flex-col items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-700 dark:text-red-300 mb-1" />
                  <p className="text-xl text-red-800 dark:text-red-200">{estadisticas.criticos}</p>
                  <p className="text-[10px] text-red-700/80 dark:text-red-300/80 text-center leading-tight">Críticos</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/40 dark:to-yellow-800/40 shadow-md">
              <CardContent className="p-2">
                <div className="flex flex-col items-center justify-center">
                  <FileText className="h-5 w-5 text-yellow-700 dark:text-yellow-300 mb-1" />
                  <p className="text-xl text-yellow-800 dark:text-yellow-200">{estadisticas.reportados}</p>
                  <p className="text-[10px] text-yellow-700/80 dark:text-yellow-300/80 text-center leading-tight">Reportados</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 shadow-md">
              <CardContent className="p-2">
                <div className="flex flex-col items-center justify-center">
                  <Search className="h-5 w-5 text-purple-700 dark:text-purple-300 mb-1" />
                  <p className="text-xl text-purple-800 dark:text-purple-200">{estadisticas.enInvestigacion}</p>
                  <p className="text-[10px] text-purple-700/80 dark:text-purple-300/80 text-center leading-tight">Investigación</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/40 dark:to-orange-800/40 shadow-md">
              <CardContent className="p-2">
                <div className="flex flex-col items-center justify-center">
                  <Clock className="h-5 w-5 text-orange-700 dark:text-orange-300 mb-1" />
                  <p className="text-xl text-orange-800 dark:text-orange-200">{estadisticas.enProceso}</p>
                  <p className="text-[10px] text-orange-700/80 dark:text-orange-300/80 text-center leading-tight">En Proceso</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 shadow-md">
              <CardContent className="p-2">
                <div className="flex flex-col items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-700 dark:text-green-300 mb-1" />
                  <p className="text-xl text-green-800 dark:text-green-200">{estadisticas.resueltos}</p>
                  <p className="text-[10px] text-green-700/80 dark:text-green-300/80 text-center leading-tight">Resueltos</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialog para ver detalles del hallazgo */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="w-[95vw] sm:w-[90vw] max-w-4xl max-h-[90vh] overflow-y-auto p-3 sm:p-4 md:p-6">
          <DialogHeader className="pb-2 sm:pb-3 md:pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 dark:text-red-400" />
              <DialogTitle className="text-sm sm:text-base md:text-xl">Detalles del Hallazgo</DialogTitle>
            </div>
            <DialogDescription className="text-[10px] sm:text-xs md:text-sm">
              Información completa del hallazgo registrado
            </DialogDescription>
          </DialogHeader>
          
          {selectedHallazgo && (() => {
            const area = areasProtegidas.find(a => a.id === selectedHallazgo.areaProtegida);
            const guardarecurso = guardarecursos.find(g => g.id === selectedHallazgo.guardarecurso);
            const prioridadInfo = getPrioridadInfo(selectedHallazgo.prioridad);
            
            return (
              <div className="space-y-4 sm:space-y-6 pt-2 sm:pt-3 md:pt-4">
                {/* Información General */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm sm:text-base flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Información General
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label className="text-xs sm:text-sm font-semibold">Título</Label>
                      <p className="text-xs sm:text-sm mt-1">{selectedHallazgo.titulo}</p>
                    </div>
                    <div>
                      <Label className="text-xs sm:text-sm font-semibold">Tipo</Label>
                      <Badge variant="outline" className="mt-1 text-xs">{selectedHallazgo.tipo}</Badge>
                    </div>
                    <div>
                      <Label className="text-xs sm:text-sm font-semibold">Prioridad</Label>
                      <Badge className={`${prioridadInfo.badge} mt-1 text-xs`}>
                        {selectedHallazgo.prioridad}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-xs sm:text-sm font-semibold">Estado</Label>
                      <Badge variant={getEstadoBadgeVariant(selectedHallazgo.estado)} className="mt-1 text-xs">
                        {selectedHallazgo.estado}
                      </Badge>
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="text-xs sm:text-sm font-semibold">Descripción</Label>
                      <p className="text-xs sm:text-sm mt-1">{selectedHallazgo.descripcion}</p>
                    </div>
                    <div>
                      <Label className="text-xs sm:text-sm font-semibold">Ubicación</Label>
                      <p className="text-xs sm:text-sm mt-1">{selectedHallazgo.ubicacion}</p>
                      {selectedHallazgo.coordenadas && (
                        <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                          {selectedHallazgo.coordenadas.lat.toFixed(4)}, {selectedHallazgo.coordenadas.lng.toFixed(4)}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="text-xs sm:text-sm font-semibold">Área Protegida</Label>
                      <p className="text-xs sm:text-sm mt-1">{area?.nombre}</p>
                    </div>
                    <div>
                      <Label className="text-xs sm:text-sm font-semibold">Guardarecurso</Label>
                      <p className="text-xs sm:text-sm mt-1">{guardarecurso?.nombre} {guardarecurso?.apellido}</p>
                    </div>
                    <div>
                      <Label className="text-xs sm:text-sm font-semibold">Fecha de Reporte</Label>
                      <p className="text-xs sm:text-sm mt-1">
                        {new Date(selectedHallazgo.fechaReporte).toLocaleDateString('es-GT', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Línea Temporal de Seguimiento */}
                {selectedHallazgo.seguimiento.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm sm:text-base flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Línea Temporal de Seguimiento
                    </h3>
                    <div className="relative pl-6 sm:pl-8">
                      {/* Línea vertical */}
                      <div className="absolute left-2 sm:left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500"></div>
                      
                      {/* Items de seguimiento */}
                      <div className="space-y-4 sm:space-y-6">
                        {selectedHallazgo.seguimiento.map((seg, index) => (
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
                                  <User className="h-3 w-3" />
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
                )}

                {/* Evidencias Fotográficas */}
                {selectedHallazgo.evidencias.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm sm:text-base flex items-center gap-2">
                      <Camera className="h-4 w-4" />
                      Evidencias Fotográficas
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                      {selectedHallazgo.evidencias.map((evidencia, index) => (
                        <div 
                          key={index} 
                          className="group relative rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-500 transition-all duration-200 cursor-pointer shadow-md hover:shadow-xl"
                        >
                          <div className="aspect-square bg-gray-100 dark:bg-gray-800">
                            {evidencia.startsWith('data:image') || evidencia.startsWith('http') ? (
                              <img
                                src={evidencia}
                                alt={`Evidencia ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center p-2">
                                <Camera className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-gray-400 mb-1 sm:mb-2" />
                                <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground px-1 text-center line-clamp-2">{evidencia}</p>
                              </div>
                            )}
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-1.5 sm:p-2">
                            <p className="text-[9px] sm:text-[10px] text-white font-medium">
                              Foto {index + 1}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Observaciones Finales */}
                {selectedHallazgo.observaciones && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm sm:text-base flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Observaciones Finales
                    </h3>
                    <p className="text-xs sm:text-sm bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                      {selectedHallazgo.observaciones}
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
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Dialog para agregar seguimiento */}
      <Dialog open={isSeguimientoDialogOpen} onOpenChange={setIsSeguimientoDialogOpen}>
        <DialogContent className="w-[95vw] sm:w-[90vw] max-w-2xl max-h-[90vh] overflow-y-auto p-3 sm:p-4 md:p-6">
          <DialogHeader className="pb-2 sm:pb-3 md:pb-4 border-b border-gray-200 dark:border-gray-700">
            <DialogTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40 flex items-center justify-center flex-shrink-0">
                <ListPlus className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span>Agregar Seguimiento</span>
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Registra una nueva acción de seguimiento para el hallazgo
            </DialogDescription>
          </DialogHeader>
          
          {hallazgoParaSeguimiento && (
            <>
              {/* Info del hallazgo */}
              <div className="p-2.5 sm:p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 mt-3 sm:mt-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-xs sm:text-sm mb-1 line-clamp-1">{hallazgoParaSeguimiento.titulo}</h4>
                    <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-2">{hallazgoParaSeguimiento.descripcion}</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmitSeguimiento} className="space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="accion" className="text-xs sm:text-sm">Acción Realizada *</Label>
                  <Input
                    id="accion"
                    value={seguimientoFormData.accion}
                    onChange={(e) => setSeguimientoFormData({...seguimientoFormData, accion: e.target.value})}
                    placeholder="Ej: Inspección del área..."
                    className="text-xs sm:text-sm h-9 sm:h-10"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observaciones-seguimiento" className="text-xs sm:text-sm">Observaciones *</Label>
                  <Textarea
                    id="observaciones-seguimiento"
                    value={seguimientoFormData.observaciones}
                    onChange={(e) => setSeguimientoFormData({...seguimientoFormData, observaciones: e.target.value})}
                    placeholder="Describe los detalles de la acción realizada..."
                    rows={4}
                    className="resize-none text-xs sm:text-sm"
                    required
                  />
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setSeguimientoFormData({ accion: '', observaciones: '' });
                      setIsSeguimientoDialogOpen(false);
                    }}
                    className="w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-cyan-700 hover:from-blue-700 hover:to-cyan-800"
                  >
                    <ListPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                    <span className="hidden sm:inline">Agregar Seguimiento</span>
                    <span className="sm:hidden">Agregar</span>
                  </Button>
                </div>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}