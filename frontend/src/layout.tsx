import { Outlet } from "react-router-dom";
import Loader from "./components/loader";
import HeaderBar from "./components/headerBar";

const RootLayout = () => {
  return (
    <div>
      <Loader />
      <HeaderBar />
      <Outlet />
    </div>
  );
};

export default RootLayout;
