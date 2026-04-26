import React from 'react';
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary text-white">
                <Home size={18} />
              </div>
              <span className="text-xl font-bold tracking-tight text-brand-secondary">EasyHouse</span>
            </Link>
            <p className="mt-4 text-sm text-zinc-500">
              The #1 student rental platform for JKUAT students in Juja. Finding your next home shouldn't be a hassle.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">Explore</h3>
            <ul className="mt-4 space-y-2 text-sm text-zinc-500">
              <li><Link to="/search" className="hover:text-brand-primary">Search Rooms</Link></li>
              <li><Link to="#" className="hover:text-brand-primary">Hostels near JKUAT</Link></li>
              <li><Link to="#" className="hover:text-brand-primary">Bedsitters in Juja</Link></li>
              <li><Link to="#" className="hover:text-brand-primary">Verified Listings</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">Company</h3>
            <ul className="mt-4 space-y-2 text-sm text-zinc-500">
              <li><Link to="#" className="hover:text-brand-primary">About Us</Link></li>
              <li><Link to="#" className="hover:text-brand-primary">Contact Support</Link></li>
              <li><Link to="#" className="hover:text-brand-primary">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-brand-primary">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">Landlords</h3>
            <ul className="mt-4 space-y-2 text-sm text-zinc-500">
              <li><Link to="#" className="hover:text-brand-primary">List your property</Link></li>
              <li><Link to="#" className="hover:text-brand-primary">Guidelines</Link></li>
              <li><Link to="#" className="hover:text-brand-primary">FAQ</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-zinc-100 pt-8 text-center text-sm text-zinc-400">
          <p>© {new Date().getFullYear()} EasyHouse. Built for JKUAT Students.</p>
        </div>
      </div>
    </footer>
  );
}
