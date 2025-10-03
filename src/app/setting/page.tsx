"use client"

import React, { useState } from "react"; // ✅ make sure React is imported
import { X } from "lucide-react";
import Sidebar from "@/components/settings/Sidebar";
import Link from "next/link";
import { signOut } from "next-auth/react";
import AccountPage from "@/components/settings/AccountPage";
import ProfilePage from "@/components/settings/ProfilePage";
import LogoutModal from "@/components/settings/LogoutModal";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<
    "account" | "profiles"
  >("account");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // ✅ use React.ReactNode instead of JSX.Element
  const pages: Record<
    typeof activeTab,
    { title: string; component: React.ReactNode }
  > = {
    account: { title: "My Account", component: <AccountPage onEditProfile={() => setActiveTab("profiles")} /> },
    profiles: { title: "Profiles", component: <ProfilePage /> },
  };

  return (
    <div className="flex justify-center bg-[#313338] h-screen text-white relative">
      <div className="flex w-full max-w-6xl h-full">
        <Sidebar
          onSelect={setActiveTab}
          onLogoutClick={() => setShowLogoutModal(true)}
        />

        <div className="mt-10 flex-1 flex justify-center overflow-y-auto">
          <div className="w-full max-w-3xl">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">{pages[activeTab].title}</h1>
              <Link href="/">
                <div className="mt-4 items-center space-x-2 text-gray-400 cursor-pointer hover:text-white">
                  <div className="rounded-full border-1 border-white h-8 w-8 flex items-center justify-center">
                    <X size={20} />
                  </div>
                  <span className="text-sm font-bold">ESC</span>
                </div>
              </Link>
            </div>

            {pages[activeTab].component}
          </div>
        </div>
      </div>

      {showLogoutModal && (
        <LogoutModal
          onCancel={() => setShowLogoutModal(false)}
          onConfirm={() => signOut({ callbackUrl: "/" })}
        />
      )}
    </div>
  );
}
