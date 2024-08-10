/* eslint-disable react/no-unescaped-entities */
'use client'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Building2,
  Github,
  Landmark,
  LayoutDashboard,
  Linkedin,
  MenuIcon,
} from 'lucide-react'
import Link from 'next/link'
import { Cardholder } from 'phosphor-react'
import { FiiWallet } from './fiis/FiiWallet'
import { InsertFiiModal } from './fiis/InsertFiiModal'
import { ReloadFiisModal } from './fiis/ReloadFiisModal'
import { Logo } from './logo'
import { Navbar } from './navbar'
import { Button } from './ui/button'

export function Header() {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        <div className="flex items-center w-full justify-between">
          <div className="flex items-center space-x-4 lg:space-x-2">
            <Sheet>
              <SheetTrigger className="lg:hidden" asChild>
                <Button className="h-8" variant="outline" size="icon">
                  <MenuIcon size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent
                className="sm:w-72 px-3 h-full flex flex-col"
                side="left"
              >
                <SheetHeader>
                  <Button
                    className="flex justify-center items-center mt-4"
                    variant="link"
                    asChild
                  >
                    <div className="flex items-center gap-3">
                      <Logo />
                      <h1 className="font-bold text-lg">STOCKS.TR</h1>
                    </div>
                  </Button>
                </SheetHeader>
                <div className="px-3 mt-8">
                  <Link
                    className="flex items-center pl-4 bg-zinc-800 py-[10px] hover:bg-zinc-900 transition-colors duration-200 rounded-md"
                    href="/dashboard"
                  >
                    <LayoutDashboard size={18} />
                    <span className="ml-4 text-sm font-semibold">
                      Dashboard
                    </span>
                  </Link>
                  <div>
                    <p className="mt-8 pl-4 text-sm font-semibold text-muted-foreground">
                      Investimentos
                    </p>
                    <a className="pl-4 cursor-pointer hover:bg-zinc-800 py-[10px] transition-colors duration-200 rounded-md flex items-center gap-4 mt-4">
                      <Building2 size={18} />
                      <p className="text-sm">Fundos Imobiliarios</p>
                    </a>
                    <a className="pl-4 cursor-pointer hover:bg-zinc-800 py-[10px] transition-colors duration-200 rounded-md flex items-center gap-4 ">
                      <Landmark size={18} />
                      <p className="text-sm">Renda fixa</p>
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <Logo className="hidden lg:block h-7 w-7" />
            <h1 className="font-bold">stocks.tr</h1>
            {/* <Button
              onClick={async () => {
                await fetch('api/init-db')
              }}
            >
              INIT DB
            </Button> */}
            <Navbar />
          </div>
          <div className="flex gap-4 items-center mr-2">
            <a
              href="https://github.com/Verdant31"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github />
            </a>
            <a
              href="https://www.linkedin.com/in/jo%C3%A3o-pedro-soares-piovesan-724235191/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin />
            </a>
          </div>
        </div>
      </div>
    </header>
  )

  return (
    <div className="flex w-[100vw] items-center mb-2 border-b-[1px] pb-[14px] mt-4">
      <div className="w-[1500px] m-auto pl-5 flex gap-8">
        <div className="flex items-center gap-[8px] mr-8">
          <Cardholder size={24} />
          <h1 className="font-bold text-xl">STOCKS TRACKER</h1>
        </div>
        <a
          href="/"
          className="cursor-pointer text-lg w-[90px] text-center tracking-wider text-zinc-400"
        >
          Home
        </a>
        <InsertFiiModal />
        <ReloadFiisModal />
        <FiiWallet />
        <a
          href="/payments"
          className="cursor-pointer text-lg w-[90px] text-center tracking-wider text-zinc-400"
        >
          Payments
        </a>
      </div>
    </div>
  )
}