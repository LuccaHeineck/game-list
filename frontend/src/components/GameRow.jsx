import { PencilIcon } from "@heroicons/react/24/outline";

export default function GameRow({ entry, onClick, onEdit }) {
	const { game, completionDate, rating } = entry;
	const coverUrl = `https:${game.coverUrl.replace("t_thumb", "t_cover_big")}`;

	return (
		<div
			className="relative flex items-center gap-4 w-full max-w-full rounded-xl p-3 mb-2 shadow cursor-pointer overflow-hidden group"
			onClick={onClick}
		>
			{/* Blurred Background */}
			<div
				className="absolute inset-0 bg-cover bg-center blur-lg scale-110 opacity-50 brightness-110 transition-all duration-500 ease-out group-hover:scale-125 group-hover:opacity-70"
				style={{ backgroundImage: `url(${coverUrl})` }}
			/>
			{/* Overlay to darken */}
			<div className="absolute inset-0 bg-black bg-opacity-30 transition-opacity duration-500 group-hover:bg-opacity-20" />

			{/* Foreground content */}
			<div className="relative flex items-center gap-4 w-full">
				<img
					src={`https:${game.coverUrl.replace("t_thumb", "t_cover_small")}`}
					alt={game.name}
					className="w-16 h-16 object-cover rounded flex-shrink-0"
					onClick={(e) => {
						e.stopPropagation();
						onClick();
					}}
				/>
				<div className="flex flex-col flex-grow min-w-0">
					<h3 className="text-white font-semibold truncate">{game.name}</h3>
					<p className="text-gray-300 text-sm truncate">
						{game.genreNames.join(", ")}
					</p>
				</div>
				<div className="text-gray-200 text-sm text-right min-w-[120px]">
					<div>
						{completionDate
							? new Date(completionDate).toLocaleDateString()
							: "No date"}
					</div>
					<div>{rating !== null ? rating.toFixed(1) : "N/A"}</div>
				</div>

				{/* Edit Button */}
				<button
					onClick={(e) => {
						e.stopPropagation();
						onEdit(entry);
						
					}}
					className="ml-4 p-1 rounded hover:bg-zinc-700 transition-colors duration-200 relative z-10"
					aria-label={`Edit ${game.name}`}
					title={`Edit ${game.name}`}
				>
					<PencilIcon className="w-5 h-5 text-gray-300 hover:text-white" />
				</button>
			</div>
		</div>
	);
}
