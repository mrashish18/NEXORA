import { useState, useEffect, useCallback } from "react";
import { api } from "../services/api";
import type { HealthResponse } from "../types/api";

export interface BackendHealthState {
  isChecking: boolean;
  isOnline: boolean;
  statusText: "Online" | "Offline" | "Degraded" | "Checking";
  llmAvailable: boolean;
  llmMessage: string;
  kbIndexed: boolean;
  chunksCount: number;
  data: HealthResponse | null;
  refetch: () => Promise<void>;
}

export function useBackendHealth(pollIntervalMs: number = 20000): BackendHealthState {
  const [data, setData] = useState<HealthResponse | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  const checkHealth = useCallback(async () => {
    try {
      const res = await api.health();
      setData(res);
    } catch {
      setData({
        status: "error",
        backend: "offline",
        service: "NEXORA RAG Engine",
        llm: { provider: "unknown", available: false, message: "Unreachable" },
        knowledge_base: { indexed: false, chunks_count: 0 },
      });
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
    if (pollIntervalMs > 0) {
      const timer = setInterval(checkHealth, pollIntervalMs);
      return () => clearInterval(timer);
    }
  }, [checkHealth, pollIntervalMs]);

  const isOnline = data?.backend === "online";
  const llmAvailable = Boolean(data?.llm?.available);
  const kbIndexed = Boolean(data?.knowledge_base?.indexed);
  const chunksCount = data?.knowledge_base?.chunks_count || 0;

  let statusText: "Online" | "Offline" | "Degraded" | "Checking" = "Checking";
  if (!isChecking) {
    if (isOnline && llmAvailable) {
      statusText = "Online";
    } else if (isOnline) {
      statusText = "Degraded";
    } else {
      statusText = "Offline";
    }
  }

  return {
    isChecking,
    isOnline,
    statusText,
    llmAvailable,
    llmMessage: data?.llm?.message || "",
    kbIndexed,
    chunksCount,
    data,
    refetch: checkHealth,
  };
}
