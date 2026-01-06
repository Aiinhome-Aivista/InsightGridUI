import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { useEffect, useState } from "react";
import { ChartConfig } from "./ReportDesignerTable";

interface ChatSidebarProps {
    onClose: () => void;
    userName: string;
    onSend: (message: string) => Promise<string | null>;
    charts: ChartConfig[];
}

export default function ReportDesignerChatSidebar({
    onClose,
    userName,
    onSend,
    charts
}: ChatSidebarProps) {
    const [messages, setMessages] = useState<
        { role: "ai" | "user"; text: string }[]
    >([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const hasCharts = charts && charts.length > 0;

    useEffect(() => {
        if (!hasCharts) {
            setMessages([
                {
                    role: "ai",
                    text: `Hi ${userName} \nPlease create at least one chart before using the assistant.`,
                },
            ]);
        } else {
            setMessages([
                {
                    role: "ai",
                    text: `Hi ${userName} \nHow can I help you with your chart?`,
                },
            ]);
        }
    }, [userName, hasCharts]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userText = input;

        // 🧍 user message
        setMessages(prev => [...prev, { role: "user", text: userText }]);
        setInput("");
        setIsTyping(true);

        // 🔥 WAIT FOR AI MESSAGE
        const aiText = await onSend(userText);

        setIsTyping(false);

        if (aiText) {
            setMessages(prev => [...prev, { role: "ai", text: aiText }]);
        }
    };

    return (
        <div className="fixed right-0 top-0 h-full w-[360px] bg-white border-l shadow-lg flex flex-col z-50">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
                <h3 className="text-sm font-semibold">Chart Assistant</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-black">
                    ✕
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-auto p-4 space-y-3 bg-gray-50">
                {messages.map((m, i) => (
                    <div
                        key={i}
                        className={`flex ${m.role === "user" ? "justify-end" : "justify-start"
                            }`}
                    >
                        <div
                            className={`max-w-[75%] px-3 py-2 rounded-lg text-sm whitespace-pre-line
                ${m.role === "user"
                                    ? "bg-blue-600 text-white rounded-br-none"
                                    : "bg-white text-gray-700 border rounded-bl-none"
                                }
              `}
                        >
                            {m.text}
                        </div>
                    </div>
                ))}

                {/* 🔵 AI Typing Indicator (Tailwind only) */}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white border rounded-lg px-3 py-2 flex items-center gap-1">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="border-t p-3 flex items-center gap-2 bg-white">
                <input
                    value={input}
                    disabled={!hasCharts}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message…"
                    className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />

                <button
                    onClick={handleSend}
                    className="w-9 h-9 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                >
                    <SendRoundedIcon sx={{ fontSize: 18 }} />
                </button>
            </div>
        </div>
    );
}
