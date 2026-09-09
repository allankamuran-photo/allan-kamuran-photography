import type {Metadata} from 'next';
import {PrintShop} from '@/components/shop/print-shop';
import './shop.css';
export const metadata:Metadata={title:'Shop — Allan Kamuran'};
export default function Shop(){return <main id="main-content" className="shop-page"><PrintShop/></main>}
