"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

interface Book {
  id: string;
  name: string;
  totalBooks: number;
  availableBooks: number;
  borrowers?: any[];
}

export default function Catalog() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    fetchBooks();
  }, []);

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

  const handleBorrow = async (bookId: string) => {
    if (!user) {
      alert("Please login to borrow books.");
      return;
    }

    try {
      const res = await fetch(`/api/books/${bookId}/borrow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, userName: user.displayName || user.email }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        alert(data.error);
      } else {
        alert("Book borrowed successfully!");
        fetchBooks(); // Refresh list
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    }
  };

  const filteredBooks = books.filter(book => 
    book.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">Library Catalog</h1>
          <Link href="/" className="text-emerald-600 hover:underline">Back to Home</Link>
        </div>

        <div className="mb-8">
          <input 
            type="text" 
            placeholder="Search for a book..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-1/2 p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
          />
        </div>
        
        {loading ? (
          <p className="text-gray-500">Loading catalog...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => {
              const alreadyBorrowed = user && book.borrowers?.some(b => b.uid === user.uid);
              return (
              <div key={book.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-2 dark:text-white">{book.name}</h2>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <span>Total Copies: {book.totalBooks}</span>
                  <span className={`font-medium ${book.availableBooks > 0 ? "text-emerald-600" : "text-red-500"}`}>
                    Available: {book.availableBooks}
                  </span>
                </div>
                
                {alreadyBorrowed ? (
                  <button disabled className="w-full bg-gray-200 text-gray-500 py-2 rounded-lg cursor-not-allowed font-medium dark:bg-gray-700 dark:text-gray-400">
                    Already Borrowed
                  </button>
                ) : (
                  <button
                    onClick={() => handleBorrow(book.id)}
                    disabled={book.availableBooks <= 0 || !user}
                    className="w-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-100 dark:hover:bg-emerald-800 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {book.availableBooks <= 0 ? "Out of Stock" : "Borrow Book"}
                  </button>
                )}
              </div>
            )})}
            {filteredBooks.length === 0 && (
              <p className="text-gray-500 col-span-3 text-center py-10">No books found matching your search.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
