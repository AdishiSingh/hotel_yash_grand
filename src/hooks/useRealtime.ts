"use client";

import { useEffect, useRef, useState } from "react";
import { RealtimeEventType, RealtimeEventPayload } from "@/lib/events";

export function useRealtime(
  targetEvents: RealtimeEventType[],
  onEvent: (payload: RealtimeEventPayload) => void
) {
  const [isConnected, setIsConnected] = useState(false);
  const processedIdsRef = useRef<Set<string>>(new Set());
  const callbackRef = useRef(onEvent);

  useEffect(() => {
    callbackRef.current = onEvent;
  }, [onEvent]);

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let isMounted = true;

    function connect() {
      if (!isMounted) return;

      eventSource = new EventSource("/api/events");

      eventSource.onopen = () => {
        if (isMounted) setIsConnected(true);
      };

      eventSource.onmessage = (e) => {
        try {
          const payload: RealtimeEventPayload = JSON.parse(e.data);

          if (!payload.id || processedIdsRef.current.has(payload.id)) {
            return; // Deduplicate events
          }

          // Keep deduplication set bounded to last 100 entries
          processedIdsRef.current.add(payload.id);
          if (processedIdsRef.current.size > 100) {
            const firstItem = processedIdsRef.current.values().next().value;
            if (firstItem) processedIdsRef.current.delete(firstItem);
          }

          if (targetEvents.includes(payload.type) || targetEvents.includes("DASHBOARD_REFRESH")) {
            callbackRef.current(payload);
          }
        } catch (err) {
          console.error("[useRealtime] Error parsing event payload:", err);
        }
      };

      eventSource.onerror = () => {
        if (isMounted) setIsConnected(false);
        eventSource?.close();
        // EventSource automatically retries due to 'retry: 1000' header
      };
    }

    connect();

    return () => {
      isMounted = false;
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [targetEvents.join(",")]);

  return { isConnected };
}
