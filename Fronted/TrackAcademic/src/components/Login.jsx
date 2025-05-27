import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import {loginStudent} from "../services/studentServices";

export default function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const {setUser} = useContext(UserContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!username || !password) {
            setError("Todos los campos son obligatorios.");
        return;
        }
        try {
            const user = await loginStudent(username, password);
            if (user) {
            setUser(user);
            } else {
            setError("Credenciales incorrectas.");
            }
        } catch (error) {
            setError("Error de conexión.");
        }
        
       
        onLogin({ username, password });
    };

    return (
        <div className="w-full max-w-md mx-auto p-10 bg-white rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Bienvenido a Track Academic</h1>
            
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Iniciar Sesión</h2>
        {error && <p className="text-red-500 mb-4 text-sm text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
            <label className="block text-gray-600 mb-1" htmlFor="username">Nombre de Usuario</label>
            <input
                id="username"
                type="username"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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