import { useEffect } from "react";
import { useLoading } from "../../stores/loading";
import { ROOMS_API } from "../../apis/rooms";
import { useImmer } from "use-immer";
import { Button, IconButton, Typography } from "@mui/material";
import RoomList from "./roomList";
import { useNavigate } from "react-router-dom";

export interface Room {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
}

const Rooms = () => {
  const activate = useLoading((state) => state.activate);

  const [rooms, setRooms] = useImmer<Room[]>([]);

  const getRooms = async () => {
    try {
      activate(true);
      const res = await ROOMS_API.GET_ROOMS();
      setRooms(res.data);
    } catch {
      console.error("Failed to get rooms");
    } finally {
      activate(false);
    }
  };

  useEffect(() => {
    getRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigate = useNavigate();

  return (
    <div className="m-8 flex flex-col space-y-8">
      <div className="flex">
        <IconButton onClick={() => navigate(`/`)}>👈</IconButton>
        <Typography variant="h4">房间列表</Typography>
      </div>
      <Button onClick={getRooms} variant="contained" color="success">
        刷新数据
      </Button>
      <RoomList rooms={rooms} />
    </div>
  );
};

export default Rooms;
