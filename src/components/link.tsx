/* eslint-disable import/no-named-default */
import { default as NextLink } from 'next/link'

interface Props {
  href: string
  children: React.ReactNode
  isActive: boolean
}

export function Link({ isActive, href, children }: Props) {
  return (
    <NextLink
      href={href}
      className={`${isActive ? 'text-white' : 'text-muted-foreground'} hover:text-zinc-200 text-sm`}
    >
      {children}
    </NextLink>
  )
}
