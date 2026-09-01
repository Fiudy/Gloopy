import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export function SplashScreen() {
  const root = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(() => sessionStorage.getItem('gloopy_splash_seen') !== '1');
  useLayoutEffect(() => {
    if (!visible || !root.current) return;
    const context = gsap.context(() => {
      const timeline = gsap.timeline({ onComplete: () => { sessionStorage.setItem('gloopy_splash_seen', '1'); setVisible(false); } });
      timeline.from('[data-splash-mark]', { scale: .55, rotate: -10, opacity: 0, duration: .65, ease: 'back.out(1.8)' })
        .from('[data-splash-word] span', { yPercent: 120, duration: .55, stagger: .06, ease: 'power4.out' }, '-=.25')
        .to('[data-splash-line]', { scaleX: 1, duration: .55, ease: 'power3.inOut' }, '-=.35')
        .to(root.current, { yPercent: -100, duration: .8, delay: .25, ease: 'power4.inOut' });
    }, root);
    return () => context.revert();
  }, [visible]);
  if (!visible) return null;
  return <div ref={root} className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-gloopy-accent text-gloopy-bg-dark" aria-label="Carregando Gloopy">
    <div className="relative text-center"><img data-splash-mark src="/mascot/gloopy-cool-icon.png" alt="" className="mx-auto h-24 w-24 rounded-[2rem] shadow-card" /><div data-splash-word className="mt-5 overflow-hidden font-display text-6xl font-bold tracking-tight">{'GLOOPY'.split('').map((letter, index) => <span key={`${letter}-${index}`} className="inline-block">{letter}</span>)}</div><div data-splash-line className="mx-auto mt-5 h-1 w-36 origin-left scale-x-0 rounded-full bg-gloopy-bg-dark" /><p className="mt-4 text-xs font-bold uppercase tracking-[.28em]">Papo bom não para</p></div>
  </div>;
}
