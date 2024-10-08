import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";

export function Navbar() {
  return (
    <div className="hidden lg:flex lg:items-center lg:gap-6 lg:pl-[16px]">
      <Menubar className="border-0">
        <MenubarMenu>
          <MenubarTrigger className="">
            <a href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/home`}>
              Home
            </a>
          </MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className="">Fiis</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <a
                href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/fiis/general`}
              >
                Geral
              </a>
            </MenubarItem>
            <MenubarItem>
              <a
                href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/fiis/register-operations`}
              >
                Cadastrar operação
              </a>
            </MenubarItem>
            <MenubarItem>
              <a
                href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/fiis/extracts`}
              >
                Extratos
              </a>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className="">Renda fixa</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <a
                href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/fixed-income/general`}
              >
                Geral
              </a>
            </MenubarItem>
            <MenubarItem>
              <a
                href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/fixed-income/register-operations`}
              >
                Cadastrar operação
              </a>
            </MenubarItem>
            <MenubarItem>
              <a
                href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/fixed-income/extracts`}
              >
                Extratos
              </a>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
}
