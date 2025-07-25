import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllDBGames } from "../api";
import { CalendarIcon } from "@heroicons/react/24/solid";
import Loader from "../components/Loader"; // Adjust path as needed

export default function AllGames() {
	const [games, setGames] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		document.title = "Discover";

		const token = localStorage.getItem("token");
		if (!token) {
			navigate("/login");
			return;
		}

		async function loadGames() {
			try {
				const data = await fetchAllDBGames();
				setGames(data);
				
			} catch (err) {
				if (err.message === "Unauthorized") {
					navigate("/login");
				} else {
					setError(err.message);
				}
			} finally {
				setLoading(false);
			}
		}

		loadGames();
	}, [navigate]);

	if (loading) return <Loader />;
	if (error) return <div className="text-center text-red-500 mt-8">Error: {error}</div>;

	return (
		<div className="max-w-7xl mx-auto mt-10 pt-16 pb-24 px-4">
			<h1 className="text-2xl font-semibold mb-6 text-center">Games</h1>

			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-3 gap-y-6">
				{games.map((game) => (
					<div
						key={game.id}
						onClick={() => navigate(`/gamedetails/${game.id}`, { state: { game } })}
						className="w-48 cursor-pointer bg-white/10 dark:bg-zinc-900/30 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-lg shadow hover:shadow-md transition duration-300 overflow-hidden"
					>
						<img
							src={`https:${game.coverUrl.replace("t_thumb", "t_cover_big")}`}
							alt={game.name}
							className="w-full object-cover"
						/>
						<div className="p-3 flex flex-col justify-between h-28">
							<div>
								<h2 className="text-sm text-white font-semibold line-clamp-2">{game.name}</h2>
								<p className="text-xs text-gray-500 mb-1 line-clamp-1">
									{game.genreNames.join(", ")}
								</p>
							</div>
							<div className="flex items-center gap-1 text-gray-500 mt-1">
								<CalendarIcon className="w-5 h-5" />
								<p className="text-sm">{new Date(game.releaseDate).getFullYear()}</p>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
