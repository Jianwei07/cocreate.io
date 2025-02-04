/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Wand2,
  CheckCircle2,
  Type,
  MessageSquareText,
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  Sparkles,
  X,
  Undo2,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const AI_ACTIONS = [
  {
    label: "Polish Writing",
    icon: <Wand2 className="h-4 w-4" />,
    description: "Enhance clarity and flow",
    prompt: "Improve this writing while maintaining its core meaning",
  },
  {
    label: "Fix Grammar",
    icon: <CheckCircle2 className="h-4 w-4" />,
    description: "Correct errors",
    prompt: "Fix any grammar and spelling errors in this text",
  },
  {
    label: "Simplify",
    icon: <MessageSquareText className="h-4 w-4" />,
    description: "Make it clearer",
    prompt: "Simplify this text to make it easier to understand",
  },
  {
    label: "Condense",
    icon: <ArrowDownNarrowWide className="h-4 w-4" />,
    description: "Make it shorter",
    prompt: "Summarize this text more concisely",
  },
  {
    label: "Expand",
    icon: <ArrowUpNarrowWide className="h-4 w-4" />,
    description: "Add detail",
    prompt: "Expand this text with more detail and explanation",
  },
];

const TONE_OPTIONS = [
  { label: "Professional", icon: <Type className="h-4 w-4" /> },
  { label: "Casual", icon: <Sparkles className="h-4 w-4" /> },
  { label: "Friendly", icon: <MessageSquareText className="h-4 w-4" /> },
  { label: "Confident", icon: <CheckCircle2 className="h-4 w-4" /> },
  { label: "Persuasive", icon: <Wand2 className="h-4 w-4" /> },
];

interface AIOptimizerProps {
  onOptimized: (optimized: string) => void;
}

export default function AIOptimizer({ onOptimized }: AIOptimizerProps) {
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [optimizedText, setOptimizedText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [textHistory, setTextHistory] = useState<string[]>([]);
  const [currentAction, setCurrentAction] = useState<string>("");
  const cardRef = useRef<HTMLDivElement>(null);

  const API_URL =
    process.env.NEXT_PUBLIC_AI_OPTIMIZE_URL ||
    "http://localhost:8000/ai/optimize";

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim().length > 0) {
        setSelectedText(selection.toString());
        setTextHistory([]);
        setCurrentAction("");
      }
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        resetState();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        resetState();
      }
    };

    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("touchend", handleSelection);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("touchend", handleSelection);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const resetState = () => {
    setSelectedText(null);
    setOptimizedText("");
    setTextHistory([]);
    setError(null);
    setLoading(false);
    setCurrentAction("");
  };

  const optimizeContent = async (prompt: string, actionLabel: string) => {
    if (!selectedText) return;

    setLoading(true);
    setError(null);
    setCurrentAction(actionLabel);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: selectedText, prompt }),
      });

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      if (data.formatted_text) {
        if (optimizedText) {
          setTextHistory((prev) => [...prev, optimizedText]);
        }
        setOptimizedText(data.formatted_text);
      }
    } catch (err) {
      setError("Failed to optimize text. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUndo = () => {
    if (textHistory.length > 0) {
      const previousText = textHistory[textHistory.length - 1];
      setOptimizedText(previousText);
      setTextHistory((prev) => prev.slice(0, -1));
    } else if (optimizedText) {
      setOptimizedText("");
    }
  };

  if (!selectedText) return null;

  return (
    <Card
      ref={cardRef}
      className={cn(
        "fixed z-50 w-64 shadow-lg",
        isMobile ? "bottom-4 left-4" : "top-16 left-4"
      )}
    >
      <CardHeader className="space-y-1 p-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            AI Text Optimizer
          </CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                handleUndo();
              }}
              disabled={!optimizedText && textHistory.length === 0}
            >
              <Undo2 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                resetState();
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
        {!loading && (
          <CardDescription className="text-xs">
            {currentAction || "Choose an action to enhance your text"}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="p-3 pt-0">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-4 space-y-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <p className="text-sm text-muted-foreground">
              Optimizing for {currentAction}...
            </p>
          </div>
        ) : !optimizedText ? (
          <div className="space-y-2">
            {AI_ACTIONS.map((action) => (
              <Button
                key={action.label}
                variant="ghost"
                className="w-full justify-start h-8 text-sm"
                onClick={() => optimizeContent(action.prompt, action.label)}
                disabled={loading}
              >
                {action.icon}
                <span className="ml-2">{action.label}</span>
              </Button>
            ))}

            <Separator className="my-2" />

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between h-8"
                >
                  <span className="flex items-center">
                    <Type className="h-4 w-4 mr-2" />
                    Change Tone
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-0" align="start">
                <div className="space-y-1 p-2">
                  {TONE_OPTIONS.map((tone) => (
                    <Button
                      key={tone.label}
                      variant="ghost"
                      className="w-full justify-start h-8 text-sm"
                      onClick={() =>
                        optimizeContent(
                          `Rewrite this in a ${tone.label.toLowerCase()} tone`,
                          `${tone.label} Tone`
                        )
                      }
                      disabled={loading}
                    >
                      {tone.icon}
                      <span className="ml-2">{tone.label}</span>
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-xs text-muted-foreground line-through">
              {selectedText}
            </div>
            <div className="text-xs">{optimizedText}</div>
          </div>
        )}

        {error && <div className="mt-2 text-xs text-destructive">{error}</div>}
      </CardContent>

      {optimizedText && (
        <CardFooter className="p-3 pt-0">
          <div className="flex justify-end gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => setOptimizedText("")}
            >
              Try Again
            </Button>
            <Button
              variant="default"
              size="sm"
              className="h-7 text-xs"
              onClick={() => {
                onOptimized(optimizedText);
                resetState();
              }}
            >
              Apply
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
