import { useMutation, useQuery } from '@tanstack/react-query';
import { Bell, CheckCheck, LogOut, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { apiErrorMessage } from '../../shared/api/client';
import { authApi } from '../../shared/api/services';
import { AsyncState } from '../../shared/ui/AsyncState';
import { Avatar } from '../../shared/ui/Avatar';
import { Button } from '../../shared/ui/Button';
import { useAuthStore } from '../auth/auth-store';

export function ProfilePage() {
  const cachedUser = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const signOut = useAuthStore((state) => state.signOut);
  const navigate = useNavigate();
  const [name, setName] = useState(cachedUser?.name ?? '');
  const [showLastSeen, setShowLastSeen] = useState(cachedUser?.showLastSeen ?? true);
  const [readReceiptsEnabled, setReadReceiptsEnabled] = useState(cachedUser?.readReceiptsEnabled ?? true);
  const [feedback, setFeedback] = useState('');
  const profile = useQuery({ queryKey: ['profile'], queryFn: authApi.me });
  useEffect(() => {
    if (!profile.data) return;
    updateUser(profile.data);
    setName(profile.data.name);
    setShowLastSeen(profile.data.showLastSeen ?? true);
    setReadReceiptsEnabled(profile.data.readReceiptsEnabled ?? true);
  }, [profile.data, updateUser]);
  const save = useMutation({
    mutationFn: () => authApi.update({ name: name.trim(), showLastSeen, readReceiptsEnabled }),
    onSuccess: (user) => { updateUser(user); setFeedback('Preferências salvas.'); },
    onError: (error) => setFeedback(apiErrorMessage(error)),
  });
  if (profile.isLoading && !cachedUser) return <AsyncState kind="loading" description="Carregando seu perfil." />;
  if (profile.isError && !cachedUser) return <AsyncState kind="error" description="Não conseguimos carregar seu perfil." onRetry={() => profile.refetch()} />;
  const user = profile.data ?? cachedUser;
  return <section className="relative mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
    <div className="pointer-events-none absolute right-0 top-0 -z-10 h-80 w-80 rounded-full bg-gloopy-primary/15 blur-[110px]" />
    <p className="text-sm font-bold uppercase tracking-widest text-gloopy-accent">Do seu jeito</p><h1 className="font-display text-4xl font-bold">Perfil e privacidade</h1>
    <div className="mt-7 rounded-[2rem] border border-white/10 bg-gloopy-surface/80 p-6 shadow-[0_30px_90px_rgba(0,0,0,.2)] backdrop-blur-xl sm:p-8"><div className="flex items-center gap-5"><Avatar name={user?.name ?? 'Gloopy'} src={user?.avatarUrl} className="h-20 w-20 ring-4 ring-gloopy-primary/20" /><div className="min-w-0"><h2 className="truncate font-display text-2xl font-semibold">{user?.name ?? 'Sua conta'}</h2><p className="truncate text-sm text-gloopy-muted">{user?.email}</p><span className="mt-2 inline-flex rounded-full bg-gloopy-status-online/10 px-2.5 py-1 text-xs font-semibold text-gloopy-status-online">Conta ativa</span></div></div><div className="mt-7 border-t border-white/10 pt-6"><Label htmlFor="profile-name">Nome exibido</Label><Input id="profile-name" value={name} onChange={(event) => setName(event.target.value)} minLength={2} maxLength={80} className="mt-2" /></div></div>
    <div className="mt-5 rounded-[2rem] border border-white/10 bg-gloopy-surface/80 p-6 backdrop-blur-xl sm:p-8"><p className="text-xs font-bold uppercase tracking-[.18em] text-gloopy-accent">Seus controles</p><h2 className="mt-2 font-display text-2xl font-semibold">Privacidade</h2><Preference icon={Bell} id="last-seen" title="Mostrar visto por último" description="Permite que seus contatos vejam quando você esteve online." value={showLastSeen} onChange={setShowLastSeen} /><Preference icon={CheckCheck} id="receipts" title="Confirmação de leitura" description="Mostra o double-check quando uma mensagem é lida." value={readReceiptsEnabled} onChange={setReadReceiptsEnabled} /></div>
    {feedback ? <Alert className="mt-4" role="status"><AlertDescription>{feedback}</AlertDescription></Alert> : null}
    <Button className="mt-5 w-full" onClick={() => save.mutate()} loading={save.isPending} disabled={name.trim().length < 2}><Save className="h-4 w-4" />Salvar alterações</Button>
    <Button variant="ghost" className="mt-3 w-full text-gloopy-danger" onClick={() => { signOut(); navigate('/login'); }}><LogOut />Sair da conta</Button>
  </section>;
}

function Preference({ icon: Icon, id, title, description, value, onChange }: { icon: typeof Bell; id: string; title: string; description: string; value: boolean; onChange: (value: boolean) => void }) {
  return <div className="mt-4 flex items-center gap-4 rounded-2xl border border-white/[.06] bg-gloopy-bg-dark/70 p-4 transition hover:border-gloopy-primary/30"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gloopy-primary/10"><Icon className="h-5 w-5 text-gloopy-primary" /></span><label htmlFor={id} className="flex-1 cursor-pointer"><strong className="block text-sm">{title}</strong><span className="text-xs leading-5 text-gloopy-muted">{description}</span></label><Switch id={id} checked={value} onCheckedChange={onChange} aria-label={title} /></div>;
}
