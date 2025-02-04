// app/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import Editor from "@/components/Editor";
import ChatPanel from "@/components/ChatPanel";
import Header from "@/components/Header";
import SaveButton from "@/components/SaveButton";
import { useSavedContent } from "@/hooks/useSavedContent";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import AIOptimizer from "@/components/AIOptimizer";
// import AIOptimizer from "@/components/AIOptimizer";

type Platform = "threads" | "bluesky" | "x";
const platforms = [
  { id: "threads", name: "Threads" },
  { id: "bluesky", name: "Bluesky" },
  { id: "x", name: "X/Twitter" },
] as const;

export default function Home() {
  const [content, setContent] = useState<string>("");
  const [platform, setPlatform] = useState<Platform>("threads");
  const [optimizedContent, setOptimizedContent] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const { savedContent, saveContent, deleteContent } = useSavedContent(
    user?.id ?? null
  );

  const handleSelectContent = (selectedContent: string) => {
    setContent(selectedContent);
    setIsChatOpen(false);
  };

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Navigation Bar */}
      <Header />

      {/* Main Content */}
      <main className="pt-16 px-4 pb-6 md:px-8 lg:px-12">
        {" "}
        {/* Reduced padding-top from pt-20 to pt-16 */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Platform Selection */}
          <div className="flex justify-center space-x-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            {platforms.map(({ id, name }) => (
              <button
                key={id}
                onClick={() => setPlatform(id)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  platform === id
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {name}
              </button>
            ))}
          </div>

          {/* Editor and AI Optimizer */}
          <div className="grid gap-6">
            <Editor
              content={content}
              setContent={setContent}
              platform={platform}
              setPlatform={setPlatform}
              optimizedContent={optimizedContent}
              setOptimizedContent={setOptimizedContent}
            />
            <div className="flex justify-between items-center">
              <AIOptimizer
                content={content}
                platform={platform}
                onOptimized={setOptimizedContent}
              />
              <SaveButton onSave={() => saveContent(content)} />
            </div>
          </div>
        </div>
      </main>

      {/* Chat Panel */}
      <ChatPanel
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        savedContent={savedContent}
        onSelectContent={handleSelectContent}
        onDeleteContent={deleteContent} // Pass deleteContent here
      />

      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsChatOpen((prev) => !prev)}
        className={`fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 ${
          savedContent.length > 0 && !isChatOpen ? "animate-bounce" : ""
        }`}
      >
        <MessageCircle size={24} />
        {savedContent.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {savedContent.length}
          </span>
        )}
      </button>
    </div>
  );
}
