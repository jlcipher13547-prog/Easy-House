import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, Clock, ShieldCheck, MessageSquare, Phone, 
  ChevronLeft, Share2, Heart, Check, Wifi, Droplet, 
  Zap, Shield, ExternalLink, Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { type Property, OperationType } from '../types';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { handleFirestoreError } from '../lib/error-handler';

import ImageCarousel from '../components/ImageCarousel';

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperty() {
      if (!id) return;
      try {
        const docRef = doc(db, 'properties', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProperty({ id: docSnap.id, ...docSnap.data() } as Property);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `properties/${id}`);
      } finally {
        setLoading(false);
      }
    }
    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center">
        <Loader2 className="animate-spin text-brand-primary" size={48} />
        <p className="mt-4 font-bold text-zinc-500">Loading details...</p>
      </div>
    );
  }

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
    <div className="bg-white">
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
        {/* Gallery Section */}
        <div className="mt-4">
          <ImageCarousel images={property.images} title={property.title} />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Main Info */}
          <div className="lg:col-span-2">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-700 uppercase tracking-wider">
                    {property.type}
                  </span>
                  {property.isVerified && (
                    <span className="flex items-center gap-1 rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-bold text-brand-primary uppercase tracking-wider">
                      <ShieldCheck size={14} />
                      Verified
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
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
                   <span className="text-xl font-bold">{property.landlordName.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900">{property.landlordName}</h3>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-tighter">Landlord / Agent</p>
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
