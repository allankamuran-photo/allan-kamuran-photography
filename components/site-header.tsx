'use client';
import { usePathname } from 'next/navigation';
const links = [{href:'/#work',label:'Work'},{href:'/prices',label:'Prices'},{href:'/instagram',label:'Instagram'},{href:'/contact',label:'Contact'}];
export function SiteHeader(){const pathname=usePathname();return <><a className="skip-link" href="#main-content">Skip to content</a><header className="site-header"><a className="wordmark" href="/">AK<span className="brand-star" aria-hidden="true">✦</span></a><nav aria-label="Main navigation">{links.map((link,i)=><a href={link.href} key={link.href} aria-current={pathname===link.href.split('#')[0]?'page':undefined}><span className="nav-number">0{i+1}</span>{link.label}</a>)}</nav></header></>}
