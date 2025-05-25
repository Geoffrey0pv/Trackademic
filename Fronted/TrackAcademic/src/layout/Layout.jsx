import { Outlet } from "react-router-dom";
import NavbarDefault from "../components/Navbar";
import EvaluationPlans from "../components/evaluationPlans/EvaluationPlans";

const MainLayout = () => {
  return (
  
    <div className="min-h-screen bg-gray-100">
      <NavbarDefault />
      <main className="pt-32 px-8 w-full max-w-none">
        <Outlet /> {  <EvaluationPlans/> /* Aquí se renderizan las páginas hijas */}
      </main>
    </div>
  
  );
};

export default MainLayout;
