// Order types
export interface Order {
  id: string;
  orderNumber: string;
  channel: string;
  customer: string;
  status: OrderStatus;
  dueDate: string;
  items: OrderLine[];
  shipments: Shipment[];
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus =
  | "NEW"
  | "ALLOCATED"
  | "PICKING"
  | "PACKED"
  | "SHIPPED"
  | "DELIVERED"
  | "EXCEPTION";

export interface OrderLine {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  allocatedLocation?: string;
  status: "PENDING" | "ALLOCATED" | "PICKED" | "CANCELLED";
}

// Product types
export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  category: string;
  barcode?: string;
  owner?: string;
  weight: number;
  length?: number;
  width?: number;
  height?: number;
  isHazmat: boolean;
  storageRules?: string;
}

// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  status: UserStatus;
  mfaEnabled: boolean;
  lastLogin?: string;
  companyId: string;
  assignedZone?: string;
}

export type Role =
  | "ADMIN"
  | "SUPERVISOR"
  | "MANAGER"
  | "OPERATOR"
  | "ACCOUNTANT"
  | "READ_ONLY";

export type UserStatus = "ACTIVE" | "INVITED" | "SUSPENDED";

// Warehouse types
export interface Warehouse {
  id: string;
  name: string;
  address: string;
  companyId: string;
  zones: Zone[];
}

export interface Zone {
  id: string;
  name: string;
  warehouseId: string;
  locations: Location[];
  template: "STANDARD_3PL" | "ECOMMERCE" | "CROSS_DOCK" | "CUSTOM";
}

export interface Location {
  id: string;
  barcode: string;
  zoneId: string;
  capacity: number;
  currentFill: number;
  status: "AVAILABLE" | "OCCUPIED" | "FULL" | "BLOCKED" | "MAINTENANCE";
}

// Inventory types
export interface InventoryItem {
  id: string;
  productId: string;
  product?: Product;
  locationId: string;
  location?: Location;
  quantity: number;
  status: "AVAILABLE" | "RESERVED" | "BLOCKED" | "DAMAGED";
}

// Shipment types
export interface Shipment {
  id: string;
  trackingNumber: string;
  orderId: string;
  carrier: string;
  service: string;
  status: "LABEL_CREATED" | "IN_TRANSIT" | "DELIVERED" | "EXCEPTION";
  weight: number;
  dimensions?: string;
  labelUrl?: string;
}

// API response wrapper
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

// KPI types
export interface KpiData {
  label: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: string;
  accentColor?: string;
}
