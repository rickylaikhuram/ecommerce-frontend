export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  status: 'active' | 'inactive';
  description?: string;
  sku?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: Address;
  totalOrders: number;
  totalSpent: number;
  registeredAt: Date;
  lastOrderAt?: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  phone?: string;
  address?: Address;
  registeredAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface SalesData {
  totalSales: number;
  totalOrders: number;
  totalRevenue: number;
  todaysSales: number;
  weeklyGrowth: number;
  monthlyGrowth: number;
}

export interface ChartData {
  labels: string[];
  data: number[];
}

export interface Notification {
  id: string;
  type: 'order' | 'stock' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export interface SupportTicket {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

export interface Settings {
  siteName: string;
  registrationEnabled: boolean;
  discountsEnabled: boolean;
  maintenanceMode: boolean;
  taxRate: number;
  currency: string;
  shippingFee: number;
}