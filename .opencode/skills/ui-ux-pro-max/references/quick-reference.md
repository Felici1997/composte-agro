# Quick Reference — Full Rule Set

### 1. Accessibility (CRITICAL)
- `color-contrast` - Minimum 4.5:1 ratio for normal text
- `focus-states` - Visible focus rings on interactive elements
- `alt-text` - Descriptive alt text for meaningful images
- `aria-labels` - aria-label for icon-only buttons
- `keyboard-nav` - Tab order matches visual order
- `form-labels` - Use label with for attribute
- `skip-links` - Skip to main content for keyboard users
- `heading-hierarchy` - Sequential h1→h6, no level skip
- `color-not-only` - Don't convey info by color alone
- `reduced-motion` - Respect prefers-reduced-motion

### 2. Touch & Interaction (CRITICAL)
- `touch-target-size` - Min 44×44pt (Apple) / 48×48dp (Material)
- `touch-spacing` - Minimum 8px/8dp gap between touch targets
- `hover-vs-tap` - Don't rely on hover alone
- `loading-buttons` - Disable button during async operations
- `error-feedback` - Clear error messages near problem field
- `cursor-pointer` - Add cursor-pointer to clickable elements
- `tap-delay` - Use touch-action: manipulation
- `press-feedback` - Visual feedback on press (ripple/highlight)

### 3. Performance (HIGH)
- `image-optimization` - Use WebP/AVIF, responsive images
- `image-dimension` - Declare width/height to prevent CLS
- `font-loading` - Use font-display: swap
- `lazy-loading` - Lazy load non-hero components
- `bundle-splitting` - Split code by route/feature
- `virtualize-lists` - Virtualize lists with 50+ items
- `main-thread-budget` - Keep per-frame work under ~16ms
- `debounce-throttle` - Debounce high-frequency events

### 4. Style Selection (HIGH)
- `style-match` - Match style to product type
- `consistency` - Use same style across all pages
- `no-emoji-icons` - Use SVG icons, not emojis
- `color-palette-from-product` - Choose palette from product/industry
- `effects-match-style` - Shadows, blur, radius aligned with chosen style
- `dark-mode-pairing` - Design light/dark variants together
- `icon-style-consistent` - Use one icon set across the product

### 5. Layout & Responsive (HIGH)
- `viewport-meta` - width=device-width initial-scale=1
- `mobile-first` - Design mobile-first, scale up
- `breakpoint-consistency` - Use systematic breakpoints
- `readable-font-size` - Minimum 16px body text on mobile
- `horizontal-scroll` - No horizontal scroll on mobile
- `spacing-scale` - Use 4pt/8dp incremental spacing system
- `container-width` - Consistent max-width on desktop
- `z-index-management` - Define layered z-index scale
- `viewport-units` - Prefer min-h-dvh over 100vh

### 6. Typography & Color (MEDIUM)
- `line-height` - Use 1.5-1.75 for body text
- `line-length` - Limit to 65-75 characters per line
- `font-pairing` - Match heading/body font personalities
- `font-scale` - Consistent type scale
- `contrast-readability` - Darker text on light backgrounds
- `color-semantic` - Define semantic color tokens
- `color-dark-mode` - Dark mode uses desaturated tonal variants
- `color-accessible-pairs` - Foreground/background must meet 4.5:1

### 7. Animation (MEDIUM)
- `duration-timing` - Use 150–300ms for micro-interactions
- `transform-performance` - Use transform/opacity only
- `loading-states` - Show skeleton when loading >300ms
- `easing` - Use ease-out for entering, ease-in for exiting
- `motion-meaning` - Every animation must express cause-effect
- `spring-physics` - Prefer spring curves for natural feel
- `exit-faster-than-enter` - Exit ~60-70% of enter duration

### 8. Forms & Feedback (MEDIUM)
- `input-labels` - Visible label per input (not placeholder-only)
- `error-placement` - Show error below the related field
- `submit-feedback` - Loading then success/error state on submit
- `empty-states` - Helpful message when no content
- `toast-dismiss` - Auto-dismiss toasts in 3-5s
- `inline-validation` - Validate on blur, not keystroke
- `input-type-keyboard` - Use semantic input types for correct keyboard
- `password-toggle` - Provide show/hide toggle for password fields

### 9. Navigation Patterns (HIGH)
- `bottom-nav-limit` - Bottom navigation max 5 items
- `back-behavior` - Back navigation must be predictable
- `deep-linking` - All key screens reachable via deep link
- `nav-state-active` - Current location must be visually highlighted
- `modal-escape` - Modals must offer clear close affordance
- `search-accessible` - Search must be easily reachable

### 10. Charts & Data (LOW)
- `chart-type` - Match chart type to data type
- `color-guidance` - Use accessible color palettes
- `data-table` - Provide table alternative for accessibility
- `legend-visible` - Always show legend
- `tooltip-on-interact` - Provide tooltips on hover/tap
- `responsive-chart` - Charts must reflow on small screens
- `empty-data-state` - Show meaningful empty state
