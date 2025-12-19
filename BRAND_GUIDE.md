# iWantSexNow.ch Brand Style Guide

## Brand Overview

**Name:** iWantSexNow.ch  
**Tagline:** Where Desire Meets Discretion  
**Industry:** Premium adult companionship and escort services  
**Market:** Switzerland (Zürich, Geneva, Basel, Bern, Lausanne)  
**Brand Personality:** Sophisticated, Discreet, Premium, Trustworthy, Elegant

---

## Logo System

### Primary Logo
The iWantSexNow.ch logo features an elegant geometric heart design with interlocking elements that suggest connection and sophistication. The logo comes in multiple variations for different use cases.

### Logo Files Available

**Full Color (Rose Gold Gradient):**
- `logo_512x512.png` - High resolution, full detail
- `logo_256x256.png` - Medium resolution
- `logo_128x128.png` - Standard web use (PRIMARY)
- `logo_64x64.png` - Small contexts
- `logo_32x32.png` - Favicon, minimal use
- `logo_16x16.png` - Smallest favicon size

**Monochrome Versions:**
- `logo_monochrome_white.png` - For dark backgrounds (alternative)
- `logo_monochrome_black.png` - For light backgrounds only

**Full Lockup:**
- `9d4e92fe-6caa-40e2-a75b-d159fbcf8c21.png` - Complete logo with wordmark

### Logo Specifications

**Geometric Heart Icon:**
- Design: Interlocking diamond/heart shape with subtle depth
- Style: Line-based geometric abstraction
- Symbolism: Connection, desire, sophistication
- Treatment: Smooth gradients with elegant curves

