import { Outlet } from "react-router-dom";
import Loader from "../../components/loader";

const AuthLayout = () => {
  return (
    <div>
      <Loader />
      <Outlet />
    </div>
  );
};

export default AuthLayout;
