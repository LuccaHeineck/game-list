import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function VideoCarousel({ videoUrls }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? videoUrls.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % videoUrls.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (!videoUrls || videoUrls.length === 0) {
    return (
      <div className="w-full aspect-video flex items-center justify-center">
        <p className="text-gray-400">No videos available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full group">
      {/* Main video */}
      <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-900">
        <iframe
          src={`https://www.youtube.com/embed/${videoUrls[currentIndex]}?rel=0&showinfo=0`}
          title={`Video ${currentIndex + 1}`}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />

        {/* Arrows */}
        {videoUrls.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/70 hover:bg-black/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
              aria-label="Previous video"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/70 hover:bg-black/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
              aria-label="Next video"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Counter */}
        {videoUrls.length > 1 && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-black/70 text-white text-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {currentIndex + 1} / {videoUrls.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {videoUrls.length > 1 && (
        <div className="flex justify-center gap-2 mt-4 select-none">
          {videoUrls.map((videoId, index) => (
            <button
              key={videoId}
              onClick={() => goToSlide(index)}
              className={`relative w-20 h-14 rounded overflow-hidden border-2 transition-all duration-300 ${
                index === currentIndex
                  ? 'border-zinc-100 scale-110'
                  : 'border-gray-600 hover:border-gray-400 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
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

      {/* Dots (only if few videos) */}
      {videoUrls.length > 1 && videoUrls.length <= 5 && (
        <div className="flex justify-center gap-2 mt-4">
          {videoUrls.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-zinc-100 scale-125'
                  : 'bg-gray-400 hover:bg-gray-300'
              }`}
              aria-label={`Go to video ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
