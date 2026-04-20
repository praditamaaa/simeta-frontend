import React from 'react';
import { useAuthStore, UserRole } from '../data/authStore';

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
    fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
    children,
    allowedRoles,
    fallback = null
}) => {
    const { role, isAuthenticated } = useAuthStore();

    if (!isAuthenticated || !role || !allowedRoles.includes(role)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
};
