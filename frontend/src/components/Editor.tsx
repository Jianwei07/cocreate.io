/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Dispatch, SetStateAction, useState } from "react";
import { splitContent, PLATFORM_LIMITS } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardCopy, MessageSquare } from "lucide-react";

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
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const platformConfig = {
    threads: { limit: 500, icon: MessageSquare },
    bluesky: { limit: 300, icon: MessageSquare },
    x: { limit: 280, icon: MessageSquare },
  };

  return (
    <div className="space-y-6">
      {/* Platform Selector and Stats */}
      <div className="flex items-center justify-between">
        <Tabs
          value={platform}
          onValueChange={(value) => setPlatform(value as Platform)}
          className="w-[400px]"
        >
          <TabsList className="grid grid-cols-3">
            {Object.entries(platformConfig).map(([key, { limit }]) => (
              <TabsTrigger key={key} value={key} className="gap-2">
                {key.charAt(0).toUpperCase() + key.slice(1)}
                <Badge variant="secondary" className="ml-1">
                  {limit}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {characterCount} characters
          </Badge>
          <Badge variant="outline" className="text-sm">
            {chunks.length} posts
          </Badge>
        </div>
      </div>

      {/* Text Editor */}
      <Card className="border-2 border-gray-200 dark:border-gray-800 p-4">
        <CardContent className="pt-4">
          <Textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setOptimizedContent("");
            }}
            placeholder="Write or paste your content here..."
            className="min-h-[200px] text-lg leading-relaxed resize-none border-none focus-visible:ring-0 p-0"
          />
        </CardContent>
      </Card>

      {/* Post Previews */}
      <div className="space-y-4">
        {chunks.map((chunk, index) => (
          <Card
            key={index}
            className="border-2 border-gray-200 dark:border-gray-800 transition-all hover:shadow-md"
          >
            <CardHeader className="flex flex-row items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Post {index + 1}</Badge>
                <span className="text-sm text-muted-foreground">
                  {chunk.length}/{PLATFORM_LIMITS[platform]} chars
                </span>
              </div>
              <Button
                variant={copiedIndex === index ? "secondary" : "outline"}
                size="sm"
                onClick={() => handleCopy(chunk, index)}
                className="gap-2"
              >
                <ClipboardCopy className="h-4 w-4" />
                {copiedIndex === index ? "Copied!" : "Copy"}
              </Button>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {chunk}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
