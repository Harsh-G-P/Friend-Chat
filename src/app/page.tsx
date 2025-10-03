"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
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
    <div className="flex h-[1050px] text-white bg-[#1918187f]">
      {/* ---------- Left Sidebar ---------- */}
      <SideBar
        friends={friends}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        activeFriend={activeFriend}
        setActiveFriend={setActiveFriend}
        session={session}
      />

      <div className="flex-1 flex">
        {activeFriend ? (
          // ---------- Friend selected ----------
          <>
            {/* Middle: chat area */}
            <div className="flex-1 flex flex-col bg-[#1f2022]">
              <FriendChat friend={activeFriend} />
            </div>

            {/* Right: profile card */}
            <FriendProfile friend={activeFriend} />
          </>
        ) : (
          // ---------- No friend selected ----------
          <div className="flex flex-1 bg-[#25262a]">
            {/* Friends list column */}
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
                onSelectFriend={setActiveFriend}
              />
            </div>

            {/* Active-Now side card */}
            <div className="w-72 border-l border-[#1b1b1c] bg-[#1e2023] flex flex-col items-center">
              <div className="mt-10 text-center px-4">
                <h2 className="text-sm font-bold text-gray-200 mb-2">
                  Active Now
                </h2>
                <p className="text-gray-400 text-sm leading-5">
                  It’s quiet for now...
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
