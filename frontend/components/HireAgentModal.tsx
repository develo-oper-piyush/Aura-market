"use client";

import { useState, useEffect } from "react";
import { useAgentProfile } from "@/hooks/useAgentRegistry";
import { useCreateJob, usePlatformFee } from "@/hooks/useAgentEscrow";
import { Card, Button } from "@/components/UI";
import { formatAddress, formatEth, calculateFee } from "@/utils/formatting";
import { parseEther } from "viem";

interface HireAgentModalProps {
    isOpen: boolean;
    onClose: () => void;
    agentAddress: string;
}

export default function HireAgentModal({
    isOpen,
    onClose,
    agentAddress,
}: HireAgentModalProps) {
    const [price, setPrice] = useState("");
    const [durationDays, setDurationDays] = useState("1");
    const [taskDescription, setTaskDescription] = useState("");

    // Get agent profile data from AgentRegistry
    const { profile } = useAgentProfile(agentAddress);

    // Get platform fee from AgentEscrow contract
    const platformFeePercentage = usePlatformFee();

    // Hook to create job - calls AgentEscrow.createJob()
    const { createJob, isPending, isSuccess } = useCreateJob();

    useEffect(() => {
        if (isSuccess) {
            onClose();
            setPrice("");
            setDurationDays("1");
            setTaskDescription("");
        }
    }, [isSuccess, onClose]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!price || !durationDays) return;

        const deadlineTimestamp =
            Math.floor(Date.now() / 1000) +
            parseInt(durationDays) * 24 * 60 * 60;

        // Call AgentEscrow.createJob(workerAddress, deadline) payable
        await createJob(agentAddress, deadlineTimestamp, price);
    };

    if (!isOpen) return null;

    const priceInWei = price ? parseEther(price) : 0n;
    const platformFee = platformFeePercentage
        ? calculateFee(priceInWei, platformFeePercentage)
        : 0n;
    const workerReceives = priceInWei - platformFee;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Hire Agent</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white text-2xl"
                        >
                            ×
                        </button>
                    </div>

                    {/* Agent Info from AgentRegistry */}
                    {profile && (
                        <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
                            <p className="text-sm text-gray-400">
                                Selected Agent
                            </p>
                            <p className="font-mono text-sm">
                                {formatAddress(agentAddress)}
                            </p>
                            <div className="grid grid-cols-2 gap-4 mt-3">
                                <div>
                                    <p className="text-xs text-gray-400">
                                        Capabilities
                                    </p>
                                    <p className="text-sm">
                                        {profile.capabilities}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">
                                        Stake
                                    </p>
                                    <p className="text-sm">
                                        {formatEth(profile.stakeAmount)} ETH
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Job Creation Form - triggers AgentEscrow.createJob() */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Task Description
                            </label>
                            <textarea
                                value={taskDescription}
                                onChange={(e) =>
                                    setTaskDescription(e.target.value)
                                }
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                                rows={4}
                                placeholder="Describe the task for the agent..."
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                This is for your reference. Task details should
                                be shared off-chain or via proofRef.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Job Price (ETH) *
                            </label>
                            <input
                                type="number"
                                step="0.001"
                                min="0"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                                placeholder="0.1"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Duration (Days) *
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={durationDays}
                                onChange={(e) =>
                                    setDurationDays(e.target.value)
                                }
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                                placeholder="1"
                                required
                            />
                        </div>

                        {/* Fee Breakdown - calculated from AgentEscrow.PLATFORM_FEE_PERCENTAGE */}
                        {price && platformFeePercentage && (
                            <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
                                <p className="text-sm font-medium">
                                    Payment Breakdown
                                </p>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">
                                            Job Price
                                        </span>
                                        <span>{price} ETH</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">
                                            Platform Fee (
                                            {platformFeePercentage.toString()}%)
                                        </span>
                                        <span>
                                            {formatEth(platformFee)} ETH
                                        </span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t border-gray-700 font-semibold">
                                        <span>Worker Receives</span>
                                        <span className="text-blue-500">
                                            {formatEth(workerReceives)} ETH
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4">
                            <p className="text-sm text-yellow-400">
                                <strong>Note:</strong> Payment will be locked in
                                escrow contract. Funds will be released to the
                                worker upon job approval.
                            </p>
                        </div>

                        {/* Submit Button - calls AgentEscrow.createJob() */}
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
                                disabled={isPending || !price}
                            >
                                {isPending
                                    ? "Creating Job..."
                                    : "Create Job & Lock Payment"}
                            </Button>
                        </div>
                    </form>
                </div>
            </Card>
        </div>
    );
}
