import { useState } from "react";

export default function Home() {
	const [query, setQuery] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("Searching for:", query);
		// You can navigate or trigger a search action here
	};

	return (
		<div className="min-h-screen flex items-center justify-center px-4">
			<form onSubmit={handleSubmit} className="w-full max-w-md">
				<h1 className="text-3xl font-bold text-center mb-6">Search Games</h1>
				<div className="flex shadow-lg rounded-lg overflow-hidden">
					<input
						type="text"
						placeholder="Enter game name..."
						value={query}	
						onChange={(e) => setQuery(e.target.value)}
						className="flex-grow px-4 py-2 focus:outline-none"
					/>
					<button
						type="submit"
						className="bg-blue-700 text-white px-6 py-2 hover:bg-blue-800 transition"
					>
						Search
					</button>
				</div>
			</form>
		</div>
	);
}
