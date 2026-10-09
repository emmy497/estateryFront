import { NavLink } from "react-router-dom";
import Button from "./Button";

const NoProperties = () => {
  return (
    <div className="w-full">
      <div className=" w-[486px] h-[343px] flex flex-col justify-center items-center mx-auto mb-[230px] mt-[80px]">
        <button className=" bg-[#C4C0C0] p-[41px] rounded-full mb-[25px]">
          <img
            className="h-[48px] w-[48px]"
            src="/images/savedHeart.png"
            alt=""
          />
        </button>

        <h1 className="text-[28px]">You haven't saved any Properties yet.</h1>

        <p className="text-[18px] text-[#403F3F] mt-[8px] w-[458px] text-center">
          Find Properties you love and tap the  to save them here
        </p>

        <div className="w-[173px] h-[47px] mt-[30px]">
          <NavLink to="/properties">
            <Button title="Start Exploring" />
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default NoProperties;
