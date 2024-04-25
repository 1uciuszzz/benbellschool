import { AccountCircle, Home, TrendingUp } from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { NavLink } from "react-router-dom";
import { useImmer } from "use-immer";

const BottomNav = () => {
  const [active, setActive] = useImmer<string>("home");

  const handleChange = (value: string) => {
    setActive(value);
  };

  return (
    <BottomNavigation
      className="w-full fixed bottom-0"
      value={active}
      onChange={(_, v) => handleChange(v)}
    >
      <BottomNavigationAction
        label="首页"
        value="home"
        icon={<Home />}
        component={NavLink}
        to="/"
      />
      <BottomNavigationAction
        label="分析"
        value="analysis"
        icon={<TrendingUp />}
        component={NavLink}
        to="/analysis"
      />
      <BottomNavigationAction
        label="我的"
        value="account"
        icon={<AccountCircle />}
        component={NavLink}
        to="/account"
      />
    </BottomNavigation>
  );
};

export default BottomNav;
