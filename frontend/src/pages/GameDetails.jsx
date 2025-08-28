import { useEffect, useState, useMemo } from "react";
import Loader from "../components/Loader";
import { useNavigate, useParams } from "react-router-dom";
import ScreenshotCarousel from "../components/ScreenshotCarousel";
import { StarIcon, PlusIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import { CameraIcon, PaintBrushIcon, VideoCameraIcon } from "@heroicons/react/24/outline";
import AddGameModal from "../components/AddGameModal";
import VideoCarousel from "../components/VideoCarousel";
import { fetchGameInfoById, fetchUserList } from "../api";

export default function GameDetails() {
  const navigate = useNavigate();
  const { gameid } = useParams();
  const [game, setGame] = useState(null);
  const [gameList, setGameList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isInList, setIsInList] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    window.scrollTo(0, 0);

    const loadData = async () => {
      try {
        const [gameData, userList] = await Promise.all([
          fetchGameInfoById(gameid),
          fetchUserList(),
        ]);

        if (!isMounted) return;

        setGame(gameData);
        console.log(gameData);
        
        document.title = gameData.name || "Game Details";
        setGameList(userList);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || "Failed to load data");
        navigate("/games");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    if (game && gameList) {
      setIsInList(gameList.some(item => item.gameId == game.id));
    }

    return () => {
      isMounted = false;
    };
  }, [gameid, navigate]);


  const bannerUrl = useMemo(() => {
    if (!game?.screenshotUrls?.length) return null;
    const index = getRandomInt(game.screenshotUrls.length);
    return `https://images.igdb.com/igdb/image/upload/t_1080p/${game.screenshotUrls[index]}.jpg`;
  }, [game?.id]);

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function truncateRating(rating) {
    return Math.round(rating / 10 * 10) / 10;
  }

  const handleAddModalOpen = () => {
    setIsAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
  };

  if (!gameList) return <Loader />;
  if (loading) return <Loader />;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;
  if (!game) return null;

  return (
    <>
      {bannerUrl && (
        <div
          className="relative h-[38rem] w-full bg-center bg-cover"
          style={{ backgroundImage: `url(${bannerUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#09090B80] to-[#09090Bff]" />
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#09090B] to-transparent" />
        </div>
      )}

      <div className="max-w-4xl mx-auto -mt-[28rem] relative z-10 px-4">
        <button onClick={() => navigate(-1)} className="mb-4 text-white-600 hover:underline">
          ← Back
        </button>

        <div className="relative flex flex-col md:flex-row gap-6 bg-white/10 dark:bg-zinc-900/30 backdrop-blur-md border border-white/20 dark:border-white/10 p-6 rounded-xl shadow-lg">
          <img
            src={`https:${game.coverUrl.replace("t_thumb", "t_cover_big")}`}
            alt={game.name}
            className="w-64 h-96 object-cover rounded-md shadow flex-shrink-0"
          />
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-3xl font-bold">{game.name}</h1>
            </div>

            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-600 dark:text-gray-400 mb-0">
                {game.genreNames.join(", ")}
              </p>
              <div className="flex items-center gap-1 text-yellow-500">
                <StarIcon className="w-6 h-6" />
                <span className="text-lg font-semibold">
                  {truncateRating(game.rating).toFixed(1)}
                </span>
              </div>
            </div>

            <p className="font-light mb-20 text-slate-400 whitespace-pre-line">{game.summary}</p>

            {isInList ? (
              <button
                onClick={() => navigate("/list")}
                style={{ position: 'absolute', bottom: 30, right: 30 }}
                className="flex items-center text-white/80 border border-white/80 gap-2 hover:bg-white hover:text-zinc-900 px-5 py-2 rounded-xl transition-colors duration-200 shadow-lg"

                >
                <ArrowRightIcon className="w-4 h-4" />
                View in List
              </button>
              ) : (
              <button
                onClick={handleAddModalOpen}
                style={{ position: 'absolute', bottom: 30, right: 30 }}
                className="flex items-center text-white/80 border border-white/80 gap-2 hover:bg-white hover:text-zinc-900 px-5 py-2 rounded-xl transition-colors duration-200 shadow-lg"

               >
                <PlusIcon className="w-4 h-4" />
                Add Game
              </button>
            )}
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center mb-4">
            <CameraIcon className="w-6 h-6 mr-2 text-gray-400" />
            <h3 className="text-xl font-semibold">Screenshots</h3>
          </div>
          <ScreenshotCarousel screenshots={game.screenshotUrls} />
        </div>

        <div className="mt-8">
          <div className="flex items-center mb-4">
            <VideoCameraIcon className="w-6 h-6 mr-2 text-gray-400" />
            <h3 className="text-xl font-semibold">Videos</h3>
          </div>
          <VideoCarousel videoUrls={game.videoUrls} />
        </div>

        <div className="mt-8">
          <div className="flex items-center mb-4">
            <PaintBrushIcon className="w-6 h-6 mr-2 text-gray-400" />
            <h3 className="text-xl font-semibold">Artworks</h3>
          </div>
          <ScreenshotCarousel screenshots={game.artworkUrls} />
        </div>
      </div>

      <AddGameModal 
        isOpen={isAddModalOpen} 
        onClose={handleAddModalClose} 
        game={game} 
        onGameAdded={() => setIsInList(true)}
      />
    </>
  );
}