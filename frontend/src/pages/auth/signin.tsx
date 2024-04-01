import { FormEvent, useEffect } from "react";
import { useLoading } from "../../stores/loading";
import { AUTH_API } from "../../apis/auth";
import { useImmer } from "use-immer";
import { Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SignInPage = () => {
  const activate = useLoading((state) => state.activate);

  const navigate = useNavigate();

  const loading = useLoading((state) => state.active);

  const [name, setName] = useImmer("");

  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      activate(true);
      const res0 = await AUTH_API.SIGN_IN({ name: name });
      localStorage.setItem("token", res0.data.token);
    } catch (e) {
      console.error(e);
    } finally {
      activate(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStorage.getItem("token")]);

  return (
    <div className="m-8">
      <form onSubmit={handleSignIn} className="flex flex-col space-y-8 w-full">
        <Typography variant="h5">用户登录</Typography>
        <TextField
          label="姓名"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button type="submit" variant="contained" disabled={loading}>
          登录
        </Button>
      </form>
    </div>
  );
};

export default SignInPage;
