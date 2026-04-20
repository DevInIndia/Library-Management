"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface BorrowedBook {
  id: string;
  name: string;
  borrowDate: string;
}

export default function Profile() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [books, setBooks] = useState<BorrowedBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login");
      } else {
        fetchBorrowedBooks();
      }
    }
  }, [user, authLoading, router]);

  const fetchBorrowedBooks = async () => {
    try {
      const res = await fetch(`/api/users/${user?.uid}/books`);
      const data = await res.json();
      setBooks(data.books || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (bookId: string) => {
    if (!user) return;
    try {
      const res = await fetch(`/api/books/${bookId}/return`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        alert(data.error);
      } else {
        alert("Book returned successfully! Thank you.");
        fetchBorrowedBooks(); // Refresh list to remove the book
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while returning the book.");
    }
  };

  const calculateFine = (borrowDateStr: string) => {
    const borrowDate = new Date(borrowDateStr);
    const now = new Date();
    
    // Set both dates to midnight to avoid time-of-day math issues
    borrowDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    
    const diffTime = Math.abs(now.getTime() - borrowDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Use Math.floor to ensure integer days passed
    
    const daysOverdue = Math.max(0, diffDays - 7);
    const fine = daysOverdue * 1; // 1 rupee per day
    
    return {
      diffDays,
      daysOverdue,
      fine,
      dueDate: new Date(borrowDate.getTime() + 7 * 24 * 60 * 60 * 1000)
    };
  };

  if (authLoading || loading) return <div className="p-8">Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">My Profile</h1>
          <Link href="/" className="text-emerald-600 hover:underline font-medium">Back to Home</Link>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="mb-6">
            <h2 className="text-xl font-semibold dark:text-white">Account Details</h2>
            <p className="text-gray-600 dark:text-gray-400">{user.displayName}</p>
            <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
          </div>

          <h2 className="text-xl font-semibold mb-4 dark:text-white border-t pt-6 dark:border-gray-700">My Borrowed Books</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b dark:border-gray-700 text-gray-600 dark:text-gray-400">
                  <th className="py-3 font-medium">Book Name</th>
                  <th className="py-3 font-medium">Borrowed On</th>
                  <th className="py-3 font-medium">Due Date</th>
                  <th className="py-3 font-medium">Status</th>
                  <th className="py-3 font-medium">Fine</th>
                  <th className="py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => {
                  const stats = calculateFine(book.borrowDate);
                  return (
                    <tr key={book.id} className="border-b dark:border-gray-700 last:border-0">
                      <td className="py-4 dark:text-white font-medium">{book.name}</td>
                      <td className="py-4 dark:text-gray-300">{new Date(book.borrowDate).toLocaleDateString()}</td>
                      <td className="py-4 dark:text-gray-300">{stats.dueDate.toLocaleDateString()}</td>
                      <td className="py-4">
                        {stats.daysOverdue > 0 ? (
                          <span className="text-red-600 dark:text-red-400 font-medium">{stats.daysOverdue} Days Overdue</span>
                        ) : (
                          <span className="text-emerald-600 dark:text-emerald-400">Due in {7 - stats.diffDays} Days</span>
                        )}
                      </td>
                      <td className="py-4">
                        <span className={stats.fine > 0 ? "text-red-600 dark:text-red-400 font-bold" : "text-gray-500"}>
                          ₹{stats.fine}
                        </span>
                      </td>
                      <td className="py-4">
                        <button 
                          onClick={() => handleReturn(book.id)}
                          className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded text-sm hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-800 transition-colors font-medium"
                        >
                          Return
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {books.length === 0 && (
              <p className="text-gray-500 text-center py-6">You have not borrowed any books yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
