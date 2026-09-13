import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean database to allow safe re-runs
  await prisma.auditLog.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.returnLine.deleteMany();
  await prisma.returnOrder.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.billingRule.deleteMany();
  await prisma.orderLine.deleteMany();
  await prisma.order.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.location.deleteMany();
  await prisma.zone.deleteMany();
  await prisma.warehouse.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();

  // Company
  const company = await prisma.company.create({
    data: {
      legalName: "LogiTrack Demo Inc.",
      taxId: "US-12-3456789",
      locale: "en-US",
    },
  });

  // Users
  const hashedPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.createMany({
    data: [
      { email: "admin@logitrack.com", firstName: "Admin", lastName: "User", password: hashedPassword, role: "ADMIN", companyId: company.id },
      { email: "j.smith@logitrack.com", firstName: "John", lastName: "Smith", password: hashedPassword, role: "MANAGER", companyId: company.id, assignedZone: "Zone 4" },
      { email: "m.davis@logitrack.com", firstName: "Maria", lastName: "Davis", password: hashedPassword, role: "SUPERVISOR", companyId: company.id, assignedZone: "Zone 4" },
      { email: "b.williams@logitrack.com", firstName: "Ben", lastName: "Williams", password: hashedPassword, role: "OPERATOR", companyId: company.id, assignedZone: "Zone 4" },
    ],
  });

  // Warehouse
  const warehouse = await prisma.warehouse.create({
    data: { name: "Warehouse Alpha", address: "1234 Industrial Blvd, Austin, TX 78701", companyId: company.id },
  });

  // Zones
  const zoneNames = [
    { name: "Zone A — Receiving", template: "STANDARD_3PL" as const },
    { name: "Zone B — Bulk Storage", template: "STANDARD_3PL" as const },
    { name: "Zone C — High Value", template: "ECOMMERCE" as const },
    { name: "Zone D — Pick Face", template: "ECOMMERCE" as const },
    { name: "Zone E — Outbound", template: "CROSS_DOCK" as const },
  ];

  const zones = [];
  for (const z of zoneNames) {
    const zone = await prisma.zone.create({
      data: { name: z.name, warehouseId: warehouse.id, template: z.template },
    });
    zones.push(zone);
  }

  // Locations (a few per zone)
  const locationData = zones.flatMap((zone, zi) =>
    Array.from({ length: 6 }, (_, li) => ({
      barcode: `${String.fromCharCode(65 + zi)}${li + 1}-04-B`,
      zoneId: zone.id,
      capacity: 100,
      currentFill: Math.floor(Math.random() * 100),
      status: Math.random() > 0.8 ? ("OCCUPIED" as const) : ("AVAILABLE" as const),
    }))
  );
  await prisma.location.createMany({ data: locationData });

  // Products
  const products = await Promise.all([
    prisma.product.create({ data: { sku: "SKU-992-8A", name: "Industrial Bearings 50mm", category: "Hardware", owner: "Acme Corp", weight: 0.5, companyId: company.id } }),
    prisma.product.create({ data: { sku: "SKU-411-2B", name: "Hex Bolts M12x50", category: "Fasteners", owner: "FastenerPro", weight: 0.02, companyId: company.id } }),
    prisma.product.create({ data: { sku: "SKU-105-9C", name: "Hydraulic Pump Assembly", category: "Pumps", owner: "HeavyMech", weight: 25.0, companyId: company.id } }),
    prisma.product.create({ data: { sku: "SKU-780-4D", name: "LED Panel 600x600", category: "Lighting", owner: "BrightLux", weight: 3.2, companyId: company.id } }),
    prisma.product.create({ data: { sku: "SKU-330-7E", name: "Safety Harness Kit", category: "Safety", owner: "SafeGuard", weight: 1.5, isHazmat: false, companyId: company.id } }),
    prisma.product.create({ data: { sku: "SKU-221-1F", name: "Pneumatic Cylinder", category: "Pneumatics", owner: "AirFlow", weight: 4.0, companyId: company.id } }),
  ]);

  // Orders
  const orderData = [
    { orderNumber: "ORD-2024-1284", channel: "Shopify", customer: "Acme Industries", status: "PICKING" as const, companyId: company.id },
    { orderNumber: "ORD-2024-1283", channel: "Amazon", customer: "Global Supplies Co.", status: "PACKED" as const, companyId: company.id },
    { orderNumber: "ORD-2024-1282", channel: "Manual", customer: "Baker Electronics", status: "NEW" as const, companyId: company.id },
    { orderNumber: "ORD-2024-1281", channel: "Shopify", customer: "Summit Logistics", status: "SHIPPED" as const, companyId: company.id },
    { orderNumber: "ORD-2024-1280", channel: "Amazon", customer: "Pinnacle Parts", status: "DELIVERED" as const, companyId: company.id },
  ];

  const createdOrders = [];
  for (let i = 0; i < orderData.length; i++) {
    const o = await prisma.order.create({
      data: {
        ...orderData[i],
        dueDate: new Date(Date.now() + (i - 2) * 86400000),
        items: {
          create: { productId: products[i % products.length].id, quantity: Math.floor(Math.random() * 10) + 1 },
        },
      },
    });
    createdOrders.push(o);
  }

  // SAAS Super Admin User
  await prisma.user.create({
    data: {
      email: "super@logitrack.com",
      firstName: "SaaS",
      lastName: "SuperAdmin",
      password: hashedPassword,
      role: "SAAS_SUPER_ADMIN",
      companyId: company.id,
    },
  });

  // CRM Customers
  const customerList = [
    { name: "Acme Industries", email: "contact@acme.com", phone: "+1 512 555 0192", status: "CUSTOMER", notes: "Prefers FedEx. Standard pallet rules." },
    { name: "Global Supplies Co.", email: "procurement@globalsupplies.com", phone: "+1 415 555 9821", status: "CUSTOMER", notes: "High volume ecommerce seller." },
    { name: "Apex Logistics Ltd", email: "info@apexlogs.com", phone: "+34 91 555 4321", status: "PROSPECT", notes: "Negotiating storage pricing rules." },
  ];
  for (const c of customerList) {
    await prisma.customer.create({ data: { ...c, companyId: company.id } });
  }

  // Return Orders
  const returnOrder = await prisma.returnOrder.create({
    data: {
      returnNumber: "RET-2024-001",
      orderId: createdOrders[0].id,
      status: "INSPECTED",
      inspectionNotes: "Received returned pump assembly. Minor box scratches, product unharmed.",
      items: {
        create: {
          productId: products[2].id,
          quantity: 1,
          condition: "RESTOCKED",
          notes: "Returned to Zone C high-value shelving.",
        },
      },
    },
  });

  // Transactions (Accounting)
  const transactionsList = [
    { type: "INCOME", amount: 4850.00, description: "Monthly Storage Billing Invoice INV-001", category: "Storage Fees" },
    { type: "INCOME", amount: 1250.00, description: "Pick & Pack Fulfilment Fees for ORD-2024-1281", category: "Fulfillment" },
    { type: "EXPENSE", amount: 950.00, description: "Warehouse utilities electricity bill", category: "Utilities" },
    { type: "EXPENSE", amount: 3200.00, description: "Staff payroll weekly operator shifts", category: "Payroll" },
    { type: "TAX", amount: 1018.50, description: "Q2 sales tax reporting payout", category: "Tax Payment" },
  ];
  for (const t of transactionsList) {
    await prisma.transaction.create({ data: { ...t, companyId: company.id } });
  }

  // Audit Logs
  const auditLogsList = [
    { action: "USER_LOGIN", entity: "User", details: "admin@logitrack.com logged in from IP 192.168.1.42" },
    { action: "INVENTORY_ADJUST", entity: "InventoryItem", details: "SKU-992-8A quantity manually adjusted by +5 in location A1-04-B" },
    { action: "RETURN_PROCESS", entity: "ReturnOrder", details: "Return RET-2024-001 inspected and approved for restock by supervisor" },
  ];
  for (const a of auditLogsList) {
    await prisma.auditLog.create({ data: { ...a, companyId: company.id } });
  }

  // Subscription Settings
  await prisma.subscription.create({
    data: {
      tier: "ENTERPRISE",
      status: "ACTIVE",
      maxWarehouses: 5,
      maxUsers: 50,
      companyId: company.id,
    },
  });

  console.log("✅ Seed complete!");
  console.log(`   Company: ${company.legalName}`);
  console.log(`   Users: 5 (admin@logitrack.com, super@logitrack.com)`);
  console.log(`   Warehouse: ${warehouse.name}`);
  console.log(`   Zones: ${zones.length}`);
  console.log(`   Products: ${products.length}`);
  console.log(`   Orders: ${orderData.length}`);
  console.log(`   CRM: ${customerList.length} customers`);
  console.log(`   Returns: 1 return request`);
  console.log(`   Accounting: ${transactionsList.length} initial transactions`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
