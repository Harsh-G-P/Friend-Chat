"use client";
import { Friend } from "@/app/page";
import { Phone, Video, Info } from "lucide-react";
import React, { useState, useEffect, KeyboardEvent, useRef } from "react";

interface FriendChatProps { friend: Friend; }
const EMOJIS = ["😁", "😍", "😂", "😭", "😃", "😆", "🤪", "😋", "🥰", "😇", "😎", "🤩", "😶‍🌫️", "😡", "🥶", "😪", "😈", "🤡", "🤗"];

export default function FriendChat({ friend }: FriendChatProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [hoverIndex, setHoverIndex] = useState(0);
  const [showPicker, setShowPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Poll messages
  useEffect(() => {
    if (!friend._id) return;
    const fetchMessages = async () => {
      const res = await fetch(`/api/messages/${friend._id}`);
      if (res.ok) setMessages((await res.json()).messages || []);
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [friend._id]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // Send message
  const sendMessage = async () => {
    if (!input.trim()) return;
    const res = await fetch("/api/messages/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId: friend._id, text: input }),
    });
    if (res.ok) setInput("");
  };
  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter") { e.preventDefault(); sendMessage(); } };
  // 👇 Add a ref
  const inputRef = useRef<HTMLInputElement>(null);

  const addEmojiToInput = (emoji: string) => {
    setInput((p) => p + emoji);
    setShowPicker(false);

    // 👇 Focus back to the input so Enter works immediately
    inputRef.current?.focus();
  };



  return (
    <div className="flex flex-col h-[1050px] bg-[#212224]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2b2d31] bg-[#313338]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src={friend.image || "/avatar.jpg"} alt={friend.name} className="w-14 h-14 rounded-full border-8 border-[#313338] object-cover bg-[#2b2d31]" />
            <span className="absolute -bottom-[-4px] -right-[-6px] w-3.5 h-3.5 bg-green-500 border-3 border-[#313338] rounded-full" />
          </div>
          <span className="text-white font-semibold text-lg">{friend.name}</span>
        </div>
        <div className="flex items-center gap-4 text-gray-300">
         <button className="hover:text-white"><Info size={20} /></button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? <p className="text-gray-400">No messages yet. Say hello!</p> : messages.map(m => (
          <div key={m._id} className="flex items-start gap-3">
            <div className="relative">
              <img src="/avatar.jpg" alt="" className="w-11 h-11 rounded-full" />
              <span className="absolute -bottom-[3px] -right-[-4px] w-3.5 h-3.5 bg-green-500 border-3 border-[#2b2d31] rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-200">{m.sender === friend._id ? friend.name : "You"}</span>
                <span className="text-xs text-gray-400">{new Date(m.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-gray-200">{m.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input */}
      <div className="border-t border-[#2b2d31] bg-[#313338] p-4 relative">
        <div className="flex items-center gap-2">
          <input type="text" ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey} placeholder={`Message @${friend.username}`} className="flex-1 rounded-md bg-[#383a40] text-white px-3 py-2 focus:outline-none" />
          <button onMouseEnter={() => setHoverIndex((prev) => (prev + 1) % EMOJIS.length)} onClick={() => setShowPicker(prev => !prev)} className="p-2 rounded-full text-xl">{EMOJIS[hoverIndex]}</button>
        </div>
        {showPicker && <div className="absolute bottom-14 left-4 bg-[#2b2d31] border border-gray-700 rounded-md p-2 flex flex-wrap gap-2 shadow-lg z-50 w-[250px] max-h-64 overflow-y-auto">{EMOJIS.map(e => <button key={e} className="text-2xl hover:scale-125 transition-transform" onClick={() => addEmojiToInput(e)}>{e}</button>)}</div>}
      </div>
    </div>
  );
}
