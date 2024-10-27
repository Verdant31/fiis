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
  LogOut,
  Lock,
  Settings,
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
import { api } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import { Tooltip } from "./tooltip";

export function Header({
  hasOperations,
}: {
  hasOperations: {
    fiis: boolean;
    fixedIncomes: boolean;
  };
}) {
  const { push } = useRouter();
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: async () => await api.get("/logout"),
  });

  const handleLogout = async () => {
    const { data } = await mutateAsync();

    if (data?.status !== 200) {
      return toast.error(
        data?.message ?? "Houve um erro ao tentar deslogar seu usuário.",
      );
    }
    push("/");
  };

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
                className="sm:w-72 px-3 h-full flex flex-col "
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
                  {!hasOperations.fiis ? (
                    <Tooltip
                      className="w-full"
                      label="Você precisa cadastrar fundos para acessar o dashboard."
                    >
                      <p className="flex items-center pl-4 bg-zinc-900 py-[10px] hover:bg-zinc-900 transition-colors duration-200 rounded-md">
                        <LayoutDashboard size={18} />
                        <span className="ml-4 text-sm font-semibold">
                          Dashboard
                        </span>
                        <Lock className="ml-auto text-red-500 mr-4" size={20} />
                      </p>
                    </Tooltip>
                  ) : (
                    <Link
                      className="flex items-center pl-4 bg-zinc-800 py-[10px] hover:bg-zinc-900 transition-colors duration-200 rounded-md"
                      href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/home`}
                    >
                      <LayoutDashboard size={18} />
                      <span className="ml-4 text-sm font-semibold">
                        Dashboard
                      </span>
                    </Link>
                  )}

                  <Link
                    className="flex mt-2 items-center pl-4 bg-zinc-800 py-[10px] hover:bg-zinc-900 transition-colors duration-200 rounded-md"
                    href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`}
                  >
                    <Settings size={18} />
                    <span className="ml-4 text-sm font-semibold">
                      Configurações
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
                          {hasOperations.fiis ? (
                            <a
                              href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/fiis/general`}
                              className="pr-4 hover:no-underline pl-4 cursor-pointer hover:bg-zinc-800 py-[10px] transition-colors duration-200 rounded-md flex items-center gap-4 mt-1"
                            >
                              <Dot size={18} />
                              <p>Visão geral</p>
                            </a>
                          ) : (
                            <Tooltip
                              className="w-full mt-4 "
                              label="Você precisa ter fundos cadastrados para acessar essa página."
                            >
                              <p className="bg-zinc-900 pr-4 hover:no-underline pl-4 cursor-pointer hover:bg-zinc-800 py-[10px] transition-colors duration-200 rounded-md flex items-center gap-4 mt-1">
                                <Dot size={18} />
                                <p>Visão geral</p>
                                <Lock
                                  className="ml-auto text-red-500 "
                                  size={20}
                                />
                              </p>
                            </Tooltip>
                          )}
                          <a
                            href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/fiis/register-operations`}
                            className="pr-4 hover:no-underline pl-4 cursor-pointer hover:bg-zinc-800 py-[10px] transition-colors duration-200 rounded-md flex items-center gap-4 mt-1"
                          >
                            <Dot size={18} />
                            <p>Cadastrar operação</p>
                          </a>
                          {hasOperations.fiis ? (
                            <a
                              href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/fiis/extracts`}
                              className="pr-4 hover:no-underline pl-4 cursor-pointer hover:bg-zinc-800 py-[10px] transition-colors duration-200 rounded-md flex items-center gap-4 mt-1"
                            >
                              <Dot size={18} />
                              <p>Extratos</p>
                            </a>
                          ) : (
                            <Tooltip
                              className="w-full"
                              label="Você precisa ter fundos cadastrados para acessar essa página."
                            >
                              <p className="bg-zinc-900 pr-4 hover:no-underline pl-4 cursor-pointer hover:bg-zinc-800 py-[10px] transition-colors duration-200 rounded-md flex items-center gap-4 mt-1">
                                <Dot size={18} />
                                <p>Extratos</p>
                                <Lock
                                  className="ml-auto text-red-500 "
                                  size={20}
                                />
                              </p>
                            </Tooltip>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    <Accordion type="single" collapsible className="w-full ">
                      <AccordionItem value="item-1" className="border-0">
                        <AccordionTrigger className="pr-4 hover:no-underline pl-4 cursor-pointer hover:bg-zinc-800 py-[10px] transition-colors duration-200 rounded-md flex items-center gap-4 ">
                          <div className="flex items-center gap-4">
                            <Landmark size={18} />{" "}
                            <p className="text-sm">Renda fixa</p>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pl-4 flex flex-col">
                          {hasOperations.fixedIncomes ? (
                            <a
                              href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/fixed-income/general`}
                              className="pr-4 hover:no-underline pl-4 cursor-pointer hover:bg-zinc-800 py-[10px] transition-colors duration-200 rounded-md flex items-center gap-4 mt-1"
                            >
                              <Dot size={18} />
                              <p>Visão geral</p>
                            </a>
                          ) : (
                            <Tooltip
                              className="w-full mt-4 "
                              label="Você precisa ter títulos cadastrados para acessar essa página."
                            >
                              <p className="bg-zinc-900 pr-4 hover:no-underline pl-4 cursor-pointer hover:bg-zinc-800 py-[10px] transition-colors duration-200 rounded-md flex items-center gap-4 mt-1">
                                <Dot size={18} />
                                <p>Visão geral</p>
                                <Lock
                                  className="ml-auto text-red-500 "
                                  size={20}
                                />
                              </p>
                            </Tooltip>
                          )}
                          <a
                            href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/fixed-income/register-operations`}
                            className="pr-4 hover:no-underline pl-4 cursor-pointer hover:bg-zinc-800 py-[10px] transition-colors duration-200 rounded-md flex items-center gap-4 mt-1"
                          >
                            <Dot size={18} />
                            <p>Cadastrar operação</p>
                          </a>
                          {hasOperations.fixedIncomes ? (
                            <a
                              href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/fixed-income/extracts`}
                              className="pr-4 hover:no-underline pl-4 cursor-pointer hover:bg-zinc-800 py-[10px] transition-colors duration-200 rounded-md flex items-center gap-4 mt-1"
                            >
                              <Dot size={18} />
                              <p>Extratos</p>
                            </a>
                          ) : (
                            <Tooltip
                              className="w-full "
                              label="Você precisa ter títulos cadastrados para acessar essa página."
                            >
                              <p className="bg-zinc-900 pr-4 hover:no-underline pl-4 cursor-pointer hover:bg-zinc-800 py-[10px] transition-colors duration-200 rounded-md flex items-center gap-4 mt-1">
                                <Dot size={18} />
                                <p>Extratos</p>
                                <Lock
                                  className="ml-auto text-red-500 "
                                  size={20}
                                />
                              </p>
                            </Tooltip>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>
                <div className="left-0 absolute bottom-12 w-[100%] px-6">
                  <Button
                    onClick={handleLogout}
                    className="w-[100%] flex items-center gap-4"
                  >
                    {isLoading ? (
                      <ClipLoader size={20} />
                    ) : (
                      <LogOut size={20} />
                    )}
                    Sair
                  </Button>
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
            <Navbar hasOperations={hasOperations} />
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
            <div
              onClick={handleLogout}
              className="flex ml-6 items-center cursor-pointer"
            >
              {isLoading ? <ClipLoader size={20} /> : <LogOut />}
              <p>Sair</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
