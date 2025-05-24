// src/layouts/MainLayout.jsx
import { Outlet } from "react-router-dom";
import NavbarDefault from "../components/Navbar";

const MainLayout = () => {
  return (
    <>
      <NavbarDefault />
      <main>
        <Outlet /> {/* Aquí se renderizan las páginas hijas */}
      </main>
    </>
  );
};

export default MainLayout;
