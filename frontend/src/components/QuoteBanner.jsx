import React, { useState, useEffect } from "react";
import quotes from "../assets/gameQuotes.json";

export default function QuoteBanner({ quoteData }) {
  // If a specific quoteData is provided, skip random logic
  const [currentIndex, setCurrentIndex] = useState(() =>
    Math.floor(Math.random() * quotes.length)
  );
  const [fade, setFade] = useState(true);

  const { quote, game, who, bannerUrl } = quoteData || quotes[currentIndex];

  useEffect(() => {
    if (quoteData) return; // No rotation if fixed quote

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        let nextIndex;
        do {
          nextIndex = Math.floor(Math.random() * quotes.length);
        } while (nextIndex === currentIndex);
        setCurrentIndex(nextIndex);
        setFade(true);
      }, 1000);
    }, 10000);

    return () => clearInterval(interval);
  }, [currentIndex, quoteData]);

  return (
    <div
      className={`relative w-full bg-center bg-cover flex items-start justify-center px-6 pt-40 transition-opacity duration-1000
        ${quoteData ? "h-[60rem]" : "h-[50rem]"}`}
      style={{
        backgroundImage: `url(${bannerUrl})`,
        opacity: fade ? 1 : 0,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#040404cc] to-[#040404]" />
      <div className={`relative max-w-3xl text-white drop-shadow-lg text-left 
        ${quoteData ? "pt-0" : "pt-24"
      }`}>
        <p className="text-3xl md:text-5xl italic font-semibold mb-4">“{quote}”</p>
        <p className="text-xl md:text-2xl font-medium mb-1">— {who}</p>
        <p className="text-sm md:text-base text-gray-300">from {game}</p>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#040404] to-transparent" />
    </div>
  );
}
