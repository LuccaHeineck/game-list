import { Dialog } from "@headlessui/react";
import { useState } from "react";

const STATUS_OPTIONS = [
	{ id: 1, label: "Planned" },
	{ id: 2, label: "Playing" },
	{ id: 3, label: "Finished" },
	{ id: 4, label: "Dropped" },
];

export default function EditGameModal({ isOpen, onClose, gameEntry, onSave }) {
	const [statusId, setStatusId] = useState(gameEntry.statusId || 1);
	const [rating, setRating] = useState(gameEntry.rating || "");

	const handleSave = () => {
		onSave({
			...gameEntry,
			statusId,
			statusName: STATUS_OPTIONS.find(s => s.id === statusId)?.label || "Unknown",
			rating: rating !== "" ? parseFloat(rating) : null,
		});
		onClose();
	};

	return (
		<Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 flex items-center justify-center">
			<div className="fixed inset-0 bg-black/50" />
			<div className="bg-zinc-800 rounded-lg p-6 z-10 w-full max-w-md border border-white/20 text-white">
				<Dialog.Title className="text-xl font-semibold mb-4">Edit {gameEntry.game.name}</Dialog.Title>

				{/* Status selector */}
				<label className="block mb-2 text-sm">Status</label>
				<select
					className="w-full p-2 mb-4 rounded bg-zinc-900 border border-white/20"
					value={statusId}
					onChange={(e) => setStatusId(parseInt(e.target.value))}
				>
					{STATUS_OPTIONS.map((status) => (
						<option key={status.id} value={status.id}>
							{status.label}
						</option>
					))}
				</select>

				{/* Rating input */}
				<label className="block mb-2 text-sm">Rating (0–100)</label>
				<input
					type="number"
					min="0"
					max="100"
					value={rating}
					onChange={(e) => setRating(e.target.value)}
					className="w-full p-2 mb-4 rounded bg-zinc-900 border border-white/20"
					placeholder="Enter a score or leave blank"
				/>

				{/* Buttons */}
				<div className="flex justify-end gap-2">
					<button
						className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
						onClick={onClose}
					>
						Cancel
					</button>
					<button
						className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700"
						onClick={handleSave}
					>
						Save
					</button>
				</div>
			</div>
		</Dialog>
	);
}
