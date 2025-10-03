"use client";

import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface AccountPageProps {
  onEditProfile: () => void;
}

interface UserData {
  name: string;
  username: string;
  email: string;
  phone?: string;
  image?: string;
  banner?: string;
}

export default function AccountPage({ onEditProfile }: AccountPageProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading,setLoading]=useState(false)

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/user");
        const json = await res.json();
        if (json.success) setUser(json.user);
      } catch (err) {
        console.error("Failed to load user", err);
      }
    })();
  }, []);

  if (!user) {
    return <p className="text-gray-400">Loading…</p>;
  }

  // helper to mask email for display
  const maskedEmail = user.email.replace(/(.{2}).+(@.+)/, "$1****$2");

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user", { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        toast.success("Account deleted successfully!");
        setTimeout(() => {
          signOut({ callbackUrl: "/" });
        }, 1500);
      } else {
        toast.error(json.message || "Failed to delete account");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while deleting your account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-transparent border rounded bg-[#111214]">
        <div className="relative rounded-lg overflow-hidden">
          {/* Banner */}
          <div
            className="h-28 bg-center bg-cover"
            style={{
              backgroundImage: user.banner ? `url(${user.banner})` : "none",
              backgroundColor: user.banner ? "transparent" : "#facc15",
            }}
          />

          <div className="bg-[#111214] p-6 relative">
            {/* Avatar */}
            <div className="absolute -top-12 left-6">
              <img
                src={user.image || "/1.jpg"}
                alt="avatar"
                className="w-24 h-24 rounded-full border-4 border-[#111214]"
              />
              <span className="absolute bottom-1 right-1 block w-5 h-5 bg-green-500 rounded-full border-3 border-[#232428]" />
            </div>

            <div className="ml-32 flex justify-between items-center">
              <p className="font-bold text-lg">{user.name}</p>
              <button
                onClick={onEditProfile}
                className="bg-[#5865f2] px-4 py-2 rounded font-semibold hover:bg-[#4752c4]"
              >
                Edit User Profile
              </button>
            </div>
          </div>
        </div>

        {/* Info sections */}
        <div className="p-4">
          <div className="bg-[#202123] rounded-lg divide-y divide-[#2b2d31]">
            <div className="flex justify-between items-center px-6 py-4">
              <div>
                <p className="text-sm font-medium">Display Name</p>
                <p className="text-xs text-gray-400">{user.name}</p>
              </div>
              <button
                onClick={onEditProfile}
                className="bg-[#2b2d31] px-3 py-1 rounded text-sm hover:bg-[#36393f]"
              >
                Edit
              </button>
            </div>

            <div className="flex justify-between items-center px-6 py-4">
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-xs text-gray-400">{maskedEmail}</p>
              </div>
              <button
                onClick={onEditProfile}
                className="bg-[#2b2d31] px-3 py-1 rounded text-sm hover:bg-[#36393f]"
              >
                Edit
              </button>
            </div>

            <div className="flex justify-between items-center px-6 py-4">
              <div>
                <p className="text-sm font-medium">Phone Number</p>
                <p className="text-xs text-gray-400">
                  {user.phone || "You haven’t added a phone number yet."}
                </p>
              </div>
              <button
                onClick={onEditProfile}
                className="bg-[#2b2d31] px-3 py-1 rounded text-sm hover:bg-[#36393f]"
              >
                {user.phone ? "Edit" : "Add"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Account Removal */}
      <div className="bg-[#111214] p-6 rounded space-y-3">
        <h3 className="font-semibold">Account Removal</h3>
        <p className="text-sm text-gray-400">
          Deleting your account is permanent and cannot be undone.
        </p>
        <div className="flex space-x-3">
          <button
          onClick={handleDelete}
            disabled={loading}
           className="bg-[#171718] text-red-700 font-semibold px-4 py-2 rounded hover:bg-red-800 hover:text-white">
            {loading ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </div>
    </div>
  );
}
