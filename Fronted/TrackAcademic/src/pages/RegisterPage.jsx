// src/pages/auth/RegisterPage.jsx
import Register from "../components/Register";

export default function RegisterPage() {
  const handleRegister = ({ firstName, lastName, email, password }) => {
    console.log("Registro intentado con:", {
      firstName,
      lastName,
      email,
      password: "***" // No loggear la contraseña real por seguridad
    });
    
    // Aquí puedes agregar la lógica para enviar los datos al servidor
    // Por ejemplo:
    // const userData = { firstName, lastName, email, password };
    // registerUser(userData);
  };

  return (
    <div>
      <Register onRegister={handleRegister} />
    </div>
  );
}