"use client";

import { Friend } from "@/app/page";
import { Info } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect, KeyboardEvent, useRef } from "react";
import dynamic from "next/dynamic";
import FriendProfile from "./FriendProfile";

interface FriendChatProps {
  friend: Friend;
}

interface Message {
  _id: string;
  sender: string;
  text: string;
  createdAt: string;
}

// Dynamic import to prevent SSR issues
const Picker = dynamic(() => import("emoji-picker-react"), { ssr: false });

const EMOJIS = ["😁","😍","😂","😭","😃","😆","🤪","😋","🥰","😇","😎","🤩","😶‍🌫️","😡","🥶","😪","😈","🤡","🤗"];

export default function FriendChat({ friend }: FriendChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Poll messages
  useEffect(() => {
    if (!friend._id) return;
    const fetchMessages = async () => {
      const res = await fetch(`/api/messages/${friend._id}`);
      if (res.ok) {
        const data: { messages: Message[] } = await res.json();
        setMessages(data.messages || []);
      }
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [friend._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const res = await fetch("/api/messages/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId: friend._id, text: input }),
    });
    if (res.ok) setInput("");
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const onEmojiClick = (emojiData: any) => {
    setInput((prev) => prev + emojiData.emoji);
    setShowPicker(false);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full w-full sm:w-auto bg-[#212224] relative">
      {/* Top bar */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b border-[#2b2d31] bg-[#313338]">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative w-10 h-10 sm:w-14 sm:h-14 sm:ml-0 ml-12">
            <Image
              src={friend.image || "/avatar.jpg"}
              alt="avatar"
              fill
              className="rounded-full object-cover"
            />
            <span className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-green-500 border-2 border-[#313338] rounded-full" />
          </div>
          <span className="text-white font-semibold text-sm sm:text-lg">{friend.name}</span>
        </div>

        {/* Info Icon (mobile only) */}
        <div className="flex items-center gap-3 sm:gap-4 text-gray-300">
          <button
            className="hover:text-white md:hidden"
            onClick={() => setIsProfileOpen(prev => !prev)}
          >
            <Info size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4 bg-[#1a2633]">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-sm sm:text-base">No messages yet. Say hello!</p>
        ) : (
          messages.map(m => (
            <div key={m._id} className="flex items-start gap-2 sm:gap-3 ">
              <div className="relative w-8 h-8 sm:w-9 sm:h-9">
                <Image
                  src={friend.image || "/avatar.jpg"}
                  alt="avatar"
                  fill
                  className="rounded-full object-cover"
                />
                <span className="absolute -bottom-[2px] -right-[-3px] w-3 h-3 sm:w-3.5 sm:h-3.5 bg-green-500 border-2 border-[#2b2d31] rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="font-medium text-gray-200 text-sm sm:text-base">{m.sender === friend._id ? friend.name : "You"}</span>
                  <span className="text-xs text-gray-400">{new Date(m.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-gray-200 text-sm sm:text-base">{m.text}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input */}
      <div className="border-t border-[#2b2d31] bg-[#313338] p-2 sm:p-4 relative">
        <div className="flex items-center gap-1 sm:gap-2">
          <input
            type="text"
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={`Message @${friend.username}`}
            className="flex-1 rounded-md bg-[#383a40] text-white px-2 sm:px-3 py-2 text-sm sm:text-base focus:outline-none"
          />
          <button
            onMouseEnter={() => setHoverIndex((prev) => (prev + 1) % EMOJIS.length)}
            onClick={() => setShowPicker(prev => !prev)}
            className="p-2 rounded-full text-xl sm:text-2xl"
          >
            {EMOJIS[hoverIndex]}
          </button>
        </div>

        {/* Emoji picker */}
        {showPicker && (
          <div className="absolute bottom-14 left-0 sm:left-4 z-50">
            <Picker onEmojiClick={onEmojiClick} />
          </div>
        )}
      </div>

      {/* Mobile FriendProfile Overlay */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end md:hidden">
          <div className="w-80 bg-[#1f2022] h-full p-3 relative">
            <button
              className="absolute top-3 right-3 text-white text-xl"
              onClick={() => setIsProfileOpen(false)}
            >
              ✕
            </button>
            <FriendProfile
              friend={friend}
              isMobileOpen={isProfileOpen}
              onCloseMobile={() => setIsProfileOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
