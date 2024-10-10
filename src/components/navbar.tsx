import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { useRouter } from "next/navigation";
import { Tooltip } from "./tooltip";
import { Lock } from "lucide-react";

export function Navbar({
  hasOperations,
}: {
  hasOperations: {
    fiis: boolean;
    fixedIncomes: boolean;
  };
}) {
  const { push } = useRouter();
  return (
    <div className="hidden lg:flex lg:items-center lg:gap-6 lg:pl-[16px]">
      <Menubar className="border-0">
        <MenubarMenu>
          {hasOperations.fiis ? (
            <MenubarTrigger className="">Home</MenubarTrigger>
          ) : (
            <Tooltip label="Você precisa ter títulos cadastrados para acessar essa página.">
              <p className="cursor-not-allowed flex select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none">
                Home
              </p>
            </Tooltip>
          )}
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className="">Fiis</MenubarTrigger>
          <MenubarContent>
            {hasOperations.fiis ? (
              <MenubarItem
                onClick={() =>
                  push(
                    `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/fiis/general`,
                  )
                }
              >
                Geral
              </MenubarItem>
            ) : (
              <Tooltip
                className=" bg-zinc-900  w-full"
                label="Você precisa ter fundos cadastrados para acessar essa página."
              >
                <div className="flex items-center justify-between">
                  <p className="elative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                    Visão geral
                  </p>
                  <Lock className="mr-2 text-red-500" size={16} />
                </div>
              </Tooltip>
            )}
            <MenubarItem
              onClick={() =>
                push(
                  `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/fiis/register-operations`,
                )
              }
            >
              Cadastrar operação
            </MenubarItem>
            {hasOperations.fiis ? (
              <MenubarItem
                onClick={() =>
                  push(
                    `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/fiis/extracts`,
                  )
                }
              >
                Extratos
              </MenubarItem>
            ) : (
              <Tooltip
                className=" bg-zinc-900  w-full"
                label="Você precisa ter fundos cadastrados para acessar essa página."
              >
                <div className="flex items-center justify-between">
                  <p className="elative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                    Visão geral
                  </p>
                  <Lock className="mr-2 text-red-500" size={16} />
                </div>
              </Tooltip>
            )}
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className="">Renda fixa</MenubarTrigger>
          <MenubarContent>
            {hasOperations.fixedIncomes ? (
              <MenubarPrimitive.Item
                onClick={() =>
                  push(
                    `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/fixed-income/general`,
                  )
                }
                className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              >
                Visão geral
              </MenubarPrimitive.Item>
            ) : (
              <Tooltip
                className=" bg-zinc-900  w-full"
                label="Você precisa ter títulos cadastrados para acessar essa página."
              >
                <div className="flex items-center justify-between">
                  <p className="elative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                    Visão geral
                  </p>
                  <Lock className="mr-2 text-red-500" size={16} />
                </div>
              </Tooltip>
            )}

            <MenubarItem
              onClick={() =>
                push(
                  `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/fixed-income/register-operations`,
                )
              }
            >
              Cadastrar operação
            </MenubarItem>

            {hasOperations.fixedIncomes ? (
              <MenubarItem
                onClick={() =>
                  push(
                    `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/fixed-income/extracts`,
                  )
                }
              >
                Extratos
              </MenubarItem>
            ) : (
              <Tooltip
                className=" bg-zinc-900  w-full"
                label="Você precisa ter títulos cadastrados para acessar essa página."
              >
                <div className="flex items-center justify-between">
                  <p className="elative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                    Extratos
                  </p>
                  <Lock className="mr-2 text-red-500" size={16} />
                </div>
              </Tooltip>
            )}
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
}
