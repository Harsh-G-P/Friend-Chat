"use client";

import { Users, Plus, ShoppingBag } from "lucide-react";
import { Friend } from "@/app/page";
import FriendItem from "@/components/dashboard/FriendItem";
import ProfileBar from "@/components/dashboard/ProfileBar";

interface SidebarProps {
  friends: Friend[];
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  activeFriend: Friend | null;
  setActiveFriend: (friend: Friend | null) => void;
  session: any;
}

export default function SideBar({
  friends,
  selectedTab,
  setSelectedTab,
  activeFriend,
  setActiveFriend,
  session,
}: SidebarProps) {
  return (
    <div className="flex flex-col h-full w-80 relative">
      <div className="flex flex-1 overflow-hidden">
        {/* Server Sidebar */}
        <div className="w-16 bg-[#19191a] flex flex-col items-center py-4 space-y-4 shadow-lg">
          <button
            onClick={() => {
              setSelectedTab("home");
              setActiveFriend(null);
            }}
            className={`w-12 h-12 flex items-center justify-center rounded-3xl transition-all hover:rounded-2xl ${
              selectedTab === "home" ? "bg-[#5865f2]" : "bg-[#2b2d31]"
            }`}
          >
            <Users size={20} />
          </button>
          <button className="w-12 h-12 flex items-center justify-center rounded-3xl bg-[#2b2d31] hover:rounded-2xl hover:bg-green-600 transition-all">
            <Plus size={20} />
          </button>
        </div>

        {/* Friends Sidebar */}
        <div className="flex-1 flex flex-col bg-[#19191a] p-3 overflow-y-auto">
          <button
            className="flex items-center gap-2 px-2 py-2 rounded hover:bg-[#3a3c41] text-sm font-medium w-full"
            onClick={() => {
              setSelectedTab("friends");
              setActiveFriend(null);
            }}
          >
            <Users size={16} /> Friends
          </button>

          {/* Direct Messages */}
          <div className="mt-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase mb-2">
              Direct Messages
            </h2>
            <div className="space-y-1 text-sm">
              {friends.map((f) => (
                <FriendItem
                  key={f._id}
                  name={f.name || f.username}
                  status="Friend"
                  image={f.image}
                  online
                  onClick={() => setActiveFriend(f)}
                />
              ))}
              {friends.length === 0 && (
                <p className="text-gray-500 text-xs">No friends yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#232527] p-2 border-t border-[#2b2d31] mb-2">
        <ProfileBar session={session} />
      </div>
    </div>
  );
}
