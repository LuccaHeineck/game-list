import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AllGames from "./pages/AllGames";
import Home from "./pages/Home";
import Layout from "./components/layout";
import GameDetails from "./pages/GameDetails";
import GameList from "./pages/GameList";
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
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="games" element={<AllGames />} />
          <Route path="gamedetails/:gameid" element={<GameDetails />} />
          <Route path="list" element={<GameList />} />
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
  const location = useLocation();
  const destination = location.state?.from || "/";

  return <Login onLogin={() => navigate(destination, { replace: true })} />;
}

function RegisterWrapper() {
  const navigate = useNavigate();
  return <Register onRegister={(state) => navigate("/login", { replace: true, state })} />;
}

export default App;
