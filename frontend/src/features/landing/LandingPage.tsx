import {
  ArrowRight,
  Gamepad2,
  Image,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
const features = [
  {
    icon: MessageCircle,
    title: "Papo que flui",
    text: "Mensagens, presença e confirmação de leitura em tempo real.",
  },
  {
    icon: Users,
    title: "Sua galera junta",
    text: "Conversas 1:1 e grupos com controles claros para admins.",
  },
  {
    icon: Image,
    title: "Manda do seu jeito",
    text: "Fotos, vídeos, áudios e documentos sem quebrar o ritmo.",
  },
];
export function LandingPage() {
  const root = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => { gsap.registerPlugin(ScrollTrigger); const context = gsap.context(() => { gsap.from('[data-hero-copy] > *', { y: 48, opacity: 0, duration: .9, stagger: .1, ease: 'power3.out' }); gsap.from('[data-hero-mascot]', { y: 100, scale: .86, opacity: 0, duration: 1.2, ease: 'power4.out' }); gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => gsap.from(element, { scrollTrigger: { trigger: element, start: 'top 82%' }, y: 54, opacity: 0, duration: .85, ease: 'power3.out' })); }, root); return () => context.revert(); }, []);
  return (
    <div ref={root} className="overflow-hidden">
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
        <nav
          aria-label="Principal"
          className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-white/10 bg-gloopy-bg-dark/85 px-3 py-3 shadow-card backdrop-blur-xl sm:px-4"
        >
          <Link
            to="/"
            className="flex items-center gap-2 font-display text-xl font-bold"
          >
            <img
              src="/mascot/gloopy-cool-icon.png"
              alt=""
              className="h-9 w-9 rounded-xl"
            />
            <span className="hidden min-[360px]:inline">Gloopy</span>
          </Link>
          <div className="hidden items-center gap-7 text-sm font-semibold text-gloopy-muted md:flex">
            <a href="#diferencial">Por que Gloopy?</a>
            <a href="#recursos">Recursos</a>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              to="/login"
              className="rounded-xl px-2 py-2 text-sm font-semibold hover:bg-white/10 sm:px-3"
            >
              Entrar
            </Link>
            <Link
              to="/register"
              className="rounded-xl bg-gloopy-accent px-3 py-2 text-sm font-bold text-gloopy-bg-dark sm:px-4"
            >
              <span className="sm:hidden">Criar</span>
              <span className="hidden sm:inline">Criar conta</span>
            </Link>
          </div>
        </nav>
      </header>
      <main>
        <section className="relative mx-auto grid min-h-screen min-w-0 max-w-7xl items-center gap-10 px-5 pb-20 pt-32 sm:px-6 lg:grid-cols-[1.05fr_.95fr]">
          <div data-hero-copy className="z-10 min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-gloopy-accent/40 bg-gloopy-accent/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-gloopy-accent">
              <Sparkles className="h-4 w-4" /> Chat virou playground
            </span>
            <h1 className="mt-7 max-w-3xl font-display text-[2.65rem] font-bold leading-[.98] sm:text-7xl sm:leading-[.95] lg:text-[5.5rem]">
              Seu grupo. Seu papo. <span className="text-gloopy-accent">Seu próximo vício.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-gloopy-muted">
              O chat que transforma qualquer “e aí?” em conversa, conexão e disputa — sem trocar de app.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gloopy-accent px-6 font-bold text-gloopy-bg-dark transition hover:-translate-y-1"
              >
                Entrar na roda <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#diferencial"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border bg-gloopy-surface px-6 font-bold"
              >
                Ver como funciona
              </a>
            </div>
            <div className="mt-8 flex items-center gap-3 text-sm text-gloopy-muted">
              <ShieldCheck className="h-5 w-5 text-gloopy-status-online" /> Seu
              papo, suas escolhas de privacidade.
            </div>
          </div>
          <div data-hero-mascot className="relative flex h-[460px] items-start justify-center overflow-hidden lg:h-[680px]">
            <div className="absolute h-[65%] w-[75%] rounded-full bg-gloopy-primary/30 blur-[90px]" />
            <img
              src="/mascot/gloopy-waving.png"
              alt="Mascote Gloopy acenando"
              className="relative z-10 w-[135%] max-w-none object-contain object-top sm:w-[105%] lg:w-[125%]"
            />
          </div>
        </section>
        <section
          id="diferencial"
          className="border-y bg-gloopy-primary-deep px-6 py-20"
        >
          <div data-reveal className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
            <img
              src="/mascot/gloopy-texting.png"
              alt="Mascote Gloopy conversando pelo celular"
              className="mx-auto max-h-[430px]"
            />
            <div>
              <p className="text-sm font-bold uppercase tracking-[.22em] text-gloopy-accent">
                Sem sair do papo
              </p>
              <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
                Do “e aí?” ao “valendo!” em um toque.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-white/75">
                O convite aparece como parte da conversa. Aceitou? O tabuleiro
                abre na hora e acompanha cada jogada ao vivo.
              </p>
              <div className="mt-7 inline-flex items-center gap-3 rounded-2xl bg-gloopy-bg-dark/35 p-4">
                <Gamepad2 className="h-8 w-8 text-gloopy-accent" />
                <div>
                  <strong className="block">Jogo da velha, primeiro.</strong>
                  <span className="text-sm text-white/70">
                    Mais atividades entram na roda depois.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section data-reveal id="recursos" className="mx-auto max-w-6xl px-6 py-24">
          <p className="text-sm font-bold uppercase tracking-[.22em] text-gloopy-accent">
            Feito para estar perto
          </p>
          <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold sm:text-5xl">
            Tudo o que você espera de um chat. Com mais personalidade.
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {features.map(({ icon: Icon, title, text }, i) => (
              <article
                key={title}
                className="rounded-3xl border bg-gloopy-surface p-6 transition hover:-translate-y-1 hover:border-gloopy-primary"
              >
                <Icon className="h-10 w-10 rounded-xl bg-gloopy-primary/15 p-2 text-gloopy-primary" />
                <span className="mt-8 block text-xs font-bold text-gloopy-accent">
                  0{i + 1}
                </span>
                <h3 className="mt-2 font-display text-2xl font-semibold">
                  {title}
                </h3>
                <p className="mt-3 leading-relaxed text-gloopy-muted">{text}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="relative overflow-hidden rounded-[2rem] bg-gloopy-accent px-7 py-12 text-gloopy-bg-dark sm:px-12 lg:grid lg:grid-cols-[1fr_340px]">
            <div>
              <h2 className="font-display text-4xl font-bold sm:text-5xl">
                Seu próximo papo pode começar agora.
              </h2>
              <p className="mt-4 text-lg opacity-70">
                Crie sua conta, encontre sua galera e deixe o Gloopy puxar
                assunto.
              </p>
              <Link
                to="/register"
                className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-gloopy-bg-dark px-6 font-bold text-white"
              >
                Criar minha conta <ArrowRight />
              </Link>
            </div>
            <img
              src="/mascot/gloopy-thumbsup.png"
              alt="Mascote Gloopy fazendo sinal de positivo"
              className="mx-auto mt-8 max-h-72 lg:absolute lg:bottom-0 lg:right-10"
            />
          </div>
        </section>
      </main>
      <footer className="border-t px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 text-sm text-gloopy-muted sm:flex-row">
          <span>© 2026 Gloopy. Papo bom mora aqui.</span>
          <div className="flex gap-5">
            <a href="#recursos">Recursos</a>
            <Link to="/login">Entrar</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
