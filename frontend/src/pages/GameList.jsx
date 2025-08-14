import { useEffect, useState, useMemo } from "react";
import { fetchUserList, fetchStatusList } from "../api";
import {
	CalendarIcon,
	ArrowUpIcon,
	ArrowDownIcon,
	Bars3Icon,
	StarIcon
} from "@heroicons/react/24/outline";
import Loader from "../components/Loader";
import GameRow from "../components/GameRow";
import EditGameModal from "../components/EditGameModal";
import { useNavigate } from "react-router-dom";

function SortIcon({ field, currentSort, currentOrder }) {
	const isActive = currentSort === field;
	return (
		<div className="relative flex items-center cursor-pointer select-none">
			{field === "completionDate" && <CalendarIcon className="w-6 h-6" />}
			{field === "name" && <Bars3Icon className="w-6 h-6" />}
			{field === "rating" && <StarIcon className="w-6 h-6" />}
			{isActive && (
				<span className="absolute -top-3 right-0 w-3 h-3">
					{currentOrder === "asc" ? (
						<ArrowUpIcon className="w-3 h-3 text-white" />
					) : (
						<ArrowDownIcon className="w-3 h-3 text-white" />
					)}
				</span>
			)}
		</div>
	);
}

export default function GameList() {
	const [games, setGames] = useState([]);
	const [statuses, setStatuses] = useState([]);
	const [selectedStatus, setSelectedStatus] = useState("all");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState("completionDate");
	const [sortOrder, setSortOrder] = useState("desc");
	const [modalGame, setModalGame] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		setLoading(true);
		setError(null);

		Promise.all([fetchUserList(), fetchStatusList()])
			.then(([gamesData, statusesData]) => {
				setGames(gamesData);
				// Add "All" as first option
				setStatuses([{ statusId: "all", name: "All" }, ...statusesData]);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message || "Failed to load data");
				setLoading(false);
			});
	}, []);

	const handleDelete = (id) => {
		// TODO: call delete API here
		console.log("Deleting game", id);
		setModalGame(null); // close modal after deletion
	};

	function onSortClick(field) {
		if (sortBy === field) {
			setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
		} else {
			setSortBy(field);
			setSortOrder("desc");
		}
	}

	const filteredGames = useMemo(() => {
		let filtered = games.filter((g) =>
			g.game.name.toLowerCase().includes(searchTerm.toLowerCase())
		);

		if (selectedStatus !== "all") {
			filtered = filtered.filter((g) => g.statusId === selectedStatus);
		}

		const compareFuncs = {
			completionDate: (a, b) =>
				new Date(a.completionDate || 0) - new Date(b.completionDate || 0),
			name: (a, b) => a.game.name.localeCompare(b.game.name),
			rating: (a, b) => {
				const ra = a.rating ?? -1;
				const rb = b.rating ?? -1;
				return ra - rb;
			}
		};

		filtered.sort(compareFuncs[sortBy]);
		if (sortOrder === "desc") filtered.reverse();

		return filtered;
	}, [games, searchTerm, selectedStatus, sortBy, sortOrder]);
	

	if (loading) return <Loader />;
	if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

	return (
		<div className="max-w-6xl mx-auto px-4 py-6 mt-20 flex gap-6">
			{/* Status Filter */}
			<div className="w-48 flex-shrink-0">
				<div className="flex flex-col gap-2">
					{statuses.map((status) => (
						<button
							key={status.statusId}
							className={`px-4 py-2 rounded text-left transition-colors ${
								selectedStatus === status.statusId
									? "bg-blue-600 text-white"
									: "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
							}`}
							onClick={() => setSelectedStatus(status.statusId)}
						>
							{status.name}
						</button>
					))}
				</div>
			</div>

			{/* Main Content */}
			<div className="flex-1">
				{/* Search & Sort */}
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
					<input
						type="text"
						placeholder="Search games by name..."
						className="w-full p-3 pr-10 pl-4 bg-zinc-800 rounded-full text-white placeholder-gray-400 focus:outline-none"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>

					<div className="flex gap-6 text-gray-400">
						{["completionDate", "name", "rating"].map((field) => (
							<div
								key={field}
								onClick={() => onSortClick(field)}
								className={`hover:text-gray-300 ${
									sortBy === field ? "text-gray-100" : ""
								}`}
							>
								<SortIcon
									field={field}
									currentSort={sortBy}
									currentOrder={sortOrder}
								/>
							</div>
						))}
					</div>
				</div>

				{/* Game Rows */}
				<div>
					{filteredGames.length === 0 ? (
						<div className="text-gray-400 text-center py-10">
							No games found.
						</div>
					) : (
						filteredGames.map((entry) => (
							<GameRow
								key={entry.game.id}
								entry={entry}
								onClick={() => navigate(`/gamedetails/${entry.game.id}`)}
								onEdit={() => {
									setModalGame(entry);
									setIsModalOpen(true);
								}}
							/>
						))
					)}

					<EditGameModal
						isOpen={isModalOpen}
						entry={modalGame}
						onClose={() => setModalGame(null)}
						onDelete={handleDelete}
					/>
				</div>
			</div>
		</div>
	);
}
