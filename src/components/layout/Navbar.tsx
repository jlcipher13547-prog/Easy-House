import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, PlusCircle, UserCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Navbar() {
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
          <Link to="#" className="text-sm font-medium text-zinc-600 hover:text-brand-primary transition-colors">How it works</Link>
          <Link to="#" className="text-sm font-medium text-zinc-600 hover:text-brand-primary transition-colors">For Landlords</Link>
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
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-colors">
            <UserCircle size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
}
