import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, Clock, ShieldCheck, MessageSquare, Phone, 
  ChevronLeft, Share2, Heart, Check, Wifi, Droplet, 
  Zap, Shield, ExternalLink, UserCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { PropertyType, type Property, type Landlord, OperationType } from '../types';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError } from '../lib/error-handler';

// Mock data lookup helper
const getMockProperty = (id: string): Property | undefined => {
  return [
    {
      id: '1',
      title: 'Executive Bedsitter behind Gate C',
      description: 'This is a premium bedsitter located just 5 minutes walk from JKUAT Gate C. It features modern finishing, tiled floors, and 24/7 water supply. The area is highly secure with constant street lighting and CCTV surveillance. Ideal for students who want luxury and convenience.\n\nIncluded in rent: WiFi, Water, and Garbage collection. Electricity is prepaid (tokens). Availability is high but rooms go fast!',
      price: 8500,
      type: PropertyType.BEDSITTER,
      distanceToCampus: 5,
      location: 'Gate C area',
      amenities: ['WiFi', 'Tiled Floors', '24/7 Water', 'CCTV Security', 'Prepaid Tokens', 'Balcony'],
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=1200'
      ],
      landlordId: 'landlord_1',
      landlordName: 'John Doe',
      landlordPhone: '0700000000',
      landlordWhatsApp: '+254700000000',
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ].find(p => p.id === id);
};

