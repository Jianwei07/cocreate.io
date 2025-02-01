// app/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, X, MessageCircle } from "lucide-react";
import Editor from "@/components/Editor";
import Auth from "@/components/Auth";
import ChatPanel from "@/components/ChatPanel";
import Header from "@/components/Header";
import SaveButton from "@/components/SaveButton";
import { useSavedContent } from "@/hooks/useSavedContent";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
// import SponsorLinks from "@/components/SponsorLinks";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Header />
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Auth />
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
            {/* Mobile Navigation Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex flex-col space-y-4">
              <Auth />{" "}
              {/* The MobileAuthButtons will automatically show here */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 w-full justify-start"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-20 px-4 pb-6">
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
            <div className="flex justify-end space-x-4">
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
      {/* Sponsor Links Container at the Bottom
      <div className="fixed bottom-4 left-1/3 -translate-x-1/2 flex flex-col items-center gap-2">
        <SponsorLinks orientation="horizontal" />
      </div> */}
    </div>
  );
}
