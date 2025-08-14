import { Navigate, Outlet } from "react-router-dom";

function isTokenValid() {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const [, payload] = token.split(".");
    const decoded = JSON.parse(atob(payload));
    const now = Date.now() / 1000; // current time in seconds
    return decoded.exp && decoded.exp > now;
  } catch (e) {
    console.error("Invalid token format", e);
    return false;
  }
}

export default function ProtectedRoute() {
  const isAuthenticated = isTokenValid();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}
