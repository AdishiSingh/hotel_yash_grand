export interface OrderItem {
  name: string;
  category?: string;
  quantity: number;
  price: number;
  variantLabel?: string;
}

export interface WhatsAppOrderPayload {
  orderId: string;
  customerName: string;
  tableNumber: string;
  items: OrderItem[];
  totalItems: number;
  totalBill: number;
  orderDateStr: string;
  orderTimeStr: string;
}

export function generateOrderId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const randomSeq = String(Math.floor(100 + Math.random() * 900));
  return `YG-${year}${month}${day}-${randomSeq}`;
}

export function formatOrderDate(date: Date = new Date()): { dateStr: string; timeStr: string } {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = String(date.getDate()).padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const dateStr = `${day} ${month} ${year}`;

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const hoursStr = String(hours).padStart(2, "0");
  const timeStr = `${hoursStr}:${minutes} ${ampm}`;

  return { dateStr, timeStr };
}

export function buildWhatsAppOrderMessage(payload: WhatsAppOrderPayload): string {
  const { orderId, customerName, tableNumber, items, totalItems, totalBill, orderDateStr, orderTimeStr } = payload;

  const formattedItems = items
    .map((i) => {
      const itemTitle = i.variantLabel ? `${i.name} (${i.variantLabel})` : i.name;
      return `${i.quantity} × ${itemTitle}      ₹${i.price * i.quantity}`;
    })
    .join("\n\n");

  return `🏨 HOTEL YASH GRAND

🆕 NEW DINE-IN ORDER

Order ID:
${orderId}

Ordered By:
${customerName || "Guest"}

Table Number:
${tableNumber}

--------------------------------

${formattedItems}

--------------------------------

Total Items:
${totalItems}

Total Bill:
₹${totalBill}

Order Time:
${orderDateStr}
${orderTimeStr}

--------------------------------

Please start preparing this order.`;
}
