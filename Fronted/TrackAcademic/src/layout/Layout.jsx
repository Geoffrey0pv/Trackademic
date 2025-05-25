import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarDefault from "../components/Navbar";
import EvaluationPlans from "../components/evaluationPlans/EvaluationPlans";

const MainLayout = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <div className="p-8 text-gray-700 mt-40">Bienvenido al Dashboard</div>;
      case "planes":
        return <EvaluationPlans />;
      case "notas":
        return <div className="p-8 text-gray-700 mt-40">Gestión de Notas</div>;
      case "colaborar":
        return <div className="p-8 text-gray-700 mt-40">Colaborar</div>;
      default:
        return <div className="p-8 text-gray-700 mt-40">Página no encontrada</div>;
    }
  };

  return (
    <>
      <NavbarDefault activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      <main style={{ paddingTop: "80px" }}>
        {renderTabContent()}
      </main>
    </>
  );
};

export default MainLayout;