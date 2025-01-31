import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Platform character limits
export const PLATFORM_LIMITS = {
  threads: 500,
  bluesky: 300,
  x: 280,
} as const;

// Helper function for combining Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to split content based on platform character limits
export function splitContent(
  text: string,
  platform: keyof typeof PLATFORM_LIMITS
): string[] {
  const limit = PLATFORM_LIMITS[platform];
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  let currentChunk = "";

  for (const word of words) {
    // Check if adding the next word would exceed the limit
    const potentialChunk = currentChunk ? `${currentChunk} ${word}` : word;

    if (potentialChunk.length <= limit) {
      currentChunk = potentialChunk;
    } else {
      // If current chunk is not empty, push it to chunks
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }
      // Start new chunk with current word
      currentChunk = word;

      // Handle case where single word exceeds limit
      if (word.length > limit) {
        // Split the word into chunks of maximum length
        while (currentChunk.length > limit) {
          chunks.push(currentChunk.slice(0, limit));
          currentChunk = currentChunk.slice(limit);
        }
      }
    }
  }

  // Push the last chunk if it's not empty
  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

// Optional: Helper function to validate content length
export function validateContentLength(
  content: string,
  platform: keyof typeof PLATFORM_LIMITS
): boolean {
  return content.length <= PLATFORM_LIMITS[platform];
}

// Optional: Helper function to get remaining characters
export function getRemainingChars(
  content: string,
  platform: keyof typeof PLATFORM_LIMITS
): number {
  return PLATFORM_LIMITS[platform] - content.length;
}
