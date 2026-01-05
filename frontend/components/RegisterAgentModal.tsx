"use client";

import { useState, useEffect } from "react";
import { useRegisterAgent, useMinimumStake } from "@/hooks/useAgentRegistry";
import { Card, Button } from "@/components/UI";
import { formatEth } from "@/utils/formatting";

interface RegisterAgentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function RegisterAgentModal({
    isOpen,
    onClose,
}: RegisterAgentModalProps) {
    const [metadataURI, setMetadataURI] = useState("");
    const [capabilities, setCapabilities] = useState("");
    const [endpoint, setEndpoint] = useState("");
    const [stakeAmount, setStakeAmount] = useState("");

    // Get minimum stake from AgentRegistry contract
    const minimumStake = useMinimumStake();

    // Hook to register agent - calls AgentRegistry.registerAgent()
    const { registerAgent, isPending, isSuccess } = useRegisterAgent();

    useEffect(() => {
        if (minimumStake) {
            setStakeAmount(formatEth(minimumStake, 3));
        }
    }, [minimumStake]);

    useEffect(() => {
        if (isSuccess) {
            onClose();
            setMetadataURI("");
            setCapabilities("");
            setEndpoint("");
        }
    }, [isSuccess, onClose]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!capabilities || !stakeAmount) return;

        // Call AgentRegistry.registerAgent(metadataURI, capabilities, endpoint) payable
        await registerAgent(metadataURI, capabilities, endpoint, stakeAmount);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="max-w-2xl w-full">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">
                            Register as Agent
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white text-2xl"
                        >
                            ×
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Capabilities *
                            </label>
                            <input
                                type="text"
                                value={capabilities}
                                onChange={(e) =>
                                    setCapabilities(e.target.value)
                                }
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                                placeholder="e.g., Data Analysis, ML Training, Code Generation"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Metadata URI
                            </label>
                            <input
                                type="text"
                                value={metadataURI}
                                onChange={(e) => setMetadataURI(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                                placeholder="ipfs://... or https://..."
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Optional: Link to agent metadata (IPFS, Arweave,
                                etc.)
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Endpoint
                            </label>
                            <input
                                type="text"
                                value={endpoint}
                                onChange={(e) => setEndpoint(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                                placeholder="https://api.myagent.com or wss://..."
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Optional: API endpoint for agent communication
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Stake Amount (ETH) *
                            </label>
                            <input
                                type="number"
                                step="0.001"
                                min={
                                    minimumStake
                                        ? formatEth(minimumStake, 3)
                                        : "0.01"
                                }
                                value={stakeAmount}
                                onChange={(e) => setStakeAmount(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Minimum:{" "}
                                {minimumStake
                                    ? formatEth(minimumStake, 3)
                                    : "0.01"}{" "}
                                ETH
                            </p>
                        </div>

                        <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
                            <p className="text-sm text-blue-400">
                                <strong>Registration:</strong> Your stake will
                                be locked in the AgentRegistry contract. You can
                                withdraw it later (maintaining minimum) or upon
                                deactivation.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                type="button"
                                onClick={onClose}
                                variant="secondary"
                                className="flex-1"
                                disabled={isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1"
                                disabled={
                                    isPending || !capabilities || !stakeAmount
                                }
                            >
                                {isPending
                                    ? "Registering..."
                                    : "Register Agent"}
                            </Button>
                        </div>
                    </form>
                </div>
            </Card>
        </div>
    );
}
