import type { ReactNode } from 'react'
import './globals.css'
import { aeonik } from './fonts/fonts'
import Sidebar from '@/components/sidebar'

export const metadata = {
  title: 'Semantiks Prompt Manager',
  description: 'Manage and publish AI prompts',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={aeonik.variable}>
      <body className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <div className="mx-auto max-w-5xl p-6">
          <header className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Semantiks Prompt Manager</h1>
            <nav className="text-sm">
              <a className="underline" href="/">Home</a>
              <span className="mx-2">/</span>
              <a className="underline" href="/new">New</a>
            </nav>
          </header>
          <div className="grid gap-6 md:grid-cols-[280px_1fr]">
            <Sidebar />
            <div>
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}


