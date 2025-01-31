// hooks/useSavedContent.ts
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type SavedContentRow = {
  content: string;
};

export const useSavedContent = (userId: string | undefined | null) => {
  const [savedContent, setSavedContent] = useState<string[]>([]);

  // Fetch saved content for the user
  const fetchSavedContent = async () => {
    if (!userId) return;

    // Check localStorage first
    const cachedContent = localStorage.getItem(`savedContent_${userId}`);
    if (cachedContent) {
      setSavedContent(JSON.parse(cachedContent));
      return;
    }

    // Fetch from Supabase
    const { data, error } = await supabase
      .from("saved_content")
      .select("content")
      .eq("user_id", userId)
      .range(0, 9); // Fetch first 10 items

    if (error) {
      console.error("Error fetching saved content:", error);
    } else if (data && data.length > 0) {
      const savedData = data.map((item: SavedContentRow) => item.content);
      setSavedContent(savedData);

      // Cache in localStorage
      localStorage.setItem(`savedContent_${userId}`, JSON.stringify(savedData));
    } else {
      setSavedContent([]);
    }
  };

  useEffect(() => {
    fetchSavedContent();
  }, [userId]);

  // Save content to the database
  const saveContent = async (content: string) => {
    if (!userId) return alert("Please log in to save content.");

    const { error } = await supabase.from("saved_content").insert([
      {
        user_id: userId,
        content: content,
      },
    ]);

    if (error) {
      console.error("Error saving content:", error);
    } else {
      setSavedContent([...savedContent, content]); // Update local state
      alert("Content saved successfully!");

      // Clear localStorage cache to force a fresh fetch
      localStorage.removeItem(`savedContent_${userId}`);
    }
  };

  return { savedContent, saveContent };
};
