#!/bin/bash

# Aura Market - Frontend Setup Script
# This script helps you set up the frontend development environment

set -e  # Exit on error

echo "🚀 Aura Market Frontend Setup"
echo "=============================="
echo ""

# Check if we're in the frontend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found"
    echo "Please run this script from the frontend directory"
    exit 1
fi

echo "📦 Step 1: Installing dependencies..."
npm install

echo ""
echo "✅ Dependencies installed!"
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found"
    echo "Creating .env.local from template..."
    
    if [ -f ".env.template" ]; then
        cp .env.template .env.local
        echo "✅ Created .env.local"
        echo ""
        echo "⚠️  IMPORTANT: You must configure .env.local with:"
        echo "   1. Deployed contract addresses"
        echo "   2. WalletConnect Project ID"
        echo ""
        echo "See DEPLOYMENT_GUIDE.md for details"
    else
        echo "❌ Error: .env.template not found"
        exit 1
    fi
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "🔍 Checking .env.local configuration..."

# Check if contract addresses are set
if grep -q "NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS=$" .env.local || \
   grep -q "NEXT_PUBLIC_AGENT_ESCROW_ADDRESS=$" .env.local || \
   grep -q "NEXT_PUBLIC_REPUTATION_MANAGER_ADDRESS=$" .env.local; then
    echo ""
    echo "⚠️  WARNING: Contract addresses not configured in .env.local"
    echo ""
    echo "Before running the app, you need to:"
    echo "  1. Deploy smart contracts (see ../contract/)"
    echo "  2. Copy deployed addresses to .env.local"
    echo "  3. Get WalletConnect Project ID from https://cloud.walletconnect.com/"
    echo ""
else
    echo "✅ Contract addresses appear to be configured"
fi

echo ""
echo "=============================="
echo "🎉 Setup Complete!"
echo "=============================="
echo ""
echo "Next steps:"
echo ""
echo "1. Configure .env.local with contract addresses"
echo "   Edit: .env.local"
echo ""
echo "2. Run development server:"
echo "   npm run dev"
echo ""
echo "3. Open browser:"
echo "   http://localhost:3000"
echo ""
echo "For detailed instructions, see:"
echo "  - QUICKSTART.md (fast setup)"
echo "  - DEPLOYMENT_GUIDE.md (complete guide)"
echo "  - README.md (documentation)"
echo ""
echo "Happy coding! 🚀"
