# Aura Market Frontend - Setup Script for Windows
# Run this in PowerShell

Write-Host "🚀 Aura Market Frontend Setup" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the frontend directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found" -ForegroundColor Red
    Write-Host "Please run this script from the frontend directory" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Step 1: Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "✅ Dependencies installed!" -ForegroundColor Green
Write-Host ""

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "⚠️  .env.local not found" -ForegroundColor Yellow
    Write-Host "Creating .env.local from template..." -ForegroundColor Yellow
    
    if (Test-Path ".env.template") {
        Copy-Item ".env.template" ".env.local"
        Write-Host "✅ Created .env.local" -ForegroundColor Green
        Write-Host ""
        Write-Host "⚠️  IMPORTANT: You must configure .env.local with:" -ForegroundColor Yellow
        Write-Host "   1. Deployed contract addresses" -ForegroundColor Yellow
        Write-Host "   2. WalletConnect Project ID" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "See DEPLOYMENT_GUIDE.md for details" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Error: .env.template not found" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ .env.local already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "🔍 Checking .env.local configuration..." -ForegroundColor Yellow

# Check if contract addresses are set
$envContent = Get-Content ".env.local" -Raw
if ($envContent -match "NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS=$" -or 
    $envContent -match "NEXT_PUBLIC_AGENT_ESCROW_ADDRESS=$" -or 
    $envContent -match "NEXT_PUBLIC_REPUTATION_MANAGER_ADDRESS=$") {
    Write-Host ""
    Write-Host "⚠️  WARNING: Contract addresses not configured in .env.local" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Before running the app, you need to:" -ForegroundColor Yellow
    Write-Host "  1. Deploy smart contracts (see ../contract/)" -ForegroundColor White
    Write-Host "  2. Copy deployed addresses to .env.local" -ForegroundColor White
    Write-Host "  3. Get WalletConnect Project ID from https://cloud.walletconnect.com/" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "✅ Contract addresses appear to be configured" -ForegroundColor Green
}

Write-Host ""
Write-Host "==============================" -ForegroundColor Cyan
Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Configure .env.local with contract addresses" -ForegroundColor White
Write-Host "   Edit: .env.local" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Run development server:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Open browser:" -ForegroundColor White
Write-Host "   http://localhost:3000" -ForegroundColor Gray
Write-Host ""
Write-Host "For detailed instructions, see:" -ForegroundColor Cyan
Write-Host "  - QUICKSTART.md (fast setup)" -ForegroundColor Gray
Write-Host "  - DEPLOYMENT_GUIDE.md (complete guide)" -ForegroundColor Gray
Write-Host "  - README.md (documentation)" -ForegroundColor Gray
Write-Host ""
Write-Host "Happy coding! 🚀" -ForegroundColor Green
