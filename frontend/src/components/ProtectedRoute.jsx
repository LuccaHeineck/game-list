import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const isAuthenticated = !!localStorage.getItem("token"); // or check context

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}
