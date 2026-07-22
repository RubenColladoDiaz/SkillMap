"use client";

import { FormEvent, useRef, useState } from "react";
import { createClient } from "../../../utils/supabase/client";
import { useRouter } from "next/navigation";

export default function Login() {
  const supabase = createClient();
  const router = useRouter();

  const emailRef = useRef<HTMLInputElement | null>(null);
  const passRef = useRef<HTMLInputElement | null>(null);

  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();

    const result = isSignUp
      ? await supabase.auth.signUp({
          email: emailRef.current?.value ?? "",
          password: passRef.current?.value ?? "",
        })
      : await supabase.auth.signInWithPassword({
          email: emailRef.current?.value ?? "",
          password: passRef.current?.value ?? "",
        });

    if (result.error) alert("Error:" + result.error.message);
    else router.push("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-2xl">
        <h1 className="text-center text-2xl font-bold text-white">SkillMap</h1>
        <p className="mt-1 text-center text-sm text-slate-500">
          {isSignUp
            ? "Crea una cuenta para empezar"
            : "Inicia sesión para ver tus roadmaps"}
        </p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">
              Email
            </label>
            <input
              ref={emailRef}
              type="email"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">
              Contraseña
            </label>
            <input
              ref={passRef}
              type="password"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-emerald-400"
          >
            {isSignUp ? "Crear cuenta" : "Iniciar sesión"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          {isSignUp ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta?"}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="font-medium text-emerald-400 hover:underline"
          >
            {isSignUp ? "Inicia sesión" : "Regístrate"}
          </button>
        </p>
      </div>
    </div>
  );
}
