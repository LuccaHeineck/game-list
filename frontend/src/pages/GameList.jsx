import { useEffect, useState, useMemo } from "react";
import { fetchUserList } from "../api";
import {
  CalendarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  Bars3Icon,
  StarIcon,
  PencilIcon, // Import Pencil icon for edit button
} from "@heroicons/react/24/outline"; // install @heroicons/react
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

function SortIcon({ field, currentSort, currentOrder }) {
  const isActive = currentSort === field;
  return (
    <div className="relative flex items-center cursor-pointer select-none">
      {field === "completionDate" && <CalendarIcon className="w-6 h-6" />}
      {field === "name" && <Bars3Icon className="w-6 h-6" />}
      {field === "rating" && <StarIcon className="w-6 h-6" />}

      {/* Up/down arrow for sort order */}
      {isActive && (
        <span className="absolute -top-3 right-0 w-3 h-3">
          {currentOrder === "asc" ? (
            <ArrowUpIcon className="w-3 h-3 text-white" />
          ) : (
            <ArrowDownIcon className="w-3 h-3 text-white" />
          )}
        </span>
      )}
    </div>
  );
}

function GameRow({ entry, onClick, onEdit }) {
  const { game, statusName, completionDate, rating } = entry;
  return (
    <div
      className="flex items-center gap-4 w-full max-w-full bg-zinc-900 rounded-md p-3 mb-2 shadow hover:shadow-blue-600 cursor-pointer transition-shadow duration-300"
    >
      <img
        src={`https:${game.coverUrl.replace("t_thumb", "t_cover_small")}`}
        alt={game.name}
        className="w-16 h-16 object-cover rounded"
        onClick={onClick} // Clicking image triggers main click
      />
      <div
        className="flex flex-col flex-grow min-w-0"
        onClick={onClick} // Clicking text also triggers main click
      >
        <h3 className="text-white font-semibold truncate">{game.name}</h3>
        <p className="text-gray-400 text-sm truncate">
          {game.genreNames.join(", ")}
        </p>
      </div>
      <div
        className="text-gray-400 text-sm text-right min-w-[120px]"
        onClick={onClick} // Clicking dates/ratings triggers main click
      >
        <div>
          {completionDate
            ? new Date(completionDate).toLocaleDateString()
            : "No date"}
        </div>
        <div>{rating !== null ? rating.toFixed(1) : "N/A"}</div>
      </div>

      {/* Subtle Edit Button */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent row onClick
          onEdit(entry);
        }}
        className="ml-4 p-1 rounded hover:bg-zinc-700 transition-colors duration-200"
        aria-label={`Edit ${game.name}`}
        title={`Edit ${game.name}`}
      >
        <PencilIcon className="w-5 h-5 text-gray-400 hover:text-gray-200" />
      </button>
    </div>
  );
}

export default function GameList() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("completionDate");
  const [sortOrder, setSortOrder] = useState("desc"); // "asc" or "desc"
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchUserList()
      .then((data) => {
        setGames(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load games");
        setLoading(false);
      });
  }, []);

  // Sorting handler
  function onSortClick(field) {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("desc"); // default desc on new field
    }
  }

  const filteredGames = useMemo(() => {
    let filtered = games.filter((g) =>
      g.game.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const compareFuncs = {
      completionDate: (a, b) =>
        new Date(a.completionDate || 0) - new Date(b.completionDate || 0),
      name: (a, b) => a.game.name.localeCompare(b.game.name),
      rating: (a, b) => {
        const ra = a.rating ?? -1;
        const rb = b.rating ?? -1;
        return ra - rb;
      },
    };

    filtered.sort(compareFuncs[sortBy]);
    if (sortOrder === "desc") filtered.reverse();

    return filtered;
  }, [games, searchTerm, sortBy, sortOrder]);

  if (loading) return <Loader />;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 mt-20">
      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search games by name..."
          className="w-full p-3 pr-10 pl-4 bg-zinc-800 rounded-full text-white placeholder-gray-400 focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Sort Icons */}
        <div className="flex gap-6 text-gray-400">
          {["completionDate", "name", "rating"].map((field) => (
            <div
              key={field}
              onClick={() => onSortClick(field)}
              className={`hover:text-gray-300 ${
                sortBy === field ? "text-gray-100" : ""
              }`}
            >
              <SortIcon
                field={field}
                currentSort={sortBy}
                currentOrder={sortOrder}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Games List */}
      <div>
        {filteredGames.length === 0 ? (
          <div className="text-gray-400 text-center py-10">No games found.</div>
        ) : (
          filteredGames.map((entry) => (
            <GameRow
              key={entry.gameId}
              entry={entry}
              onClick={() => navigate(`/gamedetails/${entry.game.id}`)}
              onEdit={() => navigate(`/gameedit/${entry.game.id}`)} // edit route example
            />
          ))
        )}
      </div>
    </div>
  );
}
