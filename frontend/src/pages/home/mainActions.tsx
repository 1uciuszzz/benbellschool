import { useNavigate } from "react-router-dom";
import { ROOMS_API } from "../../apis/rooms";
import CardButton from "../../components/cardButton";
import { useLoading } from "../../stores/loading";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useImmer } from "use-immer";

interface CreateRoomProps {}

interface CreateRoomHandles {
  open: () => void;
}

const CreateRoom = forwardRef<CreateRoomHandles, CreateRoomProps>((_, ref) => {
  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
  }));

  const [open, setOpen] = useImmer(false);

  const activate = useLoading((state) => state.activate);

  const navigate = useNavigate();

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

  return (
    <Dialog fullWidth open={open} onClose={() => setOpen(false)}>
      <DialogTitle>确定创建房间吗</DialogTitle>
      <DialogContent className="flex flex-col space-y-4">
        <Button variant="contained" color="success" onClick={createRoom}>
          确定
        </Button>
        <Button
          variant="contained"
          color="warning"
          onClick={() => setOpen(false)}
        >
          取消
        </Button>
      </DialogContent>
    </Dialog>
  );
});

const MainActions = () => {
  const navigate = useNavigate();

  const toRoomList = () => {
    navigate("/rooms");
  };

  const CreateRoomRef = useRef<CreateRoomHandles>(null);

  return (
    <div className="w-full flex space-x-8">
      <CreateRoom ref={CreateRoomRef} />
      <CardButton
        label="创建房间"
        onClick={() => CreateRoomRef.current?.open()}
      />
      <CardButton label="房间列表" onClick={toRoomList} />
    </div>
  );
};

export default MainActions;
