"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log("🌱 Seeding database...");
    // Company
    const company = await prisma.company.create({
        data: {
            legalName: "LogiTrack Demo Inc.",
            taxId: "US-12-3456789",
            locale: "en-US",
        },
    });
    // Users
    const hashedPassword = await bcryptjs_1.default.hash("admin123", 12);
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
        { name: "Zone A — Receiving", template: "STANDARD_3PL" },
        { name: "Zone B — Bulk Storage", template: "STANDARD_3PL" },
        { name: "Zone C — High Value", template: "ECOMMERCE" },
        { name: "Zone D — Pick Face", template: "ECOMMERCE" },
        { name: "Zone E — Outbound", template: "CROSS_DOCK" },
    ];
    const zones = [];
    for (const z of zoneNames) {
        const zone = await prisma.zone.create({
            data: { name: z.name, warehouseId: warehouse.id, template: z.template },
        });
        zones.push(zone);
    }
    // Locations (a few per zone)
    const locationData = zones.flatMap((zone, zi) => Array.from({ length: 6 }, (_, li) => ({
        barcode: `${String.fromCharCode(65 + zi)}${li + 1}-04-B`,
        zoneId: zone.id,
        capacity: 100,
        currentFill: Math.floor(Math.random() * 100),
        status: Math.random() > 0.8 ? "OCCUPIED" : "AVAILABLE",
    })));
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
        { orderNumber: "ORD-2024-1284", channel: "Shopify", customer: "Acme Industries", status: "PICKING", companyId: company.id },
        { orderNumber: "ORD-2024-1283", channel: "Amazon", customer: "Global Supplies Co.", status: "PACKED", companyId: company.id },
        { orderNumber: "ORD-2024-1282", channel: "Manual", customer: "Baker Electronics", status: "NEW", companyId: company.id },
        { orderNumber: "ORD-2024-1281", channel: "Shopify", customer: "Summit Logistics", status: "SHIPPED", companyId: company.id },
        { orderNumber: "ORD-2024-1280", channel: "Amazon", customer: "Pinnacle Parts", status: "DELIVERED", companyId: company.id },
    ];
    for (let i = 0; i < orderData.length; i++) {
        await prisma.order.create({
            data: {
                ...orderData[i],
                dueDate: new Date(Date.now() + (i - 2) * 86400000),
                items: {
                    create: { productId: products[i % products.length].id, quantity: Math.floor(Math.random() * 10) + 1 },
                },
            },
        });
    }
    console.log("✅ Seed complete!");
    console.log(`   Company: ${company.legalName}`);
    console.log(`   Users: 4 (admin@logitrack.com / admin123)`);
    console.log(`   Warehouse: ${warehouse.name}`);
    console.log(`   Zones: ${zones.length}`);
    console.log(`   Products: ${products.length}`);
    console.log(`   Orders: ${orderData.length}`);
}
main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
//# sourceMappingURL=seed.js.map