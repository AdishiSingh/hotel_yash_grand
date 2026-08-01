import { describe, it, expect } from "vitest";
import { 
  createOrderSchema, 
  createRoomBookingSchema, 
  createMenuItemSchema, 
  updateOrderStatusSchema 
} from "@/lib/validations";
import { TEST_FIXTURES } from "./fixtures/test-fixtures";

describe("ValidationsSchemaEngine — Zod Enterprise Schema Validators", () => {
  
  describe("createOrderSchema", () => {
    it("should validate a valid restaurant order payload", () => {
      const parsed = createOrderSchema.safeParse(TEST_FIXTURES.ORDER_PAYLOAD);
      expect(parsed.success).toBe(true);
    });

    it("should fail validation when tableNumber is missing", () => {
      const invalidOrder = {
        ...TEST_FIXTURES.ORDER_PAYLOAD,
        tableNumber: "",
      };

      const parsed = createOrderSchema.safeParse(invalidOrder);
      expect(parsed.success).toBe(false);
    });

    it("should fail validation when order items array is empty", () => {
      const invalidOrder = {
        ...TEST_FIXTURES.ORDER_PAYLOAD,
        items: [],
      };

      const parsed = createOrderSchema.safeParse(invalidOrder);
      expect(parsed.success).toBe(false);
    });

    it("should fail validation when item quantity is <= 0", () => {
      const invalidOrder = {
        ...TEST_FIXTURES.ORDER_PAYLOAD,
        items: [{ itemName: "Paneer Tikka", quantity: 0, price: 350 }],
      };

      const parsed = createOrderSchema.safeParse(invalidOrder);
      expect(parsed.success).toBe(false);
    });
  });

  describe("createRoomBookingSchema", () => {
    it("should validate a valid room booking payload", () => {
      const parsed = createRoomBookingSchema.safeParse(TEST_FIXTURES.ROOM_BOOKING_PAYLOAD);
      expect(parsed.success).toBe(true);
    });

    it("should fail validation when customerPhone is under 10 digits", () => {
      const invalidBooking = {
        ...TEST_FIXTURES.ROOM_BOOKING_PAYLOAD,
        customerPhone: "12345",
      };

      const parsed = createRoomBookingSchema.safeParse(invalidBooking);
      expect(parsed.success).toBe(false);
    });
  });

  describe("createMenuItemSchema", () => {
    it("should validate a valid menu item creation payload", () => {
      const validMenuItem = {
        name: "Dal Makhani Grand",
        description: "Slow-cooked black lentils in white butter",
        price: 420,
        categoryId: "cat-main-course",
        type: "VEG",
        isAvailable: true,
        isChefSpecial: true,
      };

      const parsed = createMenuItemSchema.safeParse(validMenuItem);
      expect(parsed.success).toBe(true);
    });

    it("should fail validation when menu item price is negative", () => {
      const invalidMenuItem = {
        name: "Dal Makhani Grand",
        price: -50,
        categoryId: "cat-main-course",
      };

      const parsed = createMenuItemSchema.safeParse(invalidMenuItem);
      expect(parsed.success).toBe(false);
    });
  });

  describe("updateOrderStatusSchema", () => {
    it("should validate valid order status transitions", () => {
      const validUpdate = {
        status: "READY",
        paymentStatus: "COMPLETED",
      };

      const parsed = updateOrderStatusSchema.safeParse(validUpdate);
      expect(parsed.success).toBe(true);
    });

    it("should fail validation on invalid status string", () => {
      const invalidUpdate = {
        status: "INVALID_STATUS",
      };

      const parsed = updateOrderStatusSchema.safeParse(invalidUpdate);
      expect(parsed.success).toBe(false);
    });
  });
});
