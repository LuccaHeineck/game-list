import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchGamesByGenre } from "../api";
import { Calendar, Sparkles, Gamepad2 } from "lucide-react";

const genres = [
  { id: 32, name: "Indie" },
  { id: 12, name: "RPG" },
  { id: 31, name: "Adventure" },
  { id: 15, name: "Strategy" },
  { id: 9, name: "Puzzle" },
  { id: 8, name: "Platform" },
  { id: 5, name: "Shooter" },
  { id: 10, name: "Racing" },
];

const CACHE_KEY = "gamesByGenreCache";
const CACHE_DURATION = 1000 * 60 * 60 * 12; // 12 hours

// Skeleton component for a premium loading state
function GenreSkeleton() {
  return (
    <div className="flex gap-4 w-max pb-2 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div 
          key={i} 
          className="w-48 flex-shrink-0 bg-zinc-900/40 border border-zinc-800/40 rounded-2xl overflow-hidden"
        >
          <div className="w-full aspect-[3/4] bg-zinc-800/60" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-zinc-800/80 rounded-md w-4/5" />
            <div className="h-3 bg-zinc-800/40 rounded-md w-3/5" />
            <div className="h-3 bg-zinc-800/40 rounded-md w-2/5 pt-1" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AllGames() {
  const [gamesByGenre, setGamesByGenre] = useState({});
  const [error, setError] = useState(null);
  const [loadedGenres, setLoadedGenres] = useState({});
  const navigate = useNavigate();

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    document.title = "Discover Games";

    const cachedData = JSON.parse(localStorage.getItem(CACHE_KEY)) || {};
    const now = Date.now();

    async function fetchWithDelay(index) {
      if (index >= genres.length) return;

      const { id } = genres[index];

      // Use cached if available and fresh
      if (cachedData[id] && now - cachedData[id].timestamp < CACHE_DURATION) {
        setGamesByGenre((prev) => ({ ...prev, [id]: cachedData[id].games }));
        setLoadedGenres((prev) => ({ ...prev, [id]: true }));
        fetchWithDelay(index + 1);
        return;
      }

      try {
        const games = await fetchGamesByGenre(id);

        // Save to state and cache
        setGamesByGenre((prev) => ({ ...prev, [id]: games }));
        setLoadedGenres((prev) => ({ ...prev, [id]: true }));

        // Update cache
        const updatedCache = {
          ...cachedData,
          [id]: { games, timestamp: Date.now() },
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(updatedCache));
      } catch (err) {
        setError(err.message);
      } finally {
        // Wait 300ms before next request
        setTimeout(() => fetchWithDelay(index + 1), 300);
      }
    }

    fetchWithDelay(0);
  }, [navigate]);

  if (error) return <div className="text-center text-red-500 mt-24 font-semibold">Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto pt-24 pb-24 px-4 md:px-8 bg-[#09090b]">
      
      {/* Header section */}
      <div className="flex flex-col items-center justify-center text-center mb-16 select-none">
        <div className="flex items-center gap-1.5 text-zinc-500 font-semibold tracking-wider text-xs uppercase mb-2">
          <Gamepad2 className="w-3.5 h-3.5 text-rose-400" /> Explore Database
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-none mb-4">
          Discover Games<span className="text-rose-500 font-black">.</span>
        </h1>
        <p className="text-zinc-500 text-sm md:text-base max-w-md">
          Browse popular titles by genre and find your next favorite gaming experience.
        </p>
      </div>

      {genres.map(({ id, name }) => (
        <div key={id} className="mb-14">
          
          {/* Genre Row Header */}
          <div className="flex items-center gap-2.5 mb-5 select-none">
            <div className="w-1.5 h-6 bg-rose-500 rounded-full shadow-[0_0_8px_#fb7185]" />
            <h2 className="text-2xl font-extrabold text-white tracking-tight">{name}</h2>
          </div>

          {!loadedGenres[id] ? (
            <div className="overflow-x-auto scrollbar-hide py-2">
              <GenreSkeleton />
            </div>
          ) : (
            <div
              className="relative overflow-x-auto overflow-y-hidden scrollbar-hide py-2"
              onMouseDown={(e) => {
                const container = e.currentTarget;
                setIsDragging(false);
                setStartX(e.pageX - container.offsetLeft);
                setScrollLeft(container.scrollLeft);
                container.dataset.dragging = "true";
              }}
              onMouseMove={(e) => {
                const container = e.currentTarget;
                if (container.dataset.dragging !== "true") return;

                const x = e.pageX - container.offsetLeft;
                const distance = x - startX;

                if (Math.abs(distance) > 5) setIsDragging(true);

                container.scrollLeft = scrollLeft - distance;	
              }}
              onMouseUp={(e) => {
                e.currentTarget.dataset.dragging = "false";
                setTimeout(() => setIsDragging(false), 0);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.dataset.dragging = "false";
              }}
            >
              <div className="flex gap-4 w-max pb-3">
                {gamesByGenre[id]?.map((game) => (
                  <div
                    key={game.id}
                    onClick={() => {
                      if (!isDragging) {
                        navigate(`/gamedetails/${game.id}`, { state: { game } });
                      }
                    }}
                    className="w-48 flex-shrink-0 cursor-pointer bg-zinc-900/30 border border-zinc-800/60 rounded-2xl overflow-hidden shadow-lg hover:border-zinc-700/80 hover:bg-zinc-900/60 transition duration-300 group"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden">
                      {game.cover?.url ? (
                        <img
                          draggable={false}
                          src={`https:${game.cover.url.replace("t_thumb", "t_cover_big")}`}
                          alt={game.name}
                          className="w-full h-full object-cover select-none transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                          <Gamepad2 className="w-8 h-8 text-zinc-650" />
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 flex flex-col justify-between h-28 select-none">
                      <div>
                        <h3 className="text-sm text-zinc-200 group-hover:text-white font-bold line-clamp-2 transition leading-tight mb-1">
                          {game.name}
                        </h3>
                        <p className="text-[10px] font-semibold text-zinc-500 tracking-wide uppercase line-clamp-1">
                          {game.genres?.map(g => g.name).join(" • ") || ""}
                        </p>
                      </div>
                      
                      {game.first_release_date && !isNaN(new Date(game.first_release_date * 1000).getFullYear()) && (
                        <div className="flex items-center gap-1.5 text-zinc-500 font-medium text-xs mt-1">
                          <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                          <span>
                            {new Date(game.first_release_date * 1000).getFullYear()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
