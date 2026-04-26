import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import PropertyCard from '../components/PropertyCard';
import { type Property, OperationType } from '../types';
import { Link } from 'react-router-dom';
import { ChevronRight, Home as HomeIcon, Building2, Users, Tent, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { handleFirestoreError } from '../lib/error-handler';

const CATEGORIES = [
  { name: 'Bedsitters', icon: HomeIcon, color: 'bg-blue-50 text-blue-600' },
  { name: 'Single Rooms', icon: Building2, color: 'bg-green-50 text-green-600' },
  { name: 'Shared Rooms', icon: Users, color: 'bg-orange-50 text-orange-600' },
  { name: 'Hostels', icon: Tent, color: 'bg-purple-50 text-purple-600' },
];

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const q = query(collection(db, 'properties'), orderBy('createdAt', 'desc'), limit(6));
        const querySnapshot = await getDocs(q);
        const fetchedProperties = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Property));
        setProperties(fetchedProperties);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'properties');
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);
  return (
    <div className="flex flex-col">
      <Hero />

      {/* Categories */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Browse by room type</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {CATEGORIES.map((category) => (
              <Link 
                key={category.name} 
                to={`/search?type=${category.name}`}
                className="group flex flex-col items-center rounded-2xl border border-zinc-100 bg-zinc-50/50 p-6 transition-all hover:border-brand-primary hover:bg-white hover:shadow-md"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${category.color} transition-transform group-hover:scale-110`}>
                  <category.icon size={24} />
                </div>
                <span className="mt-4 text-sm font-bold text-zinc-900">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-brand-secondary">Recently added rooms</h2>
              <p className="mt-2 text-zinc-500">The latest verified listings in Juja.</p>
            </div>
            <Link to="/search" className="flex items-center text-sm font-bold text-brand-primary hover:underline">
              View all
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>

          <div className="mt-10">
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="animate-spin text-brand-primary" size={48} />
              </div>
            ) : properties.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center rounded-3xl bg-zinc-50 border border-dashed border-zinc-200">
                <p className="text-zinc-500 font-medium">No rooms found in Juja yet.</p>
                <Link to="/admin" className="mt-4 text-brand-primary font-bold hover:underline">Add the first one</Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-brand-secondary py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-4xl font-bold leading-tight tracking-tight">Why JKUAT students <br />trust EasyHouse</h2>
              <div className="mt-10 space-y-8">
                <div className="flex items-start">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-brand-primary">
                    <CheckCircle size={24} className="text-brand-primary" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold">100% Real Listings</h3>
                    <p className="mt-1 text-zinc-400">Every room is verified by our team on the ground in Juja.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-brand-primary">
                    <CheckCircle size={24} className="text-brand-primary" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold">Direct Landlord Contact</h3>
                    <p className="mt-1 text-zinc-400">Skip the hidden agent fees. Call or WhatsApp the landlord directly.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-brand-primary">
                    <CheckCircle size={24} className="text-brand-primary" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold">Distance Accurate</h3>
                    <p className="mt-1 text-zinc-400">We personally walk from your hostel to JKUAT gates to ensure walk times are real.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video overflow-hidden rounded-3xl bg-zinc-800 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1590644365607-1c5a519a7a37?auto=format&fit=crop&q=80&w=1200" 
                  alt="Student Room"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 rounded-2xl bg-brand-primary p-6 shadow-xl">
                <p className="text-3xl font-black italic">"Found my Oasis bedsitter in 5 minutes."</p>
                <p className="mt-2 text-sm font-bold opacity-80">- Brian, JKUAT 3rd Year</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function CheckCircle({ size, className }: { size?: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
