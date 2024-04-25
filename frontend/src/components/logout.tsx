import { forwardRef, useImperativeHandle } from "react";
import { useImmer } from "use-immer";
import { useUser } from "../stores/user";
import { useNavigate } from "react-router-dom";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";

interface LogOutProps {}

export interface LogOutHandles {
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
    <Dialog fullWidth open={open} onClose={() => setOpen(false)}>
      <DialogTitle>退出登录</DialogTitle>
      <DialogContent className="flex flex-col space-y-4">
        <Button
          variant="contained"
          color="error"
          onClick={() => setOpen(false)}
        >
          取消
        </Button>
        <Button variant="contained" color="success" onClick={logOut}>
          确定
        </Button>
      </DialogContent>
    </Dialog>
  );
});

export default LogOut;
