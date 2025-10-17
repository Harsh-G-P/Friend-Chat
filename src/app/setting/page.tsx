"use client";

import React, { useState } from "react";
import { X, Menu } from "lucide-react";
import Sidebar from "@/components/settings/Sidebar";
import Link from "next/link";
import { signOut } from "next-auth/react";
import AccountPage from "@/components/settings/AccountPage";
import ProfilePage from "@/components/settings/ProfilePage";
import LogoutModal from "@/components/settings/LogoutModal";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"account" | "profiles">("account");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pages: Record<
    typeof activeTab,
    { title: string; component: React.ReactNode }
  > = {
    account: {
      title: "My Account",
      component: (
        <AccountPage onEditProfile={() => setActiveTab("profiles")} />
      ),
    },
    profiles: { title: "Profiles", component: <ProfilePage /> },
  };

  return (
    <div className="bg-[#313338] min-h-screen text-white relative flex justify-center">
      {/* Desktop wrapper: center content */}
      <div className="hidden md:flex w-full max-w-5xl">
        {/* Sidebar */}
        <Sidebar
          onSelect={setActiveTab}
          onLogoutClick={() => setShowLogoutModal(true)}
        />

        {/* Main content */}
        <div className="flex-1 flex flex-col justify-start overflow-y-auto w-full px-6 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{pages[activeTab].title}</h1>
            <Link href="/">
              <div className="flex items-center space-x-2 text-gray-400 cursor-pointer hover:text-white">
                <div className="rounded-full border border-white h-8 w-8 flex items-center justify-center">
                  <X size={20} />
                </div>
                <span className="text-sm font-bold">ESC</span>
              </div>
            </Link>
          </div>
          <div className="w-full">{pages[activeTab].component}</div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-64 bg-[#212224] h-full p-4">
            <button
              className="mb-4 text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={24} />
            </button>
            <Sidebar
              onSelect={(tab) => {
                setActiveTab(tab);
                setSidebarOpen(false);
              }}
              onLogoutClick={() => {
                setShowLogoutModal(true);
                setSidebarOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Mobile Header + Content */}
      <div className="flex-1 flex flex-col justify-start overflow-y-auto w-full px-4 sm:px-6 md:hidden py-6">
        <div className="mb-4 flex justify-between items-center">
          <button
            className="bg-[#212224] px-3 py-2 rounded-md flex items-center gap-2"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={18} />
            Menu
          </button>
          <Link href="/">
            <div className="flex items-center space-x-2 text-gray-400 cursor-pointer hover:text-white">
              <div className="rounded-full border border-white h-8 w-8 flex items-center justify-center">
                <X size={20} />
              </div>
              <span className="text-sm font-bold">ESC</span>
            </div>
          </Link>
        </div>
        <div className="w-full max-w-3xl">{pages[activeTab].component}</div>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <LogoutModal
          onCancel={() => setShowLogoutModal(false)}
          onConfirm={() => signOut({ callbackUrl: "/" })}
        />
      )}
    </div>
  );
}
