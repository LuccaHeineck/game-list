import { useRef, useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from "@heroicons/react/24/solid";

export default function ArtworkCarousel({ screenshots }) {
	const containerRef = useRef(null);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [cardWidth, setCardWidth] = useState(0);
	const [modalImage, setModalImage] = useState(null);

	const isDragging = useRef(false);
	const startX = useRef(0);
	const scrollLeft = useRef(0);

	const clickThreshold = 8;
	const pointerDownPos = useRef({ x: 0, y: 0 });
	const pointerUpPos = useRef({ x: 0, y: 0 });

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

	const handleMouseDown = (e) => {
		isDragging.current = true;
		startX.current = e.pageX - containerRef.current.offsetLeft;
		scrollLeft.current = containerRef.current.scrollLeft;
		containerRef.current.style.cursor = "grabbing";
		pointerDownPos.current = { x: e.pageX, y: e.pageY };
	};

	const handleMouseLeave = () => {
		isDragging.current = false;
		containerRef.current.style.cursor = "grab";
	};

	const handleMouseUp = (e) => {
		isDragging.current = false;
		containerRef.current.style.cursor = "grab";
		pointerUpPos.current = { x: e.pageX, y: e.pageY };

		const dx = pointerUpPos.current.x - pointerDownPos.current.x;
		const dy = pointerUpPos.current.y - pointerDownPos.current.y;

		if (Math.abs(dx) < clickThreshold && Math.abs(dy) < clickThreshold) {
			const img = e.target.closest("img");
			if (img) {
				const url = img.getAttribute("src").match(/\/([^/]+)\.jpg$/)?.[1];
				if (url) setModalImage(url);
			}
		}
	};

	const handleMouseMove = (e) => {
		if (!isDragging.current) return;
		e.preventDefault();
		const x = e.pageX - containerRef.current.offsetLeft;
		const walk = (startX.current - x) * 0.8; // Less drag required
		containerRef.current.scrollLeft = scrollLeft.current + walk;
		const newIndex = Math.round(containerRef.current.scrollLeft / cardWidth);
		if (newIndex !== currentIndex) setCurrentIndex(newIndex);
	};

	let touchStartX = 0;
	let touchStartY = 0;
	let touchScrollLeft = 0;

	const handleTouchStart = (e) => {
		touchStartX = e.touches[0].clientX;
		touchStartY = e.touches[0].clientY;
		touchScrollLeft = containerRef.current.scrollLeft;
		pointerDownPos.current = { x: touchStartX, y: touchStartY };
	};

	const handleTouchMove = (e) => {
		const touchX = e.touches[0].clientX;
		const walk = (touchStartX - touchX) * 0.8; // Less drag required
		containerRef.current.scrollLeft = touchScrollLeft + walk;
		const newIndex = Math.round(containerRef.current.scrollLeft / cardWidth);
		if (newIndex !== currentIndex) setCurrentIndex(newIndex);
	};

	const handleTouchEnd = (e) => {
		const touchEndX = e.changedTouches[0].clientX;
		const touchEndY = e.changedTouches[0].clientY;
		pointerUpPos.current = { x: touchEndX, y: touchEndY };

		const newIndex = Math.round(containerRef.current.scrollLeft / cardWidth);
		scrollToIndex(newIndex);

		const dx = pointerUpPos.current.x - pointerDownPos.current.x;
		const dy = pointerUpPos.current.y - pointerDownPos.current.y;

		if (Math.abs(dx) < clickThreshold && Math.abs(dy) < clickThreshold) {
			const containerRect = containerRef.current.getBoundingClientRect();
			const clickX = pointerUpPos.current.x - containerRect.left + containerRef.current.scrollLeft;
			const clickedIndex = Math.floor(clickX / cardWidth);

			if (clickedIndex >= 0 && clickedIndex < screenshots.length) {
				setModalImage(screenshots[clickedIndex]);
			}
		}
	};

	return (
		<div className="relative mt-10 select-none">
			<h3 className="text-xl font-semibold mb-4">Artworks</h3>

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

			<div
				ref={containerRef}
				className="flex overflow-x-scroll scroll-smooth snap-x snap-mandatory no-scrollbar px-8 gap-4 cursor-grab select-none"
				onMouseDown={handleMouseDown}
				onMouseLeave={handleMouseLeave}
				onMouseUp={handleMouseUp}
				onMouseMove={handleMouseMove}
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
			>
				{screenshots.map((url, idx) => (
					<img
						key={idx}
						src={`https://images.igdb.com/igdb/image/upload/t_1080p/${url}.jpg`}
						alt={`Screenshot ${idx + 1}`}
						className="snap-center w-[480px] h-[270px] object-cover rounded-2xl shadow cursor-pointer select-none"
						draggable={false}
					/>
				))}
			</div>

			<p className="text-center mt-4 text-sm text-gray-500">
				{currentIndex + 1} / {screenshots.length}
			</p>

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
