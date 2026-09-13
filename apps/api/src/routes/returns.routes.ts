import { Router, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware.js";

const router = Router();

// GET /api/returns - list all return orders
router.get("/", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const returns = await prisma.returnOrder.findMany({
      include: {
        order: true,
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ data: returns });
  } catch (error) {
    console.error("Get returns error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/returns - lodge a new return
router.post("/", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { orderId, items } = req.body;
    if (!orderId || !items || !items.length) {
      res.status(400).json({ error: "Order ID and returned items are required" });
      return;
    }

    const returnNumber = `RET-${Date.now().toString().slice(-6)}`;
    const returnOrder = await prisma.returnOrder.create({
      data: {
        returnNumber,
        orderId,
        status: "PENDING",
        items: {
          create: items.map((i: any) => ({
            productId: i.productId,
            quantity: i.quantity,
            condition: "UNINSPECTED",
          })),
        },
      },
      include: { items: true },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        action: "RETURN_LODGE",
        entity: "ReturnOrder",
        entityId: returnOrder.id,
        details: `Return request ${returnNumber} lodged for Order ID ${orderId}`,
        companyId: req.user?.companyId!,
      },
    });

    res.status(201).json(returnOrder);
  } catch (error) {
    console.error("Lodge return error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/returns/:id/inspect - process return inspection & restock
router.post("/:id/inspect", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { condition, notes, locationId } = req.body;
    if (!condition) {
      res.status(400).json({ error: "Inspection condition is required" });
      return;
    }

    const returnOrderId = req.params.id as string;
    const returnOrder = await prisma.returnOrder.findUnique({
      where: { id: returnOrderId },
      include: { items: true },
    });

    if (!returnOrder) {
      res.status(404).json({ error: "Return order not found" });
      return;
    }

    // Update lines condition
    await prisma.returnLine.updateMany({
      where: { returnOrderId },
      data: { condition, notes },
    });

    // Update return status
    const updatedReturn = await prisma.returnOrder.update({
      where: { id: returnOrderId },
      data: {
        status: condition === "RESTOCKED" ? "COMPLETED" : "INSPECTED",
        inspectionNotes: notes,
      },
      include: { items: true },
    });

    // If restocked, add stock back to inventory location
    if (condition === "RESTOCKED" && locationId) {
      for (const item of returnOrder.items) {
        // Upsert inventory item at specified location
        await prisma.inventoryItem.upsert({
          where: {
            productId_locationId: {
              productId: item.productId,
              locationId,
            },
          },
          update: {
            quantity: { increment: item.quantity },
          },
          create: {
            productId: item.productId,
            locationId,
            quantity: item.quantity,
            status: "AVAILABLE",
          },
        });
      }
    }

    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        action: "RETURN_INSPECT",
        entity: "ReturnOrder",
        entityId: returnOrderId,
        details: `Return ${returnOrder.returnNumber} processed with condition: ${condition}`,
        companyId: req.user?.companyId!,
      },
    });

    res.json(updatedReturn);
  } catch (error) {
    console.error("Inspect return error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
