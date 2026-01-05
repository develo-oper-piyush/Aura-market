"use client";

import { useReadContract } from "wagmi";
import { ReputationManagerABI } from "@/config/abis";
import { CONTRACTS } from "@/config/contracts";
import { ReputationData, AgentStats } from "@/types/contracts";

// Get full reputation data - calls ReputationManager.getReputation()
export function useReputation(agentAddress?: string) {
    const { data, isLoading } = useReadContract({
        address: CONTRACTS.ReputationManager as `0x${string}`,
        abi: ReputationManagerABI,
        functionName: "getReputation",
        args: agentAddress ? [agentAddress as `0x${string}`] : undefined,
        query: {
            enabled: !!agentAddress,
        },
    });

    return {
        reputation: data as ReputationData | undefined,
        isLoading,
    };
}

// Get reputation score only - calls ReputationManager.getReputationScore()
export function useReputationScore(agentAddress?: string) {
    const { data } = useReadContract({
        address: CONTRACTS.ReputationManager as `0x${string}`,
        abi: ReputationManagerABI,
        functionName: "getReputationScore",
        args: agentAddress ? [agentAddress as `0x${string}`] : undefined,
        query: {
            enabled: !!agentAddress,
        },
    });

    return data as bigint | undefined;
}

// Get trust score - calls ReputationManager.getTrustScore()
export function useTrustScore(agentAddress?: string) {
    const { data } = useReadContract({
        address: CONTRACTS.ReputationManager as `0x${string}`,
        abi: ReputationManagerABI,
        functionName: "getTrustScore",
        args: agentAddress ? [agentAddress as `0x${string}`] : undefined,
        query: {
            enabled: !!agentAddress,
        },
    });

    return data as bigint | undefined;
}

// Get agent stats - calls ReputationManager.getAgentStats()
export function useAgentStats(agentAddress?: string) {
    const { data, isLoading } = useReadContract({
        address: CONTRACTS.ReputationManager as `0x${string}`,
        abi: ReputationManagerABI,
        functionName: "getAgentStats",
        args: agentAddress ? [agentAddress as `0x${string}`] : undefined,
        query: {
            enabled: !!agentAddress,
        },
    });

    // Data is returned as [successRate, totalJobs, trustScore]
    const stats = data as [bigint, bigint, bigint] | undefined;

    return {
        stats: stats
            ? {
                  successRate: stats[0],
                  totalJobs: stats[1],
                  trustScore: stats[2],
              }
            : undefined,
        isLoading,
    };
}
