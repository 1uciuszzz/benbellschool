import { FormEvent } from "react";
import { useLoading } from "../../stores/loading";
import { AUTH_API } from "../../apis/auth";
import { useImmer } from "use-immer";
import { Button, TextField, Typography } from "@mui/material";

const SignInPage = () => {
  const activate = useLoading((state) => state.activate);

  const loading = useLoading((state) => state.active);

  const [username, setUsername] = useImmer("");

  const [password, setPassword] = useImmer("");

  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      activate(true);
      const res0 = await AUTH_API.SIGN_IN({ username, password });
      localStorage.setItem("token", res0.data.token);
      await AUTH_API.USER_INFO();
    } catch (e) {
      console.error(e);
    } finally {
      activate(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSignIn} className="flex flex-col space-y-8 w-96">
        <Typography variant="h6">用户登录</Typography>
        <TextField
          label="用户名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" disabled={loading}>
          登录
        </Button>
      </form>
    </div>
  );
};

export default SignInPage;
