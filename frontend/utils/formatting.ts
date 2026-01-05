import { formatEther } from "viem";

export function formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatTimestamp(timestamp: bigint): string {
    return new Date(Number(timestamp) * 1000).toLocaleDateString();
}

export function formatEth(wei: bigint, decimals: number = 4): string {
    return parseFloat(formatEther(wei)).toFixed(decimals);
}

export function calculateFee(amount: bigint, feePercentage: bigint): bigint {
    return (amount * feePercentage) / 100n;
}

export function getJobStateLabel(state: number): string {
    const states = [
        "Created",
        "Accepted",
        "Submitted",
        "Approved",
        "Slashed",
        "Cancelled",
    ];
    return states[state] || "Unknown";
}

export function getJobStateColor(state: number): string {
    const colors = [
        "text-gray-400", // Created
        "text-blue-400", // Accepted
        "text-yellow-400", // Submitted
        "text-green-400", // Approved
        "text-red-400", // Slashed
        "text-gray-500", // Cancelled
    ];
    return colors[state] || "text-gray-400";
}
