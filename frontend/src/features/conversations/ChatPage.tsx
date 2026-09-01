import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, CheckCheck, Gamepad2, ImagePlus, MoreVertical, Pencil, Send, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { apiErrorMessage } from '../../shared/api/client';
import { conversationsApi, gamesApi, mediaApi } from '../../shared/api/services';
import { getSocket } from '../../shared/api/socket';
import type { Message } from '../../shared/api/types';
import { AsyncState } from '../../shared/ui/AsyncState';
import { Avatar } from '../../shared/ui/Avatar';
import { Button } from '../../shared/ui/Button';
import { useAuthStore } from '../auth/auth-store';
import { GameInviteCard } from '../games/GameInviteCard';

export function ChatPage() {
  const { id = '' } = useParams();
  const user = useAuthStore((state) => state.user);
  const client = useQueryClient();
  const fileInput = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState('');
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState('');
  const query = useQuery({ queryKey: ['messages', id], queryFn: () => conversationsApi.messages(id), enabled: Boolean(id) });
  const conversations = useQuery({ queryKey: ['conversations'], queryFn: conversationsApi.list });
  const conversation = conversations.data?.find((item) => item.id === id);
  const opponentId = conversation?.participants.find((participant) => participant.userId !== user?.id)?.userId;
  const refresh = useCallback(() => { client.invalidateQueries({ queryKey: ['messages', id] }); client.invalidateQueries({ queryKey: ['conversations'] }); }, [client, id]);
  const send = useMutation({ mutationFn: () => conversationsApi.send(id, content.trim()), onSuccess: () => { setContent(''); getSocket()?.emit('typing:stop', { conversationId: id }); refresh(); }, onError: (requestError) => setError(apiErrorMessage(requestError)) });
  const upload = useMutation({ mutationFn: async (file: File) => mediaApi.send(id, (await mediaApi.upload(file)).id), onSuccess: refresh, onError: (requestError) => setError(apiErrorMessage(requestError, 'Não foi possível enviar o arquivo.')) });
  const invite = useMutation({ mutationFn: () => gamesApi.invite(id, opponentId!), onSuccess: refresh, onError: (requestError) => setError(apiErrorMessage(requestError, 'Não foi possível criar a partida.')) });

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const onTyping = (event: { conversationId: string; userId: string; isTyping: boolean }) => { if (event.conversationId === id && event.userId !== user?.id) setTyping(event.isTyping); };
    socket.connect(); socket.emit('conversation:join', { conversationId: id });
    socket.on('message:created', refresh); socket.on('message:updated', refresh); socket.on('message:deleted', refresh); socket.on('game:updated', refresh); socket.on('typing:update', onTyping);
    return () => { socket.emit('conversation:leave', { conversationId: id }); socket.off('message:created', refresh); socket.off('message:updated', refresh); socket.off('message:deleted', refresh); socket.off('game:updated', refresh); socket.off('typing:update', onTyping); };
  }, [id, refresh, user?.id]);
  useEffect(() => { const last = query.data?.at(-1); if (last && last.senderId !== user?.id) conversationsApi.read(last.id).catch(() => undefined); }, [query.data, user?.id]);

  function submit(event: FormEvent) { event.preventDefault(); if (content.trim()) send.mutate(); }
  if (query.isLoading) return <AsyncState kind="loading" description="Abrindo a conversa." />;
  if (query.isError) return <AsyncState kind="error" onRetry={() => query.refetch()} description="Não conseguimos buscar as mensagens." />;
  return <section className="flex h-[calc(100dvh-4rem)] flex-col md:h-dvh">
    <header className="flex items-center gap-3 border-b bg-gloopy-surface px-3 py-3 sm:px-5"><Link to="/conversations" className="grid h-11 w-11 place-items-center rounded-xl hover:bg-white/10" aria-label="Voltar"><ArrowLeft /></Link><Avatar name={conversation?.name ?? 'Papo'} src={conversation?.avatarUrl} /><div className="min-w-0 flex-1"><h1 className="truncate font-display text-lg font-semibold">{conversation?.name ?? (conversation?.type === 'GROUP' ? 'Grupo' : 'Conversa')}</h1><p className="text-xs text-gloopy-status-online">{typing ? 'digitando…' : 'online'}</p></div>{conversation?.type === 'GROUP' ? <Link to={`/conversations/${id}/settings`} className="grid h-11 w-11 place-items-center rounded-xl hover:bg-white/10" aria-label="Configurações do grupo"><MoreVertical /></Link> : null}</header>
    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">{query.data?.length === 0 ? <AsyncState kind="empty" title="Que tal quebrar o gelo?" description="Mande uma mensagem ou convide para uma partida." /> : <div className="mx-auto flex max-w-3xl flex-col gap-3">{query.data?.map((message) => <MessageBubble key={message.id} message={message} mine={message.senderId === user?.id} onChanged={refresh} />)}</div>}</div>
    <form onSubmit={submit} className="border-t bg-gloopy-surface p-3 sm:p-4"><div className="mx-auto flex max-w-3xl items-end gap-2"><input ref={fileInput} type="file" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) upload.mutate(file); event.target.value = ''; }} /><button type="button" onClick={() => fileInput.current?.click()} disabled={upload.isPending} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-gloopy-muted hover:bg-white/10 disabled:opacity-50" aria-label="Anexar mídia"><ImagePlus /></button><button type="button" onClick={() => invite.mutate()} disabled={!opponentId || invite.isPending} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-gloopy-muted hover:bg-white/10 disabled:opacity-50" aria-label="Convidar para jogar"><Gamepad2 /></button><label className="sr-only" htmlFor="message">Mensagem</label><textarea id="message" rows={1} value={content} onChange={(event) => { const value = event.target.value; setContent(value); getSocket()?.emit(value ? 'typing:start' : 'typing:stop', { conversationId: id }); }} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); if (content.trim()) send.mutate(); } }} className="max-h-32 min-h-11 flex-1 resize-none rounded-xl border bg-gloopy-bg-dark px-4 py-3" placeholder="Escreva uma mensagem" /><Button type="submit" loading={send.isPending} disabled={!content.trim()} className="h-11 w-11 shrink-0 px-0" aria-label="Enviar"><Send className="h-5 w-5" /></Button></div>{error ? <p role="alert" className="mx-auto mt-2 max-w-3xl text-xs text-gloopy-danger">{error}</p> : null}</form>
  </section>;
}

