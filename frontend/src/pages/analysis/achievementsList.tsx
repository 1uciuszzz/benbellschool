import {
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { Achievement } from "../../apis/achievements";

interface AchievementsListProps {
  data: Achievement[];
}

const AchievementsList = ({ data }: AchievementsListProps) => {
  return (
    <List subheader="历史战绩">
      {data.map((item) => {
        return (
          <ListItem disablePadding key={item.id}>
            <ListItemIcon>
              <Chip
                className="w-16"
                label={item.winNumber}
                color={
                  item.winNumber > 0
                    ? "success"
                    : item.winNumber == 0
                      ? "info"
                      : "error"
                }
              />
            </ListItemIcon>
            <ListItemButton>
              <ListItemText
                primary={
                  <div>
                    <Typography variant="body2">{item.roomName}</Typography>
                    <Typography variant="caption">{item.date}</Typography>
                  </div>
                }
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};

export default AchievementsList;
