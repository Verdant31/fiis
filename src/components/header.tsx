"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Building2,
  Github,
  Landmark,
  LayoutDashboard,
  Linkedin,
  MenuIcon,
  Dot,
} from "lucide-react";
import Link from "next/link";
import { Logo } from "./logo";
import { Navbar } from "./navbar";
import { Button } from "./ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { apiUrl } from "@/lib/axios";

export function Header() {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 shadow lg:shadow-none backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
      <div className="mx-4 sm:mx-8 flex h-14 items-center lg:max-w-[1500px] lg:mx-auto">
        <div className="flex items-center w-full justify-between lg:px-6">
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
                    href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/home`}
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
                    <Accordion type="single" collapsible className="w-full ">
                      <AccordionItem value="item-1" className="border-0">
                        <AccordionTrigger className="pr-4 hover:no-underline pl-4 cursor-pointer hover:bg-zinc-800 py-[10px] transition-colors duration-200 rounded-md flex items-center gap-4 mt-4">
                          <div className="flex items-center gap-4">
                            <Building2 size={18} />
                            <p className="text-sm">Fundos Imobiliarios</p>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pl-4 flex flex-col">
                          <a
                            href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/fiis/general`}
                            className="pr-4 hover:no-underline pl-4 cursor-pointer hover:bg-zinc-800 py-[10px] transition-colors duration-200 rounded-md flex items-center gap-4 mt-1"
                          >
                            <Dot size={18} />
                            <p>Visão geral</p>
                          </a>
                          <a
                            href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/fiis/register-operations`}
                            className="pr-4 hover:no-underline pl-4 cursor-pointer hover:bg-zinc-800 py-[10px] transition-colors duration-200 rounded-md flex items-center gap-4 mt-1"
                          >
                            <Dot size={18} />
                            <p>Cadastrar operação</p>
                          </a>
                          <a
                            href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/fiis/extracts`}
                            className="pr-4 hover:no-underline pl-4 cursor-pointer hover:bg-zinc-800 py-[10px] transition-colors duration-200 rounded-md flex items-center gap-4 mt-1"
                          >
                            <Dot size={18} />
                            <p>Extratos</p>
                          </a>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

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
                await fetch(`${apiUrl}/init-db`);
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
  );
}
