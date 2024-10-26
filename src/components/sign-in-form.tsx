"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";
import { SignInFormData, SignInSchema } from "../types/auth";

export default function SignInForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(SignInSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const { mutateAsync: signInMutation, isLoading: isSigningIn } = useMutation({
    mutationFn: async (data: SignInFormData) =>
      await fetch("api/sign-in", {
        method: "POST",
        body: JSON.stringify(data),
      }).then((res) => res.json()),
  });

  const onSubmit = async (data: SignInFormData) => {
    const response = await signInMutation(data);
    if (response?.status !== 200) {
      return toast.error(response?.message);
    }
    router.push("/dashboard/home");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4 max-w-[80%] mx-auto mt-6">
        <div>
          <div>
            <label>Email</label>
            <Input
              className="mt-2"
              placeholder="name@example.com"
              {...register("email")}
            />
          </div>
          <AnimatePresence>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="text-red-500 text-sm pt-2 pl-1"
              >
                {errors.email.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <div>
          <div>
            <label>Senha</label>
            <Input
              placeholder="your_password@123"
              {...register("password")}
              type="password"
              className="mt-2"
            />
          </div>
          <AnimatePresence>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="text-red-500 text-sm pt-2 pl-1"
              >
                {errors.password.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <Button className="w-full">
          {isSigningIn ? <ClipLoader size={20} /> : "Entrar"}
        </Button>
        <p className="text-muted-foreground text-center text-sm pt-4 w-[80%] mx-auto">
          Não tem uma conta?{" "}
          <a href="/sign-up" className="underline">
            Crie agora
          </a>
        </p>
      </div>
    </form>
  );
}
