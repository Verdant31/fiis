/* eslint-disable react/no-unescaped-entities */
import { usePathname } from 'next/navigation'
import { Link } from './link'

export function Navbar() {
  const pathname = usePathname()
  return (
    <div className="hidden lg:flex lg:items-center lg:gap-6 lg:pl-[16px]">
      <Link isActive={pathname === '/dashboard'} href="/dashboard">
        Dashboard
      </Link>
      <Link isActive={pathname === '/fiis'} href="/fiis">
        FII's
      </Link>
      <Link
        isActive={pathname === '/fixed-investments'}
        href="/fixed-investments"
      >
        Renda fixa
      </Link>
    </div>
  )
}
