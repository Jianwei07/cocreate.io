"use client";
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Mail, Chrome, Github, LogOut } from "lucide-react";

export default function Auth() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleOAuthLogin = async (provider: "google" | "github") => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      setIsEmailDialogOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Desktop view
  const DesktopAuth = () => (
    <div className="hidden md:flex items-center gap-2">
      {user ? (
        <>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {user.email}
          </span>
          <Button
            variant="destructive"
            onClick={handleLogout}
            disabled={isLoading}
            size="sm"
          >
            Logout
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="outline"
            onClick={() => handleOAuthLogin("google")}
            disabled={isLoading}
            size="sm"
            className="gap-2"
          >
            <Chrome className="h-4 w-4" />
            Login in Google
          </Button>
          <Button
            variant="outline"
            onClick={() => handleOAuthLogin("github")}
            disabled={isLoading}
            size="sm"
            className="gap-2"
          >
            <Github className="h-4 w-4" />
            Login in Github
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsEmailDialogOpen(true)}
            disabled={isLoading}
            size="sm"
            className="gap-2"
          >
            <Mail className="h-4 w-4" />
            Login in Email
          </Button>
        </>
      )}
    </div>
  );

  // Mobile view - returns buttons to be used in the mobile menu
  const MobileAuthButtons = () => (
    <div className="flex flex-col space-y-2 md:hidden">
      {user ? (
        <>
          <div className="px-2 py-1 text-sm text-gray-600 dark:text-gray-300">
            {user.email}
          </div>
          <Button
            variant="destructive"
            onClick={handleLogout}
            disabled={isLoading}
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="outline"
            onClick={() => handleOAuthLogin("google")}
            disabled={isLoading}
            className="w-full justify-start"
          >
            <Chrome className="h-4 w-4 mr-2" />
            Login with Google
          </Button>
          <Button
            variant="outline"
            onClick={() => handleOAuthLogin("github")}
            disabled={isLoading}
            className="w-full justify-start"
          >
            <Github className="h-4 w-4 mr-2" />
            Login with Github
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsEmailDialogOpen(true)}
            disabled={isLoading}
            className="w-full justify-start"
          >
            <Mail className="h-4 w-4 mr-2" />
            Login with Email
          </Button>
        </>
      )}
    </div>
  );

  return (
    <>
      <DesktopAuth />
      <MobileAuthButtons />

      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Login with Email</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Loading..." : "Login"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
