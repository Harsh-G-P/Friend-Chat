"use client";

import Image from "next/image";
import { Friend } from "@/app/page";

interface FriendProfileProps {
  friend: Friend & {
    banner?: string;
    about?: string;
    createdAt?: string;
  };
}

export default function FriendProfile({ friend }: FriendProfileProps) {
  const joined = friend.createdAt
    ? new Date(friend.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

  return (
    <aside className="pt-[200px] w-80 bg-[#1e1f20] h-full flex flex-col border-l border-[#1b1b1c] p-3">
      {/* Banner */}
      <div className="relative h-42 w-full">
        {friend.banner ? (
          <Image
            src={friend.banner}
            alt="Banner"
            width={320}
            height={168} // approximate 2:1 ratio
            className="h-42 w-full object-cover rounded"
          />
        ) : (
          <div
            className="h-42 w-full rounded"
            style={{
              background: "linear-gradient(to right, #facc15 50%, #000 50%)",
            }}
          />
        )}

        {/* Avatar overlapping banner */}
        <div className="absolute -bottom-12 left-2/12 -translate-x-1/2">
          <Image
            src={friend.image || "/avatar.jpg"}
            alt={friend.username}
            width={96}
            height={96}
            className="w-24 h-24 rounded-full border-8 border-[#313338] object-cover bg-[#2b2d31]"
          />
          <span className="absolute -bottom-[-5px] -right-[-10px] w-5 h-5 bg-green-500 border-3 border-[#2b2d31] rounded-full" />
        </div>
      </div>

      {/* Username & name */}
      <div className="mt-16 px-2">
        {friend.name && (
          <p className="text-2xl text-white font-bold">{friend.name}</p>
        )}
        <div className="flex items-center gap-2">
          <h2 className="text-xl text-white">{friend.username}</h2>
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#1d9a87] text-black">
            #
          </span>
        </div>
      </div>

      {/* About & Member Since */}
      <div className="mt-6 px-6 flex-1 space-y-4 text-sm overflow-y-auto">
        <div className="bg-[#343537] p-4 rounded-lg">
          <h3 className="font-bold text-white mb-1">About Me</h3>
          <p className="text-white break-words">
            {friend.about?.trim() || "No bio yet"}
          </p>
          <h3 className="mt-5 font-bold text-white mb-1">Member Since</h3>
          <p className="text-white">{joined}</p>
        </div>
      </div>
    </aside>
  );
}