**Color Treatment:**
- Primary: Rose gold to champagne gradient
- Gradient Direction: Top-left to bottom-right
- Color Values: #D4AF37 (champagne) to #8B5F6F (muted rose)
- Monochrome: Pure white (#FFFFFF) or pure black (#000000)

### Logo Usage Guidelines

**PRIMARY USAGE - Dark Backgrounds:**
Use `logo_128x128.png` (rose gold gradient) for:
- Website header and navigation
- Mobile menu
- Dark themed interfaces
- Social media profiles (dark mode)
- App icons

**ALTERNATIVE - Dark Backgrounds:**
Use `logo_monochrome_white.png` if pure grayscale is needed:
- Print materials (black & white)
- Simplified branding contexts
- When color adds unwanted emphasis

**LIGHT BACKGROUNDS:**
Use `logo_monochrome_black.png` for:
- Documents and reports
- Light themed interfaces (if ever used)
- Invoices and official paperwork

**MARKETING MATERIALS:**
Use full lockup with wordmark:
- Business cards
- Advertisements
- Promotional materials
- Social media covers

### Implementation Details

**Website Header:**
```jsx
<img 
  src="/logo_128x128.png" 
  alt="iWantSexNow.ch Logo" 
  className="w-12 h-12 transition-all group-hover:scale-110"
/>
```

**With Glow Effect:**
```jsx
<div className="relative">
  <img 
    src="/logo_128x128.png" 
    alt="iWantSexNow.ch Logo" 
    className="w-12 h-12 transition-all group-hover:scale-110"
  />
  <div className="absolute inset-0 bg-rose-400/10 blur-xl group-hover:bg-rose-400/20 transition-all rounded-lg" />
</div>
```

### Clear Space
Maintain minimum clear space around logo equal to 25% of the logo width on all sides.

### Minimum Size
- Desktop header: 48px × 48px (3rem)
- Mobile menu: 48px × 48px (3rem)
- Favicon: 32px × 32px minimum
- Never scale below 16px × 16px

### Logo Animation
Subtle hover effect:
- Scale: 1.0 to 1.1 (10% increase)
- Transition: 300ms ease-in-out
- Glow: Increase blur and opacity on hover

### Logo Usage DO's

✅ Use the rose gold gradient version on dark backgrounds (primary)  
✅ Maintain aspect ratio (always square)  
✅ Use proper clear space  
✅ Apply subtle hover effects for interactivity  
✅ Use appropriate size for context  
✅ Ensure logo is clearly visible against background  

### Logo Usage DON'Ts

❌ Don't distort or stretch the logo  
❌ Don't use rose gold version on light backgrounds  
❌ Don't add unauthorized effects (drop shadows, strokes, etc.)  
❌ Don't rotate the logo  
❌ Don't change the gradient colors  
❌ Don't use low-resolution files at large sizes  
❌ Don't place on busy backgrounds without contrast  

### Favicon Implementation

The favicon uses multiple sizes for optimal display across devices:

```html
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="icon" type="image/png" sizes="32x32" href="/logo_32x32.png" />
<link rel="icon" type="image/png" sizes="128x128" href="/logo_128x128.png" />
<link rel="icon" type="image/png" sizes="192x192" href="/logo_256x256.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/logo_256x256.png" />
<link rel="icon" type="image/png" sizes="512x512" href="/logo_512x512.png" />
```

### Brand Lockup with Text

When using the logo with the wordmark "iWantSexNow.ch":

**Horizontal Layout:**
```
[LOGO] iWantSexNow.ch
       WHERE DESIRE MEETS DISCRETION
```

**Typography:**
- Site Name: 1.5rem (24px), Font Weight 800, Color: White
- Tagline: 0.75rem (12px), Font Weight 600, Color: Gray-400, Uppercase, Letter-spacing: 0.1em

**Spacing:**
- Gap between logo and text: 0.75rem (12px)
- Vertical spacing between name and tagline: 0.125rem (2px)

### Background Compatibility

**Excellent Compatibility:**
- Pure black (#000000)
- Charcoal (#1a1a1a, #2C2C2C)
- Dark gray (#374151)
- Navy/dark blue
- Dark themed UI elements

**Poor Compatibility (DO NOT USE):**
- White or light backgrounds (use black version instead)
- Bright colors
- Photography without dark overlay
- Low contrast surfaces

---

## Color Palette

### Primary Colors

**Background Colors:**
```css
--background-primary: #0a0a0a;    /* Pure black */
--background-secondary: #1a1a1a;  /* Near black */
--background-tertiary: #2C2C2C;   /* Charcoal */
```

**Foreground Colors:**
```css
--foreground-primary: #ffffff;     /* Pure white */
--foreground-secondary: #f5f5f5;   /* Off white */
--foreground-tertiary: #e5e5e5;    /* Light gray */
```

**Accent Colors:**
```css
--accent-burgundy: #6B1B3D;        /* Deep burgundy */
--accent-rose: #8B5F6F;            /* Muted rose */
--accent-gold: #D4AF37;            /* Champagne gold - use sparingly */
```

**Neutral Grays:**
```css
--gray-50: #fafafa;
--gray-100: #f5f5f5;
--gray-200: #e5e5e5;
--gray-300: #d4d4d4;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;
--gray-950: #0a0a0a;
```

### Color Usage Guidelines

**Text on Dark Backgrounds:**
- Headlines: `#ffffff` (white)
- Body text: `#e5e5e5` to `#d4d4d4` (light grays)
- Secondary text: `#9ca3af` to `#6b7280` (medium grays)

**Interactive Elements:**
- Default state: Gray-700 to Gray-600
- Hover state: Gray-600 to Gray-500
- Active state: Gray-500 to Gray-400
- Focus state: White border or outline

**Accent Usage:**
- Use burgundy (`#6B1B3D`) for premium badges, important CTAs
- Use rose (`#8B5F6F`) for subtle highlights, gentle emphasis
- Use gold (`#D4AF37`) very sparingly for exclusive/VIP elements only

### Accessibility Standards
All color combinations must meet WCAG AA standards:
- Large text (18pt+): Minimum 3:1 contrast ratio
- Normal text: Minimum 4.5:1 contrast ratio
- Interactive elements: Minimum 3:1 contrast ratio

---

## Typography

### Font Stack

**Primary Font Family:**
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 
             'Fira Sans', 'Droid Sans', 'Helvetica Neue', 
             sans-serif;
```

**Serif Font (Headings):**
```css
font-family: 'Playfair Display', serif;
```
*Note: Loaded from Google Fonts when used*

### Type Scale

**Headings:**
```css
h1: 3.5rem (56px) - font-weight: 800 (Black)
h2: 2.5rem (40px) - font-weight: 700 (Bold)
h3: 2rem (32px) - font-weight: 700 (Bold)
h4: 1.5rem (24px) - font-weight: 600 (Semi-bold)
h5: 1.25rem (20px) - font-weight: 600 (Semi-bold)
h6: 1rem (16px) - font-weight: 600 (Semi-bold)
```

**Body Text:**
```css
Large: 1.125rem (18px) - font-weight: 400 (Regular)
Base: 1rem (16px) - font-weight: 400 (Regular)
Small: 0.875rem (14px) - font-weight: 400 (Regular)
XSmall: 0.75rem (12px) - font-weight: 400 (Regular)
```

**Display Text:**
```css
Display XL: 4.5rem (72px) - font-weight: 900 (Black)
Display L: 3.75rem (60px) - font-weight: 800 (Extra Bold)
Display M: 3rem (48px) - font-weight: 800 (Extra Bold)
```

### Font Weights

**Available Weights:**
- 300 - Light (minimal use)
- 400 - Regular (body text)
- 500 - Medium (emphasis)
- 600 - Semi-bold (subheadings)
- 700 - Bold (headings)
- 800 - Extra bold (hero headings)
- 900 - Black (display text)

### Typography Guidelines

**Headings:**
- Use Playfair Display for elegant, editorial headings
- Use system fonts for modern, clean interface headings
- Maintain generous line-height: 1.2-1.4 for headings
- Limit width to 60-75 characters for readability

**Body Text:**
- Font size: 16px minimum for body text
- Line height: 1.5-1.75 for optimal readability
- Paragraph spacing: 1em between paragraphs
- Limit line length to 65-75 characters

**Letter Spacing:**
- Headings: Tight (-0.025em to -0.05em)
- Body: Normal (0)
- All caps text: Wide (0.05em to 0.1em)
- Small text: Slightly wide (0.025em)

**Text Hierarchy:**
1. Page title (h1) - Largest, boldest
2. Section headings (h2) - Secondary size
3. Subsection headings (h3) - Tertiary size
4. Component headings (h4-h6) - Smaller sizes
5. Body text - Base size
6. Secondary text - Smaller, lighter color
7. Captions/labels - Smallest size

---

## Spacing System

### Base Unit: 4px

**Spacing Scale:**
```css
--space-1: 0.25rem (4px)
--space-2: 0.5rem (8px)
--space-3: 0.75rem (12px)
--space-4: 1rem (16px)
--space-5: 1.25rem (20px)
--space-6: 1.5rem (24px)
--space-8: 2rem (32px)
--space-10: 2.5rem (40px)
--space-12: 3rem (48px)
--space-16: 4rem (64px)
--space-20: 5rem (80px)
--space-24: 6rem (96px)
```

### Layout Spacing

**Container Padding:**
- Mobile: 1rem (16px)
- Tablet: 1.5rem (24px)
- Desktop: 2rem (32px)

**Section Spacing:**
- Small sections: 3rem (48px) vertical padding
- Medium sections: 5rem (80px) vertical padding
- Large sections: 8rem (128px) vertical padding

**Component Spacing:**
- Cards: 1.5rem (24px) padding
- Buttons: 0.75rem (12px) vertical, 1.5rem (24px) horizontal
- Form inputs: 0.75rem (12px) padding

---

## UI Components

### Buttons

**Primary Button:**
```css
background: linear-gradient(to right, #1f2937, #111827);
color: #ffffff;
padding: 0.75rem 1.5rem;
border-radius: 0.375rem;
font-weight: 600;
transition: all 0.2s;
```

**Hover State:**
```css
background: linear-gradient(to right, #374151, #1f2937);
transform: translateY(-1px);
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
```

**Secondary Button:**
```css
background: transparent;
color: #ffffff;
border: 2px solid #374151;
padding: 0.75rem 1.5rem;
border-radius: 0.375rem;
font-weight: 600;
```

### Cards

**Default Card:**
```css
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 0.75rem;
padding: 1.5rem;
transition: all 0.3s;
```

**Hover State:**
```css
border-color: rgba(255, 255, 255, 0.3);
box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
transform: translateY(-2px);
```

### Badges

**Premium Badge:**
```css
background: linear-gradient(to right, #6B1B3D, #4a1428);
color: #ffffff;
padding: 0.25rem 0.75rem;
border-radius: 9999px;
font-size: 0.75rem;
font-weight: 700;
text-transform: uppercase;
```

**Verified Badge:**
```css
background: #10b981;
color: #ffffff;
padding: 0.25rem 0.5rem;
border-radius: 0.375rem;
font-size: 0.75rem;
font-weight: 600;
```

---

## Iconography

### Icon Style
- Style: Outline/stroke icons preferred
- Weight: 2px stroke weight
- Size: 16px, 20px, 24px standard sizes
- Color: Match text color or use gray-400 for secondary icons
- Library: Lucide React (consistent style)

### Icon Usage
- Always pair with text labels for clarity
- Use consistent sizing within components
- Ensure 3:1 contrast ratio for interactive icons
- Provide hover states for clickable icons

---

## Photography & Imagery

### Image Style
- High-quality, professional photography
- Sophisticated, elegant compositions
- Appropriate lighting and staging
- Respectful and tasteful representation

### Image Treatment
- Dark overlays for text readability
- Gradient overlays: black to transparent
- Subtle desaturation for consistency
- Vignette effects for focus

### Image Dimensions
- Hero images: 1920×1080px minimum
- Profile cards: 400×600px (portrait)
- Thumbnails: 400×400px (square)
- Gallery images: 800×1200px

---

## Animation & Motion

### Timing Functions
```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### Duration
- Micro interactions: 150ms
- Standard transitions: 200-300ms
- Complex animations: 400-500ms
- Page transitions: 300-400ms

### Principles
- Smooth, subtle movements
- Purposeful animations (not decorative)
- Respect user preferences (prefers-reduced-motion)
- Consistent timing across components

---

## Responsive Breakpoints

```css
/* Mobile First Approach */
--breakpoint-sm: 640px;   /* Small devices */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Desktops */
--breakpoint-xl: 1280px;  /* Large desktops */
--breakpoint-2xl: 1536px; /* Extra large screens */
```

### Layout Guidelines
- Mobile: Single column, stacked content
- Tablet: 2-column grids, larger touch targets
- Desktop: Multi-column layouts, hover states
- Large screens: Max-width containers, generous spacing

---

## Accessibility Guidelines

### WCAG 2.1 AA Compliance
- Color contrast: Minimum 4.5:1 for text
- Interactive elements: Minimum 3:1 contrast
- Touch targets: Minimum 44×44px
- Focus indicators: Visible 2px outline
- Keyboard navigation: Fully operable
- Screen reader support: Semantic HTML, ARIA labels

### Best Practices
- Alt text for all images
- Form labels and error messages
- Logical heading hierarchy
- Skip navigation links
- Captions for video content

---

## Brand Voice & Tone

### Voice Characteristics
- **Sophisticated:** Refined, never crude
- **Direct:** Clear, honest, no euphemisms
- **Confident:** Assured, never arrogant
- **Discreet:** Professional, respectful
- **Premium:** Quality-focused, exclusive

### Tone Guidelines
- Use professional language
- Avoid explicit or vulgar terms
- Emphasize safety and verification
- Highlight discretion and privacy
- Communicate value and quality

### Writing Style
- Active voice preferred
- Clear, concise sentences
- Scannable formatting (bullet points, headings)
- Benefit-focused copy
- Inclusive language

---

## File Naming Conventions

### Logo Files
```
logo-full-color.svg
logo-icon-only.svg
logo-wordmark-only.svg
logo-monochrome-white.svg
logo-monochrome-black.svg
favicon-16x16.png
favicon-32x32.png
favicon-192x192.png
favicon-512x512.png
```

### Brand Assets
```
brand-guide.pdf
color-palette.png
typography-samples.pdf
component-library.pdf
```

---

## Implementation Notes

### CSS Variables (globals.css)
All brand colors, spacing, and typography are defined as CSS custom properties in `src/styles/globals.css` for consistent implementation.

### Component Library
UI components follow Shadcn/UI patterns and are located in `src/components/ui/`

### Tailwind Configuration
Brand colors and spacing are configured in `tailwind.config.ts` for utility class usage.

---

## Version History

**Version 1.0** - December 2025
- Initial brand guide
- Logo system defined
- Color palette established
- Typography system documented
- UI component guidelines

---

## Contact & Support

For questions about brand implementation or to request design assets:
- Review this guide first
- Check the LOGO_DESIGN_PROMPT.md for logo generation guidelines
- Maintain consistency with established patterns

---

**Last Updated:** December 19, 2025  
**Document Owner:** iWantSexNow.ch Brand Team