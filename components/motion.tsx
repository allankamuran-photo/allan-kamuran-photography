'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
export function Motion(){const path=usePathname();useEffect(()=>{const media=window.matchMedia('(prefers-reduced-motion: reduce)');if(media.matches)return;const elements=document.querySelectorAll<HTMLElement>('.photo, .about p, .info-split, .price-row, .social-grid figure, .instagram-showcase, .price-note');const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('revealed');observer.unobserve(entry.target)}},{threshold:0.08});elements.forEach(el=>{el.classList.add('reveal');observer.observe(el)});return()=>{observer.disconnect();elements.forEach(el=>el.classList.remove('reveal','revealed'))}},[path]);return null}
