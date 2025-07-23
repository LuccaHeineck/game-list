import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import ScreenshotCarousel from "../components/ScreenshotCarousel";

export default function GameDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!state?.game) {
      navigate("/games");
    }
  }, [state, navigate]);

  if (!state?.game) return null;

  const { game } = state;
  const total = game.screenshotUrls.length;

  // Scroll handler with index tracking
  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;

    const width = container.offsetWidth;
    const newIndex = Math.max(0, Math.min(
      direction === "left" ? currentIndex - 1 : currentIndex + 1,
      total - 1
    ));
    setCurrentIndex(newIndex);

    container.scrollTo({
      left: newIndex * width,
      behavior: "smooth",
    });
  };

  // Update current index on manual scroll
  const onScroll = () => {
    const container = scrollRef.current;
    const idx = Math.round(container.scrollLeft / container.offsetWidth);
    setCurrentIndex(idx);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <button onClick={() => navigate(-1)} className="mb-4 text-blue-600 hover:underline">
        ← Back
      </button>

      {/* Game info here... */}
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={`https:${game.coverUrl.replace("t_thumb", "t_cover_big")}`}
          alt={game.name}
          className="w-full md:w-64 h-auto object-cover rounded shadow"
        />
        <div>
          <h1 className="text-3xl font-bold mb-2">{game.name}</h1>
          <p className="text-gray-600 mb-2">{game.genreNames.join(", ")}</p>
          <p>{game.summary}</p>
          <p className="text-lg font-semibold mt-2">⭐ {game.rating}</p>
        </div>
      </div>

      <ScreenshotCarousel screenshots={game.screenshotUrls} />
    </div>
  );
}
