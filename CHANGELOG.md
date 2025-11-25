# Changelog

All notable changes to WealthTracker will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2024-12-29

### 🎨 UX Revolution - Major UI/UX Redesign

#### Added

- **PriceTicker Component**: Bloomberg-style horizontal price bar with inline editing
  - Click on asset → Edit price → Press Enter to save
  - Smooth scrolling with styled scrollbar
  - Category badges with colors
  - Hover lift effects
  - Keyboard navigation (Enter to save, Escape to cancel)

- **Modal Component**: Reusable modal system for all forms
  - Backdrop blur with glassmorphism effect
  - Click outside or Escape to close
  - Scale-in animations
  - Scrollable content area
  - Focus management

- **AssetManagerCards Component**: Modern card-based display
  - Categories section with grid layout
  - Individual category cards with folder icon and asset count
  - Assets section with vertical list of cards
  - Color-coded borders and badges
  - Empty states with helpful messages

- **New IPC Handler**: `asset:updatePrice`
  - Instant price updates without page navigation
  - Type-safe API with TypeScript
  - Includes category relation in response

- **lucide-react Icons**: Modern SVG icon library
  - TrendingUp, Settings2, Folder, Edit2, Check, X, Plus
  - Lightweight and tree-shakeable

#### Changed

- **SettingsPage**: Complete redesign
  - Removed tabs (Categories/Assets)
  - Replaced with AssetManagerCards for unified display
  - Forms now open in elegant modals
  - Added loading skeleton states
  - Modern layout with lucide-react icons

- **TransactionsPage**: Enhanced with PriceTicker
  - Added PriceTicker at top of page
  - Instant price editing from transactions view
  - Parallel loading of transactions and assets (Promise.all)
  - Success notifications after price updates
  - Improved visual hierarchy

#### Removed

- **CategoryList Component**: Replaced by AssetManagerCards
- **AssetList Component**: Replaced by AssetManagerCards
- **Documentation**: Removed obsolete docs
  - `SETTINGS_PAGE.md` → Integrated into V0.3_UX_REVOLUTION.md
  - `UI_UX_IMPROVEMENTS.md` → Integrated into V0.3_UX_REVOLUTION.md

#### Fixed

- N/A - This release focused on features and UX improvements

### 📦 Dependencies

- Added: `lucide-react` (latest)

### 📚 Documentation

- Added: `docs/V0.3_UX_REVOLUTION.md` - Complete v0.3 guide
- Added: `docs/V0.3_RELEASE_NOTES.md` - Detailed release notes
- Updated: `README.md` - v0.3 features and quick start guide
- Updated: `docs/FINAL_SUMMARY.md` - Version history

### 🔧 Technical Details

- **Lines of Code**: +864 net (+1729 added, -865 removed)
- **New Components**: 3 (PriceTicker, Modal, AssetManagerCards)
- **Refactored Pages**: 2 (SettingsPage, TransactionsPage)
- **IPC Handlers**: 7 total (+1 new)
- **ESLint Errors**: 0
- **TypeScript Strict**: Enabled

---

## [0.2.0] - 2024-11-25

### Added

#### Core Features

- **Category Management**
  - Create categories with name and color
  - 6 preset colors + custom color picker
  - Grid display with responsive layout
  - Dynamic asset counter per category
  - Color badges throughout the application

- **Asset Management**
  - Create assets with name, ticker, price, and category
  - Auto-uppercase ticker symbols
  - Professional table display
  - Price formatting in euros
  - Category relationship with colored badges
  - Form validation

- **Transaction Management**
  - BUY/SELL transactions
  - Asset selection from dropdown
  - Automatic total calculation
  - Decimal quantity support
  - Optional transaction fees
  - Real-time statistics (buys/sells/balance)
  - Detailed transaction cards

#### UI Components

- **CategoryForm**: Form for creating categories
- **CategoryList**: Grid display of categories with counters
- **AssetForm**: Form for creating assets
- **AssetList**: Table display of assets with category badges
- **TransactionForm**: Form for creating transactions
- **TransactionList**: List of transaction cards with details
- **Notification**: Toast notifications for success/error messages

