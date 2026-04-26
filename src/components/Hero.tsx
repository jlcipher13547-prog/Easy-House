import React, { useState } from 'react';
import { Search, MapPin, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: any) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/search');
    }
  };

  return (
    <section className="relative overflow-hidden bg-white py-16 lg:py-24">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -z-10 h-full w-full -translate-x-1/2 opacity-10 [mask-image:radial-gradient(closest-side,white,transparent)]">
        <svg className="h-full w-full" fill="none" viewBox="0 0 400 400">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center space-x-2 rounded-full bg-brand-primary/10 px-4 py-1.5 text-sm font-semibold text-brand-primary">
              <Zap size={16} />
              <span>Verified student rooms in Juja</span>
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-4xl font-black tracking-tight text-brand-secondary sm:text-6xl lg:text-7xl"
          >
            Find a room in Juja before <br className="hidden lg:block" />
            you even leave your hostel.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-zinc-500"
          >
            Stop walking Juja in the sun. Browse verified bedsitters, hostels, and single rooms near JKUAT and book a viewing in seconds.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mx-auto mt-10 max-w-xl"
          >
            <form onSubmit={handleSearch} className="group relative flex items-center overflow-hidden rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl ring-brand-primary/20 transition-all focus-within:ring-4">
              <div className="flex flex-1 items-center px-4">
                <Search className="text-zinc-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search rooms near JKUAT..." 
                  className="w-full border-none bg-transparent px-3 py-3 text-zinc-900 outline-none placeholder:text-zinc-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="hidden h-10 w-px bg-zinc-200 md:block"></div>
              <div className="hidden items-center px-4 text-zinc-400 md:flex">
                <MapPin size={20} />
                <span className="ml-2 text-sm font-medium">Juja, Kenya</span>
              </div>
              <button 
                type="submit"
                className="rounded-xl bg-brand-primary px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-brand-primary/90 transition-all"
              >
                Find Rooms
              </button>
            </form>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-12 flex flex-wrap justify-center gap-8"
          >
            <div className="flex items-center space-x-2 text-sm font-medium text-zinc-600">
              <ShieldCheck className="text-brand-primary" size={20} />
              <span>Verified Rooms</span>
            </div>
            <div className="flex items-center space-x-2 text-sm font-medium text-zinc-600">
              <ShieldCheck className="text-brand-primary" size={20} />
              <span>No Agents Fees</span>
            </div>
            <div className="flex items-center space-x-2 text-sm font-medium text-zinc-600">
              <ShieldCheck className="text-brand-primary" size={20} />
              <span>10min Walk to Gate</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
