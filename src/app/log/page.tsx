"use client";

import { useState } from "react";
import { Mail, User, Lock, TriangleAlert } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Log() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" ,username:""});
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPending(true);

    if (isLogin) {
      const res = await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
      });

      setPending(false);

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        toast.success("Logged in successfully!");
        router.push("/"); 
      }
    } else {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setPending(false);

      
      if (res.ok) {
        toast.success(data.message);
        setIsLogin(true);
      } else {
        setError(data.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
             bg-[url('/3.jpg')] bg-cover bg-center 
             font-poppins p-4 relative overflow-hidden">
      {/* Abstract shapes / background blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-[#7289DA] rounded-full opacity-30 filter blur-3xl"></div>
      <div className="absolute bottom-[-25%] right-[-15%] w-80 h-80 bg-[#99aab5] rounded-full opacity-20 filter blur-2xl"></div>
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#7289DA] rounded-full opacity-10 filter blur-3xl -translate-x-1/2 -translate-y-1/2"></div>

      {/* Card */}
      <div className="w-full max-w-md bg-[#2C2F33] rounded-2xl p-8 shadow-lg border border-[#7289DA] relative z-10">
        <h2 className="text-3xl font-extrabold text-center text-[#7289DA] mb-6 tracking-wide">
          {isLogin ? "🚀 Ready to Chat?" : "✨ Join the Fun!"}
        </h2>

        {error && (
          <div className="bg-red-600 p-3 rounded-lg flex items-center gap-x-2 text-sm text-white mb-4">
            <TriangleAlert className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="flex items-center gap-3 bg-[#23272A] border border-[#7289DA] rounded-lg p-3 focus-within:ring-2 focus-within:ring-[#7289DA] transition">
              <User className="w-5 h-5 text-[#7289DA]" />
              <input
                type="text"
                placeholder="Name"
                disabled={pending}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full outline-none bg-transparent text-white placeholder-gray-400"
                required
              />
            </div>
          )}
          {!isLogin && (
            <div className="flex items-center gap-3 bg-[#23272A] border border-[#7289DA] rounded-lg p-3 focus-within:ring-2 focus-within:ring-[#7289DA] transition">
              <User className="w-5 h-5 text-[#7289DA]" />
              <input
                type="text"
                placeholder="Username"
                disabled={pending}
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full outline-none bg-transparent text-white placeholder-gray-400"
                required
              />
            </div>
          )}

          <div className="flex items-center gap-3 bg-[#23272A] border border-[#7289DA] rounded-lg p-3 focus-within:ring-2 focus-within:ring-[#7289DA] transition">
            <Mail className="w-5 h-5 text-[#7289DA]" />
            <input
              type="email"
              placeholder="Email"
              disabled={pending}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full outline-none bg-transparent text-white placeholder-gray-400"
              required
            />
          </div>

          <div className="flex items-center gap-3 bg-[#23272A] border border-[#7289DA] rounded-lg p-3 focus-within:ring-2 focus-within:ring-[#7289DA] transition">
            <Lock className="w-5 h-5 text-[#7289DA]" />
            <input
              type="password"
              placeholder="Password"
              disabled={pending}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full outline-none bg-transparent text-white placeholder-gray-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full py-3 bg-[#7289DA] text-white rounded-lg font-bold hover:bg-[#5b6eae] transition"
          >
            {pending ? "Please wait..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#7289DA] font-semibold hover:underline"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
