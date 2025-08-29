import { PencilIcon } from "@heroicons/react/24/outline";
import { interpolateColor } from "../config/functions";
import { STATUSES } from "../config/statuses";

export default function GameRow({ entry, onClick, onEdit, statusId }) {
  const { game, completionDate, rating } = entry;
  const coverUrl = `https:${game.coverUrl.replace("t_thumb", "t_cover_big")}`;
  const ratingColor = rating !== null ? interpolateColor(rating) : "#aaa";

  return (
    <div
      className="relative flex items-center gap-4 w-full max-w-full rounded-xl p-3 mb-2 shadow-lg cursor-pointer overflow-hidden group"
      onClick={onClick}
    >
      {/* Background image - Lighter and less intense */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-110 opacity-40 brightness-100 transition-all duration-500 ease-out group-hover:scale-125"
        style={{ backgroundImage: `url(${coverUrl})` }}
      />

      {/* Glassy overlay - This is the main effect */}
      <div
        className="absolute inset-0 bg-white/5 backdrop-blur-lg"
      />
      
      {/* Lighter gradient on the right */}
      <div className="absolute top-0 right-0 h-full w-full bg-gradient-to-l from-zinc-900/80 to-transparent pointer-events-none" />

      {/* Content wrapper with z-index to stay on top */}
      <div className="relative z-10 flex items-center gap-4 w-full">
        <img
			src={`https:${game.coverUrl.replace("t_thumb", "t_cover_small")}`}
			alt={game.name}
			className="w-16 object-cover rounded-xl flex-shrink-0 shadow-2xl shadow-zinc-500"
			onClick={(e) => {
				e.stopPropagation();
				onClick();
			}}
		/>

      {/* Info do jogo */}
      <div className="flex flex-col flex-grow min-w-0">
        {/* Badge + Title */}
        <div className="flex items-center gap-2 mb-1">
          {statusId && STATUSES[statusId] && (() => {
            const StatusIcon = STATUSES[statusId].icon;
            const bgClass = STATUSES[statusId].color; // e.g., "bg-white"
            return StatusIcon ? (
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${bgClass}`}>
                <StatusIcon className="w-3 h-3 text-zinc-900" />
              </div>
            ) : null;
          })()}
          
          <h3 className="text-white font-semibold break-words">
            {game.name}
          </h3>
        </div>

        {/* Genres */}
        <p className="text-zinc-400 text-sm">
          {game.genreNames.join(", ").length > 70
            ? game.genreNames.join(", ").slice(0, 70) + "..."
            : game.genreNames.join(", ")}
        </p>
      </div>




        {/* Completion date */}
        <div className="text-zinc-400 text-sm text-right min-w-[120px]">
          <div>
            {completionDate
              ? new Date(completionDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "No date"}
          </div>
        </div>

        {/* Rating */}
        {rating !== null && (
          <div
            className="ml-4 inline-flex items-center justify-center font-extrabold px-5 py-2 rounded-full text-xl select-none drop-shadow-lg max-w-max"
            style={{
              color: ratingColor,
            }}
          >
            {rating.toFixed(1)}
          </div>
        )}

        {/* Edit Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(entry);
          }}
          className="ml-4 p-1 rounded-full transition-colors duration-200"
          aria-label={`Edit ${game.name}`}
          title={`Edit ${game.name}`}
        >
          <PencilIcon className="w-5 h-5 text-zinc-400 hover:text-white" />
        </button>
      </div>
    </div>
  );
}