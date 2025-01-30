type Platform = "threads" | "bluesky" | "x";

export const PLATFORM_LIMITS: Record<Platform, number> = {
  threads: 500, // Actual Threads limit is 500 characters
  bluesky: 300, // Bluesky's 300 character limit
  x: 280, // Twitter/X limit
};

export function splitContent(content: string, platform: Platform): string[] {
  const limit = PLATFORM_LIMITS[platform];
  const chunks: string[] = [];
  let currentChunk = "";

  // Split on paragraphs first
  content.split("\n\n").forEach((paragraph) => {
    if (currentChunk.length + paragraph.length <= limit) {
      currentChunk += paragraph + "\n\n";
    } else {
      // Split long paragraphs
      const words = paragraph.split(" ");
      words.forEach((word) => {
        if (currentChunk.length + word.length + 1 > limit) {
          // +1 for space
          chunks.push(currentChunk.trim());
          currentChunk = "";
        }
        currentChunk += word + " ";
      });
    }
  });

  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}
