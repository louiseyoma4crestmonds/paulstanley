# CelebConnect Design Guidelines

## Design Approach

**Reference-Based Strategy**: Drawing inspiration from premium engagement platforms - Airbnb's trust-building design, Patreon's creator-fan connection patterns, and Shopify's clean e-commerce layouts. This creates a polished, celebrity-worthy experience that balances aspiration with accessibility.

**Core Principle**: Create an exclusive yet welcoming platform that makes fans feel they're accessing something special while maintaining clarity for transactions and progress tracking.

---

## Typography System

**Font Stack**:
- **Primary**: Inter (via Google Fonts) - headings, UI elements, buttons
- **Secondary**: Inter - body text, forms, descriptions
- **Accent**: Playfair Display - celebrity name, hero tagline (serif adds premium feel)

**Hierarchy**:
- H1: text-5xl md:text-7xl, font-bold, tracking-tight (hero headings)
- H2: text-4xl md:text-5xl, font-semibold (section titles)
- H3: text-2xl md:text-3xl, font-semibold (card headers, feature titles)
- H4: text-xl font-medium (subsections)
- Body: text-base leading-relaxed (descriptions, forms)
- Small: text-sm (metadata, helper text)
- Button: text-sm font-semibold tracking-wide uppercase

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **4, 6, 8, 12, 16, 24** for consistent rhythm
- Component padding: p-6 to p-8
- Section spacing: py-16 md:py-24
- Card gaps: gap-6 to gap-8
- Container max-width: max-w-7xl

**Grid Strategy**:
- Desktop: 3-column grids for products/events/causes (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Feature sections: 2-column split layouts
- Mobile: Always stack to single column

---

## Component Library

### Navigation
- **Header**: Sticky top navigation with logo left, nav links center, auth buttons right
- Semi-transparent backdrop with blur effect (backdrop-blur-md bg-white/90)
- Hamburger menu on mobile with slide-in drawer
- Height: h-16 md:h-20

### Hero Section (Landing Page)
- Full-width hero with large celebrity portrait image background
- Height: min-h-[85vh]
- Overlay gradient for text readability
- Celebrity name in Playfair Display (text-6xl md:text-8xl)
- Tagline and mission statement
- Dual CTA buttons (primary "Join Now", secondary "Learn More") with blurred backgrounds

### Cards
- **Product Cards**: Rounded corners (rounded-2xl), image with hover scale effect, price badge, "Add to Cart" button
- **Event Cards**: Countdown timer badge, location pin icon, date prominently displayed, ticket CTA
- **Cause Cards**: Progress bar showing goal completion, donation amount raised, compelling imagery
- **Shadow**: shadow-lg hover:shadow-2xl transition
- **Padding**: p-6

### Progress Visualization (Dashboard)
- **Circular Progress Ring**: Center of dashboard, 200px diameter
- Four quadrant indicators showing completed requirements
- Percentage in center (text-4xl font-bold)
- Checkmark icons for completed steps
- Unlock animation when reaching 100%

### Forms
- Input fields: rounded-lg border-2, focus:ring-2 focus:border-primary
- Floating labels or top-aligned labels
- Helper text below inputs (text-sm)
- Error states with red accent
- Button: Full-width on mobile, auto-width on desktop

### Buttons
- **Primary**: rounded-full px-8 py-3, bold text, hover lift effect (hover:-translate-y-0.5)
- **Secondary**: outlined variant with border-2
- **Icon Buttons**: For cart, profile, etc. - rounded-full p-3
- Implement hover/active states inherently

### Dashboard Sidebar
- Fixed left sidebar on desktop (w-64), slide-out on mobile
- Profile section at top with avatar
- Navigation menu with icons (Heroicons)
- Progress widget integrated
- Logout at bottom

---

## Page-Specific Layouts

### Landing Page
1. **Hero**: Celebrity portrait with overlay text, dual CTAs
2. **Trust Signals**: Logo bar of payment methods, user count
3. **Featured Causes**: 3-column grid, prominent imagery
4. **Upcoming Events**: Horizontal scrollable carousel on mobile, grid on desktop
5. **Products Preview**: Featured products, "Shop All" CTA
6. **Meet & Greet Teaser**: Split layout with image + requirements explanation
7. **Testimonials**: Fan quotes with avatars, 2-column
8. **Footer**: Comprehensive with newsletter signup, social links, quick nav, payment logos

### Products Store
- Filter sidebar (categories, price range)
- Grid layout with infinite scroll or pagination
- Quick view modal on card click
- Floating cart icon with item count badge
- Sort dropdown (price, newest, popular)

### Dashboard
- **Overview Tab**: Progress ring center, 4 requirement cards below, quick actions
- **Profile Tab**: Form with avatar upload, editable fields
- **History Tab**: Transaction table with filters, export button
- **Requests Tab**: Meet & greet / Live call forms with scheduling interface

### Causes Page
- Hero with mission statement
- Grid of cause cards
- Each card: compelling image, goal meter, donate button
- Modal for donation flow with amount selector and payment method tabs

---

## Animations & Interactions
- **Micro-interactions**: Button hover lift, card hover scale (scale-105)
- **Progress Ring**: Animated stroke-dashoffset on load
- **Page Transitions**: Subtle fade-in for route changes
- **Scroll Reveals**: Stagger fade-in for card grids (use Intersection Observer)
- **NO** excessive parallax or distracting effects

---

## Images

### Hero Image
- **Landing Page**: Large, professional celebrity portrait (full-width background)
- High-quality, aspirational photography
- Position: Cover entire hero section with gradient overlay

### Section Images
- **Causes**: Emotive imagery related to each cause (charity work, community impact)
- **Events**: Event venue photos or past event highlights
- **Products**: Professional product photography on clean backgrounds
- **Meet & Greet**: Behind-the-scenes celebrity photos, candid shots with fans
- **About/Bio**: Additional celebrity portraits, lifestyle shots

### Card Images
- **Product Cards**: Square aspect ratio (1:1), 400x400px minimum
- **Event Cards**: 16:9 landscape, venue or promotional imagery
- **Cause Cards**: 4:3 aspect ratio, compelling cause-related photos
- All images: optimized WebP with lazy loading

---

## Accessibility
- Icon library: Heroicons (via CDN)
- ARIA labels on all interactive elements
- Keyboard navigation support throughout
- Focus visible states with ring-2 ring-primary
- Sufficient contrast ratios (WCAG AA minimum)
- Form validation with clear error messages

---

**Design Personality**: Premium yet approachable, trustworthy, aspirational, clean and modern with touches of luxury through typography and spacing.