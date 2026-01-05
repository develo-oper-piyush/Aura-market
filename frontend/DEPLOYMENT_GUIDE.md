# DEPLOYMENT_GUIDE.md

## Complete Deployment Guide for Aura Market

### Prerequisites

-   Node.js 18+ installed
-   MetaMask or compatible wallet
-   Sepolia ETH for gas fees
-   Foundry installed (for contract deployment)

---

## Step 1: Deploy Smart Contracts

### 1.1 Navigate to Contract Directory

```bash
cd contract
```

### 1.2 Install Dependencies

```bash
forge install
```

### 1.3 Set Environment Variables

Create `contract/.env`:

```bash
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### 1.4 Deploy Contracts

```bash
# Build contracts
forge build

# Deploy to Sepolia
forge script script/Deploy.s.sol:Deploy --rpc-url $SEPOLIA_RPC_URL --broadcast --verify -vvvv

# Or using environment variables
source .env
forge script script/Deploy.s.sol:Deploy --rpc-url $SEPOLIA_RPC_URL --private-key $PRIVATE_KEY --broadcast --verify
```

### 1.5 Save Deployment Addresses

After deployment, you'll see output like:

```
AgentRegistry deployed at: 0x1234...
AgentEscrow deployed at: 0x5678...
ReputationManager deployed at: 0x9abc...
```

**Save these addresses!** You'll need them for the frontend.

---

## Step 2: Configure Frontend

### 2.1 Navigate to Frontend Directory

```bash
cd ../frontend
```

### 2.2 Install Dependencies

```bash
npm install
```

### 2.3 Create Environment File

Create `frontend/.env.local`:

```bash
# Deployed contract addresses from Step 1.5
NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS=0x1234...
NEXT_PUBLIC_AGENT_ESCROW_ADDRESS=0x5678...
NEXT_PUBLIC_REPUTATION_MANAGER_ADDRESS=0x9abc...

# WalletConnect Project ID (get from https://cloud.walletconnect.com/)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

### 2.4 Get WalletConnect Project ID

1. Go to https://cloud.walletconnect.com/
2. Sign up / Log in
3. Create a new project
4. Copy the Project ID
5. Add to `.env.local`

---

## Step 3: Test Locally

### 3.1 Run Development Server

```bash
npm run dev
```

### 3.2 Open Browser

Navigate to http://localhost:3000

### 3.3 Connect Wallet

1. Click "Connect Wallet" button
2. Select MetaMask
3. Ensure you're on Sepolia network
4. Approve connection

### 3.4 Test Agent Registration

1. Go to "My Agents" page
2. Click "Register as Agent"
3. Fill in:
    - Capabilities: "Data Analysis, ML Training"
    - Stake: 0.01 ETH (minimum)
4. Submit transaction
5. Wait for confirmation

### 3.5 Test Marketplace

1. Go to "Marketplace" page
2. You should see your registered agent
3. Try hiring your own agent (will fail - cannot hire self)
4. Register a second agent from different wallet to test hiring

---

## Step 4: Deploy Frontend to Production

### Option A: Vercel (Recommended)

#### 4.1 Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/aura-market.git
git push -u origin main
```

#### 4.2 Deploy on Vercel

1. Go to https://vercel.com
2. Click "Import Project"
3. Select your GitHub repository
4. Root Directory: `frontend`
5. Add Environment Variables:
    - `NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS`
    - `NEXT_PUBLIC_AGENT_ESCROW_ADDRESS`
    - `NEXT_PUBLIC_REPUTATION_MANAGER_ADDRESS`
    - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
6. Click Deploy

#### 4.3 Access Your DApp

Your app will be live at: `https://your-project.vercel.app`

---

### Option B: Build and Self-Host

#### 4.1 Build Production Bundle

```bash
npm run build
```

#### 4.2 Test Production Build Locally

```bash
npm start
```

#### 4.3 Deploy to Your Server

-   Upload `.next` folder
-   Upload `public` folder
-   Upload `package.json`
-   Upload `.env.local` (or set env vars on server)
-   Run `npm install --production`
-   Run `npm start` or use PM2:
    ```bash
    pm2 start npm --name "aura-market" -- start
    ```

---

## Step 5: Verify Everything Works

### 5.1 Checklist

-   [ ] Smart contracts deployed and verified on Etherscan
-   [ ] Frontend loads without errors
-   [ ] Wallet connects successfully
-   [ ] Network is Sepolia
-   [ ] Marketplace shows registered agents
-   [ ] Can register as agent
-   [ ] Can create jobs (hire agents)
-   [ ] Transactions page shows events
-   [ ] Block explorer links work

### 5.2 Test User Flow

**As Agent (Worker):**

1. Register as agent with stake
2. View profile in "My Agents"
3. Check reputation stats

**As Hiring Agent (Master):**

1. Browse marketplace
2. Hire an agent
3. Lock payment in escrow
4. View job in "My Agents" → "Jobs as Master"

**Transaction History:**

1. Go to "Transactions" page
2. See JobCreated event
3. Click transaction hash
4. Verify on Etherscan

---

## Step 6: Initialize Demo Data (Optional)

If you want to populate the marketplace with demo agents:

### 6.1 Run Setup Demo Script

```bash
cd contract
forge script script/SetupDemo.s.sol --rpc-url $SEPOLIA_RPC_URL --broadcast
```

This will:

-   Register multiple agents
-   Create sample jobs
-   Build initial reputation

---

## Troubleshooting

### Contract Not Found

**Error:** `Contract address 0x0000...`
**Fix:** Make sure `.env.local` has correct deployed addresses

### Wrong Network

**Error:** "Switch to Sepolia network"
**Fix:** Change MetaMask network to Sepolia

### Transaction Fails

**Error:** Insufficient funds
**Fix:** Get Sepolia ETH from faucet: https://sepoliafaucet.com/

### WalletConnect Not Working

**Error:** Invalid Project ID
**Fix:** Get valid Project ID from https://cloud.walletconnect.com/

### No Agents in Marketplace

**Reason:** No agents registered yet
**Fix:** Register first agent via "My Agents" page

### Events Not Loading

**Reason:** No transactions yet or RPC rate limit
**Fix:** Wait for transactions or check RPC provider

---

## Production Checklist

Before going live:

-   [ ] Audit smart contracts
-   [ ] Test on testnet extensively
-   [ ] Deploy to mainnet (if needed)
-   [ ] Update `.env.local` with mainnet addresses
-   [ ] Update chain config to mainnet in `Web3Provider.tsx`
-   [ ] Set up monitoring (Tenderly, Blocknative)
-   [ ] Add analytics (optional)
-   [ ] Set up error tracking (Sentry, etc.)
-   [ ] Document API endpoints (if any)
-   [ ] Create user guide

---

## Maintenance

### Update Contract Addresses

If you redeploy contracts:

1. Update `.env.local`
2. Rebuild: `npm run build`
3. Redeploy

### Add New Contract Functions

1. Update ABI in `config/abis.ts`
2. Create hook in `hooks/`
3. Use in components

### Monitor Gas Prices

-   Check Sepolia gas: https://sepolia.etherscan.io/gastracker
-   Optimize contract calls
-   Batch reads where possible

---

## Support & Resources

-   **Sepolia Faucet:** https://sepoliafaucet.com/
-   **Sepolia Explorer:** https://sepolia.etherscan.io/
-   **WalletConnect Docs:** https://docs.walletconnect.com/
-   **Wagmi Docs:** https://wagmi.sh/
-   **Next.js Docs:** https://nextjs.org/docs

---

**Deployment Complete!** 🎉

Your decentralized agent marketplace is now live on-chain.
