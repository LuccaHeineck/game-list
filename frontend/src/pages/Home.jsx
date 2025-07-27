import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchModal from "../components/SearchModal";
import QuoteBanner from "../components/QuoteBanner";

export default function Home() {
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		document.title = "Home";
		document.body.style.overflow = isSearchOpen ? "hidden" : "auto";
	}, [isSearchOpen]);


	const handleGameSelect = (game) => {
		try {
            navigate(`/gamedetails/${game.id}`);
            setIsSearchOpen(false);
          } catch (error) {
            console.error("Failed to fetch detailed game info", error);
          }
	};

	return (
		<div className="relative min-h-screen text-white">
		<QuoteBanner />

		<div className="flex flex-col items-center justify-center px-4">
			<h1 className="text-4xl font-bold mb-6">Welcome to Your Game Library</h1>
			<p className="text-gray-400 mb-10 max-w-md text-center">
			Start building your personal collection by adding your favorite games.
			</p>
			<button
			onClick={() => setIsSearchOpen(true)}
			className="px-6 py-3 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-white font-semibold transition"
			>
			Add Your First Game
			</button>
		</div>

		<SearchModal
			isOpen={isSearchOpen}
			onClose={() => setIsSearchOpen(false)}
			onGameSelect={handleGameSelect}
		/>
		</div>

	);
}
