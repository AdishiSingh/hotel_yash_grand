import prisma from "@/lib/prisma";
import { z } from "zod";
import { createCustomerSchema } from "@/lib/validations";

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;

export class CustomerService {
  /**
   * Create or update customer
   */
  static async createCustomer(data: CreateCustomerInput) {
    const validated = createCustomerSchema.parse(data);

    return await prisma.customer.upsert({
      where: { phone: validated.phone },
      update: {
        name: validated.name,
        email: validated.email || undefined,
        notes: validated.notes,
      },
      create: {
        name: validated.name,
        phone: validated.phone,
        email: validated.email || undefined,
        notes: validated.notes,
      },
    });
  }

  /**
   * Search / List customers
   */
  static async getCustomers(query?: string) {
    const where = query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" as const } },
            { phone: { contains: query } },
            { email: { contains: query, mode: "insensitive" as const } },
          ],
        }
      : {};

    return await prisma.customer.findMany({
      where,
      include: {
        orders: { take: 5, orderBy: { createdAt: "desc" } },
        roomBookings: { take: 5, orderBy: { createdAt: "desc" } },
        banquetBookings: { take: 5, orderBy: { createdAt: "desc" } },
      },
      orderBy: { lastVisit: "desc" },
    });
  }

  /**
   * Get Customer by ID
   */
  static async getCustomerById(id: string) {
    return await prisma.customer.findUnique({
      where: { id },
      include: {
        orders: { orderBy: { createdAt: "desc" } },
        roomBookings: { include: { room: true }, orderBy: { createdAt: "desc" } },
        banquetBookings: { orderBy: { createdAt: "desc" } },
      },
    });
  }

  /**
   * Delete Customer
   */
  static async deleteCustomer(id: string) {
    return await prisma.customer.delete({
      where: { id },
    });
  }
}
