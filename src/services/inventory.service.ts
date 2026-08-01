import prisma from "@/lib/prisma";
import { z } from "zod";
import { createInventorySchema, updateInventorySchema } from "@/lib/validations";
import { AuditLogService } from "@/services/audit.service";
import { NotificationService } from "@/services/notification.service";
import { realtimeBus } from "@/lib/events";

export type CreateInventoryInput = z.infer<typeof createInventorySchema>;
export type UpdateInventoryInput = z.infer<typeof updateInventorySchema>;

export class InventoryService {
  /**
   * Get all inventory items with optional department filter
   */
  static async getInventory(params?: { category?: string; department?: string }) {
    const where: any = {};
    if (params?.category) where.category = params.category;
    if (params?.department) where.department = params.department;

    return await prisma.inventory.findMany({
      where,
      orderBy: { name: "asc" },
      include: { movements: { take: 5, orderBy: { createdAt: "desc" } } },
    });
  }

  /**
   * Create inventory item
   */
  static async createInventoryItem(data: CreateInventoryInput & { department?: string; maxThreshold?: number; reorderLevel?: number }) {
    const validated = createInventorySchema.parse(data);

    const item = await prisma.inventory.create({
      data: {
        name: validated.name,
        category: validated.category,
        department: data.department || "KITCHEN",
        quantity: validated.quantity,
        unit: validated.unit,
        minThreshold: validated.minThreshold,
        maxThreshold: data.maxThreshold || 500.0,
        reorderLevel: data.reorderLevel || 20.0,
        supplier: validated.supplier,
        costPerUnit: validated.costPerUnit,
        lastRestocked: new Date(),
      },
    });

    await AuditLogService.log({
      action: "INVENTORY_CREATED",
      details: `Added new stock item '${item.name}' (${item.quantity} ${item.unit})`,
    });

    realtimeBus.broadcast("INVENTORY_UPDATED", "CREATED", item);
    realtimeBus.broadcast("DASHBOARD_REFRESH", "INVENTORY_CHANGE");

    return item;
  }

  /**
   * Restock or Update inventory item
   */
  static async updateInventoryItem(id: string, data: UpdateInventoryInput & { department?: string }) {
    const validated = updateInventorySchema.parse(data);

    const updated = await prisma.inventory.update({
      where: { id },
      data: {
        ...(validated.name && { name: validated.name }),
        ...(validated.category && { category: validated.category }),
        ...(data.department && { department: data.department }),
        ...(validated.quantity !== undefined && { quantity: validated.quantity }),
        ...(validated.unit && { unit: validated.unit }),
        ...(validated.minThreshold !== undefined && { minThreshold: validated.minThreshold }),
        ...(validated.supplier && { supplier: validated.supplier }),
        ...(validated.costPerUnit !== undefined && { costPerUnit: validated.costPerUnit }),
        lastRestocked: new Date(),
      },
    });

    // Generate alert if item falls below minimum threshold
    if (updated.quantity <= updated.minThreshold) {
      await NotificationService.createNotification({
        title: "Low Inventory Alert",
        message: `Stock level for '${updated.name}' fell to ${updated.quantity} ${updated.unit} (Min Threshold: ${updated.minThreshold})`,
        type: "ALERT",
        link: "/dashboard/inventory",
      });
    }

    await AuditLogService.log({
      action: "INVENTORY_UPDATED",
      details: `Updated inventory item '${updated.name}' stock level to ${updated.quantity} ${updated.unit}`,
    });

    realtimeBus.broadcast("INVENTORY_UPDATED", "UPDATED", updated);
    realtimeBus.broadcast("DASHBOARD_REFRESH", "INVENTORY_CHANGE");

    return updated;
  }

  /**
   * Automatic Consumption Deduction on Order Completion
   */
  static async autoDeductOrderConsumption(items: Array<{ itemName: string; quantity: number }>) {
    try {
      const allInventory = await prisma.inventory.findMany();

      for (const item of items) {
        // Find matching raw ingredient
        const matchingStock = allInventory.find((inv) =>
          item.itemName.toLowerCase().includes(inv.name.toLowerCase()) ||
          inv.name.toLowerCase().includes(item.itemName.toLowerCase().split(" ")[0])
        );

        if (matchingStock) {
          const deductQty = item.quantity * 0.2; // Estimated 0.2 units per order
          const newQty = Math.max(0, matchingStock.quantity - deductQty);

          await prisma.inventory.update({
            where: { id: matchingStock.id },
            data: { quantity: newQty },
          });

          await prisma.stockMovement.create({
            data: {
              inventoryId: matchingStock.id,
              type: "CONSUMPTION",
              quantity: deductQty,
              reason: `Automatic order consumption for '${item.itemName}'`,
            },
          });
        }
      }

      realtimeBus.broadcast("INVENTORY_UPDATED", "AUTO_DEDUCT");
    } catch (err) {
      console.error("Failed auto deduct order consumption:", err);
    }
  }

  /**
   * Get Active Inventory Alerts (Low Stock, Out of Stock, Near Expiry)
   */
  static async getInventoryAlerts() {
    const items = await prisma.inventory.findMany();
    const now = Date.now();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

    const outOfStock = items.filter((i) => i.quantity <= 0);
    const lowStock = items.filter((i) => i.quantity > 0 && i.quantity <= i.minThreshold);
    const nearExpiry = items.filter((i) => i.expiryDate && new Date(i.expiryDate).getTime() - now <= sevenDaysMs && new Date(i.expiryDate).getTime() > now);
    const expired = items.filter((i) => i.expiryDate && new Date(i.expiryDate).getTime() <= now);

    return {
      outOfStock,
      lowStock,
      nearExpiry,
      expired,
      totalAlerts: outOfStock.length + lowStock.length + nearExpiry.length + expired.length,
    };
  }

  /**
   * Compute Total Valuation & Consumption Reports
   */
  static async getInventoryAnalytics() {
    const items = await prisma.inventory.findMany();

    const totalValuation = items.reduce((sum, item) => sum + item.quantity * (item.costPerUnit || 100), 0);

    const movements = await prisma.stockMovement.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    const todayMs = new Date().setHours(0, 0, 0, 0);
    const todayConsumption = movements
      .filter((m) => m.type === "CONSUMPTION" && new Date(m.createdAt).getTime() >= todayMs)
      .reduce((sum, m) => sum + m.quantity, 0);

    return {
      totalValuation: Math.round(totalValuation * 100) / 100,
      totalItemsCount: items.length,
      todayConsumption: Math.round(todayConsumption * 10) / 10,
      recentMovements: movements.slice(0, 10),
    };
  }

  /**
   * Delete inventory item
   */
  static async deleteInventoryItem(id: string) {
    const res = await prisma.inventory.delete({
      where: { id },
    });

    await AuditLogService.log({
      action: "INVENTORY_DELETED",
      details: `Deleted inventory item '${id}'`,
    });

    realtimeBus.broadcast("INVENTORY_UPDATED", "DELETED", { id });
    realtimeBus.broadcast("DASHBOARD_REFRESH", "INVENTORY_CHANGE");

    return res;
  }
}
