import { useEffect, useState } from "react";
import { fetchGamesByName } from "../api";
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";

export default function SearchModal({ isOpen, onClose, onGameSelect }) {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);

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
		if (query.length > 1) {
			const delayDebounce = setTimeout(async () => {
				try {
					const data = await fetchGamesByName(query);
					setResults(data);
				} catch (err) {
					console.error(err);
				}
			}, 300);
			return () => clearTimeout(delayDebounce);
		} else {
			setResults([]);
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
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
		>
			<div
				onClick={(e) => e.stopPropagation()}
				className="bg-zinc-900 text-white w-full max-w-xl h-[500px] p-6 rounded-xl shadow-xl relative overflow-hidden border border-white/10"
			>
				{/* Search bar with inline close button */}
				<div className="flex items-center gap-2 mb-4 mt-2">
					<div className="relative flex-1">
						<input
							type="text"
							className="w-full p-3 pr-10 pl-4 bg-zinc-800 rounded-full text-white placeholder-gray-400 focus:outline-none"
							placeholder="Search for a game..."
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							autoFocus
						/>
						<MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
					</div>
					<button
						onClick={onClose}
						className="text-white bg-zinc-800 hover:bg-zinc-600 p-2 rounded-full transition"
						aria-label="Close search modal"
					>
						<XMarkIcon className="w-5 h-5" />
					</button>
				</div>

				{/* Results List */}
				<div className="overflow-y-auto space-y-2 h-[calc(100%-100px)] pr-1">
					{results.map((game) => (
						<div
							key={game.id}
							onClick={() => {
								onGameSelect(game);
								onClose();
							}}
							className="p-2 rounded hover:bg-zinc-700 cursor-pointer"
						>
							<div className="flex items-center space-x-4 p-1">
								{game.cover?.url && (
									<img
										src={`https:${game.cover.url}`}
										alt={`${game.name} cover`}
										className="w-12 h-12 object-cover rounded"
									/>
								)}
								<div className="flex flex-col">
									<p className="font-semibold text-sm">{game.name}</p>
									<div className="flex mt-2">
										{game.first_release_date && (
											<p className="text-xs text-gray-500">
												{new Date(game.first_release_date * 1000).getFullYear()}
											</p>
										)}
										{game.first_release_date && game.genres && game.genres.length > 0 && (
											<p className="text-xs text-gray-500 mx-2">|</p>
										)}
										{game.genres && (
											<p className="text-xs text-gray-500">
												{game.genres.map((genre) => genre.name).join(", ")}
											</p>
										)}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
