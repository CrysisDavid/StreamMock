# Design Guidelines: Netflix-Style Streaming Platform

## Design Approach

**Reference-Based Approach**: Drawing inspiration from Netflix's proven streaming interface patterns, adapted for the movie catalog and favorites system specified in the API.

**Key Principles**:
- Content-first visual hierarchy with prominent movie imagery
- Immersive full-width layouts that showcase media
- Clear navigation between Browse, My List, and user account flows
- Seamless authentication experience integrated into the platform

## Layout System

**Spacing Units**: Use Tailwind spacing values of **2, 4, 6, 8, 12, 16, 24** for consistent rhythm throughout the application.

**Container Strategy**:
- Full-width hero sections with max-w-7xl inner containers
- Content areas: max-w-7xl with px-4 md:px-8 lg:px-12
- Form containers: max-w-md centered for auth flows

**Grid Patterns**:
- Movie catalog: grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
- Horizontal scrolling rows for categorized content (alternative to grid)
- Gap spacing: gap-4 md:gap-6 between movie cards

## Typography

**Font Stack**: 
- Primary: 'Inter' or 'Netflix Sans' (Google Fonts CDN)
- Fallback: system-ui, -apple-system, sans-serif

**Hierarchy**:
- Hero Title: text-4xl md:text-5xl lg:text-6xl, font-bold, tracking-tight
- Section Headers: text-2xl md:text-3xl, font-semibold
- Movie Titles: text-base md:text-lg, font-medium
- Body Text: text-sm md:text-base, font-normal
- Metadata (duration, year, rating): text-xs md:text-sm, font-light

## Component Library

### Navigation Header
- Fixed position with backdrop-blur-md
- Height: h-16 md:h-20
- Contains: Logo (left), nav links (center), search + profile (right)
- Sticky behavior with subtle elevation on scroll
- Mobile: Hamburger menu transforming to full-screen overlay

### Hero Section (Homepage)
- Full viewport height: min-h-screen with gradient overlay
- Featured movie with large background image
- Title + synopsis limited to 2-3 lines with text truncation
- CTA buttons: "Play" (primary) and "More Info" (secondary) with backdrop-blur-lg
- Positioned: bottom-24 md:bottom-32 for content
- Include: Movie rating badge, year, duration metadata

### Movie Cards
- Aspect ratio: aspect-video (16:9) for consistency
- Hover effect: scale-105 transform with transition-transform duration-300
- Card structure:
  - Image container with rounded-md overflow-hidden
  - Overlay gradient on hover revealing metadata
  - Title overlay at bottom with p-4
  - Favorite icon button positioned top-right with backdrop-blur

### Content Rows
- Row header: flex justify-between items-center mb-6
- Row title with "See All" link (if applicable)
- Horizontal scroll: overflow-x-auto with snap-x snap-mandatory
- Individual items: min-w-[180px] md:min-w-[240px] lg:min-w-[280px]

### Movie Details Page
- Hero section: min-h-[60vh] with backdrop image
- Two-column layout below hero: 
  - Left (2/3): Synopsis, cast, technical details
  - Right (1/3): Sidebar with related movies
- Action buttons: Play, Add to List, Share
- Metadata grid: Director, Genre, Year, Duration, Rating in organized rows

### Authentication Pages (Login/Register)
- Centered layout: min-h-screen flex items-center justify-center
- Form card: w-full max-w-md with p-8 md:p-12
- Input spacing: space-y-6 for form fields
- Button: w-full for primary action
- Links: text-sm for "Forgot password?" and "Sign up" switches

### My List Page
- Similar grid to browse page: grid-cols-2 md:grid-cols-3 lg:grid-cols-4
- Empty state: Centered message with illustration and CTA
- Remove from favorites: X button on hover with backdrop-blur

### Loading States
- Skeleton cards matching movie card dimensions
- Shimmer animation using animate-pulse
- Maintain layout structure during loading

### Error States
- Inline validation messages: text-sm with icon
- Global error banner: fixed top with backdrop-blur
- 404 page: Centered with illustration and back-to-home CTA

## Interactions

**Hover States**:
- Movie cards: Subtle scale and reveal metadata overlay
- Buttons: Brightness adjustment via filter brightness-110
- Navigation links: Underline animation from center

**Focus States**:
- Ring offset for keyboard navigation: ring-2 ring-offset-2
- Visible focus indicators on all interactive elements

**Transitions**:
- Standard: transition-all duration-300 ease-in-out
- Transforms: transition-transform duration-200
- Avoid excessive animation; prioritize smooth, subtle effects

## Responsive Behavior

**Breakpoints**:
- Mobile: base (< 768px) - Single column, stacked navigation
- Tablet: md (768px+) - 2-3 columns, persistent navigation
- Desktop: lg (1024px+) - Full grid layouts, expanded metadata
- Large: xl (1280px+) - Maximum 5 columns for optimal viewing

**Mobile Adaptations**:
- Hero section: min-h-[70vh] with larger padding
- Navigation: Collapsible menu with slide-in animation
- Movie grid: Reduced columns (2 max) with larger touch targets
- Bottom navigation bar for key actions (optional secondary nav)

## Images

**Hero Images**:
- Large featured movie backdrop for homepage hero
- Size: Full viewport width, min-height 100vh with object-cover
- Gradient overlay from bottom for text readability

**Movie Cards**:
- Movie posters/thumbnails for each catalog item
- Aspect ratio: 16:9 (landscape) for consistency across grid
- Lazy loading with placeholder blur-up effect

**Detail Pages**:
- High-resolution backdrop image for movie detail hero
- Additional images: Director photo, cast thumbnails (if available)

**Placeholder Strategy**:
- Use placeholder image service (e.g., via.placeholder.com or similar)
- Fallback: Solid rectangle with movie title text if image fails

## Icon System

**Library**: Heroicons (outline for navigation, solid for actions)

**Usage**:
- Navigation: home, film, heart, user, search, menu icons
- Actions: play, plus, x, chevron-right, chevron-left
- Metadata: clock (duration), calendar (year), star (rating)
- Size: w-5 h-5 (standard), w-6 h-6 (prominent actions)

## Accessibility

- Semantic HTML: nav, main, article, section elements
- ARIA labels for icon-only buttons
- Keyboard navigation: Tab order matches visual hierarchy
- Screen reader text for image-based content
- Focus management for modals and overlays
- Minimum touch target size: 44x44px on mobile