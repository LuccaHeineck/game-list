import { useRef, useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from "@heroicons/react/24/solid";

export default function ScreenshotCarousel({ screenshots }) {
	const containerRef = useRef(null);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [cardWidth, setCardWidth] = useState(0);
	const [modalImage, setModalImage] = useState(null); // For modal

	useEffect(() => {
		const updateCardWidth = () => {
			if (containerRef.current?.firstChild) {
				setCardWidth(containerRef.current.firstChild.offsetWidth + 16);
			}
		};
		updateCardWidth();
		window.addEventListener("resize", updateCardWidth);
		return () => window.removeEventListener("resize", updateCardWidth);
	}, []);

	const scrollToIndex = (index) => {
		if (containerRef.current) {
			containerRef.current.scrollTo({
				left: index * cardWidth,
				behavior: "smooth",
			});
		}
		setCurrentIndex(index);
	};

	const next = () => {
		if (currentIndex < screenshots.length - 1) scrollToIndex(currentIndex + 1);
	};
	const prev = () => {
		if (currentIndex > 0) scrollToIndex(currentIndex - 1);
	};

	let startX = 0;
	const handleTouchStart = (e) => (startX = e.touches[0].clientX);
	const handleTouchEnd = (e) => {
		const endX = e.changedTouches[0].clientX;
		if (startX - endX > 50) next();
		if (endX - startX > 50) prev();
	};

	return (
		<div className="relative mt-10">
			<h3 className="text-xl font-semibold mb-4">Screenshots</h3>

			{/* Scroll Buttons */}
			<button
				onClick={prev}
				disabled={currentIndex === 0}
				className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 disabled:opacity-30 p-2 rounded-full shadow backdrop-blur-sm transition"
			>
				<ChevronLeftIcon className="w-5 h-5" />
			</button>

			<button
				onClick={next}
				disabled={currentIndex === screenshots.length - 1}
				className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 disabled:opacity-30 p-2 rounded-full shadow backdrop-blur-sm transition"
			>
				<ChevronRightIcon className="w-5 h-5" />
			</button>

			{/* Scroll Container */}
			<div
				ref={containerRef}
				onTouchStart={handleTouchStart}
				onTouchEnd={handleTouchEnd}
				className="flex overflow-x-scroll scroll-smooth snap-x snap-mandatory no-scrollbar px-8 gap-4"
			>
				{screenshots.map((url, idx) => (
					<img
						key={idx}
						src={`https://images.igdb.com/igdb/image/upload/t_1080p/${url}.jpg`}
						alt={`Screenshot ${idx + 1}`}
						className="snap-center w-[480px] h-[270px] object-cover rounded-2xl shadow cursor-pointer"
						onClick={() => setModalImage(url)}
					/>
				))}
			</div>

			<p className="text-center mt-4 text-sm text-gray-500">
				{currentIndex + 1} / {screenshots.length}
			</p>

			{/* Modal */}
			{modalImage && (
				<div
					className="fixed inset-0 bg-black/80 backdrop-blur flex items-center justify-center z-50"
					onClick={() => setModalImage(null)}
				>
					<div
						className="relative max-w-[90vw] max-h-[90vh]"
						onClick={(e) => e.stopPropagation()}
					>
						<button
							onClick={() => setModalImage(null)}
							className="absolute top-2 right-2 bg-white/80 hover:bg-white text-black p-1 rounded-full"
						>
							<XMarkIcon className="w-6 h-6" />
						</button>
						<img
							src={`https://images.igdb.com/igdb/image/upload/t_1080p/${modalImage}.jpg`}
							alt="Full Screenshot"
							className="rounded-lg max-h-[90vh] object-contain"
						/>
					</div>
				</div>
			)}
		</div>
	);
}
