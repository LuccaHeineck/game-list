import { useEffect, useState, useMemo } from "react";
import { fetchUserList, deleteGameFromList } from "../api";
import { STATUSES } from "../config/statuses";
import {
	CalendarIcon,
	ArrowUpIcon,
	ArrowDownIcon,
	Bars3Icon,
	StarIcon,
	MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import Loader from "../components/Loader";
import GameRow from "../components/GameRow";
import EditGameModal from "../components/EditGameModal";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";
import toast from "react-hot-toast";

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
	const [selectedStatus, setSelectedStatus] = useState(0); // 0 = All
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState("completionDate");
	const [sortOrder, setSortOrder] = useState("desc");
	const [modalGame, setModalGame] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [confirmDeleteGame, setConfirmDeleteGame] = useState(null);
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const navigate = useNavigate();

	const statuses = useMemo(() => {
		const statList = Object.entries(STATUSES).map(([id, config]) => ({
			statusId: Number(id),
			name: config.name,
		}));
		return statList.some(s => s.statusId === 0)
			? statList
			: [{ statusId: 0, name: "All" }, ...statList];
	}, []);


	useEffect(() => {
		document.title = "My List";
		setLoading(true);
		setError(null);

		const loadData = async () => {
			try {
				const gamesData = await fetchUserList();
				setGames(gamesData);
			} catch (err) {
				setError(err.message || "Failed to load data");
			} finally {
				setLoading(false);
			}
		};

		loadData();
		window.scrollTo(0, 0);
	}, []);

	const handleDeleteClick = (game) => {
		setConfirmDeleteGame(game);
		setIsConfirmOpen(true);
	};

	const confirmDelete = async () => {
		if (!confirmDeleteGame) return;

		try {
			await deleteGameFromList(confirmDeleteGame.id);
			setGames((prevGames) =>
				prevGames.filter((entry) => entry.game.id !== confirmDeleteGame.id)
			);
			setConfirmDeleteGame(null);
			setIsConfirmOpen(false);
			setModalGame(null);
			toast.success("Game deleted successfully!");
		} catch (error) {
			console.error(error);
			setIsConfirmOpen(false);
			toast.error("Failed to delete game.");
		}
	};
	
	const handleGameUpdate = (updatedGame) => {
		setGames((prevGames) =>
			prevGames.map((entry) =>
			entry.game.id === updatedGame.id
				? { ...entry, game: { ...entry.game, ...updatedGame }, statusId: updatedGame.statusId, rating: updatedGame.rating }
				: entry
			)
		);
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

		if (selectedStatus !== 0) {
			filtered = filtered.filter((g) => g.statusId === selectedStatus);
		}

		const compareFuncs = {
			completionDate: (a, b) =>
				new Date(a.completionDate || 0) - new Date(b.completionDate || 0),
			name: (a, b) => a.game.name.localeCompare(b.game.name),
			rating: (a, b) => (a.rating ?? -1) - (b.rating ?? -1),
		};

		filtered.sort(compareFuncs[sortBy]);
		if (sortOrder === "desc") filtered.reverse();

		return filtered;
	}, [games, searchTerm, selectedStatus, sortBy, sortOrder]);

	const statusCounts = useMemo(() => {
		const counts = {};
		statuses.forEach((s) => { counts[s.statusId] = 0; });
		games.forEach((g) => { counts[g.statusId] = (counts[g.statusId] ?? 0) + 1; });
		counts[0] = games.length; // All
		return counts;
	}, [games, statuses]);

	if (loading) return <Loader />;
	if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

	return (
		<div className="max-w-6xl mx-auto px-4 py-6 mt-20 flex gap-6 min-h-screen">
        {/* Status Filter */}
        	<div className="w-48 flex-shrink-0 sticky top-16 self-start">
				<div className="flex flex-col gap-2">
					{statuses.map((status) => {
					const isSelected = selectedStatus === status.statusId;
					const statusConfig = STATUSES[status.statusId];
					const IconComponent = statusConfig?.icon;

					return (
						<button
							key={status.statusId}
							className={`flex items-center pr-5 justify-between gap-2 pl-4 py-2 rounded-full text-left transition-colors ${
							isSelected
								? `${statusConfig?.color} text-zinc-900`
								: "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
							}`}
							onClick={() => setSelectedStatus(status.statusId)}
						>
							<div className="flex items-center gap-2">
							{IconComponent && <IconComponent className="w-5 h-5" />}
							<span>{status.name}</span>
							</div>
							<span>{statusCounts[status.statusId] ?? 0}</span>
						</button>
					);
					})}
				</div>
			</div>


			{/* Main Content */}
			<div className="flex-1">
				{/* Search & Sort */}
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
					<div className="relative flex-1">
						<input
							type="text"
							placeholder="Search games by name..."
							className="w-full p-3 pr-10 pl-4 bg-zinc-800 rounded-full text-white placeholder-gray-400 focus:outline-none"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
						<MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
					</div>
					
					<div className="flex gap-6 text-gray-400">
						{["completionDate", "name", "rating"].map((field) => (
							<div
								key={field}
								onClick={() => onSortClick(field)}
								className={`hover:text-gray-300 ${sortBy === field ? "text-gray-100" : ""}`}
							>
								<SortIcon field={field} currentSort={sortBy} currentOrder={sortOrder} />
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
								onEdit={() => { setModalGame(entry); setIsModalOpen(true); }}
							/>
						))
					)}

					<EditGameModal
						isOpen={isModalOpen}
						entry={modalGame}
						onClose={() => {
							setModalGame(null)
							setIsModalOpen(false);
						}}
						onDelete={() => handleDeleteClick(modalGame?.game)}
						onUpdate={handleGameUpdate}
					/>
					<ConfirmModal
						isOpen={isConfirmOpen}
						title="Remove Game"
						message={`Are you sure you want to remove "${confirmDeleteGame?.name}"?`}
						onConfirm={confirmDelete}
						onCancel={() => setIsConfirmOpen(false)}
					/>
				</div>
			</div>
		</div>
	);
}
