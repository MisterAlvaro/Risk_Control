import type React from "react"
import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import "./globals.css"
import { QueryProvider } from '@/components/providers/query-provider'
import LayoutWrapper from '@/components/layout/layout-wrapper'

const _inter = Inter({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RiskControl - Panel de Monitoreo",
  description: "Sistema de monitoreo general de riesgo y actividad del sistema",
  generator: " ",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${_inter.className} ${_geistMono.className} font-sans antialiased`}>
        <QueryProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </QueryProvider>
      </body>
    </html>
  )
}
