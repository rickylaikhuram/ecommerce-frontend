import LandingHeader from "../components/layout/LandingHeader.tsx";
import Footer from "../components/layout/Footer.tsx";
import { Outlet } from "react-router-dom";
const MainLayout = () => {
  return (
    <div>
      <LandingHeader />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
