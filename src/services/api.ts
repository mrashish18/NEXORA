import type {
  HealthResponse,
  AskResponse,
  UploadResponse,
  IndexResponse,
} from "../types/api";

// Resolve API base URL:
// - In development (import.meta.env.DEV): defaults to local Flask server (http://127.0.0.1:5000)
// - In production (import.meta.env.PROD): uses explicitly configured VITE_API_BASE_URL
//   CRITICAL: Never fall back to localhost (http://127.0.0.1:5000) on remote production deployments!
const rawConfiguredUrl = typeof import.meta.env.VITE_API_BASE_URL === "string"
  ? import.meta.env.VITE_API_BASE_URL.trim()
  : "";

const isProduction = import.meta.env.PROD;

const isLocalhostUrl = (url: string): boolean =>
  /^(https?:\/\/)?(127\.0\.0\.1|localhost)(:\d+)?(\/.*)?$/i.test(url.trim());

const isRunningLocally = typeof window !== "undefined"
  ? (window.location.hostname === "localhost" ||
     window.location.hostname === "127.0.0.1" ||
     window.location.hostname === "[::1]")
  : false;

function resolveApiBaseUrl(): string {
  if (rawConfiguredUrl) {
    // In production, reject localhost/127.0.0.1 if running on a remote domain (e.g. Vercel)
    if (isProduction && isLocalhostUrl(rawConfiguredUrl) && !isRunningLocally) {
      return "";
    }
    return rawConfiguredUrl.replace(/\/+$/, "");
  }

  // When unconfigured:
  // - Localhost dev or preview: defaults to http://127.0.0.1:5000
  // - Remote production (e.g. Vercel): NEVER point to localhost!
  if (isProduction && !isRunningLocally) {
    return "";
  }

  return "http://127.0.0.1:5000";
}

export const API_BASE_URL = resolveApiBaseUrl();
export const IS_BACKEND_CONFIGURED = Boolean(API_BASE_URL);

