import { PencilIcon } from "@heroicons/react/24/outline";
import { interpolateColor } from "../config/functions";
import { STATUSES } from "../config/statuses";

export default function GameRow({ entry, onClick, onEdit, statusId }) {
  const { game, completionDate, rating } = entry;
  const coverUrl = `https:${game.coverUrl.replace("t_thumb", "t_cover_big")}`;
  const ratingColor = rating !== null ? interpolateColor(rating) : "#aaa";

  return (
    <div
      className="relative flex flex-col gap-3 w-full max-w-full rounded-xl p-3 md:p-3.5 mb-2 shadow-lg cursor-pointer overflow-hidden group"
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
      <div className="relative z-10 flex flex-col gap-3 w-full md:flex-row md:items-center md:gap-4">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <img
			src={`https:${game.coverUrl.replace("t_thumb", "t_cover_small")}`}
			alt={game.name}
			className="w-14 sm:w-16 h-20 sm:h-24 object-cover rounded-xl flex-shrink-0 shadow-2xl shadow-zinc-500"
			onClick={(e) => {
				e.stopPropagation();
				onClick();
			}}
		/>

          {/* Info do jogo */}
          <div className="flex flex-col flex-grow min-w-0 pt-0.5">
            <div className="flex items-start gap-2 mb-1 pr-10 md:pr-0">
              {statusId && STATUSES[statusId] && (() => {
                const StatusIcon = STATUSES[statusId].icon;
                const bgClass = STATUSES[statusId].color;
                return StatusIcon ? (
                  <div className={`mt-0.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center flex-shrink-0 ${bgClass}`}>
                    <StatusIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-zinc-900" />
                  </div>
                ) : null;
              })()}

              <h3 className="text-white font-semibold leading-tight break-words text-sm sm:text-base md:text-lg">
                {game.name}
              </h3>
            </div>

            <p className="text-zinc-400 text-xs sm:text-sm truncate md:whitespace-normal md:overflow-visible">
              {game.genreNames.join(", ").length > 70
                ? game.genreNames.join(", ").slice(0, 70) + "..."
                : game.genreNames.join(", ")}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 justify-between md:justify-end md:gap-3 md:ml-auto w-full md:w-auto">
          {/* Completion date */}
          <div className="text-zinc-400 text-xs sm:text-sm md:text-right min-w-0 md:min-w-[120px]">
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
              className="inline-flex items-center justify-center font-extrabold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-base sm:text-lg select-none drop-shadow-lg max-w-max"
              style={{
                color: ratingColor,
              }}
            >
              {rating === 0 ? "- . -" : rating.toFixed(1)}
            </div>
          )}

          {/* Edit Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(entry);
            }}
            className="ml-auto md:ml-1 inline-flex items-center justify-center w-9 h-9 rounded-full bg-black/20 border border-white/10 transition-colors duration-200 hover:bg-black/35 hover:border-white/20"
            aria-label={`Edit ${game.name}`}
            title={`Edit ${game.name}`}
          >
            <PencilIcon className="w-4 h-4 text-zinc-300 hover:text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}