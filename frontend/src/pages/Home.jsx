// src/components/Navbar.jsx
import { Link } from "react-router-dom";

export default function Navbar() {
	return (
		<nav className="bg-indigo-600 text-white p-4 shadow">
			<div className="max-w-7xl mx-auto flex justify-between items-center">
				<Link to="/" className="text-xl font-bold">
					MyGameApp
				</Link>
				<div className="space-x-4">
					<Link to="/games" className="hover:underline">
						Games
					</Link>
					<Link to="/login" className="hover:underline">
						Login
					</Link>
				</div>
			</div>
		</nav>
	);
}

