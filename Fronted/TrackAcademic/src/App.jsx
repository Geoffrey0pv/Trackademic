// src/App.jsx o src/routes.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MainLayout from "./layout/Layout";
function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas que usan el layout con Navbar */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<h1>Home</h1>} />
          <Route path="/about" element={<h1>About</h1>} />
          <Route path="/contact" element={<h1>Contact</h1>} />
          {/* Otras rutas que necesiten el layout */}
        </Route>

        {/* Rutas que NO usan Navbar */}
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
