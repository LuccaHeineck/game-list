import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserIcon } from "@heroicons/react/24/solid";

export default function NavBar() {
	const [username, setUsername] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const storedUsername = localStorage.getItem("username");
		const token = localStorage.getItem("token");
		if (token && storedUsername) {
			setUsername(storedUsername);
		}
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("username");
		setUsername(null);
		navigate("/login");
	};

	return (
		<nav className="bg-blue-800 p-4 shadow text-white fixed top-0 left-0 right-0 z-50">
			<div className="max-w-7xl mx-auto flex justify-between items-center">
				{/* Left: Home */}
				<div>
					<Link to="/" className="text-xl font-bold">
						Ludex
					</Link>
				</div>

				{/* Center: Games & List */}
				<div className="space-x-6 text-lg">
					<Link to="/games" className="hover:underline">
						Games
					</Link>
					<Link to="/list" className="hover:underline">
						List
					</Link>
				</div>

				{/* Right: User Info or Login */}
				<div className="flex items-center gap-3">
					{username ? (
						<>
							<UserIcon className="w-5 h-5 text-white" />
							<span className="font-medium">{username}</span>
							<button
								onClick={handleLogout}
								className="text-sm bg-red-500 hover:bg-red-600 px-2 py-1 rounded"
							>
								Logout
							</button>
						</>
					) : (
						<Link to="/login" className="hover:underline">
							Login
						</Link>
					)}
				</div>
			</div>
		</nav>
	);
}
