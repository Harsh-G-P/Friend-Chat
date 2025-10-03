"use client";

import { Friend } from "@/app/page";
import FriendItem from "@/components/dashboard/FriendItem";
import { useState } from "react";

interface FriendsSectionProps {
  friends: Friend[];
  requests: Friend[];
  loading: boolean;
  activeFriend: Friend | null;
  newFriend: string;
  setNewFriend: (value: string) => void;
  handleAdd: () => void;
  handleAccept: (id: string) => void;
  onSelectFriend: (friend: Friend) => void;
}

export default function FriendsSection({
  friends,
  requests,
  loading,
  newFriend,
  setNewFriend,
  handleAdd,
  handleAccept,
  onSelectFriend,
}: FriendsSectionProps) {
  // NEW: track which tab is active
  const [activeTab, setActiveTab] = useState<"all" | "add">("all");

  return (
    <div className="flex flex-col h-full bg-[#313338]">
      {/* ---------- Top Nav ---------- */}
      <div className="h-12 flex items-center border-b border-[#1e1f22] px-4 bg-[#2b2d31]">
        <button
          className="text-sm font-medium text-white px-2"
        >
          Friends
        </button>
        <span className="mx-2 text-gray-500">•</span>
        <button
          className={`ml-4 text-sm font-medium rounded px-3 py-1 transition ${
            activeTab === "all" ? "text-white bg-[#5865f2] hover:bg-[#4752c4]"
              : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setActiveTab("all")}
        >
          All
        </button>
        <button
          className={`ml-4 text-sm font-medium rounded px-3 py-1 transition ${
            activeTab === "add"
              ? "text-white bg-[#5865f2] hover:bg-[#4752c4]"
              : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setActiveTab("add")}
        >
          Add Friend
        </button>
      </div>

      {/* ---------- Content ---------- */}
      <div className="flex-1 flex">
        {/* Left Column */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#1f2022]">
          {activeTab === "all" && (
            <>
              {/* Pending Requests */}
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">
                  Pending Requests
                </h2>
                {loading && <p className="text-gray-400">Loading…</p>}
                {!loading && requests.length === 0 && (
                  <p className="text-gray-500 text-sm">No pending requests</p>
                )}
                {requests.map((r) => (
                  <div
                    key={r._id}
                    className="flex items-center justify-between bg-[#2b2d31] rounded px-3 py-2"
                  >
                    <span className="text-sm">{r.username}</span>
                    <button
                      onClick={() => handleAccept(r._id)}
                      className="bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-3 py-1 rounded"
                    >
                      Accept
                    </button>
                  </div>
                ))}
              </div>

              {/* Friends List */}
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">
                  All Friends
                </h2>
                {friends.length === 0 && (
                  <p className="text-gray-500 text-sm">No friends yet</p>
                )}
                {friends.map((f) => (
                  <FriendItem
                    key={f._id}
                    name={f.name || f.username}
                    status="Friend"
                    image={f.image}
                    online
                    onClick={() => onSelectFriend(f)}
                  />
                ))}
              </div>
            </>
          )}

          {activeTab === "add" && (
  <div className="flex flex-col items-center justify-start h-full pt-16">
    {/* Heading */}
    <h1 className="text-2xl font-bold mb-2">Add Friend</h1>
    <p className="text-gray-400 mb-8 text-sm text-center max-w-md">
      You can add friends with their Discord username.  
      Make sure to include the <span className="text-white font-medium">#</span>.
    </p>

    {/* Input + Button */}
    <div className="flex w-full max-w-xl bg-[#1e1f22] rounded-md shadow-md">
      <input
        value={newFriend}
        onChange={(e) => setNewFriend(e.target.value)}
        placeholder="Enter a Username#0000"
        className="flex-1 px-4 py-3 rounded-l-md bg-transparent text-sm text-white placeholder-gray-400 focus:outline-none"
      />
      <button
        onClick={handleAdd}
        className="px-6 py-3 rounded-r-md bg-[#5865f2] hover:bg-[#4752c4] text-sm font-semibold transition-colors"
      >
        Send Friend Request
      </button>
    </div>

    {/* Tip text below input */}
    <p className="text-gray-500 text-xs mt-3">
      Remember: Usernames are case-sensitive.
    </p>
  </div>
)}

        </div>
      </div>
    </div>
  );
}
