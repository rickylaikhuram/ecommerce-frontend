import LandingHeader from "../components/layout/LandingHeader.tsx";
import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/common/ScrollToTop.tsx";
const MainLayout = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <ScrollToTop />
      <LandingHeader />
      <main >
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
