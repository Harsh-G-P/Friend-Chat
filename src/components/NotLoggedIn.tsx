"use client";

import { useRouter } from "next/navigation";

export default function NotLoggedIn() {
  const router = useRouter();

  return (
    <div
      className="flex h-screen items-center justify-center
                 bg-[url('/2.jpg')] bg-cover bg-center relative
                 text-white flex-col gap-4"
    >
      <h1 className="text-2xl font-bold">You are not logged in</h1>
      <p className="text-gray-400">
        Please log in to see your friends and messages.
      </p>
      <button
        onClick={() => router.push("/log")}
        className="px-4 py-2 bg-[#5865f2] hover:bg-[#4752c4] rounded font-semibold"
      >
        Go to Login
      </button>
    </div>
  );
}
