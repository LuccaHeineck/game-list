import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserIcon } from "@heroicons/react/24/solid";
import { HomeIcon, Squares2X2Icon, RectangleStackIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import SearchModal from "./SearchModal";

export default function NavBar() {
  const [username, setUsername] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-zinc-800/30 backdrop-blur-md border border-white/10 px-8 py-3 rounded-full shadow-lg z-40 w-[90%] max-w-xs pl-12 pr-12">
        <div className="flex justify-between text-lg text-white">
          <Link to="/" className={`flex items-center text-xl ${isActive("/") ? "text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]" : "text-gray-400 hover:text-white"}`}>
            <HomeIcon className="w-6 h-6" />
          </Link>
          <Link to="/games" className={`flex items-center text-xl ${isActive("/games") ? "text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]" : "text-gray-400 hover:text-white"}`}>
            <Squares2X2Icon className="w-6 h-6" />
          </Link>
          <Link to="/list" className={`flex items-center text-xl ${isActive("/list") ? "text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]" : "text-gray-400 hover:text-white"}`}>
            <RectangleStackIcon className="w-6 h-6" />
          </Link>
          <button onClick={() => setShowSearch(true)} className={`flex items-center text-xl ${isActive("/search") ? "text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]" : "text-gray-400 hover:text-white"}`}>
            <MagnifyingGlassIcon className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Floating user info panel */}
      <div className="fixed top-4 right-4 z-50 bg-zinc-800/30 backdrop-blur-md border border-white/10 px-5 py-3 rounded-full shadow-lg flex items-center gap-4 min-w-[180px]">
        {username ? (
          <>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition cursor-default">
              <UserIcon className="w-5 h-5 text-white" />
              <span className="text-white font-medium text-sm truncate">{username}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded-full transition"
              title="Logout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h6a1 1 0 110 2H5v10h5a1 1 0 110 2H4a1 1 0 01-1-1V4zm12.293 2.293a1 1 0 011.414 0L20 9.586a1 1 0 010 1.414l-3.293 3.293a1 1 0 01-1.414-1.414L16.586 11H9a1 1 0 110-2h7.586l-1.293-1.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-2 text-white text-sm px-4 py-1 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            <UserIcon className="w-5 h-5" />
            Login
          </Link>
        )}
      </div>

      <SearchModal
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        onGameSelect={async (game) => {
          try {
            navigate(`/gamedetails/${game.id}`);
            setShowSearch(false);
          } catch (error) {
            console.error("Failed to fetch detailed game info", error);
          }
        }}
      />
    </>
  );
}
