// EditGameModal.jsx
import { useState, useEffect } from "react";
import { updateGameInList, fetchStatusList } from "../api";
import toast from "react-hot-toast";
import { STATUSES } from "../config/statuses";
import { interpolateColor } from "../config/functions";
import { X, Star, Trash2, Check } from "lucide-react";

export default function EditGameModal({ isOpen, onClose, onUpdate, entry, onDelete }) {
  const [formData, setFormData] = useState({ rating: 5, status: "" });
  const [statusOptions, setStatusOptions] = useState([]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
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
      if (entry) {
        setFormData({
          rating: entry.rating ?? 5,
          status: entry.statusId ?? "",
        });
      }
    }
  }, [isOpen, entry]);

  if (!isOpen || !entry) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? Number(value) : value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateGameInList({
        ...entry.game,
        rating: formData.rating,
        statusId: formData.status,
      });
      toast.success("Game updated successfully!");

      if (onUpdate) {
        onUpdate({ ...entry.game, rating: formData.rating, statusId: formData.status });
      }

      onClose();
    } catch {
      toast.error("Failed to update game.");
    }
  };

  const sliderColor = interpolateColor(formData.rating);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 transition-all duration-300"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-zinc-900/90 text-white max-w-3xl w-full rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-zinc-800/80 overflow-hidden flex flex-col md:flex-row transition-all duration-300"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-zinc-800/60 hover:bg-zinc-700/80 text-zinc-400 hover:text-white transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Game Cover & Info */}
        <div className="md:w-2/5 bg-zinc-950/40 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-zinc-800/50 relative overflow-hidden">
          {/* Dynamic Background Glow */}
          <div 
            className="absolute inset-0 opacity-10 blur-3xl pointer-events-none transition-all duration-500"
            style={{
              background: `radial-gradient(circle, ${sliderColor} 0%, transparent 70%)`
            }}
          />

          {entry.game.coverUrl && (
            <div className="relative group z-10">
              <img
                src={entry.game.coverUrl.replace("t_thumb", "t_cover_big")}
                alt={`${entry.game.name} cover`}
                className="w-44 h-60 object-cover rounded-2xl transition duration-500 shadow-2xl group-hover:scale-105"
                style={{
                  boxShadow: `0 10px 30px -10px ${sliderColor}`
                }}
              />
            </div>
          )}

          {/* Rating Display */}
          <div className="mt-6 flex flex-col items-center z-10">
            <span className="text-xs uppercase tracking-widest text-zinc-500 font-semibold mb-1">Your Rating</span>
            <div
              className="inline-flex items-center justify-center font-extrabold px-6 py-2 rounded-full text-3xl select-none transition-all duration-300"
              style={{ 
                color: sliderColor, 
                backgroundColor: `${sliderColor.replace("rgb", "rgba").replace(")", ", 0.1)")}`,
                border: `1.5px solid ${sliderColor}`
              }}
            >
              {formData.rating === 0 ? "-" : formData.rating.toFixed(1)}
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-3/5 p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2 leading-tight">
              {entry.game.name}
            </h2>
            <p className="text-zinc-500 text-sm mb-6">Modify your rating and play status below.</p>

            <form onSubmit={handleUpdate} className="flex flex-col gap-6">
              {/* Rating Slider Section */}
              <div className="flex flex-col gap-3">
                <label htmlFor="rating" className="text-sm font-semibold text-zinc-300 flex justify-between items-center">
                  <span>Score</span>
                  <span className="flex items-center gap-1 text-xs" style={{ color: sliderColor }}>
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {formData.rating.toFixed(1)} / 10
                  </span>
                </label>
                <div className="relative pt-2 pb-6">
                  <input
                    type="range"
                    id="rating"
                    name="rating"
                    min="0"
                    max="10"
                    step="0.1"
                    value={formData.rating}
                    onChange={handleInputChange}
                    className="w-full h-2 rounded-full cursor-pointer appearance-none bg-zinc-800 transition"
                    style={{
                      background: `linear-gradient(to right, ${sliderColor} 0%, ${sliderColor} ${
                        (formData.rating / 10) * 100
                      }%, #27272a ${(formData.rating / 10) * 100}%, #27272a 100%)`,
                    }}
                  />
                  <div className="absolute bottom-1 left-0 w-full flex justify-between text-[10px] text-zinc-500 px-0.5 select-none font-medium">
                    <span>0.0 (Worst)</span>
                    <span>5.0</span>
                    <span>10.0 (Masterpiece)</span>
                  </div>
                </div>
              </div>

              {/* Status Buttons Grid */}
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-zinc-300">Status</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {statusOptions.map((option) => {
                    const isSelected = formData.status === option.value;
                    const config = STATUSES[option.value];
                    if (!config) return null;
                    const Icon = config.icon;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, status: option.value }))
                        }
                        className={`relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 border-2 select-none group text-left ${
                          isSelected
                            ? "bg-zinc-800 text-white border-zinc-700"
                            : "bg-zinc-800/40 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 border-transparent"
                        }`}
                        aria-pressed={isSelected}
                      >
                        <div 
                          className={`p-1.5 rounded-lg transition-all duration-200 ${
                            isSelected ? "bg-zinc-700/80 text-white" : "bg-zinc-900/80 text-zinc-500 group-hover:text-zinc-400"
                          }`}
                        >
                          {Icon && <Icon className="w-4 h-4" />}
                        </div>
                        <span className="text-xs font-semibold">{config.name}</span>
                        {isSelected && (
                          <div 
                            className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: config.color.includes("[") ? config.color.match(/#\w+/)?.[0] : "currentColor" }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between border-t border-zinc-800/80 pt-6 mt-2">
                <button
                  type="button"
                  onClick={() => onDelete(entry.game.id)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/20 hover:border-red-500/50 hover:bg-red-500/10 text-red-400 hover:text-red-300 transition text-sm font-semibold"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
                
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl bg-zinc-800/60 hover:bg-zinc-750 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 transition text-sm font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!formData.status}
                    className="px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold transition text-sm disabled:opacity-40 disabled:hover:bg-white flex items-center gap-1.5 shadow-lg shadow-white/5"
                  >
                    <Check className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
