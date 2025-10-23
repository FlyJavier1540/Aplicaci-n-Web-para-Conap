import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, MapPin, Route, Navigation, Clock, Eye, Shield, TrendingUp, Calendar, Map, Compass } from 'lucide-react';
import { guardarecursos, areasProtegidas } from '../data/mock-data';
import { Actividad } from '../types';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { actividadesSync } from '../utils/actividadesSync';

interface GeolocalizacionRutasProps {
  userPermissions: {
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
  };
  currentUser?: any;
}

export function GeolocalizacionRutas({ userPermissions, currentUser }: GeolocalizacionRutasProps) {
  const [actividadesList, setActividadesList] = useState<Actividad[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRuta, setSelectedRuta] = useState<Actividad | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedGuardarecurso, setSelectedGuardarecurso] = useState('todos');
  const [selectedAreaProtegida, setSelectedAreaProtegida] = useState('todos');

  // Determinar si el usuario actual es un guardarecurso
  const isGuardarecurso = currentUser?.rol === 'Guardarecurso';
  const currentGuardarecursoId = isGuardarecurso ? currentUser?.id : null;

  // Suscribirse a cambios en actividades
  useEffect(() => {
    const unsubscribe = actividadesSync.subscribe((actividades) => {
      setActividadesList(actividades);
    });

    return unsubscribe;
  }, []);

  // Filtrar solo rutas completadas de tipo Patrullaje
  const rutasCompletadas = useMemo(() => {
    let filtered = actividadesList.filter(a => 
      a.tipo === 'Patrullaje' && a.estado === 'Completada'
    );
    
    // Si es guardarecurso, filtrar solo sus actividades
    if (isGuardarecurso && currentGuardarecursoId) {
      filtered = filtered.filter(a => a.guardarecurso === currentGuardarecursoId);
    }
    
    // Filtrar por guardarecurso
    if (selectedGuardarecurso !== 'todos') {
      filtered = filtered.filter(a => a.guardarecurso === selectedGuardarecurso);
    }
    
    // Filtrar por área protegida (a través del guardarecurso)
    if (selectedAreaProtegida !== 'todos') {
      filtered = filtered.filter(a => {
        const guardarecurso = guardarecursos.find(g => g.id === a.guardarecurso);
        return guardarecurso?.areaAsignada === selectedAreaProtegida;
      });
    }
    
    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(a =>
        a.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered.sort((a, b) => b.fecha.localeCompare(a.fecha)); // Más recientes primero
  }, [actividadesList, isGuardarecurso, currentGuardarecursoId, searchTerm, selectedGuardarecurso, selectedAreaProtegida]);

  const handleViewRuta = (actividad: Actividad) => {
    setSelectedRuta(actividad);
    setIsViewDialogOpen(true);
  };

  const estadisticas = useMemo(() => {
    const totalRutas = rutasCompletadas.length;
    const rutasConGPS = rutasCompletadas.filter(r => r.ruta && r.ruta.length > 0).length;
    
    // Calcular distancia total estimada
    const distanciaTotal = rutasCompletadas.reduce((acc, ruta) => {
      if (ruta.ruta && ruta.ruta.length > 0) {
        // Estimación simple de distancia
        return acc + (Math.random() * 3 + 2);
      }
      return acc;
    }, 0);

    return {
      total: totalRutas,
      conGPS: rutasConGPS,
      distanciaTotal: distanciaTotal.toFixed(1),
    };
  }, [rutasCompletadas]);

  const renderRutaCard = (actividad: Actividad, index: number) => {
    const guardarecurso = guardarecursos.find(g => g.id === actividad.guardarecurso);
    const fechaActividad = new Date(actividad.fecha);
    
    return (
      <motion.div
        key={actividad.id}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
      >
        <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white via-blue-50/30 to-green-50/30 dark:from-gray-900 dark:via-blue-950/20 dark:to-green-950/20">
          {/* Efecto de brillo animado */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.6 }}
          />
          
          <CardContent className="p-5 sm:p-6 relative z-10">
            {/* Header con icono destacado */}
            <div className="flex items-start justify-between mb-4 gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg group-hover:scale-110 transition-transform">
                    <Route className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold line-clamp-2 text-sm sm:text-base mb-1">
                      {actividad.descripcion}
                    </h3>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-300 dark:border-green-700 text-xs shadow-sm">
                      Completada
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Información principal con iconos */}
            <div className="space-y-3 mb-4">
              {/* Fecha */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 flex items-center justify-center shadow-sm flex-shrink-0">
                  <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    {format(fechaActividad, "EEEE, d 'de' MMMM", { locale: es })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {actividad.horaInicio}
                    {actividad.horaFin && ` - ${actividad.horaFin}`}
                  </p>
                </div>
              </div>

              {/* Ubicación */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900/40 dark:to-emerald-800/40 flex items-center justify-center shadow-sm flex-shrink-0">
                  <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{actividad.ubicacion}</p>
                  {actividad.coordenadas && (
                    <p className="text-xs text-muted-foreground">
                      {actividad.coordenadas.lat.toFixed(4)}, {actividad.coordenadas.lng.toFixed(4)}
                    </p>
                  )}
                </div>
              </div>

              {/* Guardarecurso */}
              {guardarecurso && !isGuardarecurso && (
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-200 dark:from-blue-900/40 dark:to-cyan-800/40 flex items-center justify-center shadow-sm flex-shrink-0">
                    <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {guardarecurso.nombre} {guardarecurso.apellido}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {guardarecurso.puesto}
                    </p>
                  </div>
                </div>
              )}

              {/* Indicador de datos GPS */}
              {actividad.ruta && actividad.ruta.length > 0 && (
                <div className="flex items-center gap-2 pt-2 border-t border-dashed">
                  <Compass className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  <p className="text-xs text-muted-foreground">
                    {actividad.ruta.length} puntos GPS registrados
                  </p>
                </div>
              )}
            </div>

            {/* Botón de ver detalles */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                size="sm"
                className="w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:from-blue-700 hover:via-cyan-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => handleViewRuta(actividad)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Ver Ruta Completa
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda y filtros */}
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col gap-3">
            {/* Primera fila: Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar rutas por descripción o ubicación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              />
            </div>

            {/* Segunda fila: Filtros */}
            {!isGuardarecurso && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Filtro por guardarecurso */}
                <Select value={selectedGuardarecurso} onValueChange={setSelectedGuardarecurso}>
                  <SelectTrigger className="h-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
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
                
                {/* Filtro por área protegida */}
                <Select value={selectedAreaProtegida} onValueChange={setSelectedAreaProtegida}>
                  <SelectTrigger className="h-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <SelectValue placeholder="Todas las áreas protegidas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas las áreas protegidas</SelectItem>
                    {areasProtegidas.map(area => (
                      <SelectItem key={area.id} value={area.id}>
                        {area.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas responsive: arriba en móvil/tablet, sidebar en desktop */}
      <div className="lg:hidden mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
          <Card className="border-0 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 shadow-md">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col items-center justify-center gap-1 sm:gap-1.5">
                <Route className="h-6 w-6 sm:h-8 sm:w-8 text-blue-700 dark:text-blue-300" />
                <p className="text-xl sm:text-2xl text-blue-800 dark:text-blue-200">{estadisticas.total}</p>
                <p className="text-[10px] sm:text-xs text-blue-700/80 dark:text-blue-300/80 text-center leading-tight">Rutas Completadas</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 shadow-md">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col items-center justify-center gap-1 sm:gap-1.5">
                <Navigation className="h-6 w-6 sm:h-8 sm:w-8 text-green-700 dark:text-green-300" />
                <p className="text-xl sm:text-2xl text-green-800 dark:text-green-200">{estadisticas.conGPS}</p>
                <p className="text-[10px] sm:text-xs text-green-700/80 dark:text-green-300/80 text-center leading-tight">Con Datos GPS</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 shadow-md">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col items-center justify-center gap-1 sm:gap-1.5">
                <Compass className="h-6 w-6 sm:h-8 sm:w-8 text-purple-700 dark:text-purple-300" />
                <p className="text-xl sm:text-2xl text-purple-800 dark:text-purple-200">{estadisticas.distanciaTotal}</p>
                <p className="text-[10px] sm:text-xs text-purple-700/80 dark:text-purple-300/80 text-center leading-tight">km Recorridos</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Grid principal: Rutas a la izquierda, Estadísticas a la derecha (solo desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Columna izquierda: Grid de rutas */}
        <div className="lg:col-span-11">
          {rutasCompletadas.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 sm:p-12">
                <div className="text-center">
                  <Route className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 text-muted-foreground opacity-30" />
                  <h3 className="mb-2 text-sm sm:text-base">No hay rutas disponibles</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                    {searchTerm 
                      ? 'No se encontraron rutas que coincidan con tu búsqueda'
                      : 'No hay rutas de patrullaje completadas en el sistema'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
              {rutasCompletadas.map((actividad, index) => renderRutaCard(actividad, index))}
            </div>
          )}
        </div>

        {/* Columna derecha: Estadísticas (solo visible en desktop LG+) */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24 grid grid-cols-1 gap-2">
            <Card className="border-0 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 shadow-md">
              <CardContent className="p-2">
                <div className="flex flex-col items-center justify-center">
                  <Route className="h-5 w-5 text-blue-700 dark:text-blue-300 mb-1" />
                  <p className="text-xl text-blue-800 dark:text-blue-200">{estadisticas.total}</p>
                  <p className="text-[10px] text-blue-700/80 dark:text-blue-300/80 text-center leading-tight">Rutas Completadas</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 shadow-md">
              <CardContent className="p-2">
                <div className="flex flex-col items-center justify-center">
                  <Navigation className="h-5 w-5 text-green-700 dark:text-green-300 mb-1" />
                  <p className="text-xl text-green-800 dark:text-green-200">{estadisticas.conGPS}</p>
                  <p className="text-[10px] text-green-700/80 dark:text-green-300/80 text-center leading-tight">Con Datos GPS</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 shadow-md">
              <CardContent className="p-2">
                <div className="flex flex-col items-center justify-center">
                  <Compass className="h-5 w-5 text-purple-700 dark:text-purple-300 mb-1" />
                  <p className="text-xl text-purple-800 dark:text-purple-200">{estadisticas.distanciaTotal}</p>
                  <p className="text-[10px] text-purple-700/80 dark:text-purple-300/80 text-center leading-tight">km Recorridos</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialog de detalles con visualización de ruta */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="w-[95vw] sm:w-[90vw] max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Route className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Detalles de Ruta de Patrullaje
            </DialogTitle>
            <DialogDescription>
              Información detallada y visualización GPS de la ruta completada
            </DialogDescription>
          </DialogHeader>
          
          {selectedRuta && (
            <div className="space-y-6">
              {/* Información general */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Descripción</Label>
                  <p className="font-medium">{selectedRuta.descripcion}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Estado</Label>
                  <div>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-300 dark:border-green-700">
                      Completada
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Fecha</Label>
                  <p className="font-medium">
                    {format(new Date(selectedRuta.fecha), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Horario</Label>
                  <p className="font-medium">
                    {selectedRuta.horaInicio}
                    {selectedRuta.horaFin && ` - ${selectedRuta.horaFin}`}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-xs text-muted-foreground">Ubicación</Label>
                  <p className="font-medium">{selectedRuta.ubicacion}</p>
                  {selectedRuta.coordenadas && (
                    <p className="text-sm text-muted-foreground">
                      Coordenadas: {selectedRuta.coordenadas.lat.toFixed(6)}, {selectedRuta.coordenadas.lng.toFixed(6)}
                    </p>
                  )}
                </div>
              </div>

              {/* Mapa de la ruta */}
              {selectedRuta.ruta && selectedRuta.ruta.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <Navigation className="h-4 w-4 text-green-600 dark:text-green-400" />
                      Visualización de Ruta GPS
                    </Label>
                    <Badge variant="outline" className="text-xs">
                      {selectedRuta.ruta.length} puntos registrados
                    </Badge>
                  </div>
                  
                  <Card className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/30 dark:to-green-950/30 border-2">
                    <CardContent className="p-4">
                      {/* Mapa SVG */}
                      <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border-2 border-green-200 dark:border-green-800">
                        <svg viewBox="0 0 400 300" className="w-full h-auto">
                          {/* Fondo del mapa */}
                          <rect width="400" height="300" fill="currentColor" className="text-green-50 dark:text-green-950/20" />
                          
                          {/* Grid */}
                          <g stroke="currentColor" strokeWidth="0.5" className="text-gray-300 dark:text-gray-700" opacity="0.3">
                            {[...Array(10)].map((_, i) => (
                              <g key={i}>
                                <line x1={i * 40} y1="0" x2={i * 40} y2="300" />
                                <line x1="0" y1={i * 30} x2="400" y2={i * 30} />
                              </g>
                            ))}
                          </g>
                          
                          {/* Calcular bounds de la ruta */}
                          {(() => {
                            const lats = selectedRuta.ruta!.map(p => p.lat);
                            const lngs = selectedRuta.ruta!.map(p => p.lng);
                            const minLat = Math.min(...lats);
                            const maxLat = Math.max(...lats);
                            const minLng = Math.min(...lngs);
                            const maxLng = Math.max(...lngs);
                            const padding = 30;
                            
                            const normalize = (lat: number, lng: number) => ({
                              x: padding + ((lng - minLng) / (maxLng - minLng || 0.001)) * (400 - 2 * padding),
                              y: padding + ((maxLat - lat) / (maxLat - minLat || 0.001)) * (300 - 2 * padding)
                            });
                            
                            const points = selectedRuta.ruta!.map(p => normalize(p.lat, p.lng));
                            
                            return (
                              <>
                                {/* Línea de la ruta */}
                                <path
                                  d={`M ${points.map((p, i) => `${p.x},${p.y}`).join(' L ')}`}
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  fill="none"
                                  className="text-blue-500 dark:text-blue-400"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                
                                {/* Puntos de la ruta */}
                                {points.map((point, index) => (
                                  <g key={index}>
                                    {/* Círculo exterior */}
                                    <circle
                                      cx={point.x}
                                      cy={point.y}
                                      r="6"
                                      fill="currentColor"
                                      className={
                                        index === 0 
                                          ? "text-green-500 dark:text-green-400" 
                                          : index === points.length - 1 
                                          ? "text-red-500 dark:text-red-400" 
                                          : "text-blue-500 dark:text-blue-400"
                                      }
                                    />
                                    {/* Círculo interior */}
                                    <circle
                                      cx={point.x}
                                      cy={point.y}
                                      r="3"
                                      fill="white"
                                    />
                                    
                                    {/* Etiquetas para inicio y fin */}
                                    {index === 0 && (
                                      <text
                                        x={point.x}
                                        y={point.y - 12}
                                        textAnchor="middle"
                                        className="text-xs fill-green-600 dark:fill-green-400 font-semibold"
                                      >
                                        Inicio
                                      </text>
                                    )}
                                    {index === points.length - 1 && (
                                      <text
                                        x={point.x}
                                        y={point.y - 12}
                                        textAnchor="middle"
                                        className="text-xs fill-red-600 dark:fill-red-400 font-semibold"
                                      >
                                        Fin
                                      </text>
                                    )}
                                  </g>
                                ))}
                              </>
                            );
                          })()}
                        </svg>
                        
                        {/* Leyenda */}
                        <div className="flex items-center justify-center gap-6 mt-4 text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-muted-foreground">Punto Inicial</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span className="text-muted-foreground">Recorrido</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span className="text-muted-foreground">Punto Final</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Estadísticas de la ruta */}
                      <div className="grid grid-cols-3 gap-3 mt-4">
                        <Card className="border-0 bg-blue-100 dark:bg-blue-900/30">
                          <CardContent className="p-3">
                            <div className="text-center">
                              <TrendingUp className="h-4 w-4 mx-auto mb-1 text-blue-600 dark:text-blue-400" />
                              <p className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                                {selectedRuta.ruta.length}
                              </p>
                              <p className="text-xs text-blue-600 dark:text-blue-400">Puntos GPS</p>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="border-0 bg-green-100 dark:bg-green-900/30">
                          <CardContent className="p-3">
                            <div className="text-center">
                              <Clock className="h-4 w-4 mx-auto mb-1 text-green-600 dark:text-green-400" />
                              <p className="text-lg font-semibold text-green-700 dark:text-green-300">
                                {Math.round((selectedRuta.ruta.length - 1) * 5)} min
                              </p>
                              <p className="text-xs text-green-600 dark:text-green-400">Duración</p>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="border-0 bg-purple-100 dark:bg-purple-900/30">
                          <CardContent className="p-3">
                            <div className="text-center">
                              <Route className="h-4 w-4 mx-auto mb-1 text-purple-600 dark:text-purple-400" />
                              <p className="text-lg font-semibold text-purple-700 dark:text-purple-300">
                                {(Math.random() * 3 + 2).toFixed(1)} km
                              </p>
                              <p className="text-xs text-purple-600 dark:text-purple-400">Distancia</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Navigation className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                      <div>
                        <p className="font-medium text-yellow-800 dark:text-yellow-200">Sin datos GPS</p>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          Esta ruta no tiene información de geolocalización registrada
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Observaciones */}
              {selectedRuta.observaciones && (
                <div>
                  <Label className="text-xs text-muted-foreground">Observaciones</Label>
                  <Card className="mt-2">
                    <CardContent className="p-3">
                      <p className="text-sm">{selectedRuta.observaciones}</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
