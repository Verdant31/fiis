import SignInForm from "@/components/sign-in-form";
import { validateRequest } from "@/lib/validate-request";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await validateRequest();

  if (session.user?.id) redirect("/dashboard/home");

  return (
    <main className="fixed left-[50%] top-[50%] w-full max-w-lg translate-x-[-50%] translate-y-[-50%]">
      <h1 className="text-center text-2xl font-semibold">Entrar</h1>
      <p className="text-center text-muted-foreground mt-1">
        Preencha os campos abaixo para se autenticar
      </p>
      <SignInForm />
    </main>
  );
}
