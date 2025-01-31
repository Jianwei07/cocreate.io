// app/page.tsx
"use client";
import { useState, useEffect } from "react";
import Editor from "@/components/Editor";
import AIOptimizer from "@/components/AIOptimizer";
import SponsorLinks from "@/components/SponsorLinks";
import Auth from "@/components/Auth";
import ChatPanel from "@/components/ChatPanel";
import Header from "@/components/Header";
import SaveButton from "@/components/SaveButton";
import { useSavedContent } from "@/hooks/useSavedContent";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js"; // Import the User type

type Platform = "threads" | "bluesky" | "x";

export default function Home() {
  const [content, setContent] = useState<string>("");
  const [platform, setPlatform] = useState<Platform>("threads");
  const [optimizedContent, setOptimizedContent] = useState<string>("");
  const [user, setUser] = useState<User | null>(null); // Explicitly type the user state
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  // Fetch user on page load
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  // Use the custom hook for saved content
  const { savedContent, saveContent } = useSavedContent(user?.id ?? null);

  // Function to populate the editor with selected content
  const handleSelectContent = (selectedContent: string) => {
    setContent(selectedContent); // Update the editor's content
    setIsChatOpen(false); // Close the chat panel after selection
  };

  return (
    <div className="relative min-h-screen">
      {/* Desktop Sponsor Links */}
      <div className="hidden lg:block fixed left-4 top-1/2 -translate-y-1/2 space-y-4 z-50">
        <SponsorLinks orientation="vertical" />
      </div>

      {/* Main Content */}
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-6 lg:px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <Header />

          {/* Mobile Sponsor Links */}
          <div className="lg:hidden">
            <SponsorLinks orientation="horizontal" />
          </div>

          {/* Authentication */}
          <div className="flex justify-end mb-4">
            <Auth />
          </div>

          {/* Main Content */}
          <Editor
            content={content}
            setContent={setContent}
            platform={platform}
            setPlatform={setPlatform}
            optimizedContent={optimizedContent}
            setOptimizedContent={setOptimizedContent}
          />

          <SaveButton onSave={() => saveContent(content)} />

          <AIOptimizer
            content={content}
            platform={platform}
            onOptimized={(optimized) => setOptimizedContent(optimized)}
          />
        </div>
      </main>

      {/* Side Chat Panel */}
      <ChatPanel
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        savedContent={savedContent}
        onSelectContent={handleSelectContent} // Pass the callback to populate the editor
      />

      {/* Open Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg transition-transform duration-300 hover:scale-110 active:scale-95 z-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z"
          />
        </svg>
      </button>
    </div>
  );
}
