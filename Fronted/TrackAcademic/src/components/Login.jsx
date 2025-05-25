// src/components/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
        setError("Todos los campos son obligatorios.");
        return;
        }

        // Lógica de autenticación simulada (puedes reemplazar con llamada a API)
        onLogin({ email, password });
    };

    return (
        <div className="w-full max-w-md mx-auto p-10 bg-white rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Bienvenido a Track Academic</h1>
            
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Iniciar Sesión</h2>
        {error && <p className="text-red-500 mb-4 text-sm text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
            <label className="block text-gray-600 mb-1" htmlFor="email">Correo electrónico</label>
            <input
                id="email"
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            </div>

            <div>
            <label className="block text-gray-600 mb-1" htmlFor="password">Contraseña</label>
            <input
                id="password"
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            </div>

            <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition duration-200"
            >
            Iniciar Sesión
            </button>
        </form>
        </div>
    );
}
