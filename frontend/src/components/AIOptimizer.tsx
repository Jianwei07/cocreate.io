"use client";

import { useState } from "react";
import { cacheContent } from "@/lib/cache";

interface AIOptimizerProps {
  content: string;
  platform: string;
  onOptimized: (optimized: string) => void;
}

export default function AIOptimizer({
  content,
  platform,
  onOptimized,
}: AIOptimizerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previousContent, setPreviousContent] = useState<string | null>(null);
  const [optimizedContent, setOptimizedContent] = useState<string | null>(null);

  // API URL for development and production
  const API_URL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:8000/format-text/"
      : "https://cocreate-io.vercel.app/format-text/";

  const optimizeContent = async () => {
    if (!content) return;

    setLoading(true);
    setError(null);

    try {
      console.log("Sending request to API:", API_URL);
      console.log("Request Body:", { platform, text: content });

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, text: content }),
      });

      console.log("Response Status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response Data:", data);

      if (data.formatted_text) {
        setPreviousContent(content);
        setOptimizedContent(data.formatted_text);
        onOptimized(data.formatted_text);
        cacheContent(`${content}_${platform}`, data.formatted_text);
      } else {
        setError("No optimized text received.");
      }
    } catch (err) {
      console.error("Error during optimization:", err);
      setError("Failed to optimize content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUndo = () => {
    if (previousContent) {
      setOptimizedContent(null);
      onOptimized(previousContent);
      setPreviousContent(null);
    }
  };

  return (
    <div className="mt-4 flex flex-col gap-2">
      <div className="flex gap-2">
        <button
          onClick={optimizeContent}
          disabled={loading || !content}
          className="px-4 py-2 bg-green-100 text-green-600 rounded-md hover:bg-green-200 disabled:opacity-50 transition-colors"
        >
          {loading ? "Optimizing..." : "AI Optimize"}
        </button>

        {previousContent && (
          <button
            onClick={handleUndo}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Undo
          </button>
        )}
      </div>

      {error && (
        <div className="text-red-600 text-sm mt-2 p-2 bg-red-50 rounded-md">
          ⚠️ {error}
        </div>
      )}

      {optimizedContent && (
        <div className="mt-4 p-2 border rounded-md bg-gray-100 dark:bg-gray-800">
          <p className="text-gray-500 line-through">{previousContent}</p>
          <p className="text-black dark:text-white">{optimizedContent}</p>
        </div>
      )}
    </div>
  );
}
