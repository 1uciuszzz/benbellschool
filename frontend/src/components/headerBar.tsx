import {
  AppBar,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Toolbar,
  Typography,
} from "@mui/material";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { AUTH_API } from "../apis/auth";
import { useUser } from "../stores/user";
import { useLoading } from "../stores/loading";
import { useImmer } from "use-immer";
import { useNavigate } from "react-router-dom";

interface LogOutProps {}

interface LogOutHandles {
  open: () => void;
}

const LogOut = forwardRef<LogOutHandles, LogOutProps>((_, ref) => {
  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
  }));

  const [open, setOpen] = useImmer(false);

  const userStore = useUser();

  const navigate = useNavigate();

  const logOut = () => {
    localStorage.clear();
    userStore.setId("");
    userStore.setName("");
    navigate("/auth");
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>退出登录</DialogTitle>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>取消</Button>
        <Button onClick={logOut}>确定</Button>
      </DialogActions>
    </Dialog>
  );
});

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

  const logOutRef = useRef<LogOutHandles>(null);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          笨钟大学堂
        </Typography>
        <Button onClick={() => logOutRef.current?.open()} color="inherit">
          {userStore.name}
        </Button>
        <LogOut ref={logOutRef} />
      </Toolbar>
    </AppBar>
  );
};

export default HeaderBar;
