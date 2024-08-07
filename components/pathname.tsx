'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'

export function Pathname({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <div>
      {pathname !== '/' && <Header />}
      {children}
    </div>
  )
}
