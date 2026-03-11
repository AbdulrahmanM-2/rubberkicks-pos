#!/bin/bash

# RubberKicks POS - One-Click Deployment Script
# This script automates the deployment process to Vercel

set -e

echo "🚀 RubberKicks POS - Deployment Script"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18 or higher.${NC}"
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version 18 or higher is required. Current version: $(node -v)${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js version: $(node -v)${NC}"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
    echo -e "${GREEN}✅ Vercel CLI installed${NC}"
else
    echo -e "${GREEN}✅ Vercel CLI found${NC}"
fi
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install --silent
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Run type check
echo "🔍 Running type check..."
npm run type-check
echo -e "${GREEN}✅ Type check passed${NC}"
echo ""

# Build the application
echo "🏗️  Building application..."
npm run build
echo -e "${GREEN}✅ Build successful${NC}"
echo ""

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
echo ""
echo -e "${YELLOW}Please follow the Vercel CLI prompts:${NC}"
echo "  - Set up and deploy? Y"
echo "  - Which scope? [Select your account]"
echo "  - Link to existing project? N (for new deployment)"
echo "  - What's your project's name? rubberkicks-pos"
echo "  - In which directory is your code located? ./"
echo "  - Want to override the settings? N"
echo ""

vercel --prod

echo ""
echo -e "${GREEN}======================================"
echo "🎉 Deployment Complete!"
echo "======================================${NC}"
echo ""
echo "Your POS system is now live!"
echo "Check your Vercel dashboard for the deployment URL."
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Visit your deployment URL"
echo "  2. Test all features"
echo "  3. Configure custom domain (optional)"
echo "  4. Set up monitoring (optional)"
echo ""
