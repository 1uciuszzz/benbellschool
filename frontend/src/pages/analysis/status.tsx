import { Card, CardContent, Divider, Typography } from "@mui/material";

interface StatusProps {
  data: { total: number; winCount: number; winRate: number };
}

const Status = ({ data }: StatusProps) => {
  return (
    <div className="flex flex-col space-y-4">
      <Typography variant="h5">统计数据</Typography>
      <Card>
        <CardContent>
          <div className="flex justify-evenly">
            <div className="flex flex-col items-center">
              <Typography variant="h6">总场次</Typography>
              <Typography variant="body1">{data.total}</Typography>
            </div>
            <Divider orientation="vertical" flexItem />
            <div className="flex flex-col items-center">
              <Typography variant="h6">胜场数</Typography>
              <Typography variant="body1">{data.winCount}</Typography>
            </div>
            <Divider orientation="vertical" flexItem />
            <div className="flex flex-col items-center">
              <Typography variant="h6">胜率</Typography>
              <Typography variant="body1">{data.winRate}%</Typography>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Status;
