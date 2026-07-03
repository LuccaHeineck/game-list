import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { addGameToList, fetchStatusList } from "../api";
import toast from "react-hot-toast";
import { STATUSES } from "../config/statuses";
import { interpolateColor } from "../config/functions";
import { X, Star, Plus } from "lucide-react";
import { hasValidSession } from "../config/auth";

export default function AddGameModal({ isOpen, onClose, game, onGameAdded }) {
  const [formData, setFormData] = useState({ rating: 5, status: "" });
  const [statusOptions, setStatusOptions] = useState([]);
  const location = useLocation();
  const isAuthenticated = hasValidSession();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    if (!isAuthenticated) {
      setStatusOptions([]);
      return;
    }

    fetchStatusList().then((data) => {
      setStatusOptions(
        data.map((status) => ({
          value: status.statusId,
          label: status.name,
        }))
      );
    });
  }, [isOpen, isAuthenticated]);

  const resetForm = () => {
    setFormData({ rating: 5, status: "" });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) return;

    const userGameData = {
      gameId: game.id,
      gameName: game.name,
      rating: formData.rating ?? null,
      statusId: formData.status,
      userId: localStorage.getItem("userId"),
      completionDate: "",
      createdAt: "",
    };

    try {
      await toast.promise(addGameToList(userGameData), {
        loading: "Adding game...",
        success: <b>Game added successfully!</b>,
        error: <b>Failed to add game. Please try again.</b>,
      });

      onGameAdded?.(userGameData.statusId);
      handleClose();
    } catch {
      // toast handles the visible error state
    }
  };

  if (!isOpen) return null;

  if (!isAuthenticated) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-4 transition-all duration-300 overflow-y-auto"
        onClick={handleClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative bg-zinc-900/90 text-white max-w-3xl w-full rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-zinc-800/80 overflow-hidden flex flex-col md:flex-row transition-all duration-300 max-h-[calc(100vh-1.5rem)] md:max-h-[calc(100vh-2rem)] my-auto p-8"
        >
          <div className="flex flex-col gap-4 w-full">
            <div className="flex items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-500 font-semibold mb-1">Collection</p>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  Log in to add games
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-full bg-zinc-800/60 hover:bg-zinc-700/80 text-zinc-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-zinc-400 leading-7 text-sm sm:text-base pt-2">
              Saving this game to your list requires an account.
            </p>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 rounded-xl bg-zinc-800/60 hover:bg-zinc-750 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 transition text-sm font-semibold"
              >
                Cancel
              </button>
              <Link
                to="/login"
                state={{ from: location.pathname }}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold transition text-sm shadow-lg shadow-white/5 inline-flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const sliderColor = interpolateColor(formData.rating);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-4 transition-all duration-300 overflow-y-auto"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-zinc-900/90 text-white max-w-3xl w-full rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-zinc-800/80 overflow-hidden flex flex-col md:flex-row transition-all duration-300 max-h-[calc(100vh-1.5rem)] md:max-h-[calc(100vh-2rem)] my-auto"
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 md:top-4 md:right-4 p-1.5 rounded-full bg-zinc-800/60 hover:bg-zinc-700/80 text-zinc-400 hover:text-white transition z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="md:w-2/5 bg-zinc-950/40 p-5 sm:p-6 md:p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-zinc-800/50 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10 blur-3xl pointer-events-none transition-all duration-500"
            style={{ background: `radial-gradient(circle, ${sliderColor} 0%, transparent 70%)` }}
          />

          {game.coverUrl && (
            <div className="relative group z-10">
              <img
                src={game.coverUrl.replace("t_thumb", "t_cover_big")}
                alt={`${game.name} cover`}
                className="w-28 h-40 sm:w-36 sm:h-52 md:w-44 md:h-60 object-cover rounded-2xl transition duration-500 shadow-2xl group-hover:scale-105"
                style={{ boxShadow: `0 10px 30px -10px ${sliderColor}` }}
              />
            </div>
          )}

          <div className="mt-6 flex flex-col items-center z-10">
            <span className="text-xs uppercase tracking-widest text-zinc-500 font-semibold mb-1">Your Rating</span>
            <div
              className="inline-flex items-center justify-center font-extrabold px-5 py-2 rounded-full text-2xl sm:text-3xl select-none transition-all duration-300"
              style={{
                color: sliderColor,
                backgroundColor: `${sliderColor.replace("rgb", "rgba").replace(")", ", 0.1)")}`,
                border: `1.5px solid ${sliderColor}`,
              }}
            >
              {formData.rating === 0 ? "-" : formData.rating.toFixed(1)}
            </div>
          </div>
        </div>

        <div className="md:w-3/5 p-4 sm:p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2 leading-tight">
              {game.name}
            </h2>
            <p className="text-zinc-500 text-sm mb-4 sm:mb-6">Add this game to your list and choose a status.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-6">
              <div className="flex flex-col gap-3">
                <label htmlFor="rating" className="text-sm font-semibold text-zinc-300 flex justify-between items-center">
                  <span>Score</span>
                  <span className="flex items-center gap-1 text-xs" style={{ color: sliderColor }}>
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {formData.rating.toFixed(1)} / 10
                  </span>
                </label>
                <div className="relative pt-2 pb-5 sm:pb-6">
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
                      background: `linear-gradient(to right, ${sliderColor} 0%, ${sliderColor} ${(formData.rating / 10) * 100}%, #27272a ${(formData.rating / 10) * 100}%, #27272a 100%)`,
                    }}
                  />
                  <div className="absolute bottom-1 left-0 w-full flex justify-between text-[10px] text-zinc-500 px-0.5 select-none font-medium">
                    <span>0.0 (Worst)</span>
                    <span>5.0</span>
                    <span>10.0 (Masterpiece)</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-zinc-300">Status</span>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
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
                        className={`relative flex items-center gap-2 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 border-2 select-none group text-left min-h-[3rem] ${
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

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-zinc-800/80 pt-5 sm:pt-6 mt-1 sm:mt-2">
                <div className="hidden sm:block" />

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2.5 rounded-xl bg-zinc-800/60 hover:bg-zinc-750 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 transition text-sm font-semibold w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!formData.status}
                    className="px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold transition text-sm disabled:opacity-40 disabled:hover:bg-white flex items-center justify-center gap-1.5 shadow-lg shadow-white/5 w-full sm:w-auto"
                  >
                    <Plus className="w-4 h-4" />
                    Add Game
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
