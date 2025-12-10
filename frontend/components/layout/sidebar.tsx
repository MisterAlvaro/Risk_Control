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

const navSections = [
  {
    label: 'Principal',
    items: [
      { name: 'Dashboard', href: '/', icon: Home },
    ]
  },
  {
    label: 'Gestión de Riesgo',
    items: [
      { name: 'Reglas de Riesgo', href: '/rules', icon: Shield },
      { name: 'Incidentes', href: '/incidents', icon: AlertTriangle },
    ]
  },
  {
    label: 'Monitoreo',
    items: [
      { name: 'Cuentas', href: '/accounts', icon: Users },
      { name: 'Trades', href: '/trades', icon: TrendingUp },
    ]
  },
  {
    label: 'Reportes',
    items: [
      { name: 'Reportes', href: '/reports', icon: BarChart3 },
      { name: 'Logs', href: '/logs', icon: FileText },
    ]
  }
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={cn(
      'sticky top-16 h-[calc(100vh-4rem)] border-r border-border bg-background transition-all duration-300 flex-shrink-0 overflow-y-auto',
      collapsed ? 'w-20' : 'w-72'
    )}>
      <div className="flex h-full flex-col">
        <nav className="flex-1 space-y-6 p-4 py-6">
          {navSections.map((section) => (
            <div key={section.label} className="space-y-2">
              {!collapsed && (
                <p className="px-4 text-xs font-semibold uppercase tracking-widest text-text/50 transition-all duration-300">
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
                        'group relative flex items-center rounded-xl text-sm font-medium transition-all duration-300',
                        collapsed ? 'justify-center px-0 py-3' : 'gap-3 px-4 py-3',
                        isActive
                          ? 'bg-gradient-to-r from-primary/90 to-primary text-white shadow-lg hover:shadow-xl hover:from-primary to-primary-dark'
                          : 'text-text/70 hover:text-text hover:bg-surface/50'
                      )}
                      title={collapsed ? item.name : undefined}
                    >
                      {isActive && !collapsed && (
                        <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-white/40"></div>
                      )}
                      <Icon className={cn(
                        'h-5 w-5 shrink-0 transition-transform duration-300',
                        isActive && 'group-hover:scale-110'
                      )} />
                      {!collapsed && (
                        <span className="transition-all duration-300">{item.name}</span>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-border/50 p-4">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              'group flex h-11 w-11 items-center justify-center rounded-xl border border-border/30 bg-surface/50 transition-all duration-300 hover:bg-surface hover:border-border/50',
              'ml-auto'
            )}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5 text-text/70 transition-transform group-hover:translate-x-0.5" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-text/70 transition-transform group-hover:-translate-x-0.5" />
            )}
          </button>
        </div>
      </div>
    </aside>
  )
}