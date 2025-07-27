import { useEffect, useState, useMemo } from "react";
import Loader from "../components/Loader"; 
import { useNavigate, useParams } from "react-router-dom";
import ScreenshotCarousel from "../components/ScreenshotCarousel";
import { StarIcon } from "@heroicons/react/24/solid";
import ArtworkCarousel from "../components/ArtworkCarousel";
import { fetchGameInfoById } from "../api";

export default function GameDetails() {
  const navigate = useNavigate();
  const { gameid } = useParams();

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true); // sempre inicia carregando
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    window.scrollTo(0, 0);

    fetchGameInfoById(gameid)
      .then((data) => {
        setGame(data);
        document.title = data.name || "Game Details";
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load game");
        setLoading(false);
        navigate("/games");
      });
  }, [gameid, navigate]);

  const bannerUrl = useMemo(() => {
    if (!game?.screenshotUrls?.length) return null;
    const index = getRandomInt(game.screenshotUrls.length);
    return `https://images.igdb.com/igdb/image/upload/t_1080p/${game.screenshotUrls[index]}.jpg`;
  }, [game?.id]);

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  if (loading) return <Loader />;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;
  if (!game) return null;

  function truncateRating(rating) {
    const val = rating / 10;
    return Math.floor(val * 100) / 100;
  }

  return (
    <>
      {bannerUrl && (
        <div
          className="relative h-[32rem] w-full bg-center bg-cover"
          style={{ backgroundImage: `url(${bannerUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#04040480] to-[#040404ff]" />
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
