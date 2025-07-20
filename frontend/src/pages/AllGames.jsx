import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- Import navigation
import { fetchAllDBGames } from "../api";

export default function AllGames() {
	const [games, setGames] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		// Check auth token
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
			<h1 className="text-3xl font-bold mb-8 text-center">Games</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{games.map((game) => (
					<div
						key={game.id}
						className="bg-white rounded-2xl shadow-lg p-4 hover:shadow-xl transition flex flex-col"
					>
						<div className="w-full aspect-square overflow-hidden rounded-xl mb-4">
							<img
								src={`https:${game.coverUrl.replace("t_thumb", "t_cover_big")}`}
								alt={game.name}
								className="w-full h-full object-cover"
							/>
						</div>
						<h2 className="text-xl font-semibold mb-1">{game.name}</h2>
						<p className="text-sm text-gray-500 mb-2">
							Released: {new Date(game.releaseDate).toLocaleDateString()}
						</p>
						<p className="text-sm text-gray-700 mb-2 line-clamp-4">{game.summary}</p>
						<span className="mt-auto text-sm font-medium text-indigo-600">
							⭐ {game.rating ?? "N/A"}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}
