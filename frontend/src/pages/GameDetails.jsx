import { useEffect, useState, useMemo, React } from "react";
import Loader from "../components/Loader";
import { useNavigate, useParams } from "react-router-dom";
import ScreenshotCarousel from "../components/ScreenshotCarousel";
import { StarIcon, PlusIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import { CameraIcon, PaintBrushIcon, VideoCameraIcon } from "@heroicons/react/24/outline";
import AddGameModal from "../components/AddGameModal";
import VideoCarousel from "../components/VideoCarousel";
import { fetchGameInfoById, fetchUserList } from "../api";
import { STATUSES } from "../config/statuses";
import Game from "../config/Game"; // sua classe Game
import { interpolateColor } from "../config/functions";

export default function GameDetails() {
  const navigate = useNavigate();
  const { gameid } = useParams();
  const [game, setGame] = useState(null);
  const [gameList, setGameList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isInList, setIsInList] = useState(false);
  const [gameStatus, setGameStatus] = useState(null);
  const [userRating, setuserRating] = useState(null);

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

        const parsedGame = new Game(gameData);
        setGame(parsedGame);

        document.title = parsedGame.name || "Game Details";
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

    return () => {
      isMounted = false;
    };
  }, [gameid, navigate]);

  useEffect(() => {
    if (!game || !gameList) return;

    const entry = gameList.find(item => item.gameId == game.id);
    if (entry) {
      setIsInList(true);
      setuserRating(entry.rating);
      setGameStatus(entry.statusId);
    } else {
      setIsInList(false);
      setuserRating(null);
      setGameStatus(null);
    }
  }, [game, gameList]);

  const bannerUrl = useMemo(() => game?.getRandomScreenshot("t_1080p"), [game?.id]);

  const handleAddModalOpen = () => setIsAddModalOpen(true);
  const handleAddModalClose = () => setIsAddModalOpen(false);

  const handleGameAdded = (newStatusId) => {
    setIsInList(true);
    setGameStatus(newStatusId);
    handleAddModalClose();
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

      <div className="max-w-5xl mx-auto -mt-[28rem] relative z-10 px-4">
        <button onClick={() => navigate(-1)} className="mb-4 text-white-600 hover:underline">
          ← Back
        </button>

        <div className="relative flex flex-col md:flex-row gap-6 bg-white/10 dark:bg-zinc-900/30 backdrop-blur-md border border-white/20 dark:border-white/10 p-6 rounded-xl shadow-lg">
          <img
            src={game.getCoverBig()}
            alt={game.name}
            className="w-64 h-96 object-cover rounded-md shadow-lg shadow-black flex-shrink-0"
          />
          <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">{game.name}</h1>

                {isInList && gameStatus != null && STATUSES[gameStatus] && (
                  <div
                    className={`flex items-center gap-2 px-4 py-1 rounded-full text-sm font-semibold ${STATUSES[gameStatus].color}`}
                  >
                    <div className="flex items-center gap-2">
                      {(() => {
                        const IconComponent = STATUSES[gameStatus].icon;
                        return IconComponent ? <IconComponent className="w-4 h-4 text-zinc-900" /> : null;
                      })()}
                      <span className="text-zinc-900">{STATUSES[gameStatus].name}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start mb-3 mt-2" id="info-and-ratings">
              <div id="info-and-genres" className="flex-1">
                <div className="flex items-center text-zinc-400 text-sm mb-4">
                  {game.getYear() && (
                    <span className="mr-2">
                      {game.getYear()}
                    </span>
                  )}
                  <p>|</p>
                  {game.gameType && (
                    <span className="ml-2">
                      {game.gameType}
                    </span>
                  )}
                </div>
                {/* Gêneros como badges */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {game.genreNames.map((genre, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-zinc-800 text-zinc-300 text-xs rounded-full"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
              

              {/* Rating */}
              <div className="flex items-start gap-4">
                {/* IGDB Rating */}
                <div className="flex flex-col items-center">
                  <h3 className="text-sm">IGDB Rating</h3>
                  <div className="inline-flex items-center justify-center font-extrabold px-4 py-1 rounded-full text-xl drop-shadow-lg max-w-max">
                    <StarIcon className="w-6 h-6 mr-1" />
                    {(game.getFormattedRating()).toFixed(1)}
                  </div>
                </div>

                {/* Your Rating */}
                {userRating !== null && (
                  <div className="flex flex-col items-center">
                    <h3
                      className="text-sm"
                      style={{
                        color: userRating !== null ? interpolateColor(userRating) : "#aaa",
                      }}
                    >
                      Your Rating
                    </h3>
                    <div
                      className="inline-flex items-center justify-center font-extrabold px-4 py-1 rounded-full text-xl drop-shadow-lg max-w-max"
                      style={{
                        color: userRating !== null ? interpolateColor(userRating) : "#aaa",
                      }}
                    >
                      <StarIcon className="w-6 h-6 mr-1" />
                      {(userRating).toFixed(1)}
                    </div>
                  </div>
                )}
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
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-32 pb-16">
        {/* Screenshots + Extra game info */}
        <div className="mt-8 flex items-center mb-32">
          {/* Screenshots */}
          <div className="mr-8 flex-2 max-w-[70%]">
            <div className="flex items-center mb-4">
              <CameraIcon className="w-6 h-6 mr-2 text-gray-400" />
              <h3 className="text-xl font-semibold">Screenshots</h3>
            </div>
            <ScreenshotCarousel screenshots={game.screenshotUrls} />
          </div>

          {/* Extra Info: platforms, publishers, developers */}
          <div className="flex-1">
            {game.platforms.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Platforms</h3>
                <div className="flex flex-wrap gap-2">
                  {game.platforms.map((platform, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-zinc-800 text-zinc-300 text-sm rounded-full"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {game.publishers.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Publishers</h3>
                <p className="text-zinc-300 text-sm">{game.publishers.join(", ")}</p>
              </div>
            )}

            {game.developers.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Developers</h3>
                <p className="text-zinc-300 text-sm">{game.developers.join(", ")}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6 mb-32">
        {/* HLTB */}
        {game.hltb && (
          <div className="flex-1 flex justify-center">
            <div className="inline-flex flex-col items-center p-8 bg-white/10 dark:bg-zinc-900/30 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-center">How Long To Beat</h3>
              <div className="flex flex-col gap-4 items-center">
                <div className="flex flex-col items-center">
                  <span className="font-bold text-zinc-400">Hastily</span>
                  <span className="text-zinc-200 text-3xl font-semibold">{game.formatHLTB(game.hltb.hastily)}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-bold text-zinc-400">Normally</span>
                  <span className="text-zinc-200 text-3xl font-semibold">{game.formatHLTB(game.hltb.normally)}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-bold text-zinc-400">Completely</span>
                  <span className="text-zinc-200 text-3xl font-semibold">{game.formatHLTB(game.hltb.completely)}</span>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Videos */}
        <div className="flex-[2] max-w-[70%]">
          <div className="flex items-center mb-4">
            <VideoCameraIcon className="w-6 h-6 mr-2 text-gray-400" />
            <h3 className="text-xl font-semibold">Videos</h3>
          </div>
          <VideoCarousel videoUrls={game.videoUrls} />
        </div>
      </div>

      {/* Artworks + Storyline */}
        <div className="mt-8 flex items-center">
          {/* Screenshots */}
          <div className="mr-8 flex-2 max-w-[70%]">
            <div className="flex items-center mb-4">
              <PaintBrushIcon className="w-6 h-6 mr-2 text-gray-400" />
              <h3 className="text-xl font-semibold">Artworks</h3>
            </div>
            <ScreenshotCarousel screenshots={game.artworkUrls} />
          </div>

          {/* Extra Info: platforms, publishers, developers */}
          <div className="flex-1">
            {game.storyline && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Storyline</h3>
                <p className="text-zinc-300 text-sm whitespace-pre-line text-justify indent-6 leading-relaxed">
                  {game.storyline}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AddGameModal 
        isOpen={isAddModalOpen} 
        onClose={handleAddModalClose} 
        game={game} 
        onGameAdded={handleGameAdded}
      />
    </>
  );
}
