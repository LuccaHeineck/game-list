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

  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
    {games.map((game) => (
      <div
        key={game.id}
        className="bg-white rounded-xl shadow hover:shadow-lg transition duration-300 overflow-hidden"
      >
        <img
          src={`https:${game.coverUrl.replace("t_thumb", "t_cover_big")}`}
          alt={game.name}
          className="w-full h-[300px] object-cover"
        />
        <div className="p-4">
          <h2 className="text-lg text-black font-semibold truncate">{game.name}</h2>
          <p className="text-sm text-gray-500 mb-1">
            {game.genreNames.join(", ")}
          </p>
          <p className="text-sm text-black font-medium">⭐ {game.rating}</p>
        </div>
      </div>
    ))}
  </div>
</div>


	);
}