function MessageBubble({ message, mine, onChanged }: { message: Message; mine: boolean; onChanged: () => void }) {
  const [editing, setEditing] = useState(false); const [draft, setDraft] = useState(message.content ?? ''); const [error, setError] = useState('');
  const canEdit = mine && message.type === 'TEXT' && Date.now() - new Date(message.createdAt).getTime() <= 15 * 60 * 1000;
  const edit = useMutation({ mutationFn: () => conversationsApi.edit(message.id, draft.trim()), onSuccess: () => { setEditing(false); onChanged(); }, onError: (requestError) => setError(apiErrorMessage(requestError)) });
  const remove = useMutation({ mutationFn: (scope: 'ME' | 'EVERYONE') => conversationsApi.remove(message.id, scope), onSuccess: onChanged, onError: (requestError) => setError(apiErrorMessage(requestError)) });
  if (message.type === 'GAME_INVITE' && message.gameSessionId) return <GameInviteCard sessionId={message.gameSessionId} />;
  if (message.type === 'SYSTEM') return <p className="my-2 text-center text-xs text-gloopy-muted">{message.content}</p>;
  return <article className={`group relative max-w-[82%] rounded-2xl px-4 py-3 ${mine ? 'ml-auto rounded-br-md bg-gloopy-primary' : 'rounded-bl-md bg-gloopy-surface'}`}>
    {mine ? <DropdownMenu><DropdownMenuTrigger className="absolute -left-9 top-1 grid h-8 w-8 place-items-center rounded-lg opacity-0 hover:bg-white/10 group-focus-within:opacity-100 group-hover:opacity-100" aria-label="Ações da mensagem"><MoreVertical className="h-4 w-4" /></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem disabled={!canEdit} onSelect={() => setEditing(true)}><Pencil className="h-4 w-4" />Editar</DropdownMenuItem><DropdownMenuItem onSelect={() => remove.mutate('ME')}><Trash2 className="h-4 w-4" />Apagar para mim</DropdownMenuItem><DropdownMenuItem onSelect={() => remove.mutate('EVERYONE')} className="text-gloopy-danger"><Trash2 className="h-4 w-4" />Apagar para todos</DropdownMenuItem></DropdownMenuContent></DropdownMenu> : null}
    {message.media ? message.media.kind === 'IMAGE' ? <a href={message.media.url} target="_blank" rel="noreferrer"><img src={message.media.url} alt={message.media.fileName} className="mb-2 max-h-72 rounded-xl object-cover" /></a> : <a href={message.media.url} target="_blank" rel="noreferrer" className="mb-2 block font-semibold text-gloopy-accent">{message.media.fileName}</a> : null}
    {editing ? <form onSubmit={(event) => { event.preventDefault(); if (draft.trim()) edit.mutate(); }}><textarea autoFocus value={draft} onChange={(event) => setDraft(event.target.value)} className="min-h-20 w-full rounded-lg bg-gloopy-bg-dark p-2 text-sm" /><div className="mt-2 flex gap-2"><button className="text-xs font-bold" disabled={edit.isPending}>Salvar</button><button type="button" onClick={() => setEditing(false)} className="text-xs">Cancelar</button></div></form> : <p className="whitespace-pre-wrap break-words text-sm">{message.content ?? 'Mensagem removida'}</p>}
    {error ? <p role="alert" className="mt-1 text-xs text-gloopy-danger">{error}</p> : null}<div className="mt-1 flex justify-end gap-2 text-[10px] text-white/60"><time>{new Date(message.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</time>{message.editedAt ? <span>editada</span> : null}{mine ? <CheckCheck className={`h-3 w-3 ${message.readAt ? 'text-gloopy-accent' : ''}`} /> : null}</div>
  </article>;
}
