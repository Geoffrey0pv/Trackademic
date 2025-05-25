import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import NavbarDefault from "../components/Navbar";
import Dashboard from "../pages/Dashboard";


const MainLayout = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  const handleLogout = () => {
    // Aquí puedes agregar lógica de logout (limpiar tokens, etc.)
    navigate("/login");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "planes":
        return <div>Planes de evaluación</div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <NavbarDefault 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />
      <main style={{ paddingTop: "80px" }}>
        {renderTabContent()}
      </main>
    </>
  );
};

export default MainLayout;