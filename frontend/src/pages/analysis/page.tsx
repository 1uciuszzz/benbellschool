import { useImmer } from "use-immer";
import {
  ACHIEVEMENTS_API,
  Achievement,
  StatusData,
} from "../../apis/achievements";
import { useLoading } from "../../stores/loading";
import AchievementsList from "./achievementsList";
import { useEffect } from "react";
import { Pagination } from "@mui/material";
import Status from "./status";

const Analysis = () => {
  const activate = useLoading((state) => state.activate);

  const [achievements, setAchievements] = useImmer<Achievement[]>([]);

  const [total, setTotal] = useImmer<number>(0);

  const [page, setPage] = useImmer<number>(1);

  const [size] = useImmer<number>(10);

  const getAchievements = async () => {
    try {
      activate(true);
      const res = await ACHIEVEMENTS_API.GET({ page, size });
      setAchievements(res.data.achievements);
      setTotal(res.data.total);
    } catch {
      console.error("Failed to get achievements");
    } finally {
      activate(false);
    }
  };

  const [status, setStatus] = useImmer<StatusData>({
    total: 0,
    winCount: 0,
    winRate: 0,
  });

  const getStatus = async () => {
    try {
      activate(true);
      const res = await ACHIEVEMENTS_API.STATUS();
      setStatus(res.data);
    } catch {
      console.error("Failed to get status");
    } finally {
      activate(false);
    }
  };

  useEffect(() => {
    getStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAchievements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <>
      <div className="m-8 flex flex-col space-y-8">
        <Status data={status} />

        <AchievementsList data={achievements} />

        <Pagination
          count={Math.ceil(total / size)}
          page={page}
          onChange={(_, value) => setPage(value)}
          siblingCount={1}
          size="large"
        />
      </div>
    </>
  );
};

export default Analysis;
