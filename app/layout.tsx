import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'Allan Kamuran — Photography',description:'Weddings, street photography, nature, and people. The photography portfolio of Allan Kamuran.',robots:{index:false,follow:false}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}
