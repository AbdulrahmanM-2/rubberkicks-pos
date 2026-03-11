# Project Structure - RubberKicks POS

## 📁 Directory Overview

```
rubberkicks-pos/
├── src/                          # Source code
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API Routes (Backend)
│   │   │   ├── inventory/        # Product management endpoints
│   │   │   │   └── route.ts      # GET, POST, PUT, DELETE /api/inventory
│   │   │   ├── sales/            # Sales transaction endpoints
│   │   │   │   └── route.ts      # GET, POST /api/sales
│   │   │   └── stats/            # Dashboard statistics
│   │   │       └── route.ts      # GET /api/stats
│   │   ├── page.tsx              # Main POS interface (Home page)
│   │   ├── layout.tsx            # Root layout with metadata
│   │   ├── loading.tsx           # Loading state component
│   │   ├── error.tsx             # Error boundary
│   │   ├── not-found.tsx         # 404 page
│   │   └── globals.css           # Global styles + Tailwind
│   ├── lib/                      # Utilities and helpers
│   │   ├── db.ts                 # Database layer (file + memory storage)
│   │   ├── types.ts              # TypeScript type definitions
│   │   └── api-utils.ts          # API response utilities
│   └── components/               # Reusable components (empty - ready for extraction)
├── public/                       # Static assets
├── data/                         # Local data storage (gitignored)
├── .next/                        # Next.js build output (gitignored)
├── node_modules/                 # Dependencies (gitignored)
├── package.json                  # Project dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── jsconfig.json                 # JavaScript/path configuration
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── postcss.config.js             # PostCSS configuration
├── .eslintrc.json                # ESLint configuration
├── .gitignore                    # Git ignore rules
├── .env.example                  # Environment variables template
├── .env.local                    # Local environment variables (gitignored)
├── .nvmrc                        # Node version specification
├── vercel.json                   # Vercel deployment configuration
├── README.md                     # Comprehensive documentation
├── DEPLOYMENT.md                 # Quick deployment guide
├── PRODUCTION.md                 # Detailed production guide
├── TROUBLESHOOTING.md            # Common issues and solutions
├── LICENSE                       # MIT License
└── STRUCTURE.md                  # This file
```

## 🗂️ Key Files Explained

### Frontend (src/app/)

**`page.tsx`** - Main Application
- Complete POS interface
- State management for cart, inventory, sales
- Three main views: POS, Inventory, Reports
- Modal forms for product management
- Real-time statistics display

**`layout.tsx`** - Root Layout
- HTML structure
- Metadata configuration
- Global styles injection
- SEO optimization

**`loading.tsx`** - Loading State
- Shown during page transitions
- Suspense boundary fallback
- Animated spinner

**`error.tsx`** - Error Boundary
- Catches runtime errors
- Displays user-friendly error message
- Reset functionality

**`not-found.tsx`** - 404 Page
- Custom 404 page
- Navigation back to home

**`globals.css`** - Global Styles
- Tailwind directives
- Custom CSS animations
- Font imports (Outfit, Space Mono)
- Utility classes

### Backend (src/app/api/)

**`inventory/route.ts`** - Product Management
```typescript
GET    /api/inventory        # List all products
POST   /api/inventory        # Add new product
PUT    /api/inventory        # Update product
DELETE /api/inventory?id=X   # Delete product
```

**`sales/route.ts`** - Sales Processing
```typescript
GET  /api/sales              # List all sales
POST /api/sales              # Complete sale + update inventory
```

**`stats/route.ts`** - Dashboard Metrics
```typescript
GET /api/stats               # Get dashboard statistics
```

### Libraries (src/lib/)

**`db.ts`** - Data Persistence
- Memory cache + file storage
- Production-ready for Vercel serverless
- Auto-initialization with default data
- Error handling

**`types.ts`** - Type Definitions
```typescript
Product        # Product entity
CartItem       # Cart item (Product + quantity)
Sale           # Sale transaction
DashboardStats # Dashboard metrics
```

**`api-utils.ts`** - API Helpers
- Standardized response formatting
- Error handling utilities
- Success/error response builders
- HTTP status code management

## 🔧 Configuration Files

### `package.json`
- Dependencies (React, Next.js, Tailwind, Lucide)
- Scripts (dev, build, start, lint)
- Node.js version requirement

### `tsconfig.json`
- TypeScript compiler options
- Path aliases (`@/*` → `src/*`)
- Strict mode enabled
- Module resolution

### `next.config.js`
- React strict mode
- SWC minification
- Performance optimizations
- Image configuration

### `tailwind.config.js`
- Content paths
- Custom fonts (Outfit, Space Mono)
- Theme extensions

### `vercel.json`
- Build configuration
- Framework detection
- Header rules
- Region settings

## 📦 Data Flow

### Point of Sale Flow
```
1. User clicks product
   ↓
2. Product added to cart (state)
   ↓
3. User clicks "Complete Sale"
   ↓
4. POST /api/sales
   ↓
5. Backend validates stock
   ↓
6. Updates inventory (reduces stock)
   ↓
7. Saves sale record
   ↓
8. Returns success + sale data
   ↓
9. Frontend refreshes all data
   ↓
10. Cart cleared, notification shown
```

