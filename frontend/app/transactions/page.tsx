"use client";

import { useState, useEffect } from "react";
import { useAccount, useBlockNumber, usePublicClient } from "wagmi";
import { Card, LoadingSpinner, EmptyState, Badge } from "@/components/UI";
import {
    formatAddress,
    formatEth,
    formatTimestamp,
    getJobStateLabel,
} from "@/utils/formatting";
import { CONTRACTS } from "@/config/contracts";
import { AgentEscrowABI } from "@/config/abis";

interface TransactionEvent {
    type:
        | "JobCreated"
        | "JobAccepted"
        | "ResultSubmitted"
        | "JobApproved"
        | "JobSlashed"
        | "JobCancelled";
    jobId: bigint;
    master?: string;
    worker?: string;
    price?: bigint;
    payment?: bigint;
    blockNumber: bigint;
    transactionHash: string;
    timestamp?: number;
}

export default function TransactionsPage() {
    const { address: userAddress } = useAccount();
    const publicClient = usePublicClient();
    const { data: currentBlock } = useBlockNumber();
    const [events, setEvents] = useState<TransactionEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch events from AgentEscrow contract
    useEffect(() => {
        const fetchEvents = async () => {
            if (!publicClient || !currentBlock) return;

            setIsLoading(true);

            try {
                // Fetch events from last 10000 blocks (adjust based on chain)
                const fromBlock =
                    currentBlock > 10000n ? currentBlock - 10000n : 0n;

                // Fetch all job-related events from AgentEscrow contract
                const jobCreatedLogs = await publicClient.getLogs({
                    address: CONTRACTS.AgentEscrow as `0x${string}`,
                    event: {
                        type: "event",
                        name: "JobCreated",
                        inputs: [
                            { type: "uint256", indexed: true, name: "jobId" },
                            { type: "address", indexed: true, name: "master" },
                            { type: "address", indexed: true, name: "worker" },
                            { type: "uint256", indexed: false, name: "price" },
                            {
                                type: "uint256",
                                indexed: false,
                                name: "deadline",
                            },
                            {
                                type: "uint256",
                                indexed: false,
                                name: "timestamp",
                            },
                        ],
                    },
                    fromBlock,
                    toBlock: currentBlock,
                });

                const jobAcceptedLogs = await publicClient.getLogs({
                    address: CONTRACTS.AgentEscrow as `0x${string}`,
                    event: {
                        type: "event",
                        name: "JobAccepted",
                        inputs: [
                            { type: "uint256", indexed: true, name: "jobId" },
                            { type: "address", indexed: true, name: "worker" },
                            {
                                type: "uint256",
                                indexed: false,
                                name: "timestamp",
                            },
                        ],
                    },
                    fromBlock,
                    toBlock: currentBlock,
                });

                const resultSubmittedLogs = await publicClient.getLogs({
                    address: CONTRACTS.AgentEscrow as `0x${string}`,
                    event: {
                        type: "event",
                        name: "ResultSubmitted",
                        inputs: [
                            { type: "uint256", indexed: true, name: "jobId" },
                            {
                                type: "bytes32",
                                indexed: false,
                                name: "outputHash",
                            },
                            {
                                type: "string",
                                indexed: false,
                                name: "proofRef",
                            },
                            {
                                type: "uint256",
                                indexed: false,
                                name: "timestamp",
                            },
                        ],
                    },
                    fromBlock,
                    toBlock: currentBlock,
                });

                const jobApprovedLogs = await publicClient.getLogs({
                    address: CONTRACTS.AgentEscrow as `0x${string}`,
                    event: {
                        type: "event",
                        name: "JobApproved",
                        inputs: [
                            { type: "uint256", indexed: true, name: "jobId" },
                            { type: "address", indexed: true, name: "master" },
                            { type: "address", indexed: true, name: "worker" },
                            {
                                type: "uint256",
                                indexed: false,
                                name: "payment",
                            },
                            {
                                type: "uint256",
                                indexed: false,
                                name: "timestamp",
                            },
                        ],
                    },
                    fromBlock,
                    toBlock: currentBlock,
                });

                const jobCancelledLogs = await publicClient.getLogs({
                    address: CONTRACTS.AgentEscrow as `0x${string}`,
                    event: {
                        type: "event",
                        name: "JobCancelled",
                        inputs: [
                            { type: "uint256", indexed: true, name: "jobId" },
                            {
                                type: "uint256",
                                indexed: false,
                                name: "timestamp",
                            },
                        ],
                    },
                    fromBlock,
                    toBlock: currentBlock,
                });

                // Parse and combine events
                const allEvents: TransactionEvent[] = [];

                jobCreatedLogs.forEach((log: any) => {
                    allEvents.push({
                        type: "JobCreated",
                        jobId: log.args.jobId,
                        master: log.args.master,
                        worker: log.args.worker,
                        price: log.args.price,
                        blockNumber: log.blockNumber,
                        transactionHash: log.transactionHash,
                    });
                });

                jobAcceptedLogs.forEach((log: any) => {
                    allEvents.push({
                        type: "JobAccepted",
                        jobId: log.args.jobId,
                        worker: log.args.worker,
                        blockNumber: log.blockNumber,
                        transactionHash: log.transactionHash,
                    });
                });

                resultSubmittedLogs.forEach((log: any) => {
                    allEvents.push({
                        type: "ResultSubmitted",
                        jobId: log.args.jobId,
                        blockNumber: log.blockNumber,
                        transactionHash: log.transactionHash,
                    });
                });

                jobApprovedLogs.forEach((log: any) => {
                    allEvents.push({
                        type: "JobApproved",
                        jobId: log.args.jobId,
                        master: log.args.master,
                        worker: log.args.worker,
                        payment: log.args.payment,
                        blockNumber: log.blockNumber,
                        transactionHash: log.transactionHash,
                    });
                });

                jobCancelledLogs.forEach((log: any) => {
                    allEvents.push({
                        type: "JobCancelled",
                        jobId: log.args.jobId,
                        blockNumber: log.blockNumber,
                        transactionHash: log.transactionHash,
                    });
                });

                // Sort by block number (most recent first)
                allEvents.sort(
                    (a, b) => Number(b.blockNumber) - Number(a.blockNumber)
                );

                setEvents(allEvents);
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, [publicClient, currentBlock]);

    // Filter events for current user
    const userEvents = userAddress
        ? events.filter(
              (e) =>
                  e.master?.toLowerCase() === userAddress.toLowerCase() ||
                  e.worker?.toLowerCase() === userAddress.toLowerCase()
          )
        : events;

    const getEventBadgeVariant = (type: string) => {
        switch (type) {
            case "JobCreated":
                return "default";
            case "JobAccepted":
                return "default";
            case "ResultSubmitted":
                return "warning";
            case "JobApproved":
                return "success";
            case "JobCancelled":
                return "error";
            default:
                return "default";
        }
    };

    if (!userAddress) {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold mb-4">Transactions</h1>
                <p className="text-gray-400">
                    Connect your wallet to view transactions
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Transaction History</h1>
                <p className="text-gray-400 mt-1">
                    View all job-related events from the AgentEscrow contract
                </p>
            </div>

            {isLoading ? (
                <LoadingSpinner />
            ) : userEvents.length === 0 ? (
                <EmptyState message="No transactions found" />
            ) : (
                <div className="space-y-4">
                    {userEvents.map((event, index) => (
                        <Card key={`${event.transactionHash}-${index}`}>
                            <div className="space-y-3">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <Badge
                                            variant={getEventBadgeVariant(
                                                event.type
                                            )}
                                        >
                                            {event.type}
                                        </Badge>
                                        <p className="text-sm text-gray-400 mt-1">
                                            Job #{event.jobId.toString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400">
                                            Block
                                        </p>
                                        <p className="text-sm font-mono">
                                            {event.blockNumber.toString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {event.master && (
                                        <div>
                                            <p className="text-xs text-gray-400">
                                                Master
                                            </p>
                                            <p className="font-mono text-sm">
                                                {formatAddress(event.master)}
                                            </p>
                                        </div>
                                    )}
                                    {event.worker && (
                                        <div>
                                            <p className="text-xs text-gray-400">
                                                Worker
                                            </p>
                                            <p className="font-mono text-sm">
                                                {formatAddress(event.worker)}
                                            </p>
                                        </div>
                                    )}
                                    {event.price && (
                                        <div>
                                            <p className="text-xs text-gray-400">
                                                Price
                                            </p>
                                            <p className="text-sm font-semibold">
                                                {formatEth(event.price)} ETH
                                            </p>
                                        </div>
                                    )}
                                    {event.payment && (
                                        <div>
                                            <p className="text-xs text-gray-400">
                                                Payment
                                            </p>
                                            <p className="text-sm font-semibold text-green-400">
                                                {formatEth(event.payment)} ETH
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-2 border-t border-gray-800">
                                    <p className="text-xs text-gray-400">
                                        Transaction Hash
                                    </p>
                                    <a
                                        href={`https://sepolia.etherscan.io/tx/${event.transactionHash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-mono text-xs text-blue-400 hover:text-blue-300 break-all"
                                    >
                                        {event.transactionHash}
                                    </a>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
