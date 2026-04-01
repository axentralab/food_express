# FoodExpress - Premium Food Delivery Web App

A production-ready food delivery platform built with Next.js 16, React 19, Framer Motion, and TypeScript. Features sophisticated animations, a modular architecture, and scalable design.

🔗 **Live Demo**: [Food_Express](https://food-xpress-gules.vercel.app)  
## Quick Start

### Installation
```bash
# Clone or download the project
cd foodexpress

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` in your browser.


## Project Status

**Current Phase**: MVP (Minimum Viable Product) ✅
- Beautiful, animated landing page
- Restaurant browsing & filtering
- Shopping cart with global state management
- Responsive design (mobile-first)

**Upcoming Phases**:
- Phase 1: User Authentication
- Phase 2: Order Management
- Phase 3: Payment Integration (Stripe)
- Phase 4: Real-time Tracking
- Phase 5+: Admin Dashboard, Reviews, etc.

## Key Features

✨ **Premium Animations**
- Physics-based spring animations with Framer Motion
- Staggered entrance effects
- Hover interactions with scale and lift effects
- Scroll-triggered animations

🎨 **Modern Design**
- Glassmorphism UI components
- FoodExpress brand colors (Pink #E21B70, Amber #FFB100)
- Responsive grid layouts (1-4 columns)
- Dark mode support

⚡ **Performance**
- Next.js Image optimization
- Lazy-loaded animations
- Fast builds with Turbopack
- Zero-runtime CSS with Tailwind

🛒 **Functional Cart System**
- Global state with React Context
- Add/remove/update items
- Real-time total calculation
- Smooth animations on interactions

📱 **Mobile Optimized**
- Mobile-first responsive design
- Touch-friendly button sizes (48px+)
- Optimized for iOS Safari and Chrome

## Folder Structure

```
├── app/                    # Next.js pages & layout
├── features/              # Feature-based components
├── components/ui/         # Reusable UI components (shadcn/ui)
├── lib/                   # Utilities, animations, constants
├── data/                  # Mock data (replace with API)
├── hooks/                 # Custom React hooks
├── public/                # Static assets
└── [docs]                 # README
```


## Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 |
| UI Library | React 19 |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Components | shadcn/ui (Radix UI) |
| Icons | Lucide React |
| Language | TypeScript |
| Package Manager | npm/pnpm |

## Environment Setup

### Required Variables (None for local dev)

### Future Phases (see ROADMAP.md)
```env
NEXT_PUBLIC_STRIPE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_API_URL=...
SUPABASE_URL=...
SUPABASE_KEY=...
```

## Development Commands

```bash
npm run dev
npm run build       
npm start            
    
```

## First Steps to Customize

1. **Colors**: Edit CSS variables in `app/globals.css`
   ```css
   --primary: #E21B70;      /* Change primary color */
   --secondary: #FFB100;    /* Change secondary color */
   ```

2. **Content**: Edit mock data in `data/mock-data.ts`
   ```typescript
   export const restaurants = [/* your restaurants */]
   ```

3. **Images**: Replace placeholders in `public/`
   - Update restaurant images
   - Update logos and icons

4. **Text**: Update copy in feature components
   - `features/navbar/navbar.tsx` - Header text
   - `features/hero/hero-section.tsx` - Hero copy
   - `app/page.tsx` - Page text



## Cleanup Boilerplate

The default Next.js setup includes ~35 unused UI components. Safe to delete:

```bash
rm components/ui/{accordion,alert-dialog,aspect-ratio,...}.tsx
```

See [CLEANUP_GUIDE.md](./CLEANUP_GUIDE.md) for complete list and commands.

## Making Changes

### Adding a New Feature
1. Create folder in `features/new-feature/`
2. Create component: `new-feature.tsx`
3. Import in `app/page.tsx`
4. Update `lib/animations.ts` if needed for animations

### Modifying Styles
1. Edit component classes (Tailwind CSS)
2. Or add custom CSS in `app/globals.css`
3. Or update color variables for brand-wide changes

### Replacing Mock Data with Real API
1. Create `lib/api.ts` with fetch functions
2. Update `app/page.tsx` to use API instead of mock data
3. Add error handling and loading states
4. See [ROADMAP.md](./ROADMAP.md) for detailed examples

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android)

## Performance

Current Lighthouse scores (target):
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 100+

## Troubleshooting

**App won't start?**
- Delete `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node version: `node --version` (need 18+)

**Animations not showing?**
- Ensure Framer Motion is installed: `npm install framer-motion`
- Check browser DevTools console for errors

**Build errors?**
- Check TypeScript: `npx tsc --noEmit`
- Clear cache: `rm -rf .next`
- Rebuild: `npm run build`

## Support & Resources

- **Next.js Docs**: https://nextjs.org
- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **Framer Motion**: https://www.framer.com/motion
- **shadcn/ui**: https://ui.shadcn.com

## Architecture Decisions

### Why React Context for Cart?
- Simple for MVP, no external dependencies
- Easy to upgrade to Redux/Zustand later
- Sufficient for small-medium apps

### Why Mock Data?
- Allows development without backend
- Easy to replace with API calls
- Provides realistic data structure



## Future Roadmap

Phase 1: Authentication (Week 1-2)
Phase 2: Order Management (Week 2-3)
Phase 3: Payment Integration (Week 3-4)
Phase 4: Real-time Tracking (Week 4-5)
Phase 5: Favorites & Personalization (Week 5-6)
Phase 6: Search & Advanced Filters (Week 6-7)
Phase 7: Reviews & Ratings (Week 7-8)
Phase 8: Admin Dashboard (Week 8-10)
