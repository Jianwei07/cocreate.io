"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { User } from "@supabase/supabase-js";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div className="flex items-center justify-between w-full p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          CoCreate.io
        </span>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-4">
        {user ? (
          <>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {user.email}
            </span>
            <Button className="bg-red-500 text-white" onClick={handleLogout}>
              <LogOut className="h-5 w-5 mr-2" /> Logout
            </Button>
          </>
        ) : (
          <Link href="/api/auth">
            <Button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
              Sign In / Sign Up
            </Button>
          </Link>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden p-2"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 md:hidden">
          {user ? (
            <>
              <span className="block text-sm text-gray-600 dark:text-gray-300">
                {user.email}
              </span>
              <Button
                className="w-full bg-red-500 text-white"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-2" /> Logout
              </Button>
            </>
          ) : (
            <Link href="/api/auth">
              <Button className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
                Sign In / Sign Up
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
