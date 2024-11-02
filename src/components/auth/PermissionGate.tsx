import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import type { Permission } from '../../types/auth';

interface PermissionGateProps {
  children: React.ReactNode;
  permissions: Permission[];
  type?: 'all' | 'any';
}

export default function PermissionGate({ 
  children, 
  permissions, 
  type = 'any' 
}: PermissionGateProps) {
  const { hasAllPermissions, hasAnyPermission } = usePermissions();

  const hasAccess = type === 'all' 
    ? hasAllPermissions(permissions)
    : hasAnyPermission(permissions);

  if (!hasAccess) return null;

  return <>{children}</>;
}