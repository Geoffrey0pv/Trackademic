import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MainLayout from "./layout/Layout";
import Dashboard from "./pages/Dashboard";
import RegisterPage from "./pages/RegisterPage";
import ProtectedLayout from "./layout/protectedLayout";




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedLayout/>}>
          <Route element={<MainLayout/>}>
            <Route path="/" element={<Dashboard />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

/*

*/