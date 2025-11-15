# CheckWise Design Guidelines

## Design System Selection
**Approach**: Custom SaaS Design System with RTL Arabic Support
- Modern, clean SaaS aesthetic
- Optimized for Arabic-speaking users
- Professional trust-building visual language

## Core Design Elements

### A. Typography
**Font Family**: System font stack with Arabic support (Inter fallback)
- **Headers**: Bold weight, sizes 24px-40px
- **Body Text**: Medium/Regular weight, 14px-16px
- **Small Text**: Regular weight, 12px-14px
- **RTL Direction**: All text flows right-to-left for Arabic content

### B. Layout System
**Spacing Units**: Tailwind spacing - primarily use 2, 4, 6, 8, 12, 16, 20, 24, 32
- **Container Width**: max-w-7xl for main content
- **Card Padding**: p-6 to p-8
- **Section Spacing**: py-12 to py-20
- **RTL Layout**: Sidebar on right, navigation reversed

### C. Color Palette
- **Primary Blue**: #3B82F6
- **Secondary Purple**: #8B5CF6
- **Background**: #F3F4F6 (light gray)
- **Surface**: #FFFFFF (white cards)
- **Text Primary**: #111827 (dark)
- **Text Secondary**: #6B7280 (gray)
- **Success**: #16A34A (green)
- **Warning**: #F59E0B (yellow)
- **Error**: #DC2626 (red)

**Gradient**: Linear gradient from Blue to Purple for logos, CTAs, premium elements

### D. Component Library

**Cards**: White background, rounded-3xl (24px), soft shadow, border-gray-100
**Buttons**: 
- Primary: Blue-to-purple gradient, rounded-xl, px-8 py-3
- Secondary: Outline style, border-2
- Danger: Red background for destructive actions

**Trust Score Badge**: Circular indicator with color-coded backgrounds:
- 80-100%: Green (#16A34A)
- 50-79%: Yellow (#F59E0B)  
- 0-49%: Red (#DC2626)

**Navigation**: 
- Desktop: Horizontal header with logo left, menu center, CTA right
- Mobile: Hamburger menu with slide-out sidebar
- Sidebar: Fixed right side (RTL), white background, icon + text items

**Forms**: Clean input fields with rounded-xl borders, focus states with primary blue ring

**Tables**: Striped rows, hover states, responsive with horizontal scroll on mobile

**Loading States**: Animated progress bar (0-100%) with step indicators and icons

**Toast Notifications**: RTL-positioned, colored backgrounds matching message type, auto-dismiss

**Empty States**: Large icon, motivational message, CTA button to take action

### E. Page-Specific Layouts

**Landing Page**:
- Hero: Full-width with large Arabic headline, dual CTAs, dashboard mockup image
- Features: 3-4 card grid showcasing key benefits
- Pricing: 3 plan cards (Basic/Standard/Pro) with "الأكثر شيوعًا" badge on Standard
- Footer: Links, copyright, newsletter signup

**Dashboard**:
- Right sidebar navigation (RTL)
- Welcome header: "أهلاً، [Name] 👋"
- KPI cards row: Credits remaining, checks this month, suspicious products
- Large "فحص منتج جديد" CTA button
- Recent checks table with product images, trust scores, status badges

**Check Result Page**:
- Product header: Image, title, price, source platform logo
- Large circular trust score (82%) in center
- Two-column layout: Positive points vs. Negative points
- Recommendation message with clear emoji (👍/⚠/❌)
- CTAs: "شاهد بدائل أفضل" + "رجوع إلى السجل"

**Alternatives Page**:
- Display 3 alternative products
- Comparison: Price savings, trust scores, highlights
- Badges for deals and savings amounts
- Explanation text: "لماذا نوصي بهذه البدائل؟"

**Free Trial System**:
- Prominent timer: "باقي 22 ساعة على انتهاء التجربة"
- Credits display: "الرصيد المتبقي: 3 / 3"
- Upgrade prompts at strategic points
- Clear explanation of trial limitations

### F. Animations
**Minimal, purposeful animations**:
- Loading screen: Animated progress bar with 4-step indicators
- Page transitions: Smooth fade-in
- Toast notifications: Slide-in from right (RTL)
- Hover states: Subtle scale/shadow changes on cards
- **NO** excessive scroll animations or decorative motion

## Images
- **Hero Section**: Dashboard mockup showing trust score interface
- **Product Cards**: Product images from scraped data
- **Platform Logos**: Amazon, Temu, TikTok Shop, AliExpress icons
- **Empty States**: Illustrative icons for empty history
- **No stock photos** - focus on actual product imagery and UI mockups

## Accessibility
- Clear color contrast ratios (WCAG AA)
- Focus indicators on all interactive elements
- Semantic HTML structure
- RTL text direction properly implemented
- Touch-friendly tap targets (min 44px) on mobile