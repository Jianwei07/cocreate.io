// app/page.tsx
"use client";

import { useState } from "react";
import Editor from "@/components/Editor";
import AIOptimizer from "@/components/AIOptimizer";
import SponsorLinks from "@/components/SponsorLinks";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

type Platform = "threads" | "bluesky" | "x";

export default function Home() {
  const [content, setContent] = useState<string>("");
  const [platform, setPlatform] = useState<Platform>("threads");
  const [optimizedContent, setOptimizedContent] = useState<string>("");

  return (
    <div className="relative min-h-screen">
      {/* Desktop Sponsor Links */}
      <div className="hidden lg:block fixed left-4 top-1/2 -translate-y-1/2 space-y-4">
        <SponsorLinks orientation="vertical" />
      </div>

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-6 lg:px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <Card className="border-0 bg-white/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                CoCreate.io
              </CardTitle>
              <CardDescription className="text-base lg:text-lg">
                Social Media Content Assistant
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Mobile Sponsor Links */}
          <div className="lg:hidden">
            <SponsorLinks orientation="horizontal" />
          </div>

          {/* Main Content */}
          <Card className="border-0 shadow-lg p-4">
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-2xl font-medium">
                Content Editor
              </CardTitle>
            </CardHeader>
            <Editor
              content={content}
              setContent={setContent}
              platform={platform}
              setPlatform={setPlatform}
              optimizedContent={optimizedContent}
              setOptimizedContent={setOptimizedContent}
            />
          </Card>

          <AIOptimizer
            content={content}
            platform={platform}
            onOptimized={(optimized) => setOptimizedContent(optimized)}
          />
        </div>
      </main>
    </div>
  );
}
