'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

type Phase = 'idle' | 'intro' | 'intro-out' | 'cover' | 'uncover';
export function Motion() {
  const path = usePathname();
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('idle');
  const [destination, setDestination] = useState('Works');
  const [progress, setProgress] = useState(0);
  const cursor = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<Phase>('idle');
  const navigationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finishTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingPath = useRef<string | null>(null);
  const pendingHash = useRef('');
  const changePhase = (next: Phase) => { phaseRef.current = next; setPhase(next); };

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    changePhase('intro');
    const start = performance.now();
    let frame = 0;
    const tick = () => {
      if(phaseRef.current !== 'intro') return;
      const fraction = Math.min((performance.now() - start) / 1900, 1);
      setProgress(Math.round(fraction * 100));
      if (fraction < 1) frame = requestAnimationFrame(tick);
      else { changePhase('intro-out'); finishTimer.current = setTimeout(() => changePhase('idle'), 650); }
    };
    frame = requestAnimationFrame(tick);
    const skip = (event: KeyboardEvent) => { if (event.key === 'Escape' && phaseRef.current.startsWith('intro')) { cancelAnimationFrame(frame); if(finishTimer.current) clearTimeout(finishTimer.current); changePhase('idle'); } };
    document.addEventListener('keydown', skip);
    return () => { cancelAnimationFrame(frame); document.removeEventListener('keydown', skip); if(finishTimer.current) clearTimeout(finishTimer.current); };
  }, []);

  useEffect(() => {
    const busy = phase !== 'idle';
    const content = document.getElementById('site-content');
    if (content) content.inert = busy;
    document.documentElement.dataset.motionPhase = phase;
    const previous = document.body.style.overflow;
    if (busy) document.body.style.overflow = 'hidden';
    return () => { if(content) content.inert = false; document.body.style.overflow = previous; };
  }, [phase]);

  useEffect(() => {
    if (pendingPath.current === path) {
      pendingPath.current = null;
      if(pendingHash.current){document.getElementById(pendingHash.current)?.scrollIntoView({behavior:'instant'});pendingHash.current='';}else window.scrollTo({top:0, behavior:'instant'});
      changePhase('uncover');
      if(finishTimer.current) clearTimeout(finishTimer.current);
      finishTimer.current = setTimeout(() => changePhase('idle'), 700);
    }
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const elements = document.querySelectorAll<HTMLElement>('.photo, .about p, .info-split, .price-row, .social-grid figure, .instagram-showcase, .price-note');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if(entry.isIntersecting){entry.target.classList.add('revealed');observer.unobserve(entry.target);} });
    }, {threshold:.08});
    elements.forEach(el => {el.classList.add('reveal');observer.observe(el);});
    return () => {observer.disconnect();elements.forEach(el=>el.classList.remove('reveal','revealed'));};
  }, [path]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if(event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const anchor = (event.target as Element).closest<HTMLAnchorElement>('a[href]');
      if(!anchor || anchor.target === '_blank' || anchor.hasAttribute('download') || anchor.classList.contains('skip-link')) return;
      const url = new URL(anchor.href);
      if(url.origin !== location.origin || !['http:','https:'].includes(url.protocol)) return;
      if(url.pathname === location.pathname && (!url.hash || url.hash === '#')) return;
      const target = url.hash ? document.getElementById(decodeURIComponent(url.hash.slice(1))) : null;
      if(url.pathname === location.pathname && !target) return;
      event.preventDefault();
      if(phaseRef.current !== 'idle') return;
      setDestination(url.hash === '#about' ? 'About' : url.hash === '#work' ? 'Works' : ({'/':'Home','/prices':'Packages','/instagram':'Instagram','/contact':'Contact'}[url.pathname] || 'Portfolio'));
      setProgress(0);
      changePhase('cover');
      const start = performance.now();
      const animateProgress = () => {if(phaseRef.current !== 'cover') return;setProgress(Math.min(100,Math.round((performance.now()-start)/7)));requestAnimationFrame(animateProgress);};
      requestAnimationFrame(animateProgress);
      navigationTimer.current = setTimeout(() => {
        if(url.pathname === location.pathname){
          history.pushState(null,'',url.pathname+url.hash);
          target?.scrollIntoView({behavior:'instant',block:'start'});
          changePhase('uncover');
          finishTimer.current=setTimeout(()=>changePhase('idle'),700);
        } else {
          pendingPath.current=url.pathname;
          pendingHash.current=decodeURIComponent(url.hash.slice(1));
          router.push(url.pathname+url.search+url.hash);
          // Restore access even if a navigation is delayed or fails.
          finishTimer.current=setTimeout(()=>{pendingPath.current=null;changePhase('idle');},4000);
        }
      },760);
    };
    document.addEventListener('click',onClick);
    return () => {document.removeEventListener('click',onClick);if(navigationTimer.current)clearTimeout(navigationTimer.current);};
  }, [router]);

  useEffect(() => {
    const fine=matchMedia('(hover: hover) and (pointer: fine)');
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    if(!fine.matches || reduced.matches) return;
    const move=(event:PointerEvent)=>{
      if(event.pointerType !== 'mouse' || !cursor.current)return;
      cursor.current.style.transform=`translate3d(${event.clientX}px,${event.clientY}px,0)`;
      cursor.current.dataset.visible='true';
      const el=event.target as Element;
      cursor.current.dataset.hover=el.closest('.photo-button,.hero-photo,.hero-illustration')?'photo':el.closest('a,button')?'link':'none';
    };
    const leave=()=>{if(cursor.current)cursor.current.dataset.visible='false';};
    document.addEventListener('pointermove',move,{passive:true});document.addEventListener('pointerleave',leave);
    return()=>{document.removeEventListener('pointermove',move);document.removeEventListener('pointerleave',leave);};
  }, []);

  const intro=phase==='intro'||phase==='intro-out';
  return <>
    {intro&&<div className={`intro-screen ${phase==='intro-out'?'intro-screen-exit':''}`}>
      <div className="intro-signature">AK<span>✦</span></div>
      <div className="intro-scene"><p>Always looking<br/>a little closer.</p><div className="intro-art"><img src="/photographer.png" alt="" fetchPriority="high"/><span className="scene-spark" aria-hidden="true">✦</span></div><p>Life, as<br/>it unfolds.</p></div>
      <div className="intro-status" aria-hidden="true">Loading… <span>{progress}%</span></div>
      <button className="skip-intro" onClick={()=>{if(finishTimer.current)clearTimeout(finishTimer.current);changePhase('idle');}}>Skip intro ↗</button>
    </div>}
    {(phase==='cover'||phase==='uncover')&&<div className={`page-curtain ${phase==='uncover'?'curtain-exit':''}`} aria-hidden="true"><div className="curtain-title"><em>{destination.slice(0,1)}</em>{destination.slice(1)}</div><span className="curtain-status">Loading — <em>{progress}%</em></span></div>}
    <div className="motion-cursor" ref={cursor} aria-hidden="true"><span className="cursor-dot"/><span className="cursor-view">View ↗</span><span className="cursor-loading">Loading — <em>{progress}%</em></span></div>
    <span className="sr-only" role="status">{phase==='cover' ? `Opening ${destination}` : phase==='intro' ? 'Opening portfolio' : ''}</span>
  </>;
}
