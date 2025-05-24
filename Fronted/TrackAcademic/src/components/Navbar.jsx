import React, { useState } from "react";
import {
    HomeIcon,
    BookOpenIcon,
    InformationCircleIcon,
    ChatBubbleLeftIcon,
    Bars3Icon,
} from "@heroicons/react/24/outline";


const links = [
    { name: "Dashboard", href: "#", icon: HomeIcon },
    { name: "Planes de evaluación", href: "#", icon: BookOpenIcon },
    { name: "Gestión de notas", href: "#", icon: Bars3Icon },
    { name: "Colaborar", href: "#", icon: ChatBubbleLeftIcon },
];

// Simulación de usuario
const user = {
    name: "Raul Quigua",
    avatar: "https://ui-avatars.com/api/?name=Raul+Quigua&background=8b5cf6&color=fff",
};

const Navbar = () => {
    const [active, setActive] = useState(0);

    return (
        <nav className="bg-white shadow-lg fixed w-full z-50" style={{ minHeight: "80px" }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <span className="font-extrabold text-3xl tracking-tight text-purple-700 drop-shadow">
                            Track
                            <span className="text-purple-400">Academic</span>
                        </span>
                    </div>
                    {/* Button */}
                    <div className="hidden md:flex items-center">
                        <img
                            src={user.avatar}
                            alt="avatar"
                            className="w-8 h-8 rounded-full mr-2 border-2 border-purple-400"
                        />
                        <span className="mr-4 font-medium text-purple-700">{user.name}</span>
                        <button className="bg-purple-600 text-white font-bold px-5 py-2 rounded-full shadow hover:bg-purple-700 transition duration-200 flex items-center">
                            Cerrar sesión
                        </button>
                    </div>
                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            type="button"
                            className="text-purple-700 hover:text-purple-400 focus:outline-none"
                        >
                            <svg
                                className="h-7 w-7"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            {/* Navigation links at the bottom left */}
            <div className="fixed bottom-0 left-0 w-full md:w-auto md:static bg-white shadow-lg md:shadow-none z-40">
                <div className="flex md:justify-center justify-center md:pl-8 space-x-8 py-4">
                    {links.map((link, idx) => (
                        <button
                            key={link.name}
                            onClick={() => setActive(idx)}
                            className="relative text-purple-700 font-medium px-2 py-1 focus:outline-none transition-colors duration-200 flex items-center"
                        >
                            <link.icon className="w-5 h-5 mr-1" />
                            <span
                                className={`${
                                    active === idx
                                        ? "text-purple-800"
                                        : "text-purple-500"
                                }`}
                            >
                                {link.name}
                            </span>
                            {/* Animated underline */}
                            <span
                                className={`absolute left-0 -bottom-1 w-full h-1 rounded transition-all duration-300 ${
                                    active === idx
                                        ? "bg-purple-600 shadow-md"
                                        : "bg-transparent"
                                }`}
                            ></span>
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;