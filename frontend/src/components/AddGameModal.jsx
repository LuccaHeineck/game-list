import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { addGameToList } from "../api";

export default function AddGameModal({ isOpen, onClose, game }) {
	const [formData, setFormData] = useState({
		rating: "",
		status: ""
	});

	const statusOptions = [
		{ value: "", label: "Select Status" },
		{ value: "playing", label: "Currently Playing" },
		{ value: "completed", label: "Completed" },
		{ value: "paused", label: "Paused" },
		{ value: "dropped", label: "Dropped" },
		{ value: "plan_to_play", label: "Plan to Play" },
		{ value: "backlog", label: "Backlog" }
	];

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const userGameData = {
			gameId: game.id,
			gameName: game.name,
			rating: formData.rating ? parseFloat(formData.rating) : null,
			statusId: 2,
            userId: localStorage.getItem("userId"),
            completionDate: "",
            createdAt: ""
		};

		try {
			await addGameToList(userGameData);
			alert("Game added successfully!");
			setFormData({ rating: "", status: "" });
			onClose();
		} catch (error) {
			alert("Failed to add game. Please try again.");
		}
	};

	const handleClose = () => {
		setFormData({ rating: "", status: "" });
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white dark:bg-zinc-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
				<div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-zinc-700">
					<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
						Add "{game.name}" to Your Library
					</h2>
					<button
						onClick={handleClose}
						className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
					>
						<XMarkIcon className="w-6 h-6" />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="p-6 space-y-4">
					<div>
						<label htmlFor="rating" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Rating (Optional)
						</label>
						<input
							type="number"
							id="rating"
							name="rating"
							min="0"
							max="10"
							step="0.1"
							value={formData.rating}
							onChange={handleInputChange}
							placeholder="Rate from 0 to 10"
							className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:text-white"
						/>
					</div>

					<div>
						<label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Status *
						</label>
						<select
							id="status"
							name="status"
							value={formData.status}
							onChange={handleInputChange}
							required
							className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:text-white"
						>
							{statusOptions.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					</div>

					<div className="flex justify-end space-x-3 pt-4">
						<button
							type="button"
							onClick={handleClose}
							className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600 rounded-md transition-colors"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-sm"
						>
							Add Game
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
