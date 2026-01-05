"use client";

import {
    useReadContract,
    useWriteContract,
    useWaitForTransactionReceipt,
} from "wagmi";
import { AgentRegistryABI } from "@/config/abis";
import { CONTRACTS } from "@/config/contracts";
import { AgentProfile } from "@/types/contracts";
import { parseEther } from "viem";

// Read all registered agents from AgentRegistry contract
export function useAgents() {
    // Get total agent count
    const { data: agentCount } = useReadContract({
        address: CONTRACTS.AgentRegistry as `0x${string}`,
        abi: AgentRegistryABI,
        functionName: "getAgentCount",
    });

    return {
        agentCount: agentCount ? Number(agentCount) : 0,
    };
}

// Read specific agent profile by address
export function useAgentProfile(agentAddress?: string) {
    const { data, isLoading, error } = useReadContract({
        address: CONTRACTS.AgentRegistry as `0x${string}`,
        abi: AgentRegistryABI,
        functionName: "getAgent",
        args: agentAddress ? [agentAddress as `0x${string}`] : undefined,
        query: {
            enabled: !!agentAddress,
        },
    });

    return {
        profile: data as AgentProfile | undefined,
        isLoading,
        error,
    };
}

// Get agent address by index
export function useAgentByIndex(index: number) {
    const { data, isLoading } = useReadContract({
        address: CONTRACTS.AgentRegistry as `0x${string}`,
        abi: AgentRegistryABI,
        functionName: "getAgentByIndex",
        args: [BigInt(index)],
        query: {
            enabled: index >= 0,
        },
    });

    return {
        agentAddress: data as string | undefined,
        isLoading,
    };
}

// Get minimum stake requirement
export function useMinimumStake() {
    const { data } = useReadContract({
        address: CONTRACTS.AgentRegistry as `0x${string}`,
        abi: AgentRegistryABI,
        functionName: "MINIMUM_STAKE",
    });

    return data as bigint | undefined;
}

// Register new agent - calls AgentRegistry.registerAgent()
export function useRegisterAgent() {
    const { writeContract, data: hash, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt(
        { hash }
    );

    const registerAgent = async (
        metadataURI: string,
        capabilities: string,
        endpoint: string,
        stakeAmount: string
    ) => {
        writeContract({
            address: CONTRACTS.AgentRegistry as `0x${string}`,
            abi: AgentRegistryABI,
            functionName: "registerAgent",
            args: [metadataURI, capabilities, endpoint],
            value: parseEther(stakeAmount),
        });
    };

    return {
        registerAgent,
        isPending: isPending || isConfirming,
        isSuccess,
        hash,
    };
}

// Update agent profile - calls AgentRegistry.updateAgentProfile()
export function useUpdateAgentProfile() {
    const { writeContract, data: hash, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt(
        { hash }
    );

    const updateProfile = async (
        metadataURI: string,
        capabilities: string,
        endpoint: string
    ) => {
        writeContract({
            address: CONTRACTS.AgentRegistry as `0x${string}`,
            abi: AgentRegistryABI,
            functionName: "updateAgentProfile",
            args: [metadataURI, capabilities, endpoint],
        });
    };

    return {
        updateProfile,
        isPending: isPending || isConfirming,
        isSuccess,
        hash,
    };
}
