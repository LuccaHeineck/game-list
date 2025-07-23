import { Link } from "react-router-dom";

export default function Footer() {
	return (
		<footer className="bg-gray-100 text-gray-700 mt-10">
			<div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
				{/* About */}
				<div>
					<h3 className="text-lg font-semibold mb-2">About</h3>
					<p className="text-sm">
						Ludex is your personal game list. Track, rate, and explore your favorite titles with ease.
					</p>
				</div>

				{/* Navigation */}
				<div>
					<h3 className="text-lg font-semibold mb-2">Navigate</h3>
					<ul className="space-y-1 text-sm">
						<li><Link to="/" className="hover:underline">Home</Link></li>
						<li><Link to="/games" className="hover:underline">Games</Link></li>
						<li><Link to="/list" className="hover:underline">My List</Link></li>
					</ul>
				</div>

				{/* Contact */}
				<div>
					<h3 className="text-lg font-semibold mb-2">Contact</h3>
					<ul className="space-y-1 text-sm">
						<li>Email: luccacheineck@gmail.com</li>
						<li>GitHub: <a href="https://github.com/LuccaHeineck" className="text-blue-600 hover:underline">yourprofile</a></li>
					</ul>
				</div>
			</div>

			<div className="border-t border-gray-300 text-center text-sm py-4">
				Developed by Lucca Heineck
			</div>
		</footer>
	);
}
