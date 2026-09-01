import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Gamepad2, X } from 'lucide-react';
import { gamesApi } from '../../shared/api/services';
import { AsyncState } from '../../shared/ui/AsyncState';
import { Button } from '../../shared/ui/Button';
import { useAuthStore } from '../auth/auth-store';

export function GameInviteCard({ sessionId }: { sessionId: string }) {
  const user = useAuthStore((state) => state.user);
  const client = useQueryClient();
  const [dismissed, setDismissed] = useState(false);
  const query = useQuery({ queryKey: ['game', sessionId], queryFn: () => gamesApi.get(sessionId) });

  const respond = useMutation({
    mutationFn: (response: 'ACCEPT' | 'DECLINE') => gamesApi.respond(sessionId, response),
    onSuccess: () => client.invalidateQueries({ queryKey: ['game', sessionId] }),
  });

  const move = useMutation({
    mutationFn: (cellIndex: number) => gamesApi.move(sessionId, cellIndex),
    onSuccess: () => client.invalidateQueries({ queryKey: ['game', sessionId] }),
  });

  if (dismissed) return null;

  if (query.isLoading) {
    return (
      <article className="mx-auto w-full max-w-sm rounded-3xl border border-gloopy-primary/60 bg-gloopy-surface p-5 shadow-glow">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gloopy-accent text-gloopy-bg-dark">
              <Gamepad2 />
            </span>
            <div>
              <h2 className="font-display text-xl font-semibold">Jogo da velha</h2>
              <p className="text-xs text-gloopy-muted">Carregando partida…</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-gloopy-muted transition hover:bg-white/10 hover:text-white"
            aria-label="Fechar jogo"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <AsyncState kind="loading" />
      </article>
    );
  }

  if (!query.data) {
    return (
      <article className="mx-auto w-full max-w-sm rounded-3xl border border-gloopy-primary/60 bg-gloopy-surface p-5 shadow-glow">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold">Jogo da velha</h2>
            <p className="text-xs text-gloopy-muted">Não foi possível abrir a partida.</p>
          </div>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-gloopy-muted transition hover:bg-white/10 hover:text-white"
            aria-label="Fechar jogo"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </article>
    );
  }

  const game = query.data;
  const isGuest = user?.id === game.playerOId;
  const cells = game.board.padEnd(9, '_').slice(0, 9).split('').map((value) => (value === '_' ? '' : value));

  return (
    <article className="mx-auto w-full max-w-sm rounded-3xl border border-gloopy-primary/60 bg-gloopy-surface p-5 shadow-glow">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gloopy-accent text-gloopy-bg-dark">
          <Gamepad2 />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-xl font-semibold">Jogo da velha</h2>
          <p className="text-xs text-gloopy-muted">
            {game.status === 'PENDING'
              ? 'Convite para uma partida'
              : game.status === 'IN_PROGRESS'
                ? 'Partida em andamento'
                : 'Partida encerrada'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-gloopy-muted transition hover:bg-white/10 hover:text-white"
          aria-label="Fechar jogo"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {game.status === 'PENDING' ? (
        <div className="mt-5 flex gap-2">
          {isGuest ? (
            <>
              <Button onClick={() => respond.mutate('ACCEPT')} loading={respond.isPending}>
                Aceitar
              </Button>
              <Button variant="ghost" onClick={() => respond.mutate('DECLINE')}>
                Recusar
              </Button>
            </>
          ) : (
            <p className="text-sm text-gloopy-muted">Esperando a resposta do outro jogador…</p>
          )}
        </div>
      ) : (
        <>
          <div className="mt-5 grid grid-cols-3 gap-2" role="grid" aria-label="Tabuleiro do jogo da velha">
            {cells.map((value, index) => (
              <button
                key={index}
                type="button"
                onClick={() => move.mutate(index)}
                disabled={game.status !== 'IN_PROGRESS' || !!value || user?.id !== game.currentTurnUserId}
                className="aspect-square rounded-2xl border border-white/10 text-2xl font-bold transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {value}
              </button>
            ))}
          </div>
          <div className="mt-4 text-center text-sm text-gloopy-muted">
            {game.winnerUserId
              ? game.winnerUserId === user?.id
                ? 'Você venceu!'
                : 'Partida encerrada'
              : `Vez de ${game.currentTurnUserId === user?.id ? 'você' : 'seu oponente'}`}
          </div>
        </>
      )}
    </article>
  );
}
