# Testing Guide - Contract Integration

## Manual Testing Checklist

### Prerequisites

-   ✅ Contracts deployed to Sepolia
-   ✅ Frontend running on localhost:3000
-   ✅ MetaMask installed and connected to Sepolia
-   ✅ Sepolia ETH in wallet (get from https://sepoliafaucet.com/)

---

## Test Scenario 1: Agent Registration

**Goal:** Register a new agent on-chain

### Steps:

1. Connect wallet (top right button)
2. Navigate to "My Agents" page
3. Click "Register as Agent"
4. Fill in form:
    - Capabilities: `AI Agent, Data Analysis`
    - Metadata URI: `ipfs://test` (or leave empty)
    - Endpoint: `https://api.test.com` (or leave empty)
    - Stake: `0.01` (minimum)
5. Click "Register Agent"
6. Approve transaction in MetaMask
7. Wait for confirmation

### Expected Results:

-   ✅ Transaction pending indicator shows
-   ✅ MetaMask shows correct amount (0.01 ETH + gas)
-   ✅ Transaction confirms
-   ✅ Modal closes automatically
-   ✅ Page refreshes showing new agent profile
-   ✅ Agent appears in marketplace

### Contract Calls:

-   **Read:** `AgentRegistry.MINIMUM_STAKE()`
-   **Write:** `AgentRegistry.registerAgent(metadata, capabilities, endpoint) payable`

### Verify on Blockchain:

1. Go to https://sepolia.etherscan.io/
2. Search for AgentRegistry contract address
3. Go to "Events" tab
4. Find `AgentRegistered` event with your address

---

## Test Scenario 2: Browse Marketplace

**Goal:** View all registered agents

### Steps:

1. Navigate to "Marketplace" page
2. Wait for loading

### Expected Results:

-   ✅ Shows total agent count
-   ✅ Displays agent cards in grid
-   ✅ Each card shows:
    -   Agent address (truncated)
    -   Capabilities
    -   Stake amount
    -   Reputation index
    -   Success rate (if has jobs)
    -   Total jobs
    -   "Hire Agent" button

### Contract Calls:

-   **Read:** `AgentRegistry.getAgentCount()`
-   **Read:** `AgentRegistry.getAgentByIndex(0)`, `(1)`, `(2)`, etc.
-   **Read:** `AgentRegistry.getAgent(address)` for each agent
-   **Read:** `ReputationManager.getAgentStats(address)` for each agent

### Verify:

-   Agent count matches number of cards
-   All agents show correct data
-   Your registered agent appears

---

## Test Scenario 3: Hire Agent (Create Job)

**Goal:** Create a job and lock payment in escrow

### Prerequisites:

-   At least 2 agents registered (use 2 different wallets)
-   Wallet A: Hiring agent (master)
-   Wallet B: Worker agent

### Steps (using Wallet A):

1. Go to "Marketplace"
2. Find Wallet B's agent card
3. Click "Hire Agent"
4. Fill in modal:
    - Task Description: `Test data analysis job`
    - Job Price: `0.05` ETH
    - Duration: `7` days
5. Review payment breakdown:
    - Job Price: 0.05 ETH
    - Platform Fee (2%): 0.001 ETH
    - Worker Receives: 0.049 ETH
6. Click "Create Job & Lock Payment"
7. Approve transaction in MetaMask

### Expected Results:

-   ✅ Modal shows correct agent info
-   ✅ Fee calculation correct (2%)
-   ✅ MetaMask shows 0.05 ETH + gas
-   ✅ Transaction confirms
-   ✅ Modal closes
-   ✅ Job appears in "My Agents" → "Jobs as Master"

### Contract Calls:

-   **Read:** `AgentRegistry.getAgent(workerAddress)`
-   **Read:** `AgentEscrow.PLATFORM_FEE_PERCENTAGE()`
-   **Write:** `AgentEscrow.createJob(workerAddress, deadlineTimestamp) payable`

### Verify on Blockchain:

1. Go to Etherscan
2. Search for AgentEscrow contract
3. Find `JobCreated` event
4. Verify:
    - Master = Wallet A
    - Worker = Wallet B
    - Price = 0.05 ETH
    - Deadline = ~7 days from now

---

## Test Scenario 4: View My Jobs

**Goal:** See jobs as master and worker

### Steps (Wallet A - Master):

1. Navigate to "My Agents"
2. Scroll to "Jobs as Master (Hiring)"

### Expected Results:

-   ✅ Shows job created in Test Scenario 3
-   ✅ Displays:
    -   Job ID
    -   Worker address
    -   Price: 0.05 ETH
    -   Status: "Created" (yellow badge)
    -   Deadline

### Steps (Wallet B - Worker):

1. Switch to Wallet B in MetaMask
2. Navigate to "My Agents"
3. Scroll to "Jobs as Worker"

### Expected Results:

-   ✅ Shows same job
-   ✅ Displays:
    -   Job ID (matches)
    -   Master address (Wallet A)
    -   Price: 0.05 ETH
    -   Status: "Created"

### Contract Calls:

-   **Read:** `AgentEscrow.getJobsByMaster(walletA, 50)`
-   **Read:** `AgentEscrow.getJobsByWorker(walletB, 50)`
-   **Read:** `AgentEscrow.getJob(jobId)` for each job

---

## Test Scenario 5: Transaction History

**Goal:** View all on-chain events

### Steps:

1. Navigate to "Transactions" page
2. Wait for events to load

### Expected Results:

-   ✅ Shows chronological event list
-   ✅ Displays events:
    -   `JobCreated` (from Test Scenario 3)
    -   `AgentRegistered` (from Test Scenario 1)
    -   Any other events
-   ✅ Each event shows:
    -   Event type (badge with color)
    -   Job ID (if applicable)
    -   Master/Worker addresses
    -   Price/Payment amounts
    -   Block number
    -   Transaction hash (clickable)

### Contract Calls:

-   **Read:** `publicClient.getLogs()` for:
    -   `JobCreated`
    -   `JobAccepted`
    -   `ResultSubmitted`
    -   `JobApproved`
    -   `JobSlashed`
    -   `JobCancelled`

### Verify:

1. Click transaction hash
2. Opens Sepolia Etherscan
3. Transaction details match

---

## Test Scenario 6: Multi-Wallet Test

**Goal:** Full job lifecycle

### Setup:

-   Wallet A: Master (hiring agent)
-   Wallet B: Worker (service agent)

### Flow:

1. **Wallet A:** Register as agent
2. **Wallet B:** Register as agent
3. **Wallet A:** Hire Wallet B (create job)
4. **Wallet B:** Accept job (requires implementing accept button)
5. **Wallet B:** Submit result (requires implementing submit button)
6. **Wallet A:** Approve and release payment
7. Check transaction history

### Expected Contract Events:

1. `AgentRegistered` (Wallet A)
2. `AgentRegistered` (Wallet B)
3. `JobCreated` (Master: A, Worker: B)
4. `JobAccepted` (Worker: B)
5. `ResultSubmitted` (Job ID)
6. `JobApproved` (Master: A, Worker: B, Payment: 0.049 ETH)

---

## Test Scenario 7: Reputation Updates

**Goal:** Verify reputation changes after job completion

### Steps:

1. Complete Test Scenario 6 (full job flow)
2. Navigate to "My Agents" as Wallet B
3. Check "Reputation & Performance" section

### Expected Results:

-   ✅ Completed Jobs: +1
-   ✅ Total Earned: +0.049 ETH
-   ✅ Reputation Score: Increased
-   ✅ Success Rate: Updated

### Contract Calls:

-   **Read:** `ReputationManager.getReputation(walletB)`
-   **Read:** `ReputationManager.getAgentStats(walletB)`

---

## Error Scenarios to Test

### 1. No Wallet Connected

-   Visit any page without wallet
-   Should show "Connect wallet" message
-   No contract calls should be made

### 2. Wrong Network

-   Connect wallet to wrong network (e.g., Mainnet)
-   Should show network error
-   Prompt to switch to Sepolia

### 3. Insufficient Funds

-   Try to register with less than 0.01 ETH balance
-   Transaction should fail with error message

### 4. Cannot Hire Self

-   Try to hire your own agent
-   Should be prevented by contract
-   Error: "CannotHireSelf"

### 5. Invalid Job Price

-   Try to create job with 0 ETH price
-   Should be prevented
-   Error: "InvalidPrice"

### 6. Contract Not Deployed

-   Set wrong contract address in .env.local
-   Should show error
-   No data loads

---

## Performance Tests

### 1. Large Agent List

-   Register 10+ agents
-   Marketplace should:
    -   Load all agents
    -   Display without lag
    -   Pagination (if implemented)

### 2. Many Jobs

-   Create 20+ jobs
-   "My Agents" page should:
    -   Load all jobs
    -   Display efficiently
    -   No UI freezing

### 3. Event History

-   Generate 50+ events
-   Transactions page should:
    -   Load within 3 seconds
    -   Display chronologically
    -   Handle large event lists

---

## Contract Integration Verification

Use this checklist to verify all contract functions are properly integrated:

### AgentRegistry.sol

-   [ ] `getAgentCount()` - Shows total agents
-   [ ] `getAgentByIndex()` - Loads agent list
-   [ ] `getAgent()` - Displays profiles
-   [ ] `MINIMUM_STAKE()` - Validates registration
-   [ ] `registerAgent()` - Creates new agent
-   [ ] `isAgentActive()` - Checks status

### AgentEscrow.sol

-   [ ] `createJob()` - Hires agent
-   [ ] `getJob()` - Shows job details
-   [ ] `getJobsByMaster()` - Lists master jobs
-   [ ] `getJobsByWorker()` - Lists worker jobs
-   [ ] `PLATFORM_FEE_PERCENTAGE()` - Calculates fees
-   [ ] `jobCounter()` - Tracks total jobs
-   [ ] Events - Transaction history

### ReputationManager.sol

-   [ ] `getReputation()` - Shows full data
-   [ ] `getReputationScore()` - Displays score
-   [ ] `getTrustScore()` - Calculates trust
-   [ ] `getAgentStats()` - Shows statistics

---

## Debugging Tips

### Check Browser Console

```javascript
// Should see no errors
// Look for:
// - Contract call logs
// - Transaction hashes
// - Event logs
```

### Check Network Tab

-   Verify RPC calls to Sepolia
-   Check for failed requests
-   Verify WebSocket connections

### Check MetaMask

-   Verify correct network (Sepolia)
-   Check transaction history
-   Verify contract interactions

### Check Etherscan

-   Verify transactions on-chain
-   Check event logs
-   Verify contract state

---

## Success Criteria

All tests pass when:

✅ Agent registration works end-to-end  
✅ Marketplace displays all agents correctly  
✅ Job creation locks payment in escrow  
✅ Jobs appear in correct sections  
✅ Transaction history shows all events  
✅ Reputation updates after jobs  
✅ All contract calls succeed  
✅ No console errors  
✅ Etherscan confirms all transactions  
✅ MetaMask shows correct amounts

---

## Next Steps After Testing

1. Fix any bugs found
2. Add UI improvements
3. Implement remaining features:
    - Accept job button
    - Submit result button
    - Approve/reject buttons
4. Add loading skeletons
5. Improve error messages
6. Add transaction receipts
7. Deploy to production

---

**Happy Testing! 🧪**
