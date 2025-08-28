import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AllGames from "./pages/AllGames";
import Home from "./pages/Home";
import Layout from "./components/layout";
import GameDetails from "./pages/GameDetails";
import GameList from "./pages/GameList";
import ProtectedRoute from "./components/ProtectedRoute"; // step 2
import { Toaster } from "react-hot-toast";
import About from "./pages/About";

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#121212ff',
            color: '#f9fafb',
          },
        }}
      />
      <Routes>
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route path="/about" element={<About />} />
            <Route path="/games" element={<AllGames />} />
            <Route path="/gamedetails/:gameid" element={<GameDetails />} />
            <Route path="/list" element={<GameList />} />
            <Route index element={<Home />} />
          </Route>
        </Route>

        {/* Public routes */}
        <Route path="/login" element={<LoginWrapper />} />
        <Route path="/register" element={<RegisterWrapper />} />
      </Routes>
    </BrowserRouter>
  );
}

function LoginWrapper() {
  const navigate = useNavigate();
  return <Login onLogin={() => navigate("/")} />;
}

function RegisterWrapper() {
  const navigate = useNavigate();
  return <Register onRegister={() => navigate("/login")} />;
}

export default App;
