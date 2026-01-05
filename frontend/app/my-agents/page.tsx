"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useAgentProfile, useRegisterAgent } from "@/hooks/useAgentRegistry";
import {
    useJobsByMaster,
    useJobsByWorker,
    useJob,
} from "@/hooks/useAgentEscrow";
import { useReputation } from "@/hooks/useReputation";
import {
    Card,
    Button,
    LoadingSpinner,
    EmptyState,
    Badge,
} from "@/components/UI";
import {
    formatAddress,
    formatEth,
    formatTimestamp,
    getJobStateLabel,
    getJobStateColor,
} from "@/utils/formatting";
import RegisterAgentModal from "@/components/RegisterAgentModal";

interface JobCardProps {
    jobId: bigint;
    type: "master" | "worker";
}

function JobCard({ jobId, type }: JobCardProps) {
    const { job, isLoading } = useJob(jobId);

    if (isLoading) return <LoadingSpinner />;
    if (!job) return null;

    return (
        <Card>
            <div className="space-y-3">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs text-gray-400">
                            Job #{job.jobId.toString()}
                        </p>
                        <p className="text-sm font-mono mt-1">
                            {type === "master" ? "Worker" : "Master"}:{" "}
                            {formatAddress(
                                type === "master" ? job.worker : job.master
                            )}
                        </p>
                    </div>
                    <Badge
                        variant={
                            job.state === 3
                                ? "success"
                                : job.state === 4
                                ? "error"
                                : "default"
                        }
                    >
                        {getJobStateLabel(job.state)}
                    </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-800">
                    <div>
                        <p className="text-xs text-gray-400">Price</p>
                        <p className="text-sm font-semibold">
                            {formatEth(job.price)} ETH
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Deadline</p>
                        <p className="text-sm">
                            {formatTimestamp(job.deadline)}
                        </p>
                    </div>
                </div>

                {job.proofRef && (
                    <div className="pt-2">
                        <p className="text-xs text-gray-400">Proof Reference</p>
                        <p className="text-xs font-mono text-gray-300 break-all">
                            {job.proofRef}
                        </p>
                    </div>
                )}
            </div>
        </Card>
    );
}

export default function MyAgentsPage() {
    const { address: userAddress } = useAccount();
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    // Check if user is registered as agent - calls AgentRegistry.getAgent()
    const { profile, isLoading: profileLoading } = useAgentProfile(userAddress);

    // Get reputation data - calls ReputationManager.getReputation()
    const { reputation } = useReputation(userAddress);

    // Get jobs where user is master (hiring) - calls AgentEscrow.getJobsByMaster()
    const { jobIds: masterJobIds } = useJobsByMaster(userAddress);

    // Get jobs where user is worker (working) - calls AgentEscrow.getJobsByWorker()
    const { jobIds: workerJobIds } = useJobsByWorker(userAddress);

    if (!userAddress) {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold mb-4">My Agents</h1>
                <p className="text-gray-400">
                    Connect your wallet to view your agent profile
                </p>
            </div>
        );
    }

    if (profileLoading) {
        return <LoadingSpinner />;
    }

    const isRegistered = profile?.isActive;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">My Agent Profile</h1>
                    <p className="text-gray-400 mt-1">
                        Manage your agent registration and view your jobs
                    </p>
                </div>
                {!isRegistered && (
                    <Button onClick={() => setShowRegisterModal(true)}>
                        Register as Agent
                    </Button>
                )}
            </div>

            {isRegistered ? (
                <>
                    {/* Agent Profile Card - data from AgentRegistry */}
                    <Card>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold">
                                    Agent Details
                                </h2>
                                <Badge variant="success">Active</Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-400">
                                        Agent Address
                                    </p>
                                    <p className="font-mono text-sm mt-1">
                                        {userAddress}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">
                                        Stake Amount
                                    </p>
                                    <p className="text-lg font-semibold mt-1">
                                        {formatEth(profile.stakeAmount)} ETH
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">
                                        Capabilities
                                    </p>
                                    <p className="text-sm mt-1">
                                        {profile.capabilities ||
                                            "Not specified"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">
                                        Reputation Index
                                    </p>
                                    <p className="text-lg font-semibold mt-1">
                                        {profile.reputationIndex.toString()}
                                    </p>
                                </div>
                            </div>

                            {profile.endpoint && (
                                <div>
                                    <p className="text-sm text-gray-400">
                                        Endpoint
                                    </p>
                                    <p className="font-mono text-xs mt-1 break-all">
                                        {profile.endpoint}
                                    </p>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Reputation Stats Card - data from ReputationManager */}
                    {reputation && (
                        <Card>
                            <h2 className="text-xl font-semibold mb-4">
                                Reputation & Performance
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-sm text-gray-400">
                                        Reputation Score
                                    </p>
                                    <p className="text-2xl font-bold mt-1 text-blue-500">
                                        {reputation.score.toString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">
                                        Completed Jobs
                                    </p>
                                    <p className="text-2xl font-bold mt-1 text-green-500">
                                        {reputation.completedJobs.toString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">
                                        Failed Jobs
                                    </p>
                                    <p className="text-2xl font-bold mt-1 text-red-500">
                                        {reputation.failedJobs.toString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">
                                        Total Earned
                                    </p>
                                    <p className="text-2xl font-bold mt-1">
                                        {formatEth(reputation.totalEarned)} ETH
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Jobs as Worker - data from AgentEscrow.getJobsByWorker() */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">
                            Jobs as Worker
                        </h2>
                        {!workerJobIds || workerJobIds.length === 0 ? (
                            <EmptyState message="No jobs as worker yet" />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {workerJobIds.map((jobId) => (
                                    <JobCard
                                        key={jobId.toString()}
                                        jobId={jobId}
                                        type="worker"
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Jobs as Master - data from AgentEscrow.getJobsByMaster() */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">
                            Jobs as Master (Hiring)
                        </h2>
                        {!masterJobIds || masterJobIds.length === 0 ? (
                            <EmptyState message="No jobs created yet" />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {masterJobIds.map((jobId) => (
                                    <JobCard
                                        key={jobId.toString()}
                                        jobId={jobId}
                                        type="master"
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <EmptyState message="You are not registered as an agent. Register to participate in the marketplace." />
            )}

            {/* Register Agent Modal - triggers AgentRegistry.registerAgent() */}
            <RegisterAgentModal
                isOpen={showRegisterModal}
                onClose={() => setShowRegisterModal(false)}
            />
        </div>
    );
}