#### Pages

- **TransactionsPage**: Main page with transaction form and list
- **SettingsPage**: Configuration page with Categories and Assets tabs

#### Design System

- CSS Variables for consistent theming
- Glass-morphism navbar effect
- Smooth animations (fadeIn, scaleIn, hover effects)
- Modern dark gradient background
- Accessible focus states
- Responsive design

### Technical Infrastructure

- **Database**: SQLite with Prisma ORM
- **Schema**: 3 models (Category, Asset, Transaction)
- **IPC Communication**: 6 handlers (get/create for each model)
- **Type Safety**: Full TypeScript coverage
- **Code Quality**: ESLint + Prettier configured

### Documentation

- `docs/V0.2_IMPLEMENTATION_GUIDE.md` - Step-by-step implementation guide
- `docs/V0.2_MIGRATION.md` - Detailed changelog from v0.1
- `docs/SETTINGS_PAGE.md` - Settings page documentation
- `docs/UI_UX_IMPROVEMENTS.md` - Design system documentation
- `docs/FINAL_SUMMARY.md` - Complete project summary

---

## [0.1.0] - 2024-11-XX

### Added

- Initial "Walking Skeleton" implementation
- Basic Electron app structure
- SQLite database setup
- Simple transaction list display
- Basic transaction creation form
- TailwindCSS integration
- GitHub Actions for linting

### Technical Stack

- Electron 38.x
- React 19.x
- TypeScript
- Vite 7.x
- Prisma 7.x
- TailwindCSS 4.x

---

## Version Comparison

| Feature | v0.1 | v0.2 | v0.3 |
|---------|------|------|------|
| Transactions | ✅ Basic | ✅ Full | ✅ Full |
| Categories | ❌ | ✅ | ✅ Enhanced |
| Assets | ❌ | ✅ | ✅ Enhanced |
| Price Updates | ❌ | ❌ | ✅ Instant |
| Forms | Inline | Inline | Modals ✨ |
| Display | List | Tabs | Cards ✨ |
| Icons | None | Emojis | lucide-react ✨ |
| Design | Basic | Modern | Revolutionary ✨ |

---

## Upgrade Paths

### From v0.2 to v0.3

1. Pull latest changes: `git pull origin main`
2. Install dependencies: `npm install`
3. Regenerate Prisma: `npx prisma generate`
4. Start app: `npm run dev`

**Database**: No migration required (fully compatible)

### From v0.1 to v0.3

1. Pull latest changes: `git pull origin main`
2. Install dependencies: `npm install`
3. Run migrations: `npx prisma migrate dev`
4. Regenerate Prisma: `npx prisma generate`
5. (Optional) Seed data: `npx prisma db seed`
6. Start app: `npm run dev`

**Database**: Migration required (new tables for Category and Asset)

---

## Roadmap

### v0.4 (Planned - Q1 2025)

- [ ] Edit/Delete categories
- [ ] Edit/Delete assets
- [ ] Edit/Delete transactions
- [ ] Dark mode toggle
- [ ] Search and filters
- [ ] Keyboard shortcuts

### v0.5 (Planned - Q2 2025)

- [ ] Price history charts
- [ ] Portfolio performance graphs
- [ ] Category distribution pie chart
- [ ] Export to PDF/CSV
- [ ] Import from CSV

### v1.0 (Planned - Q3 2025)

- [ ] Multi-currency support
- [ ] Cloud sync (optional)
- [ ] Mobile companion app
- [ ] Advanced analytics
- [ ] Tax reports generation

---

## Links

- **Repository**: https://github.com/YOUR_USERNAME/wealthtracker
- **Documentation**: [docs/V0.3_UX_REVOLUTION.md](docs/V0.3_UX_REVOLUTION.md)
- **Issues**: https://github.com/YOUR_USERNAME/wealthtracker/issues
- **Discussions**: https://github.com/YOUR_USERNAME/wealthtracker/discussions
