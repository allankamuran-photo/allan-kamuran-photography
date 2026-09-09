'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { printProducts, printSizes } from '@/lib/shop';

type CartItem = { productId: string; sizeId: string; quantity: number };
const money = new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK', maximumFractionDigits: 0 });

export function PrintShop() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<Record<string,string>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try { setCart(JSON.parse(localStorage.getItem('ak-print-cart') || '[]')); } catch { setCart([]); }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem('ak-print-cart', JSON.stringify(cart)); }, [cart, ready]);

  const detailed = useMemo(() => cart.flatMap(item => {
    const product = printProducts.find(entry => entry.id === item.productId);
    const size = printSizes.find(entry => entry.id === item.sizeId);
    return product && size ? [{ ...item, product, size }] : [];
  }), [cart]);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = detailed.reduce((sum, item) => sum + item.size.price * item.quantity, 0);

  const add = (productId: string) => {
    const sizeId = selectedSizes[productId] || printSizes[0].id;
    setCart(items => {
      const existing = items.find(item => item.productId === productId && item.sizeId === sizeId);
      return existing ? items.map(item => item === existing ? { ...item, quantity: item.quantity + 1 } : item) : [...items, { productId, sizeId, quantity: 1 }];
    });
    setCartOpen(true);
  };
  const changeQuantity = (productId: string, sizeId: string, amount: number) => setCart(items => items.flatMap(item => {
    if (item.productId !== productId || item.sizeId !== sizeId) return [item];
    const quantity = item.quantity + amount;
    return quantity > 0 ? [{ ...item, quantity }] : [];
  }));
  const checkout = () => {
    const lines = detailed.map(item => `${item.quantity} × ${item.product.title} — ${item.size.label} — ${money.format(item.size.price * item.quantity)}`);
    const body = ['Hello Allan,', '', 'I would like to order these prints:', '', ...lines, '', `Subtotal: ${money.format(subtotal)}`, '', 'My name:', 'Delivery address:', 'Telephone:', '', 'Please confirm shipping and payment details.'].join('\n');
    window.location.href = `mailto:allan.kamuran@gmail.com?subject=${encodeURIComponent('Print order request')}&body=${encodeURIComponent(body)}`;
  };

  return <>
    <section className="shop-intro">
      <div><p className="eyebrow">ALLAN KAMURAN / PRINT SHOP</p><h1>Photographs,<br/><em>made tangible.</em></h1></div>
      <div className="shop-intro-copy"><p>Five photographs from the archive, printed to order on archival photographic paper. Each print is unframed and signed.</p><button className="cart-button" type="button" onClick={() => setCartOpen(true)}><ShoppingBag size={19}/><span>Cart</span><b>{itemCount}</b></button></div>
    </section>

    <section className="print-grid" aria-label="Prints for sale">{printProducts.map((product, index) => {
      const sizeId = selectedSizes[product.id] || printSizes[0].id;
      const size = printSizes.find(entry => entry.id === sizeId)!;
      return <article className="print-product" key={product.id}>
        <a className="print-image" href={product.full} target="_blank" rel="noreferrer" aria-label={`View ${product.title} photograph`}><img src={product.image} alt={product.title} loading={index < 2 ? 'eager' : 'lazy'}/><span>View print <ArrowUpRight size={16}/></span></a>
        <div className="print-details"><div><span className="eyebrow">PRINT 0{index + 1}</span><h2>{product.title}</h2><p>{product.place}</p></div><strong>{money.format(size.price)}</strong></div>
        <label className="size-select"><span>Print size</span><select value={sizeId} onChange={event => setSelectedSizes(values => ({...values, [product.id]: event.target.value}))}>{printSizes.map(option => <option value={option.id} key={option.id}>{option.label} — {money.format(option.price)}</option>)}</select></label>
        <button className="add-to-cart" type="button" onClick={() => add(product.id)}>Add to cart <Plus size={17}/></button>
      </article>;
    })}</section>

    <section className="print-notes"><div><span className="eyebrow">THE PRINT</span><p>Archival photographic paper with a soft lustre finish. Colours may vary slightly from the screen.</p></div><div><span className="eyebrow">FULFILMENT</span><p>Printed to order. Allow 7–14 days before dispatch. Shipping is confirmed with your order.</p></div><div><span className="eyebrow">PAYMENT</span><p>Orders are confirmed personally by email. You will receive payment and delivery details before production begins.</p></div></section>

    <Sheet open={cartOpen} onOpenChange={setCartOpen}><SheetContent className="shop-cart" aria-describedby="cart-description"><SheetHeader><SheetTitle>Your cart <span>{itemCount}</span></SheetTitle><SheetDescription id="cart-description">Signed photographic prints by Allan Kamuran.</SheetDescription></SheetHeader>
      <div className="cart-items">{detailed.length === 0 ? <div className="empty-cart"><ShoppingBag size={32}/><p>Your cart is empty.</p><button type="button" onClick={() => setCartOpen(false)}>Continue browsing</button></div> : detailed.map(item => <article className="cart-item" key={`${item.productId}-${item.sizeId}`}><img src={item.product.image} alt=""/><div><h3>{item.product.title}</h3><p>{item.size.label}</p><div className="quantity"><button type="button" onClick={() => changeQuantity(item.productId,item.sizeId,-1)} aria-label={`Remove one ${item.product.title}`}><Minus size={14}/></button><span>{item.quantity}</span><button type="button" onClick={() => changeQuantity(item.productId,item.sizeId,1)} aria-label={`Add one ${item.product.title}`}><Plus size={14}/></button></div></div><div className="cart-item-price"><strong>{money.format(item.size.price * item.quantity)}</strong><button type="button" onClick={() => setCart(items => items.filter(entry => entry.productId !== item.productId || entry.sizeId !== item.sizeId))} aria-label={`Remove ${item.product.title} from cart`}><Trash2 size={15}/></button></div></article>)}</div>
      {detailed.length > 0 && <SheetFooter><div className="cart-total"><span>Subtotal</span><strong>{money.format(subtotal)}</strong></div><p>Shipping is confirmed before payment.</p><button className="checkout-button" type="button" onClick={checkout}>Request order by email <ArrowUpRight size={18}/></button></SheetFooter>}
    </SheetContent></Sheet>
  </>;
}
