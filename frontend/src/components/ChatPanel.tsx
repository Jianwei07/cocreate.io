import React, { useState, useEffect } from "react";
import {
  X,
  Minimize2,
  Maximize2,
  Trash2,
  Copy,
  Coffee,
  Heart,
  Github,
  Linkedin,
} from "lucide-react";

const SPONSOR_LINKS = [
  {
    name: "Buy Me a Coffee",
    icon: <Coffee className="h-4 w-4" strokeWidth={2.5} />,
    url: "https://buymeacoffee.com/jaydenliawjianwei",
    bgColor: "bg-[#ffdd00]",
    hoverBgColor: "hover:bg-[#e5c700]",
    textColor: "text-black",
  },
  {
    name: "Sponsor",
    icon: <Heart className="h-4 w-4" strokeWidth={2.5} />,
    url: "https://github.com/sponsors/Jianwei07",
    bgColor: "bg-pink-500",
    hoverBgColor: "hover:bg-pink-600",
    textColor: "text-white",
  },
  {
    name: "GitHub",
    icon: <Github className="h-4 w-4" strokeWidth={2} />,
    url: "https://github.com/Jianwei07",
    bgColor: "bg-gray-900",
    hoverBgColor: "hover:bg-gray-800",
    textColor: "text-white",
  },
  {
    name: "LinkedIn",
    icon: <Linkedin className="h-4 w-4" strokeWidth={2} />,
    url: "https://www.linkedin.com/in/liawjianwei/",
    bgColor: "bg-[#0A66C2]",
    hoverBgColor: "hover:bg-[#004182]",
    textColor: "text-white",
  },
] as const;

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  savedContent: string[];
  onSelectContent?: (content: string) => void;
  onDeleteContent?: (content: string) => void;
}

const ChatPanel = ({
  isOpen,
  onClose,
  savedContent,
  onSelectContent,
  onDeleteContent,
}: ChatPanelProps) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [showCopyAlert, setShowCopyAlert] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const formattedContent = savedContent.map((content, index) => ({
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

  const SponsorSection = () => (
    <div className="border-t border-gray-200 bg-gray-50 p-4">
      <div className="flex flex-wrap gap-2 justify-center">
        {SPONSOR_LINKS.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              ${link.bgColor} 
              ${link.hoverBgColor}
              ${link.textColor}
              flex items-center gap-2
              px-3 py-1.5
              rounded-full
              transition-all
              hover:scale-105
              text-xs
              font-medium
              shadow-sm
            `}
          >
            {link.icon}
            <span>{link.name}</span>
          </a>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed right-0 top-0 h-full bg-white shadow-lg transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } ${
          isMinimized ? "w-20" : "w-96"
        } border-l border-gray-200 flex flex-col`}
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

        <div className="flex-1 flex flex-col">
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
              <div className="flex-1 overflow-y-auto">
                {filteredContent.length > 0 ? (
                  filteredContent.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 border-b hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-sm text-gray-600">
                          {item.timestamp}
                        </p>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleCopy(item.content)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                            title="Copy"
                          >
                            <Copy size={14} />
                          </button>
                          <button
                            onClick={() => onDeleteContent?.(item.content)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <p
                        className="mt-2 text-gray-800 cursor-pointer"
                        onClick={() => onSelectContent?.(item.content)}
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
          {isMinimized ? (
            <div className="p-4 text-center flex-1">
              <p className="text-sm text-gray-500 rotate-90 whitespace-nowrap">
                Saved Content ({savedContent.length})
              </p>
            </div>
          ) : (
            <SponsorSection />
          )}
        </div>

        {showCopyAlert && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
            Content copied to clipboard!
          </div>
        )}
      </div>
    </>
  );
};

export default ChatPanel;
