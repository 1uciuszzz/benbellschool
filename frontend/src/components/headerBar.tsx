import { AppBar, Toolbar, Typography } from "@mui/material";
import { useEffect } from "react";
import { AUTH_API } from "../apis/auth";
import { useUser } from "../stores/user";
import { useLoading } from "../stores/loading";

const HeaderBar = () => {
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
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          笨钟大学堂
        </Typography>
        <Typography variant="body1">{userStore.name}</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderBar;
