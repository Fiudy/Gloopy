import { useLayoutEffect, useRef } from "react";
import {
  ArrowRight,
  CheckCheck,
  Gamepad2,
  Image,
  LockKeyhole,
  MessageCircle,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const features = [
  {
    icon: MessageCircle,
    title: "Conversas naturais",
    text: "Mensagens diretas e grupos com presença, digitação e confirmações em tempo real.",
  },
  {
    icon: Image,
    title: "Mídia no contexto",
    text: "Compartilhe imagens, vídeos, áudios e documentos sem interromper a conversa.",
  },
  {
    icon: Gamepad2,
    title: "Interação compartilhada",
    text: "Convites e partidas acontecem no mesmo espaço, sincronizados para todos.",
  },
];
const questions = [
  [
    "O Gloopy é apenas um app de jogos?",
    "Não. É uma plataforma de conversas privadas. Os mini-games ampliam a interação sem substituir o chat.",
  ],
  [
    "Posso criar e administrar grupos?",
    "Sim. Grupos possuem múltiplos administradores, participantes e controles claros de permissão.",
  ],
  [
    "Como funciona a privacidade?",
    "Você controla último acesso e confirmações de leitura. Toda conversa exige autenticação e participação válida.",
  ],
];

export function LandingPage() {
  const root = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.from("[data-hero-copy] > *", {
        y: 42,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
      });
      gsap.from("[data-hero-art]", {
        x: 90,
        scale: 0.92,
        opacity: 0,
        duration: 1.15,
        ease: "power4.out",
      });
      gsap.utils
        .toArray<HTMLElement>("[data-reveal]")
        .forEach((element) =>
          gsap.from(element, {
            scrollTrigger: { trigger: element, start: "top 84%" },
            y: 48,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
          }),
        );
    }, root);
    return () => context.revert();
  }, []);
  return (
    <main ref={root}>
      <section className="relative min-h-[880px] overflow-hidden px-5 pb-12 pt-32 sm:px-8 lg:min-h-screen lg:pt-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(124,77,255,.30),transparent_36%),radial-gradient(circle_at_18%_70%,rgba(255,138,61,.11),transparent_30%)]" />
        <div className="absolute inset-0 opacity-[.05] [background-image:linear-gradient(rgba(255,255,255,.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.6)_1px,transparent_1px)] [background-size:72px_72px]" />
        <div className="relative mx-auto grid min-h-[740px] max-w-7xl items-center gap-8 lg:grid-cols-[1.05fr_.95fr]">
          <div data-hero-copy className="z-10 min-w-0">
            <p className="eyebrow">Conversar. Jogar. Permanecer.</p>
            <h1 className="mt-7 max-w-3xl font-display text-[4rem] font-bold uppercase leading-[.82] tracking-[-.035em] sm:text-8xl lg:text-[7.4rem]">
              Toda conversa pode{" "}
              <span className="text-gloopy-accent">ganhar vida.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-gloopy-muted sm:text-xl">
              O Gloopy reúne conversas, grupos, mídia e jogos no mesmo lugar —
              para que estar longe nunca pareça estar distante.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-gloopy-accent px-7 font-bold text-gloopy-bg-dark shadow-[0_18px_50px_rgba(255,138,61,.22)] transition hover:-translate-y-1"
              >
                Criar minha conta{" "}
                <ArrowRight className="transition group-hover:translate-x-1" />
              </Link>
              <Link
                to="/recursos"
                className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-7 font-bold backdrop-blur hover:bg-white/10"
              >
                Conhecer a plataforma
              </Link>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm text-gloopy-muted">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-gloopy-status-online" />
                Privacidade configurável
              </span>
              <span className="flex items-center gap-2">
                <CheckCheck className="h-4 w-4 text-gloopy-primary" />
                Tempo real
              </span>
              <span className="flex items-center gap-2">
                <LockKeyhole className="h-4 w-4 text-gloopy-accent" />
                Acesso autenticado
              </span>
            </div>
          </div>
          <div
            data-hero-art
            className="relative h-[460px] self-end overflow-hidden sm:h-[580px] lg:h-[760px]"
          >
            <div className="absolute inset-x-[8%] bottom-[8%] h-[55%] rounded-full bg-gloopy-primary/35 blur-[90px]" />
            <img
              src="/mascot/gloopy-waving.png"
              alt="Mascote oficial do Gloopy dando boas-vindas"
              className="absolute left-1/2 top-2 h-auto w-[92%] max-w-[680px] -translate-x-1/2 sm:top-0 sm:w-[86%] lg:top-[2%] lg:w-[94%]"
            />
          </div>
        </div>
      </section>
      <div className="overflow-hidden border-y border-black/10 bg-gloopy-accent py-4 text-gloopy-bg-dark">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-display text-lg font-bold uppercase tracking-[.12em]">
          {Array.from({ length: 3 }).map((_, index) => (
            <span key={index}>
              Conversas privadas • Grupos organizados • Mídia integrada •
              Mini-games em tempo real • Privacidade sob controle •
            </span>
          ))}
        </div>
      </div>
      <section data-reveal className="px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow">Uma plataforma completa</p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[.85fr_1.15fr]">
            <h2 className="display-title">
              Tudo o que a conversa precisa. Nada que tire você dela.
            </h2>
            <p className="max-w-2xl text-lg leading-8 text-gloopy-muted lg:pt-3">
              Tecnologia deve ampliar a proximidade. Cada recurso mantém
              contexto, continuidade e controle nas mãos do usuário.
            </p>
          </div>
          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-12">
            {features.map(({ icon: Icon, title, text }, index) => (
              <article key={title} className={`premium-card group min-h-72 ${index === 0 ? 'lg:col-span-5 lg:bg-gloopy-primary-deep' : index === 1 ? 'lg:col-span-3' : 'lg:col-span-4 lg:bg-gloopy-accent lg:text-gloopy-bg-dark'}`}>
                <span className="text-xs font-bold text-gloopy-muted">
                  0{index + 1}
                </span>
                <Icon className={`mt-10 h-11 w-11 ${index === 2 ? 'text-gloopy-bg-dark' : 'text-gloopy-accent'}`} />
                <h3 className="mt-6 font-display text-2xl font-bold">
                  {title}
                </h3>
                <p className={`mt-3 leading-7 ${index === 2 ? 'text-gloopy-bg-dark/70' : 'text-gloopy-muted'}`}>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section data-reveal className="px-5 py-16 sm:px-8">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2.5rem] bg-gloopy-bg-light text-gloopy-bg-dark lg:grid-cols-2">
          <div className="relative min-h-[520px] overflow-hidden bg-gloopy-primary-deep">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,138,61,.25),transparent_55%)]" />
            <img
              src="/mascot/gloopy-texting.png"
              alt="Mascote Gloopy usando o chat"
              className="absolute bottom-[-12%] left-1/2 h-[620px] max-w-none -translate-x-1/2"
            />
          </div>
          <div className="flex flex-col justify-center p-8 sm:p-14">
            <span className="eyebrow text-gloopy-primary-deep">
              Projetado para fluidez
            </span>
            <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
              Da primeira mensagem à experiência compartilhada.
            </h2>
            <div className="mt-9 space-y-7">
              {[
                ["01", "Encontre pessoas e inicie conversas privadas."],
                ["02", "Compartilhe conteúdo sem perder o contexto."],
                ["03", "Transforme o momento em interação ao vivo."],
              ].map(([number, text]) => (
                <div
                  key={number}
                  className="flex gap-5 border-t border-black/10 pt-5"
                >
                  <strong className="text-gloopy-primary-deep">{number}</strong>
                  <p className="font-semibold">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section data-reveal className="px-5 py-24 sm:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <p className="eyebrow text-gloopy-status-online">
              Privacidade por escolha
            </p>
            <h2 className="display-title mt-4">
              Confiança não é detalhe. É infraestrutura.
            </h2>
            <p className="mt-6 text-lg leading-8 text-gloopy-muted">
              Acesso autenticado, participação validada e preferências claras
              para último acesso e confirmações de leitura.
            </p>
            <Link
              to="/seguranca"
              className="mt-7 inline-flex items-center gap-2 font-bold text-gloopy-accent"
            >
              Conheça nossos princípios <ArrowRight />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="premium-card sm:row-span-2">
              <LockKeyhole className="h-10 w-10 text-gloopy-primary" />
              <h3 className="mt-16 font-display text-3xl font-bold">
                Seu espaço permanece seu.
              </h3>
              <p className="mt-3 text-gloopy-muted">
                Controles acessíveis e regras de acesso aplicadas no servidor.
              </p>
            </div>
            <div className="rounded-[2rem] bg-gloopy-primary p-7">
              <Users className="h-9 w-9" />
              <strong className="mt-10 block text-xl">
                Grupos administráveis
              </strong>
            </div>
            <div className="rounded-[2rem] bg-gloopy-accent p-7 text-gloopy-bg-dark">
              <ShieldCheck className="h-9 w-9" />
              <strong className="mt-10 block text-xl">
                Preferências transparentes
              </strong>
            </div>
          </div>
        </div>
      </section>
      <section
        data-reveal
        className="overflow-hidden bg-gloopy-primary-deep px-5 py-20 sm:px-8"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Interação nativa</p>
            <h2 className="mt-4 font-display text-5xl font-bold sm:text-7xl">
              Quando conversar não basta, jogue.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/70">
              Convide, aceite e acompanhe cada movimento sem abandonar o fluxo
              da conversa.
            </p>
            <Link
              to="/games/tic-tac-toe"
              className="mt-8 inline-flex min-h-14 items-center gap-3 rounded-2xl bg-gloopy-accent px-7 font-bold text-gloopy-bg-dark"
            >
              Explorar mini-games <ArrowRight />
            </Link>
          </div>
          <div className="relative h-[520px] overflow-hidden">
            <div className="absolute inset-x-0 bottom-0 h-3/4 rounded-full bg-gloopy-accent/20 blur-[80px]" />
            <img
              src="/mascot/gloopy-cool.png"
              alt="Mascote Gloopy com atitude"
              className="absolute left-1/2 top-0 h-[640px] max-w-none -translate-x-1/2"
            />
          </div>
        </div>
      </section>
      <section data-reveal className="px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="eyebrow">Perguntas frequentes</p>
          <h2 className="display-title mt-4">Clareza antes de começar.</h2>
        </div>
        <div className="mx-auto mt-12 max-w-4xl divide-y divide-white/10 border-y border-white/10">
          {questions.map(([question, answer]) => (
            <details key={question} className="group py-6">
              <summary className="flex cursor-pointer list-none justify-between gap-6 font-display text-xl font-bold">
                {question}
                <span className="text-gloopy-accent transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="max-w-2xl pt-4 leading-7 text-gloopy-muted">
                {answer}
              </p>
            </details>
          ))}
        </div>
      </section>
      <section className="px-5 pb-24 sm:px-8">
        <div
          data-reveal
          className="relative mx-auto grid max-w-7xl overflow-hidden rounded-[2.5rem] bg-gloopy-accent p-8 text-gloopy-bg-dark sm:p-14 lg:grid-cols-[1fr_360px]"
        >
          <div className="relative z-10">
            <p className="text-sm font-bold uppercase tracking-[.18em]">
              Comece com uma conversa
            </p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl font-bold sm:text-6xl">
              Uma experiência mais humana começa aqui.
            </h2>
            <p className="mt-5 max-w-xl text-lg opacity-75">
              Crie sua conta e descubra uma forma mais completa de permanecer
              conectado.
            </p>
            <Link
              to="/register"
              className="mt-8 inline-flex min-h-14 items-center gap-3 rounded-2xl bg-gloopy-bg-dark px-7 font-bold text-white"
            >
              Criar conta gratuita <ArrowRight />
            </Link>
          </div>
          <img
            src="/mascot/gloopy-thumbsup.png"
            alt="Mascote Gloopy aprovando"
            className="mx-auto mt-8 max-h-80 lg:absolute lg:-bottom-20 lg:right-6 lg:mt-0 lg:max-h-[460px]"
          />
        </div>
      </section>
    </main>
  );
}
