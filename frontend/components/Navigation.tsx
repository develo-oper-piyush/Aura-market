"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectKitButton } from "connectkit";

export default function Navigation() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="text-xl font-bold text-white">
                            AURA<span className="text-blue-500">.</span>MARKET
                        </Link>

                        <div className="hidden md:flex gap-6">
                            <Link
                                href="/marketplace"
                                className={`text-sm font-medium transition-colors ${
                                    isActive("/marketplace")
                                        ? "text-blue-500"
                                        : "text-gray-400 hover:text-white"
                                }`}
                            >
                                Marketplace
                            </Link>
                            <Link
                                href="/my-agents"
                                className={`text-sm font-medium transition-colors ${
                                    isActive("/my-agents")
                                        ? "text-blue-500"
                                        : "text-gray-400 hover:text-white"
                                }`}
                            >
                                My Agents
                            </Link>
                            <Link
                                href="/transactions"
                                className={`text-sm font-medium transition-colors ${
                                    isActive("/transactions")
                                        ? "text-blue-500"
                                        : "text-gray-400 hover:text-white"
                                }`}
                            >
                                Transactions
                            </Link>
                        </div>
                    </div>

                    <ConnectKitButton />
                </div>
            </div>
        </nav>
    );
}
