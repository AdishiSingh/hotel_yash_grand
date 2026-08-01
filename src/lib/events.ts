import { EventEmitter } from "events";

export type RealtimeEventType =
  | "ORDER_UPDATED"
  | "BOOKING_UPDATED"
  | "BOOKING_REQUEST_UPDATED"
  | "INVENTORY_UPDATED"
  | "BANQUET_UPDATED"
  | "CUSTOMER_UPDATED"
  | "PAYMENT_RECORDED"
  | "NOTIFICATION_NEW"
  | "HRMS_UPDATED"
  | "DASHBOARD_REFRESH";

export interface RealtimeEventPayload {
  id: string;
  type: RealtimeEventType;
  action: string;
  data?: any;
  timestamp: string;
}

class RealtimeEventBus extends EventEmitter {
  private static instance: RealtimeEventBus;

  private constructor() {
    super();
    this.setMaxListeners(200);
  }

  public static getInstance(): RealtimeEventBus {
    if (!RealtimeEventBus.instance) {
      RealtimeEventBus.instance = new RealtimeEventBus();
    }
    return RealtimeEventBus.instance;
  }

  public broadcast(type: RealtimeEventType, action: string, data?: any) {
    const payload: RealtimeEventPayload = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type,
      action,
      data,
      timestamp: new Date().toISOString(),
    };

    this.emit("event", payload);
  }
}

export const realtimeBus = RealtimeEventBus.getInstance();
