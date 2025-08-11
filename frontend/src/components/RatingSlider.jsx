import { useState } from "react";

const ratingColors = [
  "#ef4444", // red-ish at 0
  "#f59e0b", // orange-ish at 2
  "#eab308", // yellow-ish at 4
  "#22c55e", // green-ish at 6
  "#3b82f6", // blue-ish at 8
  "#8b5cf6", // purple-ish at 10
];

// Helper to interpolate color based on rating (0-10)
function interpolateColor(value) {
  const maxIndex = ratingColors.length - 1;
  const scaled = (value / 10) * maxIndex;
  const indexLow = Math.floor(scaled);
  const indexHigh = Math.min(Math.ceil(scaled), maxIndex);
  const ratio = scaled - indexLow;

  const color1 = hexToRgb(ratingColors[indexLow]);
  const color2 = hexToRgb(ratingColors[indexHigh]);

  const r = Math.round(color1.r + (color2.r - color1.r) * ratio);
  const g = Math.round(color1.g + (color2.g - color1.g) * ratio);
  const b = Math.round(color1.b + (color2.b - color1.b) * ratio);

  return `rgb(${r},${g},${b})`;
}

function hexToRgb(hex) {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex.split("").map((c) => c + c).join("");
  }
  const num = parseInt(hex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export default function RatingSlider({ rating, onChange }) {
  const color = interpolateColor(rating);

  return (
    <div className="max-w-md mx-auto p-4">
      <div
        className="text-4xl font-bold mb-4 select-none"
        style={{ color }}
      >
        {rating.toFixed(1)}
      </div>

      <input
        type="range"
        min="0"
        max="10"
        step="0.1"
        value={rating}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-4 rounded-lg appearance-none"
        style={{
          background: `linear-gradient(to right, ${color} 0%, ${color} ${(rating / 10) *
            100}%, #ddd ${(rating / 10) * 100}%, #ddd 100%)`,
        }}
      />

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: ${color};
          border: 2px solid #fff;
          cursor: pointer;
          margin-top: -10px;
          transition: background-color 0.3s ease;
        }
        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: ${color};
          border: 2px solid #fff;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
      `}</style>
    </div>
  );
}
