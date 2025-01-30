/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { getCachedContent, cacheContent } from "@/lib/cache";

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

  const optimizeContent = async () => {
    if (!content) return;

    setLoading(true);
    setError(null);

    try {
      // Check local cache first
      const cacheKey = `${content}_${platform}`;
      const cached = getCachedContent(cacheKey);

      if (cached) {
        onOptimized(cached);
        setLoading(false); // Stop loading if cached content is used
        return;
      }

      // Proceed with API call to FastAPI backend
      const response = await fetch("http://localhost:8000/format-text/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, text: content }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.formatted_text) {
        onOptimized(data.formatted_text);
        cacheContent(cacheKey, data.formatted_text); // Update cache
      } else {
        setError("No optimized text received.");
      }
    } catch (err) {
      setError("Failed to optimize content. Please try again.");
    } finally {
      setLoading(false);
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

        {loading && (
          <span className="text-sm text-gray-600 self-center">
            Using DeepSeek (free tier)...
          </span>
        )}
      </div>

      {error && (
        <div className="text-red-600 text-sm mt-2 p-2 bg-red-50 rounded-md">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}
