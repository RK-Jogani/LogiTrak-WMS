import { Router, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware.js";

const router = Router();

// GET /api/crm - get customer database/leads
router.get("/", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    const where: Record<string, unknown> = { companyId: req.user?.companyId };
    if (status) where.status = status;

    const customers = await prisma.customer.findMany({
      where,
      orderBy: { name: "asc" },
    });

    res.json({ data: customers });
  } catch (error) {
    console.error("Get CRM customers error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/crm - create customer/lead
router.post("/", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, phone, status, notes } = req.body;
    if (!name) {
      res.status(400).json({ error: "Name is required" });
      return;
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        status: status || "PROSPECT",
        notes,
        companyId: req.user?.companyId!,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        action: "CRM_CUSTOMER_CREATE",
        entity: "Customer",
        entityId: customer.id,
        details: `Customer ${customer.name} created as ${customer.status}`,
        companyId: req.user?.companyId!,
      },
    });

    res.status(201).json(customer);
  } catch (error) {
    console.error("Create CRM customer error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/crm/:id - update customer/lead
router.put("/:id", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, phone, status, notes } = req.body;
    const customer = await prisma.customer.update({
      where: { id: req.params.id as string },
      data: { name, email, phone, status, notes },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        action: "CRM_CUSTOMER_UPDATE",
        entity: "Customer",
        entityId: customer.id,
        details: `Customer ${customer.name} updated to ${customer.status}`,
        companyId: req.user?.companyId!,
      },
    });

    res.json(customer);
  } catch (error) {
    console.error("Update CRM customer error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
