import type{ Product, Order, Customer, User, SalesData, ChartData, Notification, SupportTicket, Settings } from '../types/temp.types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    category: 'Electronics',
    price: 199.99,
    stock: 45,
    image: 'https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=300',
    status: 'active',
    description: 'High-quality wireless headphones with noise cancellation',
    sku: 'WBH-001',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '2',
    name: 'Smart Watch Series 5',
    category: 'Electronics',
    price: 299.99,
    stock: 23,
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=300',
    status: 'active',
    description: 'Advanced smartwatch with health monitoring',
    sku: 'SW-005',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: '3',
    name: 'Organic Cotton T-Shirt',
    category: 'Clothing',
    price: 24.99,
    stock: 120,
    image: 'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=300',
    status: 'active',
    description: 'Comfortable organic cotton t-shirt',
    sku: 'OCT-001',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-19')
  },
  {
    id: '4',
    name: 'Leather Laptop Bag',
    category: 'Accessories',
    price: 89.99,
    stock: 0,
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=300',
    status: 'active',
    description: 'Premium leather laptop bag with compartments',
    sku: 'LLB-001',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-16')
  },
  {
    id: '5',
    name: 'Minimalist Desk Lamp',
    category: 'Home & Garden',
    price: 59.99,
    stock: 67,
    image: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=300',
    status: 'inactive',
    description: 'Modern minimalist desk lamp with adjustable brightness',
    sku: 'MDL-001',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-14')
  }
];

export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    customerId: 'CUST-001',
    customerName: 'John Doe',
    customerEmail: 'john.doe@email.com',
    status: 'delivered',
    total: 199.99,
    items: [
      {
        id: 'item-1',
        productId: '1',
        productName: 'Wireless Bluetooth Headphones',
        quantity: 1,
        price: 199.99,
        image: 'https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=300'
      }
    ],
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    paymentMethod: 'Credit Card',
    paymentStatus: 'paid',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-22')
  },
  {
    id: 'ORD-002',
    customerId: 'CUST-002',
    customerName: 'Jane Smith',
    customerEmail: 'jane.smith@email.com',
    status: 'shipped',
    total: 324.98,
    items: [
      {
        id: 'item-2',
        productId: '2',
        productName: 'Smart Watch Series 5',
        quantity: 1,
        price: 299.99,
        image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=300'
      },
      {
        id: 'item-3',
        productId: '3',
        productName: 'Organic Cotton T-Shirt',
        quantity: 1,
        price: 24.99,
        image: 'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=300'
      }
    ],
    shippingAddress: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    paymentMethod: 'PayPal',
    paymentStatus: 'paid',
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-21')
  },
  {
    id: 'ORD-003',
    customerId: 'CUST-003',
    customerName: 'Bob Johnson',
    customerEmail: 'bob.johnson@email.com',
    status: 'pending',
    total: 89.99,
    items: [
      {
        id: 'item-4',
        productId: '4',
        productName: 'Leather Laptop Bag',
        quantity: 1,
        price: 89.99,
        image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=300'
      }
    ],
    shippingAddress: {
      street: '789 Pine Rd',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA'
    },
    paymentMethod: 'Credit Card',
    paymentStatus: 'pending',
    createdAt: new Date('2024-01-21'),
    updatedAt: new Date('2024-01-21')
  }
];

export const mockCustomers: Customer[] = [
  {
    id: 'CUST-001',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    totalOrders: 3,
    totalSpent: 599.97,
    registeredAt: new Date('2023-12-15'),
    lastOrderAt: new Date('2024-01-20')
  },
  {
    id: 'CUST-002',
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    phone: '+1 (555) 987-6543',
    address: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    totalOrders: 2,
    totalSpent: 424.98,
    registeredAt: new Date('2023-11-20'),
    lastOrderAt: new Date('2024-01-19')
  },
  {
    id: 'CUST-003',
    name: 'Bob Johnson',
    email: 'bob.johnson@email.com',
    phone: '+1 (555) 456-7890',
    address: {
      street: '789 Pine Rd',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA'
    },
    totalOrders: 1,
    totalSpent: 89.99,
    registeredAt: new Date('2024-01-10'),
    lastOrderAt: new Date('2024-01-21')
  }
];

export const mockUsers: User[] = [
  {
    id: 'USER-001',
    name: 'Admin User',
    email: 'admin@store.com',
    role: 'admin',
    phone: '+1 (555) 000-0000',
    registeredAt: new Date('2023-01-01'),
    lastLoginAt: new Date('2024-01-22'),
    isActive: true
  },
  {
    id: 'USER-002',
    name: 'John Doe',
    email: 'john.doe@email.com',
    role: 'user',
    phone: '+1 (555) 123-4567',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    registeredAt: new Date('2023-12-15'),
    lastLoginAt: new Date('2024-01-20'),
    isActive: true
  },
  {
    id: 'USER-003',
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    role: 'user',
    phone: '+1 (555) 987-6543',
    registeredAt: new Date('2023-11-20'),
    lastLoginAt: new Date('2024-01-19'),
    isActive: true
  }
];

export const mockSalesData: SalesData = {
  totalSales: 1024.94,
  totalOrders: 6,
  totalRevenue: 15678.50,
  todaysSales: 199.99,
  weeklyGrowth: 12.5,
  monthlyGrowth: 23.7
};

export const mockSalesChart: ChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  data: [4200, 5100, 4800, 6300, 5900, 7200]
};

export const mockCategoryChart: ChartData = {
  labels: ['Electronics', 'Clothing', 'Home & Garden', 'Accessories', 'Books'],
  data: [35, 25, 20, 15, 5]
};

export const mockNotifications: Notification[] = [
  {
    id: 'NOT-001',
    type: 'order',
    title: 'New Order Received',
    message: 'Order #ORD-003 has been placed by Bob Johnson',
    isRead: false,
    createdAt: new Date('2024-01-21T10:30:00')
  },
  {
    id: 'NOT-002',
    type: 'stock',
    title: 'Low Stock Alert',
    message: 'Leather Laptop Bag is out of stock',
    isRead: false,
    createdAt: new Date('2024-01-21T09:15:00')
  },
  {
    id: 'NOT-003',
    type: 'system',
    title: 'System Update',
    message: 'Dashboard has been updated to version 2.1',
    isRead: true,
    createdAt: new Date('2024-01-20T14:00:00')
  }
];

export const mockSupportTickets: SupportTicket[] = [
  {
    id: 'TKT-001',
    customerId: 'CUST-001',
    customerName: 'John Doe',
    customerEmail: 'john.doe@email.com',
    subject: 'Issue with headphones',
    status: 'open',
    priority: 'high',
    createdAt: new Date('2024-01-21T08:00:00'),
    updatedAt: new Date('2024-01-21T08:00:00')
  },
  {
    id: 'TKT-002',
    customerId: 'CUST-002',
    customerName: 'Jane Smith',
    customerEmail: 'jane.smith@email.com',
    subject: 'Shipping delay inquiry',
    status: 'in-progress',
    priority: 'medium',
    createdAt: new Date('2024-01-20T15:30:00'),
    updatedAt: new Date('2024-01-21T09:00:00')
  }
];

export const mockSettings: Settings = {
  siteName: 'E-Commerce Store',
  registrationEnabled: true,
  discountsEnabled: true,
  maintenanceMode: false,
  taxRate: 8.25,
  currency: 'USD',
  shippingFee: 9.99
};