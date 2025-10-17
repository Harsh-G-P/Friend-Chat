"use client";

import React from "react";

export default function Sidebar({
  onSelect,
  onLogoutClick,
}: {
  onSelect: (t: "account" | "profiles") => void;
  onLogoutClick: () => void;
}) {
  return (
    <div className="flex flex-col justify-between bg-[#2b2d31] sm:w-64 h-full text-gray-200">
      <div className="overflow-y-auto flex-1">
        {/* Search input */}
        <div className="p-3">
          <input
            type="text"
            placeholder="Search"
            className="w-full rounded bg-[#1e1f22] text-sm p-2 placeholder-gray-400 focus:outline-none"
          />
        </div>

        {/* Sections */}
        <SidebarSection title="USER SETTINGS">
          <SidebarItem label="My Account" onClick={() => onSelect("account")} />
          <SidebarItem label="Profiles" onClick={() => onSelect("profiles")} />
        </SidebarSection>

        <div className="border-t border-gray-700 my-3"></div>

        {/* Logout */}
        <div
          className="text-red-700 font-bold px-3 py-2 cursor-pointer hover:text-red-500 rounded-md"
          onClick={onLogoutClick}
        >
          Log Out
        </div>
      </div>
    </div>
  );
}

function SidebarSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4">
      <p className="px-3 text-[10px] font-bold uppercase text-gray-400 tracking-wider mb-1">
        {title}
      </p>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

function SidebarItem({
  label,
  badge,
  onClick,
}: {
  label: string;
  badge?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between px-3 py-2 text-sm text-gray-300 hover:bg-[#36393f] cursor-pointer rounded-md transition-colors duration-200"
    >
      <span>{label}</span>
      {badge && (
        <span className="ml-2 text-[10px] font-bold text-purple-400">{badge}</span>
      )}
    </div>
  );
}
