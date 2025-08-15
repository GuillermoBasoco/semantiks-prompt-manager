import type { ReactNode } from 'react'
import '../globals.css'

export const metadata = {
  title: 'Semantiks Embed',
}

export default function EmbedLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-transparent text-gray-900">
        {children}
      </body>
    </html>
  )
}


