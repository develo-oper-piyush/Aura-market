"use client";

import { useState, useEffect } from "react";
import {
    useAgents,
    useAgentByIndex,
    useAgentProfile,
} from "@/hooks/useAgentRegistry";
import { useAgentStats } from "@/hooks/useReputation";
import {
    Card,
    Button,
    LoadingSpinner,
    EmptyState,
    Badge,
} from "@/components/UI";
import { formatAddress, formatEth } from "@/utils/formatting";
import HireAgentModal from "@/components/HireAgentModal";
import { useAccount } from "wagmi";

interface AgentCardProps {
    agentAddress: string;
    onHire: (address: string) => void;
}

function AgentCard({ agentAddress, onHire }: AgentCardProps) {
    const { profile, isLoading } = useAgentProfile(agentAddress);
    const { stats } = useAgentStats(agentAddress);

    if (isLoading) {
        return (
            <Card>
                <LoadingSpinner />
            </Card>
        );
    }

    if (!profile || !profile.isActive) return null;

    // Calculate success rate percentage from stats
    const successRatePercent = stats?.successRate
        ? Number(stats.successRate) / 100
        : 0;

    return (
        <Card className="hover:border-gray-700 transition-all">
            <div className="space-y-4">
                {/* Agent Address & Status */}
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold font-mono">
                                {formatAddress(agentAddress)}
                            </h3>
                            {profile.isActive && (
                                <Badge variant="success">Active</Badge>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1 font-mono">
                            {agentAddress}
                        </p>
                    </div>
                </div>

                {/* Capabilities */}
                <div>
                    <p className="text-sm text-gray-400 mb-1">Capabilities</p>
                    <p className="text-sm">
                        {profile.capabilities || "Not specified"}
                    </p>
                </div>

                {/* Endpoint */}
                {profile.endpoint && (
                    <div>
                        <p className="text-sm text-gray-400 mb-1">Endpoint</p>
                        <p className="text-xs font-mono text-gray-300 break-all">
                            {profile.endpoint}
                        </p>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800">
                    <div>
                        <p className="text-xs text-gray-400">Stake</p>
                        <p className="text-sm font-semibold">
                            {formatEth(profile.stakeAmount)} ETH
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Reputation</p>
                        <p className="text-sm font-semibold">
                            {profile.reputationIndex.toString()}
                        </p>
                    </div>
                    {stats && (
                        <>
                            <div>
                                <p className="text-xs text-gray-400">
                                    Success Rate
                                </p>
                                <p className="text-sm font-semibold">
                                    {successRatePercent.toFixed(2)}%
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">
                                    Total Jobs
                                </p>
                                <p className="text-sm font-semibold">
                                    {stats.totalJobs.toString()}
                                </p>
                            </div>
                        </>
                    )}
                </div>

                {/* Hire Button */}
                <Button onClick={() => onHire(agentAddress)} className="w-full">
                    Hire Agent
                </Button>
            </div>
        </Card>
    );
}

export default function MarketplacePage() {
    const { address: userAddress } = useAccount();
    const { agentCount } = useAgents();
    const [agentAddresses, setAgentAddresses] = useState<string[]>([]);
    const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch all agent addresses based on agentCount
    // This calls AgentRegistry.getAgentByIndex() for each index
    useEffect(() => {
        if (agentCount > 0) {
            const addresses: string[] = [];
            // We'll fetch them using multiple calls
            for (let i = 0; i < agentCount; i++) {
                // Note: In production, you'd batch this or use a subgraph
                // For now, we'll fetch them individually using the hook
                addresses.push(""); // Placeholder
            }
        }
    }, [agentCount]);

    // Component to fetch and collect agent addresses
    function AgentAddressFetcher({ index }: { index: number }) {
        const { agentAddress } = useAgentByIndex(index);

        useEffect(() => {
            if (agentAddress) {
                setAgentAddresses((prev) => {
                    if (!prev.includes(agentAddress)) {
                        return [...prev, agentAddress];
                    }
                    return prev;
                });
            }
        }, [agentAddress]);

        return null;
    }

    const handleHire = (address: string) => {
        setSelectedAgent(address);
        setIsModalOpen(true);
    };

    if (!userAddress) {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold mb-4">Agent Marketplace</h1>
                <p className="text-gray-400">
                    Connect your wallet to view available agents
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Agent Marketplace</h1>
                    <p className="text-gray-400 mt-1">
                        Discover and hire registered agents from the on-chain
                        registry
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-400">Total Agents</p>
                    <p className="text-2xl font-bold text-blue-500">
                        {agentCount}
                    </p>
                </div>
            </div>

            {/* Hidden components to fetch agent addresses */}
            {agentCount > 0 &&
                Array.from({ length: agentCount }, (_, i) => (
                    <AgentAddressFetcher key={i} index={i} />
                ))}

            {/* Agent Grid - reads from AgentRegistry */}
            {agentCount === 0 ? (
                <EmptyState message="No agents registered yet" />
            ) : agentAddresses.length === 0 ? (
                <LoadingSpinner />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {agentAddresses.map((address) => (
                        <AgentCard
                            key={address}
                            agentAddress={address}
                            onHire={handleHire}
                        />
                    ))}
                </div>
            )}

            {/* Hire Agent Modal - triggers AgentEscrow.createJob() */}
            {selectedAgent && (
                <HireAgentModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedAgent(null);
                    }}
                    agentAddress={selectedAgent}
                />
            )}
        </div>
    );
}
