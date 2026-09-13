import { Router, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { authMiddleware, rbacMiddleware, AuthRequest } from "../middleware/auth.middleware.js";

const router = Router();

// GET /api/saas/tenants - list all registered tenant companies
router.get(
  "/tenants",
  authMiddleware,
  rbacMiddleware(["SAAS_SUPER_ADMIN"]),
  async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
      const companies = await prisma.company.findMany({
        include: {
          subscriptions: true,
          _count: {
            select: { users: true, warehouses: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      res.json({ data: companies });
    } catch (error) {
      console.error("Get tenants error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// PUT /api/saas/tenants/:id/subscription - update tenant subscription tier & limits
router.put(
  "/tenants/:id/subscription",
  authMiddleware,
  rbacMiddleware(["SAAS_SUPER_ADMIN"]),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { tier, status, maxWarehouses, maxUsers } = req.body;
      const companyId = req.params.id as string;

      const subscription = await prisma.subscription.findFirst({
        where: { companyId },
      });

      let updatedSubscription;
      if (subscription) {
        updatedSubscription = await prisma.subscription.update({
          where: { id: subscription.id },
          data: { tier, status, maxWarehouses, maxUsers },
        });
      } else {
        updatedSubscription = await prisma.subscription.create({
          data: {
            tier: tier || "STARTER",
            status: status || "ACTIVE",
            maxWarehouses: maxWarehouses || 1,
            maxUsers: maxUsers || 5,
            companyId,
          },
        });
      }

      await prisma.auditLog.create({
        data: {
          userId: req.user?.id,
          action: "SAAS_TENANT_SUBSCRIPTION_UPDATE",
          entity: "Subscription",
          entityId: updatedSubscription.id,
          details: `Tenant subscription updated for Company ID ${companyId}. Tier: ${tier}, Status: ${status}`,
          companyId: req.user?.companyId!,
        },
      });

      res.json(updatedSubscription);
    } catch (error) {
      console.error("Update tenant subscription error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// GET /api/saas/metrics - general platform status/usage dashboard
router.get(
  "/metrics",
  authMiddleware,
  rbacMiddleware(["SAAS_SUPER_ADMIN"]),
  async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
      const [companiesCount, usersCount, subscriptionStats] = await Promise.all([
        prisma.company.count(),
        prisma.user.count(),
        prisma.subscription.groupBy({
          by: ["tier", "status"],
          _count: true,
        }),
      ]);

      res.json({
        metrics: {
          totalCompanies: companiesCount,
          totalUsers: usersCount,
          subscriptions: subscriptionStats,
        },
      });
    } catch (error) {
      console.error("Get SaaS metrics error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
