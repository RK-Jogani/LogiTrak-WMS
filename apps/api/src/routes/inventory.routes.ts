import { Router, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware.js";

const router = Router();

// GET /api/inventory
router.get("/", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = "1", limit = "20", status } = req.query;
    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      prisma.inventoryItem.findMany({
        where,
        include: { product: true, location: { include: { zone: true } } },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { updatedAt: "desc" },
      }),
      prisma.inventoryItem.count({ where }),
    ]);

    res.json({ data: items, pagination: { page: Number(page), limit: Number(limit), total } });
  } catch (error) {
    console.error("Get inventory error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