/**
 * Standard HTTP helper with timeout and error handling
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = 30000
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    if (!API_BASE_URL && isProduction && !isRunningLocally) {
      throw new Error(
        "Production backend URL is not configured. Set VITE_API_BASE_URL in your Vercel project environment variables."
      );
    }

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new Error(`Request timed out after ${timeoutMs / 1000}s. Please check if the backend is responsive.`);
    }
    if (!API_BASE_URL && isProduction && !isRunningLocally) {
      throw new Error(
        "Production backend URL is not configured. Set VITE_API_BASE_URL in your Vercel project environment variables."
      );
    }
    throw new Error(
      `Cannot connect to NEXORA backend at ${API_BASE_URL || "(unconfigured)"}. Ensure the backend is running. (${error.message || "Network Error"})`
    );
  } finally {
    clearTimeout(id);
  }
}

export const api = {
  /**
   * Health check endpoint
   */
  async health(): Promise<HealthResponse> {
    if (!API_BASE_URL) {
      return {
        status: "error",
        backend: "offline",
        service: "NEXORA RAG Engine",
        error: "Production backend URL not configured (VITE_API_BASE_URL is unset). Please configure your deployed backend URL in Vercel settings.",
        llm: {
          provider: "unknown",
          available: false,
          message: "Backend deployment required",
        },
        knowledge_base: {
          indexed: false,
          chunks_count: 0,
        },
      };
    }

    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/health`, { method: "GET" }, 5000);
      if (!res.ok) {
        throw new Error(`Health check returned HTTP ${res.status}`);
      }
      return await res.json();
    } catch (err: any) {
      return {
        status: "error",
        backend: "offline",
        service: "NEXORA RAG Engine",
        error: err.message || "Failed to reach backend",
        llm: {
          provider: "unknown",
          available: false,
          message: "Backend unreachable",
        },
        knowledge_base: {
          indexed: false,
          chunks_count: 0,
        },
      };
    }
  },

  /**
   * Query the AI Assistant (RAG + LLM)
   */
  async ask(question: string): Promise<AskResponse> {
    const trimmed = question.trim();
    if (!trimmed) {
      return {
        success: false,
        message: "Question cannot be empty.",
      };
    }

    try {
      const res = await fetchWithTimeout(
        `${API_BASE_URL}/ask`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question: trimmed }),
        },
        60000 // 60s timeout for cloud LLM inference
      );

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        let errorMsg = `Backend responded with HTTP ${res.status}`;
        if (data?.error && typeof data.error === "object" && data.error.message) {
          errorMsg = data.error.message;
        } else if (typeof data?.error === "string" && data.error) {
          errorMsg = data.error;
        } else if (data?.message) {
          errorMsg = data.message;
        }
        return {
          success: false,
          message: errorMsg,
          answer: undefined,
        };
      }

      if (!data) {
        return {
          success: false,
          message: "Malformed response received from backend.",
        };
      }

      return {
        success: Boolean(data.success),
        answer: data.answer || data.data?.answer || "",
        sources: data.sources || [],
        metadata: data.metadata || {},
        message: data.message,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || "Network error while connecting to NEXORA AI.",
      };
    }
  },

  /**
   * Stream tokens from AI Assistant in real time using Server-Sent Events (SSE)
   */
  async askStream(
    question: string,
    callbacks: {
      onToken: (token: string) => void;
      onSources?: (sources: string[]) => void;
      onDone?: () => void;
      onError?: (error: string) => void;
    },
    signal?: AbortSignal
  ): Promise<void> {
    const trimmed = question.trim();
    if (!trimmed) {
      callbacks.onError?.("Question cannot be empty.");
      return;
    }

    if (!API_BASE_URL) {
      callbacks.onError?.(
        "Production backend URL is not configured. Set VITE_API_BASE_URL in your Vercel project environment variables."
      );
      return;
    }

    let hasReceivedTokens = false;
    let streamReportedError = false;

    try {
      const response = await fetch(`${API_BASE_URL}/ask/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: trimmed }),
        signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errMsg =
          errorData?.error?.message ||
          (typeof errorData?.error === "string" ? errorData.error : null) ||
          errorData?.message ||
          `Server returned HTTP ${response.status}`;
        callbacks.onError?.(errMsg);
        return;
      }

      if (!response.body) {
        throw new Error("ReadableStream not supported on this response.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith("data: ")) {
            const dataStr = trimmedLine.slice(6).trim();
            if (!dataStr) continue;

            try {
              const payload = JSON.parse(dataStr);
              if (payload.type === "token") {
                hasReceivedTokens = true;
                callbacks.onToken(payload.token);
              } else if (payload.type === "sources") {
                callbacks.onSources?.(payload.sources || []);
              } else if (payload.type === "done") {
                callbacks.onDone?.();
              } else if (payload.type === "error") {
                streamReportedError = true;
                const errMsg =
                  payload.error?.message ||
                  (typeof payload.error === "string" ? payload.error : null) ||
                  payload.message ||
                  "Streaming error occurred.";
                callbacks.onError?.(errMsg);
                return;
              }
            } catch {
              // Ignore non-json keepalive comments
            }
          }
        }
      }
      callbacks.onDone?.();
    } catch (err: any) {
      if (err.name === "AbortError") {
        callbacks.onError?.("Request cancelled.");
        return;
      }

      // Do NOT restart partially completed streams or explicit errors
      if (hasReceivedTokens || streamReportedError) {
        callbacks.onError?.(err.message || "Streaming interrupted.");
        return;
      }

      // Fallback only if transport/connection failed before any tokens arrived
      try {
        const fallbackRes = await this.ask(trimmed);
        if (fallbackRes.success && fallbackRes.answer) {
          callbacks.onSources?.(fallbackRes.sources || []);
          callbacks.onToken(fallbackRes.answer);
          callbacks.onDone?.();
        } else {
          callbacks.onError?.(fallbackRes.message || "Failed to generate answer.");
        }
      } catch (fallbackErr: any) {
        callbacks.onError?.(fallbackErr.message || err.message || "Failed to query assistant.");
      }
    }
  },

  /**
   * Upload a document and optionally index it into the vector store
   */
  async upload(file: File, autoIndex: boolean = true): Promise<UploadResponse> {
    if (!file) {
      return {
        success: false,
        message: "No file selected.",
      };
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("auto_index", autoIndex ? "true" : "false");

    try {
      const res = await fetchWithTimeout(
        `${API_BASE_URL}/upload`,
        {
          method: "POST",
          body: formData,
        },
        60000
      );

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        return {
          success: false,
          message: data?.message || `Upload failed with HTTP ${res.status}`,
        };
      }

      return data as UploadResponse;
    } catch (err: any) {
      return {
        success: false,
        message: err.message || "Network error while uploading document.",
      };
    }
  },

  /**
   * Index an already uploaded file
   */
  async index(filepath: string): Promise<IndexResponse> {
    try {
      const res = await fetchWithTimeout(
        `${API_BASE_URL}/index`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ filepath }),
        },
        30000
      );

      const data = await res.json();
      return data as IndexResponse;
    } catch (err: any) {
      return {
        success: false,
        message: err.message || "Failed to trigger document indexing.",
      };
    }
  },
};
