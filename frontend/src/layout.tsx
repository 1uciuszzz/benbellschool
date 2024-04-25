import { Outlet } from "react-router-dom";
import Loader from "./components/loader";
import HeaderBar from "./components/headerBar";
import BottomNav from "./components/bottomNav";
import { useUser } from "./stores/user";
import { useLoading } from "./stores/loading";
import { AUTH_API } from "./apis/auth";
import { useEffect } from "react";

const RootLayout = () => {
  const userStore = useUser();

  const activate = useLoading((state) => state.activate);

  const getUser = async () => {
    try {
      activate(true);
      const res = await AUTH_API.USER_INFO();
      userStore.setId(res.data.id);
      userStore.setName(res.data.name);
    } catch {
      console.error("Failed to get user info");
    } finally {
      activate(false);
    }
  };

  useEffect(() => {
    if (!userStore.id || !userStore.name) {
      getUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Loader />
      <HeaderBar />
      <Outlet />
      <div className="h-14"></div>
      <BottomNav />
    </div>
  );
};

export default RootLayout;