export default function PropertyDetail() {
  const { id } = useParams();
  const property = getMockProperty(id || '');
  const [landlord, setLandlord] = useState<Landlord | null>(null);

  useEffect(() => {
    async function fetchLandlord() {
      if (!property?.landlordId) return;
      
      try {
        const landlordDoc = await getDoc(doc(db, 'landlords', property.landlordId));
        if (landlordDoc.exists()) {
          setLandlord({ id: landlordDoc.id, ...landlordDoc.data() } as Landlord);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `landlords/${property?.landlordId}`);
      }
    }

    fetchLandlord();
  }, [property?.landlordId]);

  if (!property) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-bold text-zinc-900">Room not found</h2>
        <p className="mt-2 text-zinc-500">The listing might have been removed or is no longer available.</p>
        <Link to="/search" className="mt-6 rounded-xl bg-brand-primary px-6 py-3 font-bold text-white shadow-lg">
          Back to search
        </Link>
      </div>
    );
  }

  const whatsappUrl = `https://wa.me/${property.landlordWhatsApp.replace(/\+/g, '')}?text=Hi, I'm interested in viewing your room listing: ${property.title} on EasyHouse.`;

  return (
    <div className="bg-white pb-20 md:pb-8">
      {/* Mobile Header */}
      <div className="fixed top-0 z-50 flex w-full items-center justify-between px-4 py-4 md:hidden">
        <Link to={-1 as any} className="rounded-full bg-white/90 p-2 text-zinc-900 shadow-md backdrop-blur-sm">
          <ChevronLeft size={24} />
        </Link>
        <div className="flex space-x-2">
          <button className="rounded-full bg-white/90 p-2 text-zinc-900 shadow-md backdrop-blur-sm">
            <Share2 size={20} />
          </button>
          <button className="rounded-full bg-white/90 p-2 text-zinc-900 shadow-md backdrop-blur-sm text-red-500">
            <Heart size={20} />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Gallery */}
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3 lg:h-[500px]">
          <div className="md:col-span-2 overflow-hidden rounded-3xl">
            <img 
              src={property.images[0]} 
              alt={property.title} 
              className="h-full w-full object-cover transition-transform hover:scale-105 duration-700" 
            />
          </div>
          <div className="hidden grid-rows-2 gap-4 md:grid">
            <div className="overflow-hidden rounded-3xl">
              <img 
                src={property.images[1] || property.images[0]} 
                alt={property.title} 
                className="h-full w-full object-cover" 
              />
            </div>
            <div className="overflow-hidden rounded-3xl">
              <img 
                src={property.images[2] || property.images[0]} 
                alt={property.title} 
                className="h-full w-full object-cover" 
              />
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Main Info */}
          <div className="lg:col-span-2">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-700 uppercase tracking-wider">
                    {property.type}
                  </span>
                  {property.isVerified && (
                    <span className="flex items-center gap-1 rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-bold text-brand-primary uppercase tracking-wider">
                      <ShieldCheck size={14} />
                      Verified Listing
                    </span>
                  )}
                  {landlord?.isVerified && (
                    <span className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-white uppercase tracking-wider">
                      <UserCheck size={14} />
                      Verified Host
                    </span>
                  )}
                </div>
                <h1 className="mt-4 text-3xl font-black text-zinc-900 sm:text-4xl">{property.title}</h1>
                <div className="mt-4 flex flex-wrap items-center gap-y-2 text-zinc-500">
                  <div className="mr-6 flex items-center">
                    <MapPin size={18} className="mr-2 text-brand-primary" />
                    <span className="font-medium">{property.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={18} className="mr-2 text-brand-primary" />
                    <span className="font-medium text-zinc-900">{property.distanceToCampus} min walk to JKUAT Gate</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end md:text-right">
                <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Monthly Rent</span>
                <p className="text-3xl font-black text-brand-primary">Kes {property.price.toLocaleString()}</p>
                <p className="text-xs font-bold text-zinc-500">+ Deposit (Kes {property.price.toLocaleString()})</p>
              </div>
            </div>

            <div className="mt-12 h-px w-full bg-zinc-100"></div>

            <div className="mt-12">
              <h2 className="text-xl font-bold text-zinc-900">About this room</h2>
              <div className="mt-6 prose prose-zinc max-w-none text-zinc-600 leading-relaxed">
                {property.description.split('\n').map((para, i) => (
                  <p key={i} className="mb-4">{para}</p>
                ))}
              </div>
            </div>

            <div className="mt-12">
              <h2 className="text-xl font-bold text-zinc-900">Key Amenities</h2>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {property.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-3 rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-brand-primary shadow-sm">
                      {amenity.toLowerCase().includes('wifi') ? <Wifi size={16} /> : 
                       amenity.toLowerCase().includes('water') ? <Droplet size={16} /> :
                       amenity.toLowerCase().includes('security') ? <Shield size={16} /> :
                       <Check size={16} />}
                    </div>
                    <span className="font-semibold text-zinc-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12">
              <h2 className="text-xl font-bold text-zinc-900">Map Location</h2>
              <div className="mt-6 overflow-hidden rounded-3xl bg-zinc-100">
                <div className="flex h-[300px] flex-col items-center justify-center bg-zinc-100 text-zinc-400">
                  <MapPin size={48} className="mb-4 opacity-20" />
                  <p className="text-sm font-bold uppercase tracking-widest">Interactive map coming soon</p>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=JKUAT+Juja+${encodeURIComponent(property.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center space-x-2 text-brand-primary hover:underline"
                  >
                    <ExternalLink size={16} />
                    <span>Open in Google Maps</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6 rounded-[32px] border border-zinc-200 bg-white p-8 shadow-2xl">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 overflow-hidden">
                    {landlord?.avatarUrl ? (
                      <img src={landlord.avatarUrl} alt={landlord.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-xl font-bold">{property.landlordName.charAt(0)}</span>
                    )}
                  </div>
                  {landlord?.isVerified && (
                    <div className="absolute -bottom-1 -right-1 rounded-full bg-blue-500 p-0.5 text-white shadow-sm">
                      <UserCheck size={12} />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900">{property.landlordName}</h3>
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-tighter">Landlord / Agent</p>
                    {landlord?.isVerified && <span className="text-[10px] bg-blue-50 text-blue-600 px-1 rounded font-bold">VERIFIED</span>}
                  </div>
                </div>
                {property.isVerified && <ShieldCheck className="ml-auto text-brand-primary" size={24} />}
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
                  <p className="text-xs font-bold text-zinc-400 uppercase">Response Time</p>
                  <p className="mt-1 text-sm font-bold text-zinc-900">Usually under 15 mins</p>
                </div>
                <div className="rounded-2xl bg-orange-50 p-4 text-orange-700 border border-orange-100">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase">Urgency</p>
                    <Zap size={14} />
                  </div>
                  <p className="mt-1 text-sm font-bold font-display tracking-tight">Only 2 rooms remaining at this property!</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <a 
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center space-x-2 rounded-2xl bg-[#25D366] py-5 text-lg font-black text-white shadow-xl shadow-green-200 hover:bg-[#20ba5a] transition-all"
                >
                  <MessageSquare size={24} />
                  <span>Chat on WhatsApp</span>
                </a>
                <a 
                  href={`tel:${property.landlordPhone}`}
                  className="flex w-full items-center justify-center space-x-2 rounded-2xl border-2 border-zinc-900 bg-white py-5 text-lg font-black text-zinc-900 shadow-xl shadow-zinc-100 hover:bg-zinc-50 transition-all"
                >
                  <Phone size={24} />
                  <span>Call Now</span>
                </a>
              </div>

              <div className="mt-8 border-t border-zinc-100 pt-6">
                <h4 className="text-sm font-bold text-zinc-900">Request Call Back</h4>
                <form className="mt-4 space-y-3" onSubmit={(e) => { e.preventDefault(); alert('Request sent! The landlord will call you shortly.'); }}>
                  <input 
                    type="tel" 
                    placeholder="Enter your phone number" 
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none focus:border-brand-primary"
                    required
                  />
                  <button 
                    type="submit"
                    className="w-full rounded-xl bg-brand-secondary py-3 text-sm font-bold text-white transition-all hover:bg-zinc-800"
                  >
                    Keep me notified
                  </button>
                </form>
              </div>

              <p className="text-center text-xs font-bold text-zinc-400">
                Mention "EasyHouse" to get verified student priority.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
