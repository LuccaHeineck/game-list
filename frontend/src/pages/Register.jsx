import { useState, useEffect } from "react";
import { registerUser } from "../api.js"
import QuoteBanner from "../components/QuoteBanner.jsx";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function Register({ onRegister }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
      document.title = "Create Account";
      document.body.style.overflow = "auto"; // Reset overflow on mount
    }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await registerUser(username, email, password);
      console.log(username, password)
      localStorage.setItem("token", data.token); // save token
      onRegister(); // e.g. redirect to /games
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div>
      <QuoteBanner
              quoteData={{
                quote: "Welcome to the Velvet Room.",
                who: "Igor",
                game: "Persona series",
                bannerUrl:
                  "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/i/5afd6210-f29b-4f83-920f-54d3dc1e65c7/dda5kjr-139cfdc8-ba23-4875-a87f-1bf934aee15a.jpg/v1/fill/w_1192,h_670,q_70,strp/_wallpaper_engine__p3_velvet_room__1080p__by_monstabyte_dda5kjr-pre.jpg",
              }}
            />
      
      <div className="max-w-md mx-auto -mt-[40rem] p-6 bg-white/10 dark:bg-zinc-900/30 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">Register</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label
            htmlFor="username"
            className="mb-2 text-sm font-medium text-white"
          >
            Email
          </label>
          <input
            id="email"
            className="border p-2 rounded-md bg-zinc-900/30 focus:outline-none focus:ring-2 focus:ring-white"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label
            htmlFor="username"
            className="mb-2 text-sm font-medium text-white"
          >
            Username
          </label>
          <input
            id="username"
            className="border p-2 rounded-md bg-zinc-900/30 focus:outline-none focus:ring-2 focus:ring-white"
            type="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label
            htmlFor="username"
            className="mb-2 text-sm font-medium text-white"
          >
            Password
          </label>
          <div className="relative">
              <input
                id="password"
                className="border p-2 rounded-md bg-zinc-900/30 focus:outline-none focus:ring-2 focus:ring-white w-full pr-10"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-2 flex items-center text-white/70 hover:text-white"
                tabIndex={-1} // avoid stealing focus from input
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          <button
            className="bg-white mt-6 text-black text-sm p-2 rounded-md hover:bg-white/90 transition"
            type="submit"
          >
            Create Account
          </button>
          <p className="text-center text-sm text-white/80">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-bold underline transition-colors hover:text-white"
            >
              Sign in
            </a>
          </p>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>
  </div>
  );
}
