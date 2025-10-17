"use client";

import { Users, Plus } from "lucide-react"; 
import { Friend } from "@/app/page";
import FriendItem from "@/components/dashboard/FriendItem";
import ProfileBar from "@/components/dashboard/ProfileBar";

interface SideBarProps {
  friends: Friend[];
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  activeFriend: Friend | null;
  setActiveFriend: (friend: Friend | null) => void;
  session: {
    user?: {
      name?: string | null;
    } | null;
  } | null;
  mobileSidebarOpen?: boolean; // mobile drawer open state
  setMobileSidebarOpen?: (open: boolean) => void; // setter to close/open drawer
}

export default function SideBar({
  friends,
  selectedTab,
  setSelectedTab,
  setActiveFriend,
  session,
  mobileSidebarOpen = false,
  setMobileSidebarOpen,
}: SideBarProps) {
  return (
    <>
      {/* Sidebar container */}
      <div
        className={`
          fixed top-0 left-0 h-full w-80 z-50 flex flex-col bg-[#1c2b29] shadow-lg
          transform transition-transform duration-300
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0 md:flex
        `}
      >
        <div className="flex flex-1 overflow-hidden">
          {/* Server Sidebar */}
          <div className="w-16 bg-[#1c2b29]  flex flex-col items-center py-4 space-y-4">
            <button
              onClick={() => {
                setSelectedTab("home");
                setActiveFriend(null);
                setMobileSidebarOpen?.(false);
              }}
              className={`w-12 h-12 flex items-center justify-center rounded-3xl transition-all hover:rounded-2xl ${
                selectedTab === "home" ? "bg-[#5865f2]" : "bg-[#2b2d31]"
              }`}
            >
              <Users size={20} />
            </button>
            <button
              className="w-12 h-12 flex items-center justify-center rounded-3xl bg-[#2b2d31] hover:rounded-2xl hover:bg-green-600 transition-all"
              onClick={() => setSelectedTab("add")}
            >
              <Plus size={20} />
            </button>
          </div>

          {/* Friends Sidebar */}
          <div className="flex-1 flex flex-col p-3 overflow-y-auto">
            <button
              className="flex items-center gap-2 px-2 py-2 rounded hover:bg-[#3a3c41] text-sm font-medium w-full"
              onClick={() => {
                setSelectedTab("friends");
                setActiveFriend(null);
                setMobileSidebarOpen?.(false);
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
                {friends.length > 0 ? (
                  friends.map((f) => (
                    <FriendItem
                      key={f._id}
                      name={f.name || f.username}
                      status="Friend"
                      image={f.image}
                      online={true}
                      onClick={() => {
                        setActiveFriend(f);
                        setMobileSidebarOpen?.(false);
                      }}
                    />
                  ))
                ) : (
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

        {/* Close button for mobile */}
        <button
          className="absolute top-4 right-4 md:hidden text-gray-400 hover:text-white"
          onClick={() => setMobileSidebarOpen?.(false)}
        >
          ✕
        </button>
      </div>

      {/* Overlay when sidebar open on mobile */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileSidebarOpen?.(false)}
        />
      )}
    </>
  );
}
