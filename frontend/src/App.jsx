import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AllGames from "./pages/AllGames";
import Home from "./pages/Home";
import Layout from "./components/layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route path="/games" element={<AllGames />} />
          <Route index element={<Home />} />
        </Route>
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
