import { useEffect, useState } from "react";
import { fetchGamesByName } from "../api";
import { X, Search, Gamepad2, Sparkles, AlertCircle } from "lucide-react";

export default function SearchModal({ isOpen, onClose, onGameSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (query.trim().length > 1) {
      setSearching(true);
      const delayDebounce = setTimeout(async () => {
        try {
          const data = await fetchGamesByName(query);
          setResults(data);
        } catch (err) {
          console.error(err);
        } finally {
          setSearching(false);
        }
      }, 400);
      return () => clearTimeout(delayDebounce);
    } else {
      setResults([]);
      setSearching(false);
    }
  }, [query]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target.id === "modal-overlay") {
      onClose();
    }
  };

  return (
    <div
      id="modal-overlay"
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 transition-all duration-300"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-zinc-900/95 text-white w-full max-w-2xl h-[550px] p-6 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-zinc-800/80 overflow-hidden flex flex-col transition-all duration-300"
      >
        {/* Search header & Input */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 group">
            <input
              type="text"
              className="w-full py-3.5 pr-12 pl-11 bg-zinc-950/60 border border-zinc-800 focus:border-rose-500/50 rounded-2xl text-white placeholder-zinc-500 focus:outline-none transition-all duration-200"
              placeholder="Search database for a game..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <Search className="w-5 h-5 text-zinc-500 group-focus-within:text-rose-400 absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-200 pointer-events-none" />
            {searching && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white bg-zinc-800/50 hover:bg-zinc-800 p-3 rounded-2xl border border-zinc-800/80 transition active:scale-95"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results / Empty state area */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
          {query.trim().length <= 1 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 select-none py-10">
              <div className="p-4 bg-zinc-950/40 rounded-full mb-4 border border-zinc-800/50">
                <Gamepad2 className="w-12 h-12 text-zinc-650" />
              </div>
              <h3 className="text-zinc-300 font-bold text-lg mb-1">Search Your Next Game</h3>
              <p className="text-sm text-zinc-500 max-w-xs">
                Type the name of any game to find it in the IGDB database and add it to your library.
              </p>
            </div>
          ) : results.length === 0 && !searching ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 select-none py-10">
              <div className="p-4 bg-zinc-950/40 rounded-full mb-4 border border-zinc-800/50">
                <AlertCircle className="w-10 h-10 text-zinc-650" />
              </div>
              <h3 className="text-zinc-300 font-bold text-lg mb-1">No Games Found</h3>
              <p className="text-sm text-zinc-500 max-w-xs">
                We couldn't find any games matching <span className="text-rose-400 font-semibold">"{query}"</span>. Try adjusting your spelling.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {results.map((game) => (
                <div
                  key={game.id}
                  onClick={() => {
                    onGameSelect(game);
                    onClose();
                  }}
                  className="p-3 rounded-2xl bg-zinc-950/20 hover:bg-zinc-800/50 border border-zinc-800/20 hover:border-zinc-700/50 cursor-pointer flex items-center justify-between transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-4">
                    {game.cover?.url ? (
                      <img
                        src={`https:${game.cover.url}`}
                        alt={`${game.name} cover`}
                        className="w-11 h-15 object-cover rounded-xl shadow-md flex-shrink-0"
                      />
                    ) : (
                      <div className="w-11 h-15 bg-zinc-800 flex items-center justify-center rounded-xl flex-shrink-0">
                        <Gamepad2 className="w-5 h-5 text-zinc-600" />
                      </div>
                    )}
                    <div className="flex flex-col text-left">
                      <p className="font-bold text-sm text-zinc-200 group-hover:text-white transition line-clamp-1">
                        {game.name}
                      </p>
                      
                      <div className="flex items-center flex-wrap gap-1.5 mt-2">
                        {game.first_release_date && (
                          <span className="text-[10px] bg-zinc-850 px-2 py-0.5 rounded-full text-zinc-400 font-semibold border border-zinc-800/50">
                            {new Date(game.first_release_date * 1000).getFullYear()}
                          </span>
                        )}
                        {game.genres && game.genres.slice(0, 2).map((genre) => (
                          <span 
                            key={genre.id} 
                            className="text-[10px] bg-rose-500/10 px-2 py-0.5 rounded-full text-rose-400 font-semibold border border-rose-500/10"
                          >
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition duration-200 pr-2">
                    <Sparkles className="w-4 h-4 text-rose-400" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
