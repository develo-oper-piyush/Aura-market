"use client";

import {
    useReadContract,
    useWriteContract,
    useWaitForTransactionReceipt,
} from "wagmi";
import { AgentEscrowABI } from "@/config/abis";
import { CONTRACTS } from "@/config/contracts";
import { Job, JobState } from "@/types/contracts";
import { parseEther } from "viem";

// Get platform fee percentage from AgentEscrow contract
export function usePlatformFee() {
    const { data } = useReadContract({
        address: CONTRACTS.AgentEscrow as `0x${string}`,
        abi: AgentEscrowABI,
        functionName: "PLATFORM_FEE_PERCENTAGE",
    });

    return data as bigint | undefined;
}

// Get total job count
export function useJobCounter() {
    const { data } = useReadContract({
        address: CONTRACTS.AgentEscrow as `0x${string}`,
        abi: AgentEscrowABI,
        functionName: "jobCounter",
    });

    return data as bigint | undefined;
}

// Read job details by ID - calls AgentEscrow.getJob()
export function useJob(jobId?: bigint) {
    const { data, isLoading, error, refetch } = useReadContract({
        address: CONTRACTS.AgentEscrow as `0x${string}`,
        abi: AgentEscrowABI,
        functionName: "getJob",
        args: jobId !== undefined ? [jobId] : undefined,
        query: {
            enabled: jobId !== undefined,
        },
    });

    return {
        job: data as Job | undefined,
        isLoading,
        error,
        refetch,
    };
}

// Get jobs created by master (hiring agent) - calls AgentEscrow.getJobsByMaster()
export function useJobsByMaster(masterAddress?: string, limit: number = 50) {
    const { data, isLoading } = useReadContract({
        address: CONTRACTS.AgentEscrow as `0x${string}`,
        abi: AgentEscrowABI,
        functionName: "getJobsByMaster",
        args: masterAddress
            ? [masterAddress as `0x${string}`, BigInt(limit)]
            : undefined,
        query: {
            enabled: !!masterAddress,
        },
    });

    return {
        jobIds: data as bigint[] | undefined,
        isLoading,
    };
}

// Get jobs assigned to worker (service agent) - calls AgentEscrow.getJobsByWorker()
export function useJobsByWorker(workerAddress?: string, limit: number = 50) {
    const { data, isLoading } = useReadContract({
        address: CONTRACTS.AgentEscrow as `0x${string}`,
        abi: AgentEscrowABI,
        functionName: "getJobsByWorker",
        args: workerAddress
            ? [workerAddress as `0x${string}`, BigInt(limit)]
            : undefined,
        query: {
            enabled: !!workerAddress,
        },
    });

    return {
        jobIds: data as bigint[] | undefined,
        isLoading,
    };
}

// Create job (hire agent) - calls AgentEscrow.createJob()
export function useCreateJob() {
    const { writeContract, data: hash, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt(
        { hash }
    );

    const createJob = async (
        workerAddress: string,
        deadlineTimestamp: number,
        priceInEth: string
    ) => {
        writeContract({
            address: CONTRACTS.AgentEscrow as `0x${string}`,
            abi: AgentEscrowABI,
            functionName: "createJob",
            args: [workerAddress as `0x${string}`, BigInt(deadlineTimestamp)],
            value: parseEther(priceInEth),
        });
    };

    return {
        createJob,
        isPending: isPending || isConfirming,
        isSuccess,
        hash,
    };
}

// Accept job - calls AgentEscrow.acceptJob()
export function useAcceptJob() {
    const { writeContract, data: hash, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt(
        { hash }
    );

    const acceptJob = async (jobId: bigint) => {
        writeContract({
            address: CONTRACTS.AgentEscrow as `0x${string}`,
            abi: AgentEscrowABI,
            functionName: "acceptJob",
            args: [jobId],
        });
    };

    return {
        acceptJob,
        isPending: isPending || isConfirming,
        isSuccess,
        hash,
    };
}

// Submit result - calls AgentEscrow.submitResult()
export function useSubmitResult() {
    const { writeContract, data: hash, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt(
        { hash }
    );

    const submitResult = async (
        jobId: bigint,
        outputHash: string,
        proofRef: string
    ) => {
        writeContract({
            address: CONTRACTS.AgentEscrow as `0x${string}`,
            abi: AgentEscrowABI,
            functionName: "submitResult",
            args: [jobId, outputHash as `0x${string}`, proofRef],
        });
    };

    return {
        submitResult,
        isPending: isPending || isConfirming,
        isSuccess,
        hash,
    };
}

// Approve and release payment - calls AgentEscrow.approveAndRelease()
export function useApproveJob() {
    const { writeContract, data: hash, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt(
        { hash }
    );

    const approveJob = async (jobId: bigint) => {
        writeContract({
            address: CONTRACTS.AgentEscrow as `0x${string}`,
            abi: AgentEscrowABI,
            functionName: "approveAndRelease",
            args: [jobId],
        });
    };

    return {
        approveJob,
        isPending: isPending || isConfirming,
        isSuccess,
        hash,
    };
}

// Cancel job - calls AgentEscrow.cancelJob()
export function useCancelJob() {
    const { writeContract, data: hash, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt(
        { hash }
    );

    const cancelJob = async (jobId: bigint) => {
        writeContract({
            address: CONTRACTS.AgentEscrow as `0x${string}`,
            abi: AgentEscrowABI,
            functionName: "cancelJob",
            args: [jobId],
        });
    };

    return {
        cancelJob,
        isPending: isPending || isConfirming,
        isSuccess,
        hash,
    };
}
