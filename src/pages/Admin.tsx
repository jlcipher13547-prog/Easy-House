import React, { useState, useRef } from 'react';
import { db, auth, storage } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { PropertyType } from '../types';
import { OperationType } from '../types';
import { handleFirestoreError } from '../lib/error-handler';
import { ShieldCheck, Plus, Image as ImageIcon, X, Loader2 } from 'lucide-react';

export default function Admin() {
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files: File[] = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
      
      const newPreviews = files.map((file: File) => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      alert('Please upload at least one image.');
      return;
    }
    setLoading(true);
    
    try {
      // 1. Upload Images
      const imageUrls: string[] = [];
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        setUploadProgress(`Uploading image ${i + 1} of ${selectedFiles.length}...`);
        const imageRef = ref(storage, `properties/${Date.now()}-${file.name}`);
        const snapshot = await uploadBytes(imageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        imageUrls.push(url);
      }

      // 2. Create Document
      setUploadProgress("Saving property details...");
      const docRef = await addDoc(collection(db, 'properties'), {
        ...formData,
        price: Number(formData.price),
        distanceToCampus: Number(formData.distanceToCampus),
        isVerified: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        images: imageUrls,
        landlordWhatsApp: formData.landlordWhatsApp || formData.landlordPhone,
        amenities: ['Water', 'Security', 'WiFi'],
      });

      alert(`Property added with ID: ${docRef.id}`);
      
      // Reset form
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
      });
      setSelectedFiles([]);
      setPreviews([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'properties');
    } finally {
      setLoading(false);
      setUploadProgress(null);
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
            <label className="block text-sm font-bold text-zinc-700 font-display">Property Title</label>
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
            <label className="block text-sm font-bold text-zinc-700 font-display">Property Images</label>
            <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {previews.map((preview, idx) => (
                <div key={idx} className="group relative aspect-square overflow-hidden rounded-xl bg-zinc-100">
                  <img src={preview} alt="preview" className="h-full w-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex aspect-square flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 hover:bg-zinc-100 transition-colors"
              >
                <ImageIcon className="mb-1 text-zinc-400" size={24} />
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Add Image</span>
              </button>
            </div>
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
            />
          </div>

          <div className="col-span-full">
            <label className="block text-sm font-bold text-zinc-700 font-display">Description</label>
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
            <label className="block text-sm font-bold text-zinc-700 font-display">Monthly Rent (Kes)</label>
            <input 
              type="number" 
              required
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none focus:border-brand-primary"
              value={formData.price}
              onChange={e => setFormData({...formData, price: Number(e.target.value)})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-zinc-700 font-display">Room Type</label>
            <select 
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none focus:border-brand-primary"
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value as PropertyType})}
            >
              {Object.values(PropertyType).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-zinc-700 font-display">Location in Juja</label>
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
            <label className="block text-sm font-bold text-zinc-700 font-display">Walk time to JKUAT (Min)</label>
            <input 
              type="number" 
              required
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none focus:border-brand-primary"
              value={formData.distanceToCampus}
              onChange={e => setFormData({...formData, distanceToCampus: Number(e.target.value)})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-zinc-700 font-display">Landlord Name</label>
            <input 
              type="text" 
              required
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none focus:border-brand-primary"
              value={formData.landlordName}
              onChange={e => setFormData({...formData, landlordName: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-zinc-700 font-display">Phone Number</label>
            <input 
              type="tel" 
              required
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none focus:border-brand-primary"
              placeholder="07..."
              value={formData.landlordPhone}
              onChange={e => setFormData({...formData, landlordPhone: e.target.value})}
            />
          </div>

          <div className="col-span-full">
            <button 
              type="submit" 
              disabled={loading}
              className="flex w-full flex-col items-center justify-center space-y-1 rounded-2xl bg-brand-primary py-4 text-lg font-black text-white shadow-xl shadow-brand-primary/20 hover:bg-brand-primary/90 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  <span className="text-xs font-bold uppercase tracking-widest">{uploadProgress}</span>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Plus size={24} />
                  <span>List Property</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
