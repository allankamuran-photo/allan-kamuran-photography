import type { Metadata } from 'next';
import './globals.css';
import {MusicPlayer} from '@/components/music-player';
import { Motion } from '@/components/motion';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
export const metadata: Metadata = {title:'Allan Kamuran — Photography',description:'Weddings, street photography, travel, nature, cars, and people. The photography portfolio of Allan Kamuran.',robots:{index:true,follow:true}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body><Motion/><div id="site-content"><SiteHeader/>{children}<SiteFooter/></div><MusicPlayer/></body></html>}
