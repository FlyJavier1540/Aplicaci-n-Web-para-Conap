import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Lock, Eye, EyeOff, CheckCircle2, User, Shield } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface CambiarContrasenaAdminProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any; // El usuario que está haciendo el cambio (admin o coordinador)
  targetUser: any; // El usuario cuya contraseña se va a cambiar
}

export function CambiarContrasenaAdmin({ isOpen, onClose, currentUser, targetUser }: CambiarContrasenaAdminProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  // Verificar permisos
  const canChangePassword = () => {
    if (!currentUser || !targetUser) return false;
    
    // NUNCA se puede cambiar la contraseña de un Administrador (solo ellos mismos)
    if (targetUser.rol === 'Administrador') return false;
    
    // Administradores pueden cambiar contraseñas de Coordinadores y Guardarecursos
    if (currentUser.rol === 'Administrador') return true;
    
    // Coordinadores solo pueden cambiar contraseñas de guardarecursos
    if (currentUser.rol === 'Coordinador' && targetUser.rol === 'Guardarecurso') return true;
    
    return false;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validación crítica: NUNCA permitir cambiar contraseña de Administradores
    if (targetUser.rol === 'Administrador') {
      setError('No se puede cambiar la contraseña de un Administrador. Solo ellos pueden cambiarla desde su perfil.');
      return;
    }

    // Verificar permisos
    if (!canChangePassword()) {
      setError('No tienes permisos para cambiar esta contraseña');
      return;
    }

    // Validaciones
    if (newPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // Actualizar contraseña
    const usuario = usuarios.find(u => u.id === targetUser.id);
    if (usuario) {
      usuario.password = newPassword;

      toast.success('Contraseña actualizada', {
        description: `Se ha actualizado la contraseña de ${targetUser.nombre} ${targetUser.apellido} exitosamente.`
      });

      // Limpiar formulario y cerrar
      setNewPassword('');
      setConfirmPassword('');
      setError('');
      onClose();
    } else {
      setError('Usuario no encontrado');
    }
  };

  const handleClose = () => {
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    onClose();
  };

  if (!targetUser) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] sm:w-[90vw] sm:max-w-md p-4 sm:p-6">
        <DialogHeader className="pb-3 sm:pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg flex-shrink-0">
              <Lock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-lg sm:text-xl md:text-2xl truncate">Cambiar Contraseña</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm truncate">
                Actualizar contraseña de usuario
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* Información del usuario objetivo */}
          <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-800 dark:text-blue-300">
              <div className="flex flex-col gap-1">
                <span className="font-semibold">
                  {targetUser.nombre} {targetUser.apellido}
                </span>
                <span className="text-sm flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  {targetUser.rol}
                </span>
                <span className="text-sm">{targetUser.email}</span>
              </div>
            </AlertDescription>
          </Alert>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="newPassword" className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              Nueva Contraseña
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Ingrese la nueva contraseña"
                className="h-10 sm:h-11 border-gray-300 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Mínimo 6 caracteres
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              Confirmar Nueva Contraseña
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme la nueva contraseña"
                className="h-10 sm:h-11 border-gray-300 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
            >
              <Lock className="h-4 w-4 mr-2" />
              Cambiar Contraseña
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
