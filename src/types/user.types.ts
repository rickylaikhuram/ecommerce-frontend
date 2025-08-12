// types/user.ts
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface AuthStatus {
  isAuthenticated: boolean;
  role: "user" | "admin" | "guest";
}
export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  alternatePhone?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  label?: string;
  landmark?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}
