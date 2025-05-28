// src/pages/auth/LoginPage.jsx
import Login from "../components/Login";

export default function LoginPage() {
  const handleLogin = ({ username, password }) => {
    console.log("Login intentado con:", username, password);

  };

  return (
    <div >
      <Login onLogin={handleLogin} />
    </div>
  );
}