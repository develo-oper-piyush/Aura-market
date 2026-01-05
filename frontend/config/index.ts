// Export contract addresses for easy import
export { CONTRACTS, SUPPORTED_CHAINS, DEFAULT_CHAIN_ID } from "./contracts";

// Export ABIs
export { AgentRegistryABI, AgentEscrowABI, ReputationManagerABI } from "./abis";

// Import CONTRACTS for internal use
import { CONTRACTS } from "./contracts";

// Contract metadata
export const CONTRACT_METADATA = {
    AgentRegistry: {
        name: "Agent Registry",
        description: "On-chain agent registration with stake and capabilities",
        address: process.env.NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS,
    },
    AgentEscrow: {
        name: "Agent Escrow",
        description: "Job creation and trustless payment settlement",
        address: process.env.NEXT_PUBLIC_AGENT_ESCROW_ADDRESS,
    },
    ReputationManager: {
        name: "Reputation Manager",
        description: "On-chain reputation and trust scoring",
        address: process.env.NEXT_PUBLIC_REPUTATION_MANAGER_ADDRESS,
    },
} as const;

// Validate all contract addresses are set
export function validateContractAddresses(): boolean {
    const { AgentRegistry, AgentEscrow, ReputationManager } = CONTRACTS;

    if (
        AgentRegistry === "0x0000000000000000000000000000000000000000" ||
        AgentEscrow === "0x0000000000000000000000000000000000000000" ||
        ReputationManager === "0x0000000000000000000000000000000000000000"
    ) {
        console.error("⚠️ Contract addresses not configured!");
        console.error("Please set environment variables in .env.local");
        return false;
    }

    return true;
}
