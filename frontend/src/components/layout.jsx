// src/components/Layout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<main className="flex-grow container mx-auto px-4 py-6">
				<Outlet /> {/* Render the current route's element here */}
			</main>
		</div>
	);
}
