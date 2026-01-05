import { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
}

export function Card({ children, className = "" }: CardProps) {
    return (
        <div
            className={`bg-gray-900 border border-gray-800 rounded-lg p-6 ${className}`}
        >
            {children}
        </div>
    );
}

interface ButtonProps {
    children: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    variant?: "primary" | "secondary" | "danger";
    className?: string;
    type?: "button" | "submit";
}

export function Button({
    children,
    onClick,
    disabled,
    variant = "primary",
    className = "",
    type = "button",
}: ButtonProps) {
    const baseStyles =
        "px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed";

    const variantStyles = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white",
        secondary:
            "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700",
        danger: "bg-red-600 hover:bg-red-700 text-white",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        >
            {children}
        </button>
    );
}

interface BadgeProps {
    children: ReactNode;
    variant?: "default" | "success" | "warning" | "error";
}

export function Badge({ children, variant = "default" }: BadgeProps) {
    const variants = {
        default: "bg-gray-800 text-gray-300",
        success: "bg-green-900/50 text-green-400",
        warning: "bg-yellow-900/50 text-yellow-400",
        error: "bg-red-900/50 text-red-400",
    };

    return (
        <span
            className={`px-2 py-1 rounded text-xs font-medium ${variants[variant]}`}
        >
            {children}
        </span>
    );
}

export function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
    );
}

export function EmptyState({ message }: { message: string }) {
    return (
        <div className="text-center py-12 text-gray-500">
            <p>{message}</p>
        </div>
    );
}
