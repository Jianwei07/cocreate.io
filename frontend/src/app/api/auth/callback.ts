// app/api/auth/callback.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    // Extract query parameters from the request URL
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const error = url.searchParams.get("error");

    if (error) {
      console.error("OAuth Error:", error);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/?error=${error}`
      );
    }

    if (!code) {
      console.error("No authorization code found in callback.");
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/?error=missing_code`
      );
    }

    // Exchange the authorization code for a session
    const { error: supabaseError } = await supabase.auth.exchangeCodeForSession(
      code
    );

    if (supabaseError) {
      console.error("Failed to exchange code for session:", supabaseError);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/?error=auth_failed`
      );
    }

    // Redirect the user to the home page or dashboard
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`
    );
  } catch (err) {
    console.error("Unexpected error in /auth/callback:", err);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/?error=unexpected_error`
    );
  }
}