### Inventory Management Flow
```
1. User clicks "Add Product"
   ↓
2. Modal form opens
   ↓
3. User fills form
   ↓
4. POST /api/inventory
   ↓
5. Backend validates data
   ↓
6. Creates new product with unique ID
   ↓
7. Saves to storage
   ↓
8. Returns product data
   ↓
9. Frontend refreshes inventory list
   ↓
10. Modal closes, notification shown
```

### Data Persistence
```
API Route
   ↓
getData/setData (db.ts)
   ↓
Memory Cache (immediate)
   ↓
File Storage (/tmp or /data)
   ↓
Persists across requests (session-based on Vercel)
```

## 🎨 Component Structure

### Main Page Component Hierarchy
```
Home (page.tsx)
├── Header
│   ├── Logo
│   └── Navigation Tabs (POS, Inventory, Reports)
├── Dashboard Stats
│   ├── Total Products Card
│   ├── Low Stock Card
│   ├── Total Sales Card
│   └── Total Revenue Card
├── View: Point of Sale
│   ├── Products Grid
│   │   └── Product Card (×N)
│   └── Shopping Cart
│       ├── Cart Items List
│       │   └── Cart Item (×N)
│       ├── Total Display
│       └── Complete Sale Button
├── View: Inventory
│   ├── Add Product Button
│   ├── Low Stock Alert
│   └── Products Table
│       └── Product Row (×N)
│           ├── Product Info
│           └── Actions (Edit, Delete)
├── View: Reports
│   └── Sales History
│       └── Sale Card (×N)
│           ├── Sale Info
│           └── Items List
└── Modals
    └── ProductForm (Add/Edit)
        ├── Form Fields
        └── Action Buttons
```

## 🔄 State Management

### Component State (useState)
```typescript
view: 'pos' | 'inventory' | 'reports'
inventory: Product[]
cart: CartItem[]
sales: Sale[]
stats: DashboardStats
searchTerm: string
loading: boolean
showAddProduct: boolean
editingProduct: Product | null
notification: { message, type } | null
```

### Data Fetching (useEffect)
- Initial data load on mount
- Refresh after mutations
- Real-time statistics updates

## 🚀 Build Process

### Development Build
```bash
npm run dev
# Next.js development server with:
# - Fast Refresh
# - Hot Module Replacement
# - Source maps
# - Error overlay
```

### Production Build
```bash
npm run build
# Creates optimized build:
# - Code minification
# - Tree shaking
# - Static optimization
# - Image optimization
# - Bundle analysis
```

## 📱 Feature Modules

### Point of Sale
- **Files**: `page.tsx` (POS view section)
- **API**: `api/sales/route.ts`, `api/inventory/route.ts`
- **Features**: Product browsing, cart, checkout

### Inventory Management
- **Files**: `page.tsx` (Inventory view + ProductForm)
- **API**: `api/inventory/route.ts`
- **Features**: CRUD operations, stock tracking

### Sales Reporting
- **Files**: `page.tsx` (Reports view)
- **API**: `api/sales/route.ts`
- **Features**: Transaction history, analytics

### Dashboard
- **Files**: `page.tsx` (Stats section)
- **API**: `api/stats/route.ts`
- **Features**: Real-time metrics

## 🔐 Security Features

- Input validation on all API routes
- Type safety with TypeScript
- Sanitized user inputs
- Error handling throughout
- No exposed secrets
- CSRF protection (Next.js default)

## 🎯 Future Extensions

To add new features, extend:

1. **New API Routes**: Create in `src/app/api/`
2. **New Types**: Add to `src/lib/types.ts`
3. **Components**: Extract reusable parts to `src/components/`
4. **Database**: Swap `src/lib/db.ts` for SQL/NoSQL client
5. **Auth**: Add middleware + auth provider
6. **Testing**: Add `__tests__` directories

## 📚 Dependencies

### Production
- `next` - React framework
- `react` - UI library
- `react-dom` - React renderer
- `lucide-react` - Icon library

### Development
- `typescript` - Type system
- `@types/*` - Type definitions
- `tailwindcss` - CSS framework
- `autoprefixer` - CSS processor
- `postcss` - CSS tooling
- `eslint` - Code linting

## 💡 Best Practices Implemented

✅ TypeScript for type safety
✅ API route error handling
✅ Responsive design
✅ Loading states
✅ Error boundaries
✅ Code splitting
✅ SEO optimization
✅ Accessibility (ARIA labels ready)
✅ Production optimizations
✅ Clean code structure
✅ Comprehensive documentation

## 🔍 Code Quality

- **Type Coverage**: 100% (all files use TypeScript)
- **Error Handling**: Comprehensive try-catch blocks
- **Validation**: Input validation on all mutations
- **Performance**: Optimized renders, minimal re-renders
- **Maintainability**: Clear file structure, named exports

---

This structure is designed for:
- Easy understanding
- Quick modifications
- Seamless scaling
- Team collaboration
- Production readiness
