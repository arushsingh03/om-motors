export interface UserProfile {
  name: string;
  phone: string;
  address: string;
  password: string;
}

export interface TruckDetails {
  id: string;
  currentLocation: string;
  destinationLocation: string;
  weight: number;
  dimensions: {
    length: number;
  };
  contactDetails: {
    phone: string;
    email: string;
  };
  receiptUrl?: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  address?: string;
  createdAt: Date;
  updatedAt?: Date;
}