import { useState } from 'react';
import { AreaProtegida } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MapPin } from 'lucide-react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

// Definición de las propiedades del componente
interface MapaAreasProtegidasProps {
  areas: AreaProtegida[];
  onAreaSelect: (area: AreaProtegida) => void;
  selectedAreaId?: string | null;
  title?: string;
  className?: string;
}
//Ubicación central del mapa (Guatemala)
const center = { lat: 15.7835, lng: -90.2308 };

//Tamaño del contenedor del mapa
const mapContainerStyle = { width: '100%', height: '100%' };

// Componente del mapa de áreas protegidas
export function MapaAreasProtegidas({
  areas,
  onAreaSelect,
  selectedAreaId,
  title = 'Mapa de Áreas Protegidas',
  className = ''
}: MapaAreasProtegidasProps) {
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyC1XVfrE8CmVg3nhd-6Sps087JmARuSNWc',
  });

  return (
    <Card className={`h-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col overflow-hidden ${className}`}>
      <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-6">
        <CardTitle className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base md:text-lg">
          <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
          <span className="truncate">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 relative p-2 sm:p-3 md:p-4 min-h-[400px]">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={8}
            options={{ mapTypeControl: false, streetViewControl: false }}
          >
            {areas.map((area) => (
              <Marker
                key={area.id}
                position={{ lat: area.coordenadas.lat, lng: area.coordenadas.lng }}
                onClick={() => onAreaSelect(area)}
                icon={{
                  path: window.google.maps.SymbolPath.CIRCLE,
                  fillColor: selectedAreaId === area.id ? '#fa9715ff' : '#0a9605ff',
                  fillOpacity: 1,
                  strokeColor: '#fff700ff',
                  strokeWeight: 2,
                  scale: 7,
                }}
                onMouseOver={() => setHoveredArea(area.id)}
                onMouseOut={() => setHoveredArea(null)}
              />
            ))}
          </GoogleMap>
        ) : (
          <div className="text-sm text-gray-500">Cargando mapa...</div>
        )}
      </CardContent>
    </Card>
  );
}