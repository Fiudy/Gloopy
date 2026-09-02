import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Check, Search, Users, X } from 'lucide-react';
import { useDeferredValue, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { apiErrorMessage } from '../../shared/api/client';
import { authApi, conversationsApi } from '../../shared/api/services';
import type { UserSearchResult } from '../../shared/api/types';
import { Avatar } from '../../shared/ui/Avatar';
import { Button } from '../../shared/ui/Button';

export function NewConversationPage() {
  const [mode, setMode] = useState<'direct' | 'group'>('direct');
  const [name, setName] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<UserSearchResult[]>([]);
  const [error, setError] = useState('');
  const deferredSearch = useDeferredValue(search.trim());
  const navigate = useNavigate();
  const client = useQueryClient();
  const users = useQuery({ queryKey: ['users', deferredSearch], queryFn: () => authApi.searchUsers(deferredSearch), enabled: deferredSearch.length >= 2 });
  const mutation = useMutation({
    mutationFn: () => mode === 'direct' ? conversationsApi.createDirect(selected[0].id) : conversationsApi.createGroup(name.trim(), selected.map((user) => user.id)),
    onSuccess: (conversation) => { client.invalidateQueries({ queryKey: ['conversations'] }); navigate(`/conversations/${conversation.id}`); },
    onError: (requestError) => setError(apiErrorMessage(requestError)),
  });
  const choose = (user: UserSearchResult) => {
    setSelected((current) => mode === 'direct' ? [user] : current.some((item) => item.id === user.id) ? current.filter((item) => item.id !== user.id) : [...current, user]);
    if (mode === 'direct') setSearch('');
  };
  const changeMode = (next: 'direct' | 'group') => { setMode(next); setSelected([]); setError(''); };
  return <section className="relative mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
    <div className="pointer-events-none absolute right-0 top-0 -z-10 h-72 w-72 rounded-full bg-gloopy-primary/15 blur-[100px]" />
    <header className="flex items-center gap-3"><Link to="/conversations" className="grid h-11 w-11 place-items-center rounded-xl hover:bg-white/10" aria-label="Voltar"><ArrowLeft /></Link><div><p className="text-sm font-bold uppercase tracking-widest text-gloopy-accent">Novo papo</p><h1 className="font-display text-3xl font-bold">Junte a galera</h1></div></header>
    <div className="mt-8 rounded-[2rem] border border-white/10 bg-gloopy-surface/80 p-5 shadow-[0_30px_90px_rgba(0,0,0,.22)] backdrop-blur-xl sm:p-8">
      <div className="grid grid-cols-2 rounded-2xl bg-gloopy-bg-dark/80 p-1.5" role="tablist"><button role="tab" aria-selected={mode === 'direct'} onClick={() => changeMode('direct')} className={`min-h-12 rounded-xl font-semibold transition ${mode === 'direct' ? 'bg-gloopy-primary text-white shadow-lg' : 'text-gloopy-muted hover:text-white'}`}>Conversa individual</button><button role="tab" aria-selected={mode === 'group'} onClick={() => changeMode('group')} className={`min-h-12 rounded-xl font-semibold transition ${mode === 'group' ? 'bg-gloopy-primary text-white shadow-lg' : 'text-gloopy-muted hover:text-white'}`}>Novo grupo</button></div>
      {mode === 'group' ? <label className="mt-6 block text-sm font-semibold">Nome do grupo<Input value={name} onChange={(event) => setName(event.target.value)} className="mt-2" placeholder="Ex.: Galera do rolê" maxLength={80} /></label> : null}
      <label className="mt-6 block text-sm font-semibold" htmlFor="user-search">Buscar por nome ou e-mail</label><div className="relative mt-2"><Search className="absolute left-3 top-3 h-5 w-5 text-gloopy-muted" /><Input id="user-search" value={search} onChange={(event) => setSearch(event.target.value)} className="pl-10" placeholder="Digite pelo menos 2 caracteres" autoComplete="off" /></div>
      {selected.length ? <div className="mt-3 flex flex-wrap gap-2">{selected.map((user) => <button key={user.id} onClick={() => choose(user)} className="inline-flex items-center gap-2 rounded-full bg-gloopy-primary/15 px-3 py-2 text-sm text-gloopy-primary"><Check className="h-4 w-4" />{user.name}<X className="h-3 w-3" /></button>)}</div> : null}
      {users.isFetching ? <p className="mt-4 text-sm text-gloopy-muted">Buscando pessoas…</p> : null}{users.data?.length === 0 ? <p className="mt-4 text-sm text-gloopy-muted">Nenhuma pessoa encontrada.</p> : null}
      {users.data?.length ? <div className="mt-3 max-h-64 space-y-2 overflow-y-auto">{users.data.map((user) => <button key={user.id} onClick={() => choose(user)} className="flex w-full items-center gap-3 rounded-xl border p-3 text-left transition hover:border-gloopy-primary hover:bg-white/5"><Avatar name={user.name} src={user.avatarUrl} className="h-9 w-9" /><span className="flex-1 font-semibold">{user.name}</span>{selected.some((item) => item.id === user.id) ? <Check className="h-4 w-4 text-gloopy-primary" /> : null}</button>)}</div> : null}
      {users.isError ? <p role="alert" className="mt-4 text-sm text-gloopy-danger">Não foi possível buscar pessoas.</p> : null}{error ? <p role="alert" className="mt-4 text-sm text-gloopy-danger">{error}</p> : null}
      <Button onClick={() => mutation.mutate()} loading={mutation.isPending} disabled={!selected.length || (mode === 'group' && !name.trim())} className="mt-7 w-full"><Users className="h-4 w-4" />{mode === 'group' ? 'Criar grupo' : 'Começar conversa'}</Button>
    </div>
  </section>;
}
