import { Outlet } from "react-router-dom";
import Loader from "./components/loader";

const RootLayout = () => {
  return (
    <div>
      <Loader />
      <Outlet />
    </div>
  );
};

export default RootLayout;
