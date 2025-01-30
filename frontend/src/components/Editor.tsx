/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { splitContent, PLATFORM_LIMITS } from "@/lib/utils";

// Define a type for the platform selection
type Platform = "threads" | "bluesky" | "x";

interface EditorProps {
  content: string;
  setContent: Dispatch<SetStateAction<string>>;
  platform: Platform;
  setPlatform: Dispatch<SetStateAction<Platform>>;
  optimizedContent: string;
  setOptimizedContent: Dispatch<SetStateAction<string>>;
}

export default function Editor({
  content,
  setContent,
  platform,
  setPlatform,
  optimizedContent,
  setOptimizedContent,
}: EditorProps) {
  const chunks = splitContent(optimizedContent || content, platform);
  const characterCount = (optimizedContent || content).length;
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (chunk: string, index: number) => {
    navigator.clipboard.writeText(chunk);
    setCopiedIndex(index);

    // Reset "Copied!" message after 2 seconds
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Platform Selector */}
      <div className="flex gap-4 items-center">
        <label className="font-medium">Platform:</label>
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value as Platform)}
          className="p-2 border rounded-md"
        >
          <option value="threads">Threads (500 chars)</option>
          <option value="bluesky">Bluesky (300 chars)</option>
          <option value="x">X/Twitter (280 chars)</option>
        </select>

        <div className="ml-auto text-sm text-gray-600">
          {characterCount} characters • {chunks.length} posts needed
        </div>
      </div>

      {/* Text Editor */}
      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setOptimizedContent(""); // Reset AI changes when user types
        }}
        placeholder="Paste your content here..."
        className="w-full h-64 p-4 border rounded-md resize-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Post Previews */}
      <div className="space-y-4">
        {chunks.map((chunk, index) => (
          <div key={index} className="p-4 border rounded-md bg-gray-50">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium">Post #{index + 1}</span>
              <span className="text-sm text-gray-600">
                {chunk.length}/{PLATFORM_LIMITS[platform]} chars
              </span>
            </div>
            <p className="whitespace-pre-wrap">{chunk}</p>
            <button
              onClick={() => handleCopy(chunk, index)}
              className={`mt-2 px-3 py-1 text-sm rounded-md transition-colors ${
                copiedIndex === index
                  ? "bg-green-500 text-white" // Change color when copied
                  : "bg-blue-100 text-blue-600 hover:bg-blue-200"
              }`}
            >
              {copiedIndex === index ? "Copied!" : "Copy Post"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
