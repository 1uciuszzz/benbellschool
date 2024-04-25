import {
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
} from "@mui/material";
import LogOut, { LogOutHandles } from "../../components/logout";
import { useRef } from "react";
import { useUser } from "../../stores/user";

const Account = () => {
  const userStore = useUser();

  const logOutRef = useRef<LogOutHandles>(null);
  return (
    <>
      <div className="m-8 flex flex-col space-y-8">
        <List>
          <ListItem>
            <ListItemButton>
              <ListItemText primary="用户姓名" />
            </ListItemButton>
            <ListItemSecondaryAction>{userStore.name}</ListItemSecondaryAction>
          </ListItem>
        </List>
        <Button onClick={() => logOutRef.current?.open()} color="error">
          退出登录
        </Button>
      </div>

      <LogOut ref={logOutRef} />
    </>
  );
};

export default Account;
