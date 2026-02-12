"use client";

import { supabase } from "./lib/supabase";

export default function Home() {
  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: process.env.NEXT_PUBLIC_SITE_URL + "/dashboard",
      },
    });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      <div className="bg-zinc-900 p-10 rounded-2xl shadow-2xl text-center w-[350px]">
        <h1 className="text-3xl font-bold mb-3 tracking-wide">
          Smart Bookmark
        </h1>

        <p className="text-gray-400 mb-8 text-sm">
          Save and manage your links securely
        </p>

        <button
          onClick={loginWithGoogle}
          className="flex items-center justify-center gap-3 w-full bg-white text-black font-medium py-3 rounded-lg hover:bg-gray-200 transition duration-200"
        >
          {/* Google Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="w-5 h-5"
          >
            <path
              fill="#FFC107"
              d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.8-8.9 19.8-20 0-1.3-.1-2.5-.2-3.5z"
            />
            <path
              fill="#FF3D00"
              d="M6.3 14.7l6.6 4.8C14.5 16 18.9 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.3 6.1 29.4 4 24 4c-7.7 0-14.3 4.4-17.7 10.7z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.2 0 10-2 13.6-5.3l-6.3-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.1-11.2-7.5l-6.6 5.1C9.7 39.6 16.3 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.6 20.5H42V20H24v8h11.3c-1.2 3.4-4.6 6-8.8 6-2.7 0-5.2-.9-7.3-2.4l-6.6 5.1C9.7 39.6 16.3 44 24 44c11 0 19.8-8.9 19.8-20 0-1.3-.1-2.5-.2-3.5z"
            />
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
}
