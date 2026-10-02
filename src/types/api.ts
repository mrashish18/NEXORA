export interface LLMHealthInfo {
  provider: string;
  configured?: boolean;
  available: boolean;
  message: string;
  model?: string;
}

export interface KnowledgeBaseHealthInfo {
  indexed: boolean;
  chunks_count: number;
}

export interface HealthResponse {
  status: "ok" | "degraded" | "error";
  backend: string;
  service: string;
  llm?: LLMHealthInfo;
  knowledge_base?: KnowledgeBaseHealthInfo;
  error?: string;
}

export interface ApiError {
  code?: string;
  message: string;
}

export interface AskResponse {
  success: boolean;
  answer?: string;
  sources?: string[];
  metadata?: {
    provider?: string;
    model?: string;
    chunks_retrieved?: number;
  };
  message?: string;
  error?: string | ApiError;
}

export interface UploadResponse {
  success: boolean;
  filename?: string;
  filepath?: string;
  size_bytes?: number;
  indexed?: boolean;
  indexing_details?: {
    success?: boolean;
    message?: string;
    characters?: number;
    total_chunks?: number;
  };
  message?: string;
  error?: string;
}

export interface IndexResponse {
  success: boolean;
  message: string;
  characters?: number;
  total_chunks?: number;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  sources?: string[];
  isError?: boolean;
}
