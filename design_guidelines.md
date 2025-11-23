# Expense Tracker Design Guidelines

## Design Approach

**Selected Approach:** Design System - Material Design 3 principles with inspiration from modern fintech apps (Mint, YNAB, Splitwise)

**Rationale:** This is a utility-focused, data-dense application where clarity, efficiency, and mobile usability are paramount. Users need quick expense entry and instant visual feedback on budget status.

## Typography

**Font Family:** Inter (via Google Fonts CDN)
- Primary: Inter for all UI elements
- Weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

**Type Scale:**
- App Title/Headers: text-2xl font-bold
- Section Headers: text-xl font-semibold
- Category Names: text-lg font-medium
- Body/Input Text: text-base font-normal
- Labels/Captions: text-sm font-medium
- Budget Numbers (large): text-3xl font-bold
- Metadata: text-xs font-normal

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, and 16 consistently
- Component padding: p-4 or p-6
- Section spacing: space-y-6 or space-y-8
- Card gaps: gap-4
- Form field spacing: space-y-4

**Container Strategy:**
- Mobile-first: Full width with px-4 padding
- Desktop: max-w-4xl mx-auto for main content
- Cards: rounded-lg with consistent shadow-sm

## Core Components

### 1. Navigation/Header
- Sticky top bar with app title and current month display
- Hamburger menu icon (left) for mobile navigation
- Profile/settings icon (right)
- Include month selector dropdown for viewing past months
- Height: h-16 with items-center flex layout

### 2. Quick Expense Entry (Priority Component)
- Prominent floating action button (FAB) bottom-right on mobile (bottom-6 right-6 fixed)
- Modal/slide-up form with:
  - Large number input with currency symbol (text-3xl font-bold)
  - Category dropdown with icons (use Heroicons for all icons)
  - Optional notes field (text-sm)
  - Date picker (defaults to today)
  - Large "Add Expense" button (w-full py-4 rounded-lg font-semibold)
- Form spacing: space-y-6 for clear separation

### 3. Budget Overview Dashboard
- Grid layout: grid-cols-1 md:grid-cols-2 gap-4
- Summary cards showing:
  - Total Budget (large number, text-4xl)
  - Total Spent (with percentage)
  - Remaining Balance
  - Savings This Month
- Each card: p-6 rounded-lg shadow-sm

### 4. Category Progress Bars
- List of all budget categories (space-y-4)
- Each category item includes:
  - Category name with icon (text-lg font-medium)
  - Spent vs. Budget numbers (text-sm)
  - Progress bar (h-3 rounded-full with inner filled section)
  - Percentage indicator
- Visual states: under budget, near limit (>80%), over budget

### 5. Recent Expenses List
- Card-based list with space-y-3
- Each expense item (p-4 rounded-lg):
  - Amount (text-xl font-bold, right-aligned)
  - Category icon + name (text-base)
  - Date/time (text-xs)
  - Optional notes preview (text-sm)
- "View All" link at bottom

### 6. Monthly Recap Screen
- Appears at month-end/start
- Full-screen modal or dedicated page
- Sections (space-y-8):
  - Month header (text-3xl font-bold)
  - Achievement badge/illustration (if under budget)
  - Spending summary by category (horizontal bar chart visual)
  - Savings amount (text-4xl with celebration if positive)
  - Top spending categories (text-lg)
  - "Adjust Budget" CTA button (w-full py-4)

### 7. Budget Adjustment Interface
- Editable list of categories
- Each row: category name + editable amount input
- +/- adjustment controls for quick increments
- Total calculation at bottom
- Save/Cancel buttons (sticky bottom on mobile)

## Interaction Patterns

**Mobile Gestures:**
- Swipe left on expense item to delete
- Pull-to-refresh on expense list
- Bottom sheet for forms and filters

**Data Entry Optimization:**
- Auto-focus amount field when adding expense
- Recent categories at top of dropdown
- Smart defaults (today's date, most-used category)
- Keyboard type="number" for amount inputs

**Visual Feedback:**
- Budget bar fills smoothly with CSS transitions
- Success animation when adding expense
- Toast notifications for actions (bottom-center)
- Loading states for calculations

## Accessibility

- All form inputs have visible labels (text-sm font-medium mb-2)
- Sufficient touch targets (min h-12 for buttons, h-16 for FAB)
- ARIA labels for icon-only buttons
- Keyboard navigation support for all interactions
- Error messages below inputs (text-sm)

## Responsive Breakpoints

**Mobile (default):** Single column, stacked components
**Tablet (md: 768px):** Two-column grid for dashboard cards
**Desktop (lg: 1024px):** max-w-4xl centered, side-by-side layouts where beneficial

## Icon Strategy

**Library:** Heroicons (via CDN)
**Usage:**
- Category icons: 24px (w-6 h-6)
- Navigation icons: 20px (w-5 h-5)
- Action buttons: 24px
- Status indicators: 16px (w-4 h-4)

**Categories Icons Mapping:**
- Rent: HomeIcon
- Groceries: ShoppingCartIcon
- Utilities: BoltIcon
- Transportation: TruckIcon
- Medical: HeartIcon
- Entertainment: TicketIcon
- Generic: CurrencyDollarIcon

## Data Visualization

- Progress bars: Simple filled rectangles with rounded corners
- Percentage badges: Circular or pill-shaped indicators
- Trend indicators: Arrow icons (up/down) with small text
- Month comparison: Simple before/after number display with delta

## Performance Considerations

- Lazy load expense history (paginate after 50 items)
- Debounce budget adjustment inputs
- Cache current month data locally
- Minimal animations for quick interactions