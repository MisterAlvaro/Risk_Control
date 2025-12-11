"use client"

import { Home, Shield, AlertTriangle, Users, TrendingUp, BarChart3, FileText, ChevronLeft, ChevronRight, LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils/cn'

const navSections = [
  {
    label: 'Principal',
    items: [
      { name: 'Dashboard', href: '/', icon: Home, color: 'from-[color:var(--primary)]' },
    ]
  },
  {
    label: 'Gestión de Riesgo',
    items: [
      { name: 'Reglas de Riesgo', href: '/rules', icon: Shield, color: 'from-[#ef4444]' },
      { name: 'Incidentes', href: '/incidents', icon: AlertTriangle, color: 'from-[#f97316]' },
    ]
  },
  {
    label: 'Monitoreo',
    items: [
      { name: 'Cuentas', href: '/accounts', icon: Users, color: 'from-[#8b5cf6]' },
      { name: 'Trades', href: '/trades', icon: TrendingUp, color: 'from-[#06b6d4]' },
    ]
  },
  {
    label: 'Reportes',
    items: [
      { name: 'Reportes', href: '/reports', icon: BarChart3, color: 'from-[#ec4899]' },
      { name: 'Logs', href: '/logs', icon: FileText, color: 'from-[#14b8a6]' },
    ]
  }
]

export function SidebarHero() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      aria-label="Primary"
      className={cn(
        'sticky top-16 h-[calc(100vh-4rem)] border-r border-[color:var(--border)] bg-[color:var(--sidebar)] transition-all duration-300 flex-shrink-0 overflow-y-auto',
        collapsed ? 'w-20' : 'w-72'
      )}
    >
      <div className="flex h-full flex-col">
        <nav className="flex-1 space-y-6 p-4 py-6">
          {navSections.map((section) => (
            <div key={section.label} className="space-y-2">
              {!collapsed && (
                <p className="px-4 text-xs font-semibold uppercase tracking-widest text-[color:var(--muted-foreground)] transition-all duration-300">
                  {section.label}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'group relative flex items-center rounded-lg text-sm font-medium transition-all duration-200',
                        collapsed ? 'justify-center px-2 py-3 mx-2' : 'gap-6 px-3 py-2.5 mx-2',
                        isActive
                          ? 'bg-[color:var(--sidebar-accent)] text-[color:var(--foreground)]'
                          : 'text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] hover:bg-[color:var(--muted)]/50'
                      )}
                      title={collapsed ? item.name : undefined}
                    >
                      {/* Icon (no background container) */}
                      <div
                        className={cn(
                          'flex items-center justify-center rounded-lg h-9 w-9 flex-shrink-0 transition-all duration-200'
                        )}
                      >
                        <Icon className={cn('h-5 w-5 transition-colors duration-200', isActive ? `text-[${item.color.replace('from-', '')}]` : 'text-[color:var(--muted-foreground)]')} />
                      </div>
                      {!collapsed && <span className="transition-all duration-200 flex-1">{item.name}</span>}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User section at bottom */}
        <div className="border-t border-[color:var(--border)]/50 p-4 space-y-3">
          {/* User info (only visible when expanded) */}
          {!collapsed && (
            <div className="flex items-center gap-3 rounded-lg px-3 py-2 bg-[color:var(--muted)]/30">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[color:var(--primary)] to-[color:var(--primary)]/60 flex-shrink-0 flex items-center justify-center">
                <span className="text-xs font-bold text-white">AD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[color:var(--foreground)] truncate">Admin</p>
                <p className="text-xs text-[color:var(--muted-foreground)] truncate">admin@riskcontrol.io</p>
              </div>
            </div>
          )}

          {/* Collapse button + Logout */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-lg border border-[color:var(--border)]/30 bg-[color:var(--muted)]/30 transition-all duration-300 hover:bg-[color:var(--muted)]/50 hover:border-[color:var(--border)]/50 flex-shrink-0',
                !collapsed && 'ml-auto'
              )}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4 text-[color:var(--muted-foreground)] transition-transform group-hover:translate-x-0.5" />
              ) : (
                <ChevronLeft className="h-4 w-4 text-[color:var(--muted-foreground)] transition-transform group-hover:-translate-x-0.5" />
              )}
            </button>

            {/* Logout (only visible when expanded) */}
            {!collapsed && (
              <button
                className="flex-1 flex items-center justify-center gap-2 h-9 rounded-lg border border-[color:var(--border)]/30 bg-[color:var(--muted)]/30 hover:bg-[color:var(--muted)]/50 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut size={16} className="text-[color:var(--muted-foreground)]" />
                <span className="text-xs font-medium text-[color:var(--muted-foreground)]">Salir</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}

export default SidebarHero
