"use client";

import { useEffect, useState, useCallback } from "react";
import AIOptimizer from "./AIOptimizer";
import { splitContent } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  ClipboardCopy,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Platform = "threads" | "bluesky" | "x";

interface EditorProps {
  content: string;
  setContent: (value: string) => void;
  platform: Platform;
  setPlatform: (value: Platform) => void;
  optimizedContent: string;
  setOptimizedContent: (value: string) => void;
}

const platformConfig = {
  threads: { limit: 500 },
  bluesky: { limit: 300 },
  x: { limit: 280 },
};

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
  const [showCopyAlert, setShowCopyAlert] = useState(false);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [expandedPosts, setExpandedPosts] = useState<boolean[]>([]);
  const [expandAll, setExpandAll] = useState(false);

  // Handle responsive layout
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      // Set initial expanded state based on device
      setExpandedPosts(chunks.map(() => !mobile));
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Update expanded posts when chunks change
  useEffect(() => {
    setExpandedPosts(chunks.map(() => !isMobile));
  }, [chunks.length, isMobile]);

  const handleCopy = useCallback(
    (chunk: string, index: number, e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent toggle when clicking copy button
      navigator.clipboard.writeText(chunk);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    },
    []
  );

  const handleCopyAll = useCallback(() => {
    navigator.clipboard.writeText(chunks.join("\n\n"));
    setShowCopyAlert(true);
    setTimeout(() => setShowCopyAlert(false), 2000);
  }, [chunks]);

  const togglePost = useCallback((index: number) => {
    setExpandedPosts((prev) =>
      prev.map((state, i) => (i === index ? !state : state))
    );
  }, []);

  const toggleAllPosts = useCallback(() => {
    const newState = !expandAll;
    setExpandAll(newState);
    setExpandedPosts(chunks.map(() => newState));
  }, [chunks, expandAll]);

  const getCharacterColor = useCallback(
    (count: number) => {
      const limit = platformConfig[platform].limit;
      if (count > limit) return "text-red-500";
      if (count > limit * 0.9) return "text-yellow-500";
      return "text-green-500";
    },
    [platform]
  );

  return (
    <div className="space-y-4 relative">
      {selectedText && <AIOptimizer onOptimized={setOptimizedContent} />}

      {/* Platform Selector & Stats */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:items-center sm:justify-between">
        <Tabs
          value={platform}
          onValueChange={(value) => setPlatform(value as Platform)}
          className="w-full sm:w-[400px]"
        >
          <TabsList className="grid grid-cols-3">
            {Object.entries(platformConfig).map(([key, { limit }]) => (
              <TabsTrigger
                key={key}
                value={key}
                className="gap-1 px-2 sm:px-4 transition-colors"
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
                <Badge variant="secondary" className="ml-1 text-xs sm:text-sm">
                  {limit}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2 justify-end">
          <Badge
            variant="outline"
            className={`text-xs sm:text-sm font-medium ${getCharacterColor(
              characterCount
            )}`}
          >
            {characterCount} / {platformConfig[platform].limit}
          </Badge>
          <Badge variant="outline" className="text-xs sm:text-sm">
            {chunks.length} posts
          </Badge>
        </div>
      </div>

      {/* Text Editor */}
      <Card className="border-2 border-gray-200 dark:border-gray-800 relative group">
        <CardContent className="p-2 sm:p-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write or paste your content here..."
            className="min-h-[150px] sm:min-h-[200px] text-base sm:text-lg leading-relaxed resize-none border-none focus-visible:ring-0 p-0 pr-24"
          />
        </CardContent>
      </Card>

      {/* Copy Alert */}
      <AnimatePresence>
        {showCopyAlert && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md text-sm shadow-lg z-50"
          >
            All content copied! ✅
          </motion.div>
        )}
      </AnimatePresence>

      {/* Post Controls */}
      {chunks.length > 0 && (
        <div className="flex justify-between items-center gap-2">
          <Button
            onClick={toggleAllPosts}
            variant="outline"
            className="text-sm"
          >
            {expandAll ? (
              <>
                <Minimize2 className="h-4 w-4 mr-2" /> Collapse All
              </>
            ) : (
              <>
                <Maximize2 className="h-4 w-4 mr-2" /> Expand All
              </>
            )}
          </Button>
          <Button
            onClick={handleCopyAll}
            className="bg-green-500 text-white hover:bg-green-600 transition-colors"
          >
            <ClipboardCopy className="h-4 w-4 mr-2" />
            Copy All
          </Button>
        </div>
      )}

      {/* Post Previews */}
      <div className="space-y-3">
        {chunks.map((chunk, index) => (
          <Card
            key={index}
            className={`border-2 transition-all hover:border-gray-300 dark:hover:border-gray-700 ${
              expandedPosts[index]
                ? "border-gray-300 dark:border-gray-700"
                : "border-gray-200 dark:border-gray-800"
            }`}
          >
            <CardHeader
              className="flex flex-row items-center justify-between p-3 sm:p-4 cursor-pointer select-none"
              onClick={() => togglePost(index)}
            >
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs sm:text-sm">
                  Post {index + 1}
                </Badge>
                <span className={`text-xs ${getCharacterColor(chunk.length)}`}>
                  {chunk.length} chars
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={copiedIndex === index ? "secondary" : "outline"}
                  size="sm"
                  onClick={(e) => handleCopy(chunk, index, e)}
                  className="h-8 px-2 sm:px-3 transition-colors"
                >
                  <ClipboardCopy className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">
                    {copiedIndex === index ? "Copied! ✅" : "Copy"}
                  </span>
                </Button>
                {expandedPosts[index] ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </CardHeader>
            <AnimatePresence initial={false}>
              {expandedPosts[index] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <CardContent className="p-3 sm:p-4 border-t border-gray-100 dark:border-gray-800">
                    <p className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed">
                      {chunk}
                    </p>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        ))}
      </div>
    </div>
  );
}
