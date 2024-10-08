import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { push } = useRouter();
  return (
    <div className="hidden lg:flex lg:items-center lg:gap-6 lg:pl-[16px]">
      <Menubar className="border-0">
        <MenubarMenu>
          <MenubarTrigger className="">Home</MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className="">Fiis</MenubarTrigger>
          <MenubarContent>
            <MenubarItem
              onClick={() =>
                push(
                  `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/fiis/general`,
                )
              }
            >
              Geral
            </MenubarItem>
            <MenubarItem
              onClick={() =>
                push(
                  `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/fiis/register-operations`,
                )
              }
            >
              Cadastrar operação
            </MenubarItem>
            <MenubarItem
              onClick={() =>
                push(
                  `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/fiis/extracts`,
                )
              }
            >
              Extratos
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className="">Renda fixa</MenubarTrigger>
          <MenubarContent>
            <MenubarPrimitive.Item
              onClick={() =>
                push(
                  `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/fixed-income/general`,
                )
              }
              className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            >
              Geral
            </MenubarPrimitive.Item>
            <MenubarItem
              onClick={() =>
                push(
                  `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/fixed-income/register-operations`,
                )
              }
            >
              Cadastrar operação
            </MenubarItem>
            <MenubarItem
              onClick={() =>
                push(
                  `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/fixed-income/extracts`,
                )
              }
            >
              Extratos
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
}
