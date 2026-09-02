import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { apiErrorMessage } from "../../shared/api/client";
import { authApi } from "../../shared/api/services";
import { Button } from "../../shared/ui/Button";
import { useAuthStore } from "./auth-store";

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe seu nome com pelo menos 2 caracteres.")
    .optional(),
  email: z.string().trim().email("Informe um endereço de e-mail válido."),
  password: z.string().min(8, "A senha deve possuir pelo menos 8 caracteres."),
});
type FormData = z.infer<typeof schema>;

export function AuthPage({ mode }: { mode: "login" | "register" }) {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();
  const signIn = useAuthStore((state) => state.signIn);
  const isRegister = mode === "register";
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema), mode: "onBlur" });
  async function submit(data: FormData) {
    setApiError("");
    try {
      if (isRegister)
        await authApi.register({
          name: data.name ?? "",
          email: data.email,
          password: data.password,
        });
      const result = await authApi.login({
        email: data.email,
        password: data.password,
      });
      signIn(result.user, result.accessToken);
      navigate("/conversations");
    } catch (error) {
      setApiError(apiErrorMessage(error));
    }
  }
  return (
    <main className="relative min-h-dvh overflow-hidden bg-gloopy-bg-dark lg:grid lg:grid-cols-[1.05fr_.95fr]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(124,77,255,.25),transparent_38%)]" />
      <section className="relative hidden min-h-dvh overflow-hidden border-r border-white/10 p-10 lg:flex lg:flex-col">
        <Link
          to="/"
          className="z-10 inline-flex items-center gap-3 font-display text-2xl font-bold"
        >
          <img
            src="/mascot/gloopy-cool-icon.png"
            alt=""
            className="h-12 w-12 rounded-2xl"
          />
          Gloopy
        </Link>
        <div className="relative z-10 mt-auto max-w-xl pb-10">
          <p className="eyebrow">Conexões com mais presença</p>
          <h1 className="mt-5 font-display text-5xl font-bold leading-tight">
            Um ambiente privado para conversar, compartilhar e interagir.
          </h1>
          <div className="mt-8 grid gap-3 text-sm text-gloopy-muted">
            {[
              "Conversas e grupos em tempo real",
              "Preferências de privacidade claras",
              "Mini-games integrados ao chat",
            ].map((item) => (
              <span key={item} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-gloopy-status-online" />
                {item}
              </span>
            ))}
          </div>
        </div>
        <img
          src={
            isRegister ? "/mascot/gloopy-waving.png" : "/mascot/gloopy-cool.png"
          }
          alt="Mascote Gloopy"
          className="absolute -bottom-32 right-[-15%] h-[660px] max-w-none opacity-35"
        />
      </section>
      <section className="relative z-10 flex min-h-dvh items-center justify-center px-5 py-20 sm:px-8">
        <div className="w-full max-w-lg">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-gloopy-muted hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o início
          </Link>
          <div className="rounded-[2rem] border border-white/10 bg-gloopy-surface/90 p-6 shadow-[0_30px_100px_rgba(0,0,0,.38)] backdrop-blur sm:p-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="eyebrow">
                  {isRegister ? "Crie seu acesso" : "Acesse sua conta"}
                </p>
                <h2 className="mt-3 font-display text-4xl font-bold">
                  {isRegister ? "Comece no Gloopy" : "Bem-vindo de volta"}
                </h2>
              </div>
              <img
                src="/mascot/gloopy-icon.png"
                alt=""
                className="h-16 w-16 rounded-2xl lg:hidden"
              />
            </div>
            <p className="mt-3 leading-7 text-gloopy-muted">
              {isRegister
                ? "Configure sua conta em menos de um minuto."
                : "Continue suas conversas com segurança."}
            </p>
            <form
              onSubmit={handleSubmit(submit)}
              noValidate
              className="mt-8 space-y-5"
            >
              {isRegister ? (
                <Field label="Nome" error={errors.name?.message}>
                  <input
                    autoComplete="name"
                    aria-invalid={Boolean(errors.name)}
                    className="auth-input"
                    placeholder="Como devemos chamar você?"
                    {...register("name")}
                  />
                </Field>
              ) : null}
              <Field label="E-mail" error={errors.email?.message}>
                <input
                  type="email"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  className="auth-input"
                  placeholder="voce@exemplo.com"
                  {...register("email")}
                />
              </Field>
              <Field label="Senha" error={errors.password?.message}>
                <span className="relative block">
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete={
                      isRegister ? "new-password" : "current-password"
                    }
                    aria-invalid={Boolean(errors.password)}
                    className="auth-input pr-14"
                    placeholder="Mínimo de 8 caracteres"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-2 top-2 grid h-10 w-10 place-items-center rounded-xl text-gloopy-muted hover:bg-white/5"
                    aria-label={
                      showPassword ? "Ocultar senha" : "Mostrar senha"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </span>
              </Field>
              {apiError ? (
                <div
                  role="alert"
                  className="rounded-2xl border border-gloopy-danger/30 bg-gloopy-danger/10 p-4 text-sm text-gloopy-danger"
                >
                  {apiError}
                </div>
              ) : null}
              <Button type="submit" loading={isSubmitting} className="w-full">
                {isRegister ? "Criar minha conta" : "Entrar com segurança"}
              </Button>
            </form>
            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gloopy-muted">
              <span className="flex items-center gap-1.5">
                <LockKeyhole className="h-4 w-4" />
                Acesso protegido
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                Privacidade configurável
              </span>
            </div>
            <p className="mt-8 border-t border-white/10 pt-6 text-center text-sm text-gloopy-muted">
              {isRegister
                ? "Já possui uma conta?"
                : "Ainda não possui uma conta?"}{" "}
              <Link
                to={isRegister ? "/login" : "/register"}
                className="font-bold text-gloopy-accent"
              >
                {isRegister ? "Entrar" : "Criar conta"}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      {children}
      {error ? (
        <span className="mt-2 block text-sm text-gloopy-danger">{error}</span>
      ) : null}
    </label>
  );
}
