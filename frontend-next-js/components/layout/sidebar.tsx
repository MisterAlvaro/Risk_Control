"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, ShieldAlert, AlertCircle, Users, TrendingUp, Zap } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Risk Rules", href: "/risk-rules", icon: ShieldAlert },
  { name: "Incidents", href: "/incidents", icon: AlertCircle },
  { name: "Accounts", href: "/accounts", icon: Users },
  { name: "Trades", href: "/trades", icon: TrendingUp },
  { name: "Actions", href: "/actions", icon: Zap },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center border-b border-border px-6">
        <ShieldAlert className="h-6 w-6 text-primary" />
        <span className="ml-2 text-lg font-semibold text-foreground">Risk Management</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="text-xs text-muted-foreground">
          <div>API Status: Connected</div>
          <div className="mt-1">Environment: {process.env.NODE_ENV}</div>
        </div>
      </div>
    </div>
  )
}
