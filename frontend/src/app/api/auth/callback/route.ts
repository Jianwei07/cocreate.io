import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Helper function to determine the base URL dynamically
const getBaseUrl = () => {
  return process.env.NODE_ENV === "production"
    ? "https://cocreate-io.vercel.app" // Production URL
    : "http://localhost:3000"; // Development URL
};

export async function GET(request: Request) {
  try {
    const url = new URL(request.url); // Parse the request URL
    const code = url.searchParams.get("code"); // Extract the authorization code
    const error = url.searchParams.get("error"); // Extract any error parameters

    const BASE_URL = getBaseUrl(); // Dynamically determine the base URL

    // Handle errors returned by the OAuth provider
    if (error) {
      console.error("OAuth Error:", error);
      return NextResponse.redirect(`${BASE_URL}/?error=${error}`);
    }

    // Ensure an authorization code is present
    if (!code) {
      console.error("No authorization code found in callback.");
      return NextResponse.redirect(`${BASE_URL}/?error=missing_code`);
    }

    // Exchange the authorization code for a session
    const { error: supabaseError } = await supabase.auth.exchangeCodeForSession(
      code
    );

    // Handle errors during session exchange
    if (supabaseError) {
      console.error("Failed to exchange code for session:", supabaseError);
      return NextResponse.redirect(`${BASE_URL}/?error=auth_failed`);
    }

    // Redirect to the dashboard on successful login
    return NextResponse.redirect(`${BASE_URL}/dashboard`);
  } catch (err) {
    // Log unexpected errors and redirect to an error page
    console.error("Unexpected error in /auth/callback:", err);
    const BASE_URL = getBaseUrl();
    return NextResponse.redirect(`${BASE_URL}/?error=unexpected_error`);
  }
}
