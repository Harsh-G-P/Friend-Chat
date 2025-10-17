"use client";

import Image from "next/image";
import { Camera } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function ProfilePage() {

  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    about: "",
    phone: "",
    status: "online",
    banner: "",
    image: ""
  });

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/user');
      const json = await res.json();
      if (json.success) {
        setForm({
          username: json.user.username || "",
          name: json.user.name || "",
          email: json.user.email || "",
          about: json.user.about || "",
          phone: json.user.phone || "",
          status: json.user.status || "",
          banner: json.user.banner || "",
          image: json.user.image || "",
        });
      }
    })();
  }, []);

  const handleChange = (key: string, value: string) =>
    setForm((p) => ({ ...p, [key]: value }));

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const bannerInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64 = reader.result;

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: base64 }),
        });
        const result = await res.json();
        if (result.success) {
          setForm((p) => ({ ...p, image: result.url }));
          toast.success("✅ Image uploaded");
        } else {
          toast.error("❌ Upload failed");
        }
      } catch {
        toast.error("❌ Something went wrong");
      }
    };
  };

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64 = reader.result;

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: base64 }),
        });
        const result = await res.json();
        if (result.success) {
          setForm((p) => ({ ...p, banner: result.url }));
          toast.success("✅ Banner uploaded");
        } else {
          toast.error("❌ Banner upload failed");
        }
      } catch {
        toast.error("❌ Something went wrong");
      }
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const r = await fetch('/api/user', {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          about: form.about,
          phone: form.phone,
          status: form.status,
          banner: form.banner,
          image: form.image,
        })
      });
      const data = await r.json();
      if (data.success) {
        toast.success("✅ Profile updated");
      } else {
        toast.error("❌ Update failed: " + data.message);
      }
    } catch {
      toast.error("❌ Something went wrong");
    }
  };

  return (
    <div className="space-y-6 px-4 sm:px-6 md:px-8 max-w-full overflow-x-auto">
      {/* Top banner */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-500 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <div>
          <p className="font-bold text-white text-lg sm:text-xl">Give your profile a fresh look</p>
          <p className="text-sm text-gray-200">Update your basic information and images.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
          {/* Left column */}
          <div className="flex-1 space-y-4 min-w-[250px]">
            <div className="mb-3 relative">
              <p className="text-sm mb-1">Username</p>
              <input
                type="text"
                placeholder="Username"
                value={form.username}
                readOnly
                className="w-full rounded bg-[#1e1f22] p-3 text-sm placeholder-gray-400 focus:outline-none cursor-not-allowed"
              />
              <div className="pointer-events-none absolute top-2/3 left-0 w-full h-[1px] bg-gray-500" />
            </div>

            <div className="mb-3">
              <p className="text-sm mb-1">Display Name</p>
              <input
                type="text"
                value={form.name}
                placeholder="Name"
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full rounded bg-[#1e1f22] p-3 text-sm placeholder-gray-400 focus:outline-none"
              />
            </div>

            <div className="mb-3">
              <p className="text-sm mb-1">Email</p>
              <input
                type="text"
                placeholder="Email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full rounded bg-[#1e1f22] p-3 text-sm placeholder-gray-400 focus:outline-none"
              />
            </div>

            <div className="mb-3">
              <p className="text-sm mb-1">About</p>
              <input
                type="text"
                value={form.about}
                onChange={(e) => handleChange("about", e.target.value)}
                placeholder="About"
                className="w-full rounded bg-[#1e1f22] p-3 text-sm placeholder-gray-400 focus:outline-none"
              />
            </div>

            <div className="mb-3">
              <p className="text-sm mb-1">Phone Number</p>
              <input
                type="number"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="Phone Number"
                className="w-full rounded bg-[#1e1f22] p-3 text-sm placeholder-gray-400 focus:outline-none"
              />
            </div>

            <div>
              <p className="mb-1 text-white font-medium">Banner Color</p>
              <div
                className="w-10 h-10 rounded border border-gray-600 bg-center bg-cover"
                style={{
                  backgroundImage: form.banner ? `url(${form.banner})` : "none",
                  backgroundColor: form.banner ? "transparent" : "#facc15",
                }}
              />
            </div>
          </div>

          {/* Right column */}
          <div className="bg-[#1e1f22] p-4 rounded-lg w-full lg:w-80 flex-shrink-0">
            <p className="text-sm text-white mb-2 font-medium">Preview</p>

            <div className="relative rounded-xl overflow-hidden bg-[#232428] shadow-lg min-w-[280px]">
              {/* Banner */}
              <label className="group relative block h-36 sm:h-36 cursor-pointer w-full">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={bannerInputRef}
                  onChange={handleBannerChange}
                />
                <div className="h-full group-hover:brightness-75 flex items-center justify-center w-full">
                  {form.banner ? (
                    <Image
                      src={form.banner}
                      alt="banner"
                      width={320}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-yellow-400 flex items-center justify-center">
                      <Camera size={28} className="opacity-0 group-hover:opacity-100 text-white" />
                    </div>
                  )}
                </div>
              </label>

              {/* Avatar */}
              <div className="absolute bottom-[150px] sm:bottom-[160px] left-4 w-20 h-20">
                <label className="group relative block w-full h-full">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  <Image
                    src={form.image || "/1.jpg"}
                    alt="avatar"
                    fill
                    className="rounded-full border-4 border-[#232428] object-cover group-hover:brightness-75"
                  />
                  <Camera className="absolute inset-0 m-auto text-white opacity-0 group-hover:opacity-100" />
                </label>
                <span className="absolute bottom-1 right-1 block w-4 h-4 bg-green-500 rounded-full border-2 border-[#232428]" />
              </div>


              {/* Status */}
              <div className="absolute top-32 left-28 sm:left-28">
                <select
                  name="status"
                  value={form.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className="appearance-none bg-[#323336] text-gray-200 text-xs px-2 py-1 rounded-full border border-[#1e1f22] shadow cursor-pointer hover:bg-[#3a3b3e] focus:outline-none"
                >
                  <option value="" disabled>+ Add Status</option>
                  <option value="online">Online</option>
                  <option value="idle">Idle</option>
                  <option value="dnd">Do Not Disturb</option>
                  <option value="invisible">Invisible</option>
                </select>
              </div>

              {/* Info text */}
              <div className="pt-16 px-4 pb-4 text-white">
                <p className="font-bold text-lg truncate">{form.name}</p>
                <div className="flex items-center space-x-1 text-sm text-gray-300">
                  <span className="truncate">{form.username}</span>
                  <span className="text-[#23a55a]">#</span>
                </div>
                <p className="text-sm text-gray-300 mt-1 truncate">{form.about}</p>

                <button type="submit" className="bg-[#5865f2] hover:bg-[#4752c4] mt-4 w-full py-2 rounded-md font-medium">
                  Submit
                </button>
              </div>
            </div>

            {/* Nameplate */}
            <p className="mt-4 text-sm text-gray-400">Nameplate Preview</p>
            <div className="flex items-center space-x-2 bg-[#232428] p-2 rounded mt-1 text-white min-w-[200px]">
              <div className="w-6 h-6 relative rounded-full overflow-hidden">
                <Image src={form.image || "/1.jpg"} alt="avatar" fill className="object-cover" />
              </div>
              <span className="truncate">{form.name}</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
