import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapaAreasProtegidas } from './MapaAreasProtegidas';
import { AreaProtegidaDetalle } from './AreaProtegidaDetalle';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { AreaProtegida } from '../types';
import { areasProtegidas, guardarecursos, actividades, hallazgos, incidentesVisitantes } from '../data/mock-data';
import { 
  Users, 
  Activity, 
  CheckCircle,
  Clock,
  Eye,
  Calendar,
  Globe,
  Target,
  X
} from 'lucide-react';
import { Button } from './ui/button';

interface DashboardProps {
  onNavigate?: (section: string) => void;
  currentUser?: any;
}

export function Dashboard({ onNavigate, currentUser }: DashboardProps) {
  const [selectedArea, setSelectedArea] = useState<AreaProtegida | null>(null);
  
  // Determinar si el usuario actual es un guardarecurso
  const isGuardarecurso = currentUser?.rol === 'Guardarecurso';

  // Filtrar áreas protegidas según el rol del usuario
  const areasToShow = isGuardarecurso 
    ? areasProtegidas.filter(area => {
        // Si el guardarecurso tiene un área asignada, mostrar solo esa
        const guardarecursoData = guardarecursos.find(g => g.id === currentUser?.id);
        return guardarecursoData?.areaAsignada === area.id;
      })
    : areasProtegidas; // Admin y Coordinador ven todas las áreas

  const handleAreaSelect = (area: AreaProtegida) => {
    setSelectedArea(area);
  };

  const handleCloseDetail = () => {
    setSelectedArea(null);
  };

  const estadisticas = {
    totalAreas: areasProtegidas.length,
    totalGuardarecursos: guardarecursos.length,
    totalActividades: actividades.length,
    actividadesHoy: actividades.filter(a => a.fecha === new Date().toISOString().split('T')[0]).length,
    actividadesCompletadas: actividades.filter(a => a.estado === 'Completada').length,
    actividadesEnProgreso: actividades.filter(a => a.estado === 'En Progreso').length,
    actividadesProgramadas: actividades.filter(a => a.estado === 'Programada').length,
    hallazgosReportados: hallazgos.length,
    incidentesVisitantes: incidentesVisitantes.length
  };



  const estadisticasPrincipales = [
    {
      title: "Áreas Protegidas",
      value: estadisticas.totalAreas,
      subtitle: "Sitios bajo protección",
      icon: Globe,
      color: "green",
      trend: "+2 nuevas áreas",
      section: "asignacion-zonas"
    },
    {
      title: "Guardarecursos",
      value: estadisticas.totalGuardarecursos,
      subtitle: "Personal especializado",
      icon: Users,
      color: "blue",
      trend: "96% activos",
      section: "registro-guarda"
    },
    {
      title: "Actividades",
      value: estadisticas.totalActividades,
      subtitle: "Operaciones registradas",
      icon: Activity,
      color: "purple",
      trend: "+18% este mes",
      section: "planificacion"
    },
    {
      title: "Actividades Hoy",
      value: estadisticas.actividadesHoy,
      subtitle: "Programadas para hoy",
      icon: Target,
      color: "orange",
      trend: "En tiempo",
      section: "registro-diario"
    }
  ];

  const estadisticasEstado = [
    {
      title: "Completadas",
      value: estadisticas.actividadesCompletadas,
      subtitle: "+12% desde el mes pasado",
      icon: CheckCircle,
      color: "green",
      progress: 85,
      trend: "Rendimiento óptimo"
    },
    {
      title: "En Progreso",
      value: estadisticas.actividadesEnProgreso,
      subtitle: "Actividades en curso",
      icon: Clock,
      color: "blue",
      progress: 65,
      trend: "En desarrollo"
    },
    {
      title: "Programadas",
      value: estadisticas.actividadesProgramadas,
      subtitle: "Próximas actividades",
      icon: Calendar,
      color: "amber",
      progress: 45,
      trend: "Bien planificadas"
    },
    {
      title: "Hallazgos",
      value: estadisticas.hallazgosReportados,
      subtitle: "Irregularidades detectadas",
      icon: Eye,
      color: "red",
      progress: 25,
      trend: "Bajo control"
    }
  ];

  return (
    <div className="space-y-2.5 sm:space-y-3 md:space-y-4 relative h-full flex flex-col min-h-0">
      {/* Mensaje si el guardarecurso no tiene área asignada */}
      {isGuardarecurso && areasToShow.length === 0 && (
        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                <Globe className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                  No tienes un área asignada
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Contacta con tu coordinador para que te asigne un área protegida.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grid principal responsive: Mapa a la izquierda, Estadísticas a la derecha */}
      {(!isGuardarecurso || areasToShow.length > 0) && (
      <div className={`grid gap-2.5 sm:gap-3 md:gap-4 flex-1 min-h-0 ${isGuardarecurso ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
        {/* Columna izquierda: Mapa - Altura adaptativa y responsive */}
        <div className={`${isGuardarecurso ? 'h-[400px] sm:h-[450px] md:h-[500px] lg:h-[600px] xl:h-[650px]' : 'h-[280px] sm:h-[360px] md:h-[420px] lg:h-full'} min-h-0 ${isGuardarecurso ? 'col-span-1' : 'lg:col-span-2'}`}>
          <MapaAreasProtegidas 
            areas={areasToShow} 
            onAreaSelect={handleAreaSelect}
            selectedAreaId={selectedArea?.id}
            title={isGuardarecurso ? "Mi Área Protegida" : "Mapa de Áreas Protegidas de Guatemala"}
          />
        </div>

        {/* Columna derecha: Estadísticas - Responsive - Solo para Admin y Coordinador */}
        {!isGuardarecurso && (
        <div className="lg:col-span-1 h-auto lg:h-full min-h-0 flex flex-col gap-2.5 sm:gap-3 md:gap-4">
          {/* Estadísticas principales en grid responsive */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-2 sm:gap-2.5 md:gap-3">
          {estadisticasPrincipales.map((stat) => {
            const colorClasses = {
              green: {
                iconBg: 'bg-green-50 dark:bg-green-950/30',
                icon: 'text-green-600 dark:text-green-400',
                border: 'hover:border-green-200 dark:hover:border-green-900',
                trend: 'text-green-600 dark:text-green-400'
              },
              blue: {
                iconBg: 'bg-blue-50 dark:bg-blue-950/30',
                icon: 'text-blue-600 dark:text-blue-400',
                border: 'hover:border-blue-200 dark:hover:border-blue-900',
                trend: 'text-blue-600 dark:text-blue-400'
              },
              purple: {
                iconBg: 'bg-purple-50 dark:bg-purple-950/30',
                icon: 'text-purple-600 dark:text-purple-400',
                border: 'hover:border-purple-200 dark:hover:border-purple-900',
                trend: 'text-purple-600 dark:text-purple-400'
              },
              orange: {
                iconBg: 'bg-orange-50 dark:bg-orange-950/30',
                icon: 'text-orange-600 dark:text-orange-400',
                border: 'hover:border-orange-200 dark:hover:border-orange-900',
                trend: 'text-orange-600 dark:text-orange-400'
              }
            };
            
            const colors = colorClasses[stat.color as keyof typeof colorClasses];
            
            return (
              <div
                key={stat.title}
                onClick={() => onNavigate?.(stat.section)}
                className="group cursor-pointer"
              >
                <Card className={`border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 ${colors.border} transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] h-full overflow-hidden`}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 sm:pb-2.5 p-2 sm:p-3.5 md:p-4">
                    <CardTitle className="text-xs sm:text-sm text-muted-foreground truncate pr-1.5 font-medium">
                      {stat.title}
                    </CardTitle>
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 ${colors.iconBg} rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 flex-shrink-0`}>
                      <stat.icon className={`h-3 w-3 sm:h-4 sm:w-4 md:h-4.5 md:w-4.5 ${colors.icon}`} />
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-2 sm:p-3.5 md:p-4 pt-0">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-0.5 sm:mb-1 leading-tight">
                      {stat.value}
                    </div>
                    <p className="text-xs sm:text-xs text-muted-foreground mb-0.5 sm:mb-1 hidden sm:block truncate leading-tight">
                      {stat.subtitle}
                    </p>
                    <div className={`text-xs sm:text-xs ${colors.trend} truncate font-medium`}>
                      {stat.trend}
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
          </div>

          {/* Estado de actividades en grid responsive */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-2 sm:gap-2.5 md:gap-3">
          {estadisticasEstado.map((stat) => {
            const colorClasses = {
              green: {
                iconBg: 'bg-green-50 dark:bg-green-950/30',
                icon: 'text-green-600 dark:text-green-400',
                progress: 'bg-green-500 dark:bg-green-400',
                trend: 'text-green-600 dark:text-green-400'
              },
              blue: {
                iconBg: 'bg-blue-50 dark:bg-blue-950/30',
                icon: 'text-blue-600 dark:text-blue-400',
                progress: 'bg-blue-500 dark:bg-blue-400',
                trend: 'text-blue-600 dark:text-blue-400'
              },
              amber: {
                iconBg: 'bg-amber-50 dark:bg-amber-950/30',
                icon: 'text-amber-600 dark:text-amber-400',
                progress: 'bg-amber-500 dark:bg-amber-400',
                trend: 'text-amber-600 dark:text-amber-400'
              },
              red: {
                iconBg: 'bg-red-50 dark:bg-red-950/30',
                icon: 'text-red-600 dark:text-red-400',
                progress: 'bg-red-500 dark:bg-red-400',
                trend: 'text-red-600 dark:text-red-400'
              }
            };
            
            const colors = colorClasses[stat.color as keyof typeof colorClasses];
            
            return (
              <div key={stat.title} className="h-full group">
                <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] h-full flex flex-col overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 sm:pb-2.5 p-2 sm:p-3.5 md:p-4">
                    <CardTitle className="text-xs sm:text-sm text-muted-foreground truncate pr-1.5 font-medium">
                      {stat.title}
                    </CardTitle>
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 ${colors.iconBg} rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 flex-shrink-0`}>
                      <stat.icon className={`h-3 w-3 sm:h-4 sm:w-4 md:h-4.5 md:w-4.5 ${colors.icon}`} />
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-2 sm:p-3.5 md:p-4 pt-0 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-0.5 sm:mb-1 leading-tight">
                        {stat.value}
                      </div>
                      <p className="text-xs sm:text-xs text-muted-foreground mb-0.5 sm:mb-1 hidden sm:block truncate leading-tight">
                        {stat.subtitle}
                      </p>
                      <div className={`text-xs sm:text-xs ${colors.trend} mb-1.5 sm:mb-3 truncate font-medium`}>
                        {stat.trend}
                      </div>
                    </div>
                    
                    <div>
                      {/* Barra de progreso mejorada con color */}
                      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 sm:h-2 overflow-hidden shadow-inner">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${stat.progress}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className={`h-full rounded-full ${colors.progress}`}
                        />
                      </div>

                      <div className="mt-1 sm:mt-2 text-xs sm:text-xs text-muted-foreground font-medium">
                        {stat.progress}%
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
          </div>
        </div>
        )}
      </div>
      )}

      {/* Card flotante con detalles del área protegida */}
      <AnimatePresence>
        {selectedArea && (
          <>
            {/* Backdrop oscuro */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={handleCloseDetail}
            />
            
            {/* Card flotante responsive con margen superior para no tapar el header */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ 
                duration: 0.4, 
                ease: [0.4, 0, 0.2, 1],
                scale: { type: "spring", stiffness: 300, damping: 25 }
              }}
              className="fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[96%] sm:w-[90%] md:w-[75%] lg:w-[65%] xl:w-[60%] max-w-3xl max-h-[90vh] sm:max-h-[85vh] z-50 overflow-hidden"
            >
              <div className="h-full w-full bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col relative">
                {/* Botón de cerrar flotante */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCloseDetail}
                  className="absolute top-4 right-4 z-10 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-gray-200 dark:hover:bg-gray-700 h-10 w-10 shadow-lg flex-shrink-0 transition-all duration-200 active:scale-95 border border-gray-200 dark:border-gray-700"
                >
                  <X className="h-5 w-5" />
                </Button>
                
                {/* Contenido scrolleable responsive */}
                <div className="flex-1 overflow-auto p-2.5 sm:p-3 md:p-4">
                  <AreaProtegidaDetalle 
                    area={selectedArea} 
                    isSimplified={isGuardarecurso}
                    allAreas={areasToShow}
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}