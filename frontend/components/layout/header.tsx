'use client'

import { Bell, Search, User, Settings, Command } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-[color:var(--border)] bg-[color:var(--background)]/80 backdrop-blur-sm">
      <div className="flex h-full items-center justify-between px-6">
        {/* Left: Logo */}
        <div className="flex items-center gap-3 min-w-fit">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[color:var(--primary)] shadow-sm">
            <span className="text-sm font-bold text-white">RC</span>
          </div>
          <span className="hidden md:inline text-sm font-semibold text-[color:var(--foreground)]">RiskControl</span>
        </div>

        {/* Center: Search (hidden on mobile, shown on desktop) */}
        <div className="hidden sm:flex flex-1 justify-center">
          <div className="w-full max-w-sm">
            <div className="relative flex items-center rounded-lg border border-[color:var(--border)] bg-[color:var(--input)] px-3 h-9 transition-colors hover:border-[color:var(--border)]">
              <Search size={16} className="text-[color:var(--muted-foreground)] flex-shrink-0" />
              <input
                type="search"
                placeholder="Buscar..."
                className="ml-2 flex-1 bg-transparent text-sm text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)] outline-none"
              />
              <div className="ml-auto flex items-center gap-1 text-xs text-[color:var(--muted-foreground)]">
                <Command size={12} />
                <span>K</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* Mobile search button */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="sm:hidden transition-colors bg-transparent border-none"
            aria-label="Buscar"
          >
            <Search size={24} className="text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]" />
          </button>

          {/* Notifications */}
          <button
            className="relative transition-colors bg-transparent border-none"
            aria-label="Notificaciones"
          >
            <Bell size={24} className="text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[color:var(--destructive)]" />
          </button>

          {/* Settings */}
          <button
            className="transition-colors bg-transparent border-none"
            aria-label="Configuración"
          >
            <Settings size={24} className="text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]" />
          </button>

          {/* User avatar */}
          <div className="w-px h-6 bg-[color:var(--border)] mx-1" />
          <button className="transition-colors bg-transparent border-none">
            <User size={20} className="text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]" />
          </button>
        </div>
      </div>
    </header>
  )
}