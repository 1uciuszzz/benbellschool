import { FormEvent, useEffect } from "react";
import { useLoading } from "../../stores/loading";
import { AUTH_API } from "../../apis/auth";
import { useImmer } from "use-immer";
import { Alert, Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SignInPage = () => {
  const activate = useLoading((state) => state.activate);

  const navigate = useNavigate();

  const loading = useLoading((state) => state.active);

  const [name, setName] = useImmer("");

  const [error, setError] = useImmer<string | undefined>(undefined);

  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name) {
      setError("姓名不能为空");
      return;
    }
    if (name.length < 2 || name.length > 8) {
      setError("姓名长度应在2-8个字符之间");
      return;
    }
    try {
      activate(true);
      setError(undefined);
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
        <Typography variant="h5">笨钟大学堂</Typography>
        <Typography variant="h5">用户登录</Typography>
        {error ? <Alert severity="error">{error}</Alert> : null}
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
