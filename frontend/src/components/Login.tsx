import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Eye, EyeOff } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { RestablecerContrasena } from './RestablecerContrasena';
import conapLogo from 'figma:asset/fdba91156d85a5c8ad358d0ec261b66438776557.png';
import { motion, AnimatePresence } from 'motion/react';

interface LoginProps {
  onLogin: (usuario: any) => void;
}

const wildlifeImages = [
  'https://images.unsplash.com/photo-1743041440513-69257a7dda41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1682788820676-2d68c93d3346?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1526646855395-20db6c4c04db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/flagged/photo-1567431136661-e62430e95bb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1756904113987-19a643686bfa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
];

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  // Cambiar imagen cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % wildlifeImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simular delay de autenticación
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verificar credenciales
    const usuario = usuarios.find(u => u.email === email);
    
    if (usuario && usuario.password === password) {
      onLogin(usuario);
    } else {
      setError('Credenciales incorrectas. Intente nuevamente.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="login-container min-h-screen w-full relative overflow-hidden flex items-center justify-center px-4 sm:px-4 md:px-6">
      {/* Toggle de tema en la esquina superior derecha - Touch-friendly */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute top-2 right-2 sm:top-4 sm:right-4 z-30"
      >
        <ThemeToggle />
      </motion.div>

      {/* Galería de imágenes de fondo */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0"
          >
            <img
              src={wildlifeImages[currentImageIndex]}
              alt="Vida silvestre de Guatemala"
              className="w-full h-full object-cover"
            />
            {/* Overlay oscuro para mejor contraste - Más oscuro en móvil para mejor legibilidad */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/70 via-emerald-900/60 to-blue-900/70 dark:from-green-950/85 dark:via-emerald-950/75 dark:to-blue-950/85 sm:from-green-900/60 sm:via-emerald-900/50 sm:to-blue-900/60 dark:sm:from-green-950/80 dark:sm:via-emerald-950/70 dark:sm:to-blue-950/80"></div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Logo y título flotante arriba - Visible en todos los tamaños, responsive */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute top-2 left-2 sm:top-6 sm:left-6 md:top-8 md:left-8 z-20 text-white flex items-center gap-1.5 sm:gap-2 md:gap-3"
      >
        <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-md rounded-md sm:rounded-lg md:rounded-xl flex items-center justify-center p-2 sm:p-2 md:p-2.5 ring-1 sm:ring-2 ring-white/30 shadow-lg">
          <img 
            src={conapLogo} 
            alt="CONAP Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <div className="hidden sm:block">
          <h1 className="text-base sm:text-lg md:text-xl font-bold leading-tight">CONAP</h1>
          <p className="text-xs sm:text-sm text-white/90 hidden lg:block leading-tight">Consejo Nacional de Áreas Protegidas</p>
        </div>
      </motion.div>

      {/* Indicadores de imagen - Solo visualización */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2 px-4 py-2.5 rounded-full bg-black/20 backdrop-blur-sm"
        aria-label={`Imagen ${currentImageIndex + 1} de ${wildlifeImages.length}`}
      >
        {wildlifeImages.map((_, index) => (
          <div
            key={index}
            className={`rounded-full transition-all duration-500 ${
              index === currentImageIndex 
                ? 'w-8 sm:w-10 md:w-12 h-1 sm:h-1 md:h-1.5 bg-white shadow-lg' 
                : 'w-4 sm:w-5 md:w-6 h-1 sm:h-1 md:h-1.5 bg-white/30'
            }`}
            aria-hidden="true"
          />
        ))}
      </motion.div>

      {/* Formulario de login centrado - Responsive */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-[90%] sm:max-w-md md:max-w-lg relative z-20 mx-auto"
      >
          <Card className="w-full shadow-2xl border-0 backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 rounded-xl sm:rounded-2xl">
          <CardHeader className="text-center space-y-3 sm:space-y-4 pb-4 sm:pb-6 px-4 sm:px-6 pt-6 sm:pt-8">
            {/* Logo CONAP - Visible en todas las pantallas */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              className="mx-auto w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 rounded-full flex items-center justify-center p-2.5 sm:p-3 md:p-4 ring-2 ring-green-200 dark:ring-green-800 shadow-lg"
            >
              <img
                src={conapLogo} 
                alt="CONAP Logo" 
                className="w-full h-full object-contain"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <CardTitle className="text-xl sm:text-2xl md:text-3xl bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                Iniciar Sesión
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Sistema de Guardarecursos
              </CardDescription>
            </motion.div>
          </CardHeader>
          
          <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-6">
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              onSubmit={handleSubmit} 
              className="space-y-3 sm:space-y-4"
            >
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="email" className="text-sm sm:text-base">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@conap.gob.gt"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-10 sm:h-11 text-sm sm:text-base"
                />
              </div>
              
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="password" className="text-sm sm:text-base">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Ingrese su contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-10 sm:h-11 pr-10 text-sm sm:text-base"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-2 sm:px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    ) : (
                      <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="py-2.5 sm:py-3">
                  <AlertDescription className="text-xs sm:text-sm">{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full h-10 sm:h-11 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.span
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Iniciando sesión...
                  </motion.span>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </motion.form>

            {/* Botón para restablecer contraseña */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center"
            >
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsResetDialogOpen(true)}
                className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-950/30 text-xs sm:text-sm transition-all duration-200"
              >
                ¿Olvidaste tu contraseña?
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Diálogo para restablecer contraseña */}
      <RestablecerContrasena 
        isOpen={isResetDialogOpen}
        onClose={() => setIsResetDialogOpen(false)}
      />
    </div>
  );
}