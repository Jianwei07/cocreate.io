import React, { useState, useEffect } from "react";
import { X, Minimize2, Maximize2, Trash2, Copy } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Define a strict type for the content items
interface SavedContentItem {
  id: string;
  content: string;
  timestamp: string;
}

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  savedContent: string[]; // Keep original type to maintain compatibility
  onDeleteItem?: (id: string) => void;
  onSelectContent?: (content: string) => void; // New prop to populate the editor
}

const ChatPanel = ({
  isOpen,
  onClose,
  savedContent,
  onDeleteItem,
  onSelectContent,
}: ChatPanelProps) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [showCopyAlert, setShowCopyAlert] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Convert string array to proper format and filter out invalid items
  const formattedContent: SavedContentItem[] = savedContent
    .filter(
      (content): content is string =>
        typeof content === "string" && content !== null && content !== undefined
    )
    .map((content, index) => ({
      id: `item-${index}`,
      content,
      timestamp: new Date().toLocaleString(),
    }));

  const filteredContent = formattedContent.filter((item) =>
    item.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setShowCopyAlert(true);
      setTimeout(() => setShowCopyAlert(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed right-0 top-0 h-full bg-white shadow-lg transition-all duration-300 ease-in-out 
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          ${isMinimized ? "w-20" : "w-96"}
          border-l border-gray-200`}
      >
        <div className="p-4 flex justify-between items-center border-b bg-gray-50">
          {!isMinimized && (
            <h3 className="text-lg font-semibold text-gray-800">
              Saved Content
            </h3>
          )}
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              title={isMinimized ? "Expand" : "Minimize"}
            >
              {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>
        {!isMinimized && (
          <>
            <div className="p-4 border-b">
              <input
                type="text"
                placeholder="Search saved content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="overflow-y-auto h-[calc(100vh-160px)]">
              {filteredContent.length > 0 ? (
                filteredContent.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 border-b hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <p className="text-sm text-gray-600">{item.timestamp}</p>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleCopy(item.content)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="Copy"
                        >
                          <Copy size={14} />
                        </button>
                        {onDeleteItem && (
                          <button
                            onClick={() => onDeleteItem(item.id)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                    <p
                      className="mt-2 text-gray-800 cursor-pointer"
                      onClick={() => onSelectContent?.(item.content)} // Trigger callback to populate editor
                    >
                      {item.content}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  {searchTerm
                    ? "No matching content found."
                    : "No saved content yet."}
                </div>
              )}
            </div>
          </>
        )}
        {isMinimized && (
          <div className="p-4 text-center">
            <p className="text-sm text-gray-500 rotate-90 whitespace-nowrap">
              Saved Content ({savedContent.length})
            </p>
          </div>
        )}
        {showCopyAlert && (
          <Alert className="fixed bottom-4 right-4 w-auto">
            <AlertDescription>Content copied to clipboard!</AlertDescription>
          </Alert>
        )}
      </div>
    </>
  );
};

export default ChatPanel;
