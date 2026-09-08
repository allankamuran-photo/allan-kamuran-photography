import samples from './gallery-samples.json';
import originals from './gallery-originals.json';
export type Photograph = {id:string;category:string;src:string;full?:string;alt:string;credit:string;source?:string;year:number|null;takenAt?:string|null;sample?:boolean};
export const categories = [{slug:'nature',name:'Nature',description:'Out in the world. A little closer to the quiet.'},{slug:'street',name:'Street photography',description:'Everyday life, seen a little differently.'},{slug:'weddings',name:'Weddings',description:'The people, the feeling, and everything in between.'},{slug:'people',name:'People',description:'Faces, stories, and the moments that connect us.'}];
export function sortPhotos(photos:Photograph[]){return [...photos].sort((a,b)=>(b.year??-1)-(a.year??-1)||(b.takenAt??'').localeCompare(a.takenAt??'')||a.id.localeCompare(b.id));}
export function categoryPhotos(category:string):Photograph[]{const own=(originals as Photograph[]).filter(p=>p.category===category);return sortPhotos(own.length?own:(samples as Photograph[]).filter(p=>p.category===category)).slice(0,20);}
export function groupByYear(photos:Photograph[]){const keys=[...new Set(sortPhotos(photos).map(p=>p.year))];return keys.map(year=>({year,photos:sortPhotos(photos.filter(p=>p.year===year))}));}
