import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { HomeIcon, Squares2X2Icon, RectangleStackIcon, MagnifyingGlassIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import SearchModal from "./SearchModal";
import { User, LogOut, ChevronDown } from "lucide-react";
import { hasValidSession } from "../config/auth";

export default function NavBar() {
  const [username, setUsername] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (hasValidSession() && storedUsername) {
      setUsername(storedUsername);
    } else {
      setUsername(null);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!dropdownOpen) return;
    const closeDropdown = () => setDropdownOpen(false);
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, [dropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    setUsername(null);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="fixed left-1/2 bottom-4 md:top-4 md:bottom-auto transform -translate-x-1/2 bg-zinc-800/35 backdrop-blur-md border border-white/10 py-3 rounded-full shadow-lg z-40 w-[calc(100%-1rem)] max-w-sm px-8 md:px-12">
        <div className="flex justify-between text-lg text-white">
          <Link to="/" title="Home" className={`flex items-center text-xl ${isActive("/") ? "text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]" : "text-gray-400 hover:text-white"}`}>
            <HomeIcon className="w-6 h-6" />
          </Link>
          <Link to="/games" title="Discover" className={`flex items-center text-xl ${isActive("/games") ? "text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]" : "text-gray-400 hover:text-white"}`}>
            <Squares2X2Icon className="w-6 h-6" />
          </Link>
          <button onClick={() => setShowSearch(true)} title="Search for a game" className={`flex items-center text-xl ${isActive("/search") ? "text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]" : "text-gray-400 hover:text-white"}`}>
            <MagnifyingGlassIcon className="w-6 h-6" />
          </button>
          <Link to="/list" title="My List" className={`flex items-center text-xl ${isActive("/list") ? "text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]" : "text-gray-400 hover:text-white"}`}>
            <RectangleStackIcon className="w-6 h-6" />
          </Link>
          <Link to="/about" title="About" className={`flex items-center text-xl ${isActive("/about") ? "text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]" : "text-gray-400 hover:text-white"}`}>
            <InformationCircleIcon className="w-6 h-6" />
          </Link>
        </div>
      </nav>

      {/* Floating user info panel with premium dropdown */}
      <div className="fixed top-4 right-4 z-50 max-w-[calc(100vw-1rem)]">
        {username ? (
          <div className="relative">
            {/* Dropdown Trigger */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDropdownOpen(!dropdownOpen);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800/40 backdrop-blur-md border border-white/10 hover:border-white/20 transition shadow-lg text-white select-none active:scale-95 cursor-pointer font-medium text-sm"
            >
              <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-700/60 flex items-center justify-center text-zinc-300">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="hidden sm:inline max-w-[100px] truncate">{username}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Content */}
            {dropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-zinc-900/90 backdrop-blur-md border border-zinc-800/80 p-1.5 rounded-2xl shadow-2xl flex flex-col gap-1 z-50 select-none"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-3 py-2 text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
                  Account
                </div>
                <div className="px-3 pb-2 text-white font-bold text-sm truncate">
                  {username}
                </div>
                <div className="h-px bg-zinc-800/50 my-1 mx-1" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition text-sm font-semibold text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            state={{ from: location.pathname }}
            className="flex items-center gap-2 text-white text-sm px-4 py-2 rounded-full bg-zinc-800/40 backdrop-blur-md border border-white/10 hover:bg-zinc-800/80 transition shadow-lg font-semibold"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Log in</span>
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
