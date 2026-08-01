import prisma from "@/lib/prisma";
import { ItemType } from "@prisma/client";
import { z } from "zod";
import { createMenuItemSchema, updateMenuItemSchema } from "@/lib/validations";

export type CreateMenuItemInput = z.infer<typeof createMenuItemSchema>;
export type UpdateMenuItemInput = z.infer<typeof updateMenuItemSchema>;

export class MenuService {
  /**
   * Get all categories with their menu items
   */
  static async getMenuCatalog() {
    return await prisma.category.findMany({
      where: { isActive: true },
      include: {
        menuItems: {
          orderBy: { name: "asc" },
        },
      },
      orderBy: { order: "asc" },
    });
  }

  /**
   * Get menu items with optional category filter
   */
  static async getMenuItems(categoryId?: string) {
    const where = categoryId ? { categoryId } : {};
    return await prisma.menuItem.findMany({
      where,
      include: { category: true },
      orderBy: { name: "asc" },
    });
  }

  /**
   * Create a new menu item
   */
  static async createMenuItem(data: CreateMenuItemInput) {
    const validated = createMenuItemSchema.parse(data);

    return await prisma.menuItem.create({
      data: {
        name: validated.name,
        description: validated.description,
        price: validated.price,
        categoryId: validated.categoryId,
        type: validated.type as ItemType,
        isAvailable: validated.isAvailable,
        isChefSpecial: validated.isChefSpecial,
        isBestSeller: validated.isBestSeller,
        isRecommended: validated.isRecommended,
        image: validated.image,
        preparationTime: validated.preparationTime,
      },
      include: { category: true },
    });
  }

  /**
   * Update a menu item (e.g. toggle availability, change price)
   */
  static async updateMenuItem(id: string, data: UpdateMenuItemInput) {
    const validated = updateMenuItemSchema.parse(data);

    return await prisma.menuItem.update({
      where: { id },
      data: {
        ...(validated.name && { name: validated.name }),
        ...(validated.description && { description: validated.description }),
        ...(validated.price !== undefined && { price: validated.price }),
        ...(validated.categoryId && { categoryId: validated.categoryId }),
        ...(validated.type && { type: validated.type as ItemType }),
        ...(validated.isAvailable !== undefined && { isAvailable: validated.isAvailable }),
        ...(validated.isChefSpecial !== undefined && { isChefSpecial: validated.isChefSpecial }),
        ...(validated.isBestSeller !== undefined && { isBestSeller: validated.isBestSeller }),
        ...(validated.isRecommended !== undefined && { isRecommended: validated.isRecommended }),
        ...(validated.image && { image: validated.image }),
        ...(validated.preparationTime && { preparationTime: validated.preparationTime }),
      },
      include: { category: true },
    });
  }

  /**
   * Delete a menu item
   */
  static async deleteMenuItem(id: string) {
    return await prisma.menuItem.delete({
      where: { id },
    });
  }
}
