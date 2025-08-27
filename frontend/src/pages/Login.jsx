import { useEffect, useState } from "react";
import { loginUser } from "../api.js";
import QuoteBanner from "../components/QuoteBanner.jsx";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.title = "Sign In";
    document.body.style.overflow = "auto"; // Reset overflow on mount
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser(username, password);

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("username", username);

      toast.success("Logged in successfully!", {
        position: "bottom-center",
      });
      onLogin();
    } catch (err) {
      toast.error("Invalid credentials", {
        position: "top-center",
      });
    }
  };

  return (
    <div>
      <QuoteBanner
        quoteData={{
          quote: "Hey, you. You’re finally awake.",
          who: "Ralof",
          game: "Elder Scrolls V: Skyrim",
          bannerUrl:
            "https://images.igdb.com/igdb/image/upload/t_1080p/muv70yw3rds1cw8ymr5v.jpg",
        }}
      />
      <div className="max-w-md mx-auto -mt-[40rem] p-6 bg-white/10 dark:bg-zinc-900/30 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label
              htmlFor="username"
              className="mb-2 text-sm font-medium text-white"
            >
              Username
            </label>
            <input
              id="username"
              className="border p-2 rounded-md bg-zinc-900/30 focus:outline-none focus:ring-2 focus:ring-white"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="password"
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
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <button
            className="bg-white mt-6 text-black text-sm p-2 rounded-md hover:bg-white/90 transition"
            type="submit"
          >
            Sign in
          </button>
          <p className="text-center text-sm text-white/80">
            Not signed in before?{" "}
            <a
              href="/register"
              className="font-bold underline transition-colors hover:text-white"
            >
              Create a free account
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
