export const APP_NAME = "LogiTrack WMS";

export const NAV_ITEMS = [
  { name: "Dashboard", icon: "dashboard", href: "/dashboard" },
  { name: "Inventory", icon: "inventory_2", href: "/inventory" },
  { name: "Orders", icon: "shopping_cart", href: "/orders" },
  { name: "Inbound", icon: "forklift", href: "/inbound" },
  { name: "Outbound", icon: "local_shipping", href: "/outbound" },
  { name: "Warehouses", icon: "warehouse", href: "/warehouses" },
  { name: "Billing", icon: "receipt_long", href: "/billing" },
  { name: "Reporting", icon: "bar_chart", href: "/reporting" },
  { name: "Users", icon: "group", href: "/users" },
  { name: "Settings", icon: "settings", href: "/settings" },
] as const;

export const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  NEW: { bg: "bg-status-info/10", text: "text-status-info", border: "border-status-info/20" },
  ALLOCATED: { bg: "bg-primary-fixed/30", text: "text-primary", border: "border-primary/20" },
  PICKING: { bg: "bg-status-warning/10", text: "text-status-warning", border: "border-status-warning/20" },
  PACKED: { bg: "bg-tertiary-fixed/30", text: "text-tertiary", border: "border-tertiary/20" },
  SHIPPED: { bg: "bg-status-info/10", text: "text-status-info", border: "border-status-info/20" },
  DELIVERED: { bg: "bg-status-success/10", text: "text-status-success", border: "border-status-success/20" },
  EXCEPTION: { bg: "bg-status-error/10", text: "text-status-error", border: "border-status-error/20" },
  ACTIVE: { bg: "bg-status-success/10", text: "text-status-success", border: "border-status-success/20" },
  INVITED: { bg: "bg-status-info/10", text: "text-status-info", border: "border-status-info/20" },
  SUSPENDED: { bg: "bg-status-error/10", text: "text-status-error", border: "border-status-error/20" },
  AVAILABLE: { bg: "bg-status-success/10", text: "text-status-success", border: "border-status-success/20" },
  OCCUPIED: { bg: "bg-status-warning/10", text: "text-status-warning", border: "border-status-warning/20" },
  FULL: { bg: "bg-status-error/10", text: "text-status-error", border: "border-status-error/20" },
  BLOCKED: { bg: "bg-status-error/10", text: "text-status-error", border: "border-status-error/20" },
  PENDING: { bg: "bg-surface-container-highest", text: "text-on-surface-variant", border: "border-low" },
  IN_PROGRESS: { bg: "bg-status-info/10", text: "text-status-info", border: "border-status-info/20" },
  COMPLETED: { bg: "bg-status-success/10", text: "text-status-success", border: "border-status-success/20" },
  DRAFT: { bg: "bg-surface-container-highest", text: "text-on-surface-variant", border: "border-low" },
  SENT: { bg: "bg-status-info/10", text: "text-status-info", border: "border-status-info/20" },
  PAID: { bg: "bg-status-success/10", text: "text-status-success", border: "border-status-success/20" },
  OVERDUE: { bg: "bg-status-error/10", text: "text-status-error", border: "border-status-error/20" },
  LABEL_CREATED: { bg: "bg-surface-container-highest", text: "text-on-surface-variant", border: "border-low" },
  IN_TRANSIT: { bg: "bg-status-info/10", text: "text-status-info", border: "border-status-info/20" },
};

export const CHANNELS: Record<string, { icon: string; color: string }> = {
  Shopify: { icon: "storefront", color: "text-[#95BF47]" },
  Amazon: { icon: "shopping_bag", color: "text-[#FF9900]" },
  Manual: { icon: "edit_note", color: "text-on-surface-variant" },
  WooCommerce: { icon: "store", color: "text-[#7F54B3]" },
};
