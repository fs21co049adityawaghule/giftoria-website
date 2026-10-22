# GIFTORIA — Customized Gifts Made With Emotions

A premium, fully functional, mobile-first ecommerce platform for customized gifting, 3D printing, DTF printing, sublimation printing, and photo frames.

## Tech Stack
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Router**: Wouter
- **Bundler**: Vite

## Features
- 23 full page routes
- 5 service categories with 27+ products
- Custom message + 1 MB photo upload validation on every product
- Live cart, wishlist, search, filter, and sort
- Checkout with order tracking & status timeline
- Admin product management dashboard
- Responsive mobile-first design with sticky bottom navigation
- Floating WhatsApp CTA button

## Setup & Run Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open in browser
http://localhost:3000
```

## Production Build
```bash
npm run build
```

## Configuration
Update `src/config/businessConfig.ts` to set your:
- WhatsApp number
- Email address
- Instagram URL

## Deployment
Deploy the `dist/` folder to **Vercel**, **Netlify**, or **Cloudflare Pages**:
- Build command: `npm run build`
- Output directory: `dist`
