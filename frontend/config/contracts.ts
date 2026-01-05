// Contract addresses - Update these after deploying contracts
// These should match the deployed contract addresses from your deployment scripts

export const CONTRACTS = {
    // Sepolia Testnet addresses (update after deployment)
    AgentRegistry:
        process.env.NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS ||
        "0x0000000000000000000000000000000000000000",
    AgentEscrow:
        process.env.NEXT_PUBLIC_AGENT_ESCROW_ADDRESS ||
        "0x0000000000000000000000000000000000000000",
    ReputationManager:
        process.env.NEXT_PUBLIC_REPUTATION_MANAGER_ADDRESS ||
        "0x0000000000000000000000000000000000000000",
} as const;

export const SUPPORTED_CHAINS = {
    sepolia: 11155111,
    // Add more chains as needed
} as const;

export const DEFAULT_CHAIN_ID = SUPPORTED_CHAINS.sepolia;
