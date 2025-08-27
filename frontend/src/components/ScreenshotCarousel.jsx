import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ScreenshotCarousel({ screenshots }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-advance carousel when not hovered
  useEffect(() => {
    if (!isHovered && screenshots.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % screenshots.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isHovered, screenshots.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? screenshots.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % screenshots.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (!screenshots || screenshots.length === 0) {
    return (
      <div className="w-full aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">No screenshots available</p>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main image container */}
      <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-900">
        <img
          src={`https://images.igdb.com/igdb/image/upload/t_1080p/${screenshots[currentIndex]}.jpg`}
          alt={`Screenshot ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 select-none"
        />
        
        {/* Gradient overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        {/* Navigation arrows */}
        {screenshots.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/70 hover:bg-black/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
              aria-label="Previous screenshot"
            >
              <ChevronLeft size={24} />
            </button>
            
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/70 hover:bg-black/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
              aria-label="Next screenshot"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
        
        {/* Progress indicator */}
        {screenshots.length > 1 && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-black/70 text-white text-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {currentIndex + 1} / {screenshots.length}
          </div>
        )}
      </div>

      {/* Thumbnail navigation */}
      {screenshots.length > 1 && (
        <div className="flex justify-center gap-2 mt-4 select-none">
          {screenshots.map((screenshot, index) => (
            <button
              key={screenshot}
              onClick={() => goToSlide(index)}
              className={`relative w-16 h-10 rounded overflow-hidden border-2 transition-all duration-300 ${
                index === currentIndex
                  ? 'border-zinc-100 scale-110'
                  : 'border-gray-600 hover:border-gray-400 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={`https://images.igdb.com/igdb/image/upload/t_thumb/${screenshot}.jpg`}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {index === currentIndex && (
                <div className="absolute inset-0 bg-zinc-100/20" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Dot indicators (alternative to thumbnails for minimal design) */}
      {screenshots.length > 1 && screenshots.length <= 5 && (
        <div className="flex justify-center gap-2 mt-4">
          {screenshots.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-zinc-100 scale-125'
                  : 'bg-gray-400 hover:bg-gray-300'
              }`}
              aria-label={`Go to screenshot ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}