import {
  Button,
  Dialog,
  DialogContent,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import { useLoading } from "../../stores/loading";
import { EXPENDITURES_API } from "../../apis/expenditures";
import { ROOMS_API, User } from "../../apis/rooms";
import { useEffect } from "react";

const PayForm = () => {
  const activate = useLoading((state) => state.activate);

  const { id, payeeId } = useParams();

  const [amount, setAmount] = useImmer<string | undefined>(undefined);

  const navigate = useNavigate();

  const pay = async () => {
    if (!amount) return;
    if (!Number.isSafeInteger(+amount)) return;
    if (+amount <= 0) return;
    try {
      activate(true);
      if (amount === undefined) return;
      await EXPENDITURES_API.CREATE_EXPENDITURE(
        id as string,
        payeeId as string,
        +amount
      );
      navigate(`/rooms/${id}`);
    } catch {
      console.error("Failed to pay");
    } finally {
      activate(false);
    }
  };

  const [users, setUsers] = useImmer<User[]>([]);

  const getUsers = async () => {
    try {
      activate(true);
      const res = await ROOMS_API.GET_USERS(id as string);
      setUsers(res.data);
    } catch {
      console.error("Failed to get users");
    } finally {
      activate(false);
    }
  };

  useEffect(() => {
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dialog open>
      <DialogContent className="flex flex-col space-y-4">
        <Typography variant="h5">
          支付给{users.find((user) => user.id == payeeId)?.name}
        </Typography>
        <TextField
          label="支出"
          value={amount}
          type="number"
          autoFocus
          onChange={(e) => setAmount(e.target.value || undefined)}
        />
        <Button variant="contained" onClick={pay}>
          确定
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => navigate(`/rooms/${id}`)}
        >
          取消
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default PayForm;
