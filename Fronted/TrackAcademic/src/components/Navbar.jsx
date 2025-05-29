// src/components/Navbar.jsx
import React, { useContext } from "react";
import {
  HomeIcon,
  BookOpenIcon,
  Bars3Icon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const links = [
  { name: "Dashboard", icon: HomeIcon, key: "dashboard" },
  { name: "Planes de evaluación", icon: BookOpenIcon, key: "planes" },
  { name: "Gestión de notas", icon: Bars3Icon, key: "notas" },
  { name: "Colaborar", icon: ChatBubbleLeftIcon, key: "colaborar" },
];

const Navbar = ({ activeTab, setActiveTab, onLogout }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50" style={{ minHeight: "80px" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <span className="font-extrabold text-3xl tracking-tight text-purple-700 drop-shadow">
              Track<span className="text-purple-400">Academic</span>
            </span>
          </div>

          {/* User Info / Auth */}
          <div className="hidden md:flex items-center">
            {user ? (
              <>
                <span className="mr-4 font-medium text-purple-700"> Bienvenido {user.username}</span>
                <button
                  onClick={onLogout}
                  className="bg-purple-600 text-white font-bold px-5 py-2 rounded-full shadow hover:bg-purple-700 transition duration-200 flex items-center"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="text-purple-700 font-medium hover:text-purple-500"
              >
                Iniciar sesión
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="text-purple-700 hover:text-purple-400 focus:outline-none"
              onClick={() => navigate(user ? "/" : "/login")}
            >
              <Bars3Icon className="h-7 w-7" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom tab navigation */}
      <div className="fixed bottom-0 left-0 w-full md:w-auto md:static bg-white shadow-lg md:shadow-none z-40">
        <div className="flex md:justify-center justify-center md:pl-8 space-x-8 py-4">
          {links.map((link) => (
            <button
              key={link.key}
              onClick={() => handleTabChange(link.key)}
              className={`relative font-medium px-2 py-1 focus:outline-none transition-colors duration-200 flex items-center ${
                activeTab === link.key
                  ? "text-purple-800"
                  : "text-purple-500 hover:text-purple-700"
              }`}
            >
              <link.icon className="w-5 h-5 mr-1" />
              <span>{link.name}</span>
              <span
                className={`absolute left-0 -bottom-1 w-full h-1 rounded transition-all duration-300 ${
                  activeTab === link.key ? "bg-purple-600 shadow-md" : "bg-transparent"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
