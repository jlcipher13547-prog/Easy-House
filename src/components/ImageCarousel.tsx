import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface ImageCarouselProps {
  images: string[];
  title: string;
}

export default function ImageCarousel({ images, title }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="relative group aspect-[16/9] w-full overflow-hidden rounded-3xl bg-zinc-100 md:aspect-auto md:h-[500px]">
        {/* Main Image Slider */}
        <div className="relative h-full w-full">
          <AnimatePresence mode="popLayout">
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              alt={`${title} - ${currentIndex + 1}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="h-full w-full object-cover cursor-pointer"
              onClick={() => setIsLightboxOpen(true)}
            />
          </AnimatePresence>
        </div>

        {/* Counter Overlay */}
        <div className="absolute top-4 right-4 z-10 rounded-full bg-black/40 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Enlarge Button */}
        <button 
          onClick={() => setIsLightboxOpen(true)}
          className="absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-zinc-900 shadow-md backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Maximize2 size={20} />
        </button>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-zinc-900 shadow-xl backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-white translate-x-2 group-hover:translate-x-0"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-zinc-900 shadow-xl backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-white -translate-x-2 group-hover:translate-x-0"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Thumbnails (Desktop Only) */}
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 space-x-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                currentIndex === idx ? "w-8 bg-white" : "w-2 bg-white/50"
              )}
            />
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black p-4 md:p-10"
          >
            <button 
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 z-[110] flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
            >
              <X size={32} />
            </button>

            <div className="relative h-full w-full flex items-center justify-center">
               {/* Lightbox Nav */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-0 z-[110] flex h-16 w-16 items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <ChevronLeft size={48} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-0 z-[110] flex h-16 w-16 items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <ChevronRight size={48} />
                  </button>
                </>
              )}

              <motion.img
                key={currentIndex}
                src={images[currentIndex]}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
              />
            </div>

            {/* Lightbox Thumbnails */}
            <div className="mt-8 flex space-x-3 overflow-x-auto pb-4 scrollbar-hide max-w-full">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={cn(
                    "relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                    currentIndex === idx ? "border-brand-primary scale-110" : "border-transparent opacity-50"
                  )}
                >
                  <img src={img} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
