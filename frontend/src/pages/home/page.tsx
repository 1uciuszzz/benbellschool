import MainActions from "./mainActions";
import bannerURL from "../../assets/banner.svg";
import FooterBar from "../../components/footerBar";

const HomePage = () => {
  return (
    <div className="m-8 flex flex-col space-y-8">
      <MainActions />

      <img className="flex-1" src={bannerURL} />

      <FooterBar />
    </div>
  );
};

export default HomePage;
