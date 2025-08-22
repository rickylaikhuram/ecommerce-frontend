// types/user.types.ts
export interface Order {
  id: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface BaseUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}

export interface User extends BaseUser {
  latestOrder: Order | null;
}

export interface Admin extends BaseUser {}

export interface CustomerUser extends BaseUser {
  latestOrder: Order;
}

export type TabType = 'users' | 'customers' | 'admins';

export interface TabConfig {
  key: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  endpoint: string;
}

export interface ApiResponse<T> {
  message: string;
  users?: T[];
  customers?: T[];
  admins?: T[];
}
