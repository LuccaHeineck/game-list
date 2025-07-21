import { useState } from "react";
import { loginUser } from "../api.js";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginUser(username, password);
      console.log(username, password);

      localStorage.setItem("token", data.token);       // Save the token
      localStorage.setItem("username", username);      // Save the username too

      onLogin(); // e.g. redirect to /games or refresh layout
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          className="border p-2 rounded"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="border p-2 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          type="submit"
        >
          Login
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}
