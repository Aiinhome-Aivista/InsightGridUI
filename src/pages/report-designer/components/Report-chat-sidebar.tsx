import SendRoundedIcon from "@mui/icons-material/SendRounded";

interface ChatSidebarProps {
    onClose: () => void;
}

export default function ReportDesignerChatSidebar({ onClose }: ChatSidebarProps) {
    return (
        <div className="
      fixed right-0 top-0 h-full w-[360px]
      bg-white border-l shadow-lg
      flex flex-col z-50
    ">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
                <h3 className="text-sm font-semibold">Chat Section</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-black">
                    ✕
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-auto p-4 text-sm text-gray-500">
                Hello, how can I help you today?
            </div>

            {/* Input */}
            {/* Input */}
            <div className="border-t p-3 flex items-center gap-2">
                <input
                    placeholder="Ask something…"
                    className="
      flex-1
      border rounded-md px-3 py-2 text-sm
      focus:outline-none focus:ring-2 focus:ring-blue-500/30
    "
                />

                <button
                    className="
      w-9 h-9
      flex items-center justify-center
      bg-blue-600 text-white
      rounded-full
      hover:bg-blue-700
      transition
    "
                    title="Send"
                >
                    <SendRoundedIcon sx={{ fontSize: 18 }} />
                </button>
            </div>

        </div>
    );
}