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
  return <section className="mx-auto max-w-2xl px-5 py-7">
    <p className="text-sm font-bold uppercase tracking-widest text-gloopy-accent">Do seu jeito</p><h1 className="font-display text-4xl font-bold">Perfil e privacidade</h1>
    <div className="mt-6 rounded-3xl border bg-gloopy-surface p-6"><div className="flex items-center gap-4"><Avatar name={user?.name ?? 'Gloopy'} src={user?.avatarUrl} className="h-16 w-16" /><div><h2 className="font-display text-xl font-semibold">{user?.name ?? 'Sua conta'}</h2><p className="text-sm text-gloopy-muted">{user?.email}</p></div></div><div className="mt-6"><Label htmlFor="profile-name">Nome</Label><Input id="profile-name" value={name} onChange={(event) => setName(event.target.value)} minLength={2} maxLength={80} className="mt-2" /></div></div>
    <div className="mt-5 rounded-3xl border bg-gloopy-surface p-6"><h2 className="font-display text-xl font-semibold">Privacidade</h2><Preference icon={Bell} id="last-seen" title="Mostrar visto por último" description="Permite que seus contatos vejam quando você esteve online." value={showLastSeen} onChange={setShowLastSeen} /><Preference icon={CheckCheck} id="receipts" title="Confirmação de leitura" description="Mostra o double-check quando uma mensagem é lida." value={readReceiptsEnabled} onChange={setReadReceiptsEnabled} /></div>
    {feedback ? <Alert className="mt-4" role="status"><AlertDescription>{feedback}</AlertDescription></Alert> : null}
    <Button className="mt-5 w-full" onClick={() => save.mutate()} loading={save.isPending} disabled={name.trim().length < 2}><Save className="h-4 w-4" />Salvar alterações</Button>
    <Button variant="ghost" className="mt-3 w-full text-gloopy-danger" onClick={() => { signOut(); navigate('/login'); }}><LogOut />Sair da conta</Button>
  </section>;
}

function Preference({ icon: Icon, id, title, description, value, onChange }: { icon: typeof Bell; id: string; title: string; description: string; value: boolean; onChange: (value: boolean) => void }) {
  return <div className="mt-5 flex items-center gap-4 rounded-2xl bg-gloopy-bg-dark p-4"><Icon className="h-5 w-5 text-gloopy-primary" /><label htmlFor={id} className="flex-1 cursor-pointer"><strong className="block text-sm">{title}</strong><span className="text-xs text-gloopy-muted">{description}</span></label><Switch id={id} checked={value} onCheckedChange={onChange} aria-label={title} /></div>;
}
