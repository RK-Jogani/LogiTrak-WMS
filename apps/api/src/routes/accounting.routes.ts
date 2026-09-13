import { Router, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware.js";

const router = Router();

// GET /api/accounting - list general ledger transactions
router.get("/", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type } = req.query;
    const where: Record<string, unknown> = { companyId: req.user?.companyId };
    if (type) where.type = type;

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    res.json({ data: transactions });
  } catch (error) {
    console.error("Get transactions error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/accounting/summary - balance sheet / financial health summary
router.get("/summary", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const where = { companyId: req.user?.companyId };
    const transactions = await prisma.transaction.findMany({ where });

    let income = 0;
    let expense = 0;
    let tax = 0;

    for (const t of transactions) {
      if (t.type === "INCOME" || t.type === "BILLING") {
        income += t.amount;
      } else if (t.type === "EXPENSE") {
        expense += t.amount;
      } else if (t.type === "TAX") {
        tax += t.amount;
      }
    }

    res.json({
      summary: {
        totalIncome: income,
        totalExpense: expense,
        totalTax: tax,
        netProfit: income - expense - tax,
        transactionCount: transactions.length,
      },
    });
  } catch (error) {
    console.error("Get accounting summary error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/accounting - record manual transaction ledger item
router.post("/", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type, amount, description, category } = req.body;
    if (!type || !amount || !description || !category) {
      res.status(400).json({ error: "All transaction fields are required" });
      return;
    }

    const transaction = await prisma.transaction.create({
      data: {
        type,
        amount: Number(amount),
        description,
        category,
        companyId: req.user?.companyId!,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        action: "FINANCE_TRANSACTION_CREATE",
        entity: "Transaction",
        entityId: transaction.id,
        details: `Recorded financial entry: ${type} of €${amount} for ${description}`,
        companyId: req.user?.companyId!,
      },
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error("Create transaction error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
