import { PropsWithChildren } from 'react'
import { Header } from './header'
import { Sidebar } from './sidebar'

export default function LayoutWrapper({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-background text-text">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          <div className="h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="p-8 max-w-[1600px] mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

