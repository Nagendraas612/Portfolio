# 📱 Mobile Testing Checklist

## Quick Test (5 minutes)

### 1. Hero Section
- [ ] Name splits correctly on scroll
- [ ] Wave animation displays properly
- [ ] Text is readable (not too small)
- [ ] No horizontal scrolling

### 2. Navigation
- [ ] Nav buttons are touchable (44px minimum)
- [ ] Dock appears at bottom
- [ ] Dock icons are tappable
- [ ] Back to home link works

### 3. Content Sections
- [ ] About section text is readable
- [ ] Skills grid displays in 1-2 columns
- [ ] Project cards are tappable
- [ ] Contact form inputs work with mobile keyboard

### 4. Modals & Overlays
- [ ] Project detail modal opens correctly
- [ ] Close button is easily tappable
- [ ] Modal content is scrollable
- [ ] No content cut off

### 5. Performance
- [ ] Page loads within 3 seconds
- [ ] Animations are smooth (no jank)
- [ ] Images load progressively
- [ ] No console errors

## Test URLs

**Local:** `http://localhost:3000`
**Production:** `https://nagendraas.vercel.app`

## Test Devices/Viewports

### Small Mobile (375px)
```
iPhone SE
iPhone 12 mini
```

### Standard Mobile (390-414px)
```
iPhone 13
iPhone 14
Google Pixel 6
```

### Large Mobile (428-480px)
```
iPhone 14 Pro Max
Samsung Galaxy S22 Ultra
```

### Tablet (768px)
```
iPad Mini
iPad Air
```

## Chrome DevTools Quick Test

1. Open DevTools: `F12`
2. Toggle Device Toolbar: `Ctrl + Shift + M` (Windows) or `Cmd + Shift + M` (Mac)
3. Select device presets or custom dimensions
4. Test both portrait and landscape
5. Check "Network" tab → Set to "Fast 3G" to test slow connections

## Common Issues to Look For

❌ **Text too small** → Check if font-size uses clamp()
❌ **Buttons too small** → Ensure 44px minimum touch targets
❌ **Horizontal scroll** → Check for fixed widths exceeding 100vw
❌ **Modal cut off** → Verify modal has max-height and scroll
❌ **Images overflowing** → Use max-width: 100%
❌ **Dock overlapping content** → Check z-index and bottom padding

## Browser Testing

### iOS Safari
- Test on actual iPhone if possible
- Check for bounce scroll behavior
- Verify form inputs don't zoom on focus

### Chrome Mobile
- Test address bar hiding behavior
- Check viewport height calculations
- Verify smooth scrolling

### Samsung Internet
- Test dark mode compatibility
- Check for any Samsung-specific bugs

## Quick Fixes

### Text Too Small
```css
font-size: clamp(1rem, 2vw, 1.5rem);
```

### Button Too Small
```css
min-height: 44px;
min-width: 44px;
padding: 0.75rem 1.5rem;
```

### Horizontal Scroll
```css
body {
  overflow-x: hidden;
  max-width: 100vw;
}
```

### Viewport Issues
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

---

**Status:** ✅ All mobile optimizations applied
**Last Updated:** 2026-08-25
