export type Permission = 
  | 'users.view'
  | 'users.create'
  | 'users.edit'
  | 'users.delete'
  | 'deals.view'
  | 'deals.create'
  | 'deals.edit'
  | 'deals.delete'
  | 'contacts.view'
  | 'contacts.create'
  | 'contacts.edit'
  | 'contacts.delete'
  | 'analytics.view';

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
}

export const DEFAULT_ROLES: Record<UserRole, Permission[]> = {
  admin: [
    'users.view', 'users.create', 'users.edit', 'users.delete',
    'deals.view', 'deals.create', 'deals.edit', 'deals.delete',
    'contacts.view', 'contacts.create', 'contacts.edit', 'contacts.delete',
    'analytics.view'
  ],
  manager: [
    'users.view', 'users.create',
    'deals.view', 'deals.create', 'deals.edit',
    'contacts.view', 'contacts.create', 'contacts.edit',
    'analytics.view'
  ],
  sales: [
    'deals.view', 'deals.create', 'deals.edit',
    'contacts.view', 'contacts.create', 'contacts.edit'
  ],
  marketing: [
    'contacts.view', 'contacts.create',
    'analytics.view'
  ]
};