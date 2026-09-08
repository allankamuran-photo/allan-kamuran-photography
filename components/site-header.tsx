'use client';
import { usePathname } from 'next/navigation';
const links = [{href:'/',label:'Selected work'},{href:'/prices',label:'Prices'},{href:'/instagram',label:'Instagram'},{href:'/contact',label:'Contact'}];
export function SiteHeader(){const pathname=usePathname();return <><a className="skip-link" href="#main-content">Skip to content</a><header className="site-header"><a className="wordmark" href="/">ALLAN KAMURAN<span>PHOTOGRAPHY</span></a><nav aria-label="Main navigation">{links.map(link=><a href={link.href} key={link.href} aria-current={pathname===link.href?'page':undefined}>{link.label}</a>)}</nav></header></>}
