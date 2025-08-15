import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { updateGameInList, fetchStatusList } from "../api";
import {
  CheckCircleIcon,
  ClockIcon,
  NoSymbolIcon,
  SparklesIcon,
  HandRaisedIcon,
} from "@heroicons/react/24/outline";

const ratingColors = [
  "#ef4444", "#f59e0b", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6",
];

function hexToRgb(hex) {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
  const num = parseInt(hex, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

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

export default function EditGameModal({ isOpen, onClose, entry, onDelete }) {
  const [formData, setFormData] = useState({ rating: 5, status: "" });
  const [statusOptions, setStatusOptions] = useState([]);

  // Move hooks above any conditional return
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      fetchStatusList().then((data) =>
        setStatusOptions(data.map((status) => ({ value: status.statusId, label: status.name })))
      );
      if (entry) {
        setFormData({ rating: entry.rating ?? 5, status: entry.statusId ?? "" });
      }
    }
  }, [isOpen, entry]);


  if (!isOpen || !entry) return null;

  const statusIcons = {
    1: ClockIcon, 2: CheckCircleIcon, 3: NoSymbolIcon,
    4: SparklesIcon, 5: HandRaisedIcon,
  };

  const selectedColors = {
    1: "bg-yellow-500 shadow-yellow-400",
    2: "bg-green-600 shadow-green-500",
    3: "bg-red-600 shadow-red-500",
    4: "bg-purple-600 shadow-purple-500",
    5: "bg-orange-500 shadow-orange-400",
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === "rating" ? Number(value) : value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateGameInList({ ...entry.game, rating: formData.rating, statusId: formData.status });
      alert("Game updated successfully!");
      onClose();
    } catch {
      alert("Failed to update game.");
    }
  };

  if (!isOpen) return null;
  const sliderColor = interpolateColor(formData.rating);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-zinc-900 text-white max-w-3xl w-full max-h-[95vh] rounded-xl shadow-xl flex flex-col overflow-hidden border border-white/10 p-8"
      >
        {/* Header */}
        <div className="flex items-center gap-6 border-b border-white/20 pb-6">
          {entry.game.coverUrl && (
            <img
              src={entry.game.coverUrl.replace("t_thumb", "t_cover_big")}
              alt={`${entry.game.name} cover`}
              className="w-40 h-56 object-cover rounded-xl shadow-lg flex-shrink-0"
            />
          )}
          <div className="flex flex-col justify-center">
            <h2 className="text-5xl font-extrabold leading-tight">{entry.game.name}</h2>
            <div
              className="mt-3 inline-flex items-center justify-center font-extrabold px-6 py-3 rounded-full text-4xl select-none drop-shadow-lg max-w-max"
              style={{ color: sliderColor, border: `3px solid ${sliderColor}` }}
            >
              {formData.rating.toFixed(1)}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleUpdate} className="mt-8 flex flex-col gap-8 flex-grow overflow-auto">
          <div className="relative mt-6 mb-6">
            <input
              type="range"
              id="rating"
              name="rating"
              min="0"
              max="10"
              step="0.1"
              value={formData.rating}
              onChange={handleInputChange}
              className="w-full h-3 rounded-full cursor-pointer appearance-none"
              style={{
                background: `linear-gradient(to right, ${sliderColor} 0%, ${sliderColor} ${(formData.rating / 10) * 100}%, #444 ${(formData.rating / 10) * 100}%, #444 100%)`,
              }}
            />
            <div className="absolute top-6 left-0 w-full flex justify-between text-xs text-gray-400 px-1 select-none">
              <span>0</span><span>10</span>
            </div>
          </div>

          <div className="flex gap-3 mb-10">
            {statusOptions.map((option) => {
              const isSelected = formData.status === option.value;
              const IconComponent = statusIcons[option.value];
              const selectedColor = selectedColors[option.value] || "bg-blue-600 shadow-blue-500";
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, status: option.value }))}
                  className={`flex items-center justify-center gap-2 py-2 rounded-full text-white font-medium shadow-md transition flex-grow ${isSelected ? selectedColor : "bg-zinc-700 hover:bg-zinc-600"}`}
                  aria-pressed={isSelected}
                  style={{ minWidth: "0" }}
                >
                  {IconComponent && <IconComponent className="w-5 h-5" />}
                  <span className="text-sm select-none">{option.label}</span>
                </button>
              );
            })}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg border border-white/80 hover:bg-zinc-600 text-zinc-300 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onDelete(entry.game.id)}
              className="px-5 py-2 rounded-lg border border-red-600 hover:bg-red-700 text-red-300 transition"
            >
              Delete
            </button>
            <button
              type="submit"
              disabled={!formData.status}
              className={`px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition disabled:opacity-50`}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
