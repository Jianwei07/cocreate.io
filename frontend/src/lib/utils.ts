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

// Function to split content based on platform character limits and breakpoints
export function splitContent(
  text: string,
  platform: keyof typeof PLATFORM_LIMITS
): string[] {
  const limit = PLATFORM_LIMITS[platform];
  const breakpoint = "//"; // Define the breakpoint syntax

  // Step 1: Split the content into segments using the breakpoint
  const rawSegments = text
    .split(breakpoint) // Split by the breakpoint
    .map((segment) => segment.trim()) // Trim whitespace around segments
    .filter((segment) => segment.length > 0); // Remove empty segments

  // Step 2: Further split each segment into chunks based on the platform's character limit
  const chunks: string[] = [];
  for (const segment of rawSegments) {
    const words = segment.split(/\s+/);
    let currentChunk = "";

    for (const word of words) {
      // Check if adding the next word would exceed the limit
      const potentialChunk = currentChunk ? `${currentChunk} ${word}` : word;
      if (potentialChunk.length <= limit) {
        currentChunk = potentialChunk;
      } else {
        // If the current chunk is not empty, push it to chunks
        if (currentChunk) {
          chunks.push(currentChunk.trim());
        }
        // Start a new chunk with the current word
        currentChunk = word;

        // Handle cases where a single word exceeds the limit
        if (word.length > limit) {
          // Split the word into chunks of maximum length
          while (currentChunk.length > limit) {
            chunks.push(currentChunk.slice(0, limit));
            currentChunk = currentChunk.slice(limit);
          }
        }
      }
    }

    // Push the last chunk for this segment if it's not empty
    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }
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
