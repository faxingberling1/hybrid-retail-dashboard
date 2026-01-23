// Business types based on industry
export type IndustryType = 
  | 'fashion-apparel'
  | 'electronics'
  | 'supermarket'
  | 'pharmacy'
  | 'restaurant'
  | 'wholesale'
  | 'home-furniture'
  | 'jewelry-watches'
  | 'bookstore'
  | 'gaming-electronics'
  | 'luxury-retail'
  | 'food-beverage'
  | 'sports-fitness'
  | 'beauty-cosmetics'
  | 'hardware-store'
  | 'music-store'
  | 'other';

export type SubscriptionPlan = 'starter' | 'professional' | 'enterprise';

export interface Business {
  id: string;
  name: string;
  industry: IndustryType;
  subscriptionPlan: SubscriptionPlan;
  subscriptionStatus: 'active' | 'pending' | 'suspended' | 'cancelled';
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  settings: BusinessSettings;
  statistics: BusinessStatistics;
}

export interface BusinessSettings {
  currency: string;
  timezone: string;
  language: string;
  taxSettings: TaxSettings;
  inventorySettings: InventorySettings;
  notificationSettings: NotificationSettings;
  industrySpecific: IndustrySpecificSettings;
}

export interface IndustrySpecificSettings {
  // Fashion & Apparel
  sizeMatrix?: boolean;
  colorVariants?: boolean;
  seasonalCollections?: boolean;
  
  // Electronics
  serialNumberTracking?: boolean;
  warrantyManagement?: boolean;
  
  // Supermarkets
  perishableTracking?: boolean;
  bulkWeighing?: boolean;
  
  // Pharmacies
  expiryTracking?: boolean;
  prescriptionManagement?: boolean;
  
  // Restaurants
  tableManagement?: boolean;
  kitchenPrinting?: boolean;
  
  // etc. for other industries
}

export interface TaxSettings {
  enabled: boolean;
  rate: number;
  inclusive: boolean;
}

export interface InventorySettings {
  lowStockAlert: number;
  autoReorder: boolean;
  batchTracking: boolean;
}

export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
}

export interface BusinessStatistics {
  totalStores: number;
  totalUsers: number;
  monthlyRevenue: number;
  monthlyTransactions: number;
  activeProducts: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  businessId: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: Date;
  permissions: string[];
}

export type UserRole = 
  | 'super-admin'
  | 'business-admin'
  | 'store-manager'
  | 'cashier'
  | 'inventory-manager'
  | 'viewer';

export interface AuditLog {
  id: string;
  userId: string;
  businessId: string;
  action: string;
  resource: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

export interface DashboardStats {
  totalBusinesses: number;
  activeBusinesses: number;
  totalUsers: number;
  monthlyRevenue: number;
  pendingApprovals: number;
  systemHealth: number;
}