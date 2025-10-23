import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Plus, Download, Eye, Calendar as CalendarIcon, FileText, Users, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ReportePeriodico {
  id: string;
  titulo: string;
  fechaInicio: string;
  fechaFin: string;
  fechaGeneracion: string;
  generadoPor: string;
  parametros: {
    areaProtegida?: string;
    guardarecurso?: string;
    tipoActividad?: string;
  };
}

interface ReportesPeriodicosProps {
  userPermissions: {
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
  };
}

const tiposActividad = ['Patrullaje', 'Mantenimiento', 'Educación Ambiental', 'Investigación', 'Control y Vigilancia'];

export function ReportesPeriodicos({ userPermissions }: ReportesPeriodicosProps) {
  const [reportesList, setReportesList] = useState<ReportePeriodico[]>([
    {
      id: '1',
      titulo: 'Reporte Mensual de Actividades - Septiembre 2024',
      fechaInicio: '2024-09-01',
      fechaFin: '2024-09-30',
      fechaGeneracion: '2024-10-01T08:00:00Z',
      generadoPor: '1',
      parametros: {}
    },
    {
      id: '2',
      titulo: 'Reporte de Desempeño por Guardarecurso - Q3 2024',
      fechaInicio: '2024-07-01',
      fechaFin: '2024-09-30',
      fechaGeneracion: '2024-10-01T09:30:00Z',
      generadoPor: '1',
      parametros: {}
    },
    {
      id: '3',
      titulo: 'Reporte Semanal de Áreas Protegidas',
      fechaInicio: '2024-09-23',
      fechaFin: '2024-09-30',
      fechaGeneracion: '2024-10-01T07:00:00Z',
      generadoPor: '2',
      parametros: { areaProtegida: 'tikal' }
    }
  ]);

  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState<Date>();
  const [selectedEndDate, setSelectedEndDate] = useState<Date>();
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedReporte, setSelectedReporte] = useState<ReportePeriodico | null>(null);

  const [generateForm, setGenerateForm] = useState({
    titulo: '',
    areaProtegida: 'all',
    guardarecurso: 'all',
    tipoActividad: 'all'
  });

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();

    const nuevoReporte: ReportePeriodico = {
      id: Date.now().toString(),
      titulo: generateForm.titulo,
      fechaInicio: selectedStartDate?.toISOString().split('T')[0] || '',
      fechaFin: selectedEndDate?.toISOString().split('T')[0] || '',
      fechaGeneracion: new Date().toISOString(),
      generadoPor: '1',
      parametros: {
        areaProtegida: generateForm.areaProtegida !== 'all' ? generateForm.areaProtegida : undefined,
        guardarecurso: generateForm.guardarecurso !== 'all' ? generateForm.guardarecurso : undefined,
        tipoActividad: generateForm.tipoActividad !== 'all' ? generateForm.tipoActividad : undefined
      }
    };

    setReportesList([nuevoReporte, ...reportesList]);
    setIsGenerateDialogOpen(false);
    resetGenerateForm();
  };

  const resetGenerateForm = () => {
    setGenerateForm({
      titulo: '',
      areaProtegida: 'all',
      guardarecurso: 'all',
      tipoActividad: 'all'
    });
    setSelectedStartDate(undefined);
    setSelectedEndDate(undefined);
  };

  const handleViewReport = (reporte: ReportePeriodico) => {
    setSelectedReporte(reporte);
    setIsViewDialogOpen(true);
  };

  const handleDownloadReport = (reporte: ReportePeriodico) => {
    alert(`Descargando reporte: ${reporte.titulo}`);
  };

  const getAreaNombre = (areaId?: string) => {
    if (!areaId) return 'Todas las áreas';
    const area = areasProtegidas.find(a => a.id === areaId);
    return area?.nombre || 'N/A';
  };

  const getGuardarecursoNombre = (guardarecursoId?: string) => {
    if (!guardarecursoId) return 'Todos los guardarecursos';
    const gr = guardarecursos.find(g => g.id === guardarecursoId);
    return gr ? `${gr.nombre} ${gr.apellido}` : 'N/A';
  };

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6">
      {/* Header con botón */}
      <Card className="border-0 bg-gradient-to-br from-white via-orange-50/30 to-amber-50/30 dark:from-gray-900 dark:via-orange-950/20 dark:to-amber-950/20 shadow-lg">
        <CardHeader className="p-3 sm:p-4 md:pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg flex-shrink-0">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-base sm:text-lg md:text-xl lg:text-2xl truncate">
                  Reportes Generados
                </CardTitle>
                <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 dark:text-gray-400 truncate">
                  Gestión de reportes periódicos
                </p>
              </div>
            </div>
            
            {userPermissions.canCreate && (
              <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={resetGenerateForm}
                    className="w-full sm:w-auto h-9 sm:h-10 bg-gradient-to-r from-orange-600 to-amber-700 hover:from-orange-700 hover:to-amber-800 shadow-md text-xs sm:text-sm"
                  >
                    <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                    <span className="hidden xs:inline">Generar Reporte</span>
                    <span className="xs:hidden">Nuevo</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] sm:w-[90vw] max-w-3xl max-h-[90vh] overflow-y-auto p-3 sm:p-4 md:p-6">
                  <DialogHeader className="pb-2 sm:pb-3 md:pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg flex-shrink-0">
                        <FileText className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <DialogTitle className="text-sm sm:text-base md:text-xl lg:text-2xl truncate">
                          Generar Nuevo Reporte
                        </DialogTitle>
                        <DialogDescription className="text-[10px] sm:text-xs md:text-sm truncate">
                          Configure los parámetros para generar un reporte
                        </DialogDescription>
                      </div>
                    </div>
                  </DialogHeader>
                  
                  <form onSubmit={handleGenerateReport} className="space-y-3 sm:space-y-4 md:space-y-6 pt-2 sm:pt-3 md:pt-4">
                    {/* Título del Reporte */}
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="titulo" className="text-xs sm:text-sm">
                        Título del Reporte *
                      </Label>
                      <Input
                        id="titulo"
                        value={generateForm.titulo}
                        onChange={(e) => setGenerateForm({...generateForm, titulo: e.target.value})}
                        placeholder="Ej: Reporte Mensual de Actividades..."
                        className="h-9 sm:h-10 md:h-11 text-xs sm:text-sm"
                        required
                      />
                    </div>
                    
                    {/* Fechas */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                      <div className="space-y-1.5 sm:space-y-2">
                        <Label className="text-xs sm:text-sm">Fecha Inicio *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left h-9 sm:h-10 md:h-11 text-xs sm:text-sm"
                            >
                              <CalendarIcon className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                              <span className="truncate">
                                {selectedStartDate ? format(selectedStartDate, "dd/MM/yyyy", { locale: es }) : "Seleccionar"}
                              </span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={selectedStartDate}
                              onSelect={setSelectedStartDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div className="space-y-1.5 sm:space-y-2">
                        <Label className="text-xs sm:text-sm">Fecha Fin *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left h-9 sm:h-10 md:h-11 text-xs sm:text-sm"
                            >
                              <CalendarIcon className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                              <span className="truncate">
                                {selectedEndDate ? format(selectedEndDate, "dd/MM/yyyy", { locale: es }) : "Seleccionar"}
                              </span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={selectedEndDate}
                              onSelect={setSelectedEndDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    
                    {/* Filtros opcionales */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                      <div className="space-y-1.5 sm:space-y-2">
                        <Label htmlFor="area" className="text-xs sm:text-sm">
                          Área Protegida (Opcional)
                        </Label>
                        <Select value={generateForm.areaProtegida} onValueChange={(value) => setGenerateForm({...generateForm, areaProtegida: value})}>
                          <SelectTrigger className="h-9 sm:h-10 md:h-11 text-xs sm:text-sm">
                            <SelectValue placeholder="Todas las áreas" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todas las áreas</SelectItem>
                            {areasProtegidas.map(area => (
                              <SelectItem key={area.id} value={area.id}>
                                {area.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-1.5 sm:space-y-2">
                        <Label htmlFor="guardarecurso" className="text-xs sm:text-sm">
                          Guardarecurso (Opcional)
                        </Label>
                        <Select value={generateForm.guardarecurso} onValueChange={(value) => setGenerateForm({...generateForm, guardarecurso: value})}>
                          <SelectTrigger className="h-9 sm:h-10 md:h-11 text-xs sm:text-sm">
                            <SelectValue placeholder="Todos" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos los guardarecursos</SelectItem>
                            {guardarecursos.map(g => (
                              <SelectItem key={g.id} value={g.id}>
                                {g.nombre} {g.apellido}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="tipoActividad" className="text-xs sm:text-sm">
                        Tipo de Actividad (Opcional)
                      </Label>
                      <Select value={generateForm.tipoActividad} onValueChange={(value) => setGenerateForm({...generateForm, tipoActividad: value})}>
                        <SelectTrigger className="h-9 sm:h-10 md:h-11 text-xs sm:text-sm">
                          <SelectValue placeholder="Todos los tipos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los tipos</SelectItem>
                          {tiposActividad.map(tipo => (
                            <SelectItem key={tipo} value={tipo}>
                              {tipo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Footer con botones */}
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-2.5 md:gap-3 pt-3 sm:pt-4 md:pt-6 border-t border-gray-200 dark:border-gray-700">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsGenerateDialogOpen(false)}
                        className="w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm"
                      >
                        Cancelar
                      </Button>
                      <Button 
                        type="submit"
                        className="w-full sm:w-auto h-9 sm:h-10 bg-gradient-to-r from-orange-600 to-amber-700 hover:from-orange-700 hover:to-amber-800 text-xs sm:text-sm"
                      >
                        <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                        Generar
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Tabla de reportes */}
      <Card className="border border-gray-200 dark:border-gray-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                  <TableHead className="font-semibold text-xs sm:text-sm px-2 sm:px-4">
                    Nombre del Reporte
                  </TableHead>
                  <TableHead className="font-semibold text-center text-xs sm:text-sm px-2 sm:px-4 hidden md:table-cell">
                    Fecha Generación
                  </TableHead>
                  <TableHead className="font-semibold text-center text-xs sm:text-sm px-2 sm:px-4">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportesList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 sm:py-12">
                      <div className="flex flex-col items-center gap-2 sm:gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          No hay reportes generados
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  reportesList.map((reporte) => (
                    <TableRow key={reporte.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                      <TableCell className="px-2 sm:px-4 py-2 sm:py-3">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-start gap-1.5 sm:gap-2">
                            <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                            <span className="font-medium text-xs sm:text-sm leading-tight line-clamp-2">
                              {reporte.titulo}
                            </span>
                          </div>
                          {/* Mostrar fecha en móvil */}
                          <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 md:hidden ml-5">
                            {format(new Date(reporte.fechaGeneracion), "dd/MM/yyyy HH:mm", { locale: es })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3 hidden md:table-cell whitespace-nowrap">
                        {format(new Date(reporte.fechaGeneracion), "dd/MM/yyyy HH:mm", { locale: es })}
                      </TableCell>
                      <TableCell className="px-2 sm:px-4 py-2 sm:py-3">
                        <div className="flex items-center justify-center gap-1 sm:gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewReport(reporte)}
                            className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                            title="Ver detalles"
                          >
                            <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadReport(reporte)}
                            className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                            title="Descargar"
                          >
                            <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog para ver detalles del reporte */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="w-[95vw] sm:w-[90vw] max-w-2xl max-h-[90vh] overflow-y-auto p-3 sm:p-4 md:p-6">
          <DialogHeader className="pb-2 sm:pb-3 md:pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg flex-shrink-0">
                <Eye className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-sm sm:text-base md:text-xl lg:text-2xl truncate">
                  Detalles del Reporte
                </DialogTitle>
                <DialogDescription className="text-[10px] sm:text-xs md:text-sm truncate">
                  Información completa del reporte generado
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          {selectedReporte && (
            <div className="space-y-3 sm:space-y-4 md:space-y-6 pt-2 sm:pt-3 md:pt-4">
              {/* Título */}
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                  <Label className="text-xs sm:text-sm font-semibold">Título</Label>
                </div>
                <p className="text-xs sm:text-sm md:text-base pl-5 sm:pl-6 leading-snug">{selectedReporte.titulo}</p>
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <CalendarIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                    <Label className="text-xs sm:text-sm font-semibold">Fecha Inicio</Label>
                  </div>
                  <p className="text-xs sm:text-sm md:text-base pl-5 sm:pl-6">
                    {format(new Date(selectedReporte.fechaInicio), "PPP", { locale: es })}
                  </p>
                </div>
                
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <CalendarIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                    <Label className="text-xs sm:text-sm font-semibold">Fecha Fin</Label>
                  </div>
                  <p className="text-xs sm:text-sm md:text-base pl-5 sm:pl-6">
                    {format(new Date(selectedReporte.fechaFin), "PPP", { locale: es })}
                  </p>
                </div>
              </div>

              {/* Fecha de Generación */}
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <CalendarIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                  <Label className="text-xs sm:text-sm font-semibold">Fecha de Generación</Label>
                </div>
                <p className="text-xs sm:text-sm md:text-base pl-5 sm:pl-6">
                  {format(new Date(selectedReporte.fechaGeneracion), "PPP 'a las' HH:mm", { locale: es })}
                </p>
              </div>

              {/* Parámetros */}
              <div className="space-y-2 sm:space-y-3">
                <Label className="text-xs sm:text-sm font-semibold">Parámetros del Reporte</Label>
                <div className="grid grid-cols-1 gap-2 sm:gap-3 pl-0 sm:pl-2">
                  <div className="flex items-start gap-1.5 sm:gap-2 text-xs sm:text-sm">
                    <Tag className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <span className="font-medium">Área Protegida: </span>
                      <span className="text-gray-600 dark:text-gray-400 break-words">
                        {getAreaNombre(selectedReporte.parametros.areaProtegida)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-1.5 sm:gap-2 text-xs sm:text-sm">
                    <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <span className="font-medium">Guardarecurso: </span>
                      <span className="text-gray-600 dark:text-gray-400 break-words">
                        {getGuardarecursoNombre(selectedReporte.parametros.guardarecurso)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-1.5 sm:gap-2 text-xs sm:text-sm">
                    <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <span className="font-medium">Tipo de Actividad: </span>
                      <span className="text-gray-600 dark:text-gray-400 break-words">
                        {selectedReporte.parametros.tipoActividad || 'Todas las actividades'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-2.5 md:gap-3 pt-3 sm:pt-4 md:pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button 
                  variant="outline" 
                  onClick={() => setIsViewDialogOpen(false)}
                  className="w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm"
                >
                  Cerrar
                </Button>
                <Button 
                  onClick={() => handleDownloadReport(selectedReporte)}
                  className="w-full sm:w-auto h-9 sm:h-10 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-xs sm:text-sm"
                >
                  <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                  Descargar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
