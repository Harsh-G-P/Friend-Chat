"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Users } from "lucide-react"; 
import NotLoggedIn from "@/components/NotLoggedIn";
import { toast } from "sonner";
import { acceptFriendRequest } from "@/lib/friends";
import FriendChat from "@/components/dashboard/FriendChat";
import FriendsSection from "@/components/dashboard/FriendsSection";
import SideBar from "@/components/dashboard/SideBar";
import FriendProfile from "@/components/dashboard/FriendProfile";

/* ---------- Types ---------- */
export interface Friend {
  _id: string;
  username: string;
  name?: string;
  image?: string;
}

export default function DiscordFriends() {
  const { data: session, status } = useSession();
  const [selectedTab, setSelectedTab] = useState("friends");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<Friend[]>([]);
  const [newFriend, setNewFriend] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeFriend, setActiveFriend] = useState<Friend | null>(null);

  // Mobile sidebar open state
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  async function loadData() {
    setLoading(true);
    const res = await fetch("/api/friends/list");
    const data = await res.json();
    setFriends(data.friends || []);
    setRequests(data.requests || []);
    setLoading(false);
  }

  useEffect(() => {
    if (status === "authenticated") loadData();
  }, [status]);

  async function handleAdd() {
    if (!newFriend.trim()) return;
    try {
      const res = await fetch("/api/friends/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUsername: newFriend.trim() }),
      });
      const data = await res.json();
      setNewFriend("");
      if (data.error) return toast.error(data.error);
      if (data.message) return toast.error(data.message);
      if (data.success) {
        toast.success("Friend request sent!");
        loadData();
      }
    } catch {
      toast.error("Network error");
    }
  }

  async function handleAccept(id: string) {
    await acceptFriendRequest(id);
    loadData();
  }

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center text-white bg-[#313338]">
        Loading...
      </div>
    );
  }
  if (!session) return <NotLoggedIn />;

  return (
    <div className="flex h-screen text-white bg-[#1918187f] relative">
      {/* ---------- Mobile Sidebar Button ---------- */}
      <div className="absolute top-4 left-4 md:hidden z-50">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className=" bg-[#2b2d31] rounded hover:bg-[#3a3c41] transition"
        >
          <Users size={24} />
        </button>
      </div>

      {/* ---------- Sidebar ---------- */}
      <SideBar
        friends={friends}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        activeFriend={activeFriend}
        setActiveFriend={setActiveFriend}
        session={session}
        mobileSidebarOpen={mobileSidebarOpen}
        setMobileSidebarOpen={setMobileSidebarOpen}
      />

      {/* ---------- Main Content ---------- */}
      <div className="flex-1 flex">
        {activeFriend ? (
          <>
            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-[#1f2022]">
              <FriendChat friend={activeFriend} />
            </div>

            {/* Right Profile */}
            <FriendProfile friend={activeFriend} />
          </>
        ) : (
          <div className="flex flex-1 bg-[#25262a]">
            {/* Friends List */}
            <div className="flex-1 overflow-y-auto border-r border-[#1b1b1c]">
              <FriendsSection
                friends={friends}
                requests={requests}
                loading={loading}
                activeFriend={activeFriend}
                newFriend={newFriend}
                setNewFriend={setNewFriend}
                handleAdd={handleAdd}
                handleAccept={handleAccept}
                onSelectFriend={(f) => {
                  setActiveFriend(f);
                  setMobileSidebarOpen(false); // close sidebar on mobile
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
