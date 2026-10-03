import { useState, useRef, useEffect, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { Send, Loader2, Bot, User, Sparkles, AlertCircle, RefreshCw, Square } from "lucide-react";
import { api } from "../services/api";
import { useBackendHealth } from "../hooks/useBackendHealth";
import type { ChatMessage } from "../types/api";

interface ChatPreviewProps {
  compact?: boolean;
}

const SAMPLE_PROMPTS = [
  "What is NEXORA?",
  "What procurement risks exist?",
  "How are purchase orders analyzed?",
  "Recommend actions for delayed shipments",
];

export default function ChatPreview({ compact = false }: ChatPreviewProps) {
  const [searchParams] = useSearchParams();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "ai",
      text: "Hello! I am NEXORA Copilot, your AI assistant for construction procurement, contracts, and supply chain intelligence. Ask me anything about procurement risks, vendor metrics, or uploaded project documents.",
      timestamp: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isInitialMount = useRef(true);

  const { isOnline, statusText, refetch } = useBackendHealth(15000);

  const scrollToBottom = (smooth = true) => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      });
    }
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    const initialPrompt = searchParams.get("prompt");
    if (initialPrompt && !isLoading) {
      setInput(initialPrompt);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [searchParams, isLoading]);

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    setStreamingMessageId(null);
  };

  const handleSend = async (questionText?: string) => {
    const query = (questionText !== undefined ? questionText : input).trim();
    if (!query || isLoading) return;

    setErrorMsg(null);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const aiMsgId = `ai-${Date.now()}`;
    const placeholderAiMessage: ChatMessage = {
      id: aiMsgId,
      sender: "ai",
      text: "",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      sources: [],
    };

    setMessages((prev) => [...prev, userMessage, placeholderAiMessage]);
    setInput("");
    setIsLoading(true);
    setStreamingMessageId(aiMsgId);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      await api.askStream(
        query,
        {
          onSources: (sources) => {
            setMessages((prev) =>
              prev.map((m) => (m.id === aiMsgId ? { ...m, sources } : m))
            );
          },
          onToken: (token) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === aiMsgId ? { ...m, text: m.text + token } : m
              )
            );
          },
          onDone: () => {
            setIsLoading(false);
            setStreamingMessageId(null);
            abortControllerRef.current = null;
          },
          onError: (errMsg) => {
            if (errMsg === "Request cancelled.") {
              setIsLoading(false);
              setStreamingMessageId(null);
              abortControllerRef.current = null;
              return;
            }
            setErrorMsg(errMsg);
            setMessages((prev) =>
              prev.map((m) =>
                m.id === aiMsgId
                  ? {
                      ...m,
                      text: m.text || `⚠️ ${errMsg}`,
                      isError: !m.text,
                    }
                  : m
              )
            );
            setIsLoading(false);
            setStreamingMessageId(null);
            abortControllerRef.current = null;
          },
        },
        controller.signal
      );
    } catch (err: any) {
      if (err.name !== "AbortError") {
        const errorText = err.message || "Failed to generate answer.";
        setErrorMsg(errorText);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMsgId
              ? {
                  ...m,
                  text: m.text || `⚠️ ${errorText}`,
                  isError: !m.text,
                }
              : m
          )
        );
      }
      setIsLoading(false);
      setStreamingMessageId(null);
      abortControllerRef.current = null;
    } finally {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  return (
    <div
      className="
        rounded-3xl
        border
        border-white/10
        bg-white/5
        backdrop-blur-xl
        p-6
        flex
        flex-col
        shadow-2xl
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <p className="text-xs uppercase tracking-widest text-cyan-400 font-semibold">
            AI Copilot
          </p>
          <h2 className="mt-1 text-2xl font-bold text-white flex items-center gap-2">
            NEXORA Assistant
            <Sparkles size={18} className="text-cyan-400" />
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-3 py-1.5">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                statusText === "Online"
                  ? "bg-green-400 animate-pulse"
                  : statusText === "Degraded"
                  ? "bg-yellow-400"
                  : "bg-red-400"
              }`}
            />
            <span
              className={`text-xs font-medium ${
                statusText === "Online"
                  ? "text-green-400"
                  : statusText === "Degraded"
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}
            >
              {statusText === "Online"
                ? "Live AI Online"
                : statusText === "Degraded"
                ? "Backend Online (LLM Offline)"
                : "Backend Offline"}
            </span>
          </div>

          <button
            onClick={() => refetch()}
            title="Refresh backend status"
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Suggested Chips */}
      <div className="mt-4 flex flex-wrap gap-2">
        {SAMPLE_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSend(prompt)}
            disabled={isLoading}
            className="text-xs rounded-full border border-white/10 bg-slate-900/60 px-3 py-1.5 text-slate-300 transition hover:border-cyan-500/50 hover:bg-slate-800 hover:text-cyan-300 disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        className={`mt-4 space-y-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700 ${
          compact ? "max-h-[380px] min-h-[280px]" : "max-h-[520px] min-h-[360px]"
        }`}
      >
        {messages.map((message) => {
          const isUser = message.sender === "user";
          return (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                isUser ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm ${
                  isUser
                    ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20"
                    : message.isError
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : "bg-slate-800 text-cyan-400 border border-white/10"
                }`}
              >
                {isUser ? <User size={16} /> : message.isError ? <AlertCircle size={16} /> : <Bot size={16} />}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[85%] rounded-2xl px-5 py-3.5 leading-relaxed text-sm ${
                  isUser
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20"
                    : message.isError
                    ? "bg-red-950/40 text-red-200 border border-red-500/30"
                    : "bg-slate-900/90 text-slate-200 border border-white/10"
                }`}
              >
                {/* Active generation loading state before first token */}
                {!isUser && !message.text && isLoading && message.id === streamingMessageId ? (
                  <div className="flex items-center gap-2 py-1 text-cyan-400">
                    <Loader2 size={16} className="animate-spin text-cyan-400" />
                    <span className="text-sm font-medium animate-pulse">
                      {message.sources && message.sources.length > 0
                        ? "Context retrieved. Synthesizing answer..."
                        : "Querying project documents..."}
                    </span>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap">
                    {message.text}
                    {/* Blinking streaming cursor */}
                    {!isUser && isLoading && message.id === streamingMessageId && (
                      <span className="inline-block w-1.5 h-3.5 ml-1 bg-cyan-400 animate-pulse align-middle" />
                    )}
                  </div>
                )}

                {/* Sources / Citations */}
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/10 text-xs text-slate-400">
                    <p className="font-semibold text-cyan-400 mb-1">
                      Retrieved Document Context:
                    </p>
                    <ul className="list-disc list-inside space-y-1 opacity-80">
                      {message.sources.map((src, idx) => (
                        <li key={idx} className="line-clamp-2">
                          {src.substring(0, 160)}...
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-1 text-[10px] text-right opacity-60">
                  {message.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Error alert banner if any */}
      {errorMsg && (
        <div className="mt-3 rounded-xl border border-red-500/30 bg-red-950/40 px-4 py-2.5 text-xs text-red-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={() => setErrorMsg(null)}
            className="text-red-400 hover:text-white font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={onSubmit} className="mt-4 flex items-center gap-3">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          placeholder={
            isLoading
              ? "Generating response... (Click Stop to cancel)"
              : isOnline
              ? "Ask NEXORA anything about procurement, contracts, shipments..."
              : "Ask NEXORA anything... (Backend appears offline)"
          }
          className="
            flex-1
            rounded-xl
            border
            border-white/10
            bg-slate-900
            px-4
            py-3.5
            text-sm
            text-slate-100
            placeholder-slate-500
            outline-none
            transition
            focus:border-cyan-500
            focus:ring-1
            focus:ring-cyan-500
            disabled:opacity-60
          "
        />

        {isLoading ? (
          <button
            type="button"
            onClick={handleStop}
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-red-500/80
              hover:bg-red-500
              px-5
              py-3.5
              font-semibold
              text-sm
              text-white
              shadow-lg
              shadow-red-500/20
              transition
              hover:scale-[1.02]
              active:scale-[0.98]
            "
          >
            <Square size={14} fill="currentColor" />
            <span>Stop</span>
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-gradient-to-r
              from-cyan-500
              to-blue-600
              px-6
              py-3.5
              font-semibold
              text-sm
              text-white
              shadow-lg
              shadow-cyan-500/20
              transition
              hover:scale-[1.02]
              active:scale-[0.98]
              disabled:opacity-50
              disabled:cursor-not-allowed
              disabled:hover:scale-100
            "
          >
            <Send size={16} />
            <span>Send</span>
          </button>
        )}
      </form>
    </div>
  );
}