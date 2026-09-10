import type {Metadata} from 'next';
import {InternalGlobe} from '@/components/internal-globe';
export const metadata:Metadata={title:'Shop — Allan Kamuran'};
export default function Shop(){return <main id="main-content" className="info-page shop-page"><section className="info-heading"><InternalGlobe/><p className="eyebrow">ALLAN KAMURAN / SHOP</p><h1>Coming <em>soon.</em></h1><div className="shop-mark" aria-hidden="true">✦</div><p className="info-lead">Something to look forward to.</p><a className="text-link" href="/work">Explore the photographs ↗</a></section><section className="shop-future"><p className="eyebrow">THE FUTURE SHOP</p><h2>Photographic <em>prints.</em></h2><p>A selection of my photographs will become available as physical prints in the future.</p></section></main>}
