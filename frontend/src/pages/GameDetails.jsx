import { useEffect, useState, useMemo } from "react";
import Loader from "../components/Loader";
import { useNavigate, useParams, Link } from "react-router-dom";
import ScreenshotCarousel from "../components/ScreenshotCarousel";
import AddGameModal from "../components/AddGameModal";
import VideoCarousel from "../components/VideoCarousel";
import { fetchGameInfoById, fetchUserList } from "../api";
import { STATUSES } from "../config/statuses";
import Game from "../config/Game";
import { interpolateColor } from "../config/functions";
import {
  ArrowLeft,
  Star,
  Plus,
  Check,
  Camera,
  Image as ImageIcon,
  Video,
  Clock,
  Sparkles,
  Gamepad2,
  Calendar,
  Building2,
  Layers
} from "lucide-react";

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

  if (!gameList || loading) return <Loader />;
  if (error) return <div className="text-center mt-24 text-red-500 font-semibold">{error}</div>;
  if (!game) return null;

  return (
    <div className="relative min-h-screen bg-[#09090b] text-white">
      {/* Banner Background */}
      {bannerUrl && (
        <div
          className="relative h-[42rem] w-full bg-center bg-cover select-none"
          style={{ backgroundImage: `url(${bannerUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#09090B95] to-[#09090B]" />
          <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#09090B] to-transparent" />
        </div>
      )}

      {/* Main Details Wrapper */}
      <div className={`max-w-7xl mx-auto px-4 md:px-8 relative z-10 ${bannerUrl ? "-mt-[32rem]" : "pt-24"}`}>

        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition text-xs font-bold mb-6 backdrop-blur-sm select-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>

        {/* Primary Info Card */}
        <div className="relative flex flex-col lg:flex-row gap-8 bg-zinc-950/65 backdrop-blur-md border border-zinc-900 rounded-3xl p-6 md:p-8 shadow-2xl mb-12">

          {/* Cover Art */}
          <img
            src={game.getCoverBig()}
            alt={game.name}
            className="w-full sm:w-64 h-96 object-cover rounded-2xl shadow-2xl border border-zinc-800/50 flex-shrink-0 mx-auto lg:mx-0 select-none"
          />

          {/* Description Block */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              {/* Header Title & Status Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                  {game.name}
                </h1>

                {isInList && gameStatus != null && STATUSES[gameStatus] && (
                  <div
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-md select-none shrink-0 self-start sm:self-auto ${STATUSES[gameStatus].color} text-zinc-950`}
                  >
                    {(() => {
                      const IconComponent = STATUSES[gameStatus].icon;
                      return IconComponent ? <IconComponent className="w-4 h-4" /> : null;
                    })()}
                    <span>{STATUSES[gameStatus].name}</span>
                  </div>
                )}
              </div>

              {/* Game Metadata row */}
              <div className="flex flex-wrap items-center gap-3 text-zinc-500 text-xs font-semibold mb-4">
                {game.getYear() && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {game.getYear()}
                  </span>
                )}
                <span>•</span>
                {game.gameType && (
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" />
                    {game.gameType}
                  </span>
                )}
              </div>

              {/* Genre Badges */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {game.genreNames.map((genre, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-1 bg-zinc-900 border border-zinc-850 text-zinc-400 text-xs font-semibold rounded-full select-none"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {/* Description summary */}
              <p className="font-medium text-zinc-400 leading-relaxed text-sm md:text-base mb-8 whitespace-pre-line text-justify">
                {game.summary}
              </p>
            </div>

            {/* Ratings & Buttons Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-t border-zinc-900 pt-6 gap-6">
              {/* Ratings */}
              <div className="flex gap-6">
                {/* IGDB Rating */}
                <div>
                  <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-1 select-none">IGDB Rating</h3>
                  <div className="inline-flex items-center gap-1 text-white font-extrabold text-lg select-none">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    {(game.getFormattedRating()).toFixed(1)} <span className="text-zinc-650 text-xs font-normal">/ 10</span>
                  </div>
                </div>

                {/* Your Rating */}
                {userRating !== null && userRating > 0 && (
                  <div>
                    <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-1 select-none">Your Rating</h3>
                    <div
                      className="inline-flex items-center gap-1 font-extrabold text-lg select-none"
                      style={{ color: interpolateColor(userRating) }}
                    >
                      <Star className="w-5 h-5 fill-current" />
                      {(userRating).toFixed(1)} <span className="text-zinc-650 text-xs font-normal">/ 10</span>
                    </div>
                  </div>
                )}
              </div>

              {/* List Actions */}
              <div>
                {isInList ? (
                  <Link
                    to="/list"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-white rounded-2xl font-bold transition active:scale-95 text-sm"
                  >
                    <Check className="w-4 h-4 text-rose-400" />
                    View in List
                  </Link>
                ) : (
                  <button
                    onClick={handleAddModalOpen}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-zinc-950 rounded-2xl font-bold transition hover:bg-zinc-200 active:scale-95 shadow-xl shadow-white/5 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Game
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Row 1: Screenshots + Platforms, Publishers, Developers */}
        <div className="flex flex-col lg:flex-row items-center gap-8 mb-16">
          <div className="flex-2 lg:max-w-[70%] w-full">
            <div className="flex items-center gap-2 mb-4 select-none">
              <Camera className="w-5 h-5 text-zinc-500" />
              <h3 className="text-xl font-extrabold text-white tracking-tight">Screenshots</h3>
            </div>
            <ScreenshotCarousel screenshots={game.screenshotUrls} />
          </div>

          <div className="flex-1 w-full space-y-6">
            {game.platforms?.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-zinc-400 mb-3 uppercase tracking-wider select-none">Platforms</h3>
                <div className="flex flex-wrap gap-1.5">
                  {game.platforms.map((platform, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 bg-zinc-905 border border-zinc-850 text-zinc-400 text-xs font-semibold rounded-lg select-none"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {game.developers?.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-zinc-500 mb-1 uppercase tracking-wider select-none">Developers</h3>
                <p className="text-zinc-300 text-sm font-semibold">{game.developers.join(", ")}</p>
              </div>
            )}

            {game.publishers?.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-zinc-500 mb-1 uppercase tracking-wider select-none">Publishers</h3>
                <p className="text-zinc-300 text-sm font-semibold">{game.publishers.join(", ")}</p>
              </div>
            )}
          </div>
        </div>

        {/* Row 2: HLTB + Videos */}
        <div className="flex flex-col lg:flex-row items-center gap-8 mb-16">
          {game.hltb && (
            <div className="flex-1 w-full flex justify-center">
              <div className="inline-flex flex-col w-full max-w-sm p-6 bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-sm rounded-2xl shadow-lg">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-800/50 select-none justify-center">
                  <Clock className="w-5 h-5 text-rose-400" />
                  <h3 className="text-lg font-bold text-white tracking-tight">How Long To Beat</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 text-xs font-semibold uppercase">Main Story</span>
                    <span className="text-white text-sm font-bold">{game.formatHLTB(game.hltb.hastily)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 text-xs font-semibold uppercase">Main + Extra</span>
                    <span className="text-white text-sm font-bold">{game.formatHLTB(game.hltb.normally)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 text-xs font-semibold uppercase">Completionist</span>
                    <span className="text-white text-sm font-bold">{game.formatHLTB(game.hltb.completely)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex-2 lg:max-w-[70%] w-full">
            <div className="flex items-center gap-2 mb-4 select-none">
              <Video className="w-5 h-5 text-zinc-500" />
              <h3 className="text-xl font-extrabold text-white tracking-tight">Videos</h3>
            </div>
            <VideoCarousel videoUrls={game.videoUrls} />
          </div>
        </div>

        {/* Row 3: Artworks + Storyline */}
        <div className="flex flex-col lg:flex-row items-start gap-8">
          <div className="flex-2 lg:max-w-[70%] w-full">
            <div className="flex items-center gap-2 mb-4 select-none">
              <ImageIcon className="w-5 h-5 text-zinc-500" />
              <h3 className="text-xl font-extrabold text-white tracking-tight">Artworks</h3>
            </div>
            <ScreenshotCarousel screenshots={game.artworkUrls} />
          </div>

          <div className="flex-1 w-full">
            {game.storyline && (
              <div>
                <div className="flex items-center gap-2 mb-3 select-none">
                  <Gamepad2 className="w-4 h-4 text-rose-400" />
                  <h3 className="text-lg font-bold text-white tracking-tight">Storyline</h3>
                </div>
                <p className="text-zinc-400 text-xs md:text-sm leading-relaxed text-justify whitespace-pre-line">
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
    </div>
  );
}
