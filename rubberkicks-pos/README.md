# RubberKicks POS - Point of Sale & Inventory Management System

A modern, full-stack point of sale and inventory management system designed for rubber shoe shops. Built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

### 🛒 Point of Sale
- Intuitive product browsing with search functionality
- Real-time shopping cart with quantity controls
- Instant checkout processing
- Stock validation during sales

### 📦 Inventory Management
- Add, edit, and delete products
- Track stock levels in real-time
- Low stock alerts (< 10 units)
- Comprehensive product details (size, color, category, price)

### 📊 Sales Reports
- Complete sales history
- Transaction details with timestamps
- Revenue tracking
- Sales analytics

### 📈 Dashboard
- Real-time statistics
- Total products count
- Low stock item alerts
- Total sales and revenue metrics

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel
- **Storage**: File-based (development) / Vercel KV (production)

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository or extract the zip file
2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file (copy from `.env.example`):

```bash
cp .env.example .env.local
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment to Vercel

### Option 1: Deploy from GitHub

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js and configure everything
6. Click "Deploy"

### Option 2: Deploy using Vercel CLI

1. Install Vercel CLI:

```bash
npm install -g vercel
```

2. Login to Vercel:

```bash
vercel login
```

3. Deploy:

```bash
vercel
```

4. Follow the prompts to complete deployment

### Option 3: Deploy from ZIP

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Choose "Import Third-Party Git Repository"
4. Or use the Vercel CLI to deploy from local files

### Environment Variables (Optional)

For production with Vercel KV storage (recommended for scalability):

1. Add a Vercel KV Database in your project dashboard
2. Vercel will automatically add these environment variables:
   - `KV_URL`
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`

The app automatically detects KV availability and uses it when configured. Otherwise, it falls back to file-based storage.

## Project Structure

```
rubberkicks-pos/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── inventory/     # Inventory CRUD endpoints
│   │   │   ├── sales/         # Sales endpoints
│   │   │   └── stats/         # Dashboard statistics
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Main POS interface
│   │   └── globals.css        # Global styles
│   └── lib/
│       ├── db.ts              # Database utilities
│       └── types.ts           # TypeScript types
├── public/                    # Static assets
├── data/                      # Local data storage (gitignored)
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## API Endpoints

### Inventory
- `GET /api/inventory` - Get all products
- `POST /api/inventory` - Add new product
- `PUT /api/inventory` - Update product
- `DELETE /api/inventory?id={id}` - Delete product

### Sales
- `GET /api/sales` - Get all sales
- `POST /api/sales` - Create new sale (with automatic inventory update)

### Stats
- `GET /api/stats` - Get dashboard statistics

## Features in Detail

### Persistent Storage
- Data persists across sessions
- Supports both file-based (local) and Vercel KV (production) storage
- Automatic fallback mechanism

### Real-time Updates
- Dashboard statistics update after each sale
- Stock levels adjust automatically
- Instant UI feedback

### Responsive Design
- Works on desktop, tablet, and mobile devices
- Touch-friendly interface
- Adaptive layouts

### User Experience
- Smooth animations and transitions
- Toast notifications for user actions
- Loading states
- Error handling

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `.next` folder.

## Default Data

The system comes pre-loaded with 5 sample products:
1. Classic Rain Boot
2. Sport Sneaker
3. Garden Clog
4. Beach Sandal
5. Work Boot

You can delete or modify these through the Inventory Management interface.

## Support & Customization

### Customizing Categories
Edit the category dropdown in `src/app/page.tsx` (ProductForm component)

### Adjusting Low Stock Threshold
Change the threshold in `src/lib/db.ts` and API routes (currently set to 10)

### Styling
All styles use Tailwind CSS. Modify `tailwind.config.js` for theme customization.

## Performance

- Server-side rendering for fast initial loads
- API routes for efficient data handling
- Optimized bundle size
- CDN delivery via Vercel Edge Network

## Security Notes

- This is a demo/starter application
- For production use, add authentication
- Consider implementing role-based access control
- Add rate limiting for API routes
- Implement proper input validation

## License

MIT

## Author

Built with Next.js, TypeScript, and ❤️

---

For questions or issues, please refer to the Next.js documentation at [nextjs.org](https://nextjs.org).
