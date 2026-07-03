import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchModal from "../components/SearchModal";
import QuoteBanner from "../components/QuoteBanner";
import { fetchUserList } from "../api";
import { 
  Gamepad2, 
  Trophy, 
  Star, 
  Plus, 
  Flame, 
  Sparkles, 
  Library, 
  ArrowRight,
  TrendingUp
} from "lucide-react";
import { interpolateColor } from "../config/functions";
import { hasValidSession } from "../config/auth";

export default function Home() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isAuthenticated = hasValidSession();

  useEffect(() => {
    document.title = "Game Library | Dashboard";
    window.scrollTo(0, 0);

    if (!isAuthenticated) {
      setUserList([]);
      setLoading(false);
      return;
    }

    fetchUserList()
      .then((data) => {
        setUserList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch user list", err);
        setUserList([]);
        setLoading(false);
      });
  }, [isAuthenticated]);

  useEffect(() => {
    document.body.style.overflow = isSearchOpen ? "hidden" : "auto";
  }, [isSearchOpen]);

  const handleGameSelect = (game) => {
    try {
      navigate(`/gamedetails/${game.id}`);
      setIsSearchOpen(false);
    } catch (error) {
      console.error("Failed to fetch detailed game info", error);
    }
  };

  // Metrics calculations
  const totalGames = userList.length;
  const currentlyPlaying = userList.filter((item) => item.statusId === 2);
  const finishedGamesCount = userList.filter((item) => item.statusId === 1).length;
  
  const ratedGames = userList.filter((item) => item.rating > 0);
  const avgRating = ratedGames.length > 0 
    ? (ratedGames.reduce((acc, curr) => acc + curr.rating, 0) / ratedGames.length).toFixed(1)
    : "0.0";

  // Get recently added games (reverse list order)
  const recentlyAdded = [...userList].reverse().slice(0, 5);

  return (
    <div className="relative min-h-screen text-white bg-[#09090b]">
      {/* Background Quote Banner */}
      <QuoteBanner />

      {/* Main Content Area */}
      <div className="-mt-[8rem] px-4 md:px-8 max-w-7xl mx-auto pb-24 relative z-20">
        
        {/* Minimalist Premium Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12">
          <div>
            <div className="flex items-center gap-1.5 text-zinc-500 font-semibold tracking-wider text-xs uppercase mb-2 select-none">
                          <Gamepad2 className="w-3.5 h-3.5 text-rose-400" /> Game Library Dashboard
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-none">
              {isAuthenticated ? "Welcome Back" : "Discover Games"}
              <span className="text-rose-500 font-black">.</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm md:text-base text-zinc-500 leading-7">
              {isAuthenticated
                ? "Track your backlog, rate what you finish, and keep your collection organized."
                : "Browse games freely, then sign in when you want to save a personal list."}
            </p>
          </div>
          {isAuthenticated ? (
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-5 py-3 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-white rounded-2xl font-bold transition active:scale-95 shadow-xl shadow-black/40 shrink-0 text-sm"
            >
              <Plus className="w-4 h-4" />
              Add New Game
            </button>
          ) : (
            <Link
              to="/login"
              state={{ from: "/" }}
              className="flex items-center gap-2 px-5 py-3 bg-white text-zinc-950 rounded-2xl font-bold transition hover:bg-zinc-200 active:scale-95 shadow-xl shadow-white/5 shrink-0 text-sm"
            >
              <Plus className="w-4 h-4" />
              Log in to add games
            </Link>
          )}
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Column: Stats & Quick links */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <h2 className="text-xl font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-zinc-500" />
              Your Stats
            </h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              {/* Total Games */}
              <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-5 flex items-center gap-4 hover:border-zinc-800 transition">
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                  <Library className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-zinc-500 text-xs font-semibold block uppercase">Total</span>
                  <span className="text-2xl font-bold text-white">{totalGames}</span>
                </div>
              </div>

              {/* Avg Rating */}
              <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-5 flex items-center gap-4 hover:border-zinc-800 transition">
                <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-400">
                  <Star className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <span className="text-zinc-500 text-xs font-semibold block uppercase">Avg Rating</span>
                  <span className="text-2xl font-bold text-white">{avgRating}</span>
                </div>
              </div>

              {/* Finished */}
              <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-5 flex items-center gap-4 hover:border-zinc-800 transition">
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-zinc-500 text-xs font-semibold block uppercase">Finished</span>
                  <span className="text-2xl font-bold text-white">{finishedGamesCount}</span>
                </div>
              </div>

              {/* Playing */}
              <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-5 flex items-center gap-4 hover:border-zinc-800 transition">
                <div className="p-3 bg-rose-500/10 rounded-xl text-rose-400">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-zinc-500 text-xs font-semibold block uppercase">Playing</span>
                  <span className="text-2xl font-bold text-white">{currentlyPlaying.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Library highlights */}
          <div className="lg:col-span-3 flex flex-col gap-8">
            
            {/* Currently Playing */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-rose-500 fill-current animate-pulse" />
                  Currently Playing
                </h2>
                {currentlyPlaying.length > 0 && (
                  <Link to="/list" className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1 transition">
                    View List <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>

              {currentlyPlaying.length === 0 ? (
                <div className="bg-zinc-900/20 border border-zinc-800/40 border-dashed rounded-2xl p-8 text-center text-zinc-500">
                  <Gamepad2 className="w-10 h-10 mx-auto mb-3 text-zinc-600" />
                  <p className="text-sm font-medium">
                    {isAuthenticated
                      ? "Not playing anything right now."
                      : "Sign in to track what you are playing."}
                  </p>
                  {isAuthenticated ? (
                    <button 
                      onClick={() => setIsSearchOpen(true)}
                      className="mt-2 text-xs font-bold text-zinc-400 hover:text-white transition"
                    >
                      Start a game +
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      state={{ from: "/" }}
                      className="mt-2 inline-flex text-xs font-bold text-zinc-200 hover:text-white transition"
                    >
                      Log in to start tracking
                    </Link>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {currentlyPlaying.slice(0, 4).map((item) => {
                    const ratingColor = interpolateColor(item.rating);
                    return (
                      <div 
                        key={item.game.id}
                        onClick={() => navigate(`/gamedetails/${item.game.id}`)}
                        className="group bg-zinc-900/40 border border-zinc-800/60 rounded-xl overflow-hidden cursor-pointer hover:border-rose-500/50 hover:bg-zinc-900/80 transition duration-300"
                      >
                        <div className="relative aspect-[3/4] overflow-hidden">
                          {item.game.coverUrl ? (
                            <img 
                              src={item.game.coverUrl.replace("t_thumb", "t_cover_big")} 
                              alt={item.game.name}
                              className="w-full h-full object-cover transition duration-500 group-hover:scale-105" 
                            />
                          ) : (
                            <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                              <Gamepad2 className="w-8 h-8 text-zinc-600" />
                            </div>
                          )}
                          {item.rating > 0 && (
                            <div 
                              className="absolute top-2 right-2 text-xs font-extrabold px-2 py-0.5 rounded-full select-none shadow-md backdrop-blur-md"
                              style={{ 
                                color: ratingColor, 
                                backgroundColor: `${ratingColor.replace("rgb", "rgba").replace(")", ", 0.25)")}`,
                                border: `1px solid ${ratingColor}`
                              }}
                            >
                              {item.rating.toFixed(1)}
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <h3 className="font-bold text-sm truncate text-zinc-200 group-hover:text-white transition">
                            {item.game.name}
                          </h3>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recently Added */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  Recently Added
                </h2>
                {totalGames > 0 && (
                  <Link to="/list" className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1 transition">
                    View Entire List <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>

              {recentlyAdded.length === 0 ? (
                <div className="bg-zinc-900/20 border border-zinc-800/40 border-dashed rounded-2xl p-8 text-center text-zinc-500">
                  <Library className="w-10 h-10 mx-auto mb-3 text-zinc-600" />
                  <p className="text-sm font-medium">
                    {isAuthenticated ? "Your library is empty." : "Log in to start building your profile."}
                  </p>
                  <p className="text-xs text-zinc-600 mt-1">
                    {isAuthenticated
                      ? "Add games to start building your profile."
                      : "Your progress will appear here once you sign in."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {recentlyAdded.map((item) => {
                    const ratingColor = interpolateColor(item.rating);
                    return (
                      <div 
                        key={item.game.id}
                        onClick={() => navigate(`/gamedetails/${item.game.id}`)}
                        className="group bg-zinc-900/40 border border-zinc-800/60 rounded-xl overflow-hidden cursor-pointer hover:border-zinc-700 hover:bg-zinc-900/80 transition duration-300"
                      >
                        <div className="relative aspect-[3/4] overflow-hidden">
                          {item.game.coverUrl ? (
                            <img 
                              src={item.game.coverUrl.replace("t_thumb", "t_cover_big")} 
                              alt={item.game.name}
                              className="w-full h-full object-cover transition duration-500 group-hover:scale-105" 
                            />
                          ) : (
                            <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                              <Gamepad2 className="w-8 h-8 text-zinc-600" />
                            </div>
                          )}
                          {item.rating > 0 && (
                            <div 
                              className="absolute top-2 right-2 text-xs font-extrabold px-2 py-0.5 rounded-full select-none shadow-md backdrop-blur-md"
                              style={{ 
                                color: ratingColor, 
                                backgroundColor: `${ratingColor.replace("rgb", "rgba").replace(")", ", 0.25)")}`,
                                border: `1px solid ${ratingColor}`
                              }}
                            >
                              {item.rating.toFixed(1)}
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <h3 className="font-bold text-xs truncate text-zinc-300 group-hover:text-white transition">
                            {item.game.name}
                          </h3>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onGameSelect={handleGameSelect}
      />
    </div>
  );
}
