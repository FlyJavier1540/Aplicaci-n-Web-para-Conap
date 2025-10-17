import { useState, lazy, Suspense, memo, useMemo, useEffect } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider, SidebarTrigger, useSidebar } from './components/ui/sidebar';
import { Button } from './components/ui/button';
import { ThemeProvider } from './components/ThemeProvider';
import { ThemeToggle } from './components/ThemeToggle';
import { Toaster } from './components/ui/sonner';
import { CambiarContrasena } from './components/CambiarContrasena';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './components/ui/dropdown-menu';
import conapLogo from 'figma:asset/fdba91156d85a5c8ad358d0ec261b66438776557.png';
import { filterNavigationByRole, getModulePermissions, type UserRole } from './utils/permissions';
import { 
  Users, 
  Calendar,
  Activity,
  FileText,
  Camera,
  Route,
  Package,
  CheckSquare,
  AlertTriangle,
  BarChart3,
  UserCheck,
  LogOut,
  Menu,
  Shield,
  Briefcase,
  Eye,
  Settings2,
  ChevronRight,
  LayoutDashboard,
  Key,
  Trees
} from 'lucide-react';

// Lazy load de módulos para mejor rendimiento
const RegistroGuardarecursos = lazy(() => import('./components/RegistroGuardarecursos').then(m => ({ default: m.RegistroGuardarecursos })));
const AsignacionZonas = lazy(() => import('./components/AsignacionZonas').then(m => ({ default: m.AsignacionZonas })));
const ControlEquipos = lazy(() => import('./components/ControlEquipos').then(m => ({ default: m.ControlEquipos })));
const PlanificacionActividades = lazy(() => import('./components/PlanificacionActividades').then(m => ({ default: m.PlanificacionActividades })));
const RegistroDiario = lazy(() => import('./components/RegistroDiario').then(m => ({ default: m.RegistroDiario })));
const EvidenciasFotograficas = lazy(() => import('./components/EvidenciasFotograficas').then(m => ({ default: m.EvidenciasFotograficas })));
const GeolocalizacionRutas = lazy(() => import('./components/GeolocalizacionRutas').then(m => ({ default: m.GeolocalizacionRutas })));
const ReporteHallazgos = lazy(() => import('./components/ReporteHallazgos').then(m => ({ default: m.ReporteHallazgos })));
const SeguimientoCumplimiento = lazy(() => import('./components/SeguimientoCumplimiento').then(m => ({ default: m.SeguimientoCumplimiento })));
const RegistroIncidentes = lazy(() => import('./components/RegistroIncidentes').then(m => ({ default: m.RegistroIncidentes })));
const ReportesPeriodicos = lazy(() => import('./components/ReportesPeriodicos').then(m => ({ default: m.ReportesPeriodicos })));
const GestionUsuarios = lazy(() => import('./components/GestionUsuarios').then(m => ({ default: m.GestionUsuarios })));

/**
 * =============================================
 * ESTRUCTURA DE NAVEGACIÓN DEL SISTEMA
 * =============================================
 * 
 * Aquí se definen las 4 categorías principales del menú y sus módulos.
 * 
 * ⚠️ IMPORTANTE: Los IDs de los items deben coincidir con los módulos
 * definidos en /utils/permissions.ts
 * 
 * 📝 PARA AGREGAR UN NUEVO MÓDULO:
 * 1. Agrega el módulo aquí en la categoría correspondiente
 * 2. Crea el componente en /components
 * 3. Agrega el import lazy al inicio de este archivo
 * 4. Agrega el case en renderContent()
 * 5. Agrega los permisos en /utils/permissions.ts
 */
