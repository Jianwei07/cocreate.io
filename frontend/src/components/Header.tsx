"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Moon, Sun, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { useTheme } from "next-themes";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

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
    <div className="flex items-center justify-between w-full px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      {/* Left Section: Logo + Subtitle */}
      <div className="flex items-center space-x-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            CoCreate
          </span>
        </div>
        {/* Subtitle/Description */}
        <span className="hidden md:inline-block text-sm text-gray-500 dark:text-gray-400 font-medium tracking-wide">
          | Short-Form Content Tool
        </span>
      </div>

      {/* Right Section: Navigation/Menu */}
      <div className="flex items-center space-x-4">
        {/* Dark Mode Toggle (Visible on Desktop) */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="hidden md:flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </span>
        </button>

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
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 md:hidden">
          {user ? (
            <>
              <span className="block text-sm text-gray-600 dark:text-gray-300 mb-2">
                {user.email}
              </span>
              <Button
                className="w-full bg-red-500 text-white mt-2"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-2" /> Logout
              </Button>
              {/* Dark Mode Toggle in Mobile Menu */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 w-full justify-start mt-4"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
              </button>
            </>
          ) : (
            <>
              <Link href="/api/auth">
                <Button className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
                  Sign In / Sign Up
                </Button>
              </Link>
              {/* Dark Mode Toggle in Mobile Menu */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 w-full justify-start mt-4"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
