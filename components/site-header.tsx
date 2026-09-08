'use client';
import { usePathname } from 'next/navigation';
const links = [{href:'/work',label:'Work'},{href:'/prices',label:'Prices'},{href:'/instagram',label:'Instagram'},{href:'/shop',label:'Shop'},{href:'/contact',label:'Contact'}];
export function SiteNav({home=false}:{home?:boolean}){const pathname=usePathname();return <nav className={home?'home-navigation':'page-navigation'} aria-label="Main navigation">{links.map((link,i)=><a href={link.href} key={link.href} aria-current={(pathname===link.href||link.href==='/work'&&pathname.startsWith('/work/'))?'page':undefined}><span className="nav-number">0{i+1}</span>{link.label}</a>)}</nav>}
export function SiteHeader(){const pathname=usePathname();return <><a className="skip-link" href="#main-content">Skip to content</a><header className={`site-header centered-brand ${pathname==='/'?'home-header':''}`}><a className="wordmark" href="/">AK<span className="brand-star" aria-hidden="true">✦</span></a>{pathname!=='/'&&<SiteNav/>}</header></>}
