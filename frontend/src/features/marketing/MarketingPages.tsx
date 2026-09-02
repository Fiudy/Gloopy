import {
  ArrowRight,
  CheckCircle2,
  Gamepad2,
  LockKeyhole,
  MessageCircle,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

type PageProps = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  children: React.ReactNode;
};
function Page({ eyebrow, title, description, image, children }: PageProps) {
  return (
    <main>
      <section className="relative overflow-hidden px-5 pb-20 pt-36 sm:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(124,77,255,.28),transparent_34%)]" />
        <div className="relative mx-auto grid min-h-[620px] max-w-7xl items-center gap-10 lg:grid-cols-[1fr_.8fr]">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="mt-5 max-w-4xl font-display text-5xl font-bold leading-[.95] tracking-[-.035em] sm:text-7xl">
              {title}
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-gloopy-muted sm:text-xl">
              {description}
            </p>
            <Link
              to="/register"
              className="mt-9 inline-flex min-h-14 items-center gap-3 rounded-2xl bg-gloopy-accent px-7 font-bold text-gloopy-bg-dark"
            >
              Começar agora <ArrowRight />
            </Link>
          </div>
          <div className="relative h-[480px] overflow-hidden">
            <div className="absolute inset-x-8 bottom-8 h-72 rounded-full bg-gloopy-primary/30 blur-[80px]" />
            <img
              src={image}
              alt=""
              className="absolute left-1/2 top-0 h-[590px] max-w-none -translate-x-1/2 object-contain"
            />
          </div>
        </div>
      </section>
      {children}
      <FinalCta />
    </main>
  );
}
function FinalCta() {
  return (
    <section className="px-5 pb-24 sm:px-8">
      <div className="mx-auto max-w-7xl rounded-[2.5rem] bg-gloopy-accent p-9 text-gloopy-bg-dark sm:p-14">
        <h2 className="max-w-3xl font-display text-4xl font-bold sm:text-6xl">
          Construa conversas com mais presença.
        </h2>
        <p className="mt-4 max-w-xl text-lg opacity-75">
          Uma conta. Todas as pessoas e experiências importantes no mesmo lugar.
        </p>
        <Link
          to="/register"
          className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-gloopy-bg-dark px-7 py-4 font-bold text-white"
        >
          Criar conta gratuita <ArrowRight />
        </Link>
      </div>
    </section>
  );
}

export function ResourcesPage() {
  const items = [
    [
      MessageCircle,
      "Mensagens em tempo real",
      "Envio, edição, exclusão, leitura e digitação com continuidade entre dispositivos.",
    ],
    [
      Users,
      "Grupos organizados",
      "Múltiplos administradores, participantes e decisões de permissão transparentes.",
    ],
    [
      Gamepad2,
      "Mini-games integrados",
      "Experiências interativas dentro do fluxo, sem links externos ou troca de contexto.",
    ],
  ] as const;
  return (
    <Page
      eyebrow="Recursos"
      title="Uma plataforma social completa, sem complexidade desnecessária."
      description="Recursos essenciais de comunicação e novas formas de interação, organizados em uma experiência consistente."
      image="/mascot/gloopy-texting.png"
    >
      <section className="px-5 py-24 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {items.map(([Icon, title, text]) => (
            <article key={title} className="premium-card">
              <Icon className="h-11 w-11 text-gloopy-accent" />
              <h2 className="mt-10 font-display text-3xl font-bold">{title}</h2>
              <p className="mt-4 leading-7 text-gloopy-muted">{text}</p>
              <ul className="mt-7 space-y-3 text-sm">
                {[
                  "Interface responsiva",
                  "Estados claros",
                  "Controle pelo usuário",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <CheckCircle2 className="h-5 w-5 text-gloopy-status-online" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </Page>
  );
}
export function SecurityPage() {
  return (
    <Page
      eyebrow="Segurança e privacidade"
      title="Confiança construída em cada camada."
      description="O Gloopy combina regras de acesso aplicadas no servidor com escolhas de privacidade simples e compreensíveis."
      image="/mascot/gloopy-thumbsup.png"
    >
      <section className="px-5 py-24 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
          {[
            [
              LockKeyhole,
              "Autenticação obrigatória",
              "Rotas privadas e conexões em tempo real exigem identidade válida.",
            ],
            [
              ShieldCheck,
              "Acesso contextual",
              "Somente participantes ativos podem acessar conversas e emitir eventos.",
            ],
            [
              CheckCircle2,
              "Preferências explícitas",
              "Último acesso e confirmação de leitura podem ser configurados no perfil.",
            ],
          ].map(([Icon, title, text]) => (
            <article key={title as string} className="premium-card">
              <Icon className="h-12 w-12 text-gloopy-primary" />
              <h2 className="mt-8 font-display text-3xl font-bold">
                {title as string}
              </h2>
              <p className="mt-4 leading-7 text-gloopy-muted">
                {text as string}
              </p>
            </article>
          ))}
        </div>
      </section>
    </Page>
  );
}
export function AboutPage() {
  return (
    <Page
      eyebrow="Sobre o Gloopy"
      title="Tecnologia para aproximar, não para distrair."
      description="Criamos uma experiência social em que personalidade, privacidade e interação coexistem de forma responsável."
      image="/mascot/gloopy-waving.png"
    >
      <section className="px-5 py-24 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <h2 className="display-title">
            Uma identidade memorável a serviço de um produto sério.
          </h2>
          <div className="space-y-6 text-lg leading-8 text-gloopy-muted">
            <p>
              O mascote expressa energia e proximidade. A infraestrutura garante
              consistência, regras claras e evolução sustentável.
            </p>
            <p>
              O Gloopy não busca substituir relações por métricas. Busca
              oferecer um espaço mais expressivo para relações que já importam.
            </p>
          </div>
        </div>
      </section>
    </Page>
  );
}
export function TicTacToePage() {
  return (
    <Page
      eyebrow="Mini-games"
      title="Uma partida começa sem a conversa terminar."
      description="O jogo da velha é a primeira experiência interativa nativa do Gloopy, sincronizada em tempo real dentro do chat."
      image="/mascot/gloopy-cool.png"
    >
      <section className="px-5 py-24 sm:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div className="grid grid-cols-3 gap-3 rounded-[2.5rem] border border-white/10 bg-gloopy-surface p-6">
            {["X", "", "O", "", "X", "", "O", "", "X"].map((cell, index) => (
              <div
                key={index}
                className="grid aspect-square place-items-center rounded-2xl bg-gloopy-bg-dark font-display text-4xl font-bold text-gloopy-accent"
              >
                {cell}
              </div>
            ))}
          </div>
          <div>
            <p className="eyebrow">Integração real</p>
            <h2 className="display-title mt-4">Convide. Aceite. Jogue.</h2>
            <p className="mt-5 text-lg leading-8 text-gloopy-muted">
              Sem salas paralelas ou navegação confusa. O convite é uma
              mensagem, o tabuleiro é parte da conversa e cada jogada chega em
              tempo real.
            </p>
          </div>
        </div>
      </section>
    </Page>
  );
}
