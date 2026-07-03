import { useEffect, useState, useMemo } from "react";
import { fetchUserList, deleteGameFromList } from "../api";
import { STATUSES } from "../config/statuses";
import {
  Calendar,
  ArrowUp,
  ArrowDown,
  AlignLeft,
  Star,
  Search,
  Sparkles,
  Gamepad2,
  AlertCircle
} from "lucide-react";
import Loader from "../components/Loader";
import GameRow from "../components/GameRow";
import EditGameModal from "../components/EditGameModal";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { hasValidSession } from "../config/auth";

function SortIcon({ field, currentSort, currentOrder }) {
  const isActive = currentSort === field;
  return (
    <div className="relative flex items-center gap-1.5 cursor-pointer select-none px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 transition text-xs font-semibold">
      {field === "completionDate" && <Calendar className="w-4 h-4" />}
      {field === "name" && <AlignLeft className="w-4 h-4" />}
      {field === "rating" && <Star className="w-4 h-4" />}
      <span className="capitalize">{field === "completionDate" ? "Date" : field}</span>
      {isActive && (
        <span className="text-rose-400 ml-0.5">
          {currentOrder === "asc" ? (
            <ArrowUp className="w-3.5 h-3.5" />
          ) : (
            <ArrowDown className="w-3.5 h-3.5" />
          )}
        </span>
      )}
    </div>
  );
}

