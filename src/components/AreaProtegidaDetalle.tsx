import { AreaProtegida } from '../types';
import { Card, CardContent } from './ui/card';
import { MapPin, Leaf, TreePine } from 'lucide-react';
import { motion } from 'motion/react';
import { MapaAreasProtegidas } from './MapaAreasProtegidas';
import { useIsMobile } from './ui/use-mobile';

interface AreaProtegidaDetalleProps {
  area: AreaProtegida | null;
  isSimplified?: boolean;
  allAreas?: AreaProtegida[];
}

export function AreaProtegidaDetalle({ area, isSimplified = false, allAreas = [] }: AreaProtegidaDetalleProps) {
  // Detectar si estamos en móvil
  const isMobile = useIsMobile();
  
  if (!area) {
    return null;
  }
  
  // En el detalle solo mostramos el área seleccionada
  const areasToDisplay = [area];

  return (
    <div className="space-y-2 sm:space-y-2.5">
      {/* Título - Ancho completo */}
      <motion.div 
        className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-md sm:rounded-lg p-2 sm:p-2.5 shadow-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-base sm:text-lg font-bold text-white">
          {area.nombre}
        </h2>
      </motion.div>

      {/* Descripción - Ancho completo */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border border-gray-200 dark:border-gray-700">
          <CardContent className="p-2 sm:p-2.5 bg-white dark:bg-gray-900">
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {area.descripcion}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Grid 2 columnas: Mapa e Información (en móvil solo información) */}
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-2 sm:gap-2.5`}>
        {/* Columna Izquierda: Mini Mapa - OCULTO EN MÓVIL */}
        {!isMobile && (
          <motion.div 
            className="flex items-center justify-center w-full aspect-square"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="w-full h-full">
              <MapaAreasProtegidas 
                areas={areasToDisplay}
                onAreaSelect={() => {}} // No hacer nada al seleccionar, ya está seleccionada
                selectedAreaId={area.id}
                className="h-full"
                showLegend={false}
                centered={true}
              />
            </div>
          </motion.div>
        )}

        {/* Columna Derecha: Información - ANCHO COMPLETO EN MÓVIL */}
        <motion.div 
          className="space-y-1.5 sm:space-y-2 flex flex-col justify-center"
          initial={{ opacity: 0, x: isMobile ? 0 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: isMobile ? 0.3 : 0.4 }}
        >
          {/* Ubicación */}
        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-1.5 sm:p-2">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <div className="p-0.5 sm:p-1 rounded-md bg-white/20 backdrop-blur-sm">
                <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white" />
              </div>
              <span className="text-[10px] sm:text-xs font-medium text-white">Ubicación</span>
            </div>
          </div>
          <CardContent className="p-1.5 sm:p-2 bg-white dark:bg-gray-900">
            <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100">
              {area.departamento}
            </p>
          </CardContent>
        </Card>

        {/* Extensión */}
        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-1.5 sm:p-2">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <div className="p-0.5 sm:p-1 rounded-md bg-white/20 backdrop-blur-sm">
                <Leaf className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white" />
              </div>
              <span className="text-[10px] sm:text-xs font-medium text-white">Extensión</span>
            </div>
          </div>
          <CardContent className="p-1.5 sm:p-2 bg-white dark:bg-gray-900">
            <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100">
              {area.extension.toLocaleString()} hectáreas
            </p>
          </CardContent>
        </Card>

        {/* Ecosistema Principal */}
        {area.ecosistemas && area.ecosistemas.length > 0 && (
          <Card className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 p-1.5 sm:p-2">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <div className="p-0.5 sm:p-1 rounded-md bg-white/20 backdrop-blur-sm">
                  <TreePine className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white" />
                </div>
                <span className="text-[10px] sm:text-xs font-medium text-white">Ecosistema Principal</span>
              </div>
            </div>
            <CardContent className="p-1.5 sm:p-2 bg-white dark:bg-gray-900">
              <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100">
                {area.ecosistemas[0]}
              </p>
            </CardContent>
          </Card>
        )}
        </motion.div>
      </div>
    </div>
  );
}
