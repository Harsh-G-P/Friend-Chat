import { Headphones, Mic, SettingsIcon } from "lucide-react";
import Link from "next/link";


export default function ProfileBar({ session }: { session: any }) {
    return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center font-semibold text-sm">
          {session?.user?.name?.charAt(0).toUpperCase() || "S"}
        </div>
        <span className="absolute -bottom-0.5 -right-0.5 w-[14px] h-[14px] bg-green-600 border-2 border-[#202225] rounded-full" />
      </div>
      <div className="flex-1 min-w-0 ml-2">
        <div className="text-sm font-semibold truncate">
          {session?.user?.name ?? "User"}
        </div>
        <div className="text-xs text-gray-400 truncate">Online</div>
      </div>
      <div className="flex items-center gap-1">
        <button className="p-2 rounded hover:bg-[#3a3c41]" aria-label="Mute">
          <Mic size={14} />
        </button>
        <button className="p-2 rounded hover:bg-[#3a3c41]" aria-label="Deafen">
          <Headphones size={14} />
        </button>
        <Link href="/setting">
          <button className="p-2 rounded hover:bg-[#3a3c41]" aria-label="Settings">
            <SettingsIcon size={14} />
          </button>
        </Link>
      </div>
    </div>
  );
}