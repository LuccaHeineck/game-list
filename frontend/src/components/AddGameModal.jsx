// AddGameModal.jsx
import { useState, useEffect } from "react";
import { addGameToList, fetchStatusList } from "../api";
import toast from "react-hot-toast";
import { STATUSES } from "../config/statuses";

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

export default function AddGameModal({ isOpen, onClose, game, onGameAdded }) {
  const [formData, setFormData] = useState({ rating: 5, status: "" });
  const [statusOptions, setStatusOptions] = useState([]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      fetchStatusList().then((data) =>
        setStatusOptions(
          data.map((status) => ({
            value: status.statusId,
            label: status.name,
          }))
        )
      );
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === "rating" ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userGameData = {
      gameId: game.id,
      gameName: game.name,
      rating: formData.rating ?? null,
      statusId: formData.status,
      userId: localStorage.getItem("userId"),
      completionDate: "",
      createdAt: "",
    };

    
    toast.promise(addGameToList(userGameData), {
      loading: "Adding game...",
      success: <b>Game added successfully!</b>,
      error: <b>Failed to add game. Please try again.</b>,
    });
    onGameAdded?.();
    onClose();
    setFormData({ rating: 5, status: "" });
  };

  const handleClose = () => {
    setFormData({ rating: 5, status: "" });
    onClose();
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
          {game.coverUrl && (
            <img
              src={game.coverUrl.replace("t_thumb", "t_cover_big")}
              alt={`${game.name} cover`}
              className="w-40 h-56 object-cover rounded-xl shadow-lg flex-shrink-0"
            />
          )}
          <div className="flex flex-col justify-center">
            <h2 className="text-5xl font-extrabold leading-tight">{game.name}</h2>
            <div
              className="mt-3 inline-flex items-center justify-center font-extrabold px-6 py-3 rounded-full text-4xl select-none drop-shadow-lg max-w-max"
              style={{ color: sliderColor, border: `3px solid ${sliderColor}` }}
            >
              {formData.rating.toFixed(1)}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-8 flex-grow overflow-auto">
          {/* Rating Slider */}
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
                background: `linear-gradient(to right, ${sliderColor} 0%, ${sliderColor} ${(formData.rating / 10) *
                  100}%, #444 ${(formData.rating / 10) * 100}%, #444 100%)`,
              }}
            />
            <div className="absolute top-6 left-0 w-full flex justify-between text-xs text-gray-400 px-1 select-none">
              <span>0</span>
              <span>10</span>
            </div>
          </div>

          {/* Status Buttons */}
          <div className="flex gap-3 mb-10">
            {statusOptions.map((option) => {
              const isSelected = formData.status === option.value;
              const config = STATUSES[option.value];
              if (!config) return null;
              const Icon = config.icon;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, status: option.value }))}
                  className={`flex items-center justify-center gap-2 py-2 rounded-full font-medium shadow-md transition flex-grow ${
                    isSelected
                      ? `${config.color} text-zinc-900`
                      : "bg-zinc-700 hover:bg-zinc-600"
                  }`}
                  aria-pressed={isSelected}
                  style={{ minWidth: "0" }}
                >
                  {Icon && <Icon className="w-5 h-5" />}
                  <span className="text-sm select-none">{config.name}</span>
                </button>
              );
            })}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2 rounded-lg border border-white/80 hover:bg-zinc-600 text-zinc-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.status}
              className={`px-5 py-2 rounded-lg text-black font-semibold transition shadow-lg ${
                formData.status
                  ? "bg-white/90 hover:bg-white"
                  : "bg-white/50 cursor-not-allowed"
              }`}
            >
              Add Game
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
