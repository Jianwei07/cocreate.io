// components/Auth.tsx
"use client";
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export default function Auth() {
  const [user, setUser] = useState<User | null>(null);

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
      provider,
    });
    if (error) console.error("Login Error:", error);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <>
          <p className="text-sm text-gray-600 dark:text-gray-300 hidden md:block">
            Welcome, {user.email}
          </p>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm font-medium transition-colors"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => handleLogin("google")}
            className="hidden md:block px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium transition-colors"
          >
            Login with Google
          </button>
          <button
            onClick={() => handleLogin("github")}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-md text-sm font-medium transition-colors"
          >
            {/* Show different text based on screen size */}
            <span className="hidden md:inline">Login with GitHub</span>
            <span className="md:hidden">Login</span>
          </button>
        </>
      )}
    </div>
  );
}
