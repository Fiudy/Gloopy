import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Crown, LogOut, Save, Trash2, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { apiErrorMessage } from '../../shared/api/client';
import { authApi, conversationsApi } from '../../shared/api/services';
import { AsyncState } from '../../shared/ui/AsyncState';
import { Avatar } from '../../shared/ui/Avatar';
import { Button } from '../../shared/ui/Button';
import { useAuthStore } from '../auth/auth-store';

export function GroupSettingsPage() {
  const { id = '' } = useParams(); const currentUser = useAuthStore((state) => state.user); const navigate = useNavigate(); const client = useQueryClient();
  const conversations = useQuery({ queryKey: ['conversations'], queryFn: conversationsApi.list });
  const conversation = conversations.data?.find((item) => item.id === id); const [name, setName] = useState(''); const [search, setSearch] = useState(''); const [feedback, setFeedback] = useState('');
  const isAdmin = conversation?.participants.some((participant) => participant.userId === currentUser?.id && participant.role === 'ADMIN') ?? false;
  const users = useQuery({ queryKey: ['users', search], queryFn: () => authApi.searchUsers(search.trim()), enabled: search.trim().length >= 2 });
  const action = useMutation({ mutationFn: async (operation: () => Promise<unknown>) => operation(), onSuccess: () => { client.invalidateQueries({ queryKey: ['conversations'] }); setFeedback('Alteração concluída.'); }, onError: (error) => setFeedback(apiErrorMessage(error)) });
  if (conversations.isLoading) return <AsyncState kind="loading" description="Carregando o grupo." />;
  if (!conversation || conversation.type !== 'GROUP') return <AsyncState kind="error" description="Grupo não encontrado." onRetry={() => conversations.refetch()} />;
  return <section className="mx-auto max-w-2xl px-5 py-7"><header className="flex items-center gap-3"><Link to={`/conversations/${id}`} className="grid h-11 w-11 place-items-center rounded-xl hover:bg-white/10" aria-label="Voltar"><ArrowLeft /></Link><div><p className="text-sm font-bold uppercase tracking-widest text-gloopy-accent">Configurações</p><h1 className="font-display text-3xl font-bold">{conversation.name}</h1></div></header>
    <div className="mt-7 rounded-3xl border bg-gloopy-surface p-6"><h2 className="font-display text-xl font-semibold">Nome do grupo</h2><div className="mt-3 flex gap-2"><Input value={name} onChange={(event) => setName(event.target.value)} placeholder={conversation.name ?? 'Nome do grupo'} disabled={!isAdmin} /><Button onClick={() => action.mutate(() => conversationsApi.rename(id, name.trim()))} disabled={!isAdmin || name.trim().length < 2} loading={action.isPending}><Save className="h-4 w-4" /></Button></div></div>
    <div className="mt-5 rounded-3xl border bg-gloopy-surface p-6"><h2 className="font-display text-xl font-semibold">Participantes</h2>{isAdmin ? <><div className="relative mt-4"><UserPlus className="absolute left-3 top-3 h-5 w-5 text-gloopy-muted" /><Input value={search} onChange={(event) => setSearch(event.target.value)} className="pl-10" placeholder="Adicionar por nome ou e-mail" /></div>{users.data?.map((user) => <button key={user.id} onClick={() => action.mutate(() => conversationsApi.addParticipant(id, user.id))} className="mt-2 flex w-full items-center gap-3 rounded-xl border p-3 text-left hover:border-gloopy-primary"><Avatar name={user.name} src={user.avatarUrl} className="h-9 w-9" /><span>{user.name}</span><UserPlus className="ml-auto h-4 w-4" /></button>)}</> : null}
      <div className="mt-4 space-y-2">{conversation.participants.map((participant) => <div key={participant.userId} className="flex items-center gap-3 rounded-xl bg-gloopy-bg-dark p-3"><Avatar name={participant.userId === currentUser?.id ? currentUser.name : participant.userId.slice(0, 6)} className="h-9 w-9" /><span className="min-w-0 flex-1 truncate text-sm">{participant.userId === currentUser?.id ? `${currentUser.name} (você)` : participant.userId}</span>{participant.role === 'ADMIN' ? <Crown className="h-4 w-4 text-gloopy-accent" aria-label="Administrador" /> : null}{isAdmin && participant.userId !== currentUser?.id ? <><button onClick={() => action.mutate(() => participant.role === 'ADMIN' ? conversationsApi.demote(id, participant.userId) : conversationsApi.promote(id, participant.userId))} className="rounded-lg p-2 hover:bg-white/10" aria-label={participant.role === 'ADMIN' ? 'Rebaixar' : 'Promover'}><Crown className="h-4 w-4" /></button><button onClick={() => action.mutate(() => conversationsApi.removeParticipant(id, participant.userId))} className="rounded-lg p-2 text-gloopy-danger hover:bg-white/10" aria-label="Remover"><Trash2 className="h-4 w-4" /></button></> : null}</div>)}</div>
    </div>{feedback ? <p role="status" className="mt-4 text-sm text-gloopy-muted">{feedback}</p> : null}<Button variant="ghost" className="mt-5 w-full text-gloopy-danger" onClick={() => action.mutate(async () => { await conversationsApi.leave(id); navigate('/conversations'); })}><LogOut className="h-4 w-4" />Sair do grupo</Button>
  </section>;
}