export default function GameList() {
  const [games, setGames] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(0); // 0 = All
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("completionDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [modalGame, setModalGame] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDeleteGame, setConfirmDeleteGame] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = hasValidSession();

  const statuses = useMemo(() => {
    const statList = Object.entries(STATUSES).map(([id, config]) => ({
      statusId: Number(id),
      name: config.name,
    }));
    return statList.some(s => s.statusId === 0)
      ? statList
      : [{ statusId: 0, name: "All" }, ...statList];
  }, []);

  useEffect(() => {
    document.title = "My Library";
    setLoading(true);
    setError(null);

    if (!isAuthenticated) {
      setGames([]);
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const gamesData = await fetchUserList();
        setGames(gamesData);
      } catch (err) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
    window.scrollTo(0, 0);
  }, [isAuthenticated]);

  const handleDeleteClick = (game) => {
    setConfirmDeleteGame(game);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!confirmDeleteGame) return;

    try {
      await deleteGameFromList(confirmDeleteGame.id);
      setGames((prevGames) =>
        prevGames.filter((entry) => entry.game.id !== confirmDeleteGame.id)
      );
      setConfirmDeleteGame(null);
      setIsConfirmOpen(false);
      setModalGame(null);
      toast.success("Game deleted successfully!");
    } catch (error) {
      console.error(error);
      setIsConfirmOpen(false);
      toast.error("Failed to delete game.");
    }
  };
  
  const handleGameUpdate = (updatedGame) => {
    setGames((prevGames) =>
      prevGames.map((entry) =>
      entry.game.id === updatedGame.id
        ? { ...entry, game: { ...entry.game, ...updatedGame }, statusId: updatedGame.statusId, rating: updatedGame.rating }
        : entry
      )
    );
  };

  function onSortClick(field) {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  }

  const filteredGames = useMemo(() => {
    let filtered = games.filter((g) =>
      g.game.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedStatus !== 0) {
      filtered = filtered.filter((g) => g.statusId === selectedStatus);
    }

    const compareFuncs = {
      completionDate: (a, b) =>
        new Date(a.completionDate || 0) - new Date(b.completionDate || 0),
      name: (a, b) => a.game.name.localeCompare(b.game.name),
      rating: (a, b) => (a.rating ?? -1) - (b.rating ?? -1),
    };

    filtered.sort(compareFuncs[sortBy]);
    if (sortOrder === "desc") filtered.reverse();

    return filtered;
  }, [games, searchTerm, selectedStatus, sortBy, sortOrder]);

  const statusCounts = useMemo(() => {
    const counts = {};
    statuses.forEach((s) => { counts[s.statusId] = 0; });
    games.forEach((g) => { counts[g.statusId] = (counts[g.statusId] ?? 0) + 1; });
    counts[0] = games.length; // All
    return counts;
  }, [games, statuses]);

  if (loading) return <Loader />;
  if (error) return <div className="text-center mt-24 text-red-500 font-semibold">{error}</div>;

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 md:px-8 pt-24 pb-24 min-h-screen bg-[#09090b] text-white">
        <div className="mb-10 select-none">
          <div className="flex items-center gap-1.5 text-zinc-500 font-semibold tracking-wider text-xs uppercase mb-2">
            <Gamepad2 className="w-3.5 h-3.5 text-rose-400" /> Personal Library
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-none">
            My Collection<span className="text-rose-500 font-black">.</span>
          </h1>
        </div>

        <div className="bg-zinc-900/45 border border-zinc-800/70 rounded-3xl p-8 md:p-10 shadow-2xl shadow-black/30 backdrop-blur-md">
          <p className="text-lg md:text-xl font-semibold text-white leading-8">
            Log in to start adding games to your list.
          </p>
          <p className="mt-3 text-zinc-400 leading-7 max-w-2xl">
            Your collection, ratings, and completion status will show up here once you sign in.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/login"
              state={{ from: "/list" }}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-zinc-950 font-bold transition hover:bg-zinc-200 active:scale-95"
            >
              Log in
            </Link>
            <Link
              to="/games"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white font-bold transition hover:bg-zinc-850 active:scale-95"
            >
              Browse games
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-24 min-h-screen bg-[#09090b]">
      
      {/* Page Header */}
      <div className="mb-10 select-none">
        <div className="flex items-center gap-1.5 text-zinc-500 font-semibold tracking-wider text-xs uppercase mb-2">
          <Gamepad2 className="w-3.5 h-3.5 text-rose-400" /> Personal Library
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-none">
          My Collection<span className="text-rose-500 font-black">.</span>
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Status Filter Sidebar */}
        <div className="w-full md:w-56 flex-shrink-0 sticky top-0 md:top-24 self-start z-20 bg-[#09090b]/95 backdrop-blur-md border-b border-zinc-800/60 py-3 md:py-0 md:bg-transparent md:backdrop-blur-none md:border-0">
          <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-hide">
            {statuses.map((status) => {
              const isSelected = selectedStatus === status.statusId;
              const statusConfig = STATUSES[status.statusId];
              const IconComponent = statusConfig?.icon;

              return (
                <button
                  key={status.statusId}
                  className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl text-left transition duration-200 select-none flex-shrink-0 text-sm font-semibold border-2 ${
                    isSelected
                      ? "bg-zinc-800 text-white border-zinc-700 shadow-md"
                      : "bg-zinc-900/30 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/80 border-transparent"
                  }`}
                  onClick={() => setSelectedStatus(status.statusId)}
                >
                  <div className="flex items-center gap-2.5">
                    {IconComponent && (
                      <div 
                        className={`p-1 rounded-lg ${
                          isSelected ? "bg-zinc-700/80 text-white" : "bg-zinc-950/80 text-zinc-550"
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                    )}
                    <span>{status.name}</span>
                  </div>
                  <span 
                    className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      isSelected ? "bg-zinc-700 text-zinc-300" : "bg-zinc-950/60 text-zinc-500"
                    }`}
                  >
                    {statusCounts[status.statusId] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content (List) */}
        <div className="flex-1">
          {/* Search & Sort Panel */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            {/* Search Input */}
            <div className="relative flex-1 group">
              <input
                type="text"
                placeholder="Search games by name..."
                className="w-full py-2.5 pr-11 pl-11 bg-zinc-950/60 border border-zinc-805 focus:border-rose-500/40 rounded-2xl text-white placeholder-zinc-500 focus:outline-none transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="w-4.5 h-4.5 text-zinc-550 absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
            
            {/* Sort Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider select-none mr-1">Sort By:</span>
              {["completionDate", "name", "rating"].map((field) => (
                <div
                  key={field}
                  onClick={() => onSortClick(field)}
                  className="cursor-pointer"
                >
                  <SortIcon field={field} currentSort={sortBy} currentOrder={sortOrder} />
                </div>
              ))}
            </div>
          </div>

          {/* Game List Rows */}
          <div className="space-y-3">
            {filteredGames.length === 0 ? (
              <div className="bg-zinc-900/10 border border-zinc-800/40 border-dashed rounded-2xl p-12 text-center text-zinc-500 flex flex-col items-center justify-center">
                <AlertCircle className="w-10 h-10 text-zinc-650 mb-3" />
                <p className="font-bold text-zinc-400">No games found</p>
                <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                  We couldn't find any games matching this search query or status filter.
                </p>
              </div>
            ) : (
              filteredGames.map((entry) => (
                <GameRow
                  key={entry.game.id}
                  entry={entry}
                  statusId={entry.statusId}
                  onClick={() => navigate(`/gamedetails/${entry.game.id}`)}
                  onEdit={() => { setModalGame(entry); setIsModalOpen(true); }}
                />
              ))
            )}

            {/* Modal Elements */}
            <EditGameModal
              isOpen={isModalOpen}
              entry={modalGame}
              onClose={() => {
                setModalGame(null);
                setIsModalOpen(false);
              }}
              onDelete={() => handleDeleteClick(modalGame?.game)}
              onUpdate={handleGameUpdate}
            />
            <ConfirmModal
              isOpen={isConfirmOpen}
              title="Remove Game"
              message={`Are you sure you want to remove "${confirmDeleteGame?.name}"?`}
              onConfirm={confirmDelete}
              onCancel={() => setIsConfirmOpen(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
