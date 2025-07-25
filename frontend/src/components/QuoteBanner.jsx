import React, { useState, useEffect } from "react";
import quotes from "../assets/gameQuotes.json";

export default function QuoteBanner() {
  // Store the current displayed quote in state
  const [currentIndex, setCurrentIndex] = useState(() =>
    Math.floor(Math.random() * quotes.length)
  );
  const [fade, setFade] = useState(true); // true = visible, false = hidden

  const { quote, game, who, bannerUrl } = quotes[currentIndex];

  // This effect simulates a quote change with fade
  // You can replace this with a prop trigger or button handler
  useEffect(() => {
    // Example: change quote every 10 seconds
    const interval = setInterval(() => {
      setFade(false); // start fade out
      setTimeout(() => {
        // after fade out, change quote and fade in
        let nextIndex;
        do {
          nextIndex = Math.floor(Math.random() * quotes.length);
        } while (nextIndex === currentIndex);
        setCurrentIndex(nextIndex);
        setFade(true);
      }, 1000); // match duration of CSS transition
    }, 8000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div
      className="relative h-[40rem] w-full bg-center bg-cover flex items-start justify-center px-6 pt-40 transition-opacity duration-1000"
      style={{
        backgroundImage: `url(${bannerUrl})`,
        opacity: fade ? 1 : 0,
      }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#040404cc] to-[#040404]" />

      {/* Content container */}
      <div className="relative max-w-3xl text-white drop-shadow-lg text-left pt-28">
        <p className="text-3xl md:text-5xl italic font-semibold mb-4">“{quote}”</p>
        <p className="text-xl md:text-2xl font-medium mb-1">— {who}</p>
        <p className="text-sm md:text-base text-gray-300">from {game}</p>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#040404] to-transparent" />
    </div>
  );
}
