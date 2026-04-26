import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, PlusCircle, UserCircle, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';
import { auth } from '../../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, User } from 'firebase/auth';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
  }, []);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary text-white">
            <Home size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-brand-secondary">EasyHouse</span>
        </Link>

        <div className="hidden items-center space-x-8 md:flex">
          <Link to="/search" className="text-sm font-medium text-zinc-600 hover:text-brand-primary transition-colors">Find Rooms</Link>
          <Link to="/search" className="text-sm font-medium text-zinc-600 hover:text-brand-primary transition-colors">How it works</Link>
          <Link to="/admin" className="text-sm font-medium text-zinc-600 hover:text-brand-primary transition-colors">List your Room</Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link 
            to="/search" 
            className="flex items-center space-x-1 rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-primary/90 transition-all md:hidden"
          >
            <Search size={18} />
          </Link>
          <Link 
            to="/search" 
            className="hidden items-center space-x-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 transition-all md:flex"
          >
            <Search size={18} />
            <span>Search Rooms</span>
          </Link>

          {user ? (
            <div className="flex items-center space-x-3">
              <div className="hidden flex-col items-end md:flex">
                <span className="text-xs font-bold text-zinc-900">{user.displayName}</span>
                <button onClick={handleLogout} className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest hover:text-red-500">Sign Out</button>
              </div>
              <img 
                src={user.photoURL || ''} 
                alt={user.displayName || ''} 
                className="h-10 w-10 rounded-full border-2 border-brand-primary/20"
              />
            </div>
          ) : (
            <button 
              onClick={handleLogin}
              className="flex items-center space-x-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 transition-all"
            >
              <UserCircle size={20} className="text-zinc-400" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
