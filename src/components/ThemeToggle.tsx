import { Moon, Sun } from 'lucide-react';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { useTheme } from './ThemeProvider';
import { useEffect, useState } from 'react';

interface ThemeToggleProps {
  variant?: 'default' | 'compact';
}

export function ThemeToggle({ variant = 'default' }: ThemeToggleProps) {
  const { setTheme, theme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Determinar si el tema actual es oscuro
    if (theme === 'dark') {
      setIsDark(true);
    } else if (theme === 'light') {
      setIsDark(false);
    } else {
      // Para 'system', usar media query
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setIsDark(mediaQuery.matches);
    }
  }, [theme]);

  const handleThemeChange = (checked: boolean) => {
    setIsDark(checked);
    setTheme(checked ? 'dark' : 'light');
  };

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    setTheme(newIsDark ? 'dark' : 'light');
  };

  // Variante compacta para el header del dashboard
  if (variant === 'compact') {
    return (
      <>
        {/* Botón compacto para móvil (< 640px) */}
        <Button
          onClick={toggleTheme}
          variant="outline"
          size="sm"
          className="sm:hidden text-white border-white/20 hover:bg-white/20 hover:border-white/40 active:bg-white/30 bg-white/10 backdrop-blur-sm transition-all duration-200 h-9 w-9 p-0 flex items-center justify-center rounded-lg shadow-sm hover:shadow-md active:scale-95 touch-manipulation"
          aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
        >
          {isDark ? (
            <Sun className="h-4.5 w-4.5 text-amber-300 drop-shadow-sm" />
          ) : (
            <Moon className="h-4.5 w-4.5 text-slate-100 drop-shadow-sm" />
          )}
        </Button>

        {/* Botón compacto para tablet (640px - 1024px) - NUEVA OPCIÓN */}
        <Button
          onClick={toggleTheme}
          variant="outline"
          size="sm"
          className="hidden sm:flex lg:hidden text-white border-white/20 hover:bg-white/20 hover:border-white/40 active:bg-white/30 bg-white/10 backdrop-blur-sm transition-all duration-200 h-9 w-9 md:h-10 md:w-10 p-0 items-center justify-center rounded-lg shadow-sm hover:shadow-md active:scale-95 touch-manipulation"
          aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
        >
          {isDark ? (
            <Sun className="h-4 w-4 md:h-4.5 md:w-4.5 text-amber-300 drop-shadow-sm transition-transform duration-200 hover:rotate-180" />
          ) : (
            <Moon className="h-4 w-4 md:h-4.5 md:w-4.5 text-slate-100 drop-shadow-sm transition-transform duration-200 hover:rotate-12" />
          )}
        </Button>

        {/* Switch animado para desktop (>= 1024px) */}
        <div className="hidden lg:flex items-center gap-2.5 px-3 py-2 bg-white/15 dark:bg-gray-800/60 backdrop-blur-md rounded-lg border border-white/30 dark:border-gray-600/40 transition-all duration-300 hover:bg-white/25 dark:hover:bg-gray-700/60 active:scale-95 min-h-[42px] touch-manipulation">
          <Sun className="h-4.5 w-4.5 text-amber-300 flex-shrink-0 transition-all duration-300 drop-shadow-sm" />
          <Switch
            checked={isDark}
            onCheckedChange={handleThemeChange}
            aria-label="Cambiar tema"
            className="touch-manipulation"
          />
          <Moon className="h-4.5 w-4.5 text-slate-100 flex-shrink-0 transition-all duration-300 drop-shadow-sm" />
          <Label className="sr-only">Alternar tema entre claro y oscuro</Label>
        </div>
      </>
    );
  }

  // Variante por defecto para el login
  return (
    <>
      {/* Botón simple para móvil (< 640px) */}
      <Button
        onClick={toggleTheme}
        variant="outline"
        size="sm"
        className="sm:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-lg shadow-lg border border-white/60 dark:border-gray-700/60 transition-all duration-300 hover:shadow-xl active:scale-95 h-12 w-12 p-0 flex items-center justify-center touch-manipulation"
        aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      >
        {isDark ? (
          <Sun className="h-6 w-6 text-amber-500 dark:text-amber-400" />
        ) : (
          <Moon className="h-6 w-6 text-slate-700 dark:text-slate-300" />
        )}
      </Button>

      {/* Switch animado para tablet y desktop (>= 640px) */}
      <div className="hidden sm:flex items-center gap-2 sm:gap-2.5 md:gap-3 px-2.5 py-2 md:px-3 md:py-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-lg md:rounded-xl shadow-lg border border-white/60 dark:border-gray-700/60 transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-100 min-h-[44px]">
        <Sun className="h-4.5 w-4.5 md:h-5 md:w-5 text-amber-500 dark:text-amber-400 flex-shrink-0 transition-transform duration-300 hover:rotate-180" />
        <Switch
          checked={isDark}
          onCheckedChange={handleThemeChange}
          aria-label="Cambiar tema"
        />
        <Moon className="h-4.5 w-4.5 md:h-5 md:w-5 text-slate-700 dark:text-slate-300 flex-shrink-0 transition-transform duration-300 hover:rotate-12" />
        <Label className="sr-only">Alternar tema entre claro y oscuro</Label>
      </div>
    </>
  );
}