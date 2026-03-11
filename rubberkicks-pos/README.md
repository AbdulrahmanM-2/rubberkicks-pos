# RubberKicks POS - Point of Sale & Inventory Management System

A modern, full-stack point of sale and inventory management system designed for rubber shoe shops. Built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Quick Deploy (3 Methods)

### Method 1: One-Click Script ⭐ EASIEST
```bash
# Mac/Linux
./deploy.sh

# Windows
deploy.bat
```

### Method 2: Vercel Dashboard
1. Push to GitHub
2. Import to Vercel
3. Deploy (auto-detected)

### Method 3: Vercel CLI
```bash
vercel --prod
```

**📖 Full Guide:** See [FINAL-DEPLOYMENT.md](./FINAL-DEPLOYMENT.md)

---

## ✨ Features

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

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel
- **Storage**: File-based (development) / Memory + /tmp (production)

---

## 📋 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Local Development

1. **Install dependencies:**
```bash
npm install
```

2. **Run development server:**
```bash
npm run dev
```

3. **Open browser:**
```
http://localhost:3000
```

### Production Build

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
rubberkicks-pos/
├── src/
│   ├── app/
│   │   ├── api/              # Backend API routes
│   │   │   ├── inventory/    # Product management
│   │   │   ├── sales/        # Sales transactions
│   │   │   └── stats/        # Dashboard statistics
│   │   ├── page.tsx          # Main POS interface
│   │   ├── layout.tsx        # Root layout
│   │   ├── loading.tsx       # Loading state
│   │   ├── error.tsx         # Error boundary
│   │   └── globals.css       # Global styles
│   └── lib/
│       ├── db.ts             # Database layer
│       ├── types.ts          # TypeScript types
│       └── api-utils.ts      # API utilities
├── public/                   # Static assets
├── .github/workflows/        # GitHub Actions CI/CD
├── deploy.sh                 # Deployment script (Mac/Linux)
├── deploy.bat                # Deployment script (Windows)
└── Documentation files
```

---

## 🔧 Configuration

### No Configuration Required!

This app works out of the box with **zero configuration**:
- ✅ No database setup required
- ✅ No API keys needed
- ✅ No environment variables required
- ✅ No external services needed

### Optional: Persistent Database

For production use, upgrade to persistent storage:

**Upstash Redis** (Recommended):
1. Create database at https://upstash.com
2. Add environment variables in Vercel
3. Update `src/lib/db.ts`
4. Redeploy

See [FINAL-DEPLOYMENT.md](./FINAL-DEPLOYMENT.md) for detailed instructions.

---

## 📚 Documentation

- **[README.md](./README.md)** - This file (overview)
- **[FINAL-DEPLOYMENT.md](./FINAL-DEPLOYMENT.md)** - Complete deployment guide ⭐
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Quick deployment guide
- **[PRODUCTION.md](./PRODUCTION.md)** - Production best practices
- **[STRUCTURE.md](./STRUCTURE.md)** - Codebase walkthrough
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Common issues

---

## 🎯 API Endpoints

### Inventory
- `GET /api/inventory` - List all products
- `POST /api/inventory` - Add new product
- `PUT /api/inventory` - Update product
- `DELETE /api/inventory?id={id}` - Delete product

### Sales
- `GET /api/sales` - List all sales
- `POST /api/sales` - Complete sale (updates inventory)

### Stats
- `GET /api/stats` - Get dashboard statistics

---

## 🎨 Features in Detail

### Persistent Storage
- Data persists across sessions
- Supports file-based (local) and memory (serverless) storage
- Automatic fallback mechanism
- Production-ready for Vercel

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
- Comprehensive error handling

---

## 🚦 Default Data

The system comes pre-loaded with 5 sample products:
1. Classic Rain Boot - $45.99
2. Sport Sneaker - $65.99
3. Garden Clog - $29.99
4. Beach Sandal - $24.99
5. Work Boot - $79.99

You can delete or modify these through the Inventory Management interface.

---

## 🎛️ Customization

### Changing Categories
Edit the category dropdown in `src/app/page.tsx` (ProductForm component)

### Adjusting Low Stock Threshold
Change the threshold in relevant files (currently set to 10)

### Styling
All styles use Tailwind CSS. Modify `tailwind.config.js` for theme customization.

---

## 🚀 Deployment

### Quick Deploy with Script
```bash
# Make script executable (Mac/Linux only, first time)
chmod +x deploy.sh

# Deploy
./deploy.sh  # Mac/Linux
deploy.bat   # Windows
```

### GitHub Actions (CI/CD)
Automatic deployment on push to main branch:
1. Add secrets to GitHub repo
2. Push code
3. GitHub Actions deploys automatically

See `.github/workflows/deploy.yml` for configuration.

---

## 📊 Performance

- **Server-side rendering** for fast initial loads
- **API routes** for efficient data handling
- **Optimized bundle size**
- **CDN delivery** via Vercel Edge Network

**Expected Metrics:**
- First Load: < 3 seconds
- Lighthouse Score: > 90
- Build Time: ~60 seconds

---

## 🔐 Security

- Input validation on all API routes
- Type safety with TypeScript
- Sanitized user inputs
- Error handling throughout
- No exposed secrets
- CSRF protection (Next.js default)

---

## 🎓 Scripts

```bash
npm run dev          # Start development server
npm run build        # Create production build
npm start            # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
npm run clean        # Clean build artifacts
```

---

## 🐛 Troubleshooting

### Build fails?
- Check Node.js version (need 18+)
- Run `npm install` locally first
- Check build logs in Vercel dashboard
- See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

### Data not persisting?
- Expected with default file storage on Vercel
- Upgrade to persistent database (see docs)
- Or accept session-based storage for MVP

### Need help?
- Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- Read [FINAL-DEPLOYMENT.md](./FINAL-DEPLOYMENT.md)
- Review Vercel docs: https://vercel.com/docs
- Check Next.js docs: https://nextjs.org/docs

---

## 📈 Future Enhancements

### Suggested Features:
- User authentication
- Multi-store support
- Barcode scanning
- Receipt printing
- Email notifications
- Customer management
- Loyalty programs
- Advanced analytics
- Mobile app
- Offline mode

---

## 🤝 Contributing

This is a starter template. Feel free to:
- Fork the repository
- Add new features
- Submit pull requests
- Report issues
- Share improvements

---

## 📄 License

MIT License

Copyright (c) 2024 RubberKicks POS

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org) - React framework
- [Tailwind CSS](https://tailwindcss.com) - CSS framework
- [Lucide React](https://lucide.dev) - Icon library
- [Vercel](https://vercel.com) - Deployment platform

---

## 📞 Support

For questions or issues:
- Review documentation in this repository
- Check Vercel documentation
- Visit Next.js documentation
- Search GitHub discussions

---

## ✅ Quick Verification

After deployment, verify:
- [ ] Homepage loads without errors
- [ ] Dashboard shows statistics
- [ ] Can add products to cart
- [ ] Can complete sale
- [ ] Inventory updates after sale
- [ ] Can manage products (add/edit/delete)
- [ ] Sales appear in reports
- [ ] Mobile responsive
- [ ] No console errors

---

## 🎉 Ready to Deploy!

Choose your deployment method:
1. **One-Click Script**: `./deploy.sh` or `deploy.bat`
2. **GitHub + Vercel**: Push to GitHub, import to Vercel
3. **Vercel CLI**: `vercel --prod`

See **[FINAL-DEPLOYMENT.md](./FINAL-DEPLOYMENT.md)** for complete instructions.

**Your POS system can be live in under 3 minutes!** 🚀

---

**Built with ❤️ using Next.js**