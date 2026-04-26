import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, SlidersHorizontal, MapPin, X } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import { PropertyType, type Property } from '../types';
import { motion, AnimatePresence } from 'motion/react';

// Reusing mock data for search page
const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Executive Bedsitter behind Gate C',
    description: 'Spacious bedsitter with tiled floors, constant water supply, and high-speed WiFi included. Very secure with CCTV.',
    price: 8500,
    type: PropertyType.BEDSITTER,
    distanceToCampus: 5,
    location: 'Gate C area',
    amenities: ['WiFi', 'Tiles', 'Water', 'Security'],
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'],
    landlordId: 'landlord_1',
    landlordName: 'John Doe',
    landlordPhone: '0700000000',
    landlordWhatsApp: '+254700000000',
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Modern Single Room - Gachororo',
    description: 'Clean single room near main road. Quiet environment perfect for studying. Water available 24/7.',
    price: 4500,
    type: PropertyType.SINGLE_ROOM,
    distanceToCampus: 12,
    location: 'Gachororo',
    amenities: ['Water', 'Security'],
    images: ['https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=800'],
    landlordId: 'landlord_2',
    landlordName: 'Jane Smith',
    landlordPhone: '0711111111',
    landlordWhatsApp: '+254711111111',
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    title: 'Spacious Bedseater in Oasis',
    description: 'Premium bedsitter with prepaid electricity, balcony, and near security post. 8 mins walk to Gate A.',
    price: 9000,
    type: PropertyType.BEDSITTER,
    distanceToCampus: 8,
    location: 'Oasis',
    amenities: ['WiFi', 'Balcony', 'Water', 'Security'],
    images: ['https://images.unsplash.com/photo-1536376074432-ca024541c882?auto=format&fit=crop&q=80&w=800'],
    landlordId: 'landlord_3',
    landlordName: 'Landlord X',
    landlordPhone: '0722222222',
    landlordWhatsApp: '+254722222222',
    isVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    title: 'Shared Room for 2 - Juja South',
    description: 'Affordable shared room with bunk beds. Ideal for first years on a budget. Study area provided.',
    price: 3500,
    type: PropertyType.SHARED_ROOM,
    distanceToCampus: 15,
    location: 'Juja South',
    amenities: ['Water', 'Security', 'Bunk Beds'],
    images: ['https://images.unsplash.com/photo-1555854817-5b2260d1bd63?auto=format&fit=crop&q=80&w=800'],
    landlordId: 'landlord_4',
    landlordName: 'Shared Hostels Ltd',
    landlordPhone: '0733333333',
    landlordWhatsApp: '+254733333333',
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function Search() {
  const [searchParams] = useSearchParams();
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<number>(15000);
  const [selectedType, setSelectedType] = useState<string>(searchParams.get('type') || 'All');

  const query = searchParams.get('q') || '';

  useEffect(() => {
    let results = MOCK_PROPERTIES.filter(p => 
      p.title.toLowerCase().includes(query.toLowerCase()) || 
      p.location.toLowerCase().includes(query.toLowerCase())
    );

    if (selectedType !== 'All') {
      results = results.filter(p => p.type === selectedType);
    }

    results = results.filter(p => p.price <= priceRange);

    setFilteredProperties(results);
  }, [query, selectedType, priceRange]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            {query ? `Results for "${query}"` : 'All available rooms'}
          </h1>
          <p className="mt-1 text-zinc-500">{filteredProperties.length} properties found in Juja</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-bold text-zinc-700 shadow-sm hover:bg-zinc-50"
          >
            <SlidersHorizontal size={18} />
            <span>Filters</span>
          </button>
          <div className="hidden h-8 w-px bg-zinc-200 md:block"></div>
          <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-bold text-brand-primary shadow-sm">
            <MapPin size={18} />
            <span>JKUAT, Juja</span>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Sidebar Filters - Desktop */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24 space-y-8 rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Room Type</h3>
              <div className="mt-4 space-y-2">
                {['All', ...Object.values(PropertyType)].map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="type" 
                      checked={selectedType === type}
                      onChange={() => setSelectedType(type)}
                      className="h-4 w-4 rounded-full border-zinc-300 text-brand-primary focus:ring-brand-primary"
                    />
                    <span className={`text-sm font-medium ${selectedType === type ? 'text-brand-primary font-bold' : 'text-zinc-600 group-hover:text-zinc-900'}`}>
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Price Range</h3>
                <span className="text-xs font-bold text-brand-primary">Up to Kes {priceRange.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="2000" 
                max="20000" 
                step="500"
                value={priceRange}
                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-100 accent-brand-primary"
              />
              <div className="mt-2 flex justify-between text-[10px] font-bold text-zinc-400">
                <span>2K</span>
                <span>10K</span>
                <span>20K</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Amenities</h3>
              <div className="mt-4 space-y-2">
                {['WiFi', 'Water included', 'Security', 'Tiled Floors', 'Prepaid Meter'].map((amenity) => (
                  <label key={amenity} className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="h-4 w-4 rounded border-zinc-300 text-brand-primary focus:ring-brand-primary" />
                    <span className="text-sm font-medium text-zinc-600 group-hover:text-zinc-900">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="lg:col-span-3">
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-3xl bg-zinc-50 py-20 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 text-zinc-300">
                <SearchIcon size={40} />
              </div>
              <h3 className="mt-6 text-xl font-bold text-zinc-900">No rooms found</h3>
              <p className="mt-2 text-zinc-500">Try adjusting your filters or search query.</p>
              <button 
                onClick={() => {
                  setSelectedType('All');
                  setPriceRange(20000);
                }}
                className="mt-6 font-bold text-brand-primary hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Modal */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 z-[60] bg-zinc-900/40 backdrop-blur-sm lg:hidden"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 z-[70] max-h-[90vh] overflow-y-auto rounded-t-[32px] bg-white p-8 lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                <h2 className="text-xl font-bold text-zinc-900">Filters</h2>
                <button onClick={() => setIsFilterOpen(false)} className="rounded-full bg-zinc-100 p-2 text-zinc-500 hover:bg-zinc-200">
                  <X size={20} />
                </button>
              </div>
              
              <div className="mt-6 space-y-8">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Room Type</h3>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {['All', ...Object.values(PropertyType)].map((type) => (
                      <button 
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`rounded-xl border px-4 py-3 text-sm font-bold transition-all ${
                          selectedType === type 
                          ? 'border-brand-primary bg-brand-primary text-white shadow-lg shadow-brand-primary/30' 
                          : 'border-zinc-200 bg-white text-zinc-600'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Price Range</h3>
                    <span className="text-sm font-bold text-brand-primary">Kes {priceRange.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    min="2000" 
                    max="20000" 
                    step="500"
                    value={priceRange}
                    onChange={(e) => setPriceRange(parseInt(e.target.value))}
                    className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-100 accent-brand-primary"
                  />
                </div>

                <div className="pb-8">
                  <button 
                    onClick={() => setIsFilterOpen(false)}
                    className="w-full rounded-2xl bg-brand-primary py-4 text-center font-bold text-white shadow-xl shadow-brand-primary/20"
                  >
                    Show {filteredProperties.length} rooms
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
