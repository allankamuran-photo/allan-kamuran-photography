export const printSizes = [
  { id: 'a4', label: 'A4 · 21 × 29.7 cm', price: 595 },
  { id: 'a3', label: 'A3 · 29.7 × 42 cm', price: 895 },
  { id: '50x70', label: '50 × 70 cm', price: 1295 },
] as const;

export const printProducts = [
  { id: 'gothic-heights', title: 'Gothic Heights', place: 'Travel / 2026', image: '/photos/7ea5a4f9e72c44d1-thumb.webp', full: '/photos/7ea5a4f9e72c44d1-full.webp' },
  { id: 'still-water', title: 'Still Water', place: 'Travel / 2026', image: '/photos/2c0e839df2facda6-thumb.webp', full: '/photos/2c0e839df2facda6-full.webp' },
  { id: 'last-light', title: 'Last Light', place: 'Nature / 2026', image: '/photos/70018ea29286cd8c-thumb.webp', full: '/photos/70018ea29286cd8c-full.webp' },
  { id: 'forest-light', title: 'Forest Light', place: 'Nature / 2023', image: '/photos/c576e4962dbe21e1-thumb.webp', full: '/photos/c576e4962dbe21e1-full.webp' },
  { id: 'red-velocity', title: 'Red Velocity', place: 'Cars / 2024', image: '/photos/d77c69e1a32c90be-thumb.webp', full: '/photos/d77c69e1a32c90be-full.webp' },
] as const;

export type PrintProduct = (typeof printProducts)[number];
export type PrintSize = (typeof printSizes)[number];
