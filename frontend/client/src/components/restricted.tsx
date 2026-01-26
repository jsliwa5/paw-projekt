import { useAuth } from "@/lib/auth";
import type { UserRole } from "@shared/schema";
import { ReactNode } from "react";

interface RestrictedProps {
    to: UserRole | UserRole[];
    children: ReactNode;
    fallback?: ReactNode;
}

export function Restricted({ to, children, fallback = null }: RestrictedProps) {
    const { user } = useAuth();

    if (!user) return <>{fallback}</>;

    const allowedRoles = Array.isArray(to) ? to : [to];

    if (allowedRoles.includes(user.role)) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
}