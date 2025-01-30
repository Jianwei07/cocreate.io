"use client";
import { useState } from "react";
import Editor from "@/components/Editor";
import AIOptimizer from "@/components/AIOptimizer";

// Define the Platform type
type Platform = "threads" | "bluesky" | "x";

export default function Home() {
  // Define state variables
  const [content, setContent] = useState<string>("");
  const [platform, setPlatform] = useState<Platform>("threads");
  const [optimizedContent, setOptimizedContent] = useState<string>("");

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          CoCreate.io - Social Media Content Assistant
        </h1>

        {/* Pass all required props to Editor */}
        <Editor
          content={content}
          setContent={setContent}
          platform={platform}
          setPlatform={setPlatform}
          optimizedContent={optimizedContent}
          setOptimizedContent={setOptimizedContent}
        />

        {/* AI Optimizer Component */}
        <AIOptimizer
          content={content}
          platform={platform}
          onOptimized={(optimized) => setOptimizedContent(optimized)}
        />
      </div>
    </main>
  );
}
