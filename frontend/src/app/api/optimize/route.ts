import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

// Cache for 1 hour (Vercel Edge Cache)
export const revalidate = 3600;

export async function POST(request: Request) {
  const { content, platform } = await request.json();

  // 1. Check cache first
  const contentHash = await hashContent(content + platform);
  const { data: cached } = await supabase
    .from("cache")
    .select("result")
    .eq("hash", contentHash)
    .single();

  if (cached) {
    return NextResponse.json({ optimized: cached.result });
  }

  // 2. Call AI API if no cache
  try {
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

    const result = await response.json();
    const optimized = result[0]?.generated_text || content;

    // 3. Store in cache (TTL 7 days)
    await supabase.from("cache").insert([
      {
        hash: contentHash,
        result: optimized,
        expires_at: new Date(Date.now() + 7 * 86400 * 1000).toISOString(),
      },
    ]);

    return NextResponse.json({ optimized });
  } catch (error) {
    return NextResponse.json({ optimized: content });
  }
}

// Simple content hashing
async function hashContent(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
