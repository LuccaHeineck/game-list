import React from "react";

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
			<div className="bg-zinc-900 p-6 rounded-xl w-80 text-white">
				<h2 className="text-lg font-bold mb-4">{title}</h2>
				<p className="mb-6">{message}</p>
				<div className="flex justify-end gap-4">
					<button
						className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
						onClick={onCancel}
					>
						Cancel
					</button>
					<button
						className="px-4 py-2 bg-red-600 rounded hover:bg-red-500"
						onClick={onConfirm}
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
}
