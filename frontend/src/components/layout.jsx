// src/components/Layout.jsx
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";

export default function Layout() {
	return (
		<div className="w-screen min-h-screen flex flex-col">
			<NavBar />
			<main className="flex-grow pt-16">
				<Outlet />
			</main>
			<Footer/>
		</div>
	);
}
