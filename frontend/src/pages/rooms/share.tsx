import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { forwardRef, useImperativeHandle } from "react";
import { useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import { QRCodeSVG } from "qrcode.react";

interface ShareProps {}

export interface ShareHandles {
  open: () => void;
}

const Share = forwardRef<ShareHandles, ShareProps>((_, ref) => {
  const [open, setOpen] = useImmer<boolean>(false);

  useImperativeHandle(ref, () => {
    return {
      open: () => setOpen(true),
    };
  });

  const { id } = useParams<{ id: string }>();

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>分享房间</DialogTitle>

      <DialogContent className="flex justify-center">
        <QRCodeSVG value={`${location.origin}/rooms/${id}`} />
      </DialogContent>

      <DialogActions className="flex flex-col">
        <Button className="w-full" onClick={() => setOpen(false)}>
          关闭
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default Share;
