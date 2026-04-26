import React, { useState } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { PropertyType } from '../types';
import { OperationType } from '../types';
import { handleFirestoreError } from '../lib/error-handler';
import { ShieldCheck, Plus } from 'lucide-react';

export default function Admin() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    type: PropertyType.BEDSITTER,
    location: '',
    distanceToCampus: 5,
    landlordPhone: '',
    landlordWhatsApp: '',
    landlordName: '',
    landlordId: 'test-landlord-id', // Default for now
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const docRef = await addDoc(collection(db, 'properties'), {
        ...formData,
        price: Number(formData.price),
        distanceToCampus: Number(formData.distanceToCampus),
        isVerified: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'],
        amenities: ['Water', 'Security', 'WiFi'],
      });
      alert(`Property added with ID: ${docRef.id}`);
      setFormData({
        title: '',
        description: '',
        price: 0,
        type: PropertyType.BEDSITTER,
        location: '',
        distanceToCampus: 5,
        landlordPhone: '',
        landlordWhatsApp: '',
        landlordName: '',
        landlordId: 'test-landlord-id',
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'properties');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-[32px] border border-zinc-200 bg-white p-8 shadow-xl">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="text-brand-primary" size={32} />
          <h1 className="text-3xl font-black text-brand-secondary">Landlord Admin</h1>
        </div>
        <p className="mt-2 text-zinc-500">Add a new room listing to EasyHouse.</p>

        <form onSubmit={handleSubmit} className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="col-span-full">
            <label className="block text-sm font-bold text-zinc-700">Property Title</label>
            <input 
              type="text" 
              required
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none focus:border-brand-primary"
              placeholder="e.g. Modern Bedsitter behind Gate C"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="col-span-full">
            <label className="block text-sm font-bold text-zinc-700">Description</label>
            <textarea 
              required
              rows={4}
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none focus:border-brand-primary"
              placeholder="Tell students about the water, security, WiFi, etc."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-zinc-700">Monthly Rent (Kes)</label>
            <input 
              type="number" 
              required
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none focus:border-brand-primary"
              value={formData.price}
              onChange={e => setFormData({...formData, price: Number(e.target.value)})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-zinc-700">Room Type</label>
            <select 
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none focus:border-brand-primary"
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value as PropertyType})}
            >
              {Object.values(PropertyType).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-zinc-700">Location in Juja</label>
            <input 
              type="text" 
              required
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none focus:border-brand-primary"
              placeholder="e.g. Gate C, Oasis, Gachororo"
              value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-zinc-700">Walk time to JKUAT (Min)</label>
            <input 
              type="number" 
              required
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none focus:border-brand-primary"
              value={formData.distanceToCampus}
              onChange={e => setFormData({...formData, distanceToCampus: Number(e.target.value)})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-zinc-700">Landlord Name</label>
            <input 
              type="text" 
              required
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none focus:border-brand-primary"
              value={formData.landlordName}
              onChange={e => setFormData({...formData, landlordName: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-zinc-700">Phone Number</label>
            <input 
              type="tel" 
              required
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none focus:border-brand-primary"
              placeholder="07..."
              value={formData.landlordPhone}
              onChange={e => setFormData({...formData, landlordPhone: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-zinc-700">Landlord ID (Firestore Ref)</label>
            <input 
              type="text" 
              required
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none focus:border-brand-primary"
              placeholder="e.g. landlord_123"
              value={formData.landlordId}
              onChange={e => setFormData({...formData, landlordId: e.target.value})}
            />
          </div>

          <div className="col-span-full">
            <button 
              type="submit" 
              disabled={loading}
              className="flex w-full items-center justify-center space-x-2 rounded-2xl bg-brand-primary py-4 text-lg font-black text-white shadow-xl shadow-brand-primary/20 hover:bg-brand-primary/90 disabled:opacity-50"
            >
              {loading ? <span>Saving...</span> : <><Plus size={24} /><span>List Property</span></>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
