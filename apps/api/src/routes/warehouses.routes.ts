import { Router, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware.js";

const router = Router();

// GET /api/warehouses
router.get("/", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const warehouses = await prisma.warehouse.findMany({
      where: { companyId: req.user?.companyId },
      include: { zones: { include: { _count: { select: { locations: true } } } } },
      orderBy: { name: "asc" },
    });
    res.json({ data: warehouses });
  } catch (error) {
    console.error("Get warehouses error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/warehouses/:id
router.get("/:id", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const warehouse = await prisma.warehouse.findUnique({
      where: { id: req.params.id as string },
      include: { zones: { include: { locations: true } } },
    });
    if (!warehouse) { res.status(404).json({ error: "Warehouse not found" }); return; }
    res.json(warehouse);
  } catch (error) {
    console.error("Get warehouse error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
