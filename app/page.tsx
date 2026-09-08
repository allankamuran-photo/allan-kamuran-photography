'use client';
import { useState } from 'react';
import { ArrowUpRight, ArrowDown, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
const photos = [
 {category:'Nature',title:'Quiet, on a grand scale',image:'https://images.unsplash.com/photo-1725988551310-d33a492a6714?auto=format&fit=crop&w=2000&q=85',alt:'A stream running through a dramatic mountain range',credit:'Slava Auchynnikau',source:'https://unsplash.com/photos/usa9zjb7O3Y'},
 {category:'Street',title:'The geometry of everyday',image:'https://images.unsplash.com/photo-1746911779503-f16ee2088257?auto=format&fit=crop&w=1600&q=85',alt:'Repeating concrete forms of a brutalist building',credit:'Chris Johnson',source:'https://unsplash.com/photos/37zoajcSupg'},
 {category:'Weddings',title:'A day to hold onto',image:'https://images.unsplash.com/photo-1708569177091-d93e951adb1d?auto=format&fit=crop&w=1800&q=85',alt:'Bride and groom kissing as they walk down the aisle',credit:'Kari Bjorn Photography',source:'https://unsplash.com/photos/Jzvb59vRVWs'},
 {category:'People',title:'In a different light',image:'https://images.unsplash.com/photo-1495462911434-be47104d70fa?auto=format&fit=crop&w=1600&q=85',alt:'Black and white portrait of a woman wearing a hat with eyes closed',credit:'Luke Braswell',source:'https://unsplash.com/photos/8BxRYuPkzkU'},
];
export default function Home(){
 const [selected,setSelected]=useState<number|null>(null);
 return <><a className="skip-link" href="#work">Skip to photographs</a>
 <header className="site-header"><a className="wordmark" href="#">ALLAN KAMURAN<span>PHOTOGRAPHY</span></a><nav aria-label="Main navigation"><a href="#work">Selected work <span>↗</span></a><a href="#about">About</a></nav></header>
 <main><section className="intro"><div className="eyebrow"><span className="dot"/> WEDDINGS · STREET · NATURE · PEOPLE</div><div className="intro-row"><h1>Life, as <em>it unfolds.</em></h1><a className="explore" href="#work" aria-label="Explore selected photographs"><ArrowDown size={22}/></a></div><div className="intro-bottom"><p>Photographs by Allan Kamuran.</p><span>DESIGN PREVIEW · SAMPLE PHOTOGRAPHY</span></div></section>
 <section className="gallery" id="work" aria-label="Selected photographs">{photos.map((photo,i)=><figure className={'photo photo-'+i} key={photo.image}><button className="photo-button" onClick={()=>setSelected(i)} aria-label={'Enlarge '+photo.alt}><img src={photo.image} alt={photo.alt} loading={i===0?'eager':'lazy'}/><span className="photo-index">0{i+1} / {photo.category.toUpperCase()}</span><span className="photo-open"><Plus size={24}/></span></button><figcaption><div><span>{photo.category}</span><h2>{photo.title}</h2></div><ArrowUpRight size={22}/></figcaption></figure>)}</section>
 <section className="about" id="about"><div className="eyebrow">BEHIND THE CAMERA</div><div><h2>Allan Kamuran.</h2><p>Weddings, passing moments on the street, the natural world, and the people in it. My photography moves between them all.</p><p className="draft-note">Portfolio in progress. The photographs shown here are sample images, not work by Allan Kamuran.</p></div></section>
 </main><footer><a href="#">ALLAN KAMURAN</a><span>Photography</span><a href="#">Back to top ↑</a></footer>
 <Dialog open={selected!==null} onOpenChange={open=>{if(!open)setSelected(null)}}><DialogContent className="photo-dialog">{selected!==null&&<><DialogTitle>{photos[selected].title}</DialogTitle><img src={photos[selected].image} alt={photos[selected].alt}/><DialogDescription>Sample photograph by <a href={photos[selected].source} target="_blank" rel="noreferrer">{photos[selected].credit} / Unsplash</a>. Not work by Allan Kamuran.</DialogDescription></>}</DialogContent></Dialog></>
}
