import { Bell, Search, User, Settings } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-gradient-to-r from-background via-background to-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/95 backdrop-filter">
      <div className="flex h-16 items-center justify-between px-8">
        {/* Logo and Branding */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-dark shadow-lg">
            <span className="text-lg font-bold text-white">RC</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-text tracking-tight">Risk Control</h1>
            <p className="text-xs text-text/50 font-medium">Sistema de Gestión de Riesgo</p>
          </div>
          <div className="ml-4 h-8 w-px bg-border/30"></div>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-xl mx-6">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text/40 transition-colors group-focus-within:text-primary" />
            <Input 
              placeholder="Buscar reglas, cuentas, incidentes..." 
              className="pl-10 bg-surface/40 border-border/40 hover:border-border/60 transition-all focus:bg-surface focus:border-primary" 
            />
          </div>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative h-10 w-10 rounded-lg hover:bg-surface/60 transition-all duration-300" 
            aria-label="Notificaciones"
          >
            <Bell className="h-5 w-5 text-text/70 transition-transform hover:scale-110" />
            <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-danger to-danger/80 text-xs text-white font-bold shadow-lg animate-pulse">
              3
            </span>
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 rounded-lg hover:bg-surface/60 transition-all duration-300" 
            aria-label="Configuración"
          >
            <Settings className="h-5 w-5 text-text/70 transition-transform hover:scale-110" />
          </Button>

          <div className="h-8 w-px bg-border/30 mx-1"></div>

          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 rounded-lg hover:bg-surface/60 transition-all duration-300" 
            aria-label="Cuenta de usuario"
          >
            <User className="h-5 w-5 text-text/80 transition-transform hover:scale-110" />
          </Button>
        </div>
      </div>
    </header>
  )
}