# Publish Allan Kamuran Photography

This project is prepared as a static Vinext/Vite site for GitHub and Vercel. The custom Vercel build is selected automatically and exports every page as HTML.

## Before pushing

Install Node.js 22 or later and pnpm. From the project folder, run:

```bash
pnpm install
pnpm build:vercel
```

The production website is generated in `dist/client`.

## Updating photographs

Add or remove original photographs in the matching folder under `Images`:

- `Travel`
- `Street photography`
- `Weddings`
- `People`
- `Nature`
- `Cars`

Then run:

```bash
python3 -m pip install Pillow
python3 scripts/import_photos.py
pnpm build:vercel
```

Commit the changed `lib/gallery-originals.json` and `public/photos` files. Vercel will deploy them after the commit is pushed to GitHub. The original `Images` and `Music` folders are intentionally excluded from Git because the optimized web photos and music track are already included under `public`.

## Vercel settings

The included `vercel.json` supplies the build command and output directory. Use pnpm and Node.js 22.x in Vercel.
