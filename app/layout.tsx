import { Pathname } from '@/components/pathname'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import './globals.css'
import Providers from './providers'

export const metadata: Metadata = {
  title: "My FII's",
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      className={`${GeistSans.variable} ${GeistMono.variable} dark`}
      lang="en"
    >
      <Toaster richColors />
      <body className={GeistSans.className}>
        <Providers>
          <Pathname>
            <div className="max-w-[1400px] m-auto ">{children}</div>
          </Pathname>
        </Providers>
      </body>
    </html>
  )
}
