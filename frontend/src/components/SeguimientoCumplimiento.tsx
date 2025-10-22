import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { CheckSquare, Clock, Activity, TrendingUp } from 'lucide-react';
import { actividades, guardarecursos } from '../data/mock-data';

interface MetricaCumplimiento {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: 'Actividades' | 'Tiempo' | 'Calidad' | 'Objetivos';
  meta: number;
  actual: number;
  unidad: string;
  periodo: 'Diario' | 'Semanal' | 'Mensual' | 'Trimestral' | 'Anual';
  guardarecurso?: string;
  fechaInicio: string;
  fechaFin: string;
}

interface SeguimientoCumplimientoProps {
  userPermissions: {
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
  };
  currentUser?: any;
}

export function SeguimientoCumplimiento({ userPermissions, currentUser }: SeguimientoCumplimientoProps) {
  const [metricas] = useState<MetricaCumplimiento[]>([
    {
      id: '1',
      nombre: 'Actividades Completadas',
      descripcion: 'Número de actividades completadas exitosamente',
      tipo: 'Actividades',
      meta: 30,
      actual: 28,
      unidad: 'actividades',
      periodo: 'Mensual',
      guardarecurso: '1',
      fechaInicio: '2024-09-01',
      fechaFin: '2024-09-30'
    },
    {
      id: '2',
      nombre: 'Puntualidad en Actividades',
      descripcion: 'Porcentaje de actividades iniciadas a tiempo',
      tipo: 'Tiempo',
      meta: 95,
      actual: 92,
      unidad: '%',
      periodo: 'Mensual',
      guardarecurso: '1',
      fechaInicio: '2024-09-01',
      fechaFin: '2024-09-30'
    },
    {
      id: '3',
      nombre: 'Calidad de Reportes',
      descripcion: 'Calificación promedio de calidad en reportes',
      tipo: 'Calidad',
      meta: 4.5,
      actual: 4.2,
      unidad: '/5',
      periodo: 'Mensual',
      guardarecurso: '2',
      fechaInicio: '2024-09-01',
      fechaFin: '2024-09-30'
    },
    {
      id: '4',
      nombre: 'Cobertura de Área',
      descripcion: 'Porcentaje del área cubierta en patrullajes',
      tipo: 'Objetivos',
      meta: 100,
      actual: 85,
      unidad: '%',
      periodo: 'Mensual',
      guardarecurso: '1',
      fechaInicio: '2024-09-01',
      fechaFin: '2024-09-30'
    },
    {
      id: '5',
      nombre: 'Reportes Entregados',
      descripcion: 'Número de reportes entregados a tiempo',
      tipo: 'Actividades',
      meta: 20,
      actual: 19,
      unidad: 'reportes',
      periodo: 'Mensual',
      guardarecurso: '2',
      fechaInicio: '2024-09-01',
      fechaFin: '2024-09-30'
    },
    {
      id: '6',
      nombre: 'Hallazgos Reportados',
      descripcion: 'Número de hallazgos identificados y reportados',
      tipo: 'Objetivos',
      meta: 15,
      actual: 18,
      unidad: 'hallazgos',
      periodo: 'Mensual',
      guardarecurso: '1',
      fechaInicio: '2024-09-01',
      fechaFin: '2024-09-30'
    }
  ]);

  const [selectedPeriodo, setSelectedPeriodo] = useState('Mensual');
  const [selectedGuardarecurso, setSelectedGuardarecurso] = useState<string>('todos');

  // Determinar si el usuario actual es un guardarecurso
  const isGuardarecurso = currentUser?.rol === 'Guardarecurso';
  const currentGuardarecursoId = isGuardarecurso ? currentUser?.id : null;

  const filteredMetricas = useMemo(() => {
    return metricas.filter(m => {
      const matchesPeriodo = m.periodo === selectedPeriodo;
      
      // Si es guardarecurso, filtrar solo sus métricas
      const matchesGuardarecurso = isGuardarecurso 
        ? m.guardarecurso === currentGuardarecursoId
        : selectedGuardarecurso === 'todos' || m.guardarecurso === selectedGuardarecurso;
      
      return matchesPeriodo && matchesGuardarecurso;
    });
  }, [metricas, selectedPeriodo, selectedGuardarecurso, isGuardarecurso, currentGuardarecursoId]);

  const calcularPorcentajeCumplimiento = (actual: number, meta: number) => {
    return Math.min((actual / meta) * 100, 100);
  };

  const getColorPorcentaje = (porcentaje: number) => {
    if (porcentaje >= 90) return 'text-green-600 dark:text-green-400';
    if (porcentaje >= 75) return 'text-yellow-600 dark:text-yellow-400';
    if (porcentaje >= 60) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const estadisticasGenerales = useMemo(() => {
    // Filtrar actividades según el rol del usuario
    const actividadesParaEstadisticas = isGuardarecurso 
      ? actividades.filter(a => a.guardarecurso === currentGuardarecursoId)
      : actividades;
    
    // Filtrar métricas según el rol del usuario
    const metricasParaEstadisticas = isGuardarecurso 
      ? metricas.filter(m => m.guardarecurso === currentGuardarecursoId)
      : metricas;
    
    return {
      totalActividades: actividadesParaEstadisticas.length,
      completadas: actividadesParaEstadisticas.filter(a => a.estado === 'Completada').length,
      enProgreso: actividadesParaEstadisticas.filter(a => a.estado === 'En Progreso').length,
      programadas: actividadesParaEstadisticas.filter(a => a.estado === 'Programada').length,
      cumplimientoPromedio: metricasParaEstadisticas.length > 0 
        ? metricasParaEstadisticas.reduce((acc, m) => acc + calcularPorcentajeCumplimiento(m.actual, m.meta), 0) / metricasParaEstadisticas.length
        : 0
    };
  }, [actividades, metricas, isGuardarecurso, currentGuardarecursoId]);

  return (
    <div className="space-y-4">
      {/* Barra de filtros */}
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className={`grid grid-cols-1 gap-3 ${!isGuardarecurso ? 'sm:grid-cols-2' : ''}`}>
            <div className="space-y-2">
              <Label htmlFor="periodo" className="text-xs sm:text-sm">Período</Label>
              <Select value={selectedPeriodo} onValueChange={setSelectedPeriodo}>
                <SelectTrigger id="periodo" className="h-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Diario">Diario</SelectItem>
                  <SelectItem value="Semanal">Semanal</SelectItem>
                  <SelectItem value="Mensual">Mensual</SelectItem>
                  <SelectItem value="Trimestral">Trimestral</SelectItem>
                  <SelectItem value="Anual">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Filtro por guardarecurso - Solo visible para Administrador y Coordinador */}
            {!isGuardarecurso && (
              <div className="space-y-2">
                <Label htmlFor="guardarecurso" className="text-xs sm:text-sm">Guardarecurso</Label>
                <Select value={selectedGuardarecurso} onValueChange={setSelectedGuardarecurso}>
                  <SelectTrigger id="guardarecurso" className="h-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-xs sm:text-sm">
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
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas responsive: arriba en móvil/tablet, sidebar en desktop */}
      <div className="lg:hidden">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <Card className="border-0 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 shadow-md">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col items-center justify-center gap-1 sm:gap-1.5">
                <CheckSquare className="h-6 w-6 sm:h-8 sm:w-8 text-blue-700 dark:text-blue-300" />
                <p className="text-xl sm:text-2xl text-blue-800 dark:text-blue-200">{estadisticasGenerales.totalActividades}</p>
                <p className="text-[10px] sm:text-xs text-blue-700/80 dark:text-blue-300/80 text-center leading-tight">Total</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 shadow-md">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col items-center justify-center gap-1 sm:gap-1.5">
                <CheckSquare className="h-6 w-6 sm:h-8 sm:w-8 text-green-700 dark:text-green-300" />
                <p className="text-xl sm:text-2xl text-green-800 dark:text-green-200">{estadisticasGenerales.completadas}</p>
                <p className="text-[10px] sm:text-xs text-green-700/80 dark:text-green-300/80 text-center leading-tight">Completadas</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/40 dark:to-yellow-800/40 shadow-md">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col items-center justify-center gap-1 sm:gap-1.5">
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-700 dark:text-yellow-300" />
                <p className="text-xl sm:text-2xl text-yellow-800 dark:text-yellow-200">{estadisticasGenerales.enProgreso}</p>
                <p className="text-[10px] sm:text-xs text-yellow-700/80 dark:text-yellow-300/80 text-center leading-tight">En Progreso</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 shadow-md">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col items-center justify-center gap-1 sm:gap-1.5">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-purple-700 dark:text-purple-300" />
                <p className="text-xl sm:text-2xl text-purple-800 dark:text-purple-200">{estadisticasGenerales.cumplimientoPromedio.toFixed(0)}%</p>
                <p className="text-[10px] sm:text-xs text-purple-700/80 dark:text-purple-300/80 text-center leading-tight">Cumplimiento</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Grid principal: Contenido a la izquierda, Estadísticas a la derecha (solo desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Columna izquierda: Métricas de Cumplimiento */}
        <div className="lg:col-span-11">
          <Card className="border-0 shadow-lg">
            <CardHeader className="px-4 sm:px-6 py-4 sm:py-5">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Métricas de Cumplimiento
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 sm:px-6 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">Métrica</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden md:table-cell">Tipo</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Guardarecurso</TableHead>
                    <TableHead className="text-xs sm:text-sm">Progreso</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Actual / Meta</TableHead>
                    <TableHead className="text-right text-xs sm:text-sm">Cumplim.</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMetricas.map((metrica) => {
                    const porcentaje = calcularPorcentajeCumplimiento(metrica.actual, metrica.meta);
                    const guardarecurso = guardarecursos.find(g => g.id === metrica.guardarecurso);
                    
                    return (
                      <TableRow key={metrica.id}>
                        <TableCell className="text-xs sm:text-sm">
                          <div>
                            <div className="font-medium line-clamp-1 text-xs sm:text-sm">{metrica.nombre}</div>
                            <div className="text-xs text-muted-foreground line-clamp-1">
                              {metrica.descripcion}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden md:table-cell">
                          <Badge variant="outline" className="text-xs whitespace-nowrap">
                            {metrica.tipo}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                          {guardarecurso ? (
                            <div>
                              <div className="font-medium text-xs sm:text-sm truncate max-w-[150px]">
                                {guardarecurso.nombre} {guardarecurso.apellido}
                              </div>
                              <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                                {guardarecurso.puesto}
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-xs">General</span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          <div className="w-full min-w-[80px] sm:min-w-[100px]">
                            <Progress 
                              value={porcentaje} 
                              className="h-2"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                          <div className="font-medium whitespace-nowrap">
                            {metrica.actual} / {metrica.meta} {metrica.unidad}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className={`text-sm sm:text-lg font-semibold ${getColorPorcentaje(porcentaje)} whitespace-nowrap`}>
                            {porcentaje.toFixed(1)}%
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              
              {filteredMetricas.length === 0 && (
                <div className="text-center py-8 sm:py-12 text-muted-foreground px-4">
                  <Activity className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 opacity-30" />
                  <p className="text-sm sm:text-base">No hay métricas disponibles para los filtros seleccionados</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Columna derecha: Estadísticas (solo desktop) */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="space-y-3 sticky top-4">
            <Card className="border-0 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 shadow-md">
              <CardContent className="p-4">
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <CheckSquare className="h-8 w-8 text-blue-700 dark:text-blue-300" />
                  <p className="text-2xl text-blue-800 dark:text-blue-200">{estadisticasGenerales.totalActividades}</p>
                  <p className="text-xs text-blue-700/80 dark:text-blue-300/80 text-center leading-tight">Total</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 shadow-md">
              <CardContent className="p-4">
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <CheckSquare className="h-8 w-8 text-green-700 dark:text-green-300" />
                  <p className="text-2xl text-green-800 dark:text-green-200">{estadisticasGenerales.completadas}</p>
                  <p className="text-xs text-green-700/80 dark:text-green-300/80 text-center leading-tight">Completadas</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/40 dark:to-yellow-800/40 shadow-md">
              <CardContent className="p-4">
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <Clock className="h-8 w-8 text-yellow-700 dark:text-yellow-300" />
                  <p className="text-2xl text-yellow-800 dark:text-yellow-200">{estadisticasGenerales.enProgreso}</p>
                  <p className="text-xs text-yellow-700/80 dark:text-yellow-300/80 text-center leading-tight">En Progreso</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 shadow-md">
              <CardContent className="p-4">
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <TrendingUp className="h-8 w-8 text-purple-700 dark:text-purple-300" />
                  <p className="text-2xl text-purple-800 dark:text-purple-200">{estadisticasGenerales.cumplimientoPromedio.toFixed(0)}%</p>
                  <p className="text-xs text-purple-700/80 dark:text-purple-300/80 text-center leading-tight">Cumplimiento</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
