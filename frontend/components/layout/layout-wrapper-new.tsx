import { PropsWithChildren } from 'react'
import { Header } from './header'
import SidebarHero from './sidebar.heroui'

export default function LayoutWrapper({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <Header />
      <div className="flex">
        <SidebarHero />
        <main className="flex-1 overflow-hidden">
          <div className="h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="px-12 py-8 max-w-[1600px] mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
