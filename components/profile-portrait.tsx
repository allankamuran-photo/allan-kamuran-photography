'use client';
import { useEffect, useRef, useState } from 'react';

export default function ProfilePortrait() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setVisible(false);
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setVisible(true); observer.disconnect(); }
    }, { threshold: .15 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className="portrait-reveal" data-visible={visible}><img className="about-portrait" src="/photos/allan-profile.webp" alt="Allan Kamuran standing on a balcony with a mountain landscape behind him" loading="lazy"/></div>;
}
