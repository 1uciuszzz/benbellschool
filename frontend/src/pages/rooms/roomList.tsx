import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { Room } from "./page";
import { useNavigate } from "react-router-dom";

interface RoomItemProps {
  room: Room;
}

const RoomItem = ({ room }: RoomItemProps) => {
  const navigate = useNavigate();

  const handleRoomClick = () => {
    navigate(`/rooms/${room.id}`);
  };

  return (
    <Card>
      <CardActionArea onClick={handleRoomClick}>
        <CardContent>
          <div>
            <Typography variant="body1">{room.name}</Typography>
            <Typography variant="body1">
              {new Date(room.createdAt).toLocaleString()}
            </Typography>
            <Typography variant="body1" color={room.active ? "green" : "red"}>
              {room.active ? "进行中" : "已关闭"}
            </Typography>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

interface RoomListProps {
  rooms: Room[];
}

const RoomList = ({ rooms }: RoomListProps) => {
  return (
    <div className="flex flex-col space-y-4">
      {rooms.map((room) => {
        return <RoomItem key={room.id} room={room} />;
      })}
    </div>
  );
};

export default RoomList;
