# Common Rules for Professional UI + Pre-Delivery Checklist

## Icons & Visual Elements
| Rule | Standard | Avoid |
|------|----------|-------|
| No Emoji as Structural Icons | Use vector-based icons (Lucide, Heroicons) | Using emojis for navigation or system controls |
| Vector-Only Assets | Use SVG or platform vector icons | Raster PNG icons that pixelate |
| Consistent Icon Sizing | Define icon size tokens (icon-sm, icon-md=24pt) | Mixing arbitrary values |
| Stroke Consistency | Use consistent stroke width per layer | Mixing thick and thin strokes |
| Filled vs Outline Discipline | Use one icon style per hierarchy level | Mixing filled and outline at same level |
| Touch Target Minimum | Minimum 44×44pt interactive area | Small icons without expanded tap area |
| Icon Contrast | 4.5:1 for small elements, 3:1 minimum | Low-contrast icons blending into background |

## Light/Dark Mode Contrast
| Rule | Do | Don't |
|------|----|-------|
| Text contrast (light) | Maintain >=4.5:1 | Low-contrast gray body text |
| Text contrast (dark) | Maintain >=4.5:1 primary, >=3:1 secondary | Text that blends into background |
| Token-driven theming | Use semantic color tokens per theme | Hardcoded per-screen hex values |
| Scrim legibility | Modal scrim 40-60% black | Weak scrim that doesn't isolate foreground |

## Layout & Spacing
| Rule | Do | Don't |
|------|----|-------|
| Safe-area compliance | Respect top/bottom safe areas | Placing UI under notch or gesture area |
| 8dp spacing rhythm | Use consistent 4/8dp spacing | Random spacing increments |
| Readable text measure | Keep long-form text readable | Edge-to-edge paragraphs on tablets |

---

## Pre-Delivery Checklist

### Process
- [ ] Ran `--domain ux "animation accessibility"` as validation pass
- [ ] Reviewed quick-reference.md §1–§3 (CRITICAL + HIGH)
- [ ] Tested on 375px and in landscape orientation
- [ ] Verified with reduced-motion enabled
- [ ] Checked dark mode contrast independently
- [ ] Confirmed all touch targets ≥44pt

### Visual Quality
- [ ] No emojis used as icons
- [ ] All icons from consistent icon family
- [ ] Semantic theme tokens used consistently

### Light/Dark Mode
- [ ] Primary text contrast >=4.5:1 in both modes
- [ ] Dividers/borders distinguishable in both modes
- [ ] Both themes tested before delivery

### Layout
- [ ] Safe areas respected for headers, tab bars, CTAs
- [ ] Scroll content not hidden behind fixed bars
- [ ] Verified on small phone, large phone, tablet
- [ ] 4/8dp spacing rhythm maintained

### Accessibility
- [ ] All meaningful images have accessibility labels
- [ ] Form fields have labels, hints, error messages
- [ ] Color is not the only indicator
- [ ] Reduced motion and dynamic text supported
