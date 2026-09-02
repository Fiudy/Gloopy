import {
  Bell,
  Gamepad2,
  LogOut,
  MessageCircle,
  Plus,
  Search,
  Settings,
  UserRound,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../auth/auth-store";
import { cn } from "../../shared/ui/cn";

const links = [
  ["/conversations", MessageCircle, "Conversas"],
  ["/games", Gamepad2, "Jogos"],
  ["/profile", UserRound, "Perfil"],
] as const;
export function AppShell() {
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const navigate = useNavigate();
  return (
    <main className="min-h-dvh bg-gloopy-bg-dark md:grid md:grid-cols-[250px_1fr]">
      <aside className="fixed inset-x-0 bottom-0 z-50 flex h-[72px] items-center justify-around border-t border-white/10 bg-gloopy-surface/95 px-2 backdrop-blur-xl md:inset-y-0 md:left-0 md:h-auto md:w-[250px] md:flex-col md:items-stretch md:justify-start md:border-r md:border-t-0 md:p-5">
        <div className="hidden items-center gap-3 px-2 md:flex">
          <img
            src="/mascot/gloopy-cool-icon.png"
            alt=""
            className="h-12 w-12 rounded-2xl"
          />
          <div>
            <strong className="font-display text-xl">Gloopy</strong>
            <span className="block text-[10px] uppercase tracking-[.16em] text-gloopy-muted">
              Seu espaço
            </span>
          </div>
        </div>
        <button
          onClick={() => navigate("/conversations/new")}
          className="mt-7 hidden min-h-12 items-center justify-center gap-2 rounded-2xl bg-gloopy-accent font-bold text-gloopy-bg-dark transition hover:-translate-y-0.5 md:flex"
        >
          <Plus className="h-5 w-5" />
          Nova conversa
        </button>
        <nav className="contents md:mt-7 md:block" aria-label="Aplicação">
          {links.map(([to, Icon, label]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex min-h-12 min-w-[70px] flex-col items-center justify-center gap-1 rounded-xl text-xs font-semibold text-gloopy-muted transition hover:bg-white/5 hover:text-white md:mb-1 md:min-w-0 md:flex-row md:justify-start md:gap-3 md:px-4 md:text-sm",
                  isActive && "bg-gloopy-primary/15 text-gloopy-primary",
                )
              }
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto hidden rounded-2xl border border-white/10 bg-gloopy-bg-dark/60 p-3 md:flex md:items-center md:gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gloopy-primary font-display font-bold">
            {user?.name?.[0] ?? "G"}
          </span>
          <div className="min-w-0 flex-1">
            <strong className="block truncate text-sm">{user?.name}</strong>
            <span className="block truncate text-xs text-gloopy-muted">
              {user?.email}
            </span>
          </div>
          <button
            onClick={() => {
              signOut();
              navigate("/login");
            }}
            className="rounded-lg p-2 text-gloopy-muted hover:bg-white/5 hover:text-white"
            aria-label="Sair"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>
      <div className="min-w-0 pb-[72px] md:col-start-2 md:pb-0">
        <div className="hidden h-20 items-center justify-end gap-2 border-b border-white/10 px-7 md:flex">
          <button className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 text-gloopy-muted">
            <Search className="h-5 w-5" />
          </button>
          <button className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 text-gloopy-muted">
            <Bell className="h-5 w-5" />
          </button>
        </div>
        <Outlet />
      </div>
    </main>
  );
}
export function PlaceholderPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="flex min-h-[calc(100dvh-5rem)] items-center justify-center p-6">
      <div className="max-w-md text-center">
        <Settings className="mx-auto h-10 w-10 text-gloopy-primary" />
        <h1 className="mt-4 font-display text-4xl font-bold">{title}</h1>
        <p className="mt-3 leading-7 text-gloopy-muted">{description}</p>
      </div>
    </section>
  );
}
