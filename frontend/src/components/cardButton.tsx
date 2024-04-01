import { Card, CardActionArea, CardContent, Typography } from "@mui/material";

interface CardButtonProps {
  label: string;
  onClick?: () => void;
}

const CardButton = ({ label, onClick }: CardButtonProps) => {
  return (
    <Card className="w-full">
      <CardActionArea onClick={onClick}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {label}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CardButton;
