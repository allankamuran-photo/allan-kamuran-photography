import { notFound } from 'next/navigation';
import {categories,categoryPhotos} from '@/lib/gallery';
import {CategoryGallery} from '@/components/gallery/category-gallery';
export function generateStaticParams(){return categories.map(c=>({category:c.slug}));}
export async function generateMetadata({params}:{params:Promise<{category:string}>}){const {category}=await params;return {title:`${categories.find(c=>c.slug===category)?.name??'Work'} — Allan Kamuran`};}
export default async function GalleryPage({params}:{params:Promise<{category:string}>}){const {category}=await params;const current=categories.find(c=>c.slug===category);if(!current)notFound();return <CategoryGallery category={current} photos={categoryPhotos(current.slug)}/>}
