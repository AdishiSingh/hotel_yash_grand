import { NextRequest } from "next/server";
import { realtimeBus, RealtimeEventPayload } from "@/lib/events";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send SSE retry interval header for automatic client reconnection (1 second)
      controller.enqueue(encoder.encode("retry: 1000\n\n"));

      // Send initial connection acknowledgement
      const initPayload: RealtimeEventPayload = {
        id: `init-${Date.now()}`,
        type: "DASHBOARD_REFRESH",
        action: "CONNECTED",
        timestamp: new Date().toISOString(),
      };
      controller.enqueue(encoder.encode(`data: ${JSON.stringify(initPayload)}\n\n`));

      const onEvent = (payload: RealtimeEventPayload) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
        } catch (err) {
          // Client disconnected
          realtimeBus.removeListener("event", onEvent);
        }
      };

      realtimeBus.on("event", onEvent);

      // Keep-alive heartbeat interval every 15 seconds
      const pingInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": ping\n\n"));
        } catch (err) {
          clearInterval(pingInterval);
          realtimeBus.removeListener("event", onEvent);
        }
      }, 15000);

      req.signal.addEventListener("abort", () => {
        clearInterval(pingInterval);
        realtimeBus.removeListener("event", onEvent);
        try {
          controller.close();
        } catch (err) {
          // already closed
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
