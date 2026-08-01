/**
 * WhatsApp integration utility for HOTEL YASH GRAND
 */

export interface WhatsAppOrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface BuildWhatsAppMessageParams {
  orderId: string; // e.g. "YG1032" or "#YG1032"
  tableNumber: number | string;
  items: WhatsAppOrderItem[];
  totalQuantity: number;
  totalAmount: number;
  timeStr?: string;
}

export const OFFICIAL_HOTEL_WHATSAPP = "919151088115";

/**
 * Builds the exact prefilled WhatsApp message requested by user specifications
 */
export function buildFormattedWhatsAppMessage({
  orderId,
  tableNumber,
  items,
  totalQuantity,
  totalAmount,
  timeStr,
}: BuildWhatsAppMessageParams): string {
  const formattedOrderId = orderId.startsWith("#") ? orderId : `#${orderId}`;
  
  // Format current time if not provided (e.g. 8:12 PM)
  const timeDisplay = timeStr || new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const itemLines = items
    .map((item) => `• ${item.name} x${item.quantity}`)
    .join("\n");

  const message = `HOTEL YASH GRAND

Order ID: ${formattedOrderId}

Table Number: ${tableNumber}

Items

${itemLines}

Total Quantity: ${totalQuantity}

Total Amount: ₹${totalAmount}

Time: ${timeDisplay}`;

  return message;
}

/**
 * Returns the wa.me deep link URL with encoded message
 */
export function getWhatsAppDeepLink(
  params: BuildWhatsAppMessageParams,
  phoneNumber: string = OFFICIAL_HOTEL_WHATSAPP
): string {
  const message = buildFormattedWhatsAppMessage(params);
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
