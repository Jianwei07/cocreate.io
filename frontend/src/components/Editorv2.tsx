"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { splitContent, PLATFORM_LIMITS } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  ClipboardCopy,
  ChevronDown,
  ChevronUp,
  Scissors,
  SplitSquareHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const [showBreakpointTip, setShowBreakpointTip] = useState(false);

  const platformConfig = {
    threads: { limit: 500 },
    bluesky: { limit: 300 },
    x: { limit: 280 },
  };

  const insertBreakpoint = () => {
    const textarea = document.querySelector("textarea");
    if (!textarea) return;

    const { selectionStart, selectionEnd, value } =
      textarea as HTMLTextAreaElement;

    // Insert breakpoint with visual separator
    const breakpointText = "//\n";
    const newValue =
      value.slice(0, selectionStart) +
      breakpointText +
      value.slice(selectionEnd);

    setContent(newValue);

    // Show visual feedback
    setShowBreakpointTip(true);
    setTimeout(() => {
      setShowBreakpointTip(false);
    }, 2000);

    // Update cursor position
    setTimeout(() => {
      const newCursorPosition = selectionStart + breakpointText.length;
      (textarea as HTMLTextAreaElement).setSelectionRange(
        newCursorPosition,
        newCursorPosition
      );
      textarea.focus();
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && e.key === "b") {
      e.preventDefault();
      insertBreakpoint();
    }
  };

  const handleCopy = (chunk: string, index: number) => {
    navigator.clipboard.writeText(chunk);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = () => {
    const allContent = chunks.join("\n\n");
    navigator.clipboard.writeText(allContent).then(() => {
      setShowBreakpointTip(true);
      setTimeout(() => setShowBreakpointTip(false), 2000);
    });
  };

  const togglePost = (index: number) => {
    setExpandedPost(expandedPost === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {/* Platform Selector and Stats */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:items-center sm:justify-between">
        <Tabs
          value={platform}
          onValueChange={(value) => setPlatform(value as Platform)}
          className="w-full sm:w-[400px]"
        >
          <TabsList className="grid grid-cols-3">
            {Object.entries(platformConfig).map(([key, { limit }]) => (
              <TabsTrigger key={key} value={key} className="gap-1 px-2 sm:px-4">
                <span className="hidden sm:inline">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </span>
                <span className="sm:hidden">{key.charAt(0).toUpperCase()}</span>
                <Badge variant="secondary" className="ml-1 text-xs sm:text-sm">
                  {limit}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2 justify-end">
          <Badge variant="outline" className="text-xs sm:text-sm">
            {characterCount} chars
          </Badge>
          <Badge variant="outline" className="text-xs sm:text-sm">
            {chunks.length} posts
          </Badge>
        </div>
      </div>

      {/* Enhanced Text Editor */}
      <Card className="border-2 border-gray-200 dark:border-gray-800 relative">
        <CardContent className="p-2 sm:p-4">
          <div className="relative">
            <Textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setOptimizedContent("");
              }}
              onKeyDown={handleKeyDown}
              placeholder="Write or paste your content here... Press Ctrl+B, type // or use the Split button to separate posts"
              className="min-h-[150px] sm:min-h-[200px] text-base sm:text-lg leading-relaxed resize-none border-none focus-visible:ring-0 p-0 pr-24 overflow-y-auto max-h-[calc(75vh)]"
            />

            {/* Desktop Controls */}
            <div className="hidden sm:flex absolute top-2 right-2 gap-2">
              <Button
                onClick={insertBreakpoint}
                size="sm"
                variant="outline"
                className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <SplitSquareHorizontal className="h-4 w-4 mr-2" />
                Split Post
              </Button>
              <Badge variant="secondary" className="h-8 px-2 flex items-center">
                Ctrl+B
              </Badge>
            </div>

            {/* Mobile Controls */}
            <div className="sm:hidden fixed bottom-6 right-6 flex flex-col gap-3 z-50">
              <Button
                onClick={insertBreakpoint}
                size="icon"
                className="h-12 w-12 rounded-full shadow-lg bg-blue-500 hover:bg-blue-600 text-white"
                title="Split Post"
              >
                <Scissors className="h-5 w-5" />
              </Button>
            </div>

            {/* Breakpoint Feedback Animation */}
            <AnimatePresence>
              {showBreakpointTip && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-12 right-2 bg-green-500 text-white px-3 py-1.5 rounded-md text-sm shadow-lg"
                >
                  Post split added!
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Post Previews */}
      <div className="space-y-3">
        {chunks.map((chunk, index) => (
          <Card
            key={index}
            className="border-2 border-gray-200 dark:border-gray-800 transition-all"
          >
            <CardHeader
              className="flex flex-row items-center justify-between p-3 sm:p-4 cursor-pointer"
              onClick={() => togglePost(index)}
            >
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs sm:text-sm">
                  Post {index + 1}
                </Badge>
                <span className="text-xs sm:text-sm text-muted-foreground">
                  {chunk.length}/{PLATFORM_LIMITS[platform]}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={copiedIndex === index ? "secondary" : "outline"}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(chunk, index);
                  }}
                  className="h-8 px-2 sm:px-3"
                >
                  <ClipboardCopy className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">
                    {copiedIndex === index ? "Copied!" : "Copy"}
                  </span>
                </Button>
                {expandedPost === index ? (
                  <ChevronUp className="h-4 w-4 sm:hidden" />
                ) : (
                  <ChevronDown className="h-4 w-4 sm:hidden" />
                )}
              </div>
            </CardHeader>
            <CardContent
              className={`p-3 sm:p-4 pt-0 ${
                expandedPost === index || window.innerWidth >= 640
                  ? "block"
                  : "hidden"
              }`}
            >
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {chunk}
              </p>
            </CardContent>
          </Card>
        ))}

        {/* Copy All Button */}
        {chunks.length > 0 && (
          <div className="flex justify-end">
            <Button
              onClick={handleCopyAll}
              className="w-full sm:w-auto bg-green-500 text-white hover:bg-green-600 transition-colors"
            >
              <ClipboardCopy className="h-4 w-4 mr-2" />
              Copy All Content
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
