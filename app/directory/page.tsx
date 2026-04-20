"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Directory() {
  const { user, role, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [directoryUsers, setDirectoryUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user || (role !== "staff" && role !== "admin")) {
        router.push("/");
      } else {
        fetchDirectory();
      }
    }
  }, [user, role, authLoading, router]);

  const fetchDirectory = async () => {
    try {
      const res = await fetch(`/api/users/directory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      setDirectoryUsers(data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) return <div className="p-8">Loading...</div>;
  if (!user || (role !== "staff" && role !== "admin")) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">Staff Directory</h1>
          <Link href="/" className="text-emerald-600 hover:underline font-medium">Back to Home</Link>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {role === "admin" ? "List of all Staff and Administrators." : "List of your fellow Staff members."}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {directoryUsers.map(u => (
              <div key={u.id} className="p-4 border border-gray-100 dark:border-gray-700 rounded-lg flex items-center gap-4 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 rounded-full flex items-center justify-center font-bold text-xl uppercase shrink-0">
                  {u.displayName?.[0] || u.email?.[0] || "?"}
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-semibold dark:text-white truncate">{u.displayName || "Unknown User"}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{u.email}</p>
                  <span className="inline-block mt-1 text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">
                    {u.role}
                  </span>
                </div>
              </div>
            ))}
            {directoryUsers.length === 0 && (
              <p className="text-gray-500">No users found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
