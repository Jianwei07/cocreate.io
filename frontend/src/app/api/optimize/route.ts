/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Cache for 1 hour (Vercel Edge Cache)
export const revalidate = 3600;

// Limit messages per user
const MESSAGE_LIMIT = 10;

export async function POST(request: Request) {
  try {
    // Parse request body
    const { content, platform, userId } = await request.json();

    if (!content || !platform) {
      return NextResponse.json(
        { error: "Missing required fields: content or platform" },
        { status: 400 }
      );
    }

    // 1. Generate Hash for Caching
    const contentHash = await hashContent(content + platform);

    // Check cache
    const { data: cached, error: cacheError } = await supabase
      .from("cache")
      .select("result")
      .eq("hash", contentHash)
      .single();

    if (cacheError && cacheError.message !== "No rows found") {
      console.error("Cache lookup failed:", cacheError);
    }

    if (cached) {
      return NextResponse.json({ optimized: cached.result });
    }

    // 2. Call AI API if no cache
    const response = await fetch(
      "https://api-inference.huggingface.co/models/deepseek-ai/deepseek-chat",
      {
        headers: { Authorization: `Bearer ${process.env.HF_TOKEN}` },
        method: "POST",
        body: JSON.stringify({
          inputs: `Optimize for ${platform}: ${content}`,
          parameters: { max_new_tokens: 500 },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("AI API error:", errorData);
      return NextResponse.json(
        { error: "Failed to optimize content", details: errorData },
        { status: 500 }
      );
    }

    const result = await response.json();
    const optimized = result[0]?.generated_text || content;

    // 3. Store optimized response in cache (TTL 3 days)
    await supabase.from("cache").insert([
      {
        hash: contentHash,
        result: optimized,
        expires_at: new Date(Date.now() + 3 * 86400 * 1000).toISOString(),
      },
    ]);

    // 4. Store message in user's chat history
    await storeUserMessage(userId, content, optimized, platform);

    return NextResponse.json({ optimized });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

// Simple content hashing function
async function hashContent(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Store user messages in Supabase, keeping only the last 10 messages
async function storeUserMessage(
  userId: string,
  content: string,
  optimized: string,
  platform: string
) {
  if (!userId) return;

  try {
    // Get current messages
    const { data: messages, error } = await supabase
      .from("messages")
      .select("id")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch messages:", error);
      return;
    }

    // If user already has MESSAGE_LIMIT messages, delete the oldest one
    if (messages.length >= MESSAGE_LIMIT) {
      const oldestMessageId = messages[messages.length - 1].id;
      await supabase.from("messages").delete().eq("id", oldestMessageId);
    }

    // Insert new message
    await supabase.from("messages").insert([
      {
        user_id: userId,
        content,
        optimized,
        platform,
        created_at: new Date().toISOString(),
      },
    ]);
  } catch (error) {
    console.error("Failed to store user message:", error);
  }
}
