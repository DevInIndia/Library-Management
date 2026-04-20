"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, role, logout } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 font-sans">
      <header className="flex items-center justify-between p-6 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <Image
            src="/amu-aligarh-muslim-university-seeklogo.svg"
            alt="AMU Logo"
            width={50}
            height={50}
            className="w-12 h-12"
          />
          <h1 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 tracking-tight">AMU Library Management</h1>
        </div>
        <nav className="hidden md:flex gap-6 font-medium items-center">
          <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Home</Link>
          <Link href="/catalog" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Catalog</Link>
          {(role === "admin" || role === "staff") && (
            <Link href="/dashboard" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Dashboard</Link>
          )}
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/profile" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">My Profile</Link>
              <button onClick={logout} className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100 px-4 py-2 rounded-lg hover:bg-emerald-200 transition-colors">
                Logout ({role})
              </button>
            </div>
          ) : (
            <Link href="/login" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
              Login
            </Link>
          )}
        </nav>
      </header>

      {user ? (
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
          <div className="flex flex-col items-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-gray-800 dark:text-white">
              Welcome to AMU Central Library
            </h2>
            <p className="text-lg md:text-xl max-w-2xl text-gray-600 dark:text-gray-300">
              Discover millions of resources, books, and digital materials tailored for students, researchers, and faculty members of Aligarh Muslim University.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl justify-center">
            <Link href="/catalog" className="group flex flex-col items-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 transform hover:-translate-y-1">
              <div className="w-20 h-20 mb-6 bg-emerald-50 dark:bg-gray-700 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Image src="/book-education-library-3-svgrepo-com.svg" alt="Books" width={48} height={48} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Browse Catalog</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed text-center">Search our extensive collection of books, journals, and digital media.</p>
            </Link>

            <Link href="/profile" className="group flex flex-col items-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 transform hover:-translate-y-1">
              <div className="w-20 h-20 mb-6 bg-emerald-50 dark:bg-gray-700 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Image src="/avatar-card-education-svgrepo-com.svg" alt="User Profile" width={48} height={48} />
              </div>
              <h3 className="text-xl font-semibold mb-3">My Account</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed text-center">Manage your loans, track due dates, and monitor fines conveniently.</p>
            </Link>
            
            {(role === "admin" || role === "staff") && (
              <Link href="/directory" className="group flex flex-col items-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 transform hover:-translate-y-1">
                <div className="w-20 h-20 mb-6 bg-emerald-50 dark:bg-gray-700 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Image src="/education-library-metting-svgrepo-com.svg" alt="Staff Directory" width={48} height={48} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Staff Directory</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed text-center">Connect with other library staff members and administrators.</p>
              </Link>
            )}
          </div>
        </main>
      ) : (
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto flex flex-col items-center animate-in fade-in duration-1000">
            <div className="w-24 h-24 mb-6 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center">
              <Image src="/amu-aligarh-muslim-university-seeklogo.svg" alt="Library Setup" width={56} height={56} />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 dark:text-white leading-tight">
              A Smart Way to Manage <br/><span className="text-emerald-600 dark:text-emerald-400">Library Resources</span>
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl">
              Our digital platform connects students, staff, and admins. Browse catalogs, track borrow periods, and manage library inventory effortlessly.
            </p>

            <div className="grid md:grid-cols-3 gap-6 w-full text-left mb-12">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="text-3xl font-black text-emerald-100 dark:text-emerald-900/50 mb-4">01</div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Register & Connect</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Create an account. Students are auto-approved, while Staff and Admins undergo manual verification for security.</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="text-3xl font-black text-emerald-100 dark:text-emerald-900/50 mb-4">02</div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Browse the Catalog</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Search through our real-time database of books. See exact quantities available before heading to the physical library.</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="text-3xl font-black text-emerald-100 dark:text-emerald-900/50 mb-4">03</div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Borrow & Track Fines</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Borrow books digitally. You have 7 days free! After that, our automated system calculates a simple ₹1/day fine.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Link href="/register" className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-emerald-700 hover:shadow-lg transition-all transform hover:-translate-y-1">
                Get Started Today
              </Link>
              <Link href="/login" className="bg-white dark:bg-gray-800 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-8 py-3 rounded-xl font-medium hover:bg-emerald-50 dark:hover:bg-gray-700 transition-all">
                Login
              </Link>
            </div>
          </div>
        </main>
      )}

      <footer className="bg-emerald-900 dark:bg-gray-950 text-emerald-50 dark:text-gray-400 p-8 text-center mt-auto border-t border-emerald-800 dark:border-gray-800">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="font-medium">&copy; {new Date().getFullYear()} Aligarh Muslim University Library. All rights reserved.</p>
          <div className="flex gap-6 text-sm font-medium">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