const navigationCategories = [
  // CATEGORÍA 1: Gestión de Personal
  {
    id: 'personal',
    title: 'Gestión de Personal',
    icon: Shield,
    color: 'emerald',
    gradient: 'from-emerald-500 to-green-600',
    bgGradient: 'from-emerald-50/50 to-green-50/50',
    darkBgGradient: 'from-emerald-950/50 to-green-950/50',
    items: [
      { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
      { id: 'registro-guarda', name: 'Registro de Guarda Recursos', icon: Users },
      { id: 'asignacion-zonas', name: 'Áreas Protegidas', icon: Trees },
      { id: 'control-equipos', name: 'Control de Equipos', icon: Package },
    ]
  },
  {
    id: 'operaciones',
    title: 'Operaciones de Campo',
    icon: Briefcase,
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-600',
    bgGradient: 'from-blue-50/50 to-cyan-50/50',
    darkBgGradient: 'from-blue-950/50 to-cyan-950/50',
    items: [
      { id: 'planificacion', name: 'Planificación de Actividades', icon: Calendar },
      { id: 'registro-diario', name: 'Registro Diario de Campo', icon: Activity },
      { id: 'evidencias', name: 'Registro Fotográfico', icon: Camera },
      { id: 'geolocalizacion', name: 'Geolocalización de Rutas', icon: Route },
    ]
  },
  {
    id: 'control',
    title: 'Control y Seguimiento',
    icon: Eye,
    color: 'orange',
    gradient: 'from-orange-500 to-amber-600',
    bgGradient: 'from-orange-50/50 to-amber-50/50',
    darkBgGradient: 'from-orange-950/50 to-amber-950/50',
    items: [
      { id: 'hallazgos', name: 'Reporte de Hallazgos', icon: FileText },
      { id: 'seguimiento', name: 'Seguimiento de Cumplimiento', icon: CheckSquare },
      { id: 'incidentes', name: 'Incidentes con Visitantes', icon: AlertTriangle },
      { id: 'reportes', name: 'Reportes Periódicos', icon: BarChart3 },
    ]
  },
  {
    id: 'admin',
    title: 'Administración',
    icon: Settings2,
    color: 'purple',
    gradient: 'from-purple-500 to-violet-600',
    bgGradient: 'from-purple-50/50 to-violet-50/50',
    darkBgGradient: 'from-purple-950/50 to-violet-950/50',
    items: [
      { id: 'usuarios', name: 'Gestión de Usuarios y Roles', icon: UserCheck }
    ]
  }
];

// Componentes memoizados para optimización de rendimiento
const LoadingFallback = memo(() => (
  <div className="flex items-center justify-center h-96">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-muted-foreground">Cargando módulo...</p>
    </div>
  </div>
));
LoadingFallback.displayName = 'LoadingFallback';

const AccessDenied = memo(() => (
  <div className="flex items-center justify-center h-96">
    <div className="text-center p-8 rounded-xl bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm border border-red-200 dark:border-red-800 shadow-lg">
      <Shield className="h-16 w-16 mx-auto mb-4 text-red-500" />
      <h3 className="text-lg font-semibold mb-2 text-red-800 dark:text-red-300">Acceso Denegado</h3>
      <p className="text-red-600 dark:text-red-400 mb-2">No tienes permisos para acceder a este módulo</p>
      <p className="text-sm text-red-500 dark:text-red-500">
        Contacta a un administrador si necesitas acceso
      </p>
    </div>
  </div>
));
AccessDenied.displayName = 'AccessDenied';

function AppContent({ currentUser, setCurrentUser }: { currentUser: any, setCurrentUser: (user: any) => void }) {
  // ===== VISTA INICIAL POR ROL =====
  // 
  // ⚠️ CONFIGURACIÓN DE VISTAS INICIALES:
  // - Administrador y Coordinador → Dashboard
  // - Guardarecurso → Registro Diario de Campo
  // 
  // Para cambiar la vista inicial de un rol, modifica estas líneas:
  const initialSection = currentUser.rol === 'Guardarecurso' ? 'registro-diario' : 'dashboard';
  const initialCategory = currentUser.rol === 'Guardarecurso' ? 'operaciones' : 'personal';
  
  // Estados de la aplicación
  const [activeSection, setActiveSection] = useState(initialSection);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(initialCategory);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const { setOpen, setOpenMobile, isMobile } = useSidebar();
  
  // Actualizar vista inicial cuando cambia el usuario (ej: al cambiar de cuenta)
  useEffect(() => {
    const newInitialSection = currentUser.rol === 'Guardarecurso' ? 'registro-diario' : 'dashboard';
    const newInitialCategory = currentUser.rol === 'Guardarecurso' ? 'operaciones' : 'personal';
    setActiveSection(newInitialSection);
    setExpandedCategory(newInitialCategory);
  }, [currentUser.rol]);
  
  // Obtener rol del usuario actual
  const userRole = currentUser.rol as UserRole;
  
  // Filtrar categorías de navegación según permisos
  const filteredCategories = filterNavigationByRole(navigationCategories, userRole);

  const renderContent = () => {
    // Obtener permisos para el módulo actual
    const permissions = getModulePermissions(userRole, activeSection);
    
    // Verificar si tiene acceso al módulo
    if (!permissions.canView) {
      return <AccessDenied />;
    }
    
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveSection} currentUser={currentUser} />;
      
      // Módulos de Gestión de Personal
      case 'registro-guarda':
        return <Suspense fallback={<LoadingFallback />}><RegistroGuardarecursos userPermissions={permissions} currentUser={currentUser} /></Suspense>;
      case 'asignacion-zonas':
        return <Suspense fallback={<LoadingFallback />}><AsignacionZonas userPermissions={permissions} /></Suspense>;
      case 'control-equipos':
        return <Suspense fallback={<LoadingFallback />}><ControlEquipos userPermissions={permissions} currentUser={currentUser} /></Suspense>;
      
      // Módulos de Operaciones de Campo
      case 'planificacion':
        return <Suspense fallback={<LoadingFallback />}><PlanificacionActividades userPermissions={permissions} /></Suspense>;
      case 'registro-diario':
        return <Suspense fallback={<LoadingFallback />}><RegistroDiario userPermissions={permissions} currentUser={currentUser} /></Suspense>;
      case 'evidencias':
        return <Suspense fallback={<LoadingFallback />}><EvidenciasFotograficas userPermissions={permissions} currentUser={currentUser} /></Suspense>;
      case 'geolocalizacion':
        return <Suspense fallback={<LoadingFallback />}><GeolocalizacionRutas userPermissions={permissions} currentUser={currentUser} /></Suspense>;
      
      // Módulos de Control y Seguimiento
      case 'hallazgos':
        return <Suspense fallback={<LoadingFallback />}><ReporteHallazgos userPermissions={permissions} currentUser={currentUser} /></Suspense>;
      case 'seguimiento':
        return <Suspense fallback={<LoadingFallback />}><SeguimientoCumplimiento userPermissions={permissions} currentUser={currentUser} /></Suspense>;
      case 'incidentes':
        return <Suspense fallback={<LoadingFallback />}><RegistroIncidentes userPermissions={permissions} currentUser={currentUser} /></Suspense>;
      case 'reportes':
        return <Suspense fallback={<LoadingFallback />}><ReportesPeriodicos userPermissions={permissions} /></Suspense>;
      
      // Módulos de Administración
      case 'usuarios':
        return <Suspense fallback={<LoadingFallback />}><GestionUsuarios userPermissions={permissions} currentUser={currentUser} /></Suspense>;
      
      default:
        return <Dashboard onNavigate={setActiveSection} currentUser={currentUser} />;
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveSection('dashboard');
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const handleItemClick = (itemId: string) => {
    setActiveSection(itemId);
    // Si es el dashboard, expandir la categoría personal automáticamente
    if (itemId === 'dashboard') {
      setExpandedCategory('personal');
    }
    // Cerrar la sidebar después de seleccionar un módulo (tanto móvil como desktop)
    if (isMobile) {
      setOpenMobile(false);
    } else {
      setOpen(false);
    }
  };

  // Función para obtener información del módulo actual
  const getCurrentModuleInfo = () => {
    for (const category of navigationCategories) {
      const item = category.items.find(i => i.id === activeSection);
      if (item) {
        return {
          name: item.name,
          icon: item.icon,
          category: category.title,
          color: category.color
        };
      }
    }
    return {
      name: 'Dashboard',
      icon: LayoutDashboard,
      category: 'Inicio',
      color: 'green'
    };
  };

  const currentModule = getCurrentModuleInfo();

  const renderNavigationCategories = () => {
    return (
      <div className="space-y-1">
        {filteredCategories.map((category) => {
          const isExpanded = expandedCategory === category.id;
          const hasActiveItem = category.items.some(item => item.id === activeSection);
          
          return (
            <div key={category.id} className="space-y-1">
              {/* Header de la categoría */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg transition-all duration-200 group hover:bg-gray-50 dark:hover:bg-gray-800/50 relative"
              >
                {/* Barra indicadora sutil para categoría activa */}
                {hasActiveItem && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 sm:h-6 bg-green-500 rounded-full"></div>
                )}
                
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors duration-200 flex-shrink-0">
                  <category.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-400" />
                </div>
                
                <div className="flex-1 text-left min-w-0">
                  <div className="font-medium text-xs sm:text-sm text-gray-700 dark:text-gray-300 truncate">
                    {category.title}
                  </div>
                  <div className="text-xs text-muted-foreground hidden sm:block">
                    {category.items.length} módulos
                  </div>
                </div>
                
                <div className={`transition-transform duration-200 flex-shrink-0 ${
                  isExpanded ? 'rotate-90' : ''
                }`}>
                  <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                </div>
              </button>

              {/* Items de la categoría (desplegable) */}
              {isExpanded && (
                <div className="ml-4 sm:ml-6 space-y-0.5 animate-fadeIn">
                  {category.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      className="w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-200 group hover:bg-gray-50 dark:hover:bg-gray-800/50 relative"
                    >
                      {/* Línea indicadora minimalista para item activo */}
                      {activeSection === item.id && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-3 sm:h-4 bg-green-500 rounded-full"></div>
                      )}
                      
                      <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                        activeSection === item.id
                          ? 'bg-green-100 dark:bg-green-900/30'
                          : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
                      }`}>
                        <item.icon className={`h-3 w-3 sm:h-3.5 sm:w-3.5 transition-colors duration-200 ${
                          activeSection === item.id
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-gray-600 dark:text-gray-400'
                        }`} />
                      </div>
                      
                      <span className={`flex-1 text-left text-xs sm:text-sm transition-colors duration-200 truncate ${
                        activeSection === item.id
                          ? 'text-green-700 dark:text-green-300 font-medium'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {item.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 dark:from-gray-900 dark:via-slate-900 dark:to-emerald-950">
          
          <Sidebar className="border-r-0 shadow-xl backdrop-blur-xl bg-white/98 dark:bg-gray-900/98">
            <SidebarHeader className="border-b border-gray-200/50 dark:border-gray-700/50 px-4 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-br from-green-50/80 via-emerald-50/80 to-blue-50/80 dark:from-green-950/80 dark:via-emerald-950/80 dark:to-blue-950/80 min-h-[60px] sm:h-[73px] flex items-center">
              <div className="flex items-center gap-2.5 sm:gap-3 w-full">
                <div className="relative flex-shrink-0">
                  <div className="w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <img 
                      src={conapLogo} 
                      alt="CONAP Logo" 
                      className="h-5 w-5 sm:h-6 sm:w-6 object-contain"
                    />
                  </div>
                  <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-green-400 rounded-full border-2 border-white dark:border-gray-900 animate-pulse-soft"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="font-bold text-sm sm:text-base bg-gradient-to-r from-green-700 via-emerald-600 to-green-700 dark:from-green-400 dark:via-emerald-300 dark:to-green-400 bg-clip-text text-transparent leading-tight truncate">
                    CONAP
                  </h1>
                  <p className="text-xs text-muted-foreground font-medium leading-tight truncate">Sistema de Guardarecursos</p>
                </div>
              </div>
            </SidebarHeader>
            
            <SidebarContent className="px-3 sm:px-4 py-4 sm:py-6">
              {renderNavigationCategories()}
            </SidebarContent>
          </Sidebar>
          
          <main className="flex-1 flex flex-col relative">
            <header className="sticky top-0 z-20 border-b border-green-700 dark:border-green-900 px-2 sm:px-3 md:px-4 lg:px-5 xl:px-6 py-2 sm:py-2.5 md:py-3 lg:py-3.5 flex items-center justify-between bg-gradient-to-r from-green-600 via-green-600 to-emerald-600 dark:from-green-800 dark:via-green-800 dark:to-emerald-800 backdrop-blur-md shadow-lg min-h-[56px] sm:min-h-[60px] md:min-h-[64px] lg:min-h-[68px] xl:min-h-[72px]">
              
              <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 lg:gap-3.5 xl:gap-4 flex-1 min-w-0">
                {/* Botón de menú minimalista responsive */}
                <SidebarTrigger className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 md:w-10 md:h-10 lg:w-11 lg:h-11 rounded-lg bg-white/15 hover:bg-white/25 active:bg-white/30 text-white transition-all duration-200 border-0 backdrop-blur-sm flex-shrink-0 active:scale-95 shadow-sm hover:shadow-md">
                  <Menu className="h-4.5 w-4.5 sm:h-5 sm:w-5 md:h-5 md:w-5 lg:h-5.5 lg:w-5.5" />
                </SidebarTrigger>
                
                {/* Icono del módulo actual - Responsive con mejor visibilidad */}
                <div className="hidden sm:flex items-center justify-center w-9 h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 rounded-lg bg-white/10 backdrop-blur-sm flex-shrink-0 shadow-sm">
                  <currentModule.icon className="h-5 w-5 md:h-5.5 md:w-5.5 lg:h-6 lg:w-6 text-white drop-shadow-sm" />
                </div>
                
                {/* Título del módulo - Totalmente responsive */}
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-left hover:opacity-90 active:opacity-75 transition-opacity duration-200 min-w-0 flex-1 group"
                >
                  <h2 className="text-sm sm:text-base md:text-base lg:text-lg xl:text-xl font-semibold text-white truncate leading-tight drop-shadow-sm group-hover:drop-shadow-md transition-all">
                    {currentModule.name}
                  </h2>
                  <p className="text-xs sm:text-xs md:text-sm lg:text-sm text-green-50/90 truncate hidden sm:block leading-tight mt-0.5 drop-shadow-sm">
                    {currentModule.category}
                  </p>
                </button>
              </div>
              
              <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2 lg:gap-2.5 xl:gap-3 flex-shrink-0">
                {/* Info del usuario - Responsive con mejor visibilidad */}
                <div className="text-right hidden lg:hidden xl:block">
                  <div className="font-medium text-white text-sm xl:text-sm leading-tight drop-shadow-sm">
                    {currentUser.nombre} {currentUser.apellido}
                  </div>
                  <div className="text-xs text-green-50/90 flex items-center gap-1.5 justify-end mt-0.5 leading-tight">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse-soft shadow-sm"></div>
                    <span className="drop-shadow-sm">{currentUser.rol}</span>
                  </div>
                </div>
                
                {/* ThemeToggle - Siempre visible con mejor tamaño */}
                <ThemeToggle variant="compact" />
                
                {/* Menú de usuario para pantallas medianas y grandes */}
                <div className="hidden sm:flex items-center gap-1.5 md:gap-2">
                  {/* Avatar - Visible en desktop con animación */}
                  <div className="w-9 h-9 md:w-10 md:h-10 lg:w-10 lg:h-10 xl:w-11 xl:h-11 bg-white/15 backdrop-blur-sm rounded-full items-center justify-center hidden lg:flex transition-all duration-200 hover:bg-white/25 active:bg-white/30 cursor-pointer shadow-sm hover:shadow-md hover:scale-105 active:scale-95">
                    <UserCheck className="h-4.5 w-4.5 md:h-5 md:w-5 lg:h-5 lg:w-5 xl:h-5.5 xl:w-5.5 text-white drop-shadow-sm" />
                  </div>
                  
                  {/* Botón cambiar contraseña - Responsive con mejor touch target */}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsPasswordDialogOpen(true)}
                    className="text-white border-white/20 hover:bg-white/20 hover:border-white/40 active:bg-white/30 bg-white/10 backdrop-blur-sm transition-all duration-200 h-9 w-9 md:h-10 md:w-10 lg:h-10 lg:w-10 p-0 flex items-center justify-center rounded-lg shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
                    title="Cambiar contraseña"
                  >
                    <Key className="h-4 w-4 md:h-4.5 md:w-4.5 drop-shadow-sm" />
                  </Button>
                  
                  {/* Botón logout - Responsive con efecto hover mejorado */}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleLogout}
                    className="text-white border-white/20 hover:bg-red-500/80 hover:border-red-400/50 active:bg-red-600/80 bg-white/10 backdrop-blur-sm transition-all duration-200 h-9 w-9 md:h-10 md:w-10 lg:h-10 lg:w-10 p-0 flex items-center justify-center rounded-lg shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
                    title="Cerrar sesión"
                  >
                    <LogOut className="h-4 w-4 md:h-4.5 md:w-4.5 drop-shadow-sm" />
                  </Button>
                </div>
                
                {/* Menú desplegable para móvil - Mejorado y más accesible */}
                <div className="sm:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-white border-white/20 hover:bg-white/20 hover:border-white/40 active:bg-white/30 bg-white/10 backdrop-blur-sm transition-all duration-200 h-9 w-9 p-0 flex items-center justify-center rounded-lg shadow-sm hover:shadow-md active:scale-95"
                        aria-label="Menú de usuario"
                      >
                        <UserCheck className="h-4.5 w-4.5 drop-shadow-sm" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 sm:w-64 mt-2 rounded-xl shadow-xl border-2">
                      <DropdownMenuLabel className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                            <UserCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="flex flex-col space-y-1 min-w-0 flex-1">
                            <p className="text-sm font-semibold leading-none truncate">
                              {currentUser.nombre} {currentUser.apellido}
                            </p>
                            <p className="text-xs leading-none text-muted-foreground flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse-soft"></div>
                              {currentUser.rol}
                            </p>
                          </div>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => setIsPasswordDialogOpen(true)}
                        className="py-3 cursor-pointer"
                      >
                        <Key className="mr-3 h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />
                        <span className="font-medium">Cambiar contraseña</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={handleLogout} 
                        className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/30 py-3 cursor-pointer"
                      >
                        <LogOut className="mr-3 h-4.5 w-4.5" />
                        <span className="font-medium">Cerrar sesión</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </header>
            
            <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto relative">
              <div className="relative z-10">
                {renderContent()}
              </div>
            </div>
          </main>
          <Toaster position="top-right" richColors />
          <CambiarContrasena 
            isOpen={isPasswordDialogOpen}
            onClose={() => setIsPasswordDialogOpen(false)}
            currentUser={currentUser}
          />
        </div>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);

  if (!currentUser) {
    return (
      <ThemeProvider defaultTheme="system" storageKey="conap-theme">
        <Login onLogin={setCurrentUser} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="conap-theme">
      <SidebarProvider defaultOpen={false}>
        <AppContent currentUser={currentUser} setCurrentUser={setCurrentUser} />
      </SidebarProvider>
    </ThemeProvider>
  );
}