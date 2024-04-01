import { LinearProgress } from "@mui/material";
import { useLoading } from "../stores/loading";

const Loader = () => {
  const loading = useLoading((state) => state.active);

  return (
    <>
      {loading ? (
        <div className="fixed w-full z-50">
          <LinearProgress />
        </div>
      ) : null}
    </>
  );
};

export default Loader;
