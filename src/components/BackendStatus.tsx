/**
 * Componente de verificación del estado del backend
 * Indicador discreto en esquina inferior derecha
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { Button } from './ui/button';

export function BackendStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  const checkBackend = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/catalogos/roles', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      setIsOnline(response.ok);
    } catch (err) {
      setIsOnline(false);
    }
  };

  useEffect(() => {
    // Verificar inmediatamente
    checkBackend();
    
    // Verificar cada 10 segundos
    const interval = setInterval(checkBackend, 10000);
    return () => clearInterval(interval);
  }, []);

  // No mostrar si fue cerrado manualmente
  if (isDismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, x: 0 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <div
          className={`
            flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-lg border backdrop-blur-sm
            ${isOnline 
              ? 'bg-green-50/95 dark:bg-green-950/95 border-green-200 dark:border-green-800' 
              : 'bg-red-50/95 dark:bg-red-950/95 border-red-200 dark:border-red-800'
            }
          `}
        >
          {/* Icono de estado */}
          {isOnline ? (
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
          )}

          {/* Texto de estado */}
          <div className="flex flex-col">
            <span className={`text-xs font-medium ${
              isOnline 
                ? 'text-green-800 dark:text-green-200' 
                : 'text-red-800 dark:text-red-200'
            }`}>
              Backend {isOnline ? 'Disponible' : 'No Disponible'}
            </span>
            
            {!isOnline && (
              <span className="text-[10px] text-red-600 dark:text-red-400">
                Ejecuta: cd backend && npm start
              </span>
            )}
          </div>

          {/* Botón de cerrar */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDismissed(true)}
            className="h-5 w-5 p-0 hover:bg-transparent ml-1"
          >
            <X className={`h-3 w-3 ${
              isOnline 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`} />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
