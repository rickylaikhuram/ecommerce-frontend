import LandingHeader from "../components/layout/LandingHeader.tsx";
import { Outlet } from "react-router-dom";
const MainLayout = () => {
  return (
    <div>
      <LandingHeader />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
