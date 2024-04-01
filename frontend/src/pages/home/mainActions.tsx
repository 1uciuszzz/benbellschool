import { useNavigate } from "react-router-dom";
import { ROOMS_API } from "../../apis/rooms";
import CardButton from "../../components/cardButton";
import { useLoading } from "../../stores/loading";

const MainActions = () => {
  const activate = useLoading((state) => state.activate);

  const createRoom = async () => {
    try {
      activate(true);
      const res = await ROOMS_API.CREATE_ROOM();
      navigate(`/rooms/${res.data.id}`);
    } catch {
      console.error("Failed to create room");
    } finally {
      activate(false);
    }
  };

  const navigate = useNavigate();

  const toRoomList = () => {
    navigate("/rooms");
  };

  return (
    <div className="w-full flex space-x-8">
      <CardButton label="创建房间" onClick={createRoom} />
      <CardButton label="房间列表" onClick={toRoomList} />
    </div>
  );
};

export default MainActions;
