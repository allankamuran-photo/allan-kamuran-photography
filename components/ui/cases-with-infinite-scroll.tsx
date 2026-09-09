'use client';
import { useEffect, useState } from 'react';
import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { categories, categoryPhotos } from '@/lib/gallery';

const collections = categories.map(category => categoryPhotos(category.slug));
const photographs = Array.from({length: Math.max(...collections.map(items => items.length))}, (_, index) => collections.flatMap(items => items[index] ? [items[index]] : [])).flat();

export function Case() {
  const [api, setApi] = useState<CarouselApi>();
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(preference.matches);
    update(); preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (!api || paused || interacting || reduced) return;
    const timer = window.setInterval(() => { if (!document.hidden) api.scrollNext(); }, 2400);
    return () => window.clearInterval(timer);
  }, [api, paused, interacting, reduced]);
  return <section className="photo-loop" aria-label="Photographs from every collection" onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)} onFocusCapture={() => setInteracting(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false); }}>
    <Carousel setApi={setApi} opts={{loop:true, align:'start', duration:60}} aria-label="All portfolio photographs">
      <CarouselContent>{photographs.map((photo, index) => <CarouselItem key={photo.id} className="photo-loop-item"><a href={'/work/'+photo.category} aria-label={'Explore '+categories.find(category => category.slug===photo.category)?.name}><img src={photo.src} alt={photo.alt} loading={index<6?'eager':'lazy'} draggable={false}/></a></CarouselItem>)}</CarouselContent>
    </Carousel>
    <div className="photo-loop-controls"><button onClick={() => api?.scrollPrev()} aria-label="Previous photos">←</button><span>Moments from every collection</span>{!reduced && <button onClick={() => setPaused(value => !value)} aria-pressed={paused}>{paused?'Play':'Pause'}</button>}<button onClick={() => api?.scrollNext()} aria-label="Next photos">→</button></div>
  </section>;
}
