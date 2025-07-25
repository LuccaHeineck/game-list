import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ScreenshotCarousel from "../components/ScreenshotCarousel";
import { StarIcon } from "@heroicons/react/24/solid";
import ArtworkCarousel from "../components/ArtworkCarousel";

export default function GameDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state?.game) {
      navigate("/games");
    } else {
      document.title = state.game.name; // Set the tab title to the game's name
    }
  }, [state, navigate]);

  if (!state?.game) return null;

  const { game } = state;

  function truncateRating(rating) {
    const val = rating / 10;
    return Math.floor(val * 100) / 100;
  }

  const bannerUrl = game.screenshotUrls?.[0]
    ? `https://images.igdb.com/igdb/image/upload/t_1080p/${game.screenshotUrls[0]}.jpg`
    : null;

  return (
    <>
      {/* Banner section */}
      {bannerUrl && (
        <div
          className="relative h-[32rem] w-full bg-center bg-cover"
          style={{ backgroundImage: `url(${bannerUrl})` }}
        >
          {/* Smooth fade into #040404 */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#04040480] to-[#040404ff]" />

          {/* Optional extra bottom fade to reinforce transition */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#040404] to-transparent" />
        </div>
      )}

      <div className="max-w-4xl mx-auto -mt-96 relative z-10 px-4">
        <button onClick={() => navigate(-1)} className="mb-4 text-white-600 hover:underline">
          ← Back
        </button>

        <div className="flex flex-col md:flex-row gap-6 bg-white/10 dark:bg-zinc-900/30 backdrop-blur-md border border-white/20 dark:border-white/10 p-6 rounded-xl shadow-lg">
          <img
            src={`https:${game.coverUrl.replace("t_thumb", "t_cover_big")}`}
            alt={game.name}
            className="w-64 h-96 object-cover rounded-md shadow flex-shrink-0"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{game.name}</h1>

            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-600 dark:text-gray-400 mb-0">
                {game.genreNames.join(", ")}
              </p>
              <div className="flex items-center gap-1 text-yellow-500">
                <StarIcon className="w-6 h-6" />
                <span className="text-lg font-semibold">
                  {truncateRating(game.rating).toFixed(2)}
                </span>
              </div>
            </div>

            <p className="font-light text-slate-400 whitespace-pre-line">{game.summary}</p>
          </div>
        </div>

        <div className="mt-8">
          <ScreenshotCarousel screenshots={game.screenshotUrls} />
        </div>

        <div className="mt-8">
          <ArtworkCarousel screenshots={game.artworkUrls} />
        </div>
      </div>
    </>
  );
}
