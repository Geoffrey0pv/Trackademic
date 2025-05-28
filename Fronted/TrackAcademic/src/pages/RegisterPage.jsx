// src/pages/auth/RegisterPage.jsx
import Register from "../components/Register";

export default function RegisterPage() {
  const handleRegister = (studentData) => {
    console.log("Registro intentado con:", studentData);
  }

  return (
    <div>
      <Register onRegister={handleRegister} />
    </div>
  );
}