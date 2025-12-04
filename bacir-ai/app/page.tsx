"use client";

import { useEffect, useRef, useState } from "react";

type Role = "assistant" | "user";

type ChatMessage = {
  id: string;
  role: Role;
  content: string;
  timestamp: string;
};

const API_KEY = "AIzaSyD-4Z4f9OnsQX401JYD7voAyT-ggKXbDE4";

const initialMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Hello, I'm BACIR AI. I'm ready to help you synthesize insights, plan your next move, and handle anything in between. Just start typing or ask me with your voice.",
    timestamp: "09:41",
  },
  {
    id: "user-1",
    role: "user",
    content:
      "Give me a quick overview of the three most important tech headlines today.",
    timestamp: "09:42",
  },
  {
    id: "assistant-1",
    role: "assistant",
    content:
      "1. Quantum compute labs are opening new API access tiers.\n2. The global AI safety summit outlined cross-border compliance standards.\n3. Renewable energy storage dropped below $45/kWh, accelerating smart city rollouts.\n\nWant deeper briefs on any of these?",
    timestamp: "09:42",
  },
  {
    id: "user-2",
    role: "user",
    content:
      "Yes, summarize the AI safety summit and highlight what it means for startups.",
    timestamp: "09:43",
  },
  {
    id: "assistant-2",
    role: "assistant",
    content:
      "The summit produced a shared blueprint: continuous risk evaluation, transparent model reporting, and accelerated certifications for startups that align. For founders, it means faster approvals if you can prove responsible guardrails and real-time monitoring.",
    timestamp: "09:44",
  },
];

const assistantReplies = [
  "Here's a structured answer that blends data, context, and next actions tailored to your request. Would you like visual summaries or just the key bullet points?",
  "I'm analyzing signals across knowledge feeds to craft the most relevant response. Let me know if you prefer a concise answer or deeper research.",
  "Understood. I’ll map the objective, outline the critical steps, and surface any blockers the moment they appear.",
];

const quickPrompts = [
  "Plan my next business trip",
  "Summarize this research PDF",
  "Draft a pitch for investors",
  "Generate a voice briefing",
];

function makeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

function formatTimestamp(date = new Date()) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function HologramAvatar() {
  return (
    <div className="relative">
      <div className="hologram-shell">
        <div className="hologram-core" />
      </div>
      <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-cyan-500/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.32em] text-cyan-100/80 backdrop-blur">
        BACIR
      </span>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="typing-indicator">
      <span className="typing-dot" />
      <span className="typing-dot" />
      <span className="typing-dot" />
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  const bubbleClasses = isUser
    ? "ml-auto max-w-[86%] rounded-3xl bg-gradient-to-br from-sky-500 via-cyan-500 to-blue-500 px-5 py-4 text-slate-50 shadow-[0_15px_40px_rgba(14,116,144,0.35)]"
    : "mr-auto max-w-[88%] rounded-3xl bg-slate-900/75 px-5 py-4 text-slate-100 shadow-[0_20px_45px_rgba(2,6,23,0.6)] border border-slate-700/40";

  return (
    <div className={`flex flex-col gap-2 ${isUser ? "items-end" : "items-start"}`}>
      <div className={`${bubbleClasses} whitespace-pre-line text-sm leading-relaxed md:text-base`}>
        {message.content}
      </div>
      <span className="text-[10px] uppercase tracking-[0.32em] text-slate-400">
        {message.timestamp}
      </span>
    </div>
  );
}

export default function Home() {
  const keySignature = `${API_KEY.slice(0, 4)}••••${API_KEY.slice(-4)}`;
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [replyIndex, setReplyIndex] = useState(0);
  const conversationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = conversationRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const outgoing: ChatMessage = {
      id: makeId(),
      role: "user",
      content: trimmed,
      timestamp: formatTimestamp(),
    };

    setMessages((prev) => [...prev, outgoing]);
    setInput("");
    setIsTyping(true);

    const reply = assistantReplies[replyIndex % assistantReplies.length];

    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: makeId(),
        role: "assistant",
        content: reply,
        timestamp: formatTimestamp(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
      setReplyIndex((index) => index + 1);
    }, 1400);
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative flex min-h-screen w-full justify-center overflow-hidden px-3 py-6 md:px-6 md:py-10">
      <div className="pointer-events-none absolute inset-x-10 top-16 h-40 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[20%] top-10 h-60 w-60 rounded-full bg-blue-500/10 blur-3xl md:right-[10%]" />
      <div className="glass-panel relative w-full max-w-4xl border border-slate-700/30">
        <div className="relative flex min-h-[630px] flex-col px-5 pb-5 pt-6 sm:px-7 md:px-10 md:pt-10 lg:min-h-[760px]">
          <header className="flex items-center gap-4 md:gap-6">
            <HologramAvatar />
            <div className="flex flex-1 flex-col">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-100 md:text-3xl">
                BACIR AI
              </h1>
              <p className="text-sm text-slate-300 md:text-base">
                Your Smart Universal Assistant
              </p>
            </div>
            <div className="hidden flex-col items-end gap-1 text-right text-[10px] font-medium uppercase tracking-[0.32em] text-slate-500 md:flex">
              <span>Neural Sync</span>
              <span className="text-cyan-300">Online</span>
              <span className="text-[9px] tracking-[0.22em] text-slate-500">
                {keySignature}
              </span>
            </div>
          </header>

          <div className="neon-divider mt-6 mb-5" />

          <section className="relative flex min-h-0 flex-1 flex-col">
            <div
              ref={conversationRef}
              className="no-scrollbar flex-1 space-y-6 overflow-y-auto pr-1"
            >
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isTyping && (
                <div className="flex items-center gap-3">
                  <TypingIndicator />
                  <span className="text-[11px] uppercase tracking-[0.32em] text-cyan-200/60">
                    BACIR IS COMPOSING
                  </span>
                </div>
              )}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handlePromptClick(prompt)}
                  className="rounded-full border border-cyan-500/30 bg-slate-900/60 px-4 py-2 text-xs font-medium text-cyan-100/90 transition hover:border-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </section>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleSend();
            }}
            className="mt-6 rounded-3xl border border-slate-600/30 bg-slate-900/80 p-2 shadow-[0_25px_60px_rgba(2,6,23,0.65)]"
          >
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Write your message…"
                  rows={1}
                  className="h-12 w-full resize-none rounded-2xl border-0 bg-transparent px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus-visible:ring-0 md:text-base"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-cyan-500/30 bg-slate-900/80 text-cyan-100 transition hover:border-cyan-300 hover:bg-cyan-500/20"
                  aria-label="Voice input"
                >
                  <svg
                    className="h-5 w-5 transition-transform group-hover:scale-105"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 3a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z" />
                    <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
                    <path d="M12 19v3" />
                  </svg>
                </button>
                <button
                  type="submit"
                  className="group flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 via-cyan-500 to-blue-600 text-slate-50 shadow-[0_20px_40px_rgba(14,165,233,0.45)] transition hover:from-sky-400 hover:via-cyan-400 hover:to-blue-500"
                  aria-label="Send message"
                >
                  <svg
                    className="h-5 w-5 -translate-x-[1px] group-hover:translate-x-0 transition-transform"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12L4 4l16 8-16 8 1-8h11" />
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
