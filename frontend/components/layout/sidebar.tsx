'use client'

import {
  Home,
  Shield,
  AlertTriangle,
  Users,
  TrendingUp,
  Settings,
  BarChart3,
  FileText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils/cn'

const navItems = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Reglas de Riesgo', href: '/rules', icon: Shield },
  { name: 'Incidentes', href: '/incidents', icon: AlertTriangle },
  { name: 'Cuentas', href: '/accounts', icon: Users },
  { name: 'Trades', href: '/trades', icon: TrendingUp },
  { name: 'Reportes', href: '/reports', icon: BarChart3 },
  { name: 'Logs', href: '/logs', icon: FileText },
  { name: 'Configuración', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={cn(
      "sticky top-16 h-[calc(100vh-4rem)] border-r bg-white transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex h-full flex-col">
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname?.startsWith(item.href))
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            )
          })}
        </nav>
        
        <div className="border-t p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </aside>
  )
}

function Button({ 
  children, 
  onClick, 
  className,
  variant = 'default',
  size = 'default'
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'default' | 'icon'
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variant === 'default' && "bg-primary text-primary-foreground hover:bg-primary/90",
        variant === 'ghost' && "hover:bg-accent hover:text-accent-foreground",
        variant === 'outline' && "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        size === 'default' && "h-10 px-4 py-2",
        size === 'icon' && "h-10 w-10",
        className
      )}
    >
      {children}
    </button>
  )
}