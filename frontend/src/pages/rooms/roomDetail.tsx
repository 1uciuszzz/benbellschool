import { useLoading } from "../../stores/loading";
import { Expenditure, ROOMS_API, User, UserStats } from "../../apis/rooms";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useImmer } from "use-immer";
import { Room } from "./page";
import {
  Button,
  Card,
  CardContent,
  IconButton,
  Typography,
} from "@mui/material";
import { useUser } from "../../stores/user";

const RoomDetail = () => {
  const { id } = useParams();

  const location = useLocation();

  const userId = useUser((state) => state.id);

  const activate = useLoading((state) => state.activate);

  const [users, setUsers] = useImmer<User[]>([]);

  const [expenditureStats, setExpenditureStats] = useImmer<UserStats[]>([]);

  const [room, setRoom] = useImmer<Room | undefined>(undefined);

  const [expenditures, setExpenditures] = useImmer<Expenditure[]>([]);

  const getRoomDetail = async () => {
    try {
      activate(true);
      const res = await ROOMS_API.ROOM_DETAIL(id as string);
      setRoom(res.data.room);
      setUsers(res.data.roomUsers);
      setExpenditureStats(res.data.expenditureStats);
      setExpenditures(res.data.expenditures);
    } catch {
      console.error("Failed to get room detail");
    } finally {
      activate(false);
    }
  };

  useEffect(() => {
    getRoomDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const navigate = useNavigate();

  const callPayForm = (payeeId: string) => {
    navigate(`/rooms/${id}/pay/${payeeId}`);
  };

  const joinRoom = async () => {
    try {
      activate(true);
      await ROOMS_API.JOIN_ROOM(id as string);
      await getRoomDetail();
    } catch {
      console.error("Failed to join room");
    } finally {
      activate(false);
    }
  };

  return (
    <div className="m-4 flex flex-col space-y-8">
      <div className="flex items-center">
        <IconButton onClick={() => navigate(`/rooms`)}>👈</IconButton>
        <Typography variant="h4">房间详情</Typography>
      </div>

      <Button onClick={getRoomDetail} variant="contained" color="success">
        刷新数据
      </Button>

      {users.find((user) => user.id == userId) ? null : (
        <Button variant="contained" onClick={joinRoom}>
          加入房间
        </Button>
      )}

      <Card>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <Typography variant="body1">{room?.name}</Typography>
            <div className="grid grid-cols-2 gap-4">
              {users.map((user) => {
                return (
                  <Button
                    key={user.id}
                    variant="outlined"
                    className="flex flex-col justify-center items-center"
                    onClick={() => callPayForm(user.id)}
                  >
                    <Typography variant="body1">{user.name}</Typography>
                    <Typography variant="body2">
                      {
                        expenditureStats.find((stat) => stat.userId == user.id)
                          ?.amount
                      }
                    </Typography>
                  </Button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {expenditures.length ? (
        <div className="flex flex-col space-y-2">
          {expenditures.map((expenditure) => {
            return (
              <Card>
                <CardContent>
                  <div className="flex flex-col space-y-1">
                    <Typography key={expenditure.id} variant="body1">
                      {
                        users.find((user) => user.id == expenditure.payerId)
                          ?.name
                      }
                      付给
                      {
                        users.find((user) => user.id == expenditure.payeeId)
                          ?.name
                      }{" "}
                      {expenditure.amount}元
                    </Typography>
                    <p className="font-mono font-sm">
                      {new Date(expenditure.createAt).toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : null}

      <Outlet />
    </div>
  );
};

export default RoomDetail;
