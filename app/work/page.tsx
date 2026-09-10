import type { Metadata } from 'next';
import {InternalGlobe} from '@/components/internal-globe';
import {ArrowUpRight} from 'lucide-react';
import {categories,categoryPhotos} from '@/lib/gallery';
export const metadata:Metadata={title:'Work — Allan Kamuran'};
export default function Work(){return <main id="main-content" className="info-page work-index"><section className="info-heading"><InternalGlobe/><p className="eyebrow">SIX WAYS OF SEEING</p><h1>My <em>work.</em></h1><p className="info-lead">Travel, street photography, weddings, people, nature, and cars.</p></section><div className="collection-grid">{categories.map((category,i)=>{const photos=categoryPhotos(category.slug);const cover=photos[category.slug==='cars'?4:['weddings','people'].includes(category.slug)?2:0];return <a className="collection-card" href={'/work/'+category.slug} key={category.slug}>{cover&&<img src={cover.src} alt={cover.alt} loading={i>1?'lazy':'eager'}/>}<div><span className="eyebrow">0{i+1} / {photos.length} PHOTOGRAPHS</span><h2>{category.name}<ArrowUpRight className="collection-arrow" aria-hidden="true"/></h2><p>{category.description}</p></div></a>})}</div></main>}
