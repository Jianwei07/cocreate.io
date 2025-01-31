// components/Auth.tsx
"use client";
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js"; // Import the User type
import { supabase } from "@/lib/supabase";

export default function Auth() {
  const [user, setUser] = useState<User | null>(null); // Explicitly type the user state

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  const handleLogin = async (provider: "google" | "github") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider, // Supports "google", "github", etc.
    });
    if (error) console.error("Login Error:", error);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div className="flex gap-4">
      {user ? (
        <>
          <p>Welcome, {user.email}</p>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => handleLogin("google")}
            className="px-4 py-2 bg-blue-500 text-white"
          >
            Login with Google
          </button>
          <button
            onClick={() => handleLogin("github")}
            className="px-4 py-2 bg-gray-800 text-white"
          >
            Login with GitHub
          </button>
        </>
      )}
    </div>
  );
}
