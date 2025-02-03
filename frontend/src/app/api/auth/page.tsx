/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Chrome, Github, LogOut } from "lucide-react";
import Link from "next/link";
import { User } from "@supabase/supabase-js";

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const handleOAuthLogin = async (provider: "google" | "github") => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider });
      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Logout failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <h1 className="text-2xl font-bold">Welcome</h1>
        <p className="text-gray-400">Sign in or sign up to continue</p>

        {user ? (
          <>
            <p className="text-sm text-gray-400">Logged in as {user.email}</p>
            <Button
              className="w-full bg-red-500 hover:bg-red-600"
              onClick={handleLogout}
              disabled={isLoading}
            >
              <LogOut className="h-5 w-5 mr-2" /> Logout
            </Button>
          </>
        ) : (
          <>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => handleOAuthLogin("google")}
              disabled={isLoading}
            >
              <Chrome className="h-5 w-5 mr-2" /> Continue with Google
            </Button>
            <Button
              className="w-full bg-gray-700 hover:bg-gray-800"
              onClick={() => handleOAuthLogin("github")}
              disabled={isLoading}
            >
              <Github className="h-5 w-5 mr-2" /> Continue with GitHub
            </Button>
          </>
        )}

        {/* Back Button */}
        <Link href="/">
          <button className="mt-4 text-blue-400 hover:underline">
            ← Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}
