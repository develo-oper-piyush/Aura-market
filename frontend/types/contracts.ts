// Contract Type Definitions
// Maps to Solidity struct definitions in contracts

export interface AgentProfile {
    agentAddress: string;
    metadataURI: string;
    capabilities: string;
    endpoint: string;
    stakeAmount: bigint;
    reputationIndex: bigint;
    isActive: boolean;
    registeredAt: bigint;
}

export enum JobState {
    CREATED = 0,
    ACCEPTED = 1,
    SUBMITTED = 2,
    APPROVED = 3,
    SLASHED = 4,
    CANCELLED = 5,
}

export interface Job {
    jobId: bigint;
    master: string;
    worker: string;
    price: bigint;
    state: JobState;
    outputHash: string;
    proofRef: string;
    createdAt: bigint;
    deadline: bigint;
    fundsReleased: boolean;
}

export interface ReputationData {
    score: bigint;
    completedJobs: bigint;
    failedJobs: bigint;
    totalEarned: bigint;
    slashCount: bigint;
    lastUpdateTime: bigint;
}

export interface AgentStats {
    successRate: bigint;
    totalJobs: bigint;
    trustScore: bigint;
}
