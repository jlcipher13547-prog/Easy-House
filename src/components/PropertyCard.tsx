import React, { useEffect, useState } from 'react';
import { MapPin, Clock, CheckCircle, MessageSquare, Phone, UserCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import type { Property, Landlord } from '../types';
import { OperationType } from '../types';
import { cn } from '../lib/utils';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError } from '../lib/error-handler';

interface PropertyCardProps {
  property: Property;
  key?: string | number;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [landlord, setLandlord] = useState<Landlord | null>(null);
  const whatsappUrl = `https://wa.me/${property.landlordWhatsApp.replace(/\+/g, '')}?text=Hi, I'm interested in your room listing: ${property.title} on EasyHouse.`;

  useEffect(() => {
    async function fetchLandlord() {
      if (!property.landlordId) return;
      
      try {
        const landlordDoc = await getDoc(doc(db, 'landlords', property.landlordId));
        if (landlordDoc.exists()) {
          setLandlord({ id: landlordDoc.id, ...landlordDoc.data() } as Landlord);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `landlords/${property.landlordId}`);
      }
    }

    fetchLandlord();
  }, [property.landlordId]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md"
    >
      <Link to={`/property/${property.id}`} className="relative h-48 w-full overflow-hidden">
        <img 
          src={property.images[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'} 
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-zinc-900 backdrop-blur-sm">
            {property.type}
          </span>
          {property.isVerified && (
            <span className="flex items-center space-x-1 rounded-full bg-brand-primary/90 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
              <CheckCircle size={12} />
              <span>Verified</span>
            </span>
          )}
          {landlord?.isVerified && (
            <span className="flex items-center space-x-1 rounded-full bg-blue-500/90 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
              <UserCheck size={12} />
              <span>Verified Host</span>
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <span className="rounded-full bg-brand-secondary/90 px-3 py-1 text-sm font-bold text-white backdrop-blur-sm">
            Kes {property.price.toLocaleString()}
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between">
          <Link to={`/property/${property.id}`}>
            <h3 className="text-lg font-bold text-zinc-900 group-hover:text-brand-primary transition-colors line-clamp-1">
              {property.title}
            </h3>
          </Link>
        </div>

        <div className="mt-2 flex items-center mb-1">
          <p className="text-xs font-medium text-zinc-600 flex items-center">
            Host: {property.landlordName}
            {landlord?.isVerified && (
              <span className="ml-1 text-blue-500" title="Verified Landlord">
                <UserCheck size={14} className="inline" />
              </span>
            )}
          </p>
        </div>

        <div className="mt-1 flex flex-wrap gap-y-2 text-sm text-zinc-500">
          <div className="mr-4 flex items-center">
            <MapPin size={14} className="mr-1" />
            <span>{property.location}</span>
          </div>
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            <span>{property.distanceToCampus} min walk</span>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center space-x-2 rounded-xl bg-[#25D366] py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#20ba5a] transition-all"
          >
            <MessageSquare size={18} />
            <span>WhatsApp</span>
          </a>
          <a 
            href={`tel:${property.landlordPhone}`}
            className="flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-zinc-700 shadow-sm hover:bg-zinc-50 transition-all"
          >
            <Phone size={18} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
