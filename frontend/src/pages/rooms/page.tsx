import { useEffect } from "react";
import { useLoading } from "../../stores/loading";
import { ROOMS_API } from "../../apis/rooms";
import { useImmer } from "use-immer";
import { Button, IconButton, Pagination, Typography } from "@mui/material";
import RoomList from "./roomList";
import { useNavigate } from "react-router-dom";
import { ArrowBackIosNew } from "@mui/icons-material";

export interface Room {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

const Rooms = () => {
  const activate = useLoading((state) => state.activate);

  const [rooms, setRooms] = useImmer<Room[]>([]);

  const [total, setTotal] = useImmer<number>(0);

  const [page, setPage] = useImmer<number>(1);

  const [size] = useImmer<number>(10);

  const getRooms = async () => {
    try {
      activate(true);
      const res = await ROOMS_API.GET_ROOMS({ page, size });
      setRooms(res.data.rooms);
      setTotal(res.data.total);
    } catch {
      console.error("Failed to get rooms");
    } finally {
      activate(false);
    }
  };

  useEffect(() => {
    getRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const navigate = useNavigate();

  return (
    <div className="m-8 flex flex-col space-y-8">
      <div className="flex">
        <IconButton onClick={() => navigate(`/`)}>
          <ArrowBackIosNew />
        </IconButton>
        <Typography variant="h4">房间列表</Typography>
      </div>
      <Button onClick={getRooms} variant="contained" color="success">
        刷新数据
      </Button>
      <RoomList rooms={rooms} />

      <Pagination
        size="large"
        count={Math.ceil(total / size)}
        page={page}
        onChange={(_, page) => setPage(page)}
        siblingCount={1}
      />
    </div>
  );
};

export default Rooms;
