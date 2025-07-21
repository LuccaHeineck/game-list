import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllDBGames } from "../api";

export default function AllGames() {
	const [games, setGames] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
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

	if (loading) return <div className="text-center mt-8">Loading games...</div>;
	if (error) return <div className="text-center text-red-500 mt-8">Error: {error}</div>;

	return (
		<div className="max-w-7xl mx-auto mt-10 px-4">
			<h1 className="text-2xl font-semibold mb-6 text-center">Games</h1>

			{/* Horizontal Scroll Carousel */}
			<div className="overflow-x-auto">
				<div className="flex gap-4 px-2 snap-x snap-mandatory scroll-smooth">
					{games.map((game) => (
						<div
							key={game.id}
							className="snap-start bg-white rounded-xl shadow p-2 hover:shadow-md transition text-sm w-36 flex-shrink-0"
						>
							<div className="w-full aspect-[3/4] rounded overflow-hidden mb-2">
								<img
									src={`https:${game.coverUrl.replace("t_thumb", "t_cover_big")}`}
									alt={game.name}
									className="w-full h-full object-cover"
								/>
							</div>
							<h2 className="font-semibold text-sm leading-tight">{game.name}</h2>
							<p className="text-xs text-gray-500">
								{new Date(game.releaseDate).toLocaleDateString()}
							</p>
							<span className="text-xs font-medium text-indigo-600">
								⭐ {game.rating ?? "N/A"}
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
