"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Book {
  id: string;
  name: string;
  totalBooks: number;
  availableBooks: number;
  borrowers?: any[];
}

export default function Dashboard() {
  const { user, role, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [books, setBooks] = useState<Book[]>([]);
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [newBookName, setNewBookName] = useState("");
  const [newBookCount, setNewBookCount] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user || (role !== "admin" && role !== "staff")) {
        router.push("/");
      } else {
        fetchBooks();
        if (role === "admin") {
          fetchPendingUsers();
        }
      }
    }
  }, [user, role, authLoading, router]);

  const fetchBooks = async () => {
    try {
      const res = await fetch("/api/books");
      const data = await res.json();
      setBooks(data.books || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingUsers = async () => {
    try {
      const res = await fetch("/api/users/pending");
      const data = await res.json();
      setPendingUsers(data.users || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (id: string, action: 'approve' | 'reject') => {
    try {
      const res = await fetch(`/api/users/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        fetchPendingUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newBookName, totalBooks: newBookCount, uid: user?.uid }),
      });
      if (res.ok) {
        setNewBookName("");
        setNewBookCount(1);
        fetchBooks();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const calculateFine = (borrowDateStr: string) => {
    const borrowDate = new Date(borrowDateStr);
    const now = new Date();
    borrowDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const diffTime = Math.abs(now.getTime() - borrowDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const daysOverdue = Math.max(0, diffDays - 7);
    return daysOverdue * 1;
  };

  if (authLoading || loading) return <div className="p-8">Loading...</div>;
  if (!user || (role !== "admin" && role !== "staff")) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">Library Dashboard</h1>
          <Link href="/" className="text-emerald-600 hover:underline font-medium">Back to Home</Link>
        </div>

        {role === "admin" && pendingUsers.length > 0 && (
          <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-xl shadow-sm border border-amber-200 dark:border-amber-800 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-amber-800 dark:text-amber-500">Pending Role Approvals</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-500/80">
                    <th className="py-3 font-medium">Name</th>
                    <th className="py-3 font-medium">Email</th>
                    <th className="py-3 font-medium">Requested Role</th>
                    <th className="py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingUsers.map((u) => (
                    <tr key={u.id} className="border-b border-amber-100 dark:border-amber-800/30 last:border-0">
                      <td className="py-3 dark:text-gray-200 font-medium">{u.displayName}</td>
                      <td className="py-3 dark:text-gray-300">{u.email}</td>
                      <td className="py-3 font-bold text-emerald-600 dark:text-emerald-400 uppercase text-sm">{u.requestedRole}</td>
                      <td className="py-3 flex gap-2">
                        <button onClick={() => handleApprove(u.id, 'approve')} className="bg-emerald-600 text-white px-3 py-1 rounded text-sm hover:bg-emerald-700">Approve</button>
                        <button onClick={() => handleApprove(u.id, 'reject')} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Add New Book</h2>
          <form onSubmit={handleAddBook} className="flex gap-4 items-end flex-wrap">
            <div className="flex-1 min-w-[250px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Book Name</label>
              <input
                type="text"
                required
                value={newBookName}
                onChange={(e) => setNewBookName(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm p-2 border dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Copies</label>
              <input
                type="number"
                min="1"
                required
                value={newBookCount}
                onChange={(e) => setNewBookCount(parseInt(e.target.value))}
                className="w-32 rounded-md border-gray-300 shadow-sm p-2 border dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <button type="submit" className="bg-emerald-600 text-white py-2 px-6 rounded-md hover:bg-emerald-700 font-medium h-[42px]">
              Add Book
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Manage Books</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b dark:border-gray-700 text-gray-600 dark:text-gray-400">
                  <th className="py-3 font-medium">Book Name</th>
                  <th className="py-3 font-medium">Total</th>
                  <th className="py-3 font-medium">Available</th>
                  {role === "admin" && <th className="py-3 font-medium">Borrowers</th>}
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id} className="border-b dark:border-gray-700 last:border-0">
                    <td className="py-4 dark:text-white font-medium">{book.name}</td>
                    <td className="py-4 dark:text-gray-300">{book.totalBooks}</td>
                    <td className="py-4 dark:text-gray-300">{book.availableBooks}</td>
                    {role === "admin" && (
                      <td className="py-4 text-sm text-gray-600 dark:text-gray-400">
                        {book.borrowers && book.borrowers.length > 0 ? (
                          <ul className="list-disc list-inside space-y-1">
                            {book.borrowers.map((b: any, i: number) => {
                              const fine = calculateFine(b.date);
                              return (
                                <li key={i}>
                                  <span className="font-medium">{b.name || b.uid}</span> 
                                  <span className="text-xs text-gray-400 ml-1">({new Date(b.date).toLocaleDateString()})</span>
                                  {fine > 0 && (
                                    <span className="ml-2 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded">
                                      Fine: ₹{fine}
                                    </span>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        ) : (
                          <span className="text-gray-400 italic">None</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {books.length === 0 && (
              <p className="text-gray-500 text-center py-6">No books in the library yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
