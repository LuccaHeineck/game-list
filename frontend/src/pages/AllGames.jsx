import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchGamesByGenre } from "../api"; // fetch per genre
import { CalendarIcon } from "@heroicons/react/24/solid";
import Loader from "../components/Loader";

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

export default function AllGames() {
	const [gamesByGenre, setGamesByGenre] = useState({});
	const [error, setError] = useState(null);
	const [loadedGenres, setLoadedGenres] = useState({});
	const navigate = useNavigate();

	const [isDragging, setIsDragging] = useState(false);
	const [startX, setStartX] = useState(0);
	const [scrollLeft, setScrollLeft] = useState(0);


	useEffect(() => {
		document.title = "Discover";

		const token = localStorage.getItem("token");
		if (!token) {
			navigate("/login");
			return;
		}

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
				if (err.message === "Unauthorized") {
					navigate("/login");
				} else {
					setError(err.message);
				}
			} finally {
				// Wait 300ms before next request
				setTimeout(() => fetchWithDelay(index + 1), 300);
			}
		}

		fetchWithDelay(0);
	}, [navigate]);

	if (error) return <div className="text-center text-red-500 mt-8">Error: {error}</div>;

	return (
		<div className="max-w-8xl mx-auto mt-10 pt-16 pb-24 px-4">
			<h1 className="text-2xl font-semibold mb-8 text-center">Discover New Games</h1>

			{genres.map(({ id, name }) => (
				<div key={id} className="mb-14">
					<div className="w-3/5 mx-auto">
						<h2 className="text-xl font-semibold mb-5">{name}</h2>
					</div>

					{!loadedGenres[id] ? (
						<div className="text-gray-500">Loading...</div>
					) : (
						<div
							className="relative -mx-4 px-4 overflow-x-auto overflow-auto scrollbar-hide"
							onMouseDown={(e) => {
								const container = e.currentTarget;
								setIsDragging(false); // reset
								setStartX(e.pageX - container.offsetLeft);
								setScrollLeft(container.scrollLeft);

								container.dataset.dragging = "true";
							}}
							onMouseMove={(e) => {
								const container = e.currentTarget;
								if (container.dataset.dragging !== "true") return;

								const x = e.pageX - container.offsetLeft;
								const distance = x - startX;

								if (Math.abs(distance) > 5) setIsDragging(true); // mark as drag

								container.scrollLeft = scrollLeft - distance;
							}}
							onMouseUp={(e) => {
								e.currentTarget.dataset.dragging = "false";
								setTimeout(() => setIsDragging(false), 0); // reset after click
							}}
							onMouseLeave={(e) => {
								e.currentTarget.dataset.dragging = "false";
							}}
							>

							<div className="flex gap-3 w-max pb-2">
								{gamesByGenre[id]?.map((game) => (
									<div
										key={game.id}
										onClick={() => {
											if (!isDragging) {
												navigate(`/gamedetails/${game.id}`, { state: { game } });
											}
										}}
										className="w-48 flex-shrink-0 cursor-pointer bg-white/10 dark:bg-zinc-900/30 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-lg shadow hover:shadow-md transition duration-300 overflow-hidden"
										>

										<img
											draggable={false}
											src={`https:${game.cover.url.replace("t_thumb", "t_cover_big")}`}
											alt={game.name}
											className="w-full object-cover select-none"
										/>
										<div className="p-3 flex flex-col justify-between h-28">
											<div>
												<h3 className="text-sm text-white font-semibold line-clamp-2">
													{game.name}
												</h3>
												<p className="text-xs text-gray-500 mb-1 line-clamp-1">
													{game.genres?.map(g => g.name).join(", ") || ""}
												</p>
											</div>
											{game.first_release_date && !isNaN(new Date(game.first_release_date * 1000).getFullYear()) && (
												<div className="flex items-center gap-1 text-gray-500 mt-1">
													<CalendarIcon className="w-5 h-5" />
													<p className="text-sm">
														{new Date(game.first_release_date * 1000).getFullYear()}
													</p>
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
