export default function ChatPreview() {
  const messages = [
    {
      sender: "user",
      text: "Where is the steel shipment for Tower A?",
    },
    {
      sender: "ai",
      text: "Shipment ST-204 is expected to arrive tomorrow at 10:30 AM.",
    },
    {
      sender: "user",
      text: "Any procurement risks?",
    },
    {
      sender: "ai",
      text: "Yes. Cement inventory is predicted to run low in 3 days. Recommended action: Place an order today.",
    },
  ];

  return (
    <div
      className="
        rounded-3xl
        border
        border-white/10
        bg-white/5
        backdrop-blur-xl
        p-6
      "
    >
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wider text-slate-400">
            AI Copilot
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            NEXORA Assistant
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-green-400" />
          <span className="text-sm text-green-400">
            Online
          </span>
        </div>
      </div>

      {/* Chat */}

      <div className="mt-8 space-y-5">

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-5 py-4 leading-7 ${
                message.sender === "user"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                  : "bg-slate-800 text-slate-200"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}

      </div>

      {/* Input */}

      <div className="mt-8 flex items-center gap-3">

        <input
          disabled
          type="text"
          placeholder="Ask NEXORA anything..."
          className="
            flex-1
            rounded-xl
            border
            border-white/10
            bg-slate-900
            px-4
            py-3
            text-slate-300
            outline-none
          "
        />

        <button
          className="
            rounded-xl
            bg-gradient-to-r
            from-cyan-500
            to-blue-600
            px-6
            py-3
            font-semibold
            text-white
          "
        >
          Send
        </button>

      </div>
    </div>
  );
}