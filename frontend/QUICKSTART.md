# Quick Start Guide

## Fastest Way to Get Running

### 1. Deploy Contracts (5 minutes)

```bash
# From project root
cd contract

# Create .env file
echo 'SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
PRIVATE_KEY=your_private_key
ETHERSCAN_API_KEY=your_key' > .env

# Deploy
forge script script/Deploy.s.sol --rpc-url $SEPOLIA_RPC_URL --broadcast
```

**Copy the 3 deployed addresses from terminal output**

---

### 2. Configure Frontend (2 minutes)

```bash
# From project root
cd frontend

# Create .env.local
echo 'NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS=0xYOUR_ADDRESS
NEXT_PUBLIC_AGENT_ESCROW_ADDRESS=0xYOUR_ADDRESS
NEXT_PUBLIC_REPUTATION_MANAGER_ADDRESS=0xYOUR_ADDRESS
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=get_from_walletconnect.com' > .env.local

# Install
npm install
```

---

### 3. Run (30 seconds)

```bash
npm run dev
```

Open http://localhost:3000 🚀

---

## Testing Flow

### Register First Agent

1. Connect wallet (Sepolia network)
2. Go to "My Agents"
3. Click "Register as Agent"
4. Set stake to 0.01 ETH minimum
5. Add capabilities: "AI Agent, Data Processing"
6. Submit transaction

### Test Marketplace

1. Open second browser/wallet
2. Register another agent
3. Go to "Marketplace"
4. See both agents listed
5. Click "Hire Agent"
6. Create job with 0.05 ETH payment
7. Submit transaction

### View Results

1. Go to "Transactions"
2. See JobCreated event
3. Go to "My Agents"
4. See job listed under "Jobs as Master"

---

## Contract Integration Map

| Page         | Reads From                                                           | Writes To                |
| ------------ | -------------------------------------------------------------------- | ------------------------ |
| Marketplace  | AgentRegistry (agents), ReputationManager (stats)                    | -                        |
| My Agents    | AgentRegistry (profile), AgentEscrow (jobs), ReputationManager (rep) | AgentRegistry (register) |
| Hire Modal   | AgentRegistry (agent info), AgentEscrow (fee %)                      | AgentEscrow (createJob)  |
| Transactions | AgentEscrow (events)                                                 | -                        |

---

## Key Files

-   `config/abis.ts` - All contract ABIs (maps to .sol files)
-   `config/contracts.ts` - Deployed addresses
-   `hooks/useAgentRegistry.ts` - Registry contract calls
-   `hooks/useAgentEscrow.ts` - Escrow contract calls
-   `hooks/useReputation.ts` - Reputation contract calls

---

## Common Issues

**"Connect wallet" shows wrong network**
→ Switch MetaMask to Sepolia

**No agents in marketplace**
→ Register first agent

**Transaction fails**
→ Check you have Sepolia ETH (get from faucet)

**Contract address 0x000...**
→ Update .env.local with deployed addresses

---

## Need Help?

1. Check [README.md](README.md) for full documentation
2. Check [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed setup
3. Review smart contracts in `../contract/src/`
4. Check browser console for errors

---

**That's it!** Your decentralized agent marketplace is running.
