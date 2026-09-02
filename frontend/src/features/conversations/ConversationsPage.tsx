import { useQuery } from "@tanstack/react-query";
import {
  ChevronRight,
  MessageCircle,
  Plus,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { conversationsApi } from "../../shared/api/services";
import { AsyncState } from "../../shared/ui/AsyncState";
import { Avatar } from "../../shared/ui/Avatar";

export function ConversationsPage() {
  const query = useQuery({
    queryKey: ["conversations"],
    queryFn: conversationsApi.list,
  });
  const [search, setSearch] = useState("");
  const filtered = useMemo(
    () =>
      query.data?.filter((conversation) =>
        (conversation.name ?? "").toLowerCase().includes(search.toLowerCase()),
      ),
    [query.data, search],
  );
  if (query.isLoading)
    return (
      <AsyncState
        kind="loading"
        description="Carregando suas conversas com segurança."
      />
    );
  if (query.isError)
    return (
      <AsyncState
        kind="error"
        description="Não foi possível sincronizar suas conversas."
        onRetry={() => query.refetch()}
      />
    );
  return (
    <section className="mx-auto max-w-6xl px-4 py-6 sm:px-7 sm:py-8">
      <header className="flex items-end justify-between gap-5">
        <div>
          <p className="eyebrow">Central de conversas</p>
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
            Suas conexões
          </h1>
          <p className="mt-2 text-gloopy-muted">
            Continue conversas, organize grupos e compartilhe experiências.
          </p>
        </div>
        <Link
          to="/conversations/new"
          className="hidden min-h-12 items-center gap-2 rounded-2xl bg-gloopy-accent px-5 font-bold text-gloopy-bg-dark sm:inline-flex"
        >
          <Plus className="h-5 w-5" />
          Nova conversa
        </Link>
      </header>
      <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_310px]">
        <div>
          <label className="relative block">
            <Search className="absolute left-4 top-4 h-5 w-5 text-gloopy-muted" />
            <span className="sr-only">Buscar conversas</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="min-h-14 w-full rounded-2xl border border-white/10 bg-gloopy-surface pl-12 pr-4 placeholder:text-gloopy-muted"
              placeholder="Buscar por pessoa ou grupo"
            />
          </label>
          {filtered?.length === 0 ? (
            <AsyncState
              kind="empty"
              title="Nenhuma conversa encontrada"
              description={
                search
                  ? "Tente outro termo de busca."
                  : "Inicie uma conversa para construir sua rede."
              }
            />
          ) : (
            <div className="mt-4 overflow-hidden rounded-[2rem] border border-white/10 bg-gloopy-surface">
              {filtered?.map((conversation, index) => (
                <Link
                  key={conversation.id}
                  to={`/conversations/${conversation.id}`}
                  className="group flex items-center gap-4 border-b border-white/5 p-4 transition last:border-0 hover:bg-white/[.035] sm:p-5"
                >
                  <Avatar
                    name={conversation.name ?? `Conversa ${index + 1}`}
                    src={conversation.avatarUrl}
                    online={conversation.type === "DIRECT"}
                className="h-14 w-14"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <strong className="truncate font-display text-lg">
                        {conversation.name ??
                          (conversation.type === "GROUP"
                            ? "Grupo"
                            : `Conversa ${index + 1}`)}
                      </strong>
                      <time className="text-xs text-gloopy-muted">Agora</time>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      {conversation.type === "GROUP" ? (
                        <Users className="h-3.5 w-3.5 text-gloopy-muted" />
                      ) : (
                        <MessageCircle className="h-3.5 w-3.5 text-gloopy-muted" />
                      )}
                      <p className="truncate text-sm text-gloopy-muted">
                        {conversation.isPending
                          ? "Solicitação de nova conversa"
                          : (conversation.lastMessage?.content ??
                            "Abra para continuar a conversa")}
                      </p>
                    </div>
                  </div>
                  {conversation.isPending ? (
                    <span className="hidden rounded-full bg-gloopy-accent/15 px-3 py-1 text-xs font-bold text-gloopy-accent sm:block">
                      Pendente
                    </span>
                  ) : null}
                  <ChevronRight className="h-5 w-5 text-gloopy-muted transition group-hover:translate-x-1 group-hover:text-white" />
                </Link>
              ))}
            </div>
          )}
        </div>
        <aside className="hidden space-y-4 lg:block">
          <div className="relative overflow-hidden rounded-[2rem] bg-gloopy-primary p-6">
            <Sparkles className="h-8 w-8 text-gloopy-accent" />
            <h2 className="mt-12 font-display text-2xl font-bold">
              Transforme a conversa.
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/70">
              Convide alguém para uma partida diretamente pelo chat.
            </p>
            <img
              src="/mascot/gloopy-cool-icon.png"
              alt=""
              className="absolute -bottom-5 -right-5 h-28 w-28 rotate-[-8deg] rounded-[2rem] opacity-30"
            />
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-gloopy-surface p-6">
            <p className="text-xs font-bold uppercase tracking-[.16em] text-gloopy-muted">
              Privacidade
            </p>
            <strong className="mt-3 block text-lg">
              Você mantém o controle.
            </strong>
            <p className="mt-2 text-sm leading-6 text-gloopy-muted">
              Ajuste presença e confirmações de leitura no seu perfil.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
