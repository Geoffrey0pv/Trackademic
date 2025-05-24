// src/pages/auth/LoginPage.jsx
import Login from "../components/Login";

export default function LoginPage() {
  const handleLogin = ({ email, password }) => {
    console.log("Login intentado con:", email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Login onLogin={handleLogin} />
    </div>
  );
}
